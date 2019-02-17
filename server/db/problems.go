package db

import (
	"context"
	"net/http"
	"sort"
	"time"

	"github.com/lib/pq"
	"github.com/togatoga/goforces"

	"github.com/labstack/echo"
)

//Problem represents a Codefoces problem
type Problem struct {
	ID          int      `json:"id"`
	ContestID   int      `json:"contest_id"`
	Name        string   `json:"name"`
	Index       string   `json:"index"`
	Points      int      `json:"points"`
	Tags        []string `json:"tags"`
	SolvedCount int      `json:"solved_count"`
	ProblemKey  string   `json:"problem_key"`
}

//Problems represents Codeforces problems
type Problems struct {
	Problems []*Problem `json:"problems"`
}

func getMapContestIDToSolvedCnt(problemStatistics []goforces.ProblemStatistics) map[string]int {
	mapContestIDToSolvedCnt := map[string]int{}
	for _, statistics := range problemStatistics {
		contestID := statistics.ContestID
		index := statistics.Index
		solvedCnt := statistics.SolvedCount
		problemKey := getProblemKey(contestID, index)
		mapContestIDToSolvedCnt[problemKey] = solvedCnt
	}
	return mapContestIDToSolvedCnt
}

func (d *DB) updateProblemTableIfNeeded(problems *goforces.Problems) (err error) {
	mapContestIDToSolvedCnt := getMapContestIDToSolvedCnt(problems.ProblemStatistics)
	sort.Slice(problems.Problems, func(i, j int) bool {
		if problems.Problems[i].ContestID != problems.Problems[j].ContestID {
			return problems.Problems[i].ContestID < problems.Problems[i].ContestID
		}
		return problems.Problems[i].Index < problems.Problems[j].Index
	})

	for _, problem := range problems.Problems {
		//INSERT
		var id int
		contestID := problem.ContestID
		index := problem.Index
		name := problem.Name
		points := problem.Points
		tags := problem.Tags
		problemKey := getProblemKey(contestID, index)
		solvedCnt := mapContestIDToSolvedCnt[problemKey]

		updateDate := time.Now()
		query := "INSERT INTO problem(contest_id, name, index, points, tags, solved_count, problem_key, update_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT(problem_key) DO UPDATE SET tags = $5, solved_count = $6  RETURNING id"
		err := d.Db.QueryRow(query, contestID, name, index, points, pq.Array(tags), solvedCnt, problemKey, updateDate).Scan(&id)
		if err != nil {
			return err
		}
	}
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

	if err = d.updateProblemTableIfNeeded(problems); err != nil {
		return err
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

	rows, err := d.Db.Query("SELECT id, contest_id, name, index, points, tags, solved_count, problem_key FROM problem")
	defer rows.Close()
	if err != nil {
		return err
	}
	var problems Problems
	for rows.Next() {
		problem := new(Problem)
		err := rows.Scan(&problem.ID, &problem.ContestID, &problem.Name, &problem.Index, &problem.Points, pq.Array(&problem.Tags), &problem.SolvedCount, &problem.ProblemKey)
		if err != nil {
			return err
		}
		problems.Problems = append(problems.Problems, problem)
	}
	return c.JSON(http.StatusOK, problems)
}
