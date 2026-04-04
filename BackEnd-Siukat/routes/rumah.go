package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/services"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func RumahRoutes(r *gin.RouterGroup) {
	group := r.Group("/rumah")
	srv := services.RumahService{}

	group.GET("/all", func(c *gin.Context) {
		var ms []models.Rumah
		config.DB.Find(&ms)
		c.JSON(http.StatusOK, ms)
	})

	authGroup := group.Group("/")
	authGroup.Use(middlewares.JwtAuth())

	authGroup.POST("/add", func(c *gin.Context) {
		var req models.Rumah
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		res, err := srv.Add(req, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	authGroup.PUT("/edit", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		np := noPeserta.(string)

		req := models.Rumah{
			StatusKepemilikan: c.PostForm("status_kepemilikan"),
		}

		switch req.StatusKepemilikan {
		case "milik_sendiri":
			req.LuasTanah = c.PostForm("luas_tanah")
			req.LuasBangunan = c.PostForm("luas_bangunan")
			req.StatusSertifikat = c.PostForm("status_sertifikat")
			if b, err := strconv.Atoi(c.PostForm("biaya_pbb")); err == nil {
				req.BiayaPbb = b
			}
			filePbb, errPbb := c.FormFile("file_scan_pbb")
			if errPbb == nil {
				filename := np + "_pbb_" + filePbb.Filename
				c.SaveUploadedFile(filePbb, "public/uploads/"+filename)
				req.ScanPbb = filename
			}
		case "bersama_saudara":
			req.LuasTanah = c.PostForm("luas_tanah")
			req.LuasBangunan = c.PostForm("luas_bangunan")
			if b, err := strconv.Atoi(c.PostForm("biaya_pbb")); err == nil {
				req.BiayaPbb = b
			}
			if jkk, err := strconv.Atoi(c.PostForm("jumlah_kepala_keluarga")); err == nil {
				req.JumlahKepalaKeluarga = jkk
			}
			filePbb, errPbb := c.FormFile("file_scan_pbb")
			if errPbb == nil {
				filename := np + "_pbb_" + filePbb.Filename
				c.SaveUploadedFile(filePbb, "public/uploads/"+filename)
				req.ScanPbb = filename
			}
		case "kontrak":
			if bk, err := strconv.Atoi(c.PostForm("biaya_kontrak")); err == nil {
				req.BiayaKontrak = bk
			}
			fileKtr, errKtr := c.FormFile("file_scan_kontrak")
			if errKtr == nil {
				filename := np + "_kontrak_" + fileKtr.Filename
				c.SaveUploadedFile(fileKtr, "public/uploads/"+filename)
				req.ScanKontrak = filename
			}
		}

		var existing models.Rumah
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "original").First(&existing)
		now := time.Now()
		srv.AddLog(existing, "original", np, &now)

		res, err := srv.Edit(req, np, existing, "original")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	authGroup.PUT("/edit/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		np := noPeserta

		req := models.Rumah{
			StatusKepemilikan: c.PostForm("status_kepemilikan"),
		}

		switch req.StatusKepemilikan {
		case "milik_sendiri":
			req.LuasTanah = c.PostForm("luas_tanah")
			req.LuasBangunan = c.PostForm("luas_bangunan")
			req.StatusSertifikat = c.PostForm("status_sertifikat")
			if b, err := strconv.Atoi(c.PostForm("biaya_pbb")); err == nil {
				req.BiayaPbb = b
			}
			filePbb, errPbb := c.FormFile("file_scan_pbb")
			if errPbb == nil {
				filename := np + "_pbb_" + filePbb.Filename
				c.SaveUploadedFile(filePbb, "public/uploads/"+filename)
				req.ScanPbb = filename
			}
		case "bersama_saudara":
			req.LuasTanah = c.PostForm("luas_tanah")
			req.LuasBangunan = c.PostForm("luas_bangunan")
			if b, err := strconv.Atoi(c.PostForm("biaya_pbb")); err == nil {
				req.BiayaPbb = b
			}
			if jkk, err := strconv.Atoi(c.PostForm("jumlah_kepala_keluarga")); err == nil {
				req.JumlahKepalaKeluarga = jkk
			}
			filePbb, errPbb := c.FormFile("file_scan_pbb")
			if errPbb == nil {
				filename := np + "_pbb_" + filePbb.Filename
				c.SaveUploadedFile(filePbb, "public/uploads/"+filename)
				req.ScanPbb = filename
			}
		case "kontrak":
			if bk, err := strconv.Atoi(c.PostForm("biaya_kontrak")); err == nil {
				req.BiayaKontrak = bk
			}
			fileKtr, errKtr := c.FormFile("file_scan_kontrak")
			if errKtr == nil {
				filename := np + "_kontrak_" + fileKtr.Filename
				c.SaveUploadedFile(fileKtr, "public/uploads/"+filename)
				req.ScanKontrak = filename
			}
		}

		var existing models.Rumah
		config.DB.Where("no_peserta = ? AND atribut = ?", np, "sanggah").First(&existing)
		now := time.Now()
		srv.AddLog(existing, "sanggah", np, &now)

		res, err := srv.Edit(req, np, existing, "sanggah")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	authGroup.GET("/get-rumah", func(c *gin.Context) {
		noPeserta, _ := c.Get("no_peserta")
		res, err := srv.GetByLoggedIn(noPeserta.(string))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, res)
	})

	group.GET("/get-rumah/:no_peserta", func(c *gin.Context) {
		noPeserta := c.Param("no_peserta")
		var model models.Rumah
		err := config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&model).Error
		if err != nil {
			err = config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&model).Error
		}
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"msg": "data tidak ditemukan"})
			return
		}
		c.JSON(http.StatusOK, model)
	})
}
