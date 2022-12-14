package main

import (
	"disarm/main/controllers"
	"disarm/main/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {

	r := gin.Default()

	api := r.Group("/api")

	api.Use(middlewares.JwtAuthMiddleware())
	auth := api.Group("/auth")
	{
		auth.POST("/login", controllers.AuthenticateUser)
	}

	user := api.Group("/user")
	{
		user.POST("/create", controllers.CreateUser)
		user.POST("/get", controllers.GetAllUser)
	}

	r.Run(":8000")
}
