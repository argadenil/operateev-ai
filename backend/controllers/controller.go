// Package controllers holds HTTP handler logic.
package controllers

import (
	"fmt"
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

	var user models.UserInfo
	var valid bool

	// Map of role -> query
	roleQueries := map[string]string{
		"superadmin": `SELECT id, name, password_hash FROM "operateevSchema"."superadmin" WHERE username=$1 AND status='active'`,
		"admin":      `SELECT id, name, password_hash FROM "operateevSchema"."admin" WHERE username=$1 AND status='active'`,
		"customer":   `SELECT id, name, password_hash FROM "operateevSchema"."customer" WHERE username=$1 AND status='active'`,
	}
	for role, query := range roleQueries {
		switch role {
		case "superadmin":
			err := db.Conn.QueryRow(query, req.Username).Scan(&user.ID, &user.DisplayName, &user.PasswordHash)
			if err == nil {
				user.Role = role
				valid = checkPassword(user.PasswordHash, req.Password, user.ID, role)
			}
		case "admin":
			err := db.Conn.QueryRow(query, req.Username).Scan(&user.ID, &user.DisplayName, &user.PasswordHash)
			if err == nil {
				user.Role = role
				valid = checkPassword(user.PasswordHash, req.Password, user.ID, role)
			}
		case "customer":
			err := db.Conn.QueryRow(query, req.Username).Scan(&user.ID, &user.DisplayName, &user.PasswordHash)
			if err == nil {
				user.Role = role
				valid = checkPassword(user.PasswordHash, req.Password, user.ID, role)
			}

		}
		if valid {
			break
		}
	}

	if !valid {
		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "invalid credentials"})
	}

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "token generation failed"})
	}
	var roleMap = map[string]string{
		"superadmin": "Super Admin",
		"admin":      "Admin",
		"customer":   "Customer",
	}
	user.Role = roleMap[user.Role]
	return c.JSON(http.StatusOK, models.LoginResponse{
		Token:       tokenString,
		CustomerID:  user.CustomerID,
		DisplayName: user.DisplayName,
		Role:        user.Role,
	})
}

func checkPassword(hash, password string, userID int, table string) bool {
	if strings.HasPrefix(hash, "$2a$") || strings.HasPrefix(hash, "$2b$") || strings.HasPrefix(hash, "$2y$") {
		return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
	}

	if hash == password {
		if newHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost); err == nil {
			_, _ = db.Conn.Exec(
				fmt.Sprintf(`UPDATE "operateevSchema"."%s" SET password_hash=$1 WHERE id=$2`, table),
				string(newHash), userID,
			)
		}
		return true
	}
	return false
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
	rows, err := db.Conn.Query(`
        SELECT admin_name
        FROM "operateevSchema"."admin"
    `)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"error": "failed to query dashboard data",
		})
	}
	defer rows.Close()

	// Collect admin names
	var admins []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{
				"error": "failed to read row",
			})
		}
		admins = append(admins, name)
	}
	var summary = map[string]int{
		"total_admins": len(admins),
	}
	return c.JSON(http.StatusOK, echo.Map{
		"resources": admins,
		"summary":   summary,
	})
}
