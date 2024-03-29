package models

import (
	"time"

	uuid "github.com/satori/go.uuid"
	"gorm.io/gorm"
)

// Model a basic GoLang struct which includes the following fields: ID, CreatedAt, UpdatedAt, DeletedAt
// It may be embedded into your model or you may build your own model without it
//
//	type User struct {
//	  gorm.Model
//	}
type Base struct {
	ID        uuid.UUID `gorm:"type:uuid;primarykey;" json:"id"`
	CreatedAt time.Time `gorm:"type:time;" json:"created_at"`
	UpdatedAt time.Time `gorm:"type:time;" json:"updated_at"`
	// DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (base *Base) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.NewV4()
	return
}
