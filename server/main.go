package main

import (
	"disarm/main/controllers"
	"disarm/main/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {

	r := gin.Default()

	r.Use(middlewares.CORSMiddleware())
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/login", controllers.AuthenticateUser)
			auth.GET("/check-login", controllers.CheckLoggedInUser)
		}
		apiWithJWT := api.Group("")
		apiWithJWT.Use(middlewares.JwtAuthMiddleware())

		user := apiWithJWT.Group("/users")
		{
			user.GET("/", controllers.GetAllUser)
			user.POST("/", controllers.CreateUser)
			user.GET("/:id", controllers.GetUserById)
			user.PUT("/:id", controllers.EditUser)
			user.DELETE("/:id", controllers.DeleteUser)
		}

		project := apiWithJWT.Group("/projects")
		{
			project.GET("/", controllers.GetAllProject)
			project.POST("/", controllers.CreateProject)
			project.GET("/:id", controllers.GetProjectById)
		}

		group := apiWithJWT.Group("/groups")
		{
			group.GET("/", controllers.GetAllGroup)
			group.POST("/", controllers.CreateGroup)
			group.GET("/:id", controllers.GetGroupById)
			group.PUT("/:id", controllers.EditGroup)
			group.PUT("/:id/permissions", controllers.EditGroupPermission)
			group.DELETE("/:id", controllers.DeleteGroup)
		}

		finding := apiWithJWT.Group("/findings")
		{
			finding.GET("/", controllers.GetAllFinding)
			finding.POST("/", controllers.CreateFinding)
			finding.GET("/:id", controllers.GetFindingById)
			finding.PUT("/:id", controllers.EditFinding)
		}

		checklist := apiWithJWT.Group("/checklists")
		{
			checklist.GET("/", controllers.GetAllChecklist)
			checklist.POST("/", controllers.CreateChecklist)
			checklist.GET("/:id", controllers.GetChecklistById)
			checklist.PUT("/:id", controllers.EditChecklist)
			checklist.DELETE("/:id", controllers.DeleteChecklist)
		}

		log := apiWithJWT.Group("/logs")
		{
			log.GET("/", controllers.GetAllLog)
			log.POST("/", controllers.CreateLog)
		}

		permission := apiWithJWT.Group("/permissions")
		{
			permission.GET("/", controllers.GetAllPermission)
			permission.POST("/", controllers.CreatePermission)
			permission.PUT("/:id", controllers.EditPermission)
			permission.DELETE("/:id", controllers.DeletePermission)
		}
	}

	r.Run(":8000")
}
