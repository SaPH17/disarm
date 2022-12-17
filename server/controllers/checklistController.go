package controllers

import (
	"disarm/main/models"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func CreateChecklist(c *gin.Context) {
	var body struct {
		Name      string `json:"name" binding:"required"`
		Status    string `json:"status" binding:"required"`
		CreatedBy string `json:"createdBy" binding:"required"`
		Sections  string `json:"sections" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedName := html.EscapeString(strings.TrimSpace(body.Name))
	escapedStatus := html.EscapeString(strings.TrimSpace(body.Status))
	escapedCreatedBy := html.EscapeString(strings.TrimSpace(body.CreatedBy))
	escapedSections := html.EscapeString(strings.TrimSpace(body.Sections))

	createdByUuid, errUuid := uuid.FromString(escapedCreatedBy)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	checklist, dbErr := models.Checklists.Create(escapedName, escapedStatus, createdByUuid, escapedSections)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"checklist": checklist,
	})
}

func GetAllChecklist(c *gin.Context) {
	checklists, dbErr := models.Checklists.GetAll()

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"checklists": checklists,
	})
}

func GetChecklistById(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	checklist, dbErr := models.Checklists.GetOneById(uuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"checklist": checklist,
	})
}

func EditChecklist(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Name      string `json:"name" binding:"required"`
		Status    string `json:"status" binding:"required"`
		CreatedBy string `json:"createdBy" binding:"required"`
		Sections  string `json:"sections" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))
	escapedName := html.EscapeString(strings.TrimSpace(body.Name))
	escapedStatus := html.EscapeString(strings.TrimSpace(body.Status))
	escapedCreatedBy := html.EscapeString(strings.TrimSpace(body.CreatedBy))
	escapedSections := html.EscapeString(strings.TrimSpace(body.Sections))

	createdByUuid, errUuid := uuid.FromString(escapedCreatedBy)
	uuid, errCreatedByUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	if errCreatedByUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errCreatedByUuid.Error(),
		})
		return
	}

	checklist, dbErr := models.Checklists.Edit(uuid, escapedName, escapedStatus, createdByUuid, escapedSections)

	if dbErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": dbErr.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"checklist": checklist,
	})
}

func DeleteChecklist(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	result, dbErr := models.Checklists.Delete(uuid)

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
