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
	Token      string `json:"token"`
	Username   string `json:"username"`
	CustomerID string `json:"customer_id"`
	Role       string `json:"role"`
}

type UserInfo struct {
	ID           int    `json:"id"`
	FullName     string `json:"full_name"`
	PasswordHash string `json:"-"`
	Role         string `json:"role"`
	CustomerID   string `json:"customer_id"`
}
