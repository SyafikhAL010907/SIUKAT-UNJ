package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"BackEnd-Siukat/utils"
	"fmt"
	"net/http"
	"strconv"
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
		fmt.Printf("\n[DEBUG] PUT /ayah/edit - NoPeserta: %s\n", np)
		fmt.Printf("[DEBUG] Raw status_ayah: '%s'\n", statusAyah)
		fmt.Printf("[DEBUG] Raw nama_ayah: '%s'\n", c.PostForm("nama_ayah"))
		
		data := map[string]interface{}{
			"nama_ayah":        c.PostForm("nama_ayah"),
			"status_ayah":      statusAyah,
			"tempat_lahir_ayah": c.PostForm("tempat_lahir_ayah"),
		}

		if statusAyah == "wafat" {
			data["nik_ayah"] = ""
			data["telepon_ayah"] = ""
			data["alamat_ayah"] = ""
			data["provinsi_ayah"] = ""
			data["kabkot_ayah"] = ""
			data["kecamatan_ayah"] = ""
			data["pekerjaan_ayah"] = 0
			data["penghasilan_ayah"] = 0
			data["sampingan_ayah"] = 0
			data["scan_ktp_ayah"] = ""
			data["scan_slip_ayah"] = ""
			data["tempat_lahir_ayah"] = ""
			data["tanggal_lahir_ayah"] = nil
		} else {
			data["nik_ayah"] = c.PostForm("nik_ayah")
			data["telepon_ayah"] = c.PostForm("telepon_ayah")
			data["alamat_ayah"] = c.PostForm("alamat_ayah")
			data["provinsi_ayah"] = c.PostForm("provinsi_ayah")
			data["kabkot_ayah"] = c.PostForm("kabkot_ayah")
			data["kecamatan_ayah"] = c.PostForm("kecamatan_ayah")
			
			// Simpan sebagai string sesuai tipe kolom char(2) di DB (parity dengan ibu.go)
			data["pekerjaan_ayah"] = c.PostForm("pekerjaan_ayah")
			
			pen, _ := strconv.Atoi(c.PostForm("penghasilan_ayah"))
			data["penghasilan_ayah"] = pen

			sam, _ := strconv.Atoi(c.PostForm("sampingan_ayah"))
			data["sampingan_ayah"] = sam

			if tgl, errTgl := time.Parse("2006-01-02", c.PostForm("tanggal_lahir_ayah")); errTgl == nil {
				data["tanggal_lahir_ayah"] = &tgl
				fmt.Printf("[DEBUG] Parsed tanggal_lahir_ayah: %v\n", tgl)
			} else {
				if c.PostForm("tanggal_lahir_ayah") != "" {
					fmt.Printf("[WARNING] FAILED to parse tanggal_lahir_ayah: '%s' (Format mismatch, expected YYYY-MM-DD). Error: %v\n", c.PostForm("tanggal_lahir_ayah"), errTgl)
				}
			}

			fmt.Printf("[DEBUG] Final Data Map to Save (Ayah): %+v\n", data)

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
				filename := fmt.Sprintf("KTP_Ayah_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
				newPath, err := utils.HandleDynamicUpload(c, fileKtp, student.NamaCmahasiswa, np, "original", filename)
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
				filename := fmt.Sprintf("Slip_Ayah_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
				newPath, err := utils.HandleDynamicUpload(c, fileSlip, student.NamaCmahasiswa, np, "original", filename)
				if err == nil {
					data["scan_slip_ayah"] = newPath
				}
			}
		}

		// 1. Ambil data lama SEBELUM update untuk Log (Hanya jika ada)
		var existingAyah models.Ayah
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&existingAyah)
		
		// 2. Jalankan Update/Upsert
		res, err := ayahService.Edit(data, np, "original")
		if err != nil {
			fmt.Printf("[DEBUG] ERROR updating DB: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal simpan data: " + err.Error()})
			return
		}
		fmt.Printf("[DEBUG] SUCCESS updating DB for %s\n", np)

		// 3. Simpan Log
		now := time.Now()
		if existingAyah.NoPeserta != "" {
			ayahService.AddLog(existingAyah, "original", np, &now)
		} else {
			ayahService.AddLog(res, "original", np, &now)
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

		if statusAyah == "wafat" {
			data["nik_ayah"] = ""
			data["telepon_ayah"] = ""
			data["alamat_ayah"] = ""
			data["provinsi_ayah"] = ""
			data["kabkot_ayah"] = ""
			data["kecamatan_ayah"] = ""
			data["pekerjaan_ayah"] = 0
			data["penghasilan_ayah"] = 0
			data["sampingan_ayah"] = 0
			data["scan_ktp_ayah"] = ""
			data["scan_slip_ayah"] = ""
			data["tempat_lahir_ayah"] = ""
			data["tanggal_lahir_ayah"] = nil
		} else {
			data["nik_ayah"] = c.PostForm("nik_ayah")
			data["telepon_ayah"] = c.PostForm("telepon_ayah")
			data["alamat_ayah"] = c.PostForm("alamat_ayah")
			data["provinsi_ayah"] = c.PostForm("provinsi_ayah")
			data["kabkot_ayah"] = c.PostForm("kabkot_ayah")
			data["kecamatan_ayah"] = c.PostForm("kecamatan_ayah")
			
			// Simpan sebagai string sesuai tipe kolom char(2) di DB (parity dengan ibu.go)
			data["pekerjaan_ayah"] = c.PostForm("pekerjaan_ayah")
			
			pen, _ := strconv.Atoi(c.PostForm("penghasilan_ayah"))
			data["penghasilan_ayah"] = pen

			sam, _ := strconv.Atoi(c.PostForm("sampingan_ayah"))
			data["sampingan_ayah"] = sam

			// Parse Tanggal Lahir (Fix for Klarifikasi/Admin)
			if tglStr := c.PostForm("tanggal_lahir_ayah"); tglStr != "" {
				if tgl, err := time.Parse("2006-01-02", tglStr); err == nil {
					data["tanggal_lahir_ayah"] = &tgl
					fmt.Printf("[DEBUG] Admin Parsed tanggal_lahir_ayah: %v\n", tgl)
				} else {
					fmt.Printf("[WARNING] Admin FAILED to parse tanggal_lahir_ayah: '%s'. Error: %v\n", tglStr, err)
				}
			}

			// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) - SANGGAH ---
			var student models.CMahasiswa
			config.DB.Where("no_peserta = ?", np).First(&student)

			// --- FIX: Ambil data lama Ayah Sanggah ---
			var oldAyah models.Ayah
			config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&oldAyah)

			fileKtp, errKtp := c.FormFile("file_scan_ktp_ayah")
			if errKtp == nil {
				utils.DeleteOldFile(oldAyah.ScanKtpAyah)
				filename := fmt.Sprintf("KTP_Ayah_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
				newPath, err := utils.HandleDynamicUpload(c, fileKtp, student.NamaCmahasiswa, np, "sanggah", filename)
				if err == nil {
					data["scan_ktp_ayah"] = newPath
				}
			}

			fileSlip, errSlip := c.FormFile("file_scan_slip_ayah")
			if errSlip == nil {
				utils.DeleteOldFile(oldAyah.ScanSlipAyah)
				filename := fmt.Sprintf("Slip_Ayah_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
				newPath, err := utils.HandleDynamicUpload(c, fileSlip, student.NamaCmahasiswa, np, "sanggah", filename)
				if err == nil {
					data["scan_slip_ibu"] = newPath
				}
			}
		}

		// 1. Ambil data lama untuk Log
		var existingAyah models.Ayah
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&existingAyah)

		// 2. Jalankan Update/Upsert
		res, err := ayahService.Edit(data, np, "sanggah")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal simgah data: " + err.Error()})
			return
		}

		// 3. Simpan Log
		now := time.Now()
		if existingAyah.NoPeserta != "" {
			ayahService.AddLog(existingAyah, "sanggah", np, &now)
		} else {
			ayahService.AddLog(res, "sanggah", np, &now)
		}
		
		c.JSON(http.StatusOK, res)
	})

	// GET /ayah/get-ayah
	authGroup.GET("/get-ayah", func(c *gin.Context) {
		val, exists := c.Get("no_peserta")
		if !exists {
			fmt.Printf("[DEBUG] GET /ayah/get-ayah - FAILED: context no_peserta exists: %v\n", exists)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: No Peserta missing"})
			return
		}

		np, ok := val.(string)
		if !ok {
			fmt.Printf("[DEBUG] GET /ayah/get-ayah - FAILED: context no_peserta is NOT string! Value: %v\n", val)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Error: Type mismatch"})
			return
		}

		fmt.Printf("[DEBUG] GET /ayah/get-ayah - START for: %s\n", np)
		res, err := ayahService.GetByLoggedIn(np)
		if err != nil {
			fmt.Printf("[DEBUG] GET /ayah/get-ayah - ERROR from service: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		fmt.Printf("[DEBUG] GET /ayah/get-ayah - SUCCESS for: %s\n", np)
		c.JSON(http.StatusOK, res)
	})

	// GET /ayah/get-ayah/:no_peserta
	ayahGroup.GET("/get-ayah/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		atribut := c.Query("atribut")
		var ayah models.Ayah
		var err error

		if atribut != "" {
			err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").Preload("Pekerjaan").
				Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&ayah).Error
		} else {
			err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").Preload("Pekerjaan").
				Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&ayah).Error
			if err != nil {
				err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").Preload("Pekerjaan").
					Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&ayah).Error
			}
		}

		if err != nil {
			c.JSON(http.StatusOK, gin.H{"msg": "data tidak ditemukan"})
			return
		}

		fmt.Printf("[DEBUG] Admin GET Ayah - NoPeserta: %s, PekerjaanID: %s, PekerjaanObj: %+v\n", noPeserta, ayah.PekerjaanAyah, ayah.Pekerjaan)
		c.JSON(http.StatusOK, ayah)
	})
}
