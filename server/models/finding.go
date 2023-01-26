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
	Description       string    `gorm:"not null;" json:"description"`
	Steps             string    `gorm:"not null;" json:"steps"`
	Recommendations   string    `gorm:"not null;" json:"recommendations"`
	Evidences         string    `gorm:"not null;" json:"evidences"`
	FixedEvidences    string    `gorm:"not null;" json:"fixed_evidences"`
	Status            string    `gorm:"size:255;not null;" json:"status"`
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
	Create(title string, risk string, impactedSystem string, description string, steps string, recommendations string, evidences string, fixedEvidences string, checklistDetailId string, projectId uuid.UUID, checklistId uuid.UUID, userId uuid.UUID) (Finding, error)
	GetAll() ([]Finding, error)
	GetOneById(id uuid.UUID) (Finding, error)
	Edit(id uuid.UUID, title string, risk string, impactedSystem string, description string, steps string, recommendations string, evidences string, fixedEvidences string, checklistDetailId string, status string) (Finding, error)
}

var Findings FindingOrm

func init() {
	database.DB.Get().AutoMigrate(&Finding{})
	Findings = &findingOrm{instance: database.DB.Get()}
}

func (o *findingOrm) Create(title string, risk string, impactedSystem string, description string, steps string, recommendations string, evidences string, fixedEvidences string, checklistDetailId string, projectId uuid.UUID, checklistId uuid.UUID, userId uuid.UUID) (Finding, error) {
	finding := Finding{Title: title, Risk: risk, ImpactedSystem: impactedSystem, Description: description, Steps: steps,
		Recommendations: recommendations, Evidences: evidences, FixedEvidences: fixedEvidences, Status: "Idle", ChecklistDetailId: checklistDetailId, ProjectId: projectId, ChecklistId: checklistId, UserId: userId}
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
	err := o.instance.Model(Finding{}).Preload("Project").Preload("Checklist").Preload("User").Where("id = ?", id).Take(&finding).Error

	return finding, err
}

func (o *findingOrm) Edit(id uuid.UUID, title string, risk string, impactedSystem string, description string, steps string, recommendations string, evidences string, fixedEvidences string, checklistDetailId string, status string) (Finding, error) {
	var finding Finding
	err := o.instance.Model(Finding{}).Where("id = ?", id).Take(&finding).Error
	finding.Title = title
	finding.Risk = risk
	finding.ImpactedSystem = impactedSystem
	finding.Description = description
	finding.Steps = steps
	finding.Recommendations = recommendations
	finding.Evidences = evidences
	finding.FixedEvidences = fixedEvidences
	finding.ChecklistDetailId = checklistDetailId
	finding.Status = status
	o.instance.Save(finding)

	return finding, err
}
