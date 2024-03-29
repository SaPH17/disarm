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

var GROUP_ACTION_TYPE = []string{"view", "edit", "delete"}

func CreateGroup(c *gin.Context) {
	var body struct {
		Name        string   `json:"name" binding:"required"`
		Description string   `json:"description" binding:"required"`
		Permissions string   `json:"permissions" binding:"required"`
		Users       []string `json:"assigned_user"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedName := html.EscapeString(strings.TrimSpace(body.Name))
	escapedDescription := html.EscapeString(strings.TrimSpace(body.Description))
	escapedPermissions := html.EscapeString(strings.TrimSpace(body.Permissions))

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

	group, dbErr := models.Groups.Create(escapedName, escapedDescription, escapedPermissions, users)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	permissionErr := CreatePermission(GROUP_ACTION_TYPE, "group", group.ID, group.Name)
	if permissionErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": permissionErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"group": group,
	})
}

func GetAllGroup(c *gin.Context) {
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
	for id, _ := range ps.ViewPermissions.Group {
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

	var groups []models.Group
	var dbErr error

	if all {
		groups, dbErr = models.Groups.GetAll()
	} else {
		groups, dbErr = models.Groups.GetManyByIds(pids)
	}

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	for idx, element := range groups {
		element.Permissions = html.UnescapeString(element.Permissions)
		groups[idx] = element
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
	group.Permissions = html.UnescapeString(group.Permissions)

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
		Name        string   `json:"name" binding:"required"`
		Description string   `json:"description" binding:"required"`
		Users       []string `json:"assigned_user"`
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

	groupUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
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

	group, dbErr := models.Groups.Edit(groupUuid, escapedName, escapedDescription, &users)

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

func AddUserToGroup(c *gin.Context) {
	var body struct {
		UserIds  []string `json:"user_ids" binding:"required"`
		GroupIds []string `json:"group_ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var users []models.User
	var parsedGroupUuids []uuid.UUID
	for _, element := range body.GroupIds {
		parsedGroupUuids = append(parsedGroupUuids, uuid.FromStringOrNil(html.EscapeString(strings.TrimSpace(element))))
	}

	if len(body.UserIds) > 0 {
		var dbUserErr error
		var userIds []uuid.UUID
		for _, element := range body.UserIds {
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

	groups, dbErr := models.Groups.AssignUser(parsedGroupUuids, &users)

	if dbErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": dbErr.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"groups": groups,
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

	result, dbErr := models.Groups.Delete(idUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	permissionErr := DeletePermission(GROUP_ACTION_TYPE, "group", idUuid)
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

func DeleteGroupByIds(c *gin.Context) {
	var body struct {
		Id string `json:"id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(body.Id))
	idUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": errUuid,
		})
		return
	}

	result, dbErr := models.Groups.Delete(idUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	permissionErr := DeletePermission(GROUP_ACTION_TYPE, "group", idUuid)
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
