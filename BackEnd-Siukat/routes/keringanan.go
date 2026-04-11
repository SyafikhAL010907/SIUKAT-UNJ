package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"BackEnd-Siukat/utils"
	"net/http"
	"time"
	"fmt"

	"github.com/gin-gonic/gin"
)

func KeringananRoutes(r *gin.RouterGroup) {
	group := r.Group("/keringanan")
	srv := services.KeringananService{}

	group.GET("/all", func(c *gin.Context) {
		var ms []models.Keringanan
		config.DB.Find(&ms)
		c.JSON(http.StatusOK, ms)
	})

	authGroup := group.Group("/")
	authGroup.Use(middlewares.JwtAuth())

	authGroup.POST("/add", func(c *gin.Context) {
		var req models.Keringanan
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

		req := models.Keringanan{
			Flag: c.PostForm("flag"),
		}

		var student models.CMahasiswa
		config.DB.Where("no_peserta = ?", np).First(&student)

		var existing models.Keringanan
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&existing)

		fileScan, errScan := c.FormFile("file_scan_keringanan")
		if errScan == nil {
			utils.DeleteOldFile(existing.ScanKeringanan)
			filename := fmt.Sprintf("Keringanan_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
			newPath, err := utils.HandleDynamicUpload(c, fileScan, student.NamaCmahasiswa, np, filename)
			if err == nil {
				req.ScanKeringanan = newPath
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

	authGroup.GET("/get-keringanan", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		res, err := srv.GetByLoggedIn(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusOK, models.Keringanan{})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	group.GET("/get-keringanan/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		var model models.Keringanan
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
