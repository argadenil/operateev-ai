// Package models defines application data structures.
package models

// User represents a row in the users dashboard table.
// Tags align with JSON serialization for HTTP responses.
type User struct {
	ID       int    `json:"id"`
	FullName string `json:"full_name"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

// DashboardResource represents a GPU resource row for a specific user.
type DashboardResource struct {
	ID          int    `json:"id"`
	GPU         string `json:"gpu"`
	MemoryGB    int    `json:"memory_gb"`
	Cluster     string `json:"cluster"`
	Status      string `json:"status"`
	UptimeSec   int    `json:"uptime_sec"`
	Temperature int    `json:"temperature_c"`
	PowerW      int    `json:"power_w"`
	Processes   int    `json:"processes"`
}

// DashboardSummary provides aggregated statistics for the dashboard.
type DashboardSummary struct {
	Total    int `json:"total"`
	Running  int `json:"running"`
	Idle     int `json:"idle"`
	AvgPower int `json:"avg_power"`
}

// DashboardResponse bundles resources with summary.
type DashboardResponse struct {
	Resources []DashboardResource `json:"resources"`
	Summary   DashboardSummary    `json:"summary"`
}
