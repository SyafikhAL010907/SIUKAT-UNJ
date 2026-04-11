package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func InfoRoutes(r *gin.RouterGroup) {
	group := r.Group("/info")
	group.GET("", func(c *gin.Context) {
		kode := c.Query("kode")
		var data models.Info
		
		db := config.DB
		if kode != "" {
			db = db.Where("kode = ?", kode)
		}

		if err := db.First(&data).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data jalur tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, data)
	})

	group.PUT("/save", func(c *gin.Context) {
		// Use a clean struct to avoid conflict between string and pointer types
		var req struct {
			Kode              int    `json:"kode"`
			TanggalMulaiStr   string `json:"tanggal_mulai"`
			TanggalSelesaiStr string `json:"tanggal_selesai"`
			TanggalAkhirStr   string `json:"tanggal_akhir"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Binding Error: " + err.Error()})
			return
		}

		// Update fields if strings are provided
		layout := "2006-01-02"
		wib := time.FixedZone("WIB", 7*3600) // GMT+7

		// Explicitly handle mapping to support NULL (nil) values
		updateData := make(map[string]interface{})
		
		if req.TanggalMulaiStr != "" {
			t, err := time.ParseInLocation(layout, req.TanggalMulaiStr, wib)
			if err == nil {
				updateData["tanggal_mulai"] = &t
			} else {
				updateData["tanggal_mulai"] = nil
			}
		} else {
			updateData["tanggal_mulai"] = nil
		}

		if req.TanggalSelesaiStr != "" {
			t, err := time.ParseInLocation(layout, req.TanggalSelesaiStr, wib)
			if err == nil {
				updateData["tanggal_selesai"] = &t
			} else {
				updateData["tanggal_selesai"] = nil
			}
		} else {
			updateData["tanggal_selesai"] = nil
		}

		if req.TanggalAkhirStr != "" {
			t, err := time.ParseInLocation(layout, req.TanggalAkhirStr, wib)
			if err == nil {
				updateData["tanggal_akhir"] = &t
			} else {
				updateData["tanggal_akhir"] = nil
			}
		} else {
			updateData["tanggal_akhir"] = nil
		}

		// Update explicitly using map

		if err := config.DB.Model(&models.Info{}).Where("kode = ?", req.Kode).Updates(updateData).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, gin.H{"msg": "Info updated successfully", "data": updateData})
	})
}
