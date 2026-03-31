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
		config.DB.Find(&data)
		c.JSON(http.StatusOK, data)
	})
}
