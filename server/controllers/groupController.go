package controllers

import (
	"disarm/main/models"
	"html"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func CreateGroup(c *gin.Context) {
	var body struct {
		Name          string `json:"name" binding:"required"`
		Description   string `json:"description" binding:"required"`
		ParentGroupId string `json:"parentGroupId" binding:"required"`
		Permissions   string `json:"permissions" binding:"required"`
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

	groupUuid, errGroup := uuid.FromString(escapedParentGroupId)

	if errGroup != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errGroup.Error(),
		})
		return
	}

	group, dbErr := models.Groups.Create(escapedName, escapedDescription, groupUuid, escapedPermissions)

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
