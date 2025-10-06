// Package routes wires handlers (controllers) to URL paths.
package routes

import (
	"operateev/controllers"
	"operateev/middleware"

	"github.com/labstack/echo/v4"
)

func Register(e *echo.Echo) {

	// Login API: Authenticates user with username & password, returns session/token
	e.POST("/login", controllers.Login)
	/*---------------------------------------------------------------------------------------------*/

	// Logout API: Ends user session and clears authentication (requires any authenticated role)
	e.POST("/logout", controllers.Logout, middleware.AuthRequired)
	/*---------------------------------------------------------------------------------------------*/

	// Get Dashboard (By Customer): Returns dashboard data filtered by specific customer ID
	// Allowed: admin and customer; superadmin will be allowed by Authorize middleware automatically
	e.GET("/dashboard", controllers.GetDashboard, middleware.AuthRequired, middleware.Authorize("admin", "customer"))
	/*---------------------------------------------------------------------------------------------*/
}
