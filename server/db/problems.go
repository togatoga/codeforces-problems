package db

import (
	"context"
	"net/http"
	"sort"

	"github.com/labstack/echo"
	"github.com/togatoga/goforces"
)

//Problem represents a Codefoces problem
type Problem struct {
	ID          int      `json:"id"`
	ContestID   int      `json:"contest_id"`
	Name        string   `json:"name"`
	Index       string   `json:"index"`
	Points      float32  `json:"points"`
	Tags        []string `json:"tags" sql:",array"`
	SolvedCount int      `json:"solved_count"`
	ProblemKey  string   `json:"problem_key"`
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

func converToProblems(apiProblems *goforces.Problems) (problems []*Problem) {
	mapContestIDToSolvedCnt := getMapContestIDToSolvedCnt(apiProblems.ProblemStatistics)
	sort.Slice(apiProblems.Problems, func(i, j int) bool {
		if apiProblems.Problems[i].ContestID != apiProblems.Problems[j].ContestID {
			return apiProblems.Problems[i].ContestID < apiProblems.Problems[j].ContestID
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

		problems = append(problems, problem)
	}
	return problems
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
	_, err = d.Db.Model(&problems).OnConflict("(problem_key) DO UPDATE").Set("tags = EXCLUDED.tags").Set("solved_count = EXCLUDED.solved_count").Insert()
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, problems)
}

//Problems returns json data for all problems from db
func (d *DB) Problems(c echo.Context) (err error) {
	var problems []*Problem
	err = d.Db.Model(&problems).Order("id DESC").Select()
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, problems)
}
