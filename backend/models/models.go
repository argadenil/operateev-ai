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

type SuperAdminDashboardResponse struct {
	HeadlineStats  []StatCard `json:"headlineStats"`
	SecondaryStats []StatCard `json:"secondaryStats"`
}
