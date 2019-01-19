package api

import (
	"net/http"

	"github.com/labstack/echo"
)

//Problem represents a struct for codeforces problem
type Problem struct {
	ContestID      int      `json:"contestId"`
	ProblemsetName string   `json:"problemsetName"`
	Index          string   `json:"index"`
	Name           string   `json:"name"`
	Type           string   `json:"name"`
	Points         string   `json:"points"`
	Tags           []string `json:"tags"`
}

func Problems(c echo.Context) (err error) {
	p := new(Problem)
	p.ContestID = 11514
	p.Name = "togatoga"
	return c.JSON(http.StatusOK, p)
}
