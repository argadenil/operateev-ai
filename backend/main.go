package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/jackc/pgx/v5/stdlib" // PostgreSQL driver
	"github.com/labstack/echo/v4"      // Echo framework
)

// Global DB connection
var db *sql.DB

// User represents the structure of our database table
type User struct {
	ID       int    `json:"id"`
	FullName string `json:"full_name"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func main() {
	// Database connection string
	dsn := "postgres://postgres:nilesh3496@localhost:5432/postgres?sslmode=disable"

	// Open DB connection
	var err error
	db, err = sql.Open("pgx", dsn)
	if err != nil {
		log.Fatal("❌ Error opening DB:", err)
	}
	defer db.Close()

	// Check DB connection
	if err := db.Ping(); err != nil {
		log.Fatal("❌ Error connecting to DB:", err)
	}
	fmt.Println("✅ Connected to PostgreSQL")

	// Initialize Echo
	e := echo.New()

	// Routes
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, Echo + Postgres!")
	})

	e.GET("/users", getUsers)       // Get all users
	e.GET("/user/:id", getUserByID) // Get user by ID
	e.POST("/users", createUser)    // Create a new user

	// Start server
	e.Logger.Fatal(e.Start(":1324"))
}

// ------------------- HANDLERS ------------------- //

// Get all users
func getUsers(c echo.Context) error {
	query := `SELECT id, full_name, username, email FROM "usersSchema"."dashboard"`

	rows, err := db.QueryContext(context.Background(), query)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "failed to fetch users: " + err.Error(),
		})
	}
	defer rows.Close()

	var users []User

	// Loop through result rows
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.FullName, &u.Username, &u.Email); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error": "failed to read user row: " + err.Error(),
			})
		}
		users = append(users, u)
	}

	return c.JSON(http.StatusOK, users)
}

// Get user by ID
func getUserByID(c echo.Context) error {
	id := c.Param("id") // Get id from URL
	var u User

	query := `SELECT id, full_name, username, email 
			  FROM "usersSchema"."dashboard" WHERE id = $1`

	err := db.QueryRowContext(context.Background(), query, id).
		Scan(&u.ID, &u.FullName, &u.Username, &u.Email)

	if err == sql.ErrNoRows {
		return c.JSON(http.StatusNotFound, map[string]string{
			"error": "user not found",
		})
	} else if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "query failed: " + err.Error(),
		})
	}

	return c.JSON(http.StatusOK, u)
}

// Create a new user
func createUser(c echo.Context) error {
	var u User

	// Bind request body to struct
	if err := c.Bind(&u); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
	}

	query := `INSERT INTO "usersSchema"."dashboard" (full_name, username, email) 
			  VALUES ($1, $2, $3) RETURNING id`

	err := db.QueryRowContext(context.Background(), query,
		u.FullName, u.Username, u.Email,
	).Scan(&u.ID)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "failed to insert user: " + err.Error(),
		})
	}

	return c.JSON(http.StatusCreated, u)
}
