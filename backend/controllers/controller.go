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

func GetSuperAdminDashboard(c echo.Context) error {
	var resp models.SuperAdminDashboardResponse

	// Query counts from database
	var totalAdmins, activeAdmins, inactiveAdmins int
	var totalCustomers, activeCustomers, inactiveCustomers int
	var totalClusters, activeClusters, idleClusters int
	var totalNodes, onlineNodes, maintenanceNodes, offlineNodes int
	var totalGPUs, usedGPUs, availableGPUs, reservedGPUs, failedGPUs int
	var hardwareFailures, networkFailures, powerFailures int

	// Fetch admins data
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."admin"`).Scan(&totalAdmins)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."admin" WHERE status='active'`).Scan(&activeAdmins)
	inactiveAdmins = totalAdmins - activeAdmins

	// Fetch customers data
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."customer"`).Scan(&totalCustomers)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."customer" WHERE status='active'`).Scan(&activeCustomers)
	inactiveCustomers = totalCustomers - activeCustomers

	// Fetch clusters data
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."cluster"`).Scan(&totalClusters)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."cluster" WHERE status='active'`).Scan(&activeClusters)
	idleClusters = totalClusters - activeClusters

	// Fetch nodes data
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."node"`).Scan(&totalNodes)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."node" WHERE status='online'`).Scan(&onlineNodes)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."node" WHERE status='maintenance'`).Scan(&maintenanceNodes)
	offlineNodes = totalNodes - onlineNodes - maintenanceNodes

	// Fetch GPUs data
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."gpu"`).Scan(&totalGPUs)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."gpu" WHERE status='in_use'`).Scan(&usedGPUs)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."gpu" WHERE status='available'`).Scan(&availableGPUs)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."gpu" WHERE status='reserved'`).Scan(&reservedGPUs)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."gpu" WHERE status='failed'`).Scan(&failedGPUs)

	// Fetch GPU failure types (if you have a failure_reason column)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."gpu" WHERE status='failed' AND failure_reason='hardware'`).Scan(&hardwareFailures)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."gpu" WHERE status='failed' AND failure_reason='network'`).Scan(&networkFailures)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."gpu" WHERE status='failed' AND failure_reason='power'`).Scan(&powerFailures)

	// Build headline stats
	resp.HeadlineStats = []models.StatCard{
		{
			Title:       "Total Admins",
			Value:       totalAdmins,
			Icon:        "UserCog",
			Palette:     "blue",
			Change:      2,
			ChangeType:  "increase",
			Description: "2 new this week",
			DataViz: &models.DataViz{
				Type: "dotIndicator",
				Items: []models.DataVizItem{
					{Label: "Active", Count: activeAdmins, Color: "bg-green-400"},
					{Label: "Inactive", Count: inactiveAdmins, Color: "bg-red-400"},
				},
			},
		},
		{
			Title:       "Total Customers",
			Value:       fmt.Sprintf("%.2fK", float64(totalCustomers)/1000),
			Icon:        "Users",
			Palette:     "emerald",
			Change:      156,
			ChangeType:  "increase",
			Description: "+12.3% growth this month",
			DataViz: &models.DataViz{
				Type: "dotIndicator",
				Items: []models.DataVizItem{
					{Label: "Active", Count: activeCustomers, Color: "bg-green-400"},
					{Label: "Inactive", Count: inactiveCustomers, Color: "bg-red-400"},
				},
			},
		},
		{
			Title:       "Clusters",
			Value:       totalClusters,
			Icon:        "Server",
			Palette:     "gray",
			Change:      0,
			ChangeType:  "neutral",
			Description: "Stable since last update",
			DataViz: &models.DataViz{
				Type: "comparison",
				Primary: &models.DataVizItem{
					Label: "Active",
					Value: fmt.Sprintf("%d", activeClusters),
				},
				Secondary: &models.DataVizItem{
					Label: "Idle",
					Value: fmt.Sprintf("%d", idleClusters),
				},
			},
		},
		{
			Title:       "Nodes",
			Value:       totalNodes,
			Icon:        "MonitorSmartphone",
			Palette:     "orange",
			Change:      -4,
			ChangeType:  "decrease",
			Description: "Some nodes offline",
			DataViz: &models.DataViz{
				Type: "dotIndicator",
				Items: []models.DataVizItem{
					{Label: "Online", Count: onlineNodes, Color: "bg-green-400"},
					{Label: "Maintenance", Count: maintenanceNodes, Color: "bg-yellow-400"},
					{Label: "Offline", Count: offlineNodes, Color: "bg-red-400"},
				},
			},
		},
		{
			Title:       "GPUs",
			Value:       totalGPUs,
			Icon:        "Cpu",
			Palette:     "indigo",
			Change:      32,
			ChangeType:  "increase",
			Description: "Available for allocation",
			DataViz: &models.DataViz{
				Type: "tags",
				Tags: []string{"V100", "A100", "H100", "RTX 4090", "RTX 3090", "T4", "L40S", "MI300X", "H200", "A800"},
			},
		},
	}

	// Build secondary stats
	resp.SecondaryStats = []models.StatCard{
		{
			Title:       "Active Users",
			Value:       fmt.Sprintf("%.1fk", float64(activeCustomers)/1000),
			Icon:        "UserCheck",
			Palette:     "emerald",
			Description: fmt.Sprintf("Inactive: %d", inactiveCustomers),
			DataViz: &models.DataViz{
				Type: "comparison",
				Primary: &models.DataVizItem{
					Label: "Active",
					Value: fmt.Sprintf("%.1fk", float64(activeCustomers)/1000),
				},
				Secondary: &models.DataVizItem{
					Label: "Inactive",
					Value: fmt.Sprintf("%d", inactiveCustomers),
				},
			},
		},
		{
			Title:       "Used GPUs",
			Value:       usedGPUs,
			Icon:        "Cpu",
			Palette:     "sky",
			Description: fmt.Sprintf("Available: %d", availableGPUs),
			DataViz: &models.DataViz{
				Type: "dotIndicator",
				Items: []models.DataVizItem{
					{Label: "In Use", Count: usedGPUs, Color: "bg-red-400"},
					{Label: "Available", Count: availableGPUs, Color: "bg-green-400"},
					{Label: "Reserved", Count: reservedGPUs, Color: "bg-amber-400"},
				},
			},
		},
		{
			Title:       "Failed GPUs",
			Value:       failedGPUs,
			Icon:        "ZapOff",
			Palette:     "red",
			Description: fmt.Sprintf("Offline nodes: %d", offlineNodes),
			DataViz: &models.DataViz{
				Type: "dotIndicator",
				Items: []models.DataVizItem{
					{Label: "Hardware", Count: hardwareFailures, Color: "bg-green-400"},
					{Label: "Network", Count: networkFailures, Color: "bg-gray-400"},
					{Label: "Power", Count: powerFailures, Color: "bg-yellow-400"},
				},
			},
		},
	}

	return c.JSON(http.StatusOK, resp)
}

func GetAdminsDashboard(c echo.Context) error {
	return c.JSON(http.StatusOK, echo.Map{"message": "Admin Dashboard"})
}
func GetViewersDashboard(c echo.Context) error {
	return c.JSON(http.StatusOK, echo.Map{"message": "Viewer Dashboard"})
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
