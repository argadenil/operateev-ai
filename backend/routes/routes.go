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

	// Get Dashboard (Global): Returns overall system/customer summary
	e.GET("/dashboard", controllers.GetDashboard)
	/*---------------------------------------------------------------------------------------------*/

	// Get Dashboard (By Customer): Returns dashboard data filtered by specific customer ID
	e.GET("/dashboard/:customer_id", controllers.GetDashboard)
	/*---------------------------------------------------------------------------------------------*/

	// Get GPU Resources: Lists GPU details (model, memory, utilization, etc.) for a given customer
	e.GET("/gpu-resources/:customer_id", controllers.GetGPUResources)
	/*---------------------------------------------------------------------------------------------*/

	// Add GPU Resource: Inserts new GPU resource entry for a customer
	e.POST("/add-gpu", controllers.AddGPUResource)
	/*---------------------------------------------------------------------------------------------*/

	// Get Jobs: Fetches job details (status, resources used, duration, etc.) for a given customer
	e.GET("/get-jobs/:customer_id", controllers.GetJobs)
	/*---------------------------------------------------------------------------------------------*/

}
