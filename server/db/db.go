package db

import (
	"database/sql"
	"fmt"
)

//DB represents a struct for
type DB struct {
	Db *sql.DB
}

//NewDB returns an DB pointer to communicate with the database
func NewDB(username, password, dbName string) (*DB, error) {
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable", username, password, dbName)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	return &DB{Db: db}, nil
}
