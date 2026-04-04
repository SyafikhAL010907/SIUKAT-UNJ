package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ProdiRoutes(r *gin.RouterGroup) {
	group := r.Group("/prodi")
	group.GET("/all", func(c *gin.Context) {
		var data []models.Prodi
		if err := config.DB.Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})

	group.GET("/id/:id", func(c *gin.Context) {
		id := c.Param("id")
		var data models.Prodi
		if err := config.DB.Where("kode = ?", id).First(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})

	group.GET("/fakultas/:kode_fak", func(c *gin.Context) {
		kodeFak := c.Param("kode_fak")
		var data []models.Prodi
		if err := config.DB.Where("kode_fak = ?", kodeFak).Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})
}
