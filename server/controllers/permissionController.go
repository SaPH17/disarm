package controllers

import (
	"disarm/main/models"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func CreatePermission(c *gin.Context) {
	var body struct {
		PermissionActionId string `json:"permisionActionId" binding:"required"`
		ObjectTypeId       string `json:"objectTypeId" binding:"required"`
		ObjectId           string `json:"objectId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedPermissionActionId := html.EscapeString(strings.TrimSpace(body.PermissionActionId))
	escapedObjectTypeId := html.EscapeString(strings.TrimSpace(body.ObjectTypeId))
	escapedObjectId := html.EscapeString(strings.TrimSpace(body.ObjectId))

	actionUuid, errAction := uuid.FromString(escapedPermissionActionId)
	objectTypeUuid, errType := uuid.FromString(escapedObjectTypeId)

	if errAction != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errAction.Error(),
		})
		return
	}

	if errType != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errType.Error(),
		})
		return
	}

	permission, dbErr := models.Permissions.Create(actionUuid, objectTypeUuid, escapedObjectId)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"permission": permission,
	})
}

func GetAllPermission(c *gin.Context) {
	permissions, dbErr := models.Permissions.GetAll()

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"permissions": permissions,
	})
}

func EditPermission(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		PermissionActionId string `json:"permisionActionId" binding:"required"`
		ObjectTypeId       string `json:"objectTypeId" binding:"required"`
		ObjectId           string `json:"objectId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))
	escapedPermissionActionId := html.EscapeString(strings.TrimSpace(body.PermissionActionId))
	escapedObjectTypeId := html.EscapeString(strings.TrimSpace(body.ObjectTypeId))
	escapedObjectId := html.EscapeString(strings.TrimSpace(body.ObjectId))

	idUuid, errUuid := uuid.FromString(escapedId)
	actionUuid, errAction := uuid.FromString(escapedPermissionActionId)
	objectTypeUuid, errType := uuid.FromString(escapedObjectTypeId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errAction.Error(),
		})
		return
	}

	if errAction != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errAction.Error(),
		})
		return
	}

	if errType != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errType.Error(),
		})
		return
	}

	permission, dbErr := models.Permissions.Edit(idUuid, actionUuid, objectTypeUuid, escapedObjectId)

	if dbErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": dbErr.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"permission": permission,
	})
}

func DeletePermission(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	result, dbErr := models.Permissions.Delete(uuid)

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
