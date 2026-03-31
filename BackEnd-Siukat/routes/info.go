package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func InfoRoutes(r *gin.RouterGroup) {
	group := r.Group("/info")
	group.GET("/get-info", func(c *gin.Context) {
		var data models.Info
		config.DB.First(&data)
		c.JSON(http.StatusOK, data)
	})
}
