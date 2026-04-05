package routes

import (
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"BackEnd-Siukat/utils"
	"net/http"
	"time"

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

		// LOGIKA DINAMIS & EFISIENSI (CLEANUP)
		utils.DeleteOldFile(student.FotoCmahasiswa)

		savedPath, errUpload := utils.HandleDynamicUpload(c, file, student.NamaCmahasiswa, np)
		if errUpload != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupload foto: " + errUpload.Error()})
			return
		}

		// Update DB
		updateData := map[string]interface{}{"foto_cmahasiswa": savedPath}
		cmahasiswaService.Edit(updateData, np, "original")

		c.JSON(http.StatusOK, gin.H{
			"message": "Foto profil berhasil diperbarui",
			"path":    savedPath,
		})
	})

}
