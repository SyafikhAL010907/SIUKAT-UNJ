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

func ListrikRoutes(r *gin.RouterGroup) {
	group := r.Group("/listrik")
	srv := services.ListrikService{}

	group.GET("/all", func(c *gin.Context) {
		var ms []models.Listrik
		config.DB.Find(&ms)
		c.JSON(http.StatusOK, ms)
	})

	authGroup := group.Group("/")
	authGroup.Use(middlewares.JwtAuth())

	authGroup.POST("/add", func(c *gin.Context) {
		var req models.Listrik
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

		req := models.Listrik{
			NoPelanggan:    c.PostForm("no_pelanggan"),
			JenisPemakaian: c.PostForm("jenis_pemakaian"),
		}

		if p, err := strconv.Atoi(c.PostForm("pengeluaran")); err == nil {
			req.Pengeluaran = p
		}

		fileScan, errScan := c.FormFile("file_scan_listrik")
		if errScan == nil {
			filename := np + "_listrik_" + fileScan.Filename
			c.SaveUploadedFile(fileScan, "public/uploads/"+filename)
			req.ScanListrik = filename
		}

		var existing models.Listrik
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

		req := models.Listrik{
			NoPelanggan:    c.PostForm("no_pelanggan"),
			JenisPemakaian: c.PostForm("jenis_pemakaian"),
		}

		if p, err := strconv.Atoi(c.PostForm("pengeluaran")); err == nil {
			req.Pengeluaran = p
		}

		fileScan, errScan := c.FormFile("file_scan_listrik")
		if errScan == nil {
			filename := np + "_listrik_" + fileScan.Filename
			c.SaveUploadedFile(fileScan, "public/uploads/"+filename)
			req.ScanListrik = filename
		}

		var existing models.Listrik
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

	authGroup.GET("/get-listrik", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		res, err := srv.GetByLoggedIn(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	group.GET("/get-listrik/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		var model models.Listrik
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
