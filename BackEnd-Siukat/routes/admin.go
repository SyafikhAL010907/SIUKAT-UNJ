package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminRoutes(r *gin.RouterGroup) {
	group := r.Group("/admin")
	group.GET("/get-all-users", func(c *gin.Context) {
		// Placeholder untuk rute Admin Get Semua User
		c.JSON(http.StatusOK, gin.H{"msg": "Admin get-all-users endpoint - Not Implemented (Migrated to Go Shell)"})
	})
}
