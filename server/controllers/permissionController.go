package controllers

import (
	"disarm/main/database"
	"disarm/main/models"
	"net/http"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func CreatePermission(actionTypes []string, objectType string, objectId uuid.UUID, objectName string) error {
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
		_, dbErr := models.Permissions.Create(uuid, objectTypeUuid, objectId.String(), objectName)
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

func RefreshPermission(c *gin.Context) {
	permissions, _ := models.Permissions.GetAll()
	database.DB.Get().Delete(permissions)

	var types []models.PermissionObjectType
	database.DB.Get().Find(&types)

	var actions []models.PermissionAction
	database.DB.Get().Find(&actions)

	users, _ := models.Users.GetAll()
	projects, _ := models.Projects.GetAll()
	groups, _ := models.Groups.GetAll()
	checklists, _ := models.Checklists.GetAll()
	findings, _ := models.Findings.GetAll()

	var data []models.Permission

	for _, action := range actions {
		for _, pType := range types {
			if pType.Name == "report" {
				continue
			}

			if pType.Name == "group" && (existInArray(GROUP_ACTION_TYPE, action.Name) || action.Name == "create") {
				data = append(data, models.Permission{PermissionActionId: action.ID, ObjectTypeId: pType.ID, ObjectId: "*", ObjectName: "*"})
			} else if pType.Name == "project" && (existInArray(PROJECT_ACTION_TYPES, action.Name) || action.Name == "create") {
				data = append(data, models.Permission{PermissionActionId: action.ID, ObjectTypeId: pType.ID, ObjectId: "*", ObjectName: "*"})
			} else if pType.Name == "user" && (existInArray(USER_ACTION_TYPE, action.Name) || action.Name == "create") {
				data = append(data, models.Permission{PermissionActionId: action.ID, ObjectTypeId: pType.ID, ObjectId: "*", ObjectName: "*"})
			} else if pType.Name == "checklist" && (existInArray(CHECKLIST_ACTION_TYPE, action.Name) || action.Name == "create") {
				data = append(data, models.Permission{PermissionActionId: action.ID, ObjectTypeId: pType.ID, ObjectId: "*", ObjectName: "*"})
			} else if pType.Name == "finding" && (existInArray(CHECKLIST_ACTION_TYPE, action.Name) || action.Name == "create") {
				data = append(data, models.Permission{PermissionActionId: action.ID, ObjectTypeId: pType.ID, ObjectId: "*", ObjectName: "*"})
			}

			for _, user := range users {
				if pType.Name == "user" && existInArray(USER_ACTION_TYPE, action.Name) {
					data = append(data, models.Permission{PermissionActionId: action.ID, ObjectTypeId: pType.ID, ObjectId: user.ID.String(), ObjectName: user.Username})
				}
			}

			for _, group := range groups {
				if pType.Name == "group" && existInArray(GROUP_ACTION_TYPE, action.Name) {
					data = append(data, models.Permission{PermissionActionId: action.ID, ObjectTypeId: pType.ID, ObjectId: group.ID.String(), ObjectName: group.Name})
				}
			}

			for _, project := range projects {
				if pType.Name == "project" && existInArray(PROJECT_ACTION_TYPES, action.Name) {
					data = append(data, models.Permission{PermissionActionId: action.ID, ObjectTypeId: pType.ID, ObjectId: project.ID.String(), ObjectName: project.Name})
				}
				if pType.Name == "finding" && existInArray(PROJECT_FINDING_ACTION_TYPES, action.Name) {
					data = append(data, models.Permission{PermissionActionId: action.ID, ObjectTypeId: pType.ID, ObjectId: project.ID.String(), ObjectName: project.Name})
				}
			}

			for _, checklist := range checklists {
				if pType.Name == "checklist" && existInArray(CHECKLIST_ACTION_TYPE, action.Name) {
					data = append(data, models.Permission{PermissionActionId: action.ID, ObjectTypeId: pType.ID, ObjectId: checklist.ID.String(), ObjectName: checklist.Name})
				}
			}

			for _, finding := range findings {
				if pType.Name == "finding" && existInArray(FINDING_ACTION_TYPES, action.Name) {
					data = append(data, models.Permission{PermissionActionId: action.ID, ObjectTypeId: pType.ID, ObjectId: finding.ID.String(), ObjectName: finding.Title})
				}
			}
		}
	}

	database.DB.Get().Create(data)
}

func existInArray(hay []string, needle string) bool {
	for _, e := range hay {
		if e == needle {
			return true
		}
	}

	return false
}
