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

// Job represents a computational job that can be scheduled and executed on GPU resources.
type Job struct {
	ID          int    `json:"id"`
	CustomerID  string `json:"customer_id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	GPU         string `json:"gpu"`
	Owner       string `json:"owner"`
	Status      string `json:"status"` // queued | running | completed | failed | cancelled
	StartTime   string `json:"start_time,omitempty"`
	EndTime     string `json:"end_time,omitempty"`
	Duration    string `json:"duration,omitempty"`
	Priority    int    `json:"priority"` // 1-10, higher number = higher priority
	CPUCores    int    `json:"cpu_cores"`
	MemoryGB    int    `json:"memory_gb"`
	GPUMemoryGB int    `json:"gpu_memory_gb"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

// JobSummary provides aggregated statistics for jobs.
type JobSummary struct {
	Total     int `json:"total"`
	Queued    int `json:"queued"`
	Running   int `json:"running"`
	Completed int `json:"completed"`
	Failed    int `json:"failed"`
	Cancelled int `json:"cancelled"`
}

// JobResponse bundles jobs with summary statistics.
type JobResponse struct {
	Jobs    []Job      `json:"jobs"`
	Summary JobSummary `json:"summary"`
	Error   string     `json:"error,omitempty"`
}

// CreateJobRequest represents the payload for creating a new job.
type CreateJobRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
	GPU         string `json:"gpu" validate:"required"`
	Priority    int    `json:"priority"`
	CPUCores    int    `json:"cpu_cores"`
	MemoryGB    int    `json:"memory_gb"`
	GPUMemoryGB int    `json:"gpu_memory_gb"`
}

// UpdateJobRequest represents the payload for updating a job.
type UpdateJobRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Status      string `json:"status"`
	Priority    int    `json:"priority"`
}

// AddGPURequest represents the payload to add a new GPU resource to inventory.
type AddGPURequest struct {
	CustomerID  string `json:"customer_id"`
	Model       string `json:"model"`
	MemoryGB    int    `json:"memory_gb"`
	MemoryUsed  int    `json:"memory_used_gb"`
	Cluster     string `json:"cluster"`
	Status      string `json:"status"`
	Utilization int    `json:"utilization"`
	Temperature int    `json:"temperature_c"`
	PowerW      int    `json:"power_w"`
	UptimeSec   int    `json:"uptime_sec"`
}

// Settings represents configurable settings for a user account.
// It mirrors the sections present in the frontend Settings page.
type Settings struct {
	Profile struct {
		FullName string `json:"full_name"`
		Email    string `json:"email"`
		Phone    string `json:"phone"`
	} `json:"profile"`
	Preferences struct {
		DarkMode         bool `json:"dark_mode"`
		EnableAnimations bool `json:"enable_animations"`
		AutoRefresh      bool `json:"auto_refresh"`
		CompactTable     bool `json:"compact_table"`
	} `json:"preferences"`
	Notifications struct {
		Email  bool `json:"email"`
		Push   bool `json:"push"`
		SMS    bool `json:"sms"`
		System bool `json:"system"`
	} `json:"notifications"`
	Security struct {
		TwoFAEnabled bool   `json:"two_fa_enabled"`
		PasswordHint string `json:"password_hint,omitempty"`
	} `json:"security"`
	Integrations struct {
		SlackEnabled bool `json:"slack_enabled"`
	} `json:"integrations"`
	Privacy struct {
		Analytics     bool `json:"analytics"`
		DataSharing   bool `json:"data_sharing"`
		AllowExport   bool `json:"allow_export"`
		AllowDeletion bool `json:"allow_deletion"`
	} `json:"privacy"`
	Workspace struct {
		Name        string `json:"name"`
		Public      bool   `json:"public"`
		GuestAccess bool   `json:"guest_access"`
	} `json:"workspace"`
	Storage struct {
		AutoBackup bool `json:"auto_backup"`
		CloudSync  bool `json:"cloud_sync"`
	} `json:"storage"`
	Advanced struct {
		DeveloperMode         bool `json:"developer_mode"`
		BetaFeatures          bool `json:"beta_features"`
		DebugMode             bool `json:"debug_mode"`
		PerformanceMonitoring bool `json:"performance_monitoring"`
		SessionTimeoutMin     int  `json:"session_timeout_min"`
	} `json:"advanced"`
}

// GetSettingsResponse bundles settings and metadata.
type GetSettingsResponse struct {
	CustomerID int      `json:"customer_id"`
	Settings   Settings `json:"settings"`
	APIKey     string   `json:"api_key,omitempty"`
}

// UpdateSettingsRequest accepts new settings to persist.
type UpdateSettingsRequest struct {
	Settings Settings `json:"settings"`
}
