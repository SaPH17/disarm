package main

import (
	"disarm/main/controllers"
	"disarm/main/database"

	"github.com/gin-gonic/gin"
)

func main() {

	r := gin.Default()

	api := r.Group("/api")
	{
		user := api.Group("/user")
		{
			user.POST("/create", controllers.CreateUser)
		}
	}

	database.DB.Migrate()

	r.Run(":8000")
}
