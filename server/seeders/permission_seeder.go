package seeders

import (
	"disarm/main/database"
	"disarm/main/models"

	gorm_seeder "github.com/kachit/gorm-seeder"
	"gorm.io/gorm"
)

type PermissionsSeeder struct {
	gorm_seeder.SeederAbstract
}

func NewPermissionsSeeder(cfg gorm_seeder.SeederConfiguration) PermissionsSeeder {
	return PermissionsSeeder{gorm_seeder.NewSeederAbstract(cfg)}
}

func (s *PermissionsSeeder) Seed(db *gorm.DB) error {
	var types []models.PermissionObjectType
	dbErr := database.DB.Get().Find(&types).Error

	var actions []models.PermissionAction
	dbErr2 := database.DB.Get().Find(&actions).Error

	var permissions []models.Permission
	dbErr3 := database.DB.Get().Find(&permissions).Error

	if dbErr != nil {
		return dbErr
	}

	if dbErr2 != nil {
		return dbErr2
	}

	if len(permissions) != 0 || dbErr3 != nil {
		return dbErr3
	}

	var data []models.Permission

	for _, element2 := range actions {
		for _, element := range types {
			if element.Name == "finding" || element.Name == "report" {
				continue
			}

			data = append(data, models.Permission{PermissionActionId: element2.ID, ObjectTypeId: element.ID, ObjectId: "*"})
		}
	}

	return db.CreateInBatches(data, len(data)).Error
}

func (s *PermissionsSeeder) Clear(db *gorm.DB) error {
	return s.SeederAbstract.Delete(db, "permissions")
}
