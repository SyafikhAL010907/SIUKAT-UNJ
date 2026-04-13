package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/utils"
	"fmt"
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
			c.JSON(http.StatusInternalServerError, "Gagal mengambil data admin: "+err.Error())
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

		// Cari admin yang sudah ada (berdasarkan username_lama atau username saat ini)
		var existing models.Admin
		isUpdate := false

		// 1. Coba cari berdasarkan UsernameLama (jika ada)
		if req.UsernameLama != "" {
			if err := tx.Where("username = ?", req.UsernameLama).First(&existing).Error; err == nil {
				isUpdate = true
			}
		}

		// 2. Jika belum ketemu, coba cari berdasarkan Username baru (jika username tidak berubah)
		if !isUpdate {
			if err := tx.Where("username = ?", req.Username).First(&existing).Error; err == nil {
				isUpdate = true
				req.UsernameLama = req.Username // Sinkronkan username_lama jika ditemukan
			}
		}

		if isUpdate {
			// PROSES UPDATE (Termasuk Reset Password)
			updatesAdmin := map[string]interface{}{
				"username":     req.Username,
				"nama_lengkap": req.NamaLengkap,
				"no_telepon":   req.NoTelepon,
				"role":         req.Role,
			}

			var passwordHash string
			if req.Password != "" {
				// User menginput password baru (Reset Password)
				hash, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
				passwordHash = string(hash)
				updatesAdmin["password"] = passwordHash
			}

			// Update Profil Admin
			if updateErr := tx.Model(&existing).Where("username = ?", req.UsernameLama).Updates(updatesAdmin).Error; updateErr != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, "Gagal memperbarui data admin: "+updateErr.Error())
				return
			}
		} else {
			// PROSES CREATE (Tambah Admin Baru)
			if req.Password == "" {
				tx.Rollback()
				c.JSON(http.StatusBadRequest, "Password wajib diisi untuk administrator baru!")
				return
			}

			hash, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
			passwordHash := string(hash)

			// Create Profil Admin
			newAdmin := models.Admin{
				Username:    req.Username,
				Password:    passwordHash,
				NamaLengkap: req.NamaLengkap,
				NoTelepon:   req.NoTelepon,
				Role:        req.Role,
			}
			if createErr := tx.Create(&newAdmin).Error; createErr != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, "Gagal membuat data admin baru: "+createErr.Error())
				return
			}
		}

		tx.Commit()
		c.JSON(http.StatusOK, "Data administrator telah berhasil disimpan!")
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

		tx.Commit()
		c.JSON(http.StatusOK, "Data administrator telah dihapus!")
	})

	// Route for injecting data from Excel
	auth.POST("/inject-data", utils.InjectDataExcel)

	// Global Trigger: Update Flag to terima_ukt for mass students
	auth.POST("/trigger-terima-ukt", func(c *gin.Context) {
		type ReqTrigger struct {
			Year  string `json:"year"`
			Jalur string `json:"jalur"` // SNBP, SNBT, or MANDIRI
			Flag  string `json:"flag"`  // terima_ukt, pengumuman, etc.
		}
		var req ReqTrigger
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		// Default flag if empty for safety
		if req.Flag == "" {
			req.Flag = "terima_ukt"
		}

		tx := config.DB.Begin()

		// Mapping Jalur ke Kode (Patokan Utama)
		jalurMapping := map[string]int{
			"SNBP":    1,
			"SNBT":    2,
			"MANDIRI": 3,
		}

		var info models.Info
		found := false

		// 1. PRIORITAS UTAMA: Cari berdasarkan Tahun & Kode (Hasil Pemetaan)
		if kode, ok := jalurMapping[req.Jalur]; ok {
			if err := tx.Where("tahun = ? AND kode = ?", req.Year, kode).First(&info).Error; err == nil {
				found = true
			}
		}

		// 2. FALLBACK (LOGIKA LAMA): Cari berdasarkan Tahun & Like Jalur (Jangan dihapus fungsinya)
		if !found {
			if err := tx.Where("tahun = ? AND pengisian LIKE ?", req.Year, "%"+req.Jalur+"%").First(&info).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusOK, gin.H{
					"success": false, 
					"error": "Periode jalur untuk tahun " + req.Year + " belum terdaftar di sistem!",
				})
				return
			}
		}

		// 2. Lakukan Update Massal pada tb_cmahasiswa via Join dengan tb_user
		// u.jalur_masuk harus sama dengan info.Kode
		result := tx.Table("tb_cmahasiswa").
			Where("no_peserta IN (SELECT no_peserta FROM tb_user WHERE jalur_masuk = ?)", info.Kode).
			Update("flag", req.Flag)

		if result.Error != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal melakukan update status massal: " + result.Error.Error()})
			return
		}

		// Pintar: Cek apakah ada data yang beneran ter-update
		if result.RowsAffected == 0 {
			tx.Rollback()
			c.JSON(http.StatusOK, gin.H{
				"success": false, 
				"error": "Data mahasiswa tidak ditemukan di jalur ini!",
			})
			return
		}

		tx.Commit()

		message := "Berhasil! " + fmt.Sprintf("%d", result.RowsAffected) + " mahasiswa " + req.Jalur + " Tahun " + req.Year + " telah diubah menjadi TERIMA UKT!"
		c.JSON(http.StatusOK, gin.H{
			"message": message,
			"updated": result.RowsAffected,
		})
	})
}

