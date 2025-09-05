package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
)

// Conn is the global database handle used by the application packages.
var Conn *sql.DB

// Connect initializes the global DB connection using the provided DSN.
func Connect(dsn string) error {
	var err error
	Conn, err = sql.Open("pgx", dsn)
	if err != nil {
		return fmt.Errorf("open db: %w", err)
	}
	if err = Conn.Ping(); err != nil {
		return fmt.Errorf("ping db: %w", err)
	}
	log.Println("DB connected")
	return nil
}

// InitializeDB connects to the database using the default DSN and sets up the global connection.
func InitializeDB() error {
	dsn := "postgresql://operateev_ai_user:Ivl7TSwqxRCKXQ7aq0Lwm2rFpGHG6YhD@dpg-d2taiube5dus73dldfo0-a/operateev_ai"
	if err := Connect(dsn); err != nil {
		log.Fatal("db connection failed: ", err)
	}
	return nil
}

// HealthCheck pings the database to ensure it is reachable.
func HealthCheck(ctx context.Context) error {
	if Conn == nil {
		return fmt.Errorf("db not initialized")
	}
	return Conn.PingContext(ctx)
}
