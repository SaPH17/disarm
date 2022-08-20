package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
  )
  
  func main() {
	r := gin.Default()
  
	api := r.Group("/api") 
	{
		api.GET("/peha", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"peha": "memek",
			})
		})
	}

	r.Run(":3000")
  }