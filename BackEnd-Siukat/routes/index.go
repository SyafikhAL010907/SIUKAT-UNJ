package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func IndexRoutes(r *gin.RouterGroup) {
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"title": "Web Service Siukat (Golang Port)"})
	})
}
