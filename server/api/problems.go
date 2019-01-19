package api

import (
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
	// return c.JSON(http.StatusOK, u)
}
