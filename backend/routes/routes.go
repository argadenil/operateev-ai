// Package routes wires handlers (controllers) to URL paths.
package routes

import (
	"operateev/controllers"
	"operateev/middleware"

	"github.com/labstack/echo/v4"
)

func Register(e *echo.Echo) {
	// JWT Token Generation API
	e.POST("/token", controllers.GenerateToken)
	/*---------------------------------------------------------------------------------------------*/

	// Login API: Authenticates user with username & password, returns session/token
	e.POST("/login", controllers.Login)
	/*---------------------------------------------------------------------------------------------*/

	// Logout API: Ends user session and clears authentication (requires any authenticated role)
	e.POST("/logout", controllers.Logout, middleware.AuthRequired)
	/*---------------------------------------------------------------------------------------------*/

	api := e.Group("/api/dashboard")

	api.GET("/super-admins", controllers.GetSuperAdminDashboard)
	api.GET("/admins", controllers.GetAdminsDashboard)
	api.GET("/customers", controllers.GetViewersDashboard)
}
