package routes

import (
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"BackEnd-Siukat/utils"
	"mime/multipart"
	"net/http"
	"time"
	"fmt"
	"BackEnd-Siukat/config"

	"github.com/gin-gonic/gin"
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
	cmahasiswaGroup.PUT("/flag-klarifikasi", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")

		err := cmahasiswaService.FlagKlarifikasi(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, "Anda telah memilih klarifikasi UKT")
	})

	// GET /cmahasiswa/flag-batal-klarifikasi/:no_peserta
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
			"no_peserta":              true, // Ditambahkan agar bisa diubah
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
			"no_registrasi":          true,
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

	// PUT /cmahasiswa/edit/:no_peserta (Admin usage)
	cmahasiswaGroup.PUT("/edit/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		
		var student models.CMahasiswa
		if err := config.DB.Where("no_peserta = ?", noPeserta).First(&student).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Student not found"})
			return
		}

		var updateData map[string]interface{}
		if err := c.ShouldBindJSON(&updateData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON mapping"})
			return
		}

		// Edit student data using the same service logic
		res, err := cmahasiswaService.Edit(updateData, noPeserta, student.Atribut)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, res)
	})
}
