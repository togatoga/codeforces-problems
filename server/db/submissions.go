package db

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/labstack/echo"
	"github.com/parnurzeal/gorequest"
	"github.com/togatoga/goforces"
)

type Submission struct {
	ID                  int    `json:"id"`
	SubmissionID        int    `json:"submission_id"`
	Handle              string `json:"handle"`
	ContestID           int    `json:"contest_id"`
	Index               string `json:"index"`
	CreateUnixTime      int64  `json:"create_unix_time"`
	ProgrammingLanguage string `json:"programming_language"`
	Verdict             string `json:"verdict"`
	ProblemKey          string `json:"problem_key"`
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

func (d *DB) UpdateSubmissions(c echo.Context) (err error) {
	user := c.Param("user")
	api, err := goforces.NewClient(nil)
	if err != nil {
		return err
	}
	ctx := context.Background()
	apiSubmissions, err := api.GetUserStatus(ctx, user, nil)
	if err != nil {
		return err
	}
	var submissions []*Submission
	for _, apiSubmission := range apiSubmissions {
		s := new(Submission)
		s.SubmissionID = apiSubmission.ID
		s.ContestID = apiSubmission.Problem.ContestID
		s.Index = apiSubmission.Problem.Index
		s.Handle = user
		s.CreateUnixTime = apiSubmission.CreationTimeSeconds
		s.ProgrammingLanguage = apiSubmission.ProgrammingLanguage
		s.Verdict = apiSubmission.Verdict
		s.ProblemKey = getProblemKey(apiSubmission.Problem.ContestID, apiSubmission.Problem.Index)
		submissions = append(submissions, s)
	}
	_, err = d.Db.Model(&submissions).OnConflict("(submission_id) DO NOTHING").Insert()
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, submissions)
}

//Submissions returns json data for user submissions from db
func (d *DB) Submissions(c echo.Context) (err error) {
	users := c.QueryParam("users")
	userList := parseUsers(users)

	var submissions []*Submission
	for _, user := range userList {
		go func() {
			request := gorequest.New()
			//TODO Replace hard coded link with dynamic link depends on enviroments
			_, _, err := request.Put(fmt.Sprintf("http://localhost:1323/api/v1/submissions/%s", user)).End()
			if err != nil {
				c.Echo().Logger.Error(err)
			}
		}()
		var s []*Submission
		err = d.Db.Model(&s).Where("handle = ?", user).Select()
		if err != nil {
			return err
		}
		submissions = append(submissions, s...)
	}

	return c.JSON(http.StatusOK, submissions)
}
