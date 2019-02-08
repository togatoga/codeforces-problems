package api

import (
	"database/sql"
	"fmt"
)

//API represents a struct for
type API struct {
	Db *sql.DB
}

//NewAPI returns an API pointer to communicate with the database
func NewAPI(username, password, dbName string) (*API, error) {
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable", username, password, dbName)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	return &API{Db: db}, nil
}
