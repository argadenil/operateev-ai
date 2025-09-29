// Package routes wires handlers (controllers) to URL paths.
package routes

import (
	"operateev/controllers"

	"github.com/labstack/echo/v4"
)

func Register(e *echo.Echo) {

	// Login API: Authenticates user with username & password, returns session/token
	e.POST("/login", controllers.Login)
	/*---------------------------------------------------------------------------------------------*/

	// Logout API: Ends user session and clears authentication
	e.POST("/logout", controllers.Logout)
	/*---------------------------------------------------------------------------------------------*/

	// Get Dashboard (By Customer): Returns dashboard data filtered by specific customer ID
	e.GET("/dashboard", controllers.GetDashboard)
	/*---------------------------------------------------------------------------------------------*/
}
