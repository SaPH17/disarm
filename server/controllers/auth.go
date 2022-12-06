package controllers

import (
	"net/http"
  	"github.com/gin-gonic/gin"
)

type AddUserInput struct {
	username string `json:"username" binding:"required"`
	password string `json:"password" binding:"required"`
}

func AddUser(c *gin.Context) {

	var json AddUserInput

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if json.username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "username cannot be empty"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": json.username})
}