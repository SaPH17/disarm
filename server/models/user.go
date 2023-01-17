package models

import (
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type User struct {
	Base
	Groups            []Group    `gorm:"many2many:user_groups"`
	Email             string     `gorm:"size:255;not null;unique" json:"email"`
	Username          string     `gorm:"size:255;not null;unique" json:"username"`
	Password          string     `gorm:"size:255;not null;" json:"password"`
	SupervisorID      *uuid.UUID `gorm:"type:uuid;" json:"supervisor_id"`
	Supervisor        *User      `gorm:"foreignkey:SupervisorID"`
	IsPasswordChanged bool       `gorm:"not null;" json:"is_password_changed"`
}

type userOrm struct {
	instance *gorm.DB
}

type UserOrm interface {
	Create(email string, password string, username string, supervisor *User, groups []Group) (User, error)
	GetAll() ([]User, error)
	GetOneByEmail(email string) (User, error)
	GetOneById(id uuid.UUID) (User, error)
	GetManyByIds(ids []uuid.UUID) ([]User, error)
	Edit(id uuid.UUID, email string, username string, supervisor *User) (User, error)
	Delete(ids []uuid.UUID) (bool, error)
	ChangePassword(id uuid.UUID, password string, isPasswordChanged bool) (User, error)
}

var Users UserOrm

func init() {
	database.DB.Get().AutoMigrate(&User{})
	Users = &userOrm{instance: database.DB.Get()}
}

func (o *userOrm) Create(email string, password string, username string, supervisor *User, groups []Group) (User, error) {
	var supervisorId *uuid.UUID = nil
	if supervisor.ID != uuid.Nil {
		supervisorId = (*uuid.UUID)(&supervisor.ID)
	}

	user := User{Email: email, Username: username, Password: password, SupervisorID: (*uuid.UUID)(supervisorId), Groups: groups, IsPasswordChanged: false}

	result := o.instance.Omit("Groups.*", "Supervisor").Create(&user)

	return user, result.Error
}

func (o *userOrm) GetAll() ([]User, error) {
	var users []User
	result := o.instance.Preload("Groups").Preload("Supervisor").Find(&users)

	return users, result.Error
}

func (o *userOrm) GetOneByEmail(email string) (User, error) {
	var user User
	err := o.instance.Model(User{}).Where("email = ?", email).Take(&user).Error

	return user, err
}

func (o *userOrm) GetOneById(id uuid.UUID) (User, error) {
	var user User
	err := o.instance.Model(User{}).Preload("Groups").Preload("Supervisor").Where("id = ?", id).Take(&user).Error

	return user, err
}

func (o *userOrm) GetManyByIds(ids []uuid.UUID) ([]User, error) {
	var users []User
	err := o.instance.Model(User{}).Where("id IN ?", ids).Find(&users).Error

	return users, err
}

func (o *userOrm) Edit(id uuid.UUID, email string, username string, supervisor *User) (User, error) {
	var supervisorId *uuid.UUID = nil
	if supervisor.ID != uuid.Nil {
		supervisorId = (*uuid.UUID)(&supervisor.ID)
	}

	var user User
	err := o.instance.Model(User{}).Where("id = ?", id).Take(&user).Error
	o.instance.Model(&user).Updates(User{Username: username, Email: email, SupervisorID: supervisorId})

	return user, err
}

func (o *userOrm) ChangePassword(id uuid.UUID, password string, isPasswordChanged bool) (User, error) {
	var user User
	err := o.instance.Model(User{}).Where("id = ?", id).Find(&user).Error
	o.instance.Model(&user).Updates(User{Password: password, IsPasswordChanged: isPasswordChanged})

	return user, err
}

func (o *userOrm) Delete(ids []uuid.UUID) (bool, error) {
	var users []User
	err := o.instance.Model(User{}).Where("id IN ?", ids).Find(&users).Error
	o.instance.Delete(&users)

	return true, err
}
