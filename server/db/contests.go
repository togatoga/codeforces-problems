package db

import (
	"net/http"

	"github.com/labstack/echo"
)

type Contest struct {
	ID              int    `json:"id"`
	ContestID       int    `json:"contest_id"`
	Name            string `json:"name"`
	Type            string `json:"type"`
	Phase           int    `json:"phase"`
	Frozen          bool   `json:"frozen"`
	DurationSeconds int    `json:"duration_seconds"`
	StartUnixTime   int    `json:"start_unix_time"`
}

type Contests struct {
	Contests []*Contest `json:contests`
}

func (d *DB) Contests(c echo.Context) (err error) {
	var contests Contests
	return c.JSON(http.StatusOK, contests)
}
