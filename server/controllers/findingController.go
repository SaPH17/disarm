package controllers

import (
	"disarm/main/models"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func CreateFinding(c *gin.Context) {
	var body struct {
		Title          string `json:"title" binding:"required"`
		Risk           string `json:"risk" binding:"required"`
		ImpactedSystem string `json:"impacted_system" binding:"required"`
		ProjectId      string `json:"project_id" binding:"required"`
		ChecklistId    string `json:"checklist_id" binding:"required"`
		UserId         string `json:"user_id" binding:"required"`
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

	projectUuid, errProject := uuid.FromString(escapedProjectId)
	checklistUuid, errChecklist := uuid.FromString(escapedChecklistId)
	userUuid, errUser := uuid.FromString(escapedUserId)

	if errProject != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errProject.Error(),
		})
		return
	}

	if errChecklist != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errChecklist.Error(),
		})
		return
	}

	if errUser != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUser.Error(),
		})
		return
	}

	finding, dbErr := models.Findings.Create(escapedTitle, escapedRisk, escapedImpactedSystem, projectUuid, checklistUuid, userUuid)

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

func GetFindingById(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	finding, dbErr := models.Findings.GetOneById(uuid)

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

func EditFinding(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Title          string `json:"title" binding:"required"`
		Risk           string `json:"risk" binding:"required"`
		ImpactedSystem string `json:"impacted_system" binding:"required"`
		ProjectId      string `json:"project_id" binding:"required"`
		ChecklistId    string `json:"checklist_id" binding:"required"`
		UserId         string `json:"user_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))
	escapedTitle := html.EscapeString(strings.TrimSpace(body.Title))
	escapedRisk := html.EscapeString(strings.TrimSpace(body.Risk))
	escapedImpactedSystem := html.EscapeString(strings.TrimSpace(body.ImpactedSystem))
	escapedProjectId := html.EscapeString(strings.TrimSpace(body.ProjectId))
	escapedChecklistId := html.EscapeString(strings.TrimSpace(body.ChecklistId))
	escapedUserId := html.EscapeString(strings.TrimSpace(body.UserId))

	idUuid, errUuid := uuid.FromString(escapedId)
	projectUuid, errProject := uuid.FromString(escapedProjectId)
	checklistUuid, errChecklist := uuid.FromString(escapedChecklistId)
	userUuid, errUser := uuid.FromString(escapedUserId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	if errProject != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errProject.Error(),
		})
		return
	}

	if errChecklist != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errChecklist.Error(),
		})
		return
	}

	if errUser != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUser.Error(),
		})
		return
	}

	finding, dbErr := models.Findings.Edit(idUuid, escapedTitle, escapedRisk, escapedImpactedSystem, projectUuid, checklistUuid, userUuid)

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
