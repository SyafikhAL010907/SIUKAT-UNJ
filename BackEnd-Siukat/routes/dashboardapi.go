package routes

import (
	"BackEnd-Siukat/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DashboardApiRoutes(r *gin.RouterGroup) {
	group := r.Group("/dashboard")
	dashboardService := services.DashboardService{}

	group.GET("/data", func(c *gin.Context) {
		data, err := dashboardService.DashboardSummary()
		if err != nil {
			c.Status(http.StatusInternalServerError)
			return
		}
		c.JSON(http.StatusOK, data)
	})

	group.GET("/meta", func(c *gin.Context) {
		data, err := dashboardService.DashboardMeta()
		if err != nil {
			c.Status(http.StatusInternalServerError)
			return
		}
		c.JSON(http.StatusOK, data)
	})
}
