// Package middleware contains Echo/HTTP middleware components.
package middleware

import (
	"net/http"
	"operateev/controllers"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

// AuthRequired validates JWT and sets user_id in context.
func AuthRequired(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		auth := c.Request().Header.Get("Authorization")
		if auth == "" {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "missing Authorization header"})
		}
		parts := strings.SplitN(auth, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || parts[1] == "" {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "invalid Authorization header format"})
		}
		tokenStr := parts[1]
		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) { return controllers.JwtSecret(), nil })
		if err != nil || !token.Valid {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "invalid or expired token"})
		}
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.JSON(http.StatusUnauthorized, echo.Map{"error": "invalid token claims"})
		}
		if uid, ok := claims["user_id"].(float64); ok {
			c.Set("user_id", int(uid))
		}
		return next(c)
	}
}
