package controllers

import (
	"github.com/revel/revel"
)

type Api struct {
	*revel.Controller
}

func (c Api) Submission(handle string) revel.Result {
	c.Validation.Required(handle)
	if c.Validation.HasErrors() {

	}
	data := make(map[string]interface{})

	return c.RenderJSON(data)
}

func (c Api) User(handle string) revel.Result {
	c.Validation.Required(handle)
	if c.Validation.HasErrors() {
		c.Response.SetStatus(400)
	}

	data := make(map[string]interface{})
	c.Response.SetStatus(200)
	return c.RenderJSON(data)
}
