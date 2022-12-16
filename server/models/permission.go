package models

import (
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Permission struct {
	Base
	PermissionActionId uuid.UUID `gorm:"type:uuid;" json:"permission_action_id"`
	ObjectTypeId       uuid.UUID `gorm:"type:uuid;" json:"object_type_id"`
	ObjectId           string    `gorm:"size:255;not null;" json:"object_id"`
	PermissionAction   PermissionAction
	ObjectType         PermissionObjectType
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
