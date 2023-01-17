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
	Create(permissionActionId uuid.UUID, objectTypeId uuid.UUID, objectId string) (Permission, error)
	GetAll() ([]Permission, error)
	Delete(permissionActionIds []uuid.UUID, objectTypeId uuid.UUID, objectId string) (bool, error)
}

var Permissions PermissionOrm

func init() {
	database.DB.Get().AutoMigrate(&Permission{})
	Permissions = &permissionOrm{instance: database.DB.Get()}
}

func (o *permissionOrm) Create(permissionActionId uuid.UUID, objectTypeId uuid.UUID, objectId string) (Permission, error) {
	permission := Permission{PermissionActionId: permissionActionId, ObjectTypeId: objectTypeId, ObjectId: objectId}
	result := o.instance.Create(&permission)

	return permission, result.Error
}

func (o *permissionOrm) GetAll() ([]Permission, error) {
	var permissions []Permission
	result := o.instance.Preload("PermissionAction").Preload("ObjectType").Find(&permissions)

	return permissions, result.Error
}

func (o *permissionOrm) Delete(permissionActionIds []uuid.UUID, objectTypeId uuid.UUID, objectId string) (bool, error) {
	var permissions []Permission
	err := o.instance.Model(Permission{}).
		Where("permission_action_id IN ?", permissionActionIds).
		Where("object_type_id = ?", objectTypeId).
		Where("object_id = ?", objectId).Find(&permissions).Error
	o.instance.Unscoped().Delete(&permissions)

	return true, err
}
