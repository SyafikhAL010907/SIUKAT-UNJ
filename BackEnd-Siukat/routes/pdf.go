package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// PdfRoutes menangani migrasi dari routes/pdf.js Node.js
func PdfRoutes(r *gin.RouterGroup) {
	pdfGroup := r.Group("/pdf")

	// Helper untuk merender HTML sebagai penganti html-pdf
	// Di Go, tanpa dependensi *wkhtmltopdf* external, standar terbaik adalah 
	// me-render HTML murni lalu dikirim ke browser dengan trigger Print()
	// atau menggunakan library eksternal (unidoc/maroto) jika butuh re-draw murni.

	// ==========================================
	// 1. ENDPOINT STATIS (Mengunduh File PDF asli)
	// ==========================================

	pdfGroup.GET("/alur", func(c *gin.Context) {
		// Mengambil template file statis
		c.File("views/pdf/alur.html")
	})

	pdfGroup.GET("/surat-pernyataan-ukt-atas", func(c *gin.Context) {
		c.File("views/pdf/contoh/SURAT_PERNYATAAN_UKT_TERTINGGI.pdf")
	})

	pdfGroup.GET("/tidak-sanggup", func(c *gin.Context) {
		c.File("views/pdf/contoh/FORM_KETIDAKSANGGUPAN_UKT.pdf")
	})

	pdfGroup.GET("/pengumuman-snmptn", func(c *gin.Context) {
		year := time.Now().Format("2006")
		c.File(fmt.Sprintf("public/pdf/Pengumuman_Kelulusan_SNMPTN_%s.pdf", year))
	})

	pdfGroup.GET("/pengumuman-sbmptn", func(c *gin.Context) {
		year := time.Now().Format("2006")
		c.File(fmt.Sprintf("public/pdf/Pengumuman_Kelulusan_SBMPTN_%s.pdf", year))
	})

	pdfGroup.GET("/pengumuman-japres", func(c *gin.Context) {
		year := time.Now().Format("2006")
		c.File(fmt.Sprintf("public/pdf/Pengumuman_Kelulusan_JAPRES_%s.pdf", year))
	})

	pdfGroup.GET("/pengumuman-mandiri", func(c *gin.Context) {
		year := time.Now().Format("2006")
		c.File(fmt.Sprintf("public/pdf/Pengumuman_Kelulusan_MANDIRI_%s.pdf", year))
	})

	// ==========================================
	// 2. ENDPOINT DINAMIS (Butuh Autentikasi JWT)
	// ==========================================
	
	authGroup := pdfGroup.Group("/")
	authGroup.Use(middlewares.JwtAuth())

	authGroup.GET("/slip-pembayaran", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		// Tarik model Info
		var info models.Info
		config.DB.First(&info)

		// Tarik data Mahasiswa dengan Preload Relasi
		var mhs models.CMahasiswa
		err := config.DB.Preload("Fakultas").Preload("Prodi").Where("no_peserta = ?", np).First(&mhs).Error
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Data Mahasiswa tidak ditemukan"})
			return
		}

		// Tarik UKT berdasarkan Golongan & Mayor
		var ukt models.UktKategori
		config.DB.Where("major_id = ?", mhs.ProdiCMahasiswa).First(&ukt)

		// Karena kita mendelegasikan PDF creation ke Golang HTML Templates:
		// Variabel data (ekuivalen obj di NodeJS)
		data := gin.H{
			"info":       info,
			"cmahasiswa": mhs,
			"ukt":        ukt,
		}

		// RENDER: Panggil Go Template "slip-pembayaran.html" 
		// *Pastikan file ejs lama sudah diubah sintaks <% %> -nya menjadi {{ }} ala Go Templates*
		c.HTML(http.StatusOK, "slip-pembayaran.html", data)
	})

	authGroup.GET("/bukti-selesai", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		var info models.Info
		config.DB.First(&info)

		var mhs models.CMahasiswa
		if err := config.DB.Where("no_peserta = ?", np).First(&mhs).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		data := gin.H{
			"info":       info,
			"cmahasiswa": mhs,
		}

		c.HTML(http.StatusOK, "bukti-selesai.html", data)
	})

	authGroup.GET("/surat-validasi", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		// Tarik seluruh kompenen
		var mhs models.CMahasiswa
		var a models.Ayah
		var i models.Ibu
		var k models.Kendaraan
		var w models.Wali
		var r models.Rumah
		var l models.Listrik
		var p models.Pendukung

		config.DB.Where("no_peserta = ?", np).First(&mhs)
		config.DB.Where("no_peserta = ?", np).First(&a)
		config.DB.Where("no_peserta = ?", np).First(&i)
		config.DB.Where("no_peserta = ?", np).First(&k)
		config.DB.Where("no_peserta = ?", np).First(&w)
		config.DB.Where("no_peserta = ?", np).First(&r)
		config.DB.Where("no_peserta = ?", np).First(&l)
		config.DB.Where("no_peserta = ?", np).First(&p)

		data := gin.H{
			"tahun":      time.Now().Format("2006"),
			"cmahasiswa": mhs,
			"ayah":       a,
			"ibu":        i,
			"kendaraan":  k,
			"wali":       w,
			"rumah":      r,
			"listrik":    l,
			"pendukung":  p,
		}

		c.HTML(http.StatusOK, "surat-validasi.html", data)
	})

	authGroup.GET("/sanggah", func(c *gin.Context) {
		// Logika ini diperuntukkan narik Array of Sanggah Data
		var mhsList []models.CMahasiswa
		config.DB.Preload("Fakultas").Preload("Prodi").Where("flag = ?", "sanggah_ukt").Find(&mhsList)

		data := gin.H{
			"rows": mhsList,
		}
		c.HTML(http.StatusOK, "pdf-sanggah.html", data)
	})

	authGroup.GET("/bm", func(c *gin.Context) {
		var mhsList []models.CMahasiswa
		config.DB.Preload("Fakultas").Preload("Prodi").Where("bidik_misi_cmahasiswa = ?", "Ya").Find(&mhsList)

		data := gin.H{
			"rows": mhsList,
		}
		c.HTML(http.StatusOK, "pdf-bm.html", data)
	})
}
