// Package controllers holds HTTP handler logic.
package controllers

import (
	"context"
	"net/http"
	"operateev/db"
	"operateev/models"
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
	// 1. Get customer_id from URL
	customerID := c.Param("customer_id")
	print(customerID)

	// If no customer_id in URL
	if customerID == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "customer_id is required"})
	}

	// 2. Query database
	rows, err := db.Conn.Query(`
		SELECT id, gpu, memory_gb, cluster, status, uptime_sec, temperature_c, power_w, processes 
		FROM "usersSchema"."dashboard_resources"
		WHERE customer_id = $1
	`, customerID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "cannot load data"})
	}
	defer rows.Close()

	// 3. Collect resources
	var resources []models.DashboardResource
	var totalPower int

	for rows.Next() {
		var r models.DashboardResource
		if err := rows.Scan(&r.ID, &r.GPU, &r.MemoryGB, &r.Cluster, &r.Status,
			&r.UptimeSec, &r.Temperature, &r.PowerW, &r.Processes); err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "scan failed"})
		}
		resources = append(resources, r)
		totalPower += r.PowerW
	}

	// 4. Build summary
	summary := models.DashboardSummary{
		Total:    len(resources),
		Running:  0,
		Idle:     0,
		AvgPower: 0,
	}

	for _, r := range resources {
		if r.Status == "running" {
			summary.Running++
		} else if r.Status == "idle" {
			summary.Idle++
		}
	}
	if summary.Total > 0 {
		summary.AvgPower = totalPower / summary.Total
	}
	if resources == nil {
		resources = []models.DashboardResource{}
	}

	// 5. Always return resources (even empty) + summary
	return c.JSON(http.StatusOK, models.DashboardResponse{
		Resources: resources, // will be [] if no rows
		Summary:   summary,   // will be all zeros
	})
}
