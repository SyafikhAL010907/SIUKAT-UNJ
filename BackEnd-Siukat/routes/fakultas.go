package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func FakultasRoutes(r *gin.RouterGroup) {
	group := r.Group("/fakultas")
	group.GET("/all", func(c *gin.Context) {
		var data []models.Fakultas
		if err := config.DB.Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})

	group.GET("/id/:id", func(c *gin.Context) {
		id := c.Param("id")
		var data models.Fakultas
		if err := config.DB.Where("kode = ?", id).First(&data).Error; err != nil {
			c.JSON(http.StatusOK, gin.H{"msg": "data tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, data)
	})
}
