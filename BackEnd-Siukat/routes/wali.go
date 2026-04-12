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
		data := map[string]interface{}{
			"status_wali":    c.PostForm("status_wali"),
			"nama_wali":      c.PostForm("nama_wali"),
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

		res, err := srv.Edit(data, np, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	authGroup.PUT("/edit/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		np := noPeserta

		data := map[string]interface{}{
			"status_wali":    c.PostForm("status_wali"),
			"nama_wali":      c.PostForm("nama_wali"),
			"alamat_wali":    c.PostForm("alamat_wali"),
			"provinsi_wali":  c.PostForm("provinsi_wali"),
			"kabkot_wali":    c.PostForm("kabkot_wali"),
			"kecamatan_wali": c.PostForm("kecamatan_wali"),
		}

		if k, err := strconv.Atoi(c.PostForm("kesanggupan_wali")); err == nil {
			data["kesanggupan_wali"] = k
		}

		// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) - SANGGAH ---
		var student models.CMahasiswa
		config.DB.Where("no_peserta = ?", np).First(&student)

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

		res, err := srv.Edit(data, np, "sanggah")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
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
			err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
				Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&model).Error
		} else {
			err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
				Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&model).Error
			if err != nil {
				err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
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
