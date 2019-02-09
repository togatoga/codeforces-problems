package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"sort"
	"strconv"
	"time"

	"github.com/togatoga/goforces"

	"github.com/lib/pq"
	_ "github.com/lib/pq"
)

var db *sql.DB
var api *goforces.Client

func init() {
	var err error
	connStr := "user=postgres password=postgres dbname=codeforces_problems sslmode=disable"

	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	api, err = goforces.NewClient(nil)
	if err != nil {
		log.Fatal(err)
	}
}

func GetAllProblems() {
	ctx := context.Background()
	problems, err := api.GetProblemSetProblems(ctx, nil)
	if err != nil {
		log.Fatal(err)
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
		mapToSolvedCnt[strconv.Itoa(contestID)+"_"+index] = solvedCnt
	}

	for _, problem := range problems.Problems {
		//INSERT
		var id int
		contestID := problem.ContestID
		index := problem.Index
		name := problem.Name
		points := problem.Points
		tags := problem.Tags
		solvedCnt := mapToSolvedCnt[strconv.Itoa(contestID)+"_"+index]
		updateDate := time.Now()
		err := db.QueryRow("INSERT INTO problem(contest_id, name, index, points, tags, solved_count, update_date) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id", contestID, name, index, points, pq.Array(tags), solvedCnt, updateDate).Scan(&id)
		fmt.Println(id, err)
	}
}
func main() {
	GetAllProblems()
}
