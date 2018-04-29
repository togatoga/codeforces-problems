package models

import "github.com/jinzhu/gorm"

type Submission struct {
	gorm.Model
	ID        int
	ProblemID string
	ContestID string
	Index     string
	Name      string //problem name
	Handle    string //handle name
	Verdict   string
}

func (s *Submission) Accepted() bool {
	if s.Verdict == "OK" {
		return true
	}
	return false
}
