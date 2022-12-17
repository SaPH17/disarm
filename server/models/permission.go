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
	Edit(id uuid.UUID, permissionActionId uuid.UUID, objectTypeId uuid.UUID, objectId string) (Permission, error)
	Delete(id uuid.UUID) (bool, error)
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
	result := o.instance.Find(&permissions)

	return permissions, result.Error
}

func (o *permissionOrm) Edit(id uuid.UUID, permissionActionId uuid.UUID, objectTypeId uuid.UUID, objectId string) (Permission, error) {
	var permission Permission
	err := o.instance.Model(Group{}).Where("id = ?", id).Take(&permission).Error
	permission.PermissionActionId = permissionActionId
	permission.ObjectTypeId = objectTypeId
	permission.ObjectId = objectId
	o.instance.Save(permission)

	return permission, err
}

func (o *permissionOrm) Delete(id uuid.UUID) (bool, error) {
	var permission Permission
	err := o.instance.Model(Permission{}).Where("id = ?", id).Take(&permission).Error
	o.instance.Delete(&permission)

	return true, err
}
