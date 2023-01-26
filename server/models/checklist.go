package models

import (
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Checklist struct {
	Base
	Name        string    `gorm:"size:255;not null;" json:"name"`
	Status      string    `gorm:"size:255;not null;" json:"status"`
	CreatedByID uuid.UUID `gorm:"type:uuid;" json:"created_by_id"`
	User        User      `gorm:"foreignKey:CreatedByID"`
	Sections    string    `gorm:"not null;" json:"sections"`
}

type checklistOrm struct {
	instance *gorm.DB
}

type ChecklistOrm interface {
	Create(name string, status string, createdBy uuid.UUID, sections string) (Checklist, error)
	GetAll() ([]Checklist, error)
	GetOneById(id uuid.UUID) (Checklist, error)
	GetManyByIds(id []uuid.UUID) ([]Checklist, error)
	Edit(id uuid.UUID, name string, sections string, status string) (Checklist, error)
	Delete(id uuid.UUID) (bool, error)
}

var Checklists ChecklistOrm

func init() {
	database.DB.Get().AutoMigrate(&Checklist{})
	Checklists = &checklistOrm{instance: database.DB.Get()}
}

func (o *checklistOrm) Create(name string, status string, createdBy uuid.UUID, sections string) (Checklist, error) {
	checklist := Checklist{Name: name, Status: status, Sections: sections, CreatedByID: createdBy}
	result := o.instance.Omit("User").Create(&checklist)

	return checklist, result.Error
}

func (o *checklistOrm) GetAll() ([]Checklist, error) {
	var checklists []Checklist
	result := o.instance.Preload("User").Find(&checklists)

	return checklists, result.Error
}

func (o *checklistOrm) GetOneById(id uuid.UUID) (Checklist, error) {
	var checklist Checklist
	err := o.instance.Model(Checklist{}).Preload("User").Where("id = ?", id).Take(&checklist).Error

	return checklist, err
}

func (o *checklistOrm) GetManyByIds(ids []uuid.UUID) ([]Checklist, error) {
	var checklists []Checklist
	err := o.instance.Model(Checklist{}).Where("id IN ?", ids).Find(&checklists).Error

	return checklists, err
}

func (o *checklistOrm) Edit(id uuid.UUID, name string, sections string, status string) (Checklist, error) {
	var checklist Checklist
	err := o.instance.Model(Checklist{}).Where("id = ?", id).Take(&checklist).Error
	o.instance.Model(&checklist).Updates(Checklist{Name: name, Sections: sections, Status: status})

	return checklist, err
}

func (o *checklistOrm) Delete(id uuid.UUID) (bool, error) {
	var checklists []Checklist
	err := o.instance.Model(Checklist{}).Where("id = ?", id).Find(&checklists).Error

	if err != nil {
		return false, err
	}
		

	err = o.instance.Delete(&checklists).Error

	if err != nil {
		return false, err
	}

	return true, err
}
