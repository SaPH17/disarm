package models

import (
	"disarm/main/database"
	"fmt"

	gorm_seeder "github.com/kachit/gorm-seeder"
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

	var permissions []Permission
	dbErr := database.DB.Get().Find(&permissions).Error

	if len(permissions) != 0 || dbErr != nil {
		return
	}

	permissionsSeeder := NewPermissionsSeeder(gorm_seeder.SeederConfiguration{Rows: 5})
	seedersStack := gorm_seeder.NewSeedersStack(database.DB.Get())
	seedersStack.AddSeeder(&permissionsSeeder)

	err := seedersStack.Seed()
	fmt.Println(err)
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

type PermissionsSeeder struct {
	gorm_seeder.SeederAbstract
}

func NewPermissionsSeeder(cfg gorm_seeder.SeederConfiguration) PermissionsSeeder {
	return PermissionsSeeder{gorm_seeder.NewSeederAbstract(cfg)}
}

func (s *PermissionsSeeder) Seed(db *gorm.DB) error {
	var permissions []Permission
	var createAction PermissionAction

	var types []PermissionObjectType
	dbErr := database.DB.Get().Find(&types).Error

	var actions []PermissionAction
	dbErr2 := database.DB.Get().Find(&actions).Error

	if len(types) != 0 || dbErr != nil {
		return dbErr
	}

	if len(actions) != 0 || dbErr2 != nil {
		return dbErr2
	}

	for _, element := range actions {
		if element.Name == "create" {
			createAction = element
		}
	}

	for _, element := range types {
		if element.Name == "finding" || element.Name == "report" {
			continue
		}
		permissions = append(permissions, Permission{PermissionActionId: createAction.ID, ObjectTypeId: element.ID, ObjectId: "*"})
	}

	return db.CreateInBatches(permissions, len(permissions)).Error
}

func (s *PermissionsSeeder) Clear(db *gorm.DB) error {
	return s.SeederAbstract.Delete(db, "permission_actions")
}
