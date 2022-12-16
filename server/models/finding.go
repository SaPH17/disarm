package models

import (
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Finding struct {
	Base
	Title          string    `gorm:"size:255;not null;" json:"title"`
	Risk           string    `gorm:"size:255;not null;" json:"risk"`
	ImpactedSystem string    `gorm:"size:255;not null;" json:"impacted_system"`
	ProjectId      uuid.UUID `gorm:"type:uuid;" json:"project_id"`
	ChecklistId    uuid.UUID `gorm:"type:uuid;" json:"checklist_id"`
	UserId         uuid.UUID `gorm:"type:uuid;" json:"userId"`
	Project        Project
	Checklist      Checklist
	User           User
}

type findingOrm struct {
	instance *gorm.DB
}

type FindingOrm interface {
	Create(title string, risk string, impactedSystem string, projectId uuid.UUID, checklistId uuid.UUID, userId uuid.UUID) (Finding, error)
	GetAll() ([]Finding, error)
}

var Findings FindingOrm

func init() {
	database.DB.Get().AutoMigrate(&Finding{})
	Findings = &findingOrm{instance: database.DB.Get()}
}

func (o *findingOrm) Create(title string, risk string, impactedSystem string, projectId uuid.UUID, checklistId uuid.UUID, userId uuid.UUID) (Finding, error) {
	finding := Finding{Title: title, Risk: risk, ImpactedSystem: impactedSystem, ProjectId: projectId, ChecklistId: checklistId, UserId: userId}
	result := o.instance.Create(&finding)

	return finding, result.Error
}

func (o *findingOrm) GetAll() ([]Finding, error) {
	var findings []Finding
	result := o.instance.Find(&findings)

	return findings, result.Error
}
