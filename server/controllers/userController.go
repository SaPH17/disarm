package controllers

import (
	"disarm/main/database"
	"disarm/main/models"

	"github.com/gin-gonic/gin"
)

func CreateUser(c *gin.Context) {
	var body struct {
		Username string
		Password string
	}

	c.Bind(&body)

	user := models.User{Username: body.Username, Password: body.Password}
	result := database.DB.Get().Create(&user)

	if result.Error != nil {
		c.Status(400)
		return
	}

	c.JSON(200, gin.H{
		"user": user,
	})
}
