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
	"fmt"
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
		atribut := c.Query("atribut")
		var ibu models.Ibu
		var err error

		if atribut != "" {
			err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
				Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&ibu).Error
		} else {
			// Prioritaskan sanggah dulu, fallback ke original — Parity dengan Node.js
			err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
				Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&ibu).Error
			if err != nil {
				err = config.DB.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
					Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&ibu).Error
			}
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

		data := map[string]interface{}{
			"nama_ibu":   c.PostForm("nama_ibu"),
			"status_ibu": statusIbu,
		}

		if statusIbu == "wafat" {
			data["nik_ibu"] = ""
			data["telepon_ibu"] = ""
			data["alamat_ibu"] = ""
			data["provinsi_ibu"] = nil
			data["kabkot_ibu"] = nil
			data["kecamatan_ibu"] = nil
			data["pekerjaan_ibu"] = ""
			data["penghasilan_ibu"] = 0
			data["sampingan_ibu"] = 0
			data["scan_ktp_ibu"] = ""
			data["scan_slip_ibu"] = ""
			data["tempat_lahir_ibu"] = ""
			data["tanggal_lahir_ibu"] = nil
		} else {
			data["nik_ibu"] = c.PostForm("nik_ibu")
			data["telepon_ibu"] = c.PostForm("telepon_ibu")
			data["alamat_ibu"] = c.PostForm("alamat_ibu")
			if pkj, errArg := strconv.Atoi(c.PostForm("pekerjaan_ibu")); errArg == nil {
				data["pekerjaan_ibu"] = pkj
			}
			data["tempat_lahir_ibu"] = c.PostForm("tempat_lahir_ibu")
			if tgl, errTgl := time.Parse("2006-01-02", c.PostForm("tanggal_lahir_ibu")); errTgl == nil {
				data["tanggal_lahir_ibu"] = &tgl
			}

			data["provinsi_ibu"] = c.PostForm("provinsi_ibu")
			data["kabkot_ibu"] = c.PostForm("kabkot_ibu")
			data["kecamatan_ibu"] = c.PostForm("kecamatan_ibu")

			if pen, errPen := strconv.Atoi(c.PostForm("penghasilan_ibu")); errPen == nil {
				data["penghasilan_ibu"] = pen
			}
			if sam, errSam := strconv.Atoi(c.PostForm("sampingan_ibu")); errSam == nil {
				data["sampingan_ibu"] = sam
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
				filename := fmt.Sprintf("KTP_Ibu_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
				newPath, err := utils.HandleDynamicUpload(c, fileKtp, student.NamaCmahasiswa, np, "original", filename)
				if err == nil {
					data["scan_ktp_ibu"] = newPath
				}
			}

			// File upload Slip Gaji
			fileSlip, errSlip := c.FormFile("file_scan_slip_ibu")
			if errSlip == nil {
				utils.DeleteOldFile(oldIbu.ScanSlipIbu)
				filename := fmt.Sprintf("Slip_Ibu_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
				newPath, err := utils.HandleDynamicUpload(c, fileSlip, student.NamaCmahasiswa, np, "original", filename)
				if err == nil {
					data["scan_slip_ibu"] = newPath
				}
			}
		}

		// STEP 1: Ambil data lama untuk di-log (sebelum update)
		var existing models.Ibu
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&existing)
		now := time.Now()
		ibuService.AddLog(existing, "original", np, &now)

		// STEP 2: Update data
		res, err := ibuService.Edit(data, np, "original")
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
		data := map[string]interface{}{
			"nama_ibu":   c.PostForm("nama_ibu"),
			"status_ibu": statusIbu,
		}

		if statusIbu != "wafat" {
			data["nik_ibu"] = c.PostForm("nik_ibu")
			data["telepon_ibu"] = c.PostForm("telepon_ibu")
			data["alamat_ibu"] = c.PostForm("alamat_ibu")
			if pkj, errArg := strconv.Atoi(c.PostForm("pekerjaan_ibu")); errArg == nil {
				data["pekerjaan_ibu"] = pkj
			}
			data["tempat_lahir_ibu"] = c.PostForm("tempat_lahir_ibu")
			if tgl, errTgl := time.Parse("2006-01-02", c.PostForm("tanggal_lahir_ibu")); errTgl == nil {
				data["tanggal_lahir_ibu"] = &tgl
			}

			data["provinsi_ibu"] = c.PostForm("provinsi_ibu")
			data["kabkot_ibu"] = c.PostForm("kabkot_ibu")
			data["kecamatan_ibu"] = c.PostForm("kecamatan_ibu")

			if pen, errPen := strconv.Atoi(c.PostForm("penghasilan_ibu")); errPen == nil {
				data["penghasilan_ibu"] = pen
			}
			if sam, errSam := strconv.Atoi(c.PostForm("sampingan_ibu")); errSam == nil {
				data["sampingan_ibu"] = sam
			}

			// --- LOGIKA DINAMIS & EFISIENSI (CLEANUP) - SANGGAH ---
			var student models.CMahasiswa
			config.DB.Where("no_peserta = ?", np).First(&student)

			var oldIbu models.Ibu
			config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&oldIbu)

			fileKtp, errKtp := c.FormFile("file_scan_ktp_ibu")
			if errKtp == nil {
				utils.DeleteOldFile(oldIbu.ScanKtpIbu)
				filename := fmt.Sprintf("KTP_Ibu_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
				newPath, err := utils.HandleDynamicUpload(c, fileKtp, student.NamaCmahasiswa, np, "sanggah", filename)
				if err == nil {
					data["scan_ktp_ibu"] = newPath
				}
			}

			fileSlip, errSlip := c.FormFile("file_scan_slip_ibu")
			if errSlip == nil {
				utils.DeleteOldFile(oldIbu.ScanSlipIbu)
				filename := fmt.Sprintf("Slip_Ibu_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
				newPath, err := utils.HandleDynamicUpload(c, fileSlip, student.NamaCmahasiswa, np, "sanggah", filename)
				if err == nil {
					data["scan_slip_ibu"] = newPath
				}
			}
		}

		var existing models.Ibu
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&existing)
		now := time.Now()
		ibuService.AddLog(existing, "sanggah", np, &now)

		res, err := ibuService.Edit(data, np, "sanggah")
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
