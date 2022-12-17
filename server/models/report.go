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
	Create(file string, projectId uuid.UUID) (Report, error)
	GetAll() ([]Report, error)
	GetOneById(id uuid.UUID) (Report, error)
}

var Reports ReportOrm

func init() {
	database.DB.Get().AutoMigrate(&Report{})
	Reports = &reportOrm{instance: database.DB.Get()}
}

func (o *reportOrm) Create(file string, projectId uuid.UUID) (Report, error) {
	report := Report{File: file, ProjectId: projectId}
	result := o.instance.Create(&report)

	return report, result.Error
}

func (o *reportOrm) GetAll() ([]Report, error) {
	var reports []Report
	result := o.instance.Find(&reports)

	return reports, result.Error
}

func (o *reportOrm) GetOneById(id uuid.UUID) (Report, error) {
	var report Report
	err := o.instance.Model(Report{}).Where("id = ?", id).Take(&report).Error

	return report, err
}
