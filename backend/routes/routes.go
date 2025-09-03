// Package routes wires handlers (controllers) to URL paths.
package routes

import (
	"operateev/controllers"
	"operateev/middleware"

	"github.com/labstack/echo/v4"
)

// Register attaches all API routes to the provided Echo instance.
func Register(e *echo.Echo) {
	e.POST("/login", controllers.Login)
	e.POST("/logout", controllers.Logout)

	d := e.Group("/dashboard/:customer_id", middleware.AuthRequired)
	d.GET("", controllers.GetDashboard)
}
