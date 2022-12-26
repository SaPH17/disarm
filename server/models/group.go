package models

import (
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Group struct {
	Base
	Name          string     `gorm:"size:255;not null;unique" json:"name"`
	Description   string     `gorm:"size:255;not null;" json:"description"`
	ParentGroupID *uuid.UUID `gorm:"type:uuid;" json:"parent_group_id"`
	ParentGroup   *Group     `gorm:"foreignkey:ParentGroupID"`
	Permissions   string     `gorm:"size:255;not null;" json:"permissions"`
	Users         []User     `gorm:"many2many:user_groups"`
}

type groupOrm struct {
	instance *gorm.DB
}

type GroupOrm interface {
	Create(name string, description string, parentGroup *Group, permissions string, users []User) (Group, error)
	GetAll() ([]Group, error)
	GetOneById(id uuid.UUID) (Group, error)
	GetManyByIds(ids []uuid.UUID) ([]Group, error)
	Edit(id uuid.UUID, name string, description string, parentGroup *Group, users *[]User) (Group, error)
	EditPermission(id uuid.UUID, permissions string) (Group, error)
	Delete(ids []uuid.UUID) (bool, error)
}

var Groups GroupOrm

func init() {
	database.DB.Get().AutoMigrate(&Group{})
	Groups = &groupOrm{instance: database.DB.Get()}
}

func (o *groupOrm) Create(name string, description string, parentGroup *Group, permissions string, users []User) (Group, error) {
	var parentGroupId *uuid.UUID = nil
	if parentGroup.ID != uuid.Nil {
		parentGroupId = (*uuid.UUID)(&parentGroup.ID)
	}

	group := Group{Name: name, Description: description, ParentGroupID: (*uuid.UUID)(parentGroupId), Permissions: permissions, Users: users}
	result := o.instance.Omit("Users.*", "ParentGroup").Create(&group)

	return group, result.Error
}

func (o *groupOrm) GetAll() ([]Group, error) {
	var groups []Group
	result := o.instance.Preload("Users").Find(&groups)

	return groups, result.Error
}

func (o *groupOrm) GetOneById(id uuid.UUID) (Group, error) {
	var group Group
	err := o.instance.Model(Group{}).Preload("Users").Where("id = ?", id).Take(&group).Error

	return group, err
}

func (o *groupOrm) GetManyByIds(ids []uuid.UUID) ([]Group, error) {
	var groups []Group
	err := o.instance.Model(Group{}).Where("id IN ?", ids).Find(&groups).Error

	return groups, err
}

func (o *groupOrm) Edit(id uuid.UUID, name string, description string, parentGroup *Group, users *[]User) (Group, error) {
	var parentGroupId *uuid.UUID = nil
	if parentGroup.ID != uuid.Nil {
		parentGroupId = (*uuid.UUID)(&parentGroup.ID)
	}

	var group Group
	err := o.instance.Model(Group{}).Where("id = ?", id).Take(&group).Error
	o.instance.Model(&group).Omit("Users.*", "ParentGroup").Updates(Group{Name: name, Description: description, ParentGroupID: parentGroupId})
	database.DB.Get().Model(&group).Omit("Users.*").Association("Users").Replace(users)

	return group, err
}

func (o *groupOrm) EditPermission(id uuid.UUID, permissions string) (Group, error) {
	var group Group
	err := o.instance.Model(Group{}).Where("id = ?", id).Take(&group).Error
	group.Permissions = permissions
	o.instance.Save(group)

	return group, err
}

func (o *groupOrm) Delete(ids []uuid.UUID) (bool, error) {
	var groups []Group
	err := o.instance.Model(Group{}).Where("id IN ?", ids).Find(&groups).Error
	o.instance.Delete(&groups)

	return true, err
}
