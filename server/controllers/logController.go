package controllers

import (
	"disarm/main/models"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func CreateLog(c *gin.Context) {
	var body struct {
		Endpoint string `json:"endpoint" binding:"required"`
		Payload  string `json:"payload" binding:"required"`
		UserId   string `json:"userId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedEndpoint := html.EscapeString(strings.TrimSpace(body.Endpoint))
	escapedPayload := html.EscapeString(strings.TrimSpace(body.Payload))
	escapedUserId := html.EscapeString(strings.TrimSpace(body.UserId))

	userUuid, errUuid := uuid.FromString(escapedUserId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	log, dbErr := models.Logs.Create(escapedEndpoint, escapedPayload, userUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"log": log,
	})
}

func GetAllLog(c *gin.Context) {
	logs, dbErr := models.Logs.GetAll()

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"logs": logs,
	})
}
