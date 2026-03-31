package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func PekerjaanRoutes(r *gin.RouterGroup) {
	group := r.Group("/pekerjaan")
	group.GET("/all", func(c *gin.Context) {
		var data []models.Pekerjaan
		config.DB.Find(&data)
		c.JSON(http.StatusOK, data)
	})
}
