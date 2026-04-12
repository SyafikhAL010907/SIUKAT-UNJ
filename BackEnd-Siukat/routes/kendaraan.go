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

func KendaraanRoutes(r *gin.RouterGroup) {
	group := r.Group("/kendaraan")
	srv := services.KendaraanService{}

	group.GET("/all", func(c *gin.Context) {
		var ms []models.Kendaraan
		config.DB.Find(&ms)
		c.JSON(http.StatusOK, ms)
	})

	authGroup := group.Group("/")
	authGroup.Use(middlewares.JwtAuth())

	authGroup.POST("/add", func(c *gin.Context) {
		var req models.Kendaraan
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

		req := models.Kendaraan{
			StatusMotor: c.PostForm("status_motor"),
			StatusMobil: c.PostForm("status_mobil"),
		}

		// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) ---
		var student models.CMahasiswa
		config.DB.Where("no_peserta = ?", np).First(&student)

		var existing models.Kendaraan
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&existing)

		if req.StatusMotor != "tidak" {
			if jm, err := strconv.Atoi(c.PostForm("jumlah_motor")); err == nil {
				req.JumlahMotor = jm
			}
			if pm, err := strconv.Atoi(c.PostForm("pajak_motor")); err == nil {
				req.PajakMotor = pm
			}
			fileMtr, errMtr := c.FormFile("file_scan_motor")
			if errMtr == nil {
				utils.DeleteOldFile(existing.ScanMotor)
				filename := fmt.Sprintf("STNK_Motor_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
				newPath, err := utils.HandleDynamicUpload(c, fileMtr, student.NamaCmahasiswa, np, "original", filename)
				if err == nil {
					req.ScanMotor = newPath
					req.StatusMotor = "ada"
				}
			}
		}

		if req.StatusMobil != "tidak" {
			if jm, err := strconv.Atoi(c.PostForm("jumlah_mobil")); err == nil {
				req.JumlahMobil = jm
			}
			if pm, err := strconv.Atoi(c.PostForm("pajak_mobil")); err == nil {
				req.PajakMobil = pm
			}
			fileMbl, errMbl := c.FormFile("file_scan_mobil")
			if errMbl == nil {
				utils.DeleteOldFile(existing.ScanMobil)
				filename := fmt.Sprintf("STNK_Mobil_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
				newPath, err := utils.HandleDynamicUpload(c, fileMbl, student.NamaCmahasiswa, np, "original", filename)
				if err == nil {
					req.ScanMobil = newPath
					req.StatusMobil = "ada"
				}
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

		req := models.Kendaraan{
			StatusMotor: c.PostForm("status_motor"),
			StatusMobil: c.PostForm("status_mobil"),
		}

		// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) - SANGGAH ---
		var student models.CMahasiswa
		config.DB.Where("no_peserta = ?", np).First(&student)

		var existing models.Kendaraan
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&existing)

		if req.StatusMotor != "tidak" {
			if jm, err := strconv.Atoi(c.PostForm("jumlah_motor")); err == nil {
				req.JumlahMotor = jm
			}
			if pm, err := strconv.Atoi(c.PostForm("pajak_motor")); err == nil {
				req.PajakMotor = pm
			}
			fileMtr, errMtr := c.FormFile("file_scan_motor")
			if errMtr == nil {
				utils.DeleteOldFile(existing.ScanMotor)
				filename := fmt.Sprintf("STNK_Motor_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
				newPath, err := utils.HandleDynamicUpload(c, fileMtr, student.NamaCmahasiswa, np, "sanggah", filename)
				if err == nil {
					req.ScanMotor = newPath
					req.StatusMotor = "ada"
				}
			}
		}

		if req.StatusMobil != "tidak" {
			if jm, err := strconv.Atoi(c.PostForm("jumlah_mobil")); err == nil {
				req.JumlahMobil = jm
			}
			if pm, err := strconv.Atoi(c.PostForm("pajak_mobil")); err == nil {
				req.PajakMobil = pm
			}
			fileMbl, errMbl := c.FormFile("file_scan_mobil")
			if errMbl == nil {
				utils.DeleteOldFile(existing.ScanMobil)
				filename := fmt.Sprintf("STNK_Mobil_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
				newPath, err := utils.HandleDynamicUpload(c, fileMbl, student.NamaCmahasiswa, np, "sanggah", filename)
				if err == nil {
					req.ScanMobil = newPath
					req.StatusMobil = "ada"
				}
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

	authGroup.GET("/get-kendaraan", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		res, err := srv.GetByLoggedIn(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	group.GET("/get-kendaraan/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		atribut := c.Query("atribut") // Ambil dari URL ?atribut=original
		var model models.Kendaraan
		var err error

		if atribut != "" {
			// Jika Admin minta atribut spesifik
			err = config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&model).Error
		} else {
			// Logic lama: Prioritas Sanggah -> Original
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
