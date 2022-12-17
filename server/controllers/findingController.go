package controllers

import (
	"disarm/main/models"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func CreateFinding(c *gin.Context) {
	var body struct {
		Title          string `json:"title" binding:"required"`
		Risk           string `json:"risk" binding:"required"`
		ImpactedSystem string `json:"impactedSystem" binding:"required"`
		ProjectId      string `json:"projectId" binding:"required"`
		ChecklistId    string `json:"checklistId" binding:"required"`
		UserId         string `json:"userId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedTitle := html.EscapeString(strings.TrimSpace(body.Title))
	escapedRisk := html.EscapeString(strings.TrimSpace(body.Risk))
	escapedImpactedSystem := html.EscapeString(strings.TrimSpace(body.ImpactedSystem))
	escapedProjectId := html.EscapeString(strings.TrimSpace(body.ProjectId))
	escapedChecklistId := html.EscapeString(strings.TrimSpace(body.ChecklistId))
	escapedUserId := html.EscapeString(strings.TrimSpace(body.UserId))

	finding, dbErr := models.Findings.Create(escapedTitle, escapedRisk, escapedImpactedSystem, escapedProjectId, escapedChecklistId, escapedUserId)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"finding": finding,
	})
}

func GetAllFinding(c *gin.Context) {
	findings, dbErr := models.Findings.GetAll()

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"findings": findings,
	})
}
