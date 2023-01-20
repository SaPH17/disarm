package models

import (
	"disarm/main/database"
	"fmt"
	"time"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Project struct {
	Base
	Name        string    `gorm:"size:255;not null;" json:"name"`
	Company     string    `gorm:"size:255;not null;" json:"company"`
	Phase       string    `gorm:"size:255;not null;" json:"phase"`
	StartDate   time.Time `gorm:"type:time;" json:"start_date"`
	EndDate     time.Time `gorm:"type:time;" json:"end_date"`
	ChecklistId uuid.UUID `gorm:"type:uuid;" json:"checklist_id"`
	Checklist   Checklist
	Reports     []Report
	Findings    []Finding
}

type projectOrm struct {
	instance *gorm.DB
}

type ProjectOrm interface {
	Create(name string, company string, phase string, startDate time.Time, endDate time.Time, checklistId uuid.UUID) (Project, error)
	GetAll() ([]Project, error)
	GetOneById(id uuid.UUID) (Project, error)
	Edit(id uuid.UUID, name string, company string, phase string, startDate time.Time, endDate time.Time) (Project, error)
	Delete(ids []uuid.UUID) (bool, error)
}

var Projects ProjectOrm

func init() {
	database.DB.Get().AutoMigrate(&Project{})
	Projects = &projectOrm{instance: database.DB.Get()}
}

func (o *projectOrm) Create(name string, company string, phase string, startDate time.Time, endDate time.Time, checklistId uuid.UUID) (Project, error) {
	project := Project{Name: name, Company: company, Phase: phase, StartDate: startDate, EndDate: endDate, ChecklistId: checklistId}
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

func (o *projectOrm) Edit(id uuid.UUID, name string, company string, phase string, startDate time.Time, endDate time.Time) (Project, error) {
	var project Project
	err := o.instance.Model(Project{}).Where("id = ?", id).Take(&project).Error
	project.Name = name
	project.Company = company
	project.Phase = phase
	project.StartDate = startDate
	project.EndDate = endDate
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
