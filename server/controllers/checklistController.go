package controllers

import (
	"disarm/main/models"
	"disarm/main/utils/token"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

var CHECKLIST_ACTION_TYPE = []string{"view", "view-detail", "edit", "delete"}

func CreateChecklist(c *gin.Context) {
	var body struct {
		Name     string `json:"name" binding:"required"`
		Sections string `json:"sections" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedName := html.EscapeString(strings.TrimSpace(body.Name))
	escapedSections := strings.TrimSpace(body.Sections)

	createdByUuid, err := token.ExtractTokenID(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	checklist, dbErr := models.Checklists.Create(escapedName, "Active", createdByUuid, escapedSections)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	permissionErr := CreatePermission(CHECKLIST_ACTION_TYPE, "checklist", checklist.ID, checklist.Name)
	if permissionErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": permissionErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"checklist": checklist,
	})
}

func GetAllChecklist(c *gin.Context) {
	t, terr := token.ValidateToken(c)
	if terr != nil {
		c.String(http.StatusUnauthorized, "Unauthorized")
		c.Abort()
		return
	}

	ps, pserr := GetUserPermissions(t.String())
	if pserr != nil {
		c.String(http.StatusInternalServerError, "Error Parsing Permissions")
		c.Abort()
		return
	}

	all := false
	pids := []uuid.UUID{}
	for id, _ := range ps.ViewPermissions.Checklist {
		if id == "*" {
			all = true
			break
		}

		uid, uiderr := uuid.FromString(id)

		if uiderr != nil {
			c.String(http.StatusInternalServerError, "Error Parsing Permissions")
			c.Abort()
			return
		}

		pids = append(pids, uid)
	}

	var checklists []models.Checklist
	var dbErr error

	if all {
		checklists, dbErr = models.Checklists.GetAll()
	} else {
		checklists, dbErr = models.Checklists.GetManyByIds(pids)
	}

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
		Name     string `json:"name" binding:"required"`
		Sections string `json:"sections" binding:"required"`
		Status   string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))
	escapedName := html.EscapeString(strings.TrimSpace(body.Name))
	escapedSections := strings.TrimSpace(body.Sections)
	escapedStatus := strings.TrimSpace(body.Status)

	currentUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	checklist, dbErr := models.Checklists.Edit(currentUuid, escapedName, escapedSections, escapedStatus)

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
	idUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	uuids := []uuid.UUID{idUuid}

	result, dbErr := models.Checklists.Delete(uuids)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	permissionErr := DeletePermission(CHECKLIST_ACTION_TYPE, "checklist", idUuid)
	if permissionErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": permissionErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"result": result,
	})
}

func DeleteChecklistByIds(c *gin.Context) {
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

	result, dbErr := models.Checklists.Delete(parsedUuids)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	for _, idUuid := range parsedUuids {
		permissionErr := DeletePermission(CHECKLIST_ACTION_TYPE, "checklist", idUuid)
		if permissionErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": permissionErr,
			})
			return
		}
	}

	c.JSON(200, gin.H{
		"result": result,
	})
}
