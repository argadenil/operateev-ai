// Package controllers holds HTTP handler logic.
package controllers

import (
	"context"
	"database/sql"
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
		`SELECT id, username, customer_id, full_name, email, password_hash FROM "usersSchema"."users" WHERE username=$1`,
		strings.TrimSpace(req.Username),
	).Scan(&user.ID, &user.Username, &user.CustomerID, &user.FullName, &user.Email, &passwordHash)
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

	return c.JSON(http.StatusOK, models.LoginResponse{Token: tokenString, Username: user.FullName, CustomerID: user.CustomerID})
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
		if r.Status == "Running" {
			summary.Running++
		} else if r.Status == "Idle" {
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
func GetGPUResources(c echo.Context) error {
	customerID := c.Param("customer_id")
	if customerID == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "customer_id is required"})
	}

	rows, err := db.Conn.Query(`
		SELECT id, customer_id, model, memory_gb, COALESCE(memory_used_gb,0), cluster, status, utilization, temperature_c, power_w, uptime_sec
		FROM "usersSchema"."gpu_resources"
		WHERE customer_id = $1
		ORDER BY id ASC
	`, customerID)
	if err != nil {
		return c.JSON(http.StatusOK, models.GPUResourcesResponse{GPUs: []models.GPUResource{}, Summary: models.GPUResourcesSummary{}})
	}
	defer rows.Close()

	gpus := []models.GPUResource{}
	var totalUtil, allocatedCount int

	for rows.Next() {
		var r models.GPUResource
		if scanErr := rows.Scan(&r.ID, &r.CustomerID, &r.Model, &r.MemoryGB, &r.MemoryUsed, &r.Cluster, &r.Status, &r.Utilization, &r.Temperature, &r.PowerW, &r.UptimeSec); scanErr != nil {
			return c.JSON(http.StatusInternalServerError, echo.Map{"error": "scan failed"})
		}
		gpus = append(gpus, r)
		totalUtil += r.Utilization
		if r.Status == "allocated" {
			allocatedCount++
		}
	}

	summary := models.GPUResourcesSummary{Total: len(gpus)}
	for _, g := range gpus {
		switch strings.ToLower(g.Status) {
		case "available":
			summary.Available++
		case "allocated":
			summary.Allocated++
		case "offline":
			summary.Offline++
		}
	}
	if summary.Total > 0 {
		summary.AvgUtilization = totalUtil / summary.Total
		summary.AllocationRate = int(float64(summary.Allocated) / float64(summary.Total) * 100.0)
	}

	return c.JSON(http.StatusOK, models.GPUResourcesResponse{GPUs: gpus, Summary: summary})
}

// AddGPUResource inserts a new GPU resource row.
func AddGPUResource(c echo.Context) error {
	var req models.AddGPURequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "invalid input"})
	}
	// minimal validation
	if strings.TrimSpace(req.CustomerID) == "" || strings.TrimSpace(req.Model) == "" || req.MemoryGB <= 0 {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "customer_id, model and positive memory_gb are required"})
	}
	if req.Status == "" {
		req.Status = "available"
	}

	// Insert and return created record id
	var id int
	err := db.Conn.QueryRowContext(
		context.Background(),
		`INSERT INTO "usersSchema"."gpu_resources" (customer_id, model, memory_gb, memory_used_gb, cluster, status, utilization, temperature_c, power_w, uptime_sec)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
		 RETURNING id`,
		req.CustomerID, req.Model, req.MemoryGB, req.MemoryUsed, req.Cluster, req.Status, req.Utilization, req.Temperature, req.PowerW, req.UptimeSec,
	).Scan(&id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "failed to add gpu resource"})
	}

	created := models.GPUResource{
		ID:          id,
		CustomerID:  req.CustomerID,
		Model:       req.Model,
		MemoryGB:    req.MemoryGB,
		MemoryUsed:  req.MemoryUsed,
		Cluster:     req.Cluster,
		Status:      req.Status,
		Utilization: req.Utilization,
		Temperature: req.Temperature,
		PowerW:      req.PowerW,
		UptimeSec:   req.UptimeSec,
	}
	return c.JSON(http.StatusCreated, created)
}

// GetJobs retrieves all jobs for a specific customer with summary statistics
func GetJobs(c echo.Context) error {
	customerID := c.Param("customer_id")
	if customerID == "" {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "customer_id required"})
	}

	rows, err := db.Conn.QueryContext(
		context.Background(),
		`SELECT id, customer_id, name, description, gpu, owner, status, start_time, end_time, duration, 
		 priority, cpu_cores, memory_gb, gpu_memory_gb
		 FROM "usersSchema"."jobs" WHERE customer_id=$1`,
		customerID,
	)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, models.JobResponse{Error: "failed to fetch jobs"})
	}
	defer rows.Close()

	var jobs []models.Job
	var summary models.JobSummary

	for rows.Next() {
		var job models.Job
		var startTime, endTime sql.NullString
		err := rows.Scan(
			&job.ID, &job.CustomerID, &job.Name, &job.Description, &job.GPU, &job.Owner,
			&job.Status, &startTime, &endTime, &job.Duration, &job.Priority,
			&job.CPUCores, &job.MemoryGB, &job.GPUMemoryGB,
		)
		if err != nil {
			continue
		}

		if startTime.Valid {
			job.StartTime = startTime.String
		}
		if endTime.Valid {
			job.EndTime = endTime.String
		}

		jobs = append(jobs, job)
		summary.Total++

		// Count by status
		switch strings.ToLower(job.Status) {
		case "queued":
			summary.Queued++
		case "running":
			summary.Running++
		case "completed":
			summary.Completed++
		case "failed":
			summary.Failed++
		case "cancelled":
			summary.Cancelled++
		}
	}

	return c.JSON(http.StatusOK, models.JobResponse{Jobs: jobs, Summary: summary})
}
