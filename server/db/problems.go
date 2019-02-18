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
	Points      float32  `json:"points"`
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

func converToProblems(apiProblems *goforces.Problems) (problems Problems) {
	mapContestIDToSolvedCnt := getMapContestIDToSolvedCnt(apiProblems.ProblemStatistics)
	sort.Slice(apiProblems.Problems, func(i, j int) bool {
		if apiProblems.Problems[i].ContestID != apiProblems.Problems[j].ContestID {
			return apiProblems.Problems[i].ContestID < apiProblems.Problems[i].ContestID
		}
		return apiProblems.Problems[i].Index < apiProblems.Problems[j].Index
	})

	for _, apiProblem := range apiProblems.Problems {
		problem := new(Problem)

		problem.ContestID = apiProblem.ContestID
		problem.Index = apiProblem.Index
		problem.Name = apiProblem.Name
		problem.Points = apiProblem.Points
		problem.Tags = apiProblem.Tags
		problem.ProblemKey = getProblemKey(apiProblem.ContestID, apiProblem.Index)
		problem.SolvedCount = mapContestIDToSolvedCnt[problem.ProblemKey]

		problems.Problems = append(problems.Problems, problem)
	}
	return problems
}

func (d *DB) updateProblemTableIfNeeded(problems Problems) (err error) {
	for _, problem := range problems.Problems {
		//INSERT
		var id int
		contestID := problem.ContestID
		index := problem.Index
		name := problem.Name
		points := problem.Points
		tags := problem.Tags
		problemKey := problem.ProblemKey
		solvedCnt := problem.SolvedCount

		updateDate := time.Now()
		query := "INSERT INTO problem(contest_id, name, index, points, tags, solved_count, problem_key, update_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT(problem_key) DO UPDATE SET tags = $5, solved_count = $6  RETURNING id"
		err := d.Db.QueryRow(query, contestID, name, index, points, pq.Array(tags), solvedCnt, problemKey, updateDate).Scan(&id)
		if err != nil {
			return err
		}
	}
	return nil
}

func (d *DB) UpdateProblems(c echo.Context) (err error) {
	api, err := goforces.NewClient(nil)
	if err != nil {
		return err
	}
	ctx := context.Background()
	rawProblems, err := api.GetProblemSetProblems(ctx, nil)
	if err != nil {
		return err
	}
	problems := converToProblems(rawProblems)

	if err = d.updateProblemTableIfNeeded(problems); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, problems)
}

//Problems returns json data for all problems from db
func (d *DB) Problems(c echo.Context) (err error) {
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
