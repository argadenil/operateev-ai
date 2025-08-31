package main

import (
	"log"
	"operateev/db"
	"operateev/routes"

	"github.com/labstack/echo/v4"
)

func main() {
	if err := db.InitializeDB(); err != nil {
		log.Fatal("failed to initialize database: ", err)
	}
	defer db.Conn.Close()

	// Initialize Echo
	e := echo.New()

	// Register routes
	routes.Register(e)

	// Start server
	e.Logger.Fatal(e.Start(":1324"))
}
