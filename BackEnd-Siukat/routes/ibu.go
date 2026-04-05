package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"BackEnd-Siukat/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

func IbuRoutes(r *gin.RouterGroup) {
	ibuGroup := r.Group("/ibu")
	ibuService := services.IbuService{}

	// Endpoint publik (tanpa JWT)
	ibuGroup.GET("/all", func(c *gin.Context) {
		var data []models.Ibu
		if err := config.DB.Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		c.JSON(http.StatusOK, data)
	})
	ibuGroup.GET("/get-ibu/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		var ibu models.Ibu
		// Prioritaskan sanggah dulu, fallback ke original — Parity dengan Node.js
		err := config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
			Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&ibu).Error
		if err != nil {
			err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
				Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&ibu).Error
		}
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"msg": "data tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, ibu)
	})

	// Endpoint yang butuh Auth
	authGroup := ibuGroup.Group("/")
	authGroup.Use(middlewares.JwtAuth())

	// POST /ibu/add
	authGroup.POST("/add", func(c *gin.Context) {
		var req models.Ibu
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		res, err := ibuService.Add(req, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// PUT /ibu/edit — Fix #3: Parity dengan routes/ibu.js Node.js
	// Menambahkan logika file upload KTP/Slip + AddLog sebelum update
	authGroup.PUT("/edit", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		statusIbu := c.PostForm("status_ibu")

		// Build struct dari form data
		req := models.Ibu{
			NamaIbu:  c.PostForm("nama_ibu"),
			StatusIbu: statusIbu,
		}

		if statusIbu != "wafat" {
			req.NikIbu = c.PostForm("nik_ibu")
			req.TeleponIbu = c.PostForm("telepon_ibu")
			req.AlamatIbu = c.PostForm("alamat_ibu")
			if pkj, errArg := strconv.Atoi(c.PostForm("pekerjaan_ibu")); errArg == nil {
				req.PekerjaanIbu = pkj
			}
			req.TempatLahirIbu = c.PostForm("tempat_lahir_ibu")
			if tgl, errTgl := time.Parse("2006-01-02", c.PostForm("tanggal_lahir_ibu")); errTgl == nil {
				req.TanggalLahirIbu = &tgl
			}

			// Mapping IDs and Income
			req.ProvinsiIbu = c.PostForm("provinsi_ibu")
			req.KabkotIbu = c.PostForm("kabkot_ibu")
			req.KecamatanIbu = c.PostForm("kecamatan_ibu")
			
			if pen, errPen := strconv.Atoi(c.PostForm("penghasilan_ibu")); errPen == nil {
				req.PenghasilanIbu = pen
			}
			if sam, errSam := strconv.Atoi(c.PostForm("sampingan_ibu")); errSam == nil {
				req.SampinganIbu = sam
			}

			// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) ---
			var student models.CMahasiswa
			config.DB.Where("no_peserta = ?", np).First(&student)

			var oldIbu models.Ibu
			config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&oldIbu)

			// File upload KTP
			fileKtp, errKtp := c.FormFile("file_scan_ktp_ibu")
			if errKtp == nil {
				utils.DeleteOldFile(oldIbu.ScanKtpIbu)
				newPath, err := utils.HandleDynamicUpload(c, fileKtp, student.NamaCmahasiswa, np)
				if err == nil {
					req.ScanKtpIbu = newPath
				}
			}

			// File upload Slip Gaji
			fileSlip, errSlip := c.FormFile("file_scan_slip_ibu")
			if errSlip == nil {
				utils.DeleteOldFile(oldIbu.ScanSlipIbu)
				newPath, err := utils.HandleDynamicUpload(c, fileSlip, student.NamaCmahasiswa, np)
				if err == nil {
					req.ScanSlipIbu = newPath
				}
			}
		}

		// STEP 1: Ambil data lama untuk di-log (sebelum update) — parity dengan Node.js
		var existing models.Ibu
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&existing)
		now := time.Now()
		ibuService.AddLog(existing, "original", np, &now)

		// STEP 2: Update data
		res, err := ibuService.Edit(req, np, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	authGroup.PUT("/edit/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		np := noPeserta

		statusIbu := c.PostForm("status_ibu")
		req := models.Ibu{
			NamaIbu:   c.PostForm("nama_ibu"),
			StatusIbu: statusIbu,
		}

		if statusIbu != "wafat" {
			req.NikIbu = c.PostForm("nik_ibu")
			req.TeleponIbu = c.PostForm("telepon_ibu")
			req.AlamatIbu = c.PostForm("alamat_ibu")
			if pkj, errArg := strconv.Atoi(c.PostForm("pekerjaan_ibu")); errArg == nil {
				req.PekerjaanIbu = pkj
			}
			req.TempatLahirIbu = c.PostForm("tempat_lahir_ibu")

			// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) - SANGGAH ---
			var student models.CMahasiswa
			config.DB.Where("no_peserta = ?", np).First(&student)

			var oldIbu models.Ibu
			config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&oldIbu)

			fileKtp, errKtp := c.FormFile("file_scan_ktp_ibu")
			if errKtp == nil {
				utils.DeleteOldFile(oldIbu.ScanKtpIbu)
				newPath, err := utils.HandleDynamicUpload(c, fileKtp, student.NamaCmahasiswa, np)
				if err == nil {
					req.ScanKtpIbu = newPath
				}
			}

			fileSlip, errSlip := c.FormFile("file_scan_slip_ibu")
			if errSlip == nil {
				utils.DeleteOldFile(oldIbu.ScanSlipIbu)
				newPath, err := utils.HandleDynamicUpload(c, fileSlip, student.NamaCmahasiswa, np)
				if err == nil {
					req.ScanSlipIbu = newPath
				}
			}
		}

		var existing models.Ibu
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&existing)
		now := time.Now()
		ibuService.AddLog(existing, "sanggah", np, &now)

		res, err := ibuService.Edit(req, np, "sanggah")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// GET /ibu/get-ibu — Mengambil data ibu user yang login
	authGroup.GET("/get-ibu", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		res, err := ibuService.GetByLoggedIn(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})
}
