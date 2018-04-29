package controllers

import (
	"github.com/revel/revel"
)

type Api struct {
	*revel.Controller
}

func (c Api) Submission(handle string) revel.Result {
	data := make(map[string]interface{})
	c.Validation.Required(handle)
	if c.Validation.HasErrors() {
		c.Response.SetStatus(400)
		data["erro"] = "Error"
		return c.RenderJSON(data)
	}

	return c.RenderJSON(data)
}

func (c Api) User(handle string) revel.Result {
	data := make(map[string]interface{})
	c.Validation.Required(handle)
	if c.Validation.HasErrors() {
		c.Response.SetStatus(400)
		data["error"] = "Error"
		return c.RenderJSON(data)
	}
	c.Response.SetStatus(200)
	return c.RenderJSON(data)
}
