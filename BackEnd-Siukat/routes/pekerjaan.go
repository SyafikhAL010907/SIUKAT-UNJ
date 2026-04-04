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
		var pkj []models.Pekerjaan
		config.DB.Find(&pkj)
		c.JSON(http.StatusOK, pkj)
	})
	
	// Bio_pekerjaan dibuang (The BIO PURGE Is Active)
}
