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

	permissionErr := CreatePermission(USER_ACTION_TYPE, "user", user.ID, user.Username)
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
	for id, _ := range ps.ViewPermissions.User {
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

	pids = append(pids, t)

	var users []models.User
	var dbErr error

	if all {
		users, dbErr = models.Users.GetAll()
	} else {
		users, dbErr = models.Users.GetManyByIds(pids)
	}

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

type CreatePermissions struct {
	User      map[string]bool
	Project   map[string]bool
	Group     map[string]bool
	Checklist map[string]bool
	Log       map[string]bool
	Report    map[string]bool
	Finding   map[string]bool
}

type ViewPermissions struct {
	User      map[string]bool
	Project   map[string]bool
	Group     map[string]bool
	Checklist map[string]bool
	Log       map[string]bool
	Report    map[string]bool
	Finding   map[string]bool
}

type ViewDetailPermissions struct {
	User      map[string]bool
	Project   map[string]bool
	Group     map[string]bool
	Checklist map[string]bool
	Log       map[string]bool
	Report    map[string]bool
	Finding   map[string]bool
}

type EditPermissions struct {
	User      map[string]bool
	Project   map[string]bool
	Group     map[string]bool
	Checklist map[string]bool
	Report    map[string]bool
	Finding   map[string]bool
}

type DeletePermissions struct {
	User      map[string]bool
	Project   map[string]bool
	Group     map[string]bool
	Checklist map[string]bool
	Log       map[string]bool
	Report    map[string]bool
	Finding   map[string]bool
}

type PermissionString struct {
	CreatePermissions     CreatePermissions
	ViewPermissions       ViewPermissions
	ViewDetailPermissions ViewDetailPermissions
	EditPermissions       EditPermissions
	DeletePermissions     DeletePermissions
}

func InitPermissionString() *PermissionString {
	return &PermissionString{
		CreatePermissions: CreatePermissions{
			User:      make(map[string]bool),
			Project:   make(map[string]bool),
			Group:     make(map[string]bool),
			Checklist: make(map[string]bool),
			Log:       make(map[string]bool),
			Report:    make(map[string]bool),
			Finding:   make(map[string]bool),
		},

		ViewPermissions: ViewPermissions{
			User:      make(map[string]bool),
			Project:   make(map[string]bool),
			Group:     make(map[string]bool),
			Checklist: make(map[string]bool),
			Log:       make(map[string]bool),
			Report:    make(map[string]bool),
			Finding:   make(map[string]bool),
		},

		ViewDetailPermissions: ViewDetailPermissions{
			User:      make(map[string]bool),
			Project:   make(map[string]bool),
			Group:     make(map[string]bool),
			Checklist: make(map[string]bool),
			Log:       make(map[string]bool),
			Report:    make(map[string]bool),
			Finding:   make(map[string]bool),
		},

		EditPermissions: EditPermissions{
			User:      make(map[string]bool),
			Project:   make(map[string]bool),
			Group:     make(map[string]bool),
			Checklist: make(map[string]bool),
			Report:    make(map[string]bool),
			Finding:   make(map[string]bool),
		},

		DeletePermissions: DeletePermissions{
			User:      make(map[string]bool),
			Project:   make(map[string]bool),
			Group:     make(map[string]bool),
			Checklist: make(map[string]bool),
			Log:       make(map[string]bool),
			Report:    make(map[string]bool),
			Finding:   make(map[string]bool),
		},
	}
}

func GetUserPermissions(id string) (*PermissionString, error) {
	escapedId := html.EscapeString(strings.TrimSpace(id))
	currentUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		return nil, errUuid
	}
	user, dbErr := models.Users.GetOneById(currentUuid)

	if dbErr != nil {
		return nil, dbErr
	}

	ps := InitPermissionString()

	for _, g := range user.Groups {
		var data map[string]interface{}
		jsonText := html.UnescapeString(g.Permissions)
		json.Unmarshal([]byte(jsonText), &data)

		fmt.Println("json", jsonText, data)

		for k, v := range data {
			switch v := v.(type) {
			case map[string]interface{}:

				for ki, vi := range v {
					varr := vi.([]interface{})

					switch k {
					case "create":
						switch ki {
						case "user":
							for _, id := range varr {
								ps.CreatePermissions.User[id.(string)] = true
							}
						case "group":
							for _, id := range varr {
								ps.CreatePermissions.Group[id.(string)] = true
							}
						case "finding":
							for _, id := range varr {
								ps.CreatePermissions.Finding[id.(string)] = true
							}
						case "checklist":
							for _, id := range varr {
								ps.CreatePermissions.Checklist[id.(string)] = true
							}
						case "log":
							for _, id := range varr {
								ps.CreatePermissions.Log[id.(string)] = true
							}
						case "project":
							for _, id := range varr {
								ps.CreatePermissions.Project[id.(string)] = true
							}
						case "report":
							for _, id := range varr {
								ps.CreatePermissions.Report[id.(string)] = true
							}
						}
					case "delete":
						switch ki {
						case "user":
							for _, id := range varr {
								ps.DeletePermissions.User[id.(string)] = true
							}
						case "group":
							for _, id := range varr {
								ps.DeletePermissions.Group[id.(string)] = true
							}
						case "finding":
							for _, id := range varr {
								ps.DeletePermissions.Finding[id.(string)] = true
							}
						case "checklist":
							for _, id := range varr {
								ps.DeletePermissions.Checklist[id.(string)] = true
							}
						case "log":
							for _, id := range varr {
								ps.DeletePermissions.Log[id.(string)] = true
							}
						case "project":
							for _, id := range varr {
								ps.DeletePermissions.Project[id.(string)] = true
							}
						case "report":
							for _, id := range varr {
								ps.DeletePermissions.Report[id.(string)] = true
							}
						}
					case "edit":
						switch ki {
						case "user":
							for _, id := range varr {
								ps.EditPermissions.User[id.(string)] = true
							}
						case "group":
							for _, id := range varr {
								ps.EditPermissions.Group[id.(string)] = true
							}
						case "finding":
							for _, id := range varr {
								ps.EditPermissions.Finding[id.(string)] = true
							}
						case "checklist":
							for _, id := range varr {
								ps.EditPermissions.Checklist[id.(string)] = true
							}
						case "project":
							for _, id := range varr {
								ps.EditPermissions.Project[id.(string)] = true
							}
						case "report":
							for _, id := range varr {
								ps.EditPermissions.Report[id.(string)] = true
							}
						}
					case "view":
						switch ki {
						case "user":
							for _, id := range varr {
								ps.ViewPermissions.User[id.(string)] = true
							}
						case "group":
							for _, id := range varr {
								ps.ViewPermissions.Group[id.(string)] = true
							}
						case "finding":
							for _, id := range varr {
								ps.ViewPermissions.Finding[id.(string)] = true
							}
						case "checklist":
							for _, id := range varr {
								ps.ViewPermissions.Checklist[id.(string)] = true
							}
						case "log":
							for _, id := range varr {
								ps.ViewPermissions.Log[id.(string)] = true
							}
						case "project":
							for _, id := range varr {
								ps.ViewPermissions.Project[id.(string)] = true
							}
						case "report":
							for _, id := range varr {
								ps.ViewPermissions.Report[id.(string)] = true
							}
						}
					case "view-detail":
						switch ki {
						case "user":
							for _, id := range varr {
								ps.ViewDetailPermissions.User[id.(string)] = true
							}
						case "group":
							for _, id := range varr {
								ps.ViewDetailPermissions.Group[id.(string)] = true
							}
						case "finding":
							for _, id := range varr {
								ps.ViewDetailPermissions.Finding[id.(string)] = true
							}
						case "checklist":
							for _, id := range varr {
								ps.ViewDetailPermissions.Checklist[id.(string)] = true
							}
						case "log":
							for _, id := range varr {
								ps.ViewDetailPermissions.Log[id.(string)] = true
							}
						case "project":
							for _, id := range varr {
								ps.ViewDetailPermissions.Project[id.(string)] = true
							}
						case "report":
							for _, id := range varr {
								ps.ViewDetailPermissions.Report[id.(string)] = true
							}
						}
					}
				}

			}
		}

	}

	return ps, nil
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

	// uuids := []uuid.UUID{idUuid}

	result, dbErr := models.Users.Delete(idUuid)

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
		Id string `json:"id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// var parsedUuids []uuid.UUID
	// for _, element := range body.Ids {
	// 	parsedUuids = append(parsedUuids, uuid.FromStringOrNil(html.EscapeString(strings.TrimSpace(element))))
	// }

	escapedId := html.EscapeString(strings.TrimSpace(body.Id))
	idUuid, errUuid := uuid.FromString(escapedId)

	if errUuid != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errUuid.Error(),
		})
		return
	}

	result, dbErr := models.Users.Delete(idUuid)

	if dbErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": dbErr,
		})
		return
	}

	// for _, idUuid := range parsedUuids {
		permissionErr := DeletePermission(USER_ACTION_TYPE, "user", idUuid)
		if permissionErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": permissionErr,
			})
			return
		}
	// }

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
