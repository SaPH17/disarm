package controllers

import (
	"disarm/main/database"
	"disarm/main/models"
	"disarm/main/utils/token"
	"encoding/json"
	"fmt"
	"html"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
	"golang.org/x/crypto/bcrypt"
)

var USER_ACTION_TYPE = []string{"view", "edit", "delete"}

func CreateUser(c *gin.Context) {
	var body struct {
		Email           string   `json:"email" binding:"required"`
		Username        string   `json:"username" binding:"required"`
		Password        string   `json:"password"`
		SupervisorEmail string   `json:"direct_supervisor"`
		Groups          []string `json:"groups"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"bind error": err.Error(),
		})
		return
	}

	escapedUsername := html.EscapeString(strings.TrimSpace(body.Username))
	escapedEmail := html.EscapeString(strings.TrimSpace(body.Email))
	escapedDirectSupervisorEmail := html.EscapeString(strings.TrimSpace(body.SupervisorEmail))

	var supervisor models.User
	var dbErr error

	if escapedDirectSupervisorEmail != "" {
		supervisor, dbErr = models.Users.GetOneByEmail(escapedDirectSupervisorEmail)

		if dbErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": dbErr.Error(),
			})
			return
		}
	}

	if body.Password == "" {
		body.Password = CreatePassword()
	}

	hashedPassword, hashingErr := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if hashingErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": hashingErr.Error(),
		})
		return
	}

	var groups []models.Group

	if len(body.Groups) > 0 {
		var dbGroupErr error
		var groupIds []uuid.UUID
		for _, element := range body.Groups {
			groupIds = append(groupIds, uuid.FromStringOrNil(element))
		}
		groups, dbGroupErr = models.Groups.GetManyByIds(groupIds)

		if dbGroupErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": dbGroupErr,
			})
			return
		}
	}

	user, dbErr := models.Users.Create(escapedEmail, string(hashedPassword), escapedUsername, &supervisor, groups)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	permissionErr := CreatePermission(USER_ACTION_TYPE, "user", user.ID)
	if permissionErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": permissionErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"user":     user,
		"password": body.Password,
	})
}

func GetAllUser(c *gin.Context) {
	users, dbErr := models.Users.GetAll()

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"users": users,
	})
}

func GetManyGroupsByUser(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	currentUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	user, dbErr := models.Users.GetOneById(currentUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	var groups []models.Group
	retErr := database.DB.Get().Model(&user).Association("Groups").Find(&groups)

	if retErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": retErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"groups": groups,
	})
}

func GetUserById(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	currentUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	user, dbErr := models.Users.GetOneById(currentUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"user": user,
	})
}

type PermissionString struct {
	CreatePermissions struct {
		User      bool
		Project   bool
		Group     bool
		Checklist bool
		Log       bool
		Report    []string
		Finding   []string
	}

	ViewPermissions struct {
		User      []string
		Project   []string
		Group     []string
		Checklist []string
		Log       []string
		Report    []string
		Finding   []string
	}

	ViewDetailPermissions struct {
		User      []string
		Project   []string
		Group     []string
		Checklist []string
		Log       []string
		Report    []string
		Finding   []string
	}

	EditPermissions struct {
		User      []string
		Project   []string
		Group     []string
		Checklist []string
		Report    []string
		Finding   []string
	}

	DeletePermissions struct {
		User      []string
		Project   []string
		Group     []string
		Checklist []string
		Log       []string
		Report    []string
		Finding   []string
	}
}

func GetUserPermissions(c *gin.Context) {
	id := c.Param("id")
	escapedId := html.EscapeString(strings.TrimSpace(id))
	currentUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}
	user, dbErr := models.Users.GetOneById(currentUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	permissions := make([]string, len(user.Groups))
	for _, g := range user.Groups {
		var data map[string]interface{}
		jsonText := html.UnescapeString(g.Permissions)
		json.Unmarshal([]byte(jsonText), &data)

		fmt.Println("json", jsonText, data)

		for k, v := range data {
			fmt.Println(k)
			switch v := v.(type) {
			case map[string]interface{}:

				for ki, vi := range v {
					fmt.Println(ki, ":", vi)
				}

			}
		}

		permissions = append(permissions, g.Permissions)
	}

	c.JSON(200, gin.H{
		"permissions": permissions,
	})
}

func EditUser(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Email           string `json:"email" binding:"required"`
		Username        string `json:"username" binding:"required"`
		SupervisorEmail string `json:"direct_supervisor"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))
	escapedEmail := html.EscapeString(strings.TrimSpace(body.Email))
	escapedUsername := html.EscapeString(strings.TrimSpace(body.Username))
	escapedDirectSupervisorEmail := html.EscapeString(strings.TrimSpace(body.SupervisorEmail))

	var supervisor models.User
	var dbErr error

	if escapedDirectSupervisorEmail != "" {
		supervisor, dbErr = models.Users.GetOneByEmail(escapedDirectSupervisorEmail)

		if dbErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": dbErr.Error(),
			})
			return
		}
	}

	user, dbErr := models.Users.Edit(uuid.FromStringOrNil(escapedId), escapedEmail, escapedUsername, &supervisor)

	if dbErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": dbErr.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"user": user,
	})
}

func ResetUserPassword(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	escapedId := html.EscapeString(strings.TrimSpace(id))

	password := CreatePassword()
	isPasswordChanged := false

	if body.Password != "" {
		password = body.Password
		isPasswordChanged = true
	}

	hashedPassword, hashingErr := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if hashingErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": hashingErr.Error(),
		})
		return
	}

	user, dbErr := models.Users.ChangePassword(uuid.FromStringOrNil(escapedId), string(hashedPassword), isPasswordChanged)

	if dbErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": dbErr.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"user":     user,
		"password": password,
	})
}

func DeleteUser(c *gin.Context) {
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

	result, dbErr := models.Users.Delete(uuids)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	permissionErr := DeletePermission(USER_ACTION_TYPE, "user", idUuid)
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

func DeleteUserByIds(c *gin.Context) {
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

	result, dbErr := models.Users.Delete(parsedUuids)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	for _, idUuid := range parsedUuids {
		permissionErr := DeletePermission(USER_ACTION_TYPE, "user", idUuid)
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

func CreatePassword() string {
	rand.Seed(time.Now().UnixNano())
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890")

	b := make([]rune, 8)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}

	return string(b)
}

func ChangePassword(c *gin.Context) {
	var body struct {
		OldPassword string `json:"oldPassword" binding:"required"`
		Password    string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	userUuid, err := token.ExtractTokenID(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userById, getUserErr := models.Users.GetOneById(userUuid)

	if getUserErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": getUserErr,
		})
		return
	}

	passwErr := VerifyPassword(body.OldPassword, userById.Password)

	if passwErr != nil && passwErr == bcrypt.ErrMismatchedHashAndPassword {
		return
	}

	hashedPassword, hashingErr := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if hashingErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": hashingErr.Error(),
		})
		return
	}

	user, dbErr := models.Users.ChangePassword(userUuid, string(hashedPassword), true)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	c.JSON(200, gin.H{
		"user": user,
	})
}
