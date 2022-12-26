package controllers

import (
	"bytes"
	"disarm/main/models"
	"fmt"
	"html"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func CreateLog(userId uuid.UUID, c gin.Context, status string) (l *models.Log, e error) {
	body := new(bytes.Buffer)
	_, err := io.Copy(body, c.Request.Body)

	if err != nil {
		return nil, err
	}

	strbody := body.String()

	fmt.Println("Host " + c.Request.RequestURI)
	fmt.Println("Body " + strbody)

	escapedEndpoint := html.EscapeString(strings.TrimSpace(c.Request.RequestURI))
	escapedPayload := html.EscapeString(strings.TrimSpace(strbody))
	escapedStatus := html.EscapeString(strings.TrimSpace(status))
	escapedMethod := html.EscapeString(strings.TrimSpace(c.Request.Method))
	escapedIp := html.EscapeString(strings.TrimSpace(c.ClientIP()))

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
