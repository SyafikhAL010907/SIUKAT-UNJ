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
		config.DB.Find(&data)
		c.JSON(http.StatusOK, data)
	})
}
