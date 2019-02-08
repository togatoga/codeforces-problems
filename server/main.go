package main

import (
	"log"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	_ "github.com/lib/pq"
	"github.com/togatoga/codeforces-problems/server/api"
)

func main() {
	e := echo.New()
	//work around
	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	innerAPI, err := api.NewAPI("hitoshi", "codeforces-problems")
	defer innerAPI.Db.Close()
	if err != nil {
		log.Fatal(err)
	}
	//innerAPI
	e.GET("/v1/problems", innerAPI.Problems)
	e.Logger.Fatal(e.Start(":1323"))
}
