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
	ContestID       int    `json:"contest_id"`
	Name            string `json:"name"`
	Type            string `json:"type"`
	Phase           string `json:"phase"`
	Frozen          bool   `json:"frozen"`
	DurationSeconds int64  `json:"duration_seconds"`
	StartUnixTime   int64  `json:"start_unix_time"`
}

type Contests struct {
	Contests []*Contest `json:"contests"`
}

func (d *DB) updateContestsIfNeeded() (err error) {
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
	contestList, err := api.GetContestList(ctx, nil)
	if err != nil {
		return err
	}
	sort.Slice(contestList, func(i, j int) bool {
		return contestList[i].ID < contestList[j].ID
	})

	for _, c := range contestList {
		var id int
		query := "INSERT INTO contest(contest_id, name, type, phase, frozen, duration_seconds, start_unix_time) VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT(contest_id) DO UPDATE set phase = $4, frozen = $5 RETURNING id"
		err = d.Db.QueryRow(query, c.ID, c.Name, c.Type, c.Phase, c.Frozen, c.DurationSeconds, c.StartTimeSeconds).Scan(&id)
		if err != nil {
			return err
		}
	}
	return nil
}

func (d *DB) Contests(c echo.Context) (err error) {
	err = d.updateContestsIfNeeded()
	if err != nil {
		return err
	}
	rows, err := d.Db.Query("SELECT id, contest_id, name, type, phase, frozen, duration_seconds, start_unix_time FROM contest")
	defer rows.Close()
	if err != nil {
		return err
	}
	var contests Contests
	for rows.Next() {
		contest := new(Contest)
		err = rows.Scan(&contest.ID, &contest.ContestID, &contest.Name, &contest.Type, &contest.Phase, &contest.Frozen, &contest.DurationSeconds, &contest.StartUnixTime)
		if err != nil {
			return err
		}
		contests.Contests = append(contests.Contests, contest)
	}

	return c.JSON(http.StatusOK, contests)
}
