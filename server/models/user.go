package models

import (
  	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	username string `gorm:"size:255;not null;unique" json:"username"`
	password string `gorm:"size:255;not null;" json:"password"`
}