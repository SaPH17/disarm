package main

import (
	"disarm/main/controllers"
	"disarm/main/database"
	"disarm/main/middlewares"
	"disarm/main/seeders"
	"fmt"

	"github.com/gin-gonic/gin"
	gorm_seeder "github.com/kachit/gorm-seeder"
)

func runSeeder() {
	actionsSeeder := seeders.NewPermissionActionsSeeder(gorm_seeder.SeederConfiguration{Rows: 5})
	objectTypesSeeder := seeders.NewPermissionObjectTypesSeeder(gorm_seeder.SeederConfiguration{Rows: 6})
	usersSeeder := seeders.NewUsersSeeder(gorm_seeder.SeederConfiguration{Rows: 1})
	seedersStack := gorm_seeder.NewSeedersStack(database.DB.Get())
	seedersStack.AddSeeder(&actionsSeeder)
	seedersStack.AddSeeder(&objectTypesSeeder)
	seedersStack.AddSeeder(&usersSeeder)

	err := seedersStack.Seed()

	permissionSeeder := seeders.NewPermissionsSeeder(gorm_seeder.SeederConfiguration{Rows: 6})
	seedersStack2 := gorm_seeder.NewSeedersStack(database.DB.Get())
	seedersStack2.AddSeeder(&permissionSeeder)

	err2 := seedersStack2.Seed()

	fmt.Println(err)
	fmt.Println(err2)
}

func main() {
	runSeeder()
	r := gin.Default()

	r.Use(middlewares.CORSMiddleware())
	r.Static("/upload", "./upload")
	r.Static("/reports", "./reports")
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/login", controllers.AuthenticateUser)
			auth.GET("/check-login", controllers.CheckLoggedInUser)
		}
		apiWithJWT := api.Group("")
		apiWithJWT.Use(middlewares.JwtAuthMiddleware())

		authWithMiddleware := apiWithJWT.Group("/auth")
		{
			authWithMiddleware.PATCH("/change-password", controllers.ChangePassword)
		}

		user := apiWithJWT.Group("/users")
		{
			user.GET("/", controllers.GetAllUser)
			user.POST("/", controllers.CreateUser)
			user.DELETE("/", controllers.DeleteUserByIds)
			user.GET("/:id", controllers.GetUserById)
			user.PUT("/:id", controllers.EditUser)
			user.DELETE("/:id", controllers.DeleteUser)
			user.GET("/:id/groups", controllers.GetManyGroupsByUser)
			user.PATCH("/:id/reset-password", controllers.ResetUserPassword)
		}

		project := apiWithJWT.Group("/projects")
		{
			project.GET("/", controllers.GetAllProject)
			project.POST("/", controllers.CreateProject)
			project.DELETE("/", controllers.DeleteProjectByIds)
			project.GET("/:id", controllers.GetProjectById)
			project.PUT("/:id", controllers.EditProject)
			project.PUT("/:id/checklist", controllers.EditProjectSection)
			project.GET("/:id/findings", controllers.GetAllFindingByProjectId)
			project.DELETE("/:id", controllers.DeleteProject)
		}

		group := apiWithJWT.Group("/groups")
		{
			group.GET("/", controllers.GetAllGroup)
			group.POST("/", controllers.CreateGroup)
			group.GET("/:id", controllers.GetGroupById)
			group.PUT("/:id", controllers.EditGroup)
			group.POST("/assign-user", controllers.AddUserToGroup)
			group.PUT("/:id/permissions", controllers.EditGroupPermission)
			group.DELETE("/:id", controllers.DeleteGroup)
			group.DELETE("/", controllers.DeleteGroupByIds)
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
			checklist.DELETE("/", controllers.DeleteChecklistByIds)
			checklist.GET("/:id", controllers.GetChecklistById)
			checklist.PUT("/:id", controllers.EditChecklist)
			checklist.DELETE("/:id", controllers.DeleteChecklist)
		}

		log := apiWithJWT.Group("/logs")
		{
			log.GET("/", controllers.GetAllLog)
		}

		permission := apiWithJWT.Group("/permissions")
		{
			permission.GET("/", controllers.GetAllPermission)
			permission.GET("/refresh-permissions", controllers.RefreshPermission)
		}

		report := apiWithJWT.Group("/reports")
		{
			report.GET("/", controllers.GetAllReport)
			report.POST("/:id", controllers.CreateReport)
			report.GET("/:id", controllers.GetReportById)
		}
	}

	r.Run(":8000")
}
