package models

import (
	"database/sql"
	"disarm/main/database"
	"fmt"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Group struct {
	Base
	Name          string         `gorm:"size:255;not null;unique" json:"name"`
	Description   string         `gorm:"size:255;not null;" json:"description"`
	ParentGroupId sql.NullString `gorm:"size:255;" json:"parent_group_id"`
	Permissions   string         `gorm:"size:255;not null;" json:"permissions"`
	Users         []User         `gorm:"many2many:user_groups"`
}

type groupOrm struct {
	instance *gorm.DB
}

type GroupOrm interface {
	Create(name string, description string, parentGroupId sql.NullString, permissions string, users []User) (Group, error)
	GetAll() ([]Group, error)
	GetOneById(id uuid.UUID) (Group, error)
	GetManyByIds(ids []uuid.UUID) ([]Group, error)
	Edit(id uuid.UUID, name string, description string, parentGroupId sql.NullString) (Group, error)
	EditPermission(id uuid.UUID, permissions string) (Group, error)
	Delete(ids []uuid.UUID) (bool, error)
}

var Groups GroupOrm

func init() {
	database.DB.Get().AutoMigrate(&Group{})
	Groups = &groupOrm{instance: database.DB.Get()}
}

func (o *groupOrm) Create(name string, description string, parentGroupId sql.NullString, permissions string, users []User) (Group, error) {
	fmt.Println(users)
	group := Group{Name: name, Description: description, ParentGroupId: parentGroupId, Permissions: permissions, Users: users}
	result := o.instance.Omit("Users.*").Create(&group)

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

func (o *groupOrm) Edit(id uuid.UUID, name string, description string, parentGroupId sql.NullString) (Group, error) {
	var group Group
	err := o.instance.Model(Group{}).Where("id = ?", id).Take(&group).Error
	group.Name = name
	group.Description = description
	group.ParentGroupId = parentGroupId
	o.instance.Save(group)

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
	var group Group
	err := o.instance.Model(Group{}).Where("id IN ?", ids).Take(&group).Error
	o.instance.Delete(&group)

	return true, err
}
