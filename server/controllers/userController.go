package controllers

import (
	"disarm/main/models"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(c *gin.Context) {
	var body struct {
		Email    string `json:"email" binding:"required"`
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedUsername := html.EscapeString(strings.TrimSpace(body.Username))
	escapedEmail := html.EscapeString(strings.TrimSpace(body.Email))
	hashedPassword, hashingErr := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if hashingErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": hashingErr.Error(),
		})
		return
	}

	user, dbErr := models.Users.Create(escapedEmail, string(hashedPassword), escapedUsername)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"user": user,
	})
}

func GetAllUser(c *gin.Context) {
	users, dbErr := models.Users.GetAll()

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"users": users,
	})
}

func GetUserById(c *gin.Context) {

}
