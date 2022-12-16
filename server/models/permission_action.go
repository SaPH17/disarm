package models

import (
	"disarm/main/database"

	"gorm.io/gorm"
)

type PermissionAction struct {
	Base
	Name string `gorm:"size:255;not null;" json:"name"`
}

type permissionActionOrm struct {
	instance *gorm.DB
}

type PermissionActionOrm interface {
}

var PermissionActions PermissionActionOrm

func init() {
	database.DB.Get().AutoMigrate(&PermissionAction{})
	PermissionActions = &permissionActionOrm{instance: database.DB.Get()}
}
