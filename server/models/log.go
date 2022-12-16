package models

import (
	"disarm/main/database"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

type Log struct {
	Base
	Endpoint string    `gorm:"size:255;not null;" json:"endpoint"`
	Payload  string    `gorm:"size:255;not null;" json:"payload"`
	UserId   uuid.UUID `gorm:"type:uuid;" json:"user_id"`
	User     User
}

type logOrm struct {
	instance *gorm.DB
}

type LogOrm interface {
}

var Logs LogOrm

func init() {
	database.DB.Get().AutoMigrate(&Log{})
	Logs = &logOrm{instance: database.DB.Get()}
}
