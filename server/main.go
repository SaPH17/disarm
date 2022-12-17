package main

import (
	"disarm/main/controllers"
	// "disarm/main/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {

	r := gin.Default()

	api := r.Group("/api")

	auth := api.Group("/auth")
	{
		auth.POST("/login", controllers.AuthenticateUser)
	}

	apiWithMiddleware := api.Group("")
	// apiWithMiddleware.Use(middlewares.JwtAuthMiddleware())

	user := apiWithMiddleware.Group("/users")
	{
		user.GET("/", controllers.GetAllUser)
		user.POST("/", controllers.CreateUser)
	}

	project := apiWithMiddleware.Group("/projects")
	{
		project.GET("/", controllers.GetAllProject)
		project.POST("/", controllers.CreateProject)
	}

	group := apiWithMiddleware.Group("/groups")
	{
		group.GET("/", controllers.GetAllGroup)
		group.POST("/", controllers.CreateGroup)
	}
	finding := apiWithMiddleware.Group("/findings")
	{
		finding.GET("/", controllers.GetAllFinding)
		finding.POST("/", controllers.CreateFinding)
	}

	r.Run(":8000")
}
