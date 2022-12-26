package middlewares

import (
	"bytes"
	"io"
	"net/http"

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

		body, buffErr := io.ReadAll(c.Request.Body)
		if buffErr != nil {
			c.String(http.StatusBadRequest, "Unable to read body buffer")
			c.Abort()
			return
		}

		c.Request.Body = io.NopCloser(bytes.NewReader(body))
		strbody := string(body)

		controllers.CreateLog(uid, strbody, c.Request.RequestURI, c.Request.Method, c.ClientIP(), "")

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
