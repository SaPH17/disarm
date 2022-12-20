package models

import (
	"disarm/main/database"
	"fmt"

	gorm_seeder "github.com/kachit/gorm-seeder"
	"gorm.io/gorm"
)

type PermissionObjectType struct {
	Base
	Name string `gorm:"size:255;not null;unique;" json:"name"`
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

	typesSeeder := NewPermissionObjectTypesSeeder(gorm_seeder.SeederConfiguration{Rows: 5})
	seedersStack := gorm_seeder.NewSeedersStack(database.DB.Get())
	seedersStack.AddSeeder(&typesSeeder)

	err := seedersStack.Seed()
	fmt.Println(err)
}

type PermissionObjectTypesSeeder struct {
	gorm_seeder.SeederAbstract
}

func NewPermissionObjectTypesSeeder(cfg gorm_seeder.SeederConfiguration) PermissionObjectTypesSeeder {
	return PermissionObjectTypesSeeder{gorm_seeder.NewSeederAbstract(cfg)}
}

func (s *PermissionObjectTypesSeeder) Seed(db *gorm.DB) error {
	var objectTypes []PermissionObjectType

	objectTypes = append(objectTypes, PermissionObjectType{Name: "user"})
	objectTypes = append(objectTypes, PermissionObjectType{Name: "group"})
	objectTypes = append(objectTypes, PermissionObjectType{Name: "project"})
	objectTypes = append(objectTypes, PermissionObjectType{Name: "checklist"})
	objectTypes = append(objectTypes, PermissionObjectType{Name: "finding"})
	objectTypes = append(objectTypes, PermissionObjectType{Name: "report"})

	return db.CreateInBatches(objectTypes, len(objectTypes)).Error
}

func (s *PermissionObjectTypesSeeder) Clear(db *gorm.DB) error {
	return s.SeederAbstract.Delete(db, "permission_object_types")
}
