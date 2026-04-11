package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"BackEnd-Siukat/utils"
	"net/http"
	"strconv"
	"time"
	"fmt"

	"github.com/gin-gonic/gin"
)

func PendukungRoutes(r *gin.RouterGroup) {
	group := r.Group("/pendukung")
	srv := services.PendukungService{}

	group.GET("/all", func(c *gin.Context) {
		var ms []models.Pendukung
		config.DB.Find(&ms)
		c.JSON(http.StatusOK, ms)
	})

	authGroup := group.Group("/")
	authGroup.Use(middlewares.JwtAuth())

	authGroup.POST("/add", func(c *gin.Context) {
		var req models.Pendukung
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

		var req models.Pendukung
		if t, err := strconv.Atoi(c.PostForm("tanggungan")); err == nil {
			req.Tanggungan = t
		}

		// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) ---
		var student models.CMahasiswa
		config.DB.Where("no_peserta = ?", np).First(&student)

		var existing models.Pendukung
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&existing)

		// File UKT Tinggi
		fileUkt, errUkt := c.FormFile("file_scan_pernyataan_ukt_tinggi")
		if errUkt == nil {
			utils.DeleteOldFile(existing.ScanPernyataanUktTinggi)
			filename := fmt.Sprintf("Pernyataan_UKT_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
			newPath, err := utils.HandleDynamicUpload(c, fileUkt, student.NamaCmahasiswa, np, filename)
			if err == nil {
				req.ScanPernyataanUktTinggi = newPath
			}
		}

		// File Kebenaran Data (Surat Pernyataan)
		fileKeb, errKeb := c.FormFile("file_scan_pernyataan_kebenaran")
		if errKeb == nil {
			utils.DeleteOldFile(existing.ScanPernyataanKebenaran)
			filename := fmt.Sprintf("Surat_Pernyataan_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
			newPath, err := utils.HandleDynamicUpload(c, fileKeb, student.NamaCmahasiswa, np, filename)
			if err == nil {
				req.ScanPernyataanKebenaran = newPath
			}
		}

		// File KK
		fileKk, errKk := c.FormFile("file_scan_kk")
		if errKk == nil {
			utils.DeleteOldFile(existing.ScanKk)
			filename := fmt.Sprintf("Kartu_Keluarga_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
			newPath, err := utils.HandleDynamicUpload(c, fileKk, student.NamaCmahasiswa, np, filename)
			if err == nil {
				req.ScanKk = newPath
			}
		}

		now := time.Now()
		srv.AddLog(existing, "original", np, &now)

		res, err := srv.Edit(req, np, existing, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	authGroup.PUT("/edit/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		np := noPeserta

		var req models.Pendukung
		if t, err := strconv.Atoi(c.PostForm("tanggungan")); err == nil {
			req.Tanggungan = t
		}

		// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) - SANGGAH ---
		var student models.CMahasiswa
		config.DB.Where("no_peserta = ?", np).First(&student)

		var existing models.Pendukung
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&existing)

		fileUkt, errUkt := c.FormFile("file_scan_pernyataan_ukt_tinggi")
		if errUkt == nil {
			utils.DeleteOldFile(existing.ScanPernyataanUktTinggi)
			filename := fmt.Sprintf("Pernyataan_UKT_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
			newPath, err := utils.HandleDynamicUpload(c, fileUkt, student.NamaCmahasiswa, np, filename)
			if err == nil {
				req.ScanPernyataanUktTinggi = newPath
			}
		}

		fileKeb, errKeb := c.FormFile("file_scan_pernyataan_kebenaran")
		if errKeb == nil {
			utils.DeleteOldFile(existing.ScanPernyataanKebenaran)
			filename := fmt.Sprintf("Surat_Pernyataan_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
			newPath, err := utils.HandleDynamicUpload(c, fileKeb, student.NamaCmahasiswa, np, filename)
			if err == nil {
				req.ScanPernyataanKebenaran = newPath
			}
		}

		fileKk, errKk := c.FormFile("file_scan_kk")
		if errKk == nil {
			utils.DeleteOldFile(existing.ScanKk)
			filename := fmt.Sprintf("Kartu_Keluarga_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
			newPath, err := utils.HandleDynamicUpload(c, fileKk, student.NamaCmahasiswa, np, filename)
			if err == nil {
				req.ScanKk = newPath
			}
		}

		now := time.Now()
		srv.AddLog(existing, "sanggah", np, &now)

		res, err := srv.Edit(req, np, existing, "sanggah")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	authGroup.GET("/get-pendukung", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		res, err := srv.GetByLoggedIn(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	group.GET("/get-pendukung/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		atribut := c.Query("atribut")
		var model models.Pendukung
		var err error

		if atribut != "" {
			err = config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&model).Error
		} else {
			err = config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&model).Error
			if err != nil {
				err = config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&model).Error
			}
		}

		if err != nil {
			c.JSON(http.StatusOK, gin.H{"msg": "data tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, model)
	})
}
