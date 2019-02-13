package db

import "strconv"

func getProblemKey(contestID int, index string) string {
	return strconv.Itoa(contestID) + "_" + index
}
