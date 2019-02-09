package api

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/labstack/echo"
)

type Submission struct {
	ID                  int    `json:"id"`
	SubmissionID        int    `json:"submission_id"`
	Handle              string `json:"handle"`
	ContestID           int    `json:"contest_id"`
	Index               int    `json:"index"`
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

//Submissions returns json data for user submissions from db
func (a *API) Submissions(c echo.Context) (err error) {
	users := c.QueryParam("users")
	userList := parseUsers(users)

	var ss Submissions
	for _, user := range userList {
		query := fmt.Sprintf("SELECT id, submission_id, handle, contest_id, index, programming_language, verdict FROM submission WHERE handle = '%s'", user)
		rows, err := a.Db.Query(query)
		defer rows.Close()
		if err != nil {
			return err
		}

		for rows.Next() {
			s := new(Submission)
			err := rows.Scan(&s.ID, s.Handle, s.SubmissionID, s.ContestID, s.Index, s.ProgrammingLanguage, s.Verdict)
			if err != nil {
				return err
			}
			ss.Submissions = append(ss.Submissions, s)
		}
	}
	return c.JSON(http.StatusOK, ss)
}
