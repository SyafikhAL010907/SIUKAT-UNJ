package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ProvinsiRoutes(r *gin.RouterGroup) {
	group := r.Group("/provinsi")
	group.GET("/all", func(c *gin.Context) {
		var data []models.Provinsi
		if err := config.DB.Order("provinsi_nama").Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})

	group.GET("/id/:id", func(c *gin.Context) {
		id := c.Param("id")
		var data models.Provinsi
		if err := config.DB.Where("provinsi_id = ?", id).First(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})
}
