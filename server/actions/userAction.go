package actions
import (
    "time"
    "math/rand"
)


func CreatePassword() (string) {
	rand.Seed(time.Now().UnixNano())
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890")

	b := make([]rune, 8)
    for i := range b {
        b[i] = letters[rand.Intn(len(letters))]
    }

    return string(b)
}
