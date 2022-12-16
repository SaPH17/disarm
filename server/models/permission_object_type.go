package models

import (
	"disarm/main/database"

	"gorm.io/gorm"
)

type PermissionObjectType struct {
	Base
	Name string `gorm:"size:255;not null;" json:"name"`
}

type permissionObjectTypeOrm struct {
	instance *gorm.DB
}

type PermissionObjectTypeOrm interface {
}

var PermissionObjectTypes PermissionObjectTypeOrm

func init() {
	database.DB.Get().AutoMigrate(&PermissionObjectType{})
	PermissionObjectTypes = &permissionObjectTypeOrm{instance: database.DB.Get()}
}
