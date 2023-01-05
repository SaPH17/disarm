package seeders

import (
	"disarm/main/database"
	"disarm/main/models"

	gorm_seeder "github.com/kachit/gorm-seeder"
	"gorm.io/gorm"
)

type PermissionObjectTypesSeeder struct {
	gorm_seeder.SeederAbstract
}

func NewPermissionObjectTypesSeeder(cfg gorm_seeder.SeederConfiguration) PermissionObjectTypesSeeder {
	return PermissionObjectTypesSeeder{gorm_seeder.NewSeederAbstract(cfg)}
}

func (s *PermissionObjectTypesSeeder) Seed(db *gorm.DB) error {
	var types []models.PermissionObjectType
	dbErr := database.DB.Get().Find(&types).Error

	if len(types) != 0 || dbErr != nil {
		return dbErr
	}

	var objectTypes []models.PermissionObjectType

	objectTypes = append(objectTypes, models.PermissionObjectType{Name: "user"})
	objectTypes = append(objectTypes, models.PermissionObjectType{Name: "group"})
	objectTypes = append(objectTypes, models.PermissionObjectType{Name: "project"})
	objectTypes = append(objectTypes, models.PermissionObjectType{Name: "checklist"})
	objectTypes = append(objectTypes, models.PermissionObjectType{Name: "finding"})
	objectTypes = append(objectTypes, models.PermissionObjectType{Name: "report"})

	return db.CreateInBatches(objectTypes, len(objectTypes)).Error
}

func (s *PermissionObjectTypesSeeder) Clear(db *gorm.DB) error {
	return s.SeederAbstract.Delete(db, "permission_object_types")
}
