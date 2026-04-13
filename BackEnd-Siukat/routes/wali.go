package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"BackEnd-Siukat/utils"
	"net/http"
	"strconv"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

func WaliRoutes(r *gin.RouterGroup) {
	group := r.Group("/wali")
	srv := services.WaliService{}

	authGroup := group.Group("/")
	authGroup.Use(middlewares.JwtAuth())

	authGroup.POST("/add", func(c *gin.Context) {
		var req models.Wali
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		res, err := srv.Add(req, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	authGroup.PUT("/edit", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		// Parity with other routes: handle multipart form
		statusWali := c.PostForm("status_wali")
		namaWali := c.PostForm("nama_wali")
		if statusWali == "tidak" {
			namaWali = "-"
		}
		data := map[string]interface{}{
			"status_wali":    statusWali,
			"nama_wali":      namaWali,
			"alamat_wali":    c.PostForm("alamat_wali"),
			"provinsi_wali":  c.PostForm("provinsi_wali"),
			"kabkot_wali":    c.PostForm("kabkot_wali"),
			"kecamatan_wali": c.PostForm("kecamatan_wali"),
		}

		if k, err := strconv.Atoi(c.PostForm("kesanggupan_wali")); err == nil {
			data["kesanggupan_wali"] = k
		}

		// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) ---
		var student models.CMahasiswa
		config.DB.Where("no_peserta = ?", np).First(&student)

		var existing models.Wali
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&existing)

		fileScan, errScan := c.FormFile("file_scan_wali")
		if errScan == nil {
			utils.DeleteOldFile(existing.ScanWali)
			filename := fmt.Sprintf("Surat_Wali_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
			newPath, err := utils.HandleDynamicUpload(c, fileScan, student.NamaCmahasiswa, np, "original", filename)
			if err == nil {
				data["scan_wali"] = newPath
			}
		}

		// 1. Ambil data lama SEBELUM update untuk Log
		var existingWali models.Wali
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&existingWali)
		
		// 2. Jalankan Update/Upsert
		res, err := srv.Edit(data, np, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal simpan data: " + err.Error()})
			return
		}

		// 3. Simpan Log
		now := time.Now()
		if existingWali.NoPeserta != "" {
			srv.AddLog(existingWali, "original", np, &now)
		} else {
			srv.AddLog(res, "original", np, &now)
		}
		
		c.JSON(http.StatusOK, res)
	})

	authGroup.PUT("/edit/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		np := noPeserta

		statusWali := c.PostForm("status_wali")
		namaWali := c.PostForm("nama_wali")
		if statusWali == "tidak" {
			namaWali = "-"
		}
		data := map[string]interface{}{
			"status_wali":       statusWali,
			"nama_wali":         namaWali,
			"alamat_wali":       c.PostForm("alamat_wali"),
			"provinsi_wali":     c.PostForm("provinsi_wali"),
			"kabkot_wali":       c.PostForm("kabkot_wali"),
			"kecamatan_wali":    c.PostForm("kecamatan_wali"),
			"tempat_lahir_wali": c.PostForm("tempat_lahir_wali"),
		}

		data["pekerjaan_wali"] = c.PostForm("pekerjaan_wali")

		// Parse Tanggal Lahir
		if tgl, err := time.Parse("2006-01-02", c.PostForm("tanggal_lahir_wali")); err == nil {
			data["tanggal_lahir_wali"] = &tgl
		}

		if k, err := strconv.Atoi(c.PostForm("kesanggupan_wali")); err == nil {
			data["kesanggupan_wali"] = k
		}

		// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) - SANGGAH ---
		// Fetch student with priority to 'sanggah' record (via Service)
		cMhsService := services.CMahasiswaService{}
		student, _ := cMhsService.GetCmahasiswa(np)

		var existing models.Wali
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&existing)

		fileScan, errScan := c.FormFile("file_scan_wali")
		if errScan == nil {
			utils.DeleteOldFile(existing.ScanWali)
			filename := fmt.Sprintf("Surat_Wali_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
			newPath, err := utils.HandleDynamicUpload(c, fileScan, student.NamaCmahasiswa, np, "sanggah", filename)
			if err == nil {
				data["scan_wali"] = newPath
			}
		}

		// 1. Ambil data lama untuk Log (Gunakan atribut sanggah karena ini route khusus Admin/Sanggah)
		var existingWali models.Wali
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&existingWali)

		// 2. Jalankan Update/Upsert
		res, err := srv.Edit(data, np, "sanggah")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal simpan sanggah: " + err.Error()})
			return
		}

		// 3. Simpan Log
		now := time.Now()
		if existingWali.NoPeserta != "" {
			srv.AddLog(existingWali, "sanggah", np, &now)
		} else {
			srv.AddLog(res, "sanggah", np, &now)
		}
		
		c.JSON(http.StatusOK, res)
	})

	authGroup.GET("/get-wali", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		res, err := srv.GetByLoggedIn(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	group.GET("/get-wali/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		atribut := c.Query("atribut")
		var model models.Wali
		var err error

		if atribut != "" {
			err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").Preload("Pekerjaan").
				Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&model).Error
		} else {
			err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").Preload("Pekerjaan").
				Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&model).Error
			if err != nil {
				err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").Preload("Pekerjaan").
					Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&model).Error
			}
		}

		if err != nil {
			c.JSON(http.StatusOK, gin.H{"msg": "data tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, model)
	})
}
