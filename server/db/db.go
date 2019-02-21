package db

import (
	"github.com/go-pg/pg"
)

//DB represents a struct for
type DB struct {
	Db *pg.DB
}

//NewDB returns an DB pointer to communicate with the database
func NewDB(username, password, dbName string) *DB {
	db := pg.Connect(&pg.Options{
		User:     username,
		Password: password,
	})
	return &DB{Db: db}
}
