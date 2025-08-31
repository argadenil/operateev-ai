// Package routes wires handlers (controllers) to URL paths.
package routes

import (
	"operateev/controllers"

	"github.com/labstack/echo/v4"
)

// Register attaches all API routes to the provided Echo instance.
func Register(e *echo.Echo) {
	e.GET("/health", controllers.Health)
	e.GET("/", controllers.Health) // root -> health for now
	e.GET("/users", controllers.GetUsers)
	e.GET("/user/:id", controllers.GetUserByID)
	e.POST("/users", controllers.CreateUser)
}
