package main

import (
	"disarm/main/controllers"
	"disarm/main/middlewares"

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
	apiWithMiddleware.Use(middlewares.JwtAuthMiddleware())

	user := apiWithMiddleware.Group("/user")
	{
		user.POST("/create", controllers.CreateUser)
		user.GET("/get", controllers.GetAllUser)
	}
	
	r.Run(":8000")
}
