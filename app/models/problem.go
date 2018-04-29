package models

import "github.com/jinzhu/gorm"

type Problem struct {
	gorm.Model
	ProblemID   string //ProblemID = ContestID + "_" + Index
	ContestID   string
	Index       string
	Name        string
	Points      string
	Tags        []string
	SolvedCount int
}
