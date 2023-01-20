package seeders

import (
	"disarm/main/models"

	"golang.org/x/crypto/bcrypt"

	gorm_seeder "github.com/kachit/gorm-seeder"
	"gorm.io/gorm"
)

type UsersSeeder struct {
	gorm_seeder.SeederAbstract
}

func NewUsersSeeder(cfg gorm_seeder.SeederConfiguration) UsersSeeder {
	return UsersSeeder{gorm_seeder.NewSeederAbstract(cfg)}
}

func (s *UsersSeeder) Seed(db *gorm.DB) error {
	u, dbErr := models.Users.GetAll()

	if len(u) != 0 {
		return dbErr
	}

	var users []models.User
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("root"), bcrypt.DefaultCost)

	users = append(users, models.User{Email: "root@root.com", Username: "root", Password: string(hashedPassword), IsPasswordChanged: false})

	return db.CreateInBatches(users, s.Configuration.Rows).Error
}

func (s *UsersSeeder) Clear(db *gorm.DB) error {
	return s.SeederAbstract.Delete(db, "users")
}
