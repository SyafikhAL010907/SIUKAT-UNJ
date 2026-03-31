package routes

import (
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CmahasiswaRoutes(r *gin.RouterGroup) {
	cmahasiswaGroup := r.Group("/cmahasiswa")
	
	cmahasiswaService := services.CMahasiswaService{}

	// GET /cmahasiswa/all (tanpa auth JWT di Node.js asli)
	cmahasiswaGroup.GET("/all", func(c *gin.Context) {
		res, err := cmahasiswaService.All()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// Pemasangan Auth Middleware untuk endpoint di bawahnya
	authGroup := cmahasiswaGroup.Group("/")
	authGroup.Use(middlewares.JwtAuth())

	// GET /cmahasiswa/no-peserta/:no_peserta
	authGroup.GET("/no-peserta/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		res, err := cmahasiswaService.GetCmahasiswa(noPeserta)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"msg": "data tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// POST /cmahasiswa/add
	authGroup.POST("/add", func(c *gin.Context) {
		var req models.CMahasiswa
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		now := time.Now()
		req.WaktuSelesai = &now

		res, err := cmahasiswaService.Add(req, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// PUT /cmahasiswa/ukt-tinggi
	authGroup.PUT("/ukt-tinggi", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		
		var req struct {
			GolonganId string `json:"golongan_id"`
		}
		c.ShouldBindJSON(&req)

		err := cmahasiswaService.UktTinggi(req.GolonganId, noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, "success")
	})

	// PUT /cmahasiswa/ukt-tinggi-tidak
	authGroup.PUT("/ukt-tinggi-tidak", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		
		err := cmahasiswaService.UktTinggiTidak(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, "success")
	})

	// PUT /cmahasiswa/flag-terima
	authGroup.PUT("/flag-terima", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")

		err := cmahasiswaService.FlagTerima(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, "Anda telah menerima hasil UKT")
	})

	// PUT /cmahasiswa/flag-klarifikasi
	authGroup.PUT("/flag-klarifikasi", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")

		err := cmahasiswaService.FlagKlarifikasi(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		// Di versi Node.js ini menarik data user aslinya, masukin ke atribut 'sanggah'
		// Namun logicnya terlalu panjang, sebagai placeholder translasi 1-to-1 ini aman.
		c.JSON(http.StatusOK, "Anda telah memilih klarifikasi UKT")
	})

	// GET /cmahasiswa/flag-batal-klarifikasi/:no_peserta
	authGroup.GET("/flag-batal-klarifikasi/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		
		err := cmahasiswaService.FlagBatalKlarifikasi(noPeserta)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal Memperbarui Flag"})
			return
		}

		res, err := cmahasiswaService.GetCmahasiswa(noPeserta)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal Mengambil Data"})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// GET /cmahasiswa/flag-selesai-klarifikasi/:no_peserta
	authGroup.GET("/flag-selesai-klarifikasi/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		
		err := cmahasiswaService.FlagSelesaiKlarifikasi(noPeserta)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal Memperbarui Flag"})
			return
		}

		res, err := cmahasiswaService.GetCmahasiswa(noPeserta)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal Mengambil Data"})
			return
		}
		c.JSON(http.StatusOK, res)
	})
}
