package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"BackEnd-Siukat/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func AyahRoutes(r *gin.RouterGroup) {
	ayahGroup := r.Group("/ayah")
	ayahService := services.AyahService{}

	// GET /ayah/all
	ayahGroup.GET("/all", func(c *gin.Context) {
		var ayahs []models.Ayah
		config.DB.Find(&ayahs)
		c.JSON(http.StatusOK, ayahs)
	})

	// Apply Auth Middleware
	authGroup := ayahGroup.Group("/")
	authGroup.Use(middlewares.JwtAuth())

	// POST /ayah/add
	authGroup.POST("/add", func(c *gin.Context) {
		var req models.Ayah
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		res, err := ayahService.Add(req, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// PUT /ayah/edit
	authGroup.PUT("/edit", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)
		
		// In Gin, handling MultipartForm involves c.MultipartForm()
		// We extract the basic fields similarly to req.body in JS
		statusAyah := c.PostForm("status_ayah")
		
		data := map[string]interface{}{
			"nama_ayah":        c.PostForm("nama_ayah"),
			"status_ayah":      statusAyah,
			"tempat_lahir_ayah": c.PostForm("tempat_lahir_ayah"),
		}

		if statusAyah != "wafat" {
			data["nik_ayah"] = c.PostForm("nik_ayah")
			data["telepon_ayah"] = c.PostForm("telepon_ayah")
			data["alamat_ayah"] = c.PostForm("alamat_ayah")
			data["provinsi_ayah"] = c.PostForm("provinsi_ayah")
			data["kabkot_ayah"] = c.PostForm("kabkot_ayah")
			data["kecamatan_ayah"] = c.PostForm("kecamatan_ayah")
			data["pekerjaan_ayah"] = c.PostForm("pekerjaan_ayah")
			data["penghasilan_ayah"] = c.PostForm("penghasilan_ayah")
			data["sampingan_ayah"] = c.PostForm("sampingan_ayah")

			// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) ---
			// 1. Ambil data CMahasiswa untuk folder name
			var student models.CMahasiswa
			config.DB.Where("no_peserta = ?", np).First(&student)

			// 2. Ambil data Ayah lama untuk hapus file lama (Cleanup)
			var oldAyah models.Ayah
			config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&oldAyah)

			// 3. Handle Upload KTP
			fileKtp, errKtp := c.FormFile("file_scan_ktp_ayah")
			if errKtp == nil {
				// Hapus file KTP lama
				utils.DeleteOldFile(oldAyah.ScanKtpAyah)
				
				// Simpan file baru secara dinamis
				newPath, err := utils.HandleDynamicUpload(c, fileKtp, student.NamaCmahasiswa, np)
				if err == nil {
					data["scan_ktp_ayah"] = newPath
				}
			}

			// 4. Handle Upload Slip Gaji
			fileSlip, errSlip := c.FormFile("file_scan_slip_ayah")
			if errSlip == nil {
				// Hapus file Slip lama
				utils.DeleteOldFile(oldAyah.ScanSlipAyah)
				
				// Simpan file baru secara dinamis
				newPath, err := utils.HandleDynamicUpload(c, fileSlip, student.NamaCmahasiswa, np)
				if err == nil {
					data["scan_slip_ayah"] = newPath
				}
			}
		}

		// LOGGING
		var ayah models.Ayah
		config.DB.Where("no_peserta = ?", np).First(&ayah)
		now := time.Now()
		ayahService.AddLog(ayah, "original", np, &now)

		// UPDATE
		res, err := ayahService.Edit(data, np, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	authGroup.PUT("/edit/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		np := noPeserta
		
		statusAyah := c.PostForm("status_ayah")
		data := map[string]interface{}{
			"nama_ayah":        c.PostForm("nama_ayah"),
			"status_ayah":      statusAyah,
			"tempat_lahir_ayah": c.PostForm("tempat_lahir_ayah"),
		}

		if statusAyah != "wafat" {
			data["nik_ayah"] = c.PostForm("nik_ayah")
			data["telepon_ayah"] = c.PostForm("telepon_ayah")
			data["alamat_ayah"] = c.PostForm("alamat_ayah")
			data["provinsi_ayah"] = c.PostForm("provinsi_ayah")
			data["kabkot_ayah"] = c.PostForm("kabkot_ayah")
			data["kecamatan_ayah"] = c.PostForm("kecamatan_ayah")
			data["pekerjaan_ayah"] = c.PostForm("pekerjaan_ayah")
			data["penghasilan_ayah"] = c.PostForm("penghasilan_ayah")
			data["sampingan_ayah"] = c.PostForm("sampingan_ayah")

			// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) - SANGGAH ---
			var student models.CMahasiswa
			config.DB.Where("no_peserta = ?", np).First(&student)

			var oldAyah models.Ayah
			config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&oldAyah)

			fileKtp, errKtp := c.FormFile("file_scan_ktp_ayah")
			if errKtp == nil {
				utils.DeleteOldFile(oldAyah.ScanKtpAyah)
				newPath, err := utils.HandleDynamicUpload(c, fileKtp, student.NamaCmahasiswa, np)
				if err == nil {
					data["scan_ktp_ayah"] = newPath
				}
			}

			fileSlip, errSlip := c.FormFile("file_scan_slip_ayah")
			if errSlip == nil {
				utils.DeleteOldFile(oldAyah.ScanSlipAyah)
				newPath, err := utils.HandleDynamicUpload(c, fileSlip, student.NamaCmahasiswa, np)
				if err == nil {
					data["scan_slip_ayah"] = newPath
				}
			}
		}

		var ayah models.Ayah
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&ayah)
		now := time.Now()
		ayahService.AddLog(ayah, "sanggah", np, &now)

		res, err := ayahService.Edit(data, np, "sanggah")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// GET /ayah/get-ayah
	authGroup.GET("/get-ayah", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		res, err := ayahService.GetByLoggedIn(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// GET /ayah/get-ayah/:no_peserta
	ayahGroup.GET("/get-ayah/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		var ayah models.Ayah
		
		err := config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
			Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&ayah).Error

		if err != nil {
			err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
				Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&ayah).Error
		}

		if err != nil {
			c.JSON(http.StatusOK, gin.H{"msg": "data tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, ayah)
	})
}
