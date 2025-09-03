package main

import (
	"log"
	"operateev/db"
	"operateev/routes"
	"os"

	"github.com/labstack/echo/v4"
	emw "github.com/labstack/echo/v4/middleware"
)

func main() {
	if err := db.InitializeDB(); err != nil {
		log.Fatal("failed to initialize database: ", err)
	}
	defer db.Conn.Close()

	// Initialize Echo
	e := echo.New()

	// CORS configuration: allow frontend origin (env FRONTEND_ORIGIN or default http://localhost:3000)
	allowedOrigin := os.Getenv("FRONTEND_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:3005"
	}
	e.Use(emw.CORSWithConfig(emw.CORSConfig{
		AllowOrigins:     []string{allowedOrigin},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.PATCH, echo.DELETE, echo.OPTIONS},
		AllowHeaders:     []string{"Authorization", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Authorization"},
		AllowCredentials: true,
	}))

	// Register routes
	routes.Register(e)

	// Start server
	e.Logger.Fatal(e.Start(":1324"))
}
