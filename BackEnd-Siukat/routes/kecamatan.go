package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func KecamatanRoutes(r *gin.RouterGroup) {
	group := r.Group("/kecamatan")
	group.GET("/all", func(c *gin.Context) {
		var data []models.Kecamatan
		if err := config.DB.Order("kecam_nama").Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})

	group.GET("/id/:id", func(c *gin.Context) {
		id := c.Param("id")
		var data models.Kecamatan
		if err := config.DB.Where("kecam_id = ?", id).First(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})

	group.GET("/kab_id/:id", func(c *gin.Context) {
		id := c.Param("id")
		var data []models.Kecamatan
		if err := config.DB.Where("kab_id = ?", id).Order("kecam_nama").Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})
}
