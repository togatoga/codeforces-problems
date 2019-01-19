package api

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/labstack/echo"
	"github.com/togatoga/goforces"
)

func Problems(c echo.Context) (err error) {

	logger := log.New(os.Stderr, "*** ", log.LstdFlags)
	cli, _ := goforces.NewClient(logger)
	ctx := context.Background()
	problems, _ := cli.GetProblemSetProblems(ctx, nil)
	return c.JSON(http.StatusOK, problems)
}
