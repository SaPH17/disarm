package database

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database interface {
	Get() *gorm.DB
}

type database struct {
	instance *gorm.DB
}

var DB Database

func init() {

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatalf("[!] error loading env file")
	}

	Dbdriver := os.Getenv("DB_DRIVER")
	DbHost := os.Getenv("DB_HOST")
	DbUser := os.Getenv("DB_USER")
	DbPassword := os.Getenv("DB_PASSWORD")
	DbName := os.Getenv("DB_NAME")
	DbPort := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", DbHost, DbUser, DbPassword, DbName, DbPort)

	dbase, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println("[!] cannot connect to database:", Dbdriver)
		log.Fatal("[!] connection error:", err)
	} else {
		fmt.Println("[o] connected to the database:", Dbdriver)
	}

	DB = &database{instance: dbase}
}

func (db *database) Get() (inst *gorm.DB) {
	return db.instance
}
