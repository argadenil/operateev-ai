// Package models defines application data structures.
package models

// User represents a row in the users dashboard table.
// Tags align with JSON serialization for HTTP responses.
type User struct {
	ID       int    `json:"id"`
	FullName string `json:"full_name"`
	Username string `json:"username"`
	Email    string `json:"email"`
}
