package routes

import (
	"log"
	"strings"
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"net/http"
	"os"
	"strconv"
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
		// Gunakan map[string]interface{} biar fleksibel nerima tipe data apa aja dari FE
		var body map[string]interface{}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON mapping"})
			return
		}

		// LOG SEMUA DATA YANG MASUK (Cek di terminal!)
		log.Printf("DEBUG LOGIN - PEMERIKSAAN PAKET: %+v", body)

		noPeserta, _ := body["no_peserta"].(string)
		password, _ := body["password"].(string)
		
		// Handle kode_captcha atau kode (bisa int, float64, atau string)
		var kodeInt int
		valCaptcha, okCaptcha := body["kode_captcha"]
		if !okCaptcha {
			valCaptcha, okCaptcha = body["kode"]
		}

		if okCaptcha {
			if k, ok := valCaptcha.(float64); ok {
				kodeInt = int(k)
			} else if kStr, ok := valCaptcha.(string); ok {
				kodeInt, _ = strconv.Atoi(kStr)
			} else if kInt, ok := valCaptcha.(int); ok {
				kodeInt = kInt
			}
		}

		// Handle jawaban (bisa int, float64, atau string)
		jawabanStr := ""
		if j, ok := body["jawaban"].(string); ok {
			jawabanStr = j
		} else if jNum, ok := body["jawaban"].(float64); ok {
			jawabanStr = strconv.FormatFloat(jNum, 'f', -1, 64)
		} else if jInt, ok := body["jawaban"].(int); ok {
			jawabanStr = strconv.Itoa(jInt)
		}

		if noPeserta == "" || password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Nomor peserta dan password wajib diisi"})
			return
		}

		var user models.User
		if err := config.DB.Preload("CMahasiswa").Where("no_peserta = ?", noPeserta).First(&user).Error; err != nil {
			log.Printf("DEBUG LOGIN: User %s tidak ditemukan di database", noPeserta)
			c.JSON(http.StatusUnauthorized, gin.H{"message": "no such user found"})
			return
		}

		if user.Role == "belum_lengkap" {
			log.Printf("DEBUG LOGIN: User %s statusnya belum_lengkap", noPeserta)
			c.JSON(http.StatusForbidden, gin.H{"message": "Anda belum menyelesaikan verifikasi akademik"})
			return
		}

		// Passport BCrypt Compare
		err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
		if err != nil {
			log.Printf("DEBUG LOGIN: Password untuk user %s SALAH (Input: %s, Hash di DB: %s)", noPeserta, password, user.Password)
			c.JSON(http.StatusUnauthorized, gin.H{"message": "passwords did not match"})
			return
		}

		// Captcha Verification Logic Parity
		var captcha models.Captcha
		if err := config.DB.Where("kode = ?", kodeInt).First(&captcha).Error; err != nil {
			log.Printf("DEBUG LOGIN: Captcha ID %d TIDAK DITEMUKAN di database", kodeInt)
			c.JSON(http.StatusUnauthorized, gin.H{"message": "pertanyaan keamanan tidak valid"})
			return
		}

		if strconv.Itoa(captcha.Jawaban) != jawabanStr {
			log.Printf("DEBUG LOGIN: Jawaban Captcha SALAH (Kode: %d, Jawaban Seharusnya: %d, Input: %s)", kodeInt, captcha.Jawaban, jawabanStr)
			c.JSON(http.StatusUnauthorized, gin.H{"message": "pertanyaan keamanan salah"})
			return
		}

		// Generate JWT Token
		secret := os.Getenv("SECRET")
		if secret == "" {
			secret = "rahasia_negara_siukat_2026_unj"
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

	// GET /all
	auth.GET("/all", func(c *gin.Context) {
		var users []models.User
		if err := config.DB.Find(&users).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, users)
	})

	// GET /id/:id
	auth.GET("/id/:id", func(c *gin.Context) {
		id := c.Param("id")
		var user models.User
		if err := config.DB.Where("no_peserta = ?", id).First(&user).Error; err != nil {
			c.JSON(http.StatusOK, gin.H{"msg": "data tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, user)
	})

	// Add/Update (Admin usage)
	auth.POST("/add", func(c *gin.Context) {
		type ReqAdd struct {
			UsernameLama string `json:"username_lama"`
			NoPeserta    string `json:"no_peserta"`
			Password     string `json:"password"`
		}
		var req ReqAdd
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, err)
			return
		}

		var existing models.User
		if err := config.DB.Where("no_peserta = ?", req.UsernameLama).First(&existing).Error; err == nil {
			// update
			updates := map[string]interface{}{"no_peserta": req.NoPeserta}
			if req.Password != "" {
				hash, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
				updates["password"] = string(hash)
			}
			config.DB.Model(&existing).Updates(updates)
			c.JSON(http.StatusOK, gin.H{"msg": "success", "data": existing})
			return
		}

		// create
		hash, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		newUser := models.User{
			NoPeserta: req.NoPeserta,
			Password:  string(hash),
			Role:      "admin",
		}
		config.DB.Create(&newUser)
		c.JSON(http.StatusOK, gin.H{"msg": "success", "data": newUser})
	})

	auth.GET("/getNopes", middlewares.JwtAuth(), func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		c.JSON(http.StatusOK, noPeserta)
	})

	auth.GET("/getUser", middlewares.JwtAuth(), func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		srv := services.UsersService{}
		res, err := srv.GetUser(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, res)
	})

	auth.DELETE("/delete/:username", middlewares.JwtAuth(), func(c *gin.Context) {
		username := c.Param("username")
		if err := config.DB.Where("no_peserta = ? AND role = ?", username, "admin").Delete(&models.User{}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, "Data telah dihapus!")
	})

	auth.PUT("/edit/id/:id", func(c *gin.Context) {
		id := c.Param("id")
		type EditReq struct {
			NoPeserta string `json:"no_peserta"`
			Password  string `json:"password"`
		}
		var req EditReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, err)
			return
		}
		if err := config.DB.Model(&models.User{}).Where("no_peserta = ?", id).Updates(models.User{
			NoPeserta: req.NoPeserta,
			Password:  req.Password,
		}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, gin.H{"msg": "success"})
	})

	auth.GET("/hash-all", func(c *gin.Context) {
		var users []models.User
		config.DB.Where("role = ?", "cmahasiswa").Find(&users)
		count := 0
		for _, u := range users {
			// Hanya hash jika belum berbentuk bcrypt hash (biasanya diawali $2a$)
			if !strings.HasPrefix(u.Password, "$2a$") {
				hash, _ := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
				config.DB.Model(&models.User{}).Where("no_peserta = ? AND role = ?", u.NoPeserta, "cmahasiswa").Update("password", string(hash))
				count++
			}
		}
		c.String(http.StatusOK, "Berhasil sinkronisasi %d user", count)
	})
}
