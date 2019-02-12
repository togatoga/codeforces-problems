package main

import (
	"log"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	_ "github.com/lib/pq"
	"github.com/togatoga/codeforces-problems/server/db"
)

func main() {
	e := echo.New()
	//work around
	e.Debug = true
	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	db, err := db.NewDB("postgres", "postgres", "codeforces_problems")
	defer db.Db.Close()
	if err != nil {
		log.Fatal(err)
	}
	//from db
	e.GET("/v1/problems", db.Problems)
	e.GET("/v1/contests", db.Contests)
	e.GET("/v1/submissions", db.Submissions)

	e.Logger.Fatal(e.Start(":1323"))
}
