package models

import (
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type User struct {
	Base
	Username string `gorm:"size:255;not null;unique" json:"username"`
	Password string `gorm:"size:255;not null;" json:"password"`
}

type userOrm struct {
	instance *gorm.DB
}

type UserOrm interface {
	// interface
	Create(username string, password string) (User, error)
	GetAll() ([]User, error)
	GetOneByUsername(username string) (User, error)
	GetOneById(id uuid.UUID) (User, error)
}

var Users UserOrm

func init() {
	database.DB.Get().AutoMigrate(&User{})
	Users = &userOrm{instance: database.DB.Get()}
}

// interface functions
func (o *userOrm) Create(username string, password string) (User, error) {
	user := User{Username: username, Password: password}
	result := o.instance.Create(&user)

	return user, result.Error
}

func (o *userOrm) GetAll() ([]User, error) {
	var users []User
	result := o.instance.Find(&users)

	return users, result.Error
}

func (o *userOrm) GetOneByUsername(username string) (User, error) {
	var user User
	err := o.instance.Model(User{}).Where("username = ?", username).Take(&user).Error

	return user, err
}

func (o *userOrm) GetOneById(id uuid.UUID) (User, error) {
	var user User
	err := o.instance.Model(User{}).Where("id = ?", id).Take(&user).Error

	return user, err
}
