package routes

import (
	"BackEnd-Siukat/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SummaryRoutes(r *gin.RouterGroup) {
	group := r.Group("/summary")
	summaryService := services.SummaryService{}

	group.GET("/fakultas", func(c *gin.Context) {
		data, err := summaryService.FetchByFakultas()
		if err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})

	group.GET("/prodi", func(c *gin.Context) {
		data, err := summaryService.FetchByProdi()
		if err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})
}
