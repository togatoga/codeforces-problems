package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/togatoga/codeforces-problems/server/api"
)

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/v1/problems", api.Problems)
	e.Logger.Fatal(e.Start(":1323"))
}
