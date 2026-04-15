package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"BackEnd-Siukat/utils"
	"fmt"
	"mime/multipart"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CmahasiswaRoutes(r *gin.RouterGroup) {
	cmahasiswaGroup := r.Group("/cmahasiswa")
	
	cmahasiswaService := services.CMahasiswaService{}
	userService := services.UsersService{}
	ayahService := services.AyahService{}
	ibuService := services.IbuService{}
	kendaraanService := services.KendaraanService{}
	waliService := services.WaliService{}
	rumahService := services.RumahService{}
	listrikService := services.ListrikService{}
	pendukungService := services.PendukungService{}
	valueService := services.ValueService{}

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
	cmahasiswaGroup.Use(middlewares.JwtAuth())

	// GET /cmahasiswa/no-peserta/:no_peserta
	cmahasiswaGroup.GET("/no-peserta/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		res, err := cmahasiswaService.GetCmahasiswa(noPeserta)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"msg": "data tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// POST /cmahasiswa/add
	cmahasiswaGroup.POST("/add", func(c *gin.Context) {
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
	cmahasiswaGroup.PUT("/ukt-tinggi", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		
		var req struct {
			GolonganId string `json:"golongan_id"`
		}
		c.ShouldBindJSON(&req)

		// 1. Snapshot sebelum update
		existing, _ := cmahasiswaService.GetCmahasiswa(noPeserta.(string))

		err := cmahasiswaService.UktTinggi(req.GolonganId, noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// 2. Snapshot sesudah update
		updated, _ := cmahasiswaService.GetCmahasiswa(noPeserta.(string))
		now := time.Now()
		if existing.NoPeserta != "" {
			cmahasiswaService.AddLog(existing, noPeserta.(string), &now)
		}
		cmahasiswaService.AddLog(updated, noPeserta.(string), &now)

		c.JSON(http.StatusOK, "success")
	})

	// PUT /cmahasiswa/ukt-tinggi-tidak
	cmahasiswaGroup.PUT("/ukt-tinggi-tidak", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		
		// 1. Snapshot sebelum update
		existing, _ := cmahasiswaService.GetCmahasiswa(noPeserta.(string))

		err := cmahasiswaService.UktTinggiTidak(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// 2. Snapshot sesudah update
		updated, _ := cmahasiswaService.GetCmahasiswa(noPeserta.(string))
		now := time.Now()
		if existing.NoPeserta != "" {
			cmahasiswaService.AddLog(existing, noPeserta.(string), &now)
		}
		cmahasiswaService.AddLog(updated, noPeserta.(string), &now)

		c.JSON(http.StatusOK, "success")
	})

	// PUT /cmahasiswa/flag-terima
	cmahasiswaGroup.PUT("/flag-terima", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")

		err := cmahasiswaService.FlagTerima(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, "Anda telah menerima hasil UKT")
	})

	// GET /cmahasiswa/cek-bayar-bank/:no_peserta
	cmahasiswaGroup.GET("/cek-bayar-bank/:no_peserta", func(c *gin.Context) {
		np := c.Param("no_peserta")
		if config.DBWsdl != nil {
			var checkMhs models.CMahasiswa
			config.DB.Where("no_peserta = ?", np).First(&checkMhs)

			var user models.User
			config.DB.Where("no_peserta = ?", np).First(&user)
			if user.NoPeserta == "" {
				user.JalurMasuk = checkMhs.JalurCmahasiswa
			}

			var stageName string
			switch user.JalurMasuk {
			case "1": stageName = "snmptn"
			case "2": stageName = "sbmptn"
			case "3": stageName = "mandiri"
			default: stageName = "snmptn"
			}

			var info models.Info
			if err := config.DB.Where("stage = ?", stageName).First(&info).Error; err == nil {
				var existingStatus string
				if err := config.DBWsdl.Raw("SELECT flag_status FROM tb_bill_detail WHERE nim = ? AND bill_issue_id = ?", np, info.BillIssueID).Scan(&existingStatus).Error; err == nil {
					if existingStatus != "" && existingStatus != "01" && existingStatus != "88" {
						c.JSON(http.StatusOK, gin.H{"sudah_bayar": true, "status": existingStatus})
						return
					}
				}
			}
		}
		c.JSON(http.StatusOK, gin.H{"sudah_bayar": false})
	})

	// PUT /cmahasiswa/flag-klarifikasi
	// Atomic transaction: update flag original → 'sanggah_ukt' + INSERT salinan ke semua tabel dengan atribut='sanggah'
	cmahasiswaGroup.PUT("/flag-klarifikasi", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		//kalo mau matiin commant di sini yaa --- CEK WSDL: Tunda klarifikasi jika mahasiswa sudah bayar ---
		var warningMsg string
		if config.DBWsdl != nil {
			var checkMhs models.CMahasiswa
			config.DB.Where("no_peserta = ?", np).First(&checkMhs)

			var user models.User
			config.DB.Where("no_peserta = ?", np).First(&user)
			if user.NoPeserta == "" {
				user.JalurMasuk = checkMhs.JalurCmahasiswa
			}

			var stageName string
			switch user.JalurMasuk {
			case "1": stageName = "snmptn"
			case "2": stageName = "sbmptn"
			case "3": stageName = "mandiri"
			default: stageName = "snmptn"
			}

			var info models.Info
			if err := config.DB.Where("stage = ?", stageName).First(&info).Error; err == nil {
				var existingStatus string
				if err := config.DBWsdl.Raw("SELECT flag_status FROM tb_bill_detail WHERE nim = ? AND bill_issue_id = ?", np, info.BillIssueID).Scan(&existingStatus).Error; err == nil {
					if existingStatus != "" && existingStatus != "01" && existingStatus != "88" {
						warningMsg = " [PERINGATAN: Anda sudah terdeteksi lunas (Status: " + existingStatus + ") di sistem Bank. Klarifikasi ini tidak akan merubah nominal di Bank!]"
					}
				}
			}
		}
		// --- END CEK WSDL ---

		// Cek apakah row sanggah sudah ada (idempotent - prevent duplikasi)
		var existingSanggah models.CMahasiswa
		if err := config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&existingSanggah).Error; err == nil {
			// Row sanggah sudah ada
			c.JSON(http.StatusOK, gin.H{"message": "Data sanggah sudah ada"})
			return
		}

		// Ambil semua data original dari semua tabel
		originalMhs, err := cmahasiswaService.GetCmahasiswa(np)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data mahasiswa tidak ditemukan"})
			return
		}

		originalAyah, _ := ayahService.GetByLoggedIn(np)
		originalIbu, _ := ibuService.GetByLoggedIn(np)
		originalKendaraan, _ := kendaraanService.GetByLoggedIn(np)
		originalListrik, _ := listrikService.GetByLoggedIn(np)
		originalPendukung, _ := pendukungService.GetByLoggedIn(np)
		originalRumah, _ := rumahService.GetByLoggedIn(np)
		originalWali, _ := waliService.GetByLoggedIn(np)
		originalValue, _ := valueService.GetByLoggedIn(np)

		// 1. Physically CLONE the document folder from Original to Sanggah
		if err := utils.CopyStudentFiles(originalMhs.NamaCmahasiswa, np, "original", "sanggah"); err != nil {
			fmt.Printf("⚠️ WARNING: Folder cloning partially failed for %s: %v\n", np, err)
			// We continue because some files might not exist or folder might already be there
		}

		// Jalankan semua operasi dalam satu atomic transaction
		if err := config.DB.Transaction(func(tx *gorm.DB) error {

			// 2. INSERT copy tb_cmahasiswa dengan atribut='sanggah'
			sanggahMhs := originalMhs
			sanggahMhs.IDCmahasiswa = 0 // Reset PK agar auto-increment
			sanggahMhs.Atribut = "sanggah"
			sanggahMhs.Flag = "sanggah_ukt"
			sanggahMhs.NoRegistrasi = nil // Fix: Clear to avoid Unique Key conflict
			sanggahMhs.Fakultas = nil
			sanggahMhs.Prodi = nil
			sanggahMhs.Ukt = nil
			sanggahMhs.Provinsi = nil
			sanggahMhs.Kabkot = nil
			sanggahMhs.Kecamatan = nil
			
			// Update Path: Original/ -> Sanggah/ (Robust Case-Insensitive)
			re := regexp.MustCompile("(?i)/original/")
			sanggahMhs.FotoCmahasiswa = re.ReplaceAllString(sanggahMhs.FotoCmahasiswa, "/Sanggah/")

			if err := tx.Create(&sanggahMhs).Error; err != nil {
				return fmt.Errorf("gagal insert copy cmahasiswa: %v", err)
			}

			// 3. INSERT copy tb_ayah dengan atribut='sanggah'
			if originalAyah.NoPeserta != "" {
				sanggahAyah := originalAyah
				sanggahAyah.IDAyah = 0
				sanggahAyah.Atribut = "sanggah"
				sanggahAyah.ScanKtpAyah = re.ReplaceAllString(sanggahAyah.ScanKtpAyah, "/Sanggah/")
				sanggahAyah.ScanSlipAyah = re.ReplaceAllString(sanggahAyah.ScanSlipAyah, "/Sanggah/")
				if err := tx.Create(&sanggahAyah).Error; err != nil {
					return fmt.Errorf("gagal insert copy ayah: %v", err)
				}
			}

			// 4. INSERT copy tb_ibu dengan atribut='sanggah'
			if originalIbu.NoPeserta != "" {
				sanggahIbu := originalIbu
				sanggahIbu.IDIbu = 0
				sanggahIbu.Atribut = "sanggah"
				sanggahIbu.ScanKtpIbu = re.ReplaceAllString(sanggahIbu.ScanKtpIbu, "/Sanggah/")
				sanggahIbu.ScanSlipIbu = re.ReplaceAllString(sanggahIbu.ScanSlipIbu, "/Sanggah/")
				if err := tx.Create(&sanggahIbu).Error; err != nil {
					return fmt.Errorf("gagal insert copy ibu: %v", err)
				}
			}

			// 5. INSERT copy tb_kendaraan dengan atribut='sanggah'
			if originalKendaraan.NoPeserta != "" {
				sanggahKendaraan := originalKendaraan
				sanggahKendaraan.IDKendaraan = 0
				sanggahKendaraan.Atribut = "sanggah"
				sanggahKendaraan.ScanMotor = re.ReplaceAllString(sanggahKendaraan.ScanMotor, "/Sanggah/")
				sanggahKendaraan.ScanMobil = re.ReplaceAllString(sanggahKendaraan.ScanMobil, "/Sanggah/")
				if err := tx.Create(&sanggahKendaraan).Error; err != nil {
					return fmt.Errorf("gagal insert copy kendaraan: %v", err)
				}
			}

			// 6. INSERT copy tb_listrik dengan atribut='sanggah'
			if originalListrik.NoPeserta != "" {
				sanggahListrik := originalListrik
				sanggahListrik.IDListrik = 0
				sanggahListrik.Atribut = "sanggah"
				sanggahListrik.ScanListrik = re.ReplaceAllString(sanggahListrik.ScanListrik, "/Sanggah/")
				if err := tx.Create(&sanggahListrik).Error; err != nil {
					return fmt.Errorf("gagal insert copy listrik: %v", err)
				}
			}

			// 7. INSERT copy tb_pendukung dengan atribut='sanggah'
			if originalPendukung.NoPeserta != "" {
				sanggahPendukung := originalPendukung
				sanggahPendukung.IDPendukung = 0
				sanggahPendukung.Atribut = "sanggah"
				sanggahPendukung.ScanPernyataanUktTinggi = re.ReplaceAllString(sanggahPendukung.ScanPernyataanUktTinggi, "/Sanggah/")
				sanggahPendukung.ScanPernyataanKebenaran = re.ReplaceAllString(sanggahPendukung.ScanPernyataanKebenaran, "/Sanggah/")
				sanggahPendukung.ScanKk = re.ReplaceAllString(sanggahPendukung.ScanKk, "/Sanggah/")
				if err := tx.Create(&sanggahPendukung).Error; err != nil {
					return fmt.Errorf("gagal insert copy pendukung: %v", err)
				}
			}

			// 8. INSERT copy tb_rumah dengan atribut='sanggah'
			if originalRumah.NoPeserta != "" {
				sanggahRumah := originalRumah
				sanggahRumah.IDRumah = 0
				sanggahRumah.Atribut = "sanggah"
				sanggahRumah.ScanPbb = re.ReplaceAllString(sanggahRumah.ScanPbb, "/Sanggah/")
				sanggahRumah.ScanKontrak = re.ReplaceAllString(sanggahRumah.ScanKontrak, "/Sanggah/")
				if err := tx.Create(&sanggahRumah).Error; err != nil {
					return fmt.Errorf("gagal insert copy rumah: %v", err)
				}
			}

			// 9. INSERT copy tb_wali dengan atribut='sanggah'
			if originalWali.NoPeserta != "" {
				sanggahWali := originalWali
				sanggahWali.IDWali = 0
				sanggahWali.Atribut = "sanggah"
				sanggahWali.ScanWali = re.ReplaceAllString(sanggahWali.ScanWali, "/Sanggah/")
				if err := tx.Create(&sanggahWali).Error; err != nil {
					return fmt.Errorf("gagal insert copy wali: %v", err)
				}
			}

			// 10. INSERT copy tb_keringanan (if exists)
			var originalKeringanan models.Keringanan
			if err := config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&originalKeringanan).Error; err == nil {
				sanggahKeringanan := originalKeringanan
				sanggahKeringanan.IDKeringanan = 0
				sanggahKeringanan.Atribut = "sanggah"
				sanggahKeringanan.ScanKeringanan = re.ReplaceAllString(sanggahKeringanan.ScanKeringanan, "/Sanggah/")
				if err := tx.Create(&sanggahKeringanan).Error; err != nil {
					return fmt.Errorf("gagal insert copy keringanan: %v", err)
				}
			}

			// 11. INSERT copy tb_value (if exists)
			if originalValue.NoPeserta != 0 {
				sanggahValue := originalValue
				sanggahValue.IDValue = 0
				sanggahValue.Atribut = "sanggah"
				if err := tx.Create(&sanggahValue).Error; err != nil {
					return fmt.Errorf("gagal insert copy value: %v", err)
				}
			}

			return nil
		}); err != nil {
			fmt.Printf("❌ KLARIFIKASI TRANSACTION ERROR [%s]: %v\n", np, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal proses klarifikasi: " + err.Error()})
			return
		}

		fmt.Printf("✅ KLARIFIKASI SUCCESS [%s]: Semua tabel di-copy dengan atribut='sanggah'\n", np)
		c.JSON(http.StatusOK, gin.H{"message": "Anda telah memilih klarifikasi UKT." + warningMsg})
	})

	// PUT /cmahasiswa/flag-klarifikasi-admin/:no_peserta
	// Endpoint khusus admin — Mendukung "Sanggah Baru" dan "Reset Sanggah"
	cmahasiswaGroup.PUT("/flag-klarifikasi-admin/:no_peserta", func(c *gin.Context) {
		np := c.Param("no_peserta")

		// --- CEK WSDL: Tunda klarifikasi jika mahasiswa sudah bayar ---
		var warningMsg string
		if config.DBWsdl != nil {
			var checkMhs models.CMahasiswa
			config.DB.Where("no_peserta = ?", np).First(&checkMhs)

			var user models.User
			config.DB.Where("no_peserta = ?", np).First(&user)
			if user.NoPeserta == "" {
				user.JalurMasuk = checkMhs.JalurCmahasiswa
			}

			var stageName string
			switch user.JalurMasuk {
			case "1": stageName = "snmptn"
			case "2": stageName = "sbmptn"
			case "3": stageName = "mandiri"
			default: stageName = "snmptn"
			}

			var info models.Info
			if err := config.DB.Where("stage = ?", stageName).First(&info).Error; err == nil {
				var existingStatus string
				if err := config.DBWsdl.Raw("SELECT flag_status FROM tb_bill_detail WHERE nim = ? AND bill_issue_id = ?", np, info.BillIssueID).Scan(&existingStatus).Error; err == nil {
					if existingStatus != "" && existingStatus != "01" && existingStatus != "88" {
						warningMsg = " [PERINGATAN: Mahasiswa ini sudah bayar lunas di bank. Tagihan WSDL tidak akan diubah!]"
					}
				}
			}
		}
		// --- END CEK WSDL ---

		// 1. CLEANUP: Hapus data sanggah lama jika ada (buat "Reset/Replace")
		// Ini memastikan dataatribut='sanggah' dibersihkan dulu sebelum di-copy ulang dari master.
		if err := config.DB.Transaction(func(tx *gorm.DB) error {
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Ayah{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Ibu{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Wali{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Kendaraan{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Rumah{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Listrik{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Pendukung{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Value{})
			return tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.CMahasiswa{}).Error
		}); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membersihkan data sanggah lama: " + err.Error()})
			return
		}

		// 2. FETCH ORIGINAL: Ambil data MASTER (atribut='original')
		// PENTING: Jangan pakai service.GetCmahasiswa karena itu memprioritaskan sanggah.
		var originalMhs models.CMahasiswa
		if err := config.DB.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
			Where("no_peserta = ? AND atribut = ?", np, "original").First(&originalMhs).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data master mahasiswa tidak ditemukan"})
			return
		}

		// Ambil data pendukung murni original
		var oAyah models.Ayah; config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&oAyah)
		var oIbu models.Ibu; config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&oIbu)
		var oKendaraan models.Kendaraan; config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&oKendaraan)
		var oListrik models.Listrik; config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&oListrik)
		var oPendukung models.Pendukung; config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&oPendukung)
		var oRumah models.Rumah; config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&oRumah)
		var oWali models.Wali; config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&oWali)
		var oValue models.Value; config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&oValue)

		// 2.5 Physically CLONE the document folder from Original to Sanggah
		if err := utils.CopyStudentFiles(originalMhs.NamaCmahasiswa, np, "original", "sanggah"); err != nil {
			fmt.Printf("⚠️ WARNING: Folder cloning partially failed for %s: %v\n", np, err)
		}

		// 3. COPY TO SANGGAH: Simpan sebagai record baru dengan atribut='sanggah'
		if err := config.DB.Transaction(func(tx *gorm.DB) error {
			sanggahMhs := originalMhs
			sanggahMhs.IDCmahasiswa = 0
			sanggahMhs.Atribut = "sanggah"
			sanggahMhs.Flag = "sanggah_ukt"
			sanggahMhs.NoRegistrasi = nil 
			sanggahMhs.Fakultas = nil; sanggahMhs.Prodi = nil; sanggahMhs.Ukt = nil
			sanggahMhs.Provinsi = nil; sanggahMhs.Kabkot = nil; sanggahMhs.Kecamatan = nil
			
			// Update Path: Original/ -> Sanggah/ (Robust Case-Insensitive)
			reAdmin := regexp.MustCompile("(?i)/original/")
			sanggahMhs.FotoCmahasiswa = reAdmin.ReplaceAllString(sanggahMhs.FotoCmahasiswa, "/Sanggah/")

			if err := tx.Create(&sanggahMhs).Error; err != nil {
				return fmt.Errorf("gagal insert copy cmahasiswa: %v", err)
			}
			
			if oAyah.NoPeserta != "" {
				sAyah := oAyah; sAyah.IDAyah = 0; sAyah.Atribut = "sanggah"
				sAyah.ScanKtpAyah = strings.ReplaceAll(sAyah.ScanKtpAyah, "/Original/", "/Sanggah/")
				sAyah.ScanSlipAyah = strings.ReplaceAll(sAyah.ScanSlipAyah, "/Original/", "/Sanggah/")
				if err := tx.Create(&sAyah).Error; err != nil {
					return fmt.Errorf("gagal copy ayah: %v", err)
				}
			}
			if oIbu.NoPeserta != "" {
				sIbu := oIbu; sIbu.IDIbu = 0; sIbu.Atribut = "sanggah"
				sIbu.ScanKtpIbu = strings.ReplaceAll(sIbu.ScanKtpIbu, "/Original/", "/Sanggah/")
				sIbu.ScanSlipIbu = strings.ReplaceAll(sIbu.ScanSlipIbu, "/Original/", "/Sanggah/")
				if err := tx.Create(&sIbu).Error; err != nil {
					return fmt.Errorf("gagal copy ibu: %v", err)
				}
			}
			if oKendaraan.NoPeserta != "" {
				sKendaraan := oKendaraan; sKendaraan.IDKendaraan = 0; sKendaraan.Atribut = "sanggah"
				sKendaraan.ScanMotor = strings.ReplaceAll(sKendaraan.ScanMotor, "/Original/", "/Sanggah/")
				sKendaraan.ScanMobil = strings.ReplaceAll(sKendaraan.ScanMobil, "/Original/", "/Sanggah/")
				if err := tx.Create(&sKendaraan).Error; err != nil {
					return fmt.Errorf("gagal copy kendaraan: %v", err)
				}
			}
			if oListrik.NoPeserta != "" {
				sListrik := oListrik; sListrik.IDListrik = 0; sListrik.Atribut = "sanggah"
				sListrik.ScanListrik = strings.ReplaceAll(sListrik.ScanListrik, "/Original/", "/Sanggah/")
				if err := tx.Create(&sListrik).Error; err != nil {
					return fmt.Errorf("gagal copy listrik: %v", err)
				}
			}
			if oPendukung.NoPeserta != "" {
				sPendukung := oPendukung; sPendukung.IDPendukung = 0; sPendukung.Atribut = "sanggah"
				sPendukung.ScanPernyataanUktTinggi = strings.ReplaceAll(sPendukung.ScanPernyataanUktTinggi, "/Original/", "/Sanggah/")
				sPendukung.ScanPernyataanKebenaran = strings.ReplaceAll(sPendukung.ScanPernyataanKebenaran, "/Original/", "/Sanggah/")
				sPendukung.ScanKk = strings.ReplaceAll(sPendukung.ScanKk, "/Original/", "/Sanggah/")
				if err := tx.Create(&sPendukung).Error; err != nil {
					return fmt.Errorf("gagal copy pendukung: %v", err)
				}
			}
			if oRumah.NoPeserta != "" {
				sRumah := oRumah; sRumah.IDRumah = 0; sRumah.Atribut = "sanggah"
				sRumah.ScanPbb = strings.ReplaceAll(sRumah.ScanPbb, "/Original/", "/Sanggah/")
				sRumah.ScanKontrak = strings.ReplaceAll(sRumah.ScanKontrak, "/Original/", "/Sanggah/")
				if err := tx.Create(&sRumah).Error; err != nil {
					return fmt.Errorf("gagal copy rumah: %v", err)
				}
			}
			if oWali.NoPeserta != "" {
				sWali := oWali; sWali.IDWali = 0; sWali.Atribut = "sanggah"
				sWali.ScanWali = strings.ReplaceAll(sWali.ScanWali, "/Original/", "/Sanggah/")
				if err := tx.Create(&sWali).Error; err != nil {
					return fmt.Errorf("gagal copy wali: %v", err)
				}
			}

			if oValue.NoPeserta != 0 {
				sValue := oValue; sValue.IDValue = 0; sValue.Atribut = "sanggah"
				if err := tx.Create(&sValue).Error; err != nil {
					return fmt.Errorf("gagal copy value: %v", err)
				}
			}

			// 10. INSERT copy tb_keringanan (if exists)
			var oKeringanan models.Keringanan
			if err := config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&oKeringanan).Error; err == nil {
				sKeringanan := oKeringanan
				sKeringanan.IDKeringanan = 0
				sKeringanan.Atribut = "sanggah"
				sKeringanan.ScanKeringanan = strings.ReplaceAll(sKeringanan.ScanKeringanan, "/Original/", "/Sanggah/")
				if err := tx.Create(&sKeringanan).Error; err != nil {
					return fmt.Errorf("gagal copy keringanan: %v", err)
				}
			}
			return nil
		}); err != nil {
			fmt.Printf("❌ KLARIFIKASI ADMIN ERROR [%s]: %v\n", np, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal proses klarifikasi: " + err.Error()})
			return
		}

		fmt.Printf("✅ KLARIFIKASI ADMIN SUCCESS [%s]: Copy data original ke sanggah berhasil\n", np)
		c.JSON(http.StatusOK, gin.H{"message": "Klarifikasi berhasil diproses. Data sanggah ditarik dari master." + warningMsg})
	})



	cmahasiswaGroup.GET("/flag-batal-klarifikasi/:no_peserta", func(c *gin.Context) {
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
	cmahasiswaGroup.GET("/flag-selesai-klarifikasi/:no_peserta", func(c *gin.Context) {
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

	// GET /cmahasiswa/count-flag
	cmahasiswaGroup.GET("/count-flag", func(c *gin.Context) {
		res, err := cmahasiswaService.CountFlag()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// POST /cmahasiswa/datatable
	cmahasiswaGroup.POST("/datatable", func(c *gin.Context) {
		var req struct {
			Page    int    `json:"page"`
			PerPage int    `json:"perPage"`
			Keyword string `json:"keyword"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		res, err := cmahasiswaService.Datatable(req.Page, req.PerPage, req.Keyword)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// POST /cmahasiswa/datatable-sanggah
	cmahasiswaGroup.POST("/datatable-sanggah", func(c *gin.Context) {
		var req struct {
			Page    int    `json:"page"`
			PerPage int    `json:"perPage"`
			Keyword string `json:"keyword"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		res, err := cmahasiswaService.DatatableSanggah(req.Page, req.PerPage, req.Keyword)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// GET /cmahasiswa/verifikasi
	cmahasiswaGroup.GET("/verifikasi", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)
		
		user, err := userService.GetUser(np)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memverifikasi data"})
			return
		}

		userMhs, _ := cmahasiswaService.GetCmahasiswa(np)

		cMhsRes, _ := cmahasiswaService.CheckData(np)
		ayahRes, _ := ayahService.CheckData(np, userMhs.UktTinggi)
		ibuRes, _ := ibuService.CheckData(np, userMhs.UktTinggi)
		kenRes, _ := kendaraanService.CheckData(np)
		waliRes, _ := waliService.CheckData(np, userMhs.UktTinggi)
		rmhRes, _ := rumahService.CheckData(np)
		lstRes, _ := listrikService.CheckData(np)
		pdkRes, _ := pendukungService.CheckData(np, userMhs.UktTinggi)
		pdkVerRes, _ := pendukungService.CheckDataVerifikasi(np, userMhs.UktTinggi)

		isVerified := cMhsRes && ayahRes && ibuRes && kenRes && waliRes && rmhRes && lstRes && pdkRes && pdkVerRes

		c.JSON(http.StatusOK, gin.H{
			"data": user,
			"cmahasiswa": cMhsRes,
			"ayah": ayahRes,
			"ibu": ibuRes,
			"kendaraan": kenRes,
			"wali": waliRes,
			"rumah": rmhRes,
			"listrik": lstRes,
			"pendukung": pdkRes,
			"verifikasi": isVerified,
		})
	})

	// PUT /cmahasiswa/upload-foto
	cmahasiswaGroup.PUT("/upload-foto", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		// Portal mahasiswa: Wajib ambil record Original
		student, err := cmahasiswaService.GetCmahasiswaByAtribut(np, "original")
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data mahasiswa tidak ditemukan"})
			return
		}

		file, errFile := c.FormFile("foto")
		if errFile != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File foto tidak ditemukan dalam request"})
			return
		}

		// LOGIKA DINAMIS & EFISIENSI (Standardisasi "foto_profil")
		// HAPUS FILE FISIK LAMA (Apapun namanya)
		utils.DeleteOldFile(student.FotoCmahasiswa)

		// SEKARANG: Otomatis hapus foto profil lama (apapun ekstensinya .jpg/.png) di dalam HandleDynamicUpload
		filename := fmt.Sprintf("Profile_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
		savedPath, errUpload := utils.HandleDynamicUpload(c, file, student.NamaCmahasiswa, np, student.Atribut, filename)
		if errUpload != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupload foto: " + errUpload.Error()})
			return
		}

		// Update DB menggunakan atribut asli dari record student (original/sanggah)
		updateData := map[string]interface{}{"foto_cmahasiswa": savedPath}
		res, err := cmahasiswaService.Edit(updateData, np, student.Atribut)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal update database foto"})
			return
		}

		// 6. SIMPAN LOG
		now := time.Now()
		if student.NoPeserta != "" {
			cmahasiswaService.AddLog(student, np, &now)
		}
		cmahasiswaService.AddLog(res, np, &now)

		c.JSON(http.StatusOK, gin.H{
			"message": "Foto profil berhasil diperbarui",
			"path":    savedPath,
		})
	})

	// PUT /cmahasiswa/edit (Parity dengan Node.js biodata update + Upload Foto)
	cmahasiswaGroup.PUT("/edit", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		// Portal mahasiswa: Wajib ambil record Original
		student, err := cmahasiswaService.GetCmahasiswaByAtribut(np, "original")
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data mahasiswa tidak ditemukan"})
			return
		}

		updateData := make(map[string]interface{})

		// 1. Cek Content-Type
		contentType := c.GetHeader("Content-Type")
		if contentType == "application/json" {
			// Kasus A: Update JSON Murnian
			if err := c.ShouldBindJSON(&updateData); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON: " + err.Error()})
				return
			}
		} else {
			// Kasus B: Multipart/Form (Termasuk Foto)
			form, err := c.MultipartForm()
			if err == nil {
				// Ambil semua field form secara dinamis
				for key, values := range form.Value {
					if len(values) > 0 {
						updateData[key] = values[0]
					}
				}

				// Cek File Foto Profil (Mendukung key 'foto' atau 'file_foto_cmahasiswa')
				var fileHeader *multipart.FileHeader
				if f, ok := form.File["foto"]; ok && len(f) > 0 {
					fileHeader = f[0]
				} else if f, ok := form.File["file_foto_cmahasiswa"]; ok && len(f) > 0 {
					fileHeader = f[0]
				}

				if fileHeader != nil {
					// HAPUS FILE FISIK LAMA (Apapun namanya)
					utils.DeleteOldFile(student.FotoCmahasiswa)

					// Upload baru dengan nama tetap "foto_profil" (Sesuai Request USER)
					// HandleDynamicUpload otomatis cari & hapus file "foto_profil.*" lain untuk safety
					filename := fmt.Sprintf("Profile_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), np)
					savedPath, errUpload := utils.HandleDynamicUpload(c, fileHeader, student.NamaCmahasiswa, np, student.Atribut, filename)
					
					fmt.Printf("📸 DEBUG UPLOAD: Student [%s] Atribut [%s] SavedPath [%s]\n", np, student.Atribut, savedPath)
					
					if errUpload == nil {
						updateData["foto_cmahasiswa"] = savedPath
					} else {
						fmt.Printf("❌ DEBUG UPLOAD ERROR: %v\n", errUpload)
						c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupload foto profil: " + errUpload.Error()})
						return
					}
				}
			} else {
				// Fallback ke PostForm jika bukan multipart tapi form-urlencoded
				c.Request.ParseForm()
				for key, values := range c.Request.PostForm {
					if len(values) > 0 {
						updateData[key] = values[0]
					}
				}
			}
		}

		// Filter Valid DB Fields
		validFields := map[string]bool{
			"no_peserta":              true, 
			"nama_cmahasiswa":         true,
			"bidik_misi_cmahasiswa":    true,
			"fakultas_cmahasiswa":     true,
			"prodi_cmahasiswa":        true,
			"jalur_cmahasiswa":        true,
			"sosmed_cmahasiswa":       true,
			"alamat_cmahasiswa":       true,
			"provinsi_cmahasiswa":     true,
			"kabkot_cmahasiswa":       true,
			"kecamatan_cmahasiswa":    true,
			"gender_cmahasiswa":       true,
			"telepon_cmahasiswa":      true,
			"goldar_cmahasiswa":       true,
			"tempat_lahir_cmahasiswa": true,
			"tanggal_lahir_cmahasiswa": true,
			"foto_cmahasiswa":         true,
			"penghasilan_cmahasiswa":  true,
			"golongan_id":             true,
			"ukt_tinggi":              true,
			"flag":                   true,
			"tagihan":                true,
			"spu":                    true,
			"penalty":                true,
		}

		filteredData := make(map[string]interface{})
		for k, v := range updateData {
			if validFields[k] {
				filteredData[k] = v
			}
		}

		// 4. Parse Date Fields (PENTING: Agar GORM bisa simpan ke format DATE)
		if tglStr, ok := filteredData["tanggal_lahir_cmahasiswa"].(string); ok && tglStr != "" {
			if tgl, err := time.Parse("2006-01-02", tglStr); err == nil {
				filteredData["tanggal_lahir_cmahasiswa"] = &tgl
				fmt.Printf("[DEBUG] Parsed tanggal_lahir_cmahasiswa: %v\n", tgl)
			} else {
				fmt.Printf("[WARNING] FAILED to parse tanggal_lahir_cmahasiswa: '%s'. Error: %v\n", tglStr, err)
			}
		}

		// 5. LOGIKA SINKRONISASI IDENTITAS & FOLDER (Request USER)
		newName, okName := filteredData["nama_cmahasiswa"].(string)
		if !okName { newName = student.NamaCmahasiswa }
		
		newNP, okNP := filteredData["no_peserta"].(string)
		if !okNP { newNP = np }

		// Jika ada perubahan Nama atau NoPeserta, jalankan sinkronisasi
		if newName != student.NamaCmahasiswa || newNP != np {
			errSync := cmahasiswaService.UpdateIdentity(student.NamaCmahasiswa, np, newName, newNP)
			if errSync != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal sinkronisasi identitas: " + errSync.Error()})
				return
			}
			// Update variabel np agar proses selanjutnya (Update DB lainnya) menggunakan NoPeserta yang baru
			np = newNP
		}

		// Jalankan Update untuk sisa field lainnya (Gunakan student.Atribut)
		res, err := cmahasiswaService.Edit(filteredData, np, student.Atribut)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal merubah data mahasiswa: " + err.Error()})
			return
		}

		// 6. SIMPAN LOG (Snaphost sebelum & sesudah)
		now := time.Now()
		if student.NoPeserta != "" {
			cmahasiswaService.AddLog(student, np, &now)
		}
		cmahasiswaService.AddLog(res, np, &now)

		c.JSON(http.StatusOK, res)
	})

	// PUT /cmahasiswa/edit/:no_peserta (Admin usage) - Updated to support uploads & identity sync
	cmahasiswaGroup.PUT("/edit/:no_peserta", func(c *gin.Context) {
		np := c.Param("no_peserta")
		
		// 1. Ambil data student (Gunakan Service agar dapet yang AKTIF: Sanggah > Original)
		student, err := cmahasiswaService.GetCmahasiswa(np)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data mahasiswa tidak ditemukan"})
			return
		}

		// 1. Parsing Multipart Form (Support File Upload)
		form, err := c.MultipartForm()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse multipart form"})
			return
		}

		updateData := make(map[string]interface{})
		for key, values := range form.Value {
			if len(values) > 0 {
				updateData[key] = values[0]
			}
		}

		// 2. Handle File Upload (Pas Foto) — SEKARANG: Pakai HandleDynamicUpload (Parity dengan Student)
		files := form.File["file_foto_cmahasiswa"]
		if len(files) > 0 {
			file := files[0]
			
			// HAPUS FILE FISIK LAMA (Cleanup)
			utils.DeleteOldFile(student.FotoCmahasiswa)

			// Simpan baru menggunakan helper (Otomatis Wildcard Cleanup inside)
			filename := fmt.Sprintf("Profile_%s_%s", utils.SanitizeString(student.NamaCmahasiswa), student.NoPeserta)
			savedPath, errUpload := utils.HandleDynamicUpload(c, file, student.NamaCmahasiswa, student.NoPeserta, student.Atribut, filename)
			if errUpload != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupload foto: " + errUpload.Error()})
				return
			}
			updateData["foto_cmahasiswa"] = savedPath
		}

		// 3. Filter Valid DB Fields
		validFields := map[string]bool{
			"no_peserta":              true, 
			"nama_cmahasiswa":         true,
			"bidik_misi_cmahasiswa":    true,
			"fakultas_cmahasiswa":     true,
			"prodi_cmahasiswa":        true,
			"jalur_cmahasiswa":        true,
			"sosmed_cmahasiswa":       true,
			"alamat_cmahasiswa":       true,
			"provinsi_cmahasiswa":     true,
			"kabkot_cmahasiswa":       true,
			"kecamatan_cmahasiswa":    true,
			"gender_cmahasiswa":       true,
			"telepon_cmahasiswa":      true,
			"goldar_cmahasiswa":       true,
			"tempat_lahir_cmahasiswa": true,
			"tanggal_lahir_cmahasiswa": true,
			"foto_cmahasiswa":         true,
			"penghasilan_cmahasiswa":  true,
			"golongan_id":             true,
			"ukt_tinggi":              true,
			"flag":                   true,
			"tagihan":                true,
			"spu":                    true,
			"penalty":                true,
		}

		filteredData := make(map[string]interface{})
		for k, v := range updateData {
			if validFields[k] {
				filteredData[k] = v
			}
		}

		// 3.5 Parse Date Fields (PENTING: Biar GORM bisa simpan ke format DATE)
		if tglStr, ok := filteredData["tanggal_lahir_cmahasiswa"].(string); ok && tglStr != "" {
			if tgl, err := time.Parse("2006-01-02", tglStr); err == nil {
				filteredData["tanggal_lahir_cmahasiswa"] = &tgl
				fmt.Printf("[DEBUG] Admin Parsed tanggal_lahir_cmahasiswa: %v\n", tgl)
			} else {
				fmt.Printf("[WARNING] Admin FAILED to parse tanggal_lahir_cmahasiswa: '%s'. Error: %v\n", tglStr, err)
			}
		}

		// 4. Identity & Folder Synchronization (If Identity Changed)
		newName, okName := filteredData["nama_cmahasiswa"].(string)
		if !okName { newName = student.NamaCmahasiswa }
		
		newNP, okNP := filteredData["no_peserta"].(string)
		if !okNP { newNP = np }

		if newName != student.NamaCmahasiswa || newNP != np {
			errSync := cmahasiswaService.UpdateIdentity(student.NamaCmahasiswa, np, newName, newNP)
			if errSync != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal sinkronisasi identitas: " + errSync.Error()})
				return
			}
			np = newNP
		}

		// 5. Save Changes to DB
		res, err := cmahasiswaService.Edit(filteredData, np, student.Atribut)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// 6. SIMPAN LOG (Snaphost sebelum & sesudah)
		// Executor diisi no_peserta target atau admin yang login (mengambil dari context jika tersedia)
		executor, _ := c.Get("no_peserta")
		execStr, ok := executor.(string)
		if !ok { execStr = np } // Fallback ke NP target jika context kosong

		now := time.Now()
		if student.NoPeserta != "" {
			cmahasiswaService.AddLog(student, execStr, &now)
		}
		cmahasiswaService.AddLog(res, execStr, &now)

		c.JSON(http.StatusOK, res)
	})
}
