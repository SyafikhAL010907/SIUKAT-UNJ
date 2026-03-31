package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func KabkotRoutes(r *gin.RouterGroup) {
	group := r.Group("/kabkot")
	group.GET("/provinsi/:provinsi", func(c *gin.Context) {
		provinsi := c.Param("provinsi")
		var data []models.Kabkot
		config.DB.Where("provinsi = ?", provinsi).Find(&data)
		c.JSON(http.StatusOK, data)
	})
	group.GET("/all", func(c *gin.Context) {
		var data []models.Kabkot
		config.DB.Find(&data)
		c.JSON(http.StatusOK, data)
	})
}
