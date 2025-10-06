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

	// Get Dashboard (By Customer): Returns dashboard data filtered by specific customer ID
	// Allowed: admin and customer; superadmin will be allowed by Authorize middleware automatically
	e.GET("/dashboard", controllers.GetDashboard, middleware.AuthRequired, middleware.Authorize("admin", "customer"))
	/*---------------------------------------------------------------------------------------------*/

	// Get All Admins: Returns a list of all admins (requires authentication)
	e.GET("/admins", controllers.GetAdmins, middleware.AuthRequired, middleware.Authorize("admin", "superadmin"))
	/*---------------------------------------------------------------------------------------------*/

	// Get Single Admin by ID
	e.GET("/admins/:adminId", controllers.GetAdminByID, middleware.AuthRequired, middleware.Authorize("admin", "superadmin"))
	/*---------------------------------------------------------------------------------------------*/

	// Get Customers under a specific Admin
	e.GET("/admins/:adminId/customers", controllers.GetCustomersByAdmin, middleware.AuthRequired, middleware.Authorize("admin", "superadmin"))
	/*---------------------------------------------------------------------------------------------*/

	// Get Specific Customer under a specific Admin
	e.GET("/admins/:adminId/customers/:customerId", controllers.GetCustomerByAdmin, middleware.AuthRequired, middleware.Authorize("admin", "superadmin"))
	/*---------------------------------------------------------------------------------------------*/

	// Get All Customers
	e.GET("/customers", controllers.GetCustomers, middleware.AuthRequired, middleware.Authorize("admin", "superadmin"))
	/*---------------------------------------------------------------------------------------------*/

	// Get Single Customer by ID
	e.GET("/customers/:customerId", controllers.GetCustomerByID, middleware.AuthRequired, middleware.Authorize("admin", "superadmin"))
	/*---------------------------------------------------------------------------------------------*/

	// Admin: Get all customers under this admin
	e.GET("/admin/customers", controllers.GetOwnCustomers, middleware.AuthRequired, middleware.Authorize("admin"))
	/*---------------------------------------------------------------------------------------------*/

	// Admin: Get specific customer under this admin
	e.GET("/admin/customers/:customerId", controllers.GetOwnCustomerByID, middleware.AuthRequired, middleware.Authorize("admin"))
	/*---------------------------------------------------------------------------------------------*/

	// Customer: Get dashboard info
	e.GET("/customer", controllers.GetCustomerDashboard, middleware.AuthRequired, middleware.Authorize("customer"))
	/*---------------------------------------------------------------------------------------------*/

	// Customer: Get own profile info
	e.GET("/customer/profile", controllers.GetCustomerProfile, middleware.AuthRequired, middleware.Authorize("customer"))
	/*---------------------------------------------------------------------------------------------*/
}
