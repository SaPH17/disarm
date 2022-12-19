package models

import (
	"database/sql"
	"disarm/main/database"
	"fmt"

	gorm_seeder "github.com/kachit/gorm-seeder"
	"golang.org/x/crypto/bcrypt"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type User struct {
	Base
	Groups       []Group    `gorm:"many2many:user_groups"`
	Email        string     `gorm:"size:255;not null;unique" json:"email"`
	Username     string     `gorm:"size:255;not null;unique" json:"username"`
	Password     string     `gorm:"size:255;not null;" json:"password"`
	SupervisorID *uuid.UUID `gorm:"type:uuid;" json:"supervisor_id"`
	Supervisor   *User      `gorm:"foreignkey:SupervisorID"`
}

type userOrm struct {
	instance *gorm.DB
}

type UserOrm interface {
	Create(email string, password string, username string, supervisor *User, groups []Group) (User, error)
	GetAll() ([]User, error)
	GetOneByEmail(email string) (User, error)
	GetOneById(id uuid.UUID) (User, error)
	Edit(id uuid.UUID, email string, password string, username string, directSupervisorId sql.NullString) (User, error)
	Delete(id uuid.UUID) (bool, error)
	DeleteManyByIds(ids []uuid.UUID) (bool, error)
}

var Users UserOrm

func init() {
	database.DB.Get().AutoMigrate(&User{})
	Users = &userOrm{instance: database.DB.Get()}

	usersSeeder := NewUsersSeeder(gorm_seeder.SeederConfiguration{Rows: 1})
	seedersStack := gorm_seeder.NewSeedersStack(database.DB.Get())
	seedersStack.AddSeeder(&usersSeeder)

	err := seedersStack.Seed()
	fmt.Println(err)
}

func (o *userOrm) Create(email string, password string, username string, supervisor *User, groups []Group) (User, error) {
	user := User{Email: email, Username: username, Password: password, Supervisor: supervisor, Groups: groups}

	result := o.instance.Omit("Groups.*").Omit("Supervisor").Create(&user)

	return user, result.Error
}

func (o *userOrm) GetAll() ([]User, error) {
	var users []User
	result := o.instance.Preload("Groups").Find(&users)

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

func (o *userOrm) Edit(id uuid.UUID, email string, password string, username string, directSupervisorId sql.NullString) (User, error) {
	var user User
	err := o.instance.Model(User{}).Where("id = ?", id).Take(&user).Error
	user.Email = email
	user.Password = password
	user.Username = username
	o.instance.Save(user)

	return user, err
}

func (o *userOrm) Delete(id uuid.UUID) (bool, error) {
	var user User
	err := o.instance.Model(User{}).Where("id = ?", id).Take(&user).Error
	o.instance.Delete(&user)

	return true, err
}

func (o *userOrm) DeleteManyByIds(ids []uuid.UUID) (bool, error) {
	var users []User
	err := o.instance.Model(User{}).Where("id IN ?", ids).Find(&users).Error
	o.instance.Delete(&users)

	return true, err
}

type UsersSeeder struct {
	gorm_seeder.SeederAbstract
}

func NewUsersSeeder(cfg gorm_seeder.SeederConfiguration) UsersSeeder {
	return UsersSeeder{gorm_seeder.NewSeederAbstract(cfg)}
}

func (s *UsersSeeder) Seed(db *gorm.DB) error {
	var users []User
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("root"), bcrypt.DefaultCost)

	users = append(users, User{Email: "root@root.com", Username: "root", Password: string(hashedPassword)})
	// ,DirectSupervisorId: sql.NullString{String: "", Valid: false}}

	return db.CreateInBatches(users, s.Configuration.Rows).Error
}

func (s *UsersSeeder) Clear(db *gorm.DB) error {
	return s.SeederAbstract.Delete(db, "users")
}
