package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func VerifikasiRoutes(r *gin.RouterGroup) {
	group := r.Group("/verifikasi")
	group.GET("/status", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"msg": "Verifikasi API - Not Implemented (Migrated to Go Shell)"})
	})
}
