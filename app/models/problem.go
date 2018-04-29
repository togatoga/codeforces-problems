package models

type Problem struct {
	ContestID   string
	Index       string
	Name        string
	Points      string
	Tags        []string
	SolvedCount int
}

func (p *Problem) ProblemID() string {
	return p.ContestID + "_" + p.Index
}
