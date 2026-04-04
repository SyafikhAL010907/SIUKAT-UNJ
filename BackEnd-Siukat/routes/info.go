package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InfoRoutes(r *gin.RouterGroup) {
	group := r.Group("/info")
	group.GET("", func(c *gin.Context) {
		var data models.Info
		if err := config.DB.First(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})

	group.PUT("/save", func(c *gin.Context) {
		var req models.Info
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := config.DB.Model(&models.Info{}).Where("kode = ?", 1).Updates(req).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, gin.H{"msg": "Info updated successfully"})
	})
}
