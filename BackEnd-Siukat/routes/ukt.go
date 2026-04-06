package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// UktRoutes mereplikasi file routes/ukt.js dari Node.js
func UktRoutes(r *gin.RouterGroup) {
	uktGroup := r.Group("/ukt")
	uktGroup.Use(middlewares.JwtAuth()) // Menggantikan passport.authenticate('jwt')

	uktService := services.UKTService{}

	// GET /ukt
	uktGroup.GET("", func(c *gin.Context) {
		// Dapatkan noPeserta dari jwt context hasil dari Auth Middleware
		noPeserta, _ := c.Get("no_peserta")

		// getUser logic
		var user models.User
		if err := config.DB.Preload("CMahasiswa").Where("no_peserta = ?", noPeserta).First(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// ukt findOne logic
		var ukt models.Ukt
		if err := config.DB.Where("major_id = ? AND entrance = ?", user.CMahasiswa.ProdiCmahasiswa, user.CMahasiswa.JalurCmahasiswa).First(&ukt).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, ukt)
	})

	// PUT /ukt/rendah-selesai
	uktGroup.PUT("/rendah-selesai", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		// Translasi computeUkt
		data, err := uktService.ComputeUkt(np, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Karena Info ditarik langsung, ini adalah fallback-nya:
		var info models.Info
		config.DB.First(&info)

		// cmahasiswa.selesaiIsi() digantikan update flag manual di sini
		// di Node.js cmahasiswa.selesaiIsi() memutasi flag menjadi "selesai_isi" atau "pengumuman"
		flagResult := "selesai_isi"
		stageSource := info.Stage
		if stageSource == "" { // Ilustrasi mock logic selesaiIsi
			flagResult = "pengumuman"
		}
		config.DB.Model(&models.CMahasiswa{}).Where("no_peserta = ?", np).Update("flag", flagResult)

		// Cmahasiswa & Value Logging di-call sesuai timestamp (Sama seperti NodeJS Promise)
		// value.addLog(response) & cmahasiswa.addLog(response)
		// ... 

		c.JSON(http.StatusOK, gin.H{"message": "Data berhasil dikonfirmasi!", "calc_data": data})
	})
	
	// GET /ukt/just-compute/:no_peserta
	uktGroup.GET("/just-compute/:no_peserta", func(c *gin.Context) {
		noPesertaParam := c.Param("no_peserta")

		data, err := uktService.JustCompute(noPesertaParam, "sanggah")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, data)
	})

	// GET /ukt/cmahasiswa/:no_peserta (Admin usage)
	uktGroup.GET("/cmahasiswa/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")

		var mhs models.CMahasiswa
		if err := config.DB.Where("no_peserta = ?", noPeserta).First(&mhs).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
			return
		}

		var ukt models.Ukt
		if err := config.DB.Where("major_id = ? AND entrance = ?", mhs.ProdiCmahasiswa, mhs.JalurCmahasiswa).First(&ukt).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "UKT reference not found"})
			return
		}

		c.JSON(http.StatusOK, ukt)
	})
}
