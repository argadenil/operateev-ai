// Package controllers holds HTTP handler logic.
package controllers

import (
	"context"
	"database/sql"
	"myapp/api/db"
	"myapp/api/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

// GetUsers returns all users.
func GetUsers(c echo.Context) error {
	query := `SELECT id, full_name, username, email FROM "usersSchema"."dashboard"`
	rows, err := db.Conn.QueryContext(context.Background(), query)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to fetch users: " + err.Error()})
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.FullName, &u.Username, &u.Email); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to read user row: " + err.Error()})
		}
		users = append(users, u)
	}
	return c.JSON(http.StatusOK, users)
}

// GetUserByID returns a user by ID.
func GetUserByID(c echo.Context) error {
	id := c.Param("id")
	var u models.User
	query := `SELECT id, full_name, username, email FROM "usersSchema"."dashboard" WHERE id = $1`
	err := db.Conn.QueryRowContext(context.Background(), query, id).Scan(&u.ID, &u.FullName, &u.Username, &u.Email)
	if err == sql.ErrNoRows {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "user not found"})
	} else if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "query failed: " + err.Error()})
	}
	return c.JSON(http.StatusOK, u)
}

// CreateUser creates a new user.
func CreateUser(c echo.Context) error {
	var u models.User
	if err := c.Bind(&u); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request body"})
	}
	query := `INSERT INTO "usersSchema"."dashboard" (full_name, username, email) VALUES ($1, $2, $3) RETURNING id`
	err := db.Conn.QueryRowContext(context.Background(), query, u.FullName, u.Username, u.Email).Scan(&u.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to insert user: " + err.Error()})
	}
	return c.JSON(http.StatusCreated, u)
}

// Health responds with a simple ok message.
func Health(c echo.Context) error {
	if err := db.HealthCheck(context.Background()); err != nil {
		return c.JSON(http.StatusServiceUnavailable, map[string]string{"status": "unhealthy", "error": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}
