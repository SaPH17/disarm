package controllers

import (
	"disarm/main/models"
	"disarm/main/utils/token"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func CheckLoggedInUser(c *gin.Context) {
	user_id, err := token.ExtractTokenID(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": user_id})
}

func GetCurrentUser(c *gin.Context) {
	user_id, err := token.ExtractTokenID(c)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u, err := models.Users.GetOneById(user_id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "data": u})
}

func AuthenticateUser(c *gin.Context) {
	var body struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, retrieveErr := models.Users.GetOneByEmail(body.Email)

	if retrieveErr != nil {
		return
	}

	passwErr := VerifyPassword(body.Password, user.Password)

	if passwErr != nil && passwErr == bcrypt.ErrMismatchedHashAndPassword {
		return
	}

	token, tokenErr := token.GenerateToken(user.ID)

	if tokenErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "username or password is incorrect."})
		return
	}

	envErr := godotenv.Load(".env")

	if envErr != nil {
		log.Fatalf("[!] error loading env file")
		return
	}

	token_lifespan, err := strconv.Atoi(os.Getenv("TOKEN_HOUR_LIFESPAN"))

	if err != nil {
		return
	}

	t := &http.Cookie{Name: "token", Value: token, Expires: time.Now().Add(time.Hour * time.Duration(token_lifespan)), HttpOnly: true, Path: "/"}

	http.SetCookie(c.Writer, t)
	c.JSON(http.StatusOK, gin.H{"token": token, "id": user.ID, "username": user.Username, "is_password_changed": user.IsPasswordChanged, "expires": time.Now().Add(time.Hour * time.Duration(token_lifespan))})
}

func VerifyPassword(password string, hashed string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password))
}