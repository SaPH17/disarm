package controllers

import (
	"disarm/main/models"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func CreateProject(c *gin.Context) {
	var body struct {
		Name        string `json:"name" binding:"required"`
		Company     string `json:"company" binding:"required"`
		Phase       string `json:"phase" binding:"required"`
		ChecklistId string `json:"checklist_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedName := html.EscapeString(strings.TrimSpace(body.Name))
	escapedCompany := html.EscapeString(strings.TrimSpace(body.Company))
	escapedPhase := html.EscapeString(strings.TrimSpace(body.Phase))
	escapedChecklistId := html.EscapeString(strings.TrimSpace(body.ChecklistId))
	checklistUuid, errUuid := uuid.FromString(escapedChecklistId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}
	user, dbErr := models.Projects.Create(escapedName, escapedCompany, escapedPhase, checklistUuid)

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

func GetAllProject(c *gin.Context) {
	projects, dbErr := models.Projects.GetAll()

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"projects": projects,
	})
}

func GetProjectById(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	project, dbErr := models.Projects.GetOneById(uuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"project": project,
	})
}


func EditProject(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Name        string `json:"name" binding:"required"`
		Company     string `json:"company" binding:"required"`
		Phase       string `json:"phase" binding:"required"`
		ChecklistId string `json:"checklist_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))
	escapedName := html.EscapeString(strings.TrimSpace(body.Name))
	escapedCompany := html.EscapeString(strings.TrimSpace(body.Company))
	escapedPhase := html.EscapeString(strings.TrimSpace(body.Phase))
	escapedChecklistId := html.EscapeString(strings.TrimSpace(body.ChecklistId))

	idUuid, errUuid := uuid.FromString(escapedId)
	checklistUuid, errChecklistUuid := uuid.FromString(escapedChecklistId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	if errChecklistUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errChecklistUuid.Error(),
		})
		return
	}

	project, dbErr := models.Projects.Edit(idUuid, escapedName, escapedCompany, escapedPhase, checklistUuid)

	if dbErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": dbErr.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"project": project,
	})
}

func DeleteProject(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	result, dbErr := models.Projects.Delete(uuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"result": result,
	})
}
