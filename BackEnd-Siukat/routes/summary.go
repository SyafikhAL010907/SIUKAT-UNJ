package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func SummaryRoutes(r *gin.RouterGroup) {
	group := r.Group("/summary")
	group.GET("/data", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"msg": "Summary API - Not Implemented (Migrated to Go Shell)"})
	})
}
