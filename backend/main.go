package main

import (
	"log"
	"operateev/db"
	"operateev/routes"

	"github.com/labstack/echo/v4"
)

func main() {
	dsn := "postgres://postgres:nilesh3496@localhost:5432/postgres?sslmode=disable"
	if err := db.Connect(dsn); err != nil {
		log.Fatal("db connection failed: ", err)
	}
	defer db.Conn.Close()

	// Initialize Echo
	e := echo.New()

	// Register routes
	routes.Register(e)

	// Start server
	e.Logger.Fatal(e.Start(":1324"))
}
