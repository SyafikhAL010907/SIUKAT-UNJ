package routes

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/middlewares"
	"BackEnd-Siukat/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminRoutes(r *gin.RouterGroup) {
	group := r.Group("/admin")
	auth := group.Group("/")
	auth.Use(middlewares.JwtAuth())

	auth.POST("/datatable", func(c *gin.Context) {
		type dtReq struct {
			Page    int    `json:"page"`
			PerPage int    `json:"perPage"`
			Keyword string `json:"keyword"`
		}
		var req dtReq
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, err)
			return
		}

		var admins []models.Admin
		var count int64

		tx := config.DB.Begin()

		query := tx.Model(&models.Admin{})
		if req.Keyword != "" {
			query = query.Where("username LIKE ? OR nama_lengkap LIKE ?", req.Keyword+"%", "%"+req.Keyword+"%")
		}

		if err := query.Count(&count).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, "Error: RollBack")
			return
		}

		if err := query.Limit(req.PerPage).Offset((req.Page - 1) * req.PerPage).Find(&admins).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, "Error: RollBack")
			return
		}

		tx.Commit()

		c.JSON(http.StatusOK, gin.H{
			"count":       count,
			"rows":        admins,
			"currentPage": req.Page,
			"perPage":     req.PerPage,
			"keyword":     req.Keyword,
		})
	})

	auth.GET("/username/:username", func(c *gin.Context) {
		username := c.Param("username")
		var admin models.Admin
		
		tx := config.DB.Begin()
		if err := tx.Where("username = ?", username).First(&admin).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		tx.Commit()
		
		c.JSON(http.StatusOK, admin)
	})

	group.POST("/save", func(c *gin.Context) {
		type ReqSave struct {
			UsernameLama string `json:"username_lama"`
			Username     string `json:"username"`
			NamaLengkap  string `json:"nama_lengkap"`
			NoTelepon    string `json:"no_telepon"`
			Role         string `json:"role"`
		}
		var req ReqSave
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, err)
			return
		}

		tx := config.DB.Begin()

		var existing models.Admin
		err := tx.Where("username = ?", req.UsernameLama).First(&existing).Error
		
		if err == nil {
			// update
			if updateErr := tx.Model(&existing).Where("username = ?", req.UsernameLama).Updates(models.Admin{
				Username:    req.Username,
				NamaLengkap: req.NamaLengkap,
				NoTelepon:   req.NoTelepon,
				Role:        req.Role,
			}).Error; updateErr != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, "Gagal memasukkan data!")
				return
			}
		} else {
			// create
			if createErr := tx.Create(&models.Admin{
				Username:    req.Username,
				NamaLengkap: req.NamaLengkap,
				NoTelepon:   req.NoTelepon,
				Role:        req.Role,
			}).Error; createErr != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, "Gagal memasukkan data!")
				return
			}
		}

		tx.Commit()
		c.JSON(http.StatusOK, "Data telah dimasukkan!")
	})

	auth.DELETE("/delete/:username", func(c *gin.Context) {
		username := c.Param("username")
		tx := config.DB.Begin()
		if err := tx.Where("username = ?", username).Delete(&models.Admin{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, err)
			return
		}
		tx.Commit()
		c.JSON(http.StatusOK, "Data telah dihapus!")
	})
}
