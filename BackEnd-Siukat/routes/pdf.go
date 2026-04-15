package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"fmt"
	"net/http"
	"strconv"
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
		c.HTML(http.StatusOK, "alur.html", nil)
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

		// [Langkah 2] Panggil Kurir WSDL (Smart Sync)
		wsdlService := services.WsdlService{}
		if err := wsdlService.SyncToWsdl(np); err != nil {
			fmt.Printf("⚠️ WSDL SYNC WARNING: %v\n", err)
		}

		// Tarik model Info
		var info models.Info
		config.DB.First(&info)

		// Tarik data Mahasiswa dengan Preload Relasi (Gunakan Service agar Smart Priority Sanggah > Original)
		cmahasiswaService := services.CMahasiswaService{}
		mhs, err := cmahasiswaService.GetCmahasiswa(np)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Data Mahasiswa tidak ditemukan"})
			return
		}
		
		// Pastikan relasi Prodi & Fakultas ke-load
		config.DB.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").First(&mhs, mhs.IDCmahasiswa)

		// Tarik UKT berdasarkan Golongan & Mayor
		var ukt models.Ukt
		config.DB.Where("major_id = ?", mhs.ProdiCmahasiswa).First(&ukt)

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
		if err := config.DB.Preload("Fakultas").Preload("Prodi").Where("no_peserta = ?", np).First(&mhs).Error; err != nil {
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

		config.DB.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").Where("no_peserta = ?", np).First(&mhs)
		config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").Preload("Pekerjaan").Where("no_peserta = ?", np).First(&a)
		config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").Preload("Pekerjaan").Where("no_peserta = ?", np).First(&i)
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

	authGroup.GET("/kontrak", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		var mhs models.CMahasiswa
		config.DB.Preload("Fakultas").Preload("Prodi").Where("no_peserta = ?", np).First(&mhs)

		data := gin.H{
			"cmahasiswa": mhs,
		}
		c.HTML(http.StatusOK, "kontrak.html", data)
	})

	authGroup.GET("/wali", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		var mhs models.CMahasiswa
		var w models.Wali

		config.DB.Preload("Fakultas").Preload("Prodi").Where("no_peserta = ?", np).First(&mhs)
		config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").Where("no_peserta = ?", np).First(&w)

		data := gin.H{
			"cmahasiswa": mhs,
			"wali":       w,
		}
		c.HTML(http.StatusOK, "wali.html", data)
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

	authGroup.GET("/master", func(c *gin.Context) {
    var mhsList []models.CMahasiswa
    cmahasiswaService := services.CMahasiswaService{}

    // 1. QUERY ANTI-DOUBLE (Smart Prioritas)
    config.DB.Model(&models.CMahasiswa{}).
        Select("tb_cmahasiswa.*"). // Pastikan ambil kolom utama
        Preload("Fakultas").Preload("Prodi").
        Joins("LEFT JOIN tb_cmahasiswa AS t2 ON tb_cmahasiswa.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'").
        Where("tb_cmahasiswa.atribut = 'sanggah' OR (tb_cmahasiswa.atribut = 'original' AND t2.id_cmahasiswa IS NULL)").
        Order("tb_cmahasiswa.no_peserta ASC").
        Find(&mhsList)

    // 2. LOOP DUIT: Hybrid Display (Nominal=Original, Tagihan=Current/Sanggah)
    for i := range mhsList {
        // A. Ambil data ORIGINAL buat penentu Nominal
        var mhsOriginal models.CMahasiswa
        config.DB.Where("no_peserta = ? AND atribut = ?", mhsList[i].NoPeserta, "original").First(&mhsOriginal)

        // B. Kolom NOMINAL UKT: Paksa nampilin Nominal Original
        var uktMaster models.Ukt
        if err := config.DB.Where("major_id = ? AND CAST(entrance AS CHAR) = ?", mhsList[i].ProdiCmahasiswa, mhsList[i].JalurCmahasiswa).First(&uktMaster).Error; err == nil {
            mhsList[i].Ukt = &uktMaster
            // Hitung pake GolonganID dari data Original
            mhsList[i].Ukt.Nominal = cmahasiswaService.CalculateNominalValue(uktMaster, mhsOriginal.GolonganID)
        }

        // C. Kolom TAGIHAN UKT: Pake data SEKARANG (Sanggah jika ada, Ori jika tidak)
        // Kita ambil dari mhsList[i].Tagihan langsung karena query sudah memprioritaskan Sanggah
        if tagihanInt, errStr := strconv.Atoi(mhsList[i].Tagihan); errStr == nil {
            mhsList[i].OriginalNominal = tagihanInt
        } else {
            mhsList[i].OriginalNominal = 0
        }
    }

    data := gin.H{
        "now":        time.Now().Format("02 January 2006, 15:04 WIB"),
        "cmahasiswa": mhsList,
    }
    c.HTML(http.StatusOK, "pdf-master.html", data)
})

}
