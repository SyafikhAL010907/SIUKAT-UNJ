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

		fileUkt, errUkt := c.FormFile("file_scan_pernyataan_ukt_tinggi")
		if errUkt == nil {
			filename := np + "_ukt_" + fileUkt.Filename
			c.SaveUploadedFile(fileUkt, "public/uploads/"+filename)
			req.ScanPernyataanUktTinggi = filename
		}

		fileKeb, errKeb := c.FormFile("file_scan_pernyataan_kebenaran")
		if errKeb == nil {
			filename := np + "_kebenaran_" + fileKeb.Filename
			c.SaveUploadedFile(fileKeb, "public/uploads/"+filename)
			req.ScanPernyataanKebenaran = filename
		}

		fileKk, errKk := c.FormFile("file_scan_kk")
		if errKk == nil {
			filename := np + "_kk_" + fileKk.Filename
			c.SaveUploadedFile(fileKk, "public/uploads/"+filename)
			req.ScanKk = filename
		}

		var existing models.Pendukung
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

		var req models.Pendukung
		if t, err := strconv.Atoi(c.PostForm("tanggungan")); err == nil {
			req.Tanggungan = t
		}

		fileUkt, errUkt := c.FormFile("file_scan_pernyataan_ukt_tinggi")
		if errUkt == nil {
			filename := np + "_ukt_" + fileUkt.Filename
			c.SaveUploadedFile(fileUkt, "public/uploads/"+filename)
			req.ScanPernyataanUktTinggi = filename
		}

		fileKeb, errKeb := c.FormFile("file_scan_pernyataan_kebenaran")
		if errKeb == nil {
			filename := np + "_kebenaran_" + fileKeb.Filename
			c.SaveUploadedFile(fileKeb, "public/uploads/"+filename)
			req.ScanPernyataanKebenaran = filename
		}

		fileKk, errKk := c.FormFile("file_scan_kk")
		if errKk == nil {
			filename := np + "_kk_" + fileKk.Filename
			c.SaveUploadedFile(fileKk, "public/uploads/"+filename)
			req.ScanKk = filename
		}

		var existing models.Pendukung
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
		var model models.Pendukung
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
