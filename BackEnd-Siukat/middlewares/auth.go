package middlewares

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JwtAuth Middleware menggantikan passport-jwt strategy pada Node.js
func JwtAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			fmt.Println("DEBUG AUTH: Missing Authorization Header")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			fmt.Printf("DEBUG AUTH: Malformed Header: %v\n", authHeader)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			c.Abort()
			return
		}

		tokenString := parts[1]
		fmt.Printf("DEBUG AUTH: Token String: '%s'\n", tokenString)
		secret := os.Getenv("SECRET") // Sesuai dengan constants/secret.js

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			fmt.Printf("DEBUG AUTH: Invalid Token: %v, Secret length: %d\n", err, len(secret))
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Ambil payload (di Node.js berbentuk { id: data.no_peserta })
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			userID := fmt.Sprintf("%v", claims["id"])
			// Simpan no_peserta (id) ke context agar bisa diakses controller/routes seperti req.user.no_peserta
			c.Set("no_peserta", userID)
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}
	}
}
