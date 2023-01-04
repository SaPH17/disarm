package models

import (
	"disarm/main/database"
	"fmt"

	gorm_seeder "github.com/kachit/gorm-seeder"
	"gorm.io/gorm"
)

type PermissionAction struct {
	Base
	Name string `gorm:"size:255;not null;unique;" json:"name"`
}

type permissionActionOrm struct {
	instance *gorm.DB
}

type PermissionActionOrm interface {
}

var PermissionActions PermissionActionOrm

func init() {
	database.DB.Get().AutoMigrate(&PermissionAction{})
	PermissionActions = &permissionActionOrm{instance: database.DB.Get()}

	var actions []PermissionAction
	dbErr := database.DB.Get().Find(&actions).Error

	if len(actions) != 0 || dbErr != nil {
		return
	}

	actionsSeeder := NewPermissionActionsSeeder(gorm_seeder.SeederConfiguration{Rows: 5})
	seedersStack := gorm_seeder.NewSeedersStack(database.DB.Get())
	seedersStack.AddSeeder(&actionsSeeder)

	err := seedersStack.Seed()
	fmt.Println(err)
}

type PermissionActionsSeeder struct {
	gorm_seeder.SeederAbstract
}

func NewPermissionActionsSeeder(cfg gorm_seeder.SeederConfiguration) PermissionActionsSeeder {
	return PermissionActionsSeeder{gorm_seeder.NewSeederAbstract(cfg)}
}

func (s *PermissionActionsSeeder) Seed(db *gorm.DB) error {
	var actions []PermissionAction

	actions = append(actions, PermissionAction{Name: "view"})
	actions = append(actions, PermissionAction{Name: "view-detail"})
	actions = append(actions, PermissionAction{Name: "create"})
	actions = append(actions, PermissionAction{Name: "edit"})
	actions = append(actions, PermissionAction{Name: "delete"})

	return db.CreateInBatches(actions, len(actions)).Error
}

func (s *PermissionActionsSeeder) Clear(db *gorm.DB) error {
	return s.SeederAbstract.Delete(db, "permission_actions")
}
