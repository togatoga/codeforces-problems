package main

import (
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

	db := db.NewDB("postgres", "postgres", "codeforces_problems")
	defer db.Db.Close()

	//from db
	e.GET("api/v1/problems", db.Problems)
	e.GET("api/v1/contests", db.Contests)
	e.GET("api/v1/submissions", db.Submissions)

	//update data
	e.PUT("api/v1/problems", db.UpdateProblems)
	e.PUT("api/v1/submissions/:user", db.UpdateSubmissions)
	e.PUT("api/v1/contests", db.UpdateContests)

	e.Logger.Fatal(e.Start(":1323"))
}
