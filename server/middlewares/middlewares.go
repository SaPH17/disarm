package middlewares

import (
	"fmt"
	"net/http"
	"strings"

	"disarm/main/controllers"
	"disarm/main/models"
	"disarm/main/utils/token"

	"github.com/gin-gonic/gin"
)

func JwtAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		uid, err := token.ValidateToken(c)
		if err != nil {
			c.String(http.StatusUnauthorized, "Unauthorized")
			c.Abort()
			// controllers.CreateLog(uuid.Nil, *c, http.StatusText(http.StatusUnauthorized))
			return
		}

		_, getErr := models.Users.GetOneById(uid)

		if getErr != nil {
			c.String(http.StatusUnauthorized, "Unauthorized")
			c.Abort()
			// controllers.CreateLog(uuid.Nil, *c, http.StatusText(http.StatusUnauthorized))
			return
		}

		_, pserr := controllers.GetUserPermissions(uid.String())
		if pserr != nil {
			c.String(http.StatusInternalServerError, "Ps Error")
			c.Abort()
		}

		urlp := strings.Split(c.Request.RequestURI, "/")

		fmt.Println(urlp)
		fmt.Println(len(urlp))
		abort := false

		// switch c.Request.Method {
		// case "GET":
		// 	if urlp[3] != "" {
		// 		switch urlp[2] {
		// 		case "users":
		// 			_, exists := ps.ViewDetailPermissions.User[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}
		// 		case "projects":
		// 			_, exists := ps.ViewDetailPermissions.Project[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}
		// 		case "findings":
		// 			_, exists := ps.ViewDetailPermissions.Finding[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}
		// 		case "checklists":
		// 			_, exists := ps.ViewDetailPermissions.Checklist[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}
		// 		case "groups":
		// 			_, exists := ps.ViewDetailPermissions.Group[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}
		// 		}
		// 	}
		// case "PUT":
		// 	if urlp[3] != "" {
		// 		switch urlp[2] {
		// 		case "users":
		// 			_, exists := ps.EditPermissions.User[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}
		// 		case "projects":
		// 			fmt.Println("oi")
		// 			_, exists := ps.EditPermissions.Project[urlp[3]]
		// 			if !exists {
		// 				fmt.Println("oi2")
		// 				abort = true
		// 			}
		// 		case "findings":
		// 			_, exists := ps.EditPermissions.Finding[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}
		// 		case "checklists":
		// 			_, exists := ps.EditPermissions.Checklist[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}
		// 		case "groups":
		// 			_, exists := ps.EditPermissions.Group[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}

		// 		}
		// 	}
		// case "DELETE":
		// 	if urlp[3] != "" {
		// 		switch urlp[2] {
		// 		case "users":
		// 			_, exists := ps.DeletePermissions.User[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}
		// 		case "projects":
		// 			fmt.Println("oi")
		// 			_, exists := ps.DeletePermissions.Project[urlp[3]]
		// 			if !exists {
		// 				fmt.Println("oi2")
		// 				abort = true
		// 			}
		// 		case "findings":
		// 			_, exists := ps.DeletePermissions.Finding[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}
		// 		case "checklists":
		// 			_, exists := ps.DeletePermissions.Checklist[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}
		// 		case "groups":
		// 			_, exists := ps.DeletePermissions.Group[urlp[3]]
		// 			if !exists {
		// 				abort = true
		// 			}

		// 		}
		// 	}
		// }

		if abort {
			c.String(http.StatusUnauthorized, "Ps Unauthorized")
			c.Abort()
		}

		// var bodyPostWithoutImage struct {
		// 	Title             string `form:"title"`
		// 	Risk              string `form:"risk"`
		// 	ImpactedSystem    string `form:"impacted_system"`
		// 	ChecklistDetailId string `form:"checklist_detail_id"`
		// 	Description       string `form:"description"`
		// 	ProjectId         string `form:"project_id"`
		// 	Steps             string `form:"steps"`
		// 	Recommendations   string `form:"recommendations"`
		// 	Evidences         string `form:"evidences"`
		// 	FixedEvidences    string `form:"fixed_evidences"`
		// }

		// var bodyPutWithoutImage struct {
		// 	Title             string `form:"title"`
		// 	Risk              string `form:"risk"`
		// 	ImpactedSystem    string `form:"impacted_system"`
		// 	ChecklistDetailId string `form:"checklist_detail_id"`
		// 	Description       string `form:"description"`
		// 	Status            string `form:"status"`
		// 	Steps             string `form:"steps"`
		// 	Recommendations   string `form:"recommendations"`
		// 	Evidences         string `form:"evidences"`
		// 	FixedEvidences    string `form:"fixed_evidences"`
		// }

		// if c.Request.Method == "PUT" && c.FullPath() == "/api/findings/:id" {
		// 	c.Bind(&bodyPutWithoutImage)
		// 	out, err := json.Marshal(bodyPutWithoutImage)
		// 	if err != nil {
		// 		c.String(http.StatusBadRequest, "Failed")
		// 		c.Abort()
		// 		return
		// 	}
		// 	controllers.CreateLog(uid, string(out), c.Request.RequestURI, c.Request.Method, c.ClientIP(), "")
		// } else if c.Request.Method == "POST" && c.FullPath() == "/api/findings/" {
		// 	c.Bind(&bodyPostWithoutImage)
		// 	out, err := json.Marshal(bodyPostWithoutImage)
		// 	if err != nil {
		// 		c.String(http.StatusBadRequest, "Failed")
		// 		c.Abort()
		// 		return
		// 	}
		// 	controllers.CreateLog(uid, string(out), c.Request.RequestURI, c.Request.Method, c.ClientIP(), "")
		// } else {
		// 	body, buffErr := io.ReadAll(c.Request.Body)
		// 	if buffErr != nil {
		// 		c.String(http.StatusBadRequest, "Unable to read body buffer")
		// 		c.Abort()
		// 		return
		// 	}

		// 	c.Request.Body = io.NopCloser(bytes.NewReader(body))
		// 	strbody := string(body)

		// 	controllers.CreateLog(uid, strbody, c.Request.RequestURI, c.Request.Method, c.ClientIP(), "")
		// }

		c.Next()
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
