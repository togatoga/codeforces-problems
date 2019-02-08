package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"sort"

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

func GetProblems() {
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
	for _, problem := range problems.Problems {
		//INSERT
		var id int
		err := db.QueryRow("INSERT INTO problem(contest_id, name, index, points, tags) VALUES($1, $2, $3, $4, $5) RETURNING id", problem.ContestID, problem.Name, problem.Index, problem.Points, pq.Array(problem.Tags)).Scan(&id)
		fmt.Println(id, err)
	}
}
func main() {
	GetProblems()
}
