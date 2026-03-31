package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func KecamatanRoutes(r *gin.RouterGroup) {
	group := r.Group("/kecamatan")
	group.GET("/kabkot/:kabkot", func(c *gin.Context) {
		kabkot := c.Param("kabkot")
		var data []models.Kecamatan
		config.DB.Where("kabkot = ?", kabkot).Find(&data)
		c.JSON(http.StatusOK, data)
	})
	group.GET("/all", func(c *gin.Context) {
		var data []models.Kecamatan
		config.DB.Find(&data)
		c.JSON(http.StatusOK, data)
	})
}
