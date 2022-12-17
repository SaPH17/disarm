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
	Create(name string, status string, createdBy uuid.UUID, sections string) (Checklist, error)
	GetAll() ([]Checklist, error)
	GetOneById(id uuid.UUID) (Checklist, error)
	Edit(id uuid.UUID, name string, status string, createdBy uuid.UUID, sections string) (Checklist, error)
	Delete(id uuid.UUID) (bool, error)
}

var Checklists ChecklistOrm

func init() {
	database.DB.Get().AutoMigrate(&Checklist{})
	Checklists = &checklistOrm{instance: database.DB.Get()}
}

func (o *checklistOrm) Create(name string, status string, createdBy uuid.UUID, sections string) (Checklist, error) {
	checklist := Checklist{Name: name, Status: status, CreatedBy: createdBy, Sections: sections}
	result := o.instance.Create(&checklist)

	return checklist, result.Error
}

func (o *checklistOrm) GetAll() ([]Checklist, error) {
	var checklists []Checklist
	result := o.instance.Find(&checklists)

	return checklists, result.Error
}

func (o *checklistOrm) GetOneById(id uuid.UUID) (Checklist, error) {
	var checklist Checklist
	err := o.instance.Model(Checklist{}).Where("id = ?", id).Take(&checklist).Error

	return checklist, err
}

func (o *checklistOrm) Edit(id uuid.UUID, name string, status string, createdBy uuid.UUID, sections string) (Checklist, error) {
	var checklist Checklist
	err := o.instance.Model(Checklist{}).Where("id = ?", id).Take(&checklist).Error
	checklist.Name = name
	checklist.Status = status
	checklist.CreatedBy = createdBy
	checklist.Sections = sections
	o.instance.Save(checklist)

	return checklist, err
}

func (o *checklistOrm) Delete(id uuid.UUID) (bool, error) {
	var checklist Checklist
	err := o.instance.Model(Checklist{}).Where("id = ?", id).Take(&checklist).Error
	o.instance.Delete(&checklist)

	return true, err
}
