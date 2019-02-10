package db

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/togatoga/goforces"

	"github.com/labstack/echo"
)

type Submission struct {
	ID                  int    `json:"id"`
	SubmissionID        int    `json:"submission_id"`
	Handle              string `json:"handle"`
	ContestID           int    `json:"contest_id"`
	Index               string `json:"index"`
	ProgrammingLanguage string `json:"programming_language"`
	Verdict             string `json:"verdict"`
}

type Submissions struct {
	Submissions []*Submission `json:"submissions"`
}

func parseUsers(users string) []string {
	userList := strings.Split(users, ",")
	result := []string{}
	for _, user := range userList {
		if user != "" {
			result = append(result, user)
		}
	}
	return result
}

func (d *DB) updateSubmissionIfNeeded(user string) (err error) {
	query := fmt.Sprintf("SELECT COUNT(*) FROM submission WHERE handle = '%s'", user)
	rows, err := d.Db.Query(query)
	if err != nil {
		return err
	}
	var count int
	for rows.Next() {
		err = rows.Scan(&count)
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
	submissions, err := api.GetUserStatus(ctx, user, nil)
	if err != nil {
		return err
	}

	for _, submission := range submissions {
		submissionID := submission.ID
		contestID := submission.Problem.ContestID
		index := submission.Problem.Index
		handle := user
		programmingLanguage := submission.ProgrammingLanguage
		verdict := submission.Verdict
		var id int
		query := "INSERT INTO submission(submission_id, contest_id, index, handle, programming_language, verdict) VALUES($1, $2, $3, $4, $5, $6) RETURNING id"
		err := d.Db.QueryRow(query, submissionID, contestID, index, handle, programmingLanguage, verdict).Scan(&id)
		if err != nil {
			return err
		}
	}
	return nil
}

//Submissions returns json data for user submissions from db
func (d *DB) Submissions(c echo.Context) (err error) {
	users := c.QueryParam("users")
	userList := parseUsers(users)

	var ss Submissions
	for _, user := range userList {
		//Check whether need to update submission db
		err := d.updateSubmissionIfNeeded(user)
		if err != nil {
			c.Echo().Logger.Errorf(err.Error())
			continue
		}

		query := fmt.Sprintf("SELECT id, submission_id, handle, contest_id, index, programming_language, verdict FROM submission WHERE handle = '%s'", user)
		rows, err := d.Db.Query(query)

		defer rows.Close()
		if err != nil {
			return err
		}

		for rows.Next() {
			s := new(Submission)
			err := rows.Scan(&s.ID, &s.SubmissionID, &s.Handle, &s.ContestID, &s.Index, &s.ProgrammingLanguage, &s.Verdict)
			if err != nil {
				return err
			}
			ss.Submissions = append(ss.Submissions, s)
		}
	}

	return c.JSON(http.StatusOK, ss)
}
