package controllers

import (
	"disarm/main/models"
	"fmt"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func CreateLog(userId uuid.UUID, body string, requestURI string, method string, ip string, status string) (l *models.Log, e error) {
	fmt.Println("Host " + requestURI)
	fmt.Println("Body " + body)

	escapedEndpoint := html.EscapeString(strings.TrimSpace(requestURI))
	escapedPayload := html.EscapeString(strings.TrimSpace(body))
	escapedStatus := html.EscapeString(strings.TrimSpace(status))
	escapedMethod := html.EscapeString(strings.TrimSpace(method))
	escapedIp := html.EscapeString(strings.TrimSpace(ip))

	log, dbErr := models.Logs.Create(escapedEndpoint, escapedPayload, escapedStatus, escapedMethod, escapedIp, userId)

	if dbErr != nil {
		return nil, dbErr
	}

	return &log, nil
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
