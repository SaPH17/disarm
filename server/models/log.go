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
	Create(endpoint string, payload string, userId uuid.UUID) (Log, error)
	GetAll() ([]Log, error)
}

var Logs LogOrm

func init() {
	database.DB.Get().AutoMigrate(&Log{})
	Logs = &logOrm{instance: database.DB.Get()}
}

func (o *logOrm) Create(endpoint string, payload string, userId uuid.UUID) (Log, error) {
	log := Log{Endpoint: endpoint, Payload: payload, UserId: userId}
	result := o.instance.Create(&log)

	return log, result.Error
}

func (o *logOrm) GetAll() ([]Log, error) {
	var logs []Log
	result := o.instance.Preload("User").Find(&logs)

	return logs, result.Error
}
