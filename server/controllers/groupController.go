package controllers

import (
	"disarm/main/models"
	"fmt"
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
		ParentGroupId string   `json:"parent_group_id"`
		Permissions   string   `json:"permissions" binding:"required"`
		Users         []string `json:"assigned_user"`
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

	var parentGroup models.Group
	var dbErr error

	if escapedParentGroupId != "" {
		parentGroup, dbErr = models.Groups.GetOneById(uuid.FromStringOrNil(escapedParentGroupId))

		if dbErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": dbErr.Error(),
			})
			return
		}
	}

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

	group, dbErr := models.Groups.Create(escapedName, escapedDescription, &parentGroup, escapedPermissions, users)

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

	for _, element := range groups {
		element.Permissions = html.UnescapeString(element.Permissions)
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

	group.Permissions = html.UnescapeString(group.Permissions)

	c.JSON(200, gin.H{
		"group": group,
	})
}

func EditGroup(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Name          string   `json:"name" binding:"required"`
		Description   string   `json:"description" binding:"required"`
		ParentGroupId string   `json:"parent_group_id"`
		Users         []string `json:"assigned_user"`
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

	groupUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	var parentGroup models.Group
	var dbErr error

	if escapedParentGroupId != "" {
		parentGroup, dbErr = models.Groups.GetOneById(uuid.FromStringOrNil(escapedParentGroupId))

		if dbErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": dbErr.Error(),
			})
			return
		}
	}

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

	group, dbErr := models.Groups.Edit(groupUuid, escapedName, escapedDescription, &parentGroup, &users)

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
	idUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	uuids := []uuid.UUID{idUuid}

	result, dbErr := models.Groups.Delete(uuids)

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

func DeleteGroupByIds(c *gin.Context) {
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

	fmt.Println(parsedUuids)

	result, dbErr := models.Groups.Delete(parsedUuids)

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
