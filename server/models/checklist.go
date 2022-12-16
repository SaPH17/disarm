package models

import (
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Checklist struct {
	Base
	Name      string    `gorm:"size:255;not null;" json:"name"`
	Status    string    `gorm:"size:255;not null;" json:"status"`
	CreatedBy uuid.UUID `gorm:"type:uuid;" json:"created_by"`
	User      User      `gorm:"foreignKey:created_by"`
	Sections  string    `gorm:"size:255;not null;" json:"sections"`
}

type checklistOrm struct {
	instance *gorm.DB
}

type ChecklistOrm interface {
}

var Checklists ChecklistOrm

func init() {
	database.DB.Get().AutoMigrate(&Checklist{})
	Checklists = &checklistOrm{instance: database.DB.Get()}
}
