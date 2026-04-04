package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CaptchaRoutes(r *gin.RouterGroup) {
	group := r.Group("/captcha")
	group.GET("", func(c *gin.Context) {
		var data models.Captcha
		// Gunakan Raw Order rand() di mysql — Mirroring logic RAND() Node.js
		config.DB.Order("RAND()").First(&data)
		c.JSON(http.StatusOK, data)
	})
}
