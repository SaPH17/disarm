package token

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	uuid "github.com/satori/go.uuid"
)

func GenerateToken(uid uuid.UUID) (string, error) {
	token_lifespan, err := strconv.Atoi(os.Getenv("TOKEN_HOUR_LIFESPAN"))

	if err != nil {
		return "", err
	}

	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["user_id"] = uid
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(token_lifespan)).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(os.Getenv("API_SECRET")))
}

func ValidateToken(c *gin.Context) (uuid.UUID, error) {
	tokenString := ExtractToken(c)
	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("[!] unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("API_SECRET")), nil
	})

	if err != nil {
		return uuid.Nil, err
	}

	u, parseErr := uuid.FromString((claims["user_id"].(string)))

	if parseErr != nil {
		return uuid.Nil, parseErr
	}

	return u, nil
}

func ExtractToken(c *gin.Context) string {
	token := c.Query("token")

	if token != "" {
		return token
	}

	// bearerToken := c.Request.Header.Get("Authorization")
	// if len(strings.Split(bearerToken, " ")) == 2 {
	// 	return strings.Split(bearerToken, " ")[1]
	// }

	cookie, err := c.Request.Cookie("token")
	if err != nil {
		return ""
	}

	return cookie.Value
}

func ExtractTokenID(c *gin.Context) (uuid.UUID, error) {
	tokenString := ExtractToken(c)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("[!] unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("API_SECRET")), nil
	})

	if err != nil {
		return uuid.Nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if ok && token.Valid {
		return uuid.FromStringOrNil(claims["user_id"].(string)), nil
	}

	return uuid.Nil, nil
}
