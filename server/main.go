package main

import (
	"disarm/main/controllers"
	"disarm/main/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	models.ConnectDataBase()

	r := gin.Default()

	api := r.Group("/api")
	{
		api.POST("/peha", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"peha": "hape",
			})
		})
		user := api.Group("/user")
		{
			user.POST("/add", controllers.AddUser)
		}
	}

	r.Run(":8000")
}
