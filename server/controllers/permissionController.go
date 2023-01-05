package controllers

import (
	"disarm/main/database"
	"disarm/main/models"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func CreatePermission(actionTypes []string, objectType string, objectId uuid.UUID) error {
	var types []models.PermissionObjectType
	var actions []models.PermissionAction

	if dbErr := database.DB.Get().Find(&types).Error; dbErr != nil {
		return dbErr
	}

	if dbErr := database.DB.Get().Find(&actions).Error; dbErr != nil {
		return dbErr
	}

	var actionUuids []uuid.UUID
	var objectTypeUuid uuid.UUID

	for _, actionType := range actionTypes {
		for _, t := range actions {
			if actionType == t.Name {
				actionUuids = append(actionUuids, t.ID)
			}
		}
	}

	for _, element := range types {
		if element.Name == objectType {
			objectTypeUuid = element.ID
		}
	}

	for _, uuid := range actionUuids {
		_, dbErr := models.Permissions.Create(uuid, objectTypeUuid, objectId.String())
		if dbErr != nil {
			return dbErr
		}
	}

	return nil
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
		PermissionActionId string `json:"permission_action_id" binding:"required"`
		ObjectTypeId       string `json:"object_type_id" binding:"required"`
		ObjectId           string `json:"object_id" binding:"required"`
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

func DeletePermission(actionTypes []string, objectType string, objectId uuid.UUID) error {
	var types []models.PermissionObjectType
	var actions []models.PermissionAction

	if dbErr := database.DB.Get().Find(&types).Error; dbErr != nil {
		return dbErr
	}

	if dbErr := database.DB.Get().Find(&actions).Error; dbErr != nil {
		return dbErr
	}

	var actionUuids []uuid.UUID
	var objectTypeUuid uuid.UUID

	for _, actionType := range actionTypes {
		for _, t := range actions {
			if actionType == t.Name {
				actionUuids = append(actionUuids, t.ID)
			}
		}
	}

	for _, element := range types {
		if element.Name == objectType {
			objectTypeUuid = element.ID
		}
	}

	_, dbErr := models.Permissions.Delete(actionUuids, objectTypeUuid, objectId.String())
	if dbErr != nil {
		return dbErr
	}

	return nil
}
