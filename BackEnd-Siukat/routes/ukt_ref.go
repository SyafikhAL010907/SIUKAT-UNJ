package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UktRefRoutes(r *gin.RouterGroup) {
	group := r.Group("/admin/ukt-ref")
	group.Use(middlewares.JwtAuth())

	// Datatable Endpoint (Sekaligus Filter Fakultas & Get Nama Prodi)
	group.POST("/datatable", func(c *gin.Context) {
		type dtReq struct {
			Page     int    `json:"page"`
			PerPage  int    `json:"perPage"`
			Keyword  string `json:"keyword"`
			KodeFak  string `json:"kode_fak"`
		}
		var req dtReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, err)
			return
		}

		type Result struct {
			IDUkt         int    `json:"id_ukt"`
			MajorID       string `json:"major_id"`
			NamaProdi     string `json:"nama_prodi"`
			KodeFak       int    `json:"kode_fak"`
			I             int    `json:"I"`
			II            int    `json:"II"`
			III           int    `json:"III"`
			IV            int    `json:"IV"`
			V             int    `json:"V"`
			VI            int    `json:"VI"`
			VII           int    `json:"VII"`
			VIII          int    `json:"VIII"`
			Bm            int    `json:"bm"`
			Internasional int    `json:"internasional"`
			Status        string `json:"status"`
			Degree        string `json:"degree"`
		}

		var results []Result
		var count int64

		tx := config.DB.Begin()

		// Join table ref_ukt dan ref_prodi untuk ambil nama prodi (Pakai LEFT JOIN biar semua 91 data muncul)
		query := tx.Table("ref_ukt AS u").
			Select("u.id_ukt, u.major_id, p.nama as nama_prodi, p.kode_fak, u.I, u.II, u.III, u.IV, u.V, u.VI, u.VII, u.VIII, u.bm, u.internasional, u.status, u.degree").
			Joins("LEFT JOIN ref_prodi AS p ON u.major_id = p.kode")

		// Filter by Fakultas jika ada (kalau "" berarti ALL)
		if req.KodeFak != "" {
			query = query.Where("p.kode_fak = ?", req.KodeFak)
		}

		// Pencarian by Nama Prodi
		if req.Keyword != "" {
			query = query.Where("p.nama LIKE ?", "%"+req.Keyword+"%")
		}

		if err := query.Count(&count).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghitung data"})
			return
		}

		if err := query.Limit(req.PerPage).Offset((req.Page - 1) * req.PerPage).Find(&results).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
			return
		}

		tx.Commit()

		c.JSON(http.StatusOK, gin.H{
			"count":       count,
			"rows":        results,
			"currentPage": req.Page,
			"perPage":     req.PerPage,
			"keyword":     req.Keyword,
			"kode_fak":    req.KodeFak,
		})
	})

	// Get data satuan untuk PopUp Edit (Termasuk Nama Prodi)
	group.GET("/:id_ukt", func(c *gin.Context) {
		idUkt := c.Param("id_ukt")
		
		type Result struct {
			models.Ukt
			NamaProdi string `json:"nama_prodi"`
		}
		
		var res Result
		err := config.DB.Table("ref_ukt AS u").
			Select("u.*, p.nama as nama_prodi").
			Joins("LEFT JOIN ref_prodi AS p ON u.major_id = p.kode").
			Where("u.id_ukt = ?", idUkt).
			First(&res).Error

		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data UKT tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	// Insert (Prodi Baru) & Update (Harga Golongan)
	group.POST("/save", func(c *gin.Context) {
		type saveReq struct {
			models.Ukt
			NamaProdi string `json:"nama_prodi"`
			KodeFak   int    `json:"kode_fak"`
		}
		var req saveReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		tx := config.DB.Begin()

		// Jika proses INSERT (Tambah Prodi Baru) -> Pastikan Prodi ada di ref_prodi
		if req.IDUkt == 0 {
			var p models.Prodi
			err := tx.Where("kode = ?", req.MajorID).First(&p).Error
			if err != nil {
				// Prodi belum ada, buat baru di ref_prodi
				newProdi := models.Prodi{
					Kode:     req.MajorID,
					Nama:     req.NamaProdi,
					Jenjang:  req.Degree,
					KodeFak:  req.KodeFak,
					Jalur:    2, // Default jalur
				}
				if err := tx.Create(&newProdi).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat Master Prodi baru: " + err.Error()})
					return
				}
			}

			// Inisialisasi default buat UKT baru
			req.Entrance = 2
			req.Semester = 107
			if req.Status == "" { req.Status = "aktif" }
			if req.Degree == "" { req.Degree = "S1" }

			if err := tx.Create(&req.Ukt).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan tarif UKT baru: " + err.Error()})
				return
			}
		} else {
			// Jika ada ID -> PROSES UPDATE HORIZONTAL (Edit Harga)
			if err := tx.Model(&models.Ukt{}).Where("id_ukt = ?", req.IDUkt).Updates(req.Ukt).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui tarif UKT: " + err.Error()})
				return
			}
		}

		tx.Commit()
		c.JSON(http.StatusOK, "Data berhasil disimpan!")
	})
}
