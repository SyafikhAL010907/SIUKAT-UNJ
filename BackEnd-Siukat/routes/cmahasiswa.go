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
	"os"
	"path/filepath"
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

		err := cmahasiswaService.UktTinggi(req.GolonganId, noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, "success")
	})

	// PUT /cmahasiswa/ukt-tinggi-tidak
	cmahasiswaGroup.PUT("/ukt-tinggi-tidak", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		
		err := cmahasiswaService.UktTinggiTidak(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
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

	// PUT /cmahasiswa/flag-klarifikasi
	// Atomic transaction: update flag original → 'sanggah_ukt' + INSERT salinan ke semua tabel dengan atribut='sanggah'
	cmahasiswaGroup.PUT("/flag-klarifikasi", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

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
			if err := tx.Create(&sanggahMhs).Error; err != nil {
				return fmt.Errorf("gagal insert copy cmahasiswa: %v", err)
			}

			// 3. INSERT copy tb_ayah dengan atribut='sanggah'
			if originalAyah.NoPeserta != "" {
				sanggahAyah := originalAyah
				sanggahAyah.IDAyah = 0
				sanggahAyah.Atribut = "sanggah"
				if err := tx.Create(&sanggahAyah).Error; err != nil {
					return fmt.Errorf("gagal insert copy ayah: %v", err)
				}
			}

			// 4. INSERT copy tb_ibu dengan atribut='sanggah'
			if originalIbu.NoPeserta != "" {
				sanggahIbu := originalIbu
				sanggahIbu.IDIbu = 0
				sanggahIbu.Atribut = "sanggah"
				if err := tx.Create(&sanggahIbu).Error; err != nil {
					return fmt.Errorf("gagal insert copy ibu: %v", err)
				}
			}

			// 5. INSERT copy tb_kendaraan dengan atribut='sanggah'
			if originalKendaraan.NoPeserta != "" {
				sanggahKendaraan := originalKendaraan
				sanggahKendaraan.IDKendaraan = 0
				sanggahKendaraan.Atribut = "sanggah"
				if err := tx.Create(&sanggahKendaraan).Error; err != nil {
					return fmt.Errorf("gagal insert copy kendaraan: %v", err)
				}
			}

			// 6. INSERT copy tb_listrik dengan atribut='sanggah'
			if originalListrik.NoPeserta != "" {
				sanggahListrik := originalListrik
				sanggahListrik.IDListrik = 0
				sanggahListrik.Atribut = "sanggah"
				if err := tx.Create(&sanggahListrik).Error; err != nil {
					return fmt.Errorf("gagal insert copy listrik: %v", err)
				}
			}

			// 7. INSERT copy tb_pendukung dengan atribut='sanggah'
			if originalPendukung.NoPeserta != "" {
				sanggahPendukung := originalPendukung
				sanggahPendukung.IDPendukung = 0
				sanggahPendukung.Atribut = "sanggah"
				if err := tx.Create(&sanggahPendukung).Error; err != nil {
					return fmt.Errorf("gagal insert copy pendukung: %v", err)
				}
			}

			// 8. INSERT copy tb_rumah dengan atribut='sanggah'
			if originalRumah.NoPeserta != "" {
				sanggahRumah := originalRumah
				sanggahRumah.IDRumah = 0
				sanggahRumah.Atribut = "sanggah"
				if err := tx.Create(&sanggahRumah).Error; err != nil {
					return fmt.Errorf("gagal insert copy rumah: %v", err)
				}
			}

			// 9. INSERT copy tb_wali dengan atribut='sanggah'
			if originalWali.NoPeserta != "" {
				sanggahWali := originalWali
				sanggahWali.IDWali = 0
				sanggahWali.Atribut = "sanggah"
				if err := tx.Create(&sanggahWali).Error; err != nil {
					return fmt.Errorf("gagal insert copy wali: %v", err)
				}
			}

			return nil
		}); err != nil {
			fmt.Printf("❌ KLARIFIKASI TRANSACTION ERROR [%s]: %v\n", np, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal proses klarifikasi: " + err.Error()})
			return
		}

		fmt.Printf("✅ KLARIFIKASI SUCCESS [%s]: Semua tabel di-copy dengan atribut='sanggah'\n", np)
		c.JSON(http.StatusOK, gin.H{"message": "Anda telah memilih klarifikasi UKT"})
	})

	// PUT /cmahasiswa/flag-klarifikasi-admin/:no_peserta
	// Endpoint khusus admin — sama persis logic-nya tapi no_peserta dari URL param bukan dari JWT mahasiswa
	cmahasiswaGroup.PUT("/flag-klarifikasi-admin/:no_peserta", func(c *gin.Context) {
		np := c.Param("no_peserta")

		// Cleanup logic: If sanggah data exists, delete it first to allow "Reset Sanggah"
		if err := config.DB.Transaction(func(tx *gorm.DB) error {
			// Delete from sub-tables first
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Ayah{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Ibu{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Wali{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Kendaraan{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Rumah{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Listrik{})
			tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.Pendukung{})
			
			// Delete main record
			return tx.Where("no_peserta = ? AND atribut = ?", np, "sanggah").Unscoped().Delete(&models.CMahasiswa{}).Error
		}); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membersihkan data sanggah lama: " + err.Error()})
			return
		}

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

		if err := config.DB.Transaction(func(tx *gorm.DB) error {
			sanggahMhs := originalMhs
			sanggahMhs.IDCmahasiswa = 0
			sanggahMhs.Atribut = "sanggah"
			sanggahMhs.Flag = "sanggah_ukt"
			sanggahMhs.NoRegistrasi = nil // Fix: Clear to avoid Unique Key conflict
			sanggahMhs.Fakultas = nil
			sanggahMhs.Prodi = nil
			sanggahMhs.Ukt = nil
			sanggahMhs.Provinsi = nil
			sanggahMhs.Kabkot = nil
			sanggahMhs.Kecamatan = nil
			if err := tx.Create(&sanggahMhs).Error; err != nil {
				return fmt.Errorf("gagal insert copy cmahasiswa: %v", err)
			}
			if originalAyah.NoPeserta != "" {
				sanggahAyah := originalAyah
				sanggahAyah.IDAyah = 0
				sanggahAyah.Atribut = "sanggah"
				if err := tx.Create(&sanggahAyah).Error; err != nil {
					return fmt.Errorf("gagal insert copy ayah: %v", err)
				}
			}
			if originalIbu.NoPeserta != "" {
				sanggahIbu := originalIbu
				sanggahIbu.IDIbu = 0
				sanggahIbu.Atribut = "sanggah"
				if err := tx.Create(&sanggahIbu).Error; err != nil {
					return fmt.Errorf("gagal insert copy ibu: %v", err)
				}
			}
			if originalKendaraan.NoPeserta != "" {
				sanggahKendaraan := originalKendaraan
				sanggahKendaraan.IDKendaraan = 0
				sanggahKendaraan.Atribut = "sanggah"
				if err := tx.Create(&sanggahKendaraan).Error; err != nil {
					return fmt.Errorf("gagal insert copy kendaraan: %v", err)
				}
			}
			if originalListrik.NoPeserta != "" {
				sanggahListrik := originalListrik
				sanggahListrik.IDListrik = 0
				sanggahListrik.Atribut = "sanggah"
				if err := tx.Create(&sanggahListrik).Error; err != nil {
					return fmt.Errorf("gagal insert copy listrik: %v", err)
				}
			}
			if originalPendukung.NoPeserta != "" {
				sanggahPendukung := originalPendukung
				sanggahPendukung.IDPendukung = 0
				sanggahPendukung.Atribut = "sanggah"
				if err := tx.Create(&sanggahPendukung).Error; err != nil {
					return fmt.Errorf("gagal insert copy pendukung: %v", err)
				}
			}
			if originalRumah.NoPeserta != "" {
				sanggahRumah := originalRumah
				sanggahRumah.IDRumah = 0
				sanggahRumah.Atribut = "sanggah"
				if err := tx.Create(&sanggahRumah).Error; err != nil {
					return fmt.Errorf("gagal insert copy rumah: %v", err)
				}
			}
			if originalWali.NoPeserta != "" {
				sanggahWali := originalWali
				sanggahWali.IDWali = 0
				sanggahWali.Atribut = "sanggah"
				if err := tx.Create(&sanggahWali).Error; err != nil {
					return fmt.Errorf("gagal insert copy wali: %v", err)
				}
			}
			return nil
		}); err != nil {
			fmt.Printf("❌ KLARIFIKASI ADMIN ERROR [%s]: %v\n", np, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal proses klarifikasi: " + err.Error()})
			return
		}

		fmt.Printf("✅ KLARIFIKASI ADMIN SUCCESS [%s]: Copy row sanggah berhasil\n", np)
		c.JSON(http.StatusOK, gin.H{"message": "Klarifikasi berhasil diproses oleh admin"})
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

		student, err := cmahasiswaService.GetCmahasiswa(np)
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
		savedPath, errUpload := utils.HandleDynamicUpload(c, file, student.NamaCmahasiswa, np, filename)
		if errUpload != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupload foto: " + errUpload.Error()})
			return
		}

		// Update DB menggunakan atribut asli dari record student (original/sanggah)
		updateData := map[string]interface{}{"foto_cmahasiswa": savedPath}
		cmahasiswaService.Edit(updateData, np, student.Atribut)

		c.JSON(http.StatusOK, gin.H{
			"message": "Foto profil berhasil diperbarui",
			"path":    savedPath,
		})
	})

	// PUT /cmahasiswa/edit (Parity dengan Node.js biodata update + Upload Foto)
	cmahasiswaGroup.PUT("/edit", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		student, err := cmahasiswaService.GetCmahasiswa(np)
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
					savedPath, errUpload := utils.HandleDynamicUpload(c, fileHeader, student.NamaCmahasiswa, np, filename)
					if errUpload == nil {
						updateData["foto_cmahasiswa"] = savedPath
					} else {
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

		// LOGIKA SINKRONISASI IDENTITAS & FOLDER (Request USER)
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

		c.JSON(http.StatusOK, res)
	})

	// PUT /cmahasiswa/edit/:no_peserta (Admin usage) - Updated to support uploads & identity sync
	cmahasiswaGroup.PUT("/edit/:no_peserta", func(c *gin.Context) {
		np := c.Param("no_peserta")
		
		var student models.CMahasiswa
		if err := config.DB.Where("no_peserta = ?", np).First(&student).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
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

		// 2. Handle File Upload (Pas Foto)
		files := form.File["file_foto_cmahasiswa"]
		if len(files) > 0 {
			file := files[0]
			// Path destination: uploads/Nama_NoPeserta/Profile_Nama_NoPeserta.ext
			folderName := fmt.Sprintf("%s_%s", utils.SanitizeString(student.NamaCmahasiswa), student.NoPeserta)
			uploadDir := filepath.Join("uploads", folderName)
			os.MkdirAll(uploadDir, os.ModePerm)

			ext := filepath.Ext(file.Filename)
			fileName := fmt.Sprintf("Profile_%s_%s%s", utils.SanitizeString(student.NamaCmahasiswa), student.NoPeserta, ext)
			filePath := filepath.Join(uploadDir, fileName)

			if err := c.SaveUploadedFile(file, filePath); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan foto: " + err.Error()})
				return
			}
			// DB path use forward slash for URL compatibility
			updateData["foto_cmahasiswa"] = filepath.ToSlash(filePath)
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

		c.JSON(http.StatusOK, res)
	})
}
