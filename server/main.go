package main

import (
	"disarm/main/controllers"
	"disarm/main/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {

	r := gin.Default()

	r.Use(middlewares.CORSMiddleware())
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/login", controllers.AuthenticateUser)
		}
		apiWithJWT := api.Group("")
		apiWithJWT.Use(middlewares.JwtAuthMiddleware())

		user := apiWithJWT.Group("/users")
		{
			user.GET("/", controllers.GetAllUser)
			user.POST("/", controllers.CreateUser)
		}

		project := apiWithJWT.Group("/projects")
		{
			project.GET("/", controllers.GetAllProject)
			project.POST("/", controllers.CreateProject)
		}

		group := apiWithJWT.Group("/groups")
		{
			group.GET("/", controllers.GetAllGroup)
			group.GET("/:id", controllers.GetGroupById)
			group.PUT("/:id", controllers.EditGroup)
			group.DELETE("/:id", controllers.DeleteGroup)
			group.POST("/", controllers.CreateGroup)
		}
		
		finding := apiWithJWT.Group("/findings")
		{
			finding.GET("/", controllers.GetAllFinding)
			finding.POST("/", controllers.CreateFinding)
		}
	}

	r.Run(":8000")
}
