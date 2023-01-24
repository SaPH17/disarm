package models

import (
	"disarm/main/database"
	"fmt"

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
	Reports     []Report
	Findings    []Finding
}

type projectOrm struct {
	instance *gorm.DB
}

type ProjectOrm interface {
	Create(name string, company string, phase string, checklistId uuid.UUID) (Project, error)
	GetAll() ([]Project, error)
	GetOneById(id uuid.UUID) (Project, error)
	GetManyByIds(ids []uuid.UUID) ([]Project, error)
	Edit(id uuid.UUID, name string, company string, phase string) (Project, error)
	Delete(ids []uuid.UUID) (bool, error)
}

var Projects ProjectOrm

func init() {
	database.DB.Get().AutoMigrate(&Project{})
	Projects = &projectOrm{instance: database.DB.Get()}
}

func (o *projectOrm) Create(name string, company string, phase string, checklistId uuid.UUID) (Project, error) {
	project := Project{Name: name, Company: company, Phase: phase, ChecklistId: checklistId}
	result := o.instance.Create(&project)

	return project, result.Error
}

func (o *projectOrm) GetAll() ([]Project, error) {
	var projects []Project
	result := o.instance.Preload("Checklist").Preload("Findings").Find(&projects)

	return projects, result.Error
}

func (o *projectOrm) GetOneById(id uuid.UUID) (Project, error) {
	var project Project
	err := o.instance.Model(Project{}).Preload("Checklist").Preload("Findings").Where("id = ?", id).Take(&project).Error

	return project, err
}

func (o *projectOrm) GetManyByIds(ids []uuid.UUID) ([]Project, error) {
	var projects []Project
	err := o.instance.Model(Project{}).Where("id IN ?", ids).Find(&projects).Error

	return projects, err
}

func (o *projectOrm) Edit(id uuid.UUID, name string, company string, phase string) (Project, error) {
	var project Project
	err := o.instance.Model(Project{}).Where("id = ?", id).Take(&project).Error
	project.Name = name
	project.Company = company
	project.Phase = phase
	o.instance.Save(project)

	return project, err
}

func (o *projectOrm) Delete(ids []uuid.UUID) (bool, error) {
	var projects []Project
	err := o.instance.Model(Project{}).Where("id IN ?", ids).Find(&projects).Error
	fmt.Println(ids)
	fmt.Println(projects)
	o.instance.Delete(&projects)

	return true, err
}
