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
func NewAPI(userName, dbName string) (*API, error) {
	connStr := fmt.Sprintf("user=%s dbname=%s sslmode=disable", userName, dbName)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}
	return &API{Db: db}, nil
}
