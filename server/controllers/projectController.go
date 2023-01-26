package controllers

import (
	"disarm/main/models"
	"html"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

var PROJECT_ACTION_TYPES = []string{"view", "view-detail", "edit", "delete"}
var PROJECT_FINDING_ACTION_TYPES = []string{"create"}

func CreateProject(c *gin.Context) {
	var body struct {
		Name        string `json:"name" binding:"required"`
		Company     string `json:"company" binding:"required"`
		Phase       string `json:"phase"`
		StartDate   string `json:"start_date" binding:"required"`
		EndDate     string `json:"end_date" binding:"required"`
		ChecklistId string `json:"checklist" binding:"required"`
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
	// escapedStartDate := html.EscapeString(strings.TrimSpace(body.StartDate))
	// escapedEndDate := html.EscapeString(strings.TrimSpace(body.EndDate))
	escapedChecklistId := html.EscapeString(strings.TrimSpace(body.ChecklistId))
	checklistUuid, errUuid := uuid.FromString(escapedChecklistId)

	if escapedPhase == "" {
		escapedPhase = "Idle"
	}

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	startDate, sErr := time.Parse("2006-01-02", body.StartDate)
	if sErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": sErr.Error(),
		})
		return
	}

	endDate, eErr := time.Parse("2006-01-02", body.EndDate)
	if eErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": eErr.Error(),
		})
		return
	}

	project, dbErr := models.Projects.Create(escapedName, escapedCompany, escapedPhase, startDate, endDate, checklistUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	permissionErr := CreatePermission(PROJECT_ACTION_TYPES, "project", project.ID, project.Name)
	if permissionErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": permissionErr,
		})
		return
	}

	findingPermissionErr := CreatePermission(PROJECT_FINDING_ACTION_TYPES, "finding", project.ID, project.Name)
	if findingPermissionErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": findingPermissionErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"project": project,
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
		Name      string `json:"name" binding:"required"`
		Company   string `json:"company" binding:"required"`
		Phase     string `json:"phase" binding:"required"`
		StartDate string `json:"start_date" binding:"required"`
		EndDate   string `json:"end_date" binding:"required"`
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

	idUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	startDate, sErr := time.Parse("2006-01-02", body.StartDate)
	if sErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": sErr.Error(),
		})
		return
	}

	endDate, eErr := time.Parse("2006-01-02", body.EndDate)
	if eErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": eErr.Error(),
		})
		return
	}

	project, dbErr := models.Projects.Edit(idUuid, escapedName, escapedCompany, escapedPhase, startDate, endDate)

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

func EditProjectSection(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Sections string `json:"sections" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))
	escapedSections := strings.TrimSpace(body.Sections)

	idUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	project, dbErr := models.Projects.EditSection(idUuid, escapedSections)

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
	idUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	uuids := []uuid.UUID{idUuid}

	result, dbErr := models.Projects.Delete(uuids)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	for _, idUuid := range uuids {
		permissionErr := DeletePermission(PROJECT_ACTION_TYPES, "project", idUuid)
		if permissionErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": permissionErr,
			})
			return
		}

		findingPermissionErr := DeletePermission(PROJECT_FINDING_ACTION_TYPES, "finding", idUuid)
		if findingPermissionErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": findingPermissionErr,
			})
			return
		}
	}

	c.JSON(200, gin.H{
		"result": result,
	})
}

func DeleteProjectByIds(c *gin.Context) {
	var body struct {
		Ids []string `json:"ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var parsedUuids []uuid.UUID
	for _, element := range body.Ids {
		parsedUuids = append(parsedUuids, uuid.FromStringOrNil(html.EscapeString(strings.TrimSpace(element))))
	}

	result, dbErr := models.Projects.Delete(parsedUuids)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	for _, idUuid := range parsedUuids {
		permissionErr := DeletePermission(PROJECT_ACTION_TYPES, "project", idUuid)
		if permissionErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": permissionErr,
			})
			return
		}

		findingPermissionErr := DeletePermission(PROJECT_FINDING_ACTION_TYPES, "finding", idUuid)
		if findingPermissionErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": findingPermissionErr,
			})
			return
		}
	}

	c.JSON(200, gin.H{
		"result": result,
	})
}
