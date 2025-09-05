// Package models defines application data structures.
package models

// User represents a row in the users dashboard table.
// Tags align with JSON serialization for HTTP responses.
type User struct {
	ID         int    `json:"id"`
	FullName   string `json:"full_name"`
	Username   string `json:"username"`
	Email      string `json:"email"`
	Password   string `json:"password,omitempty"`
	CustomerID string `json:"customer_id"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token      string `json:"token"`
	Username   string `json:"username"`
	CustomerID string `json:"customer_id"`
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

// GPUResource represents a single GPU inventory / runtime metric row.
// Keeping fields aligned with a potential dedicated gpu_resources table.
type GPUResource struct {
	ID          int    `json:"id"`
	CustomerID  string `json:"customer_id"`
	Model       string `json:"model"`
	MemoryGB    int    `json:"memory_gb"`
	MemoryUsed  int    `json:"memory_used_gb"`
	Cluster     string `json:"cluster"`
	Status      string `json:"status"` // available | allocated | offline
	Utilization int    `json:"utilization"`
	Temperature int    `json:"temperature_c"`
	PowerW      int    `json:"power_w"`
	UptimeSec   int    `json:"uptime_sec"`
}

// GPUResourcesSummary aggregates counts / averages for a list of GPU resources.
type GPUResourcesSummary struct {
	Total          int `json:"total"`
	Available      int `json:"available"`
	Allocated      int `json:"allocated"`
	Offline        int `json:"offline"`
	AvgUtilization int `json:"avg_utilization"`
	AllocationRate int `json:"allocation_rate"` // percentage 0-100
}

// GPUResourcesResponse shape returned by /gpu-resources/:customer_id endpoint.
type GPUResourcesResponse struct {
	GPUs    []GPUResource       `json:"gpus"`
	Summary GPUResourcesSummary `json:"summary"`
	Error   string              `json:"error,omitempty"`
}
