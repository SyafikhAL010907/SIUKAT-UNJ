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
			Kode               int    `json:"kode"`
			TanggalMulaiStr    string `json:"tanggal_mulai"`
			TanggalSelesaiStr  string `json:"tanggal_selesai"`
			TanggalAkhirStr    string `json:"tanggal_akhir"`
			Pengisian          string `json:"pengisian"`
			Pengumuman         string `json:"pengumuman"`
			KlarifikasiTanggal string `json:"klarifikasi_tanggal"`
			KlarifikasiLokasi  string `json:"klarifikasi_lokasi"`
			Pembayaran         string `json:"pembayaran"`
			LaporDiri          string `json:"lapor_diri"`
			Kontak             string `json:"kontak"`
			Stage              string `json:"stage"`
			StageDetail        string `json:"stage_detail"`
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
		
		// Map strings that are present in the form
		updateData["pengisian"] = req.Pengisian
		updateData["pengumuman"] = req.Pengumuman
		updateData["pembayaran"] = req.Pembayaran
		updateData["lapor_diri"] = req.LaporDiri
		
		// Only update fields that are actually in the UI to avoid overwriting unrelated columns
		if req.Kontak != "" { updateData["kontak"] = req.Kontak }
		if req.KlarifikasiTanggal != "" { updateData["klarifikasi_tanggal"] = req.KlarifikasiTanggal }
		if req.KlarifikasiLokasi != "" { updateData["klarifikasi_lokasi"] = req.KlarifikasiLokasi }
		if req.Stage != "" { updateData["stage"] = req.Stage }

		// Handle Dates
		if req.TanggalMulaiStr != "" {
			t, err := time.ParseInLocation(layout, req.TanggalMulaiStr, wib)
			if err == nil {
				updateData["tanggal_mulai"] = &t
			}
		} else {
			updateData["tanggal_mulai"] = nil
		}

		if req.TanggalSelesaiStr != "" {
			t, err := time.ParseInLocation(layout, req.TanggalSelesaiStr, wib)
			if err == nil {
				updateData["tanggal_selesai"] = &t
			}
		} else {
			updateData["tanggal_selesai"] = nil
		}

		if req.TanggalAkhirStr != "" {
			t, err := time.ParseInLocation(layout, req.TanggalAkhirStr, wib)
			if err == nil {
				updateData["tanggal_akhir"] = &t
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
