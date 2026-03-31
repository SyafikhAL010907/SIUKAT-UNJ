package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func KeringananRoutes(r *gin.RouterGroup) {
	group := r.Group("/keringanan")
	group.GET("/list", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"msg": "Rute pengajuan Keringanan - Not Implemented (Migrated to Go Shell)"})
	})
}
