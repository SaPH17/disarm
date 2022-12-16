package models

import (
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Project struct {
	Base
	Name        string    `gorm:"size:255;not null;" json:"name"`
	Company     string    `gorm:"size:255;not null;" json:"company"`
	Phase       string    `gorm:"size:255;not null;" json:"phase"`
	ChecklistId uuid.UUID `gorm:"type:uuid;" json:"checklist_id"`
	Checklist   Checklist
}

type projectOrm struct {
	instance *gorm.DB
}

type ProjectOrm interface {
	Create(name string, company string, phase string) (Project, error)
	GetAll() ([]Project, error)
	GetOneById(id uint) (Project, error)
}

var Projects ProjectOrm

func init() {
	database.DB.Get().AutoMigrate(&Project{})
	Projects = &projectOrm{instance: database.DB.Get()}
}

func (o *projectOrm) Create(name string, company string, phase string) (Project, error) {
	project := Project{Name: name, Company: company, Phase: phase}
	result := o.instance.Create(&project)

	return project, result.Error
}

func (o *projectOrm) GetAll() ([]Project, error) {
	var projects []Project
	result := o.instance.Find(&projects)

	return projects, result.Error
}

func (o *projectOrm) GetOneById(id uint) (Project, error) {
	var project Project
	err := o.instance.Model(Project{}).Where("id = ?", id).Take(&project).Error

	return project, err
}
