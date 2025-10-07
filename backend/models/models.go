package models

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
	Token       string `json:"token"`
	CustomerID  string `json:"customer_id"`
	Role        string `json:"role"`
	DisplayName string `json:"name"`
}

type UserInfo struct {
	ID           int    `json:"id"`
	DisplayName  string `json:"name"`
	PasswordHash string `json:"-"`
	Role         string `json:"role"`
	CustomerID   string `json:"customer_id"`
}

type CardsData struct {
	TotalAdmins    int     `json:"totalAdmins"`
	TotalCustomers int     `json:"totalCustomers"`
	TotalClusters  int     `json:"totalClusters"`
	FailedGPUs     int     `json:"failedGPUs"`
	SystemHealth   float64 `json:"systemHealth"`
}

type DashboardResponse struct {
	CardsData CardsData `json:"cardsData"`
}

// New comprehensive dashboard models
type DataVizItem struct {
	Label string `json:"label"`
	Count int    `json:"count"`
	Color string `json:"color"`
	Value string `json:"value,omitempty"`
}

type DataViz struct {
	Type      string        `json:"type"` // dotIndicator, comparison, tags
	Items     []DataVizItem `json:"items,omitempty"`
	Primary   *DataVizItem  `json:"primary,omitempty"`
	Secondary *DataVizItem  `json:"secondary,omitempty"`
	Tags      []string      `json:"tags,omitempty"`
}

type StatCard struct {
	Title       string   `json:"title"`
	Value       any      `json:"value"` // can be int or string
	Icon        string   `json:"icon"`
	Palette     string   `json:"palette"`
	Change      int      `json:"change,omitempty"`
	ChangeType  string   `json:"changeType,omitempty"` // increase, decrease, neutral
	Description string   `json:"description"`
	DataViz     *DataViz `json:"dataViz,omitempty"`
}

// New dashboard structure
type AdminsStats struct {
	Total    int `json:"total"`
	Active   int `json:"active"`
	Inactive int `json:"inactive"`
}

type CustomersStats struct {
	Total    int `json:"total"`
	Active   int `json:"active"`
	Inactive int `json:"inactive"`
}

type ClustersStats struct {
	Total  int `json:"total"`
	Active int `json:"active"`
	Idle   int `json:"idle"`
}

type NodesStats struct {
	Total       int `json:"total"`
	Online      int `json:"online"`
	Maintenance int `json:"maintenance"`
	Offline     int `json:"offline"`
}

type GpusStats struct {
	Total   int      `json:"total"`
	GpuList []string `json:"gpuList"`
}

type JobsStats struct {
	Total     int `json:"total"`
	Running   int `json:"running"`
	Completed int `json:"completed"`
	Failed    int `json:"failed"`
	Queued    int `json:"queued"`
}

type UsedGPUsStats struct {
	Total     int `json:"total"`
	InUse     int `json:"inUse"`
	Available int `json:"available"`
	Reserved  int `json:"reserved"`
}

type FailedGPUsStats struct {
	Total            int `json:"total"`
	HardwareFailures int `json:"hardwareFailures"`
	SoftwareFailures int `json:"softwareFailures"`
	NetworkFailures  int `json:"networkFailures"`
	PowerFailures    int `json:"powerFailures"`
}

type DashboardData struct {
	TotalAdmins    AdminsStats     `json:"totalAdmins"`
	TotalCustomers CustomersStats  `json:"totalCustomers"`
	TotalClusters  ClustersStats   `json:"totalClusters"`
	TotalNodes     NodesStats      `json:"totalNodes"`
	TotalGpus      GpusStats       `json:"totalGpus"`
	TotalJobs      JobsStats       `json:"totalJobs"`
	UsedGPUs       UsedGPUsStats   `json:"usedGPUs"`
	FailedGPUs     FailedGPUsStats `json:"failedGPUs"`
}

type NewSuperAdminDashboardResponse struct {
	Status    string        `json:"status"`
	Dashboard DashboardData `json:"dashboard"`
}
