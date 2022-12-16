package models

import (
	"disarm/main/database"

	"gorm.io/gorm"
)

type Permission struct {
	Base
	PermissionActionId string               `gorm:"size:255;not null;" json:"permission_action_id"`
	PermissionAction   PermissionAction     `gorm:"size:255;not null;" json:"permission_action"`
	ObjectTypeId       string               `gorm:"size:255;not null;" json:"object_type_id"`
	ObjectType         PermissionObjectType `gorm:"size:255;not null;" json:"object_type"`
	ObjectId           string               `gorm:"size:255;not null;" json:"object_id"`
}

type permissionOrm struct {
	instance *gorm.DB
}

type PermissionOrm interface {
}

var Permissions PermissionOrm

func init() {
	database.DB.Get().AutoMigrate(&Permission{})
	Permissions = &permissionOrm{instance: database.DB.Get()}
}
