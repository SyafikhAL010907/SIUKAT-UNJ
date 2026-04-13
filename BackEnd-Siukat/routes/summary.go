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
		tahun := c.Query("tahun")
		jalur := c.Query("jalur")
		data, err := summaryService.FetchByFakultas(tahun, jalur)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})

	group.GET("/prodi", func(c *gin.Context) {
		tahun := c.Query("tahun")
		jalur := c.Query("jalur")
		data, err := summaryService.FetchByProdi(tahun, jalur)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})
}
