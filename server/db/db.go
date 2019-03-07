package db

import (
	"github.com/go-pg/pg"
)

//DB represents a struct for
type DB struct {
	Db      *pg.DB
	BaseURL string
	Port    string
}

//NewDB returns an DB pointer to communicate with the database
func NewDB(username, password, dbName, baseURL, port string) *DB {
	db := pg.Connect(&pg.Options{
		User:     username,
		Password: password,
		Database: dbName,
	})
	return &DB{Db: db, BaseURL: baseURL, Port: port}
}
