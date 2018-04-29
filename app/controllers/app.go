package controllers

import (
	"github.com/revel/revel"
)

type App struct {
	*revel.Controller
}

func (c App) Index(user, rivals string) revel.Result {
	return c.Render()
}
