package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func VerifikasiRoutes(r *gin.RouterGroup) {
	group := r.Group("/verifikasi")
	group.Use(middlewares.JwtAuth())

	group.GET("", func(c *gin.Context) {
		noPeserta := c.GetString("no_peserta")
		if noPeserta == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No peserta not found in token"})
			return
		}

		tx := config.DB.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()

		var info models.Info
		if err := tx.First(&info).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, err)
			return
		}

		var verifikasi models.Verifikasi
		// Legacy: req.user.no_peserta is used. In Verifikasi model, no_peserta is int.
		noPesertaInt, _ := strconv.Atoi(noPeserta)
		if err := tx.Where("no_peserta = ?", noPesertaInt).First(&verifikasi).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, err)
			return
		}

		var cmahasiswa models.CMahasiswa
		if err := tx.Where("no_peserta = ?", noPeserta).First(&cmahasiswa).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, err)
			return
		}

		tx.Commit()

		data := gin.H{
			"info":             info,
			"verifikasi":       verifikasi,
			"result_bidikmisi": verifikasi.VerBidikMisi,
			"result_kipk":     verifikasi.VerKipk,
			"result_kjmu":     verifikasi.VerKjmu,
		}

		switch info.Stage {
		case "snmptn":
			fakultasStr := strconv.Itoa(cmahasiswa.FakultasCmahasiswa)
			if fakultasStr == "16" || cmahasiswa.ProdiCmahasiswa == "12076" || cmahasiswa.ProdiCmahasiswa == "12086" || cmahasiswa.ProdiCmahasiswa == "12066" {
				if verifikasi.VerAkademik == "lolos" && verifikasi.VerKeterampilan == "lolos" {
					data["result_akademik"] = "lolos"
				} else if verifikasi.VerAkademik == "tidak_lolos" || verifikasi.VerKeterampilan == "tidak_lolos" {
					data["result_akademik"] = "tidak_lolos"
				} else if verifikasi.VerAkademik == "belum_verifikasi" || verifikasi.VerKeterampilan == "belum_verifikasi" {
					data["result_akademik"] = "belum_verifikasi"
				}
			} else {
				data["result_akademik"] = verifikasi.VerAkademik
				data["result_bidikmisi"] = verifikasi.VerBidikMisi
				data["result_kipk"] = verifikasi.VerKipk
				data["result_kjmu"] = verifikasi.VerKjmu
			}
		case "sbmptn":
			data["result_akademik"] = "lolos"
		default:
			// Mandiri
			data["result_akademik"] = "lolos"
		}
		c.JSON(http.StatusOK, data)
	})
}
