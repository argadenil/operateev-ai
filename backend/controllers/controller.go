// Package controllers holds HTTP handler logic.
package controllers

import (
	"context"
	"net/http"
	"operateev/db"
	"operateev/models"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("dev-change-me")

func JwtSecret() []byte { return jwtSecret }

func Login(c echo.Context) error {
	req := new(models.LoginRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid input"})
	}
	if req.Username == "" || req.Password == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "username and password required"})
	}

	var user models.User
	var passwordHash string
	err := db.Conn.QueryRowContext(
		context.Background(),
		`SELECT id, username, email, password_hash FROM "usersSchema"."users" WHERE username=$1`,
		strings.TrimSpace(req.Username),
	).Scan(&user.ID, &user.Username, &user.Email, &passwordHash)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "The username or password you entered is incorrect."})
	}

	valid := false
	// Detect bcrypt hash by prefix
	if strings.HasPrefix(passwordHash, "$2a$") || strings.HasPrefix(passwordHash, "$2b$") || strings.HasPrefix(passwordHash, "$2y$") {
		if bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)) == nil {
			valid = true
		}
	} else {
		// Legacy plain text fallback
		if passwordHash == req.Password {
			valid = true
			// Upgrade to bcrypt hash
			if newHash, hErr := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost); hErr == nil {
				_, _ = db.Conn.ExecContext(context.Background(),
					`UPDATE "usersSchema"."users" SET password_hash=$1 WHERE id=$2`,
					string(newHash), user.ID)
			}
		}
	}

	if !valid {
		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "The username or password you entered is incorrect."})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "token generation failed"})
	}

	return c.JSON(http.StatusOK, models.LoginResponse{Token: tokenString})
}

func Logout(c echo.Context) error {
	authHeader := c.Request().Header.Get("Authorization")
	if authHeader == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "missing Authorization header"})
	}
	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || parts[1] == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid Authorization header"})
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "logged out"})
}

func GetDashboard(c echo.Context) error {
	// Preferred: path parameter /dashboard/:customer_id
	customerID := strings.TrimSpace(c.Param("customer_id"))

	// Fallback: context set by auth middleware (uses key user_id)
	if customerID == "" {
		if uidVal := c.Get("user_id"); uidVal != nil {
			switch v := uidVal.(type) {
			case int:
				customerID = strconv.Itoa(v)
			case int64:
				customerID = strconv.FormatInt(v, 10)
			case float64: // JSON numbers sometimes float64
				customerID = strconv.Itoa(int(v))
			case string:
				customerID = v
			}
		}
	}
	if customerID == "" {
		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "unauthorized"})
	}

	// Timeout to avoid hanging DB calls
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	rows, err := db.Conn.QueryContext(
		ctx,
		`SELECT id, gpu, memory_gb, cluster, status, uptime_sec, temperature_c, power_w, processes 
		 FROM "usersSchema"."dashboard_resources" 
		 WHERE customer_id = $1`,
		customerID,
	)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to load resources: " + err.Error()})
	}
	defer rows.Close()

	var (
		resources  []models.DashboardResource
		totalPower int
	)
	for rows.Next() {
		var r models.DashboardResource
		if err := rows.Scan(&r.ID, &r.GPU, &r.MemoryGB, &r.Cluster, &r.Status, &r.UptimeSec, &r.Temperature, &r.PowerW, &r.Processes); err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "scan failed: " + err.Error()})
		}
		resources = append(resources, r)
		totalPower += r.PowerW
	}
	if err := rows.Err(); err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "iteration failed: " + err.Error()})
	}

	summary := models.DashboardSummary{Total: len(resources)}
	for _, r := range resources {
		switch strings.ToLower(r.Status) {
		case "running":
			summary.Running++
		case "idle":
			summary.Idle++
		}
	}
	if summary.Total > 0 {
		summary.AvgPower = totalPower / summary.Total
	}

	return c.JSON(http.StatusOK, models.DashboardResponse{Resources: resources, Summary: summary})
}
