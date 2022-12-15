package models

import (
	"disarm/main/database"

	"gorm.io/gorm"
)

type Group struct {
	Base
	Name        string `gorm:"size:255;not null;unique" json:"username"`
	Description string `gorm:"size:255;not null;unique" json:"description"`
	Users       []User `gorm:"many2many:user_groups"`
}

type groupOrm struct {
	instance *gorm.DB
}

type GroupOrm interface {
	// interface
	// Create(username string, password string) (User, error)
	// GetAll() ([]User, error)
	// GetOneByUsername(username string) (User, error)
	// GetOneById(id uuid.UUID) (User, error)
}

var Groups GroupOrm

func init() {
	database.DB.Get().AutoMigrate(&Group{})
	Groups = &groupOrm{instance: database.DB.Get()}
}

// interface functions
// func (o *groupOrm) Create(username string, password string) (User, error) {
// 	user := User{Username: username, Password: password}
// 	result := o.instance.Create(&user)

// 	return user, result.Error
// }

// func (o *groupOrm) GetAll() ([]User, error) {
// 	var users []User
// 	result := o.instance.Find(&users)

// 	return users, result.Error
// }

// func (o *groupOrm) GetOneByUsername(username string) (User, error) {
// 	var user User
// 	err := o.instance.Model(User{}).Where("username = ?", username).Take(&user).Error

// 	return user, err
// }

// func (o *groupOrm) GetOneById(id uuid.UUID) (User, error) {
// 	var user User
// 	err := o.instance.Model(User{}).Where("id = ?", id).Take(&user).Error

// 	return user, err
// }
