package models

import (
	"database/sql"
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type User struct {
	Base
	Email              string         `gorm:"size:255;not null;unique" json:"email"`
	Username           string         `gorm:"size:255;not null;unique" json:"username"`
	Password           string         `gorm:"size:255;not null;" json:"password"`
	DirectSupervisorId sql.NullString `gorm:"size:255;" json:"direct_supervisor_id"`
}

type userOrm struct {
	instance *gorm.DB
}

type UserOrm interface {
	Create(email string, password string, username string, directSupervisorId sql.NullString) (User, error)
	GetAll() ([]User, error)
	GetOneByEmail(email string) (User, error)
	GetOneById(id uuid.UUID) (User, error)
}

var Users UserOrm

func init() {
	database.DB.Get().AutoMigrate(&User{})
	Users = &userOrm{instance: database.DB.Get()}
}

func (o *userOrm) Create(email string, password string, username string, directSupervisorId sql.NullString) (User, error) {
	user := User{Email: email, Username: username, Password: password, DirectSupervisorId: directSupervisorId}
	result := o.instance.Create(&user)

	return user, result.Error
}

func (o *userOrm) GetAll() ([]User, error) {
	var users []User
	result := o.instance.Find(&users)

	return users, result.Error
}

func (o *userOrm) GetOneByEmail(email string) (User, error) {
	var user User
	err := o.instance.Model(User{}).Where("email = ?", email).Take(&user).Error

	return user, err
}

func (o *userOrm) GetOneById(id uuid.UUID) (User, error) {
	var user User
	err := o.instance.Model(User{}).Where("id = ?", id).Take(&user).Error

	return user, err
}
