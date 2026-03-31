package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ProdiRoutes(r *gin.RouterGroup) {
	group := r.Group("/prodi")
	group.GET("/fakultas/:fakultas", func(c *gin.Context) {
		fakultas := c.Param("fakultas")
		var data []models.Prodi
		config.DB.Where("fakultas = ?", fakultas).Find(&data)
		c.JSON(http.StatusOK, data)
	})
	group.GET("/all", func(c *gin.Context) {
		var data []models.Prodi
		config.DB.Find(&data)
		c.JSON(http.StatusOK, data)
	})
}
