package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// users.js handler -> login, getNopes, getUser, etc.
func AuthRoutes(r *gin.RouterGroup) {
	auth := r.Group("/users")

	// Endpoint Login
	auth.POST("/login", func(c *gin.Context) {
		type LoginRequest struct {
			NoPeserta string `json:"no_peserta" binding:"required"`
			Password  string `json:"password" binding:"required"`
			Kode      string `json:"kode"`
			Jawaban   string `json:"jawaban"`
		}

		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		var user models.User
		if err := config.DB.Preload("CMahasiswa").Where("no_peserta = ?", req.NoPeserta).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "no such user found"})
			return
		}

		if user.Role == "belum_lengkap" {
			c.JSON(http.StatusForbidden, gin.H{"message": "Anda belum menyelesaikan verifikasi akademik"})
			return
		}

		// Passport BCrypt Compare
		err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "passwords did not match"})
			return
		}

		// Captcha Verification Logic Parity
		var captcha models.Captcha // Anggap model ini di generate sebelumnya
		config.DB.Where("kode = ?", req.Kode).First(&captcha)
		if captcha.Jawaban != req.Jawaban {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "pertanyaan keamanan salah"})
			return
		}

		// Generate JWT Token
		secret := os.Getenv("SECRET")
		if secret == "" {
			secret = "rahasia_negara_siukat_2026"
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"id":  user.NoPeserta,
			"exp": time.Now().Add(time.Hour * 5).Unix(), // 18000 seconds = 5 hours
		})

		tokenString, err := token.SignedString([]byte(secret))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not generate token"})
			return
		}

		flagStr := ""
		if user.CMahasiswa.NoPeserta != "" {
			flagStr = user.CMahasiswa.Flag
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "ok",
			"token":   tokenString,
			"flag":    flagStr,
		})
	})
}
