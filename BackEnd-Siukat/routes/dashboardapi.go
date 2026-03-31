package routes

import (
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DashboardRoutes(r *gin.RouterGroup) {
	group := r.Group("/dashboardapi")
	
	// Sesuai nodejs: membutuhkan autentikasi
	group.Use(middlewares.JwtAuth())

	srv := services.DashboardService{}

	group.GET("/chart", func(c *gin.Context) {
		res, err := srv.DashboardSummary()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	group.GET("/meta", func(c *gin.Context) {
		res, err := srv.DashboardMeta()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})
}
