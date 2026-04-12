package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func AdminRoutes(r *gin.RouterGroup) {
	group := r.Group("/admin")
	auth := group.Group("/")
	auth.Use(middlewares.JwtAuth())

	auth.POST("/datatable", func(c *gin.Context) {
		type dtReq struct {
			Page    int    `json:"page"`
			PerPage int    `json:"perPage"`
			Keyword string `json:"keyword"`
		}
		var req dtReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, err)
			return
		}

		var admins []models.Admin
		var count int64

		tx := config.DB.Begin()

		query := tx.Model(&models.Admin{})
		if req.Keyword != "" {
			query = query.Where("username LIKE ? OR nama_lengkap LIKE ?", req.Keyword+"%", "%"+req.Keyword+"%")
		}

		if err := query.Count(&count).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, "Error: RollBack")
			return
		}

		if err := query.Limit(req.PerPage).Offset((req.Page - 1) * req.PerPage).Find(&admins).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, "Error: RollBack")
			return
		}

		tx.Commit()

		c.JSON(http.StatusOK, gin.H{
			"count":       count,
			"rows":        admins,
			"currentPage": req.Page,
			"perPage":     req.PerPage,
			"keyword":     req.Keyword,
		})
	})

	auth.GET("/username/:username", func(c *gin.Context) {
		username := c.Param("username")
		var admin models.Admin
		
		tx := config.DB.Begin()
		if err := tx.Where("username = ?", username).First(&admin).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		tx.Commit()
		
		c.JSON(http.StatusOK, admin)
	})

	group.POST("/save", func(c *gin.Context) {
		type ReqSave struct {
			UsernameLama string `json:"username_lama"`
			Username     string `json:"username"`
			Password     string `json:"password"`
			NamaLengkap  string `json:"nama_lengkap"`
			NoTelepon    string `json:"no_telepon"`
			Role         string `json:"role"`
			Foto         string `json:"foto"`
		}
		var req ReqSave
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, err)
			return
		}

		tx := config.DB.Begin()

		var existing models.Admin
		err := tx.Where("username = ?", req.UsernameLama).First(&existing).Error
		
		if err == nil {
			// Update Profil Admin & Sinkronisasi Password (Reset)
			updatesAdmin := map[string]interface{}{
				"username":     req.Username,
				"nama_lengkap": req.NamaLengkap,
				"no_telepon":   req.NoTelepon,
				"role":         req.Role,
				"foto":         req.Foto,
			}

			var passwordHash string
			if req.Password != "" {
				hash, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
				passwordHash = string(hash)
				updatesAdmin["password"] = passwordHash
			}

			if updateErr := tx.Model(&existing).Where("username = ?", req.UsernameLama).Updates(updatesAdmin).Error; updateErr != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, "Gagal memperbarui data admin!")
				return
			}

			// Sinkronisasi ke tb_user
			var existingUser models.User
			if errUser := tx.Where("no_peserta = ?", req.UsernameLama).First(&existingUser).Error; errUser == nil {
				updatesUser := map[string]interface{}{
					"no_peserta": req.Username,
					"role":       "admin",
				}
				if passwordHash != "" {
					updatesUser["password"] = passwordHash
				}
				if errSync := tx.Model(&existingUser).Updates(updatesUser).Error; errSync != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, "Gagal sinkronisasi data user!")
					return
				}
			}
		} else {
			// Hash password untuk admin baru
			hash, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
			passwordHash := string(hash)

			// Create Profil Admin
			if createErr := tx.Create(&models.Admin{
				Username:    req.Username,
				Password:    passwordHash,
				NamaLengkap: req.NamaLengkap,
				NoTelepon:   req.NoTelepon,
				Role:        req.Role,
				Foto:        req.Foto,
			}).Error; createErr != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, "Gagal membuat data admin!")
				return
			}

			// Create Record di tb_user
			newUser := models.User{
				NoPeserta: req.Username,
				Password:  passwordHash,
				Role:      "admin",
			}
			if errUser := tx.Create(&newUser).Error; errUser != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, "Gagal membuat data user login!")
				return
			}
		}

		tx.Commit()
		c.JSON(http.StatusOK, "Data telah berhasil disimpan dan disinkronkan!")
	})

	auth.DELETE("/delete/:username", func(c *gin.Context) {
		username := c.Param("username")
		tx := config.DB.Begin()

		// Hapus dari tb_admin
		if err := tx.Where("username = ?", username).Delete(&models.Admin{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, "Gagal menghapus profil admin!")
			return
		}

		// Hapus dari tb_user
		if err := tx.Where("no_peserta = ? AND role = ?", username, "admin").Delete(&models.User{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, "Gagal menghapus kredensial login!")
			return
		}

		tx.Commit()
		c.JSON(http.StatusOK, "Data administrator telah dihapus!")
	})

	// Route for injecting data from Excel
	auth.POST("/inject-data", utils.InjectDataExcel)
}

