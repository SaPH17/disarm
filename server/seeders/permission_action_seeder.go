package seeders

import (
	"disarm/main/database"
	"disarm/main/models"

	gorm_seeder "github.com/kachit/gorm-seeder"
	"gorm.io/gorm"
)

type PermissionActionsSeeder struct {
	gorm_seeder.SeederAbstract
}

func NewPermissionActionsSeeder(cfg gorm_seeder.SeederConfiguration) PermissionActionsSeeder {
	return PermissionActionsSeeder{gorm_seeder.NewSeederAbstract(cfg)}
}

func (s *PermissionActionsSeeder) Seed(db *gorm.DB) error {
	var actions []models.PermissionAction
	dbErr := database.DB.Get().Find(&actions).Error

	if len(actions) != 0 || dbErr != nil {
		return dbErr
	}

	var data []models.PermissionAction

	data = append(data, models.PermissionAction{Name: "view"})
	data = append(data, models.PermissionAction{Name: "view-detail"})
	data = append(data, models.PermissionAction{Name: "create"})
	data = append(data, models.PermissionAction{Name: "edit"})
	data = append(data, models.PermissionAction{Name: "delete"})

	return db.CreateInBatches(data, len(data)).Error
}

func (s *PermissionActionsSeeder) Clear(db *gorm.DB) error {
	return s.SeederAbstract.Delete(db, "permission_actions")
}
