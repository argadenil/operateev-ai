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

// GetAdmins returns all admins (id, name, status)
func GetAdmins(c echo.Context) error {
	rows, err := db.Conn.Query(`
		SELECT id, admin_name, status FROM "operateevSchema"."admin"
	`)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"error": "failed to query admins",
		})
	}
	defer rows.Close()

	type Admin struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Status string `json:"status"`
	}
	var admins []Admin
	for rows.Next() {
		var a Admin
		if err := rows.Scan(&a.ID, &a.Name, &a.Status); err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{
				"error": "failed to read row",
			})
		}
		admins = append(admins, a)
	}
	return c.JSON(http.StatusOK, echo.Map{
		"admins": admins,
		"total":  len(admins),
	})
}

// GetAdminByID returns a single admin by ID
func GetAdminByID(c echo.Context) error {
	adminId := c.Param("adminId")
	row := db.Conn.QueryRow(`SELECT id, admin_name, status FROM "operateevSchema"."admin" WHERE id=$1`, adminId)
	var a struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Status string `json:"status"`
	}
	if err := row.Scan(&a.ID, &a.Name, &a.Status); err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "admin not found"})
	}
	return c.JSON(http.StatusOK, a)
}

// GetCustomersByAdmin returns all customers under a specific admin
func GetCustomersByAdmin(c echo.Context) error {
	adminId := c.Param("adminId")
	rows, err := db.Conn.Query(`SELECT id, customer_name, status FROM "operateevSchema"."customer" WHERE admin_id=$1`, adminId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to query customers"})
	}
	defer rows.Close()
	type Customer struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Status string `json:"status"`
	}
	var customers []Customer
	for rows.Next() {
		var cst Customer
		if err := rows.Scan(&cst.ID, &cst.Name, &cst.Status); err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to read row"})
		}
		customers = append(customers, cst)
	}
	return c.JSON(http.StatusOK, echo.Map{"customers": customers, "total": len(customers)})
}

// GetCustomerByAdmin returns a specific customer under a specific admin
func GetCustomerByAdmin(c echo.Context) error {
	adminId := c.Param("adminId")
	customerId := c.Param("customerId")
	row := db.Conn.QueryRow(`SELECT id, customer_name, status FROM "operateevSchema"."customer" WHERE id=$1 AND admin_id=$2`, customerId, adminId)
	var cst struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Status string `json:"status"`
	}
	if err := row.Scan(&cst.ID, &cst.Name, &cst.Status); err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "customer not found"})
	}
	return c.JSON(http.StatusOK, cst)
}

// GetCustomers returns all customers
func GetCustomers(c echo.Context) error {
	rows, err := db.Conn.Query(`SELECT id, customer_name, status FROM "operateevSchema"."customer"`)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to query customers"})
	}
	defer rows.Close()
	type Customer struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Status string `json:"status"`
	}
	var customers []Customer
	for rows.Next() {
		var cst Customer
		if err := rows.Scan(&cst.ID, &cst.Name, &cst.Status); err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to read row"})
		}
		customers = append(customers, cst)
	}
	return c.JSON(http.StatusOK, echo.Map{"customers": customers, "total": len(customers)})
}

// GetCustomerByID returns a single customer by ID
func GetCustomerByID(c echo.Context) error {
	customerId := c.Param("customerId")
	row := db.Conn.QueryRow(`SELECT id, customer_name, status FROM "operateevSchema"."customer" WHERE id=$1`, customerId)
	var cst struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Status string `json:"status"`
	}
	if err := row.Scan(&cst.ID, &cst.Name, &cst.Status); err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "customer not found"})
	}
	return c.JSON(http.StatusOK, cst)
}

// GetOwnCustomers returns all customers under the authenticated admin
func GetOwnCustomers(c echo.Context) error {
	// Assume admin ID is in JWT claims
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	adminId, _ := claims["user_id"].(float64)
	rows, err := db.Conn.Query(`SELECT id, customer_name, status FROM "operateevSchema"."customer" WHERE admin_id=$1`, int(adminId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to query customers"})
	}
	defer rows.Close()
	type Customer struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Status string `json:"status"`
	}
	var customers []Customer
	for rows.Next() {
		var cst Customer
		if err := rows.Scan(&cst.ID, &cst.Name, &cst.Status); err != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to read row"})
		}
		customers = append(customers, cst)
	}
	return c.JSON(http.StatusOK, echo.Map{"customers": customers, "total": len(customers)})
}

// GetOwnCustomerByID returns a specific customer under the authenticated admin
func GetOwnCustomerByID(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	adminId, _ := claims["user_id"].(float64)
	customerId := c.Param("customerId")
	row := db.Conn.QueryRow(`SELECT id, customer_name, status FROM "operateevSchema"."customer" WHERE id=$1 AND admin_id=$2`, customerId, int(adminId))
	var cst struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Status string `json:"status"`
	}
	if err := row.Scan(&cst.ID, &cst.Name, &cst.Status); err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "customer not found"})
	}
	return c.JSON(http.StatusOK, cst)
}

// GetCustomerDashboard returns dashboard info for authenticated customer
func GetCustomerDashboard(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	customerId, _ := claims["user_id"].(float64)
	// Example: return some dashboard info
	return c.JSON(http.StatusOK, echo.Map{
		"customer_id": int(customerId),
		"dashboard":   "This is your dashboard info.",
	})
}

// GetCustomerProfile returns profile info for authenticated customer
func GetCustomerProfile(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	customerId, _ := claims["user_id"].(float64)
	row := db.Conn.QueryRow(`SELECT id, customer_name, status FROM "operateevSchema"."customer" WHERE id=$1`, int(customerId))
	var cst struct {
		ID     int    `json:"id"`
		Name   string `json:"name"`
		Status string `json:"status"`
	}
	if err := row.Scan(&cst.ID, &cst.Name, &cst.Status); err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"error": "profile not found"})
	}
	return c.JSON(http.StatusOK, cst)
}

// GenerateToken issues a JWT token for a given user_id and role
func GenerateToken(c echo.Context) error {
	var req struct {
		UserID int    `json:"user_id"`
		Role   string `json:"role"`
	}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid input"})
	}
	if req.UserID == 0 || req.Role == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "user_id and role required"})
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": req.UserID,
		"role":    req.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "token generation failed"})
	}
	return c.JSON(http.StatusOK, echo.Map{"token": tokenString})
}
