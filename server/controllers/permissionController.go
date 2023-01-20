package controllers

import (
	"disarm/main/database"
	"disarm/main/models"
	"net/http"

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
