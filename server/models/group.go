package models

import (
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Group struct {
	Base
	Name          string `gorm:"size:255;not null;" json:"name"`
	Description   string `gorm:"size:255;not null;" json:"description"`
	ParentGroupId string `gorm:"size:255;" json:"parent_group_id"`
	Permissions   string `gorm:"size:255;not null;" json:"permissions"`
}

type groupOrm struct {
	instance *gorm.DB
}

type GroupOrm interface {
	Create(name string, description string, parentGroupId string, permissions string) (Group, error)
	GetAll() ([]Group, error)
	GetOneById(id uuid.UUID) (Group, error)
	Edit(id uuid.UUID, name string, description string, parentGroupId string) (Group, error)
	Delete(id uuid.UUID) (bool, error)
}

var Groups GroupOrm

func init() {
	database.DB.Get().AutoMigrate(&Group{})
	Groups = &groupOrm{instance: database.DB.Get()}
}

func (o *groupOrm) Create(name string, description string, parentGroupId string, permissions string) (Group, error) {
	group := Group{Name: name, Description: description, ParentGroupId: parentGroupId, Permissions: permissions}
	result := o.instance.Create(&group)

	return group, result.Error
}

func (o *groupOrm) GetAll() ([]Group, error) {
	var groups []Group
	result := o.instance.Find(&groups)

	return groups, result.Error
}

func (o *groupOrm) GetOneById(id uuid.UUID) (Group, error) {
	var group Group
	err := o.instance.Model(Group{}).Where("id = ?", id).Take(&group).Error

	return group, err
}

func (o *groupOrm) Edit(id uuid.UUID, name string, description string, parentGroupId string) (Group, error) {
	var group Group
	err := o.instance.Model(Group{}).Where("id = ?", id).Take(&group).Error
	group.Name = name
	group.Description = description
	group.ParentGroupId = parentGroupId
	o.instance.Save(group)

	return group, err
}

func (o *groupOrm) Delete(id uuid.UUID) (bool, error) {
	var group Group
	err := o.instance.Model(Group{}).Where("id = ?", id).Take(&group).Error
	o.instance.Delete(&group)

	return true, err
}
