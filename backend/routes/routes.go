// Package routes wires handlers (controllers) to URL paths.
package routes

import (
	"operateev/controllers"

	"github.com/labstack/echo/v4"
)

func Register(e *echo.Echo) {
	e.POST("/login", controllers.Login)
	e.POST("/logout", controllers.Logout)
	e.GET("/dashboard", controllers.GetDashboard)
	e.GET("/dashboard/:customer_id", controllers.GetDashboard)
	e.GET("/gpu-resources/:customer_id", controllers.GetGPUResources)
}
