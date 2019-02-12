package db

import (
	"context"
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/lib/pq"
	"github.com/togatoga/goforces"

	"github.com/labstack/echo"
)

//Problem represents a struct for the view
type Problem struct {
	ID          int      `json:"id"`
	ContestID   int      `json:"contest_id"`
	Name        string   `json:"name"`
	Index       string   `json:"index"`
	Points      int      `json:"points"`
	Tags        []string `json:"tags"`
	SolvedCount int      `json:"solved_count"`
	UniqueKey   string   `json:"unique_key"`
}

type Problems struct {
	Problems []*Problem `json:"problems"`
}

func (d *DB) updateProblemIfNeeded() (err error) {
	rows, err := d.Db.Query("SELECT COUNT(*) from problem")
	defer rows.Close()
	if err != nil {
		return err
	}
	var count int
	for rows.Next() {
		err := rows.Scan(&count)
		if err != nil {
			return err
		}
	}
	//Not empty
	if count > 0 {
		return nil
	}

	api, err := goforces.NewClient(nil)
	if err != nil {
		return err
	}
	ctx := context.Background()
	problems, err := api.GetProblemSetProblems(ctx, nil)
	if err != nil {
		return err
	}

	sort.Slice(problems.Problems, func(i, j int) bool {
		if problems.Problems[i].ContestID != problems.Problems[j].ContestID {
			return problems.Problems[i].ContestID < problems.Problems[i].ContestID
		}
		return problems.Problems[i].Index < problems.Problems[j].Index
	})

	mapToSolvedCnt := map[string]int{}
	for _, statistics := range problems.ProblemStatistics {
		contestID := statistics.ContestID
		index := statistics.Index
		solvedCnt := statistics.SolvedCount
		uniqueKey := strconv.Itoa(contestID) + "_" + index
		mapToSolvedCnt[uniqueKey] = solvedCnt
	}

	for _, problem := range problems.Problems {
		//INSERT
		var id int
		contestID := problem.ContestID
		index := problem.Index
		name := problem.Name
		points := problem.Points
		tags := problem.Tags
		uniqueKey := strconv.Itoa(contestID) + "_" + index
		solvedCnt := mapToSolvedCnt[uniqueKey]

		updateDate := time.Now()
		query := "INSERT INTO problem(contest_id, name, index, points, tags, solved_count, unique_key, update_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT(unique_key) DO UPDATE SET tags = $5, solved_count = $6  RETURNING id"
		err := d.Db.QueryRow(query, contestID, name, index, points, pq.Array(tags), solvedCnt, uniqueKey, updateDate).Scan(&id)
		if err != nil {
			return err
		}
	}

	return nil
}

//Problems returns json data for all problems from db
func (d *DB) Problems(c echo.Context) (err error) {
	//Check whether need to update problem table
	err = d.updateProblemIfNeeded()
	if err != nil {
		return err
	}

	rows, err := d.Db.Query("SELECT id, contest_id, name, index, points, tags, solved_count, unique_key FROM problem")
	defer rows.Close()
	if err != nil {
		return err
	}
	var problems Problems
	for rows.Next() {
		problem := new(Problem)
		err := rows.Scan(&problem.ID, &problem.ContestID, &problem.Name, &problem.Index, &problem.Points, pq.Array(&problem.Tags), &problem.SolvedCount, &problem.UniqueKey)
		if err != nil {
			return err
		}
		problems.Problems = append(problems.Problems, problem)
	}
	return c.JSON(http.StatusOK, problems)
}
