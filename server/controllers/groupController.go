package controllers

import (
	"disarm/main/models"
	"disarm/main/utils"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func CreateGroup(c *gin.Context) {
	var body struct {
		Name          string   `json:"name" binding:"required"`
		Description   string   `json:"description" binding:"required"`
		ParentGroupId string   `json:"parentGroupId"`
		Permissions   string   `json:"permissions" binding:"required"`
		Users         []string `json:"assignedUser"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedName := html.EscapeString(strings.TrimSpace(body.Name))
	escapedDescription := html.EscapeString(strings.TrimSpace(body.Description))
	escapedParentGroupId := html.EscapeString(strings.TrimSpace(body.ParentGroupId))
	escapedPermissions := html.EscapeString(strings.TrimSpace(body.Permissions))

	parentGroupId := utils.GetNullableString(escapedParentGroupId)

	var users []models.User

	if len(body.Users) > 0 {
		var dbUserErr error
		var userIds []uuid.UUID
		for _, element := range body.Users {
			userIds = append(userIds, uuid.FromStringOrNil(element))
		}
		users, dbUserErr = models.Users.GetManyByIds(userIds)
		if dbUserErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": dbUserErr,
			})
			return
		}
	}

	group, dbErr := models.Groups.Create(escapedName, escapedDescription, parentGroupId, escapedPermissions, users)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"group": group,
	})
}

func GetAllGroup(c *gin.Context) {
	groups, dbErr := models.Groups.GetAll()

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"groups": groups,
	})
}

func GetGroupById(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	group, dbErr := models.Groups.GetOneById(uuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"group": group,
	})
}

func EditGroup(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Name          string `json:"name" binding:"required"`
		Description   string `json:"description" binding:"required"`
		ParentGroupId string `json:"parentGroupId"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))
	escapedName := html.EscapeString(strings.TrimSpace(body.Name))
	escapedDescription := html.EscapeString(strings.TrimSpace(body.Description))
	escapedParentGroupId := html.EscapeString(strings.TrimSpace(body.ParentGroupId))

	parentGroupId := utils.GetNullableString(escapedParentGroupId)

	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	group, dbErr := models.Groups.Edit(uuid, escapedName, escapedDescription, parentGroupId)

	if dbErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": dbErr.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"group": group,
	})
}

func EditGroupPermission(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Permissions string `json:"permissions" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))
	escapedPermissions := html.EscapeString(strings.TrimSpace(body.Permissions))

	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	group, dbErr := models.Groups.EditPermission(uuid, escapedPermissions)

	if dbErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": dbErr.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"group": group,
	})
}

func DeleteGroup(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	uuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	result, dbErr := models.Groups.Delete(uuid)

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
