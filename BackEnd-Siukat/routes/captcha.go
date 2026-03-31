package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CaptchaRoutes(r *gin.RouterGroup) {
	group := r.Group("/captcha")
	group.GET("/rand", func(c *gin.Context) {
		var data models.Captcha
		// Gunakan Raw Order rand() di mysql
		config.DB.Order("RAND()").First(&data)
		c.JSON(http.StatusOK, gin.H{
			"id_pertanyaan": data.Id,
			"pertanyaan":    data.Pertanyaan,
		})
	})
}
