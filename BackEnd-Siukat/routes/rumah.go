package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RumahRoutes(r *gin.RouterGroup) {
	rumahGroup := r.Group("/rumah")
	rumahService := services.RumahService{}

	authGroup := rumahGroup.Group("/")
	authGroup.Use(middlewares.JwtAuth())

	authGroup.POST("/add", func(c *gin.Context) {
		var req models.Rumah
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		res, err := rumahService.Add(req, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	authGroup.PUT("/edit", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		
		var data map[string]interface{}
		c.ShouldBindJSON(&data)

		res, err := rumahService.Edit(data, noPeserta.(string), "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	authGroup.GET("/get-rumah", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		res, err := rumahService.GetByLoggedIn(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	rumahGroup.GET("/get-rumah/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		var rumah models.Rumah
		err := config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&rumah).Error
		if err != nil {
			err = config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&rumah).Error
		}
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"msg": "data tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, rumah)
	})
}
