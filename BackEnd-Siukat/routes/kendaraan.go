package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"net/http"
	"strconv"
	"time"

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

		if req.StatusMotor != "tidak" {
			if jm, err := strconv.Atoi(c.PostForm("jumlah_motor")); err == nil {
				req.JumlahMotor = jm
			}
			if pm, err := strconv.Atoi(c.PostForm("pajak_motor")); err == nil {
				req.PajakMotor = pm
			}
			fileMtr, errMtr := c.FormFile("file_scan_motor")
			if errMtr == nil {
				filename := np + "_motor_" + fileMtr.Filename
				c.SaveUploadedFile(fileMtr, "public/uploads/"+filename)
				req.ScanMotor = filename
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
				filename := np + "_mobil_" + fileMbl.Filename
				c.SaveUploadedFile(fileMbl, "public/uploads/"+filename)
				req.ScanMobil = filename
			}
		}

		var existing models.Kendaraan
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&existing)
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

		if req.StatusMotor != "tidak" {
			if jm, err := strconv.Atoi(c.PostForm("jumlah_motor")); err == nil {
				req.JumlahMotor = jm
			}
			if pm, err := strconv.Atoi(c.PostForm("pajak_motor")); err == nil {
				req.PajakMotor = pm
			}
			fileMtr, errMtr := c.FormFile("file_scan_motor")
			if errMtr == nil {
				filename := np + "_motor_" + fileMtr.Filename
				c.SaveUploadedFile(fileMtr, "public/uploads/"+filename)
				req.ScanMotor = filename
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
				filename := np + "_mobil_" + fileMbl.Filename
				c.SaveUploadedFile(fileMbl, "public/uploads/"+filename)
				req.ScanMobil = filename
			}
		}

		var existing models.Kendaraan
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&existing)
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
		var model models.Kendaraan
		err := config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&model).Error
		if err != nil {
			err = config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&model).Error
		}
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"msg": "data tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, model)
	})
}
