package middlewares

import (
	"net/http"

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

		if c.Request.Method == "PUT" && c.FullPath() == "/api/findings/:id" {
			// c.Bind(&bodyPutWithoutImage)
			// out, err := json.Marshal(bodyPutWithoutImage)
			// if err != nil {
			// 	c.String(http.StatusBadRequest, "Failed")
			// 	c.Abort()
			// 	return
			// }
			// controllers.CreateLog(uid, string(out), c.Request.RequestURI, c.Request.Method, c.ClientIP(), "")
		} else if c.Request.Method == "POST" && c.FullPath() == "/api/findings/" {
			// c.Bind(&bodyPostWithoutImage)
			// out, err := json.Marshal(bodyPostWithoutImage)
			// if err != nil {
			// 	c.String(http.StatusBadRequest, "Failed")
			// 	c.Abort()
			// 	return
			// }
			// controllers.CreateLog(uid, string(out), c.Request.RequestURI, c.Request.Method, c.ClientIP(), "")
		} else {
			// body, buffErr := io.ReadAll(c.Request.Body)
			// if buffErr != nil {
			// 	c.String(http.StatusBadRequest, "Unable to read body buffer")
			// 	c.Abort()
			// 	return
			// }

			// c.Request.Body = io.NopCloser(bytes.NewReader(body))
			// strbody := string(body)

			// controllers.CreateLog(uid, strbody, c.Request.RequestURI, c.Request.Method, c.ClientIP(), "")
		}

		c.Next()
	}
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
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
