package models

import (
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Finding struct {
	Base
	Title             string    `gorm:"size:255;not null;" json:"title"`
	Risk              string    `gorm:"size:255;not null;" json:"risk"`
	ImpactedSystem    string    `gorm:"size:255;not null;" json:"impacted_system"`
	ChecklistDetailId string    `gorm:"size:255;not null;" json:"checklist_detail_id"`
	ProjectId         uuid.UUID `gorm:"type:uuid;" json:"project_id"`
	ChecklistId       uuid.UUID `gorm:"type:uuid;" json:"checklist_id"`
	UserId            uuid.UUID `gorm:"type:uuid;" json:"userId"`
	Project           Project
	Checklist         Checklist
	User              User
}

type findingOrm struct {
	instance *gorm.DB
}

type FindingOrm interface {
	Create(title string, risk string, impactedSystem string, checklistDetailId string, projectId uuid.UUID, checklistId uuid.UUID, userId uuid.UUID) (Finding, error)
	GetAll() ([]Finding, error)
	GetOneById(id uuid.UUID) (Finding, error)
	Edit(id uuid.UUID, title string, risk string, impactedSystem string, checklistDetailId string, projectId uuid.UUID, checklistId uuid.UUID, userId uuid.UUID) (Finding, error)
}

var Findings FindingOrm

func init() {
	database.DB.Get().AutoMigrate(&Finding{})
	Findings = &findingOrm{instance: database.DB.Get()}
}

func (o *findingOrm) Create(title string, risk string, impactedSystem string, checklistDetailId string, projectId uuid.UUID, checklistId uuid.UUID, userId uuid.UUID) (Finding, error) {
	finding := Finding{Title: title, Risk: risk, ImpactedSystem: impactedSystem, ChecklistDetailId: checklistDetailId, ProjectId: projectId, ChecklistId: checklistId, UserId: userId}
	result := o.instance.Create(&finding)

	return finding, result.Error
}

func (o *findingOrm) GetAll() ([]Finding, error) {
	var findings []Finding
	result := o.instance.Find(&findings)

	return findings, result.Error
}

func (o *findingOrm) GetOneById(id uuid.UUID) (Finding, error) {
	var finding Finding
	err := o.instance.Model(Finding{}).Where("id = ?", id).Take(&finding).Error

	return finding, err
}

func (o *findingOrm) Edit(id uuid.UUID, title string, risk string, impactedSystem string, checklistDetailId string, projectId uuid.UUID, checklistId uuid.UUID, userId uuid.UUID) (Finding, error) {
	var finding Finding
	err := o.instance.Model(Finding{}).Where("id = ?", id).Take(&finding).Error
	finding.Title = title
	finding.Risk = risk
	finding.ImpactedSystem = impactedSystem
	finding.ChecklistDetailId = checklistDetailId
	finding.ProjectId = projectId
	finding.ChecklistId = checklistId
	finding.UserId = userId
	o.instance.Save(finding)

	return finding, err
}
