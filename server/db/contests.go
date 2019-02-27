package db

import (
	"context"
	"net/http"
	"sort"

	"github.com/labstack/echo"
	"github.com/togatoga/goforces"
)

type Contest struct {
	ID              int    `json:"id"`
	ContestID       int64  `json:"contest_id"`
	Name            string `json:"name"`
	Type            string `json:"type"`
	Phase           string `json:"phase"`
	Frozen          bool   `json:"frozen"`
	DurationSeconds int64  `json:"duration_seconds"`
	StartUnixTime   int64  `json:"start_unix_time"`
}

func convertToContests(contestList []goforces.Contest) []*Contest {
	var contests []*Contest
	for _, c := range contestList {
		contest := new(Contest)
		contest.ContestID = c.ID
		contest.Name = c.Name
		contest.Type = c.Type
		contest.Phase = c.Phase
		contest.Frozen = c.Frozen
		contest.DurationSeconds = c.DurationSeconds
		contest.StartUnixTime = c.StartTimeSeconds

		contests = append(contests, contest)
	}
	return contests
}

func (d *DB) UpdateContests(c echo.Context) (err error) {
	api, err := goforces.NewClient(nil)
	if err != nil {
		return err
	}
	ctx := context.Background()
	contestList, err := api.GetContestList(ctx, nil)
	if err != nil {
		return err
	}
	sort.Slice(contestList, func(i, j int) bool {
		return contestList[i].ID < contestList[j].ID
	})

	contests := convertToContests(contestList)

	_, err = d.Db.Model(&contests).OnConflict("(contest_id) DO UPDATE").Set("phase = EXCLUDED.phase").Set("frozen = EXCLUDED.frozen").Insert()
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, contests)
}

func (d *DB) Contests(c echo.Context) (err error) {
	var contests []*Contest
	err = d.Db.Model(&contests).Select()
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, contests)
}
