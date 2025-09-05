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
	print("Starting application...")
	if err := db.InitializeDB(); err != nil {
		log.Fatal("failed to initialize database: ", err)
	} else {
		log.Println("Database initialized successfully")
	}
	defer db.Conn.Close()

	// Initialize Echo
	e := echo.New()

	// CORS configuration: allow frontend origin (env FRONTEND_ORIGIN or default http://localhost:3000)
	allowedOrigin := os.Getenv("FRONTEND_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "*"
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

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Listen on the correct port
	log.Printf("Starting server on port %s...", port)
	e.Logger.Fatal(e.Start(":" + port))
}
