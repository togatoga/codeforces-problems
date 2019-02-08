package api

import (
	"net/http"

	"github.com/lib/pq"

	"github.com/labstack/echo"
)

//Problem represents a struct for the view
type Problem struct {
	ID        int      `json:"id"`
	ContestID int      `json:"contest_id"`
	Name      string   `json:"name"`
	Index     string   `json:"index"`
	Points    int      `json:"points"`
	Tags      []string `json:"tags"`
}

type Problems struct {
	Problems []*Problem `json:"problems"`
}

//Problems returns all problems json data
func (a *API) Problems(c echo.Context) (err error) {
	rows, err := a.Db.Query("SELECT id, contest_id, name, index, points, tags FROM problem")
	defer rows.Close()
	if err != nil {
		return err
	}
	var problems Problems
	for rows.Next() {
		problem := new(Problem)
		err := rows.Scan(&problem.ID, &problem.ContestID, &problem.Name, &problem.Index, &problem.Points, pq.Array(&problem.Tags))
		if err != nil {
			return err
		}
		problems.Problems = append(problems.Problems, problem)
	}
	return c.JSON(http.StatusOK, problems)
}
