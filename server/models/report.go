package models

import (
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Report struct {
	Base
	File      string    `gorm:"size:255;not null;" json:"endpoint"`
	ProjectId uuid.UUID `gorm:"type:uuid;" json:"project_id"`
	Project   Project
}

type reportOrm struct {
	instance *gorm.DB
}

type ReportOrm interface {
}

var Reports ReportOrm

func init() {
	database.DB.Get().AutoMigrate(&Report{})
	Reports = &reportOrm{instance: database.DB.Get()}
}
