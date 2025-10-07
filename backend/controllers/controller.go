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
	// Query counts from database
	var totalAdmins, activeAdmins, inactiveAdmins int
	var totalCustomers, activeCustomers, inactiveCustomers int
	var totalClusters, activeClusters, idleClusters int
	var totalNodes, onlineNodes, maintenanceNodes, offlineNodes int
	var totalGPUs, usedGPUs, availableGPUs, reservedGPUs, failedGPUs int
	var totalJobs, runningJobs, completedJobs, failedJobs, queuedJobs int
	var hardwareFailures, softwareFailures, networkFailures, powerFailures int

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

	// Fetch GPU list (distinct models)
	rows, err := db.Conn.Query(`SELECT DISTINCT model FROM "operateevSchema"."gpu" ORDER BY model`)
	gpuList := []string{}
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var model string
			if err := rows.Scan(&model); err == nil {
				gpuList = append(gpuList, model)
			}
		}
	}

	// Fetch Jobs data (assuming you have a jobs table)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."job"`).Scan(&totalJobs)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."job" WHERE status='running'`).Scan(&runningJobs)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."job" WHERE status='completed'`).Scan(&completedJobs)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."job" WHERE status='failed'`).Scan(&failedJobs)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."job" WHERE status='queued'`).Scan(&queuedJobs)

	// Fetch GPU failure types
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."gpu" WHERE status='failed' AND failure_reason='hardware'`).Scan(&hardwareFailures)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."gpu" WHERE status='failed' AND failure_reason='software'`).Scan(&softwareFailures)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."gpu" WHERE status='failed' AND failure_reason='network'`).Scan(&networkFailures)
	db.Conn.QueryRow(`SELECT COUNT(*) FROM "operateevSchema"."gpu" WHERE status='failed' AND failure_reason='power'`).Scan(&powerFailures)

	// Build response
	resp := models.NewSuperAdminDashboardResponse{
		Status: "success",
		Dashboard: models.DashboardData{
			TotalAdmins: models.AdminsStats{
				Total:    totalAdmins,
				Active:   activeAdmins,
				Inactive: inactiveAdmins,
			},
			TotalCustomers: models.CustomersStats{
				Total:    totalCustomers,
				Active:   activeCustomers,
				Inactive: inactiveCustomers,
			},
			TotalClusters: models.ClustersStats{
				Total:  totalClusters,
				Active: activeClusters,
				Idle:   idleClusters,
			},
			TotalNodes: models.NodesStats{
				Total:       totalNodes,
				Online:      onlineNodes,
				Maintenance: maintenanceNodes,
				Offline:     offlineNodes,
			},
			TotalGpus: models.GpusStats{
				Total:   totalGPUs,
				GpuList: gpuList,
			},
			TotalJobs: models.JobsStats{
				Total:     totalJobs,
				Running:   runningJobs,
				Completed: completedJobs,
				Failed:    failedJobs,
				Queued:    queuedJobs,
			},
			UsedGPUs: models.UsedGPUsStats{
				Total:     usedGPUs + availableGPUs + reservedGPUs,
				InUse:     usedGPUs,
				Available: availableGPUs,
				Reserved:  reservedGPUs,
			},
			FailedGPUs: models.FailedGPUsStats{
				Total:            failedGPUs,
				HardwareFailures: hardwareFailures,
				SoftwareFailures: softwareFailures,
				NetworkFailures:  networkFailures,
				PowerFailures:    powerFailures,
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
