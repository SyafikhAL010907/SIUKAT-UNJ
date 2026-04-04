package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"time"
)

type RumahService struct{}

func (s *RumahService) Add(req models.Rumah, atribut string) (models.Rumah, error) {
	db := config.DB
	req.Atribut = atribut
	err := db.Create(&req).Error
	return req, err
}

func (s *RumahService) Edit(req models.Rumah, noPeserta string, existing models.Rumah, atribut string) (models.Rumah, error) {
	data := map[string]interface{}{}

	switch req.StatusKepemilikan {
	case "milik_sendiri":
		data["status_kepemilikan"] = req.StatusKepemilikan
		data["luas_tanah"] = req.LuasTanah
		data["luas_bangunan"] = req.LuasBangunan
		data["status_sertifikat"] = req.StatusSertifikat
		data["biaya_pbb"] = req.BiayaPbb
		if req.ScanPbb != "" {
			data["scan_pbb"] = req.ScanPbb
		} else {
			data["scan_pbb"] = existing.ScanPbb
		}
		data["biaya_kontrak"] = 0
		data["scan_kontrak"] = ""
		data["jumlah_kepala_keluarga"] = 1
	case "bersama_saudara":
		data["status_kepemilikan"] = req.StatusKepemilikan
		data["luas_tanah"] = req.LuasTanah
		data["luas_bangunan"] = req.LuasBangunan
		data["status_sertifikat"] = ""
		data["biaya_pbb"] = req.BiayaPbb
		if req.ScanPbb != "" {
			data["scan_pbb"] = req.ScanPbb
		} else {
			data["scan_pbb"] = existing.ScanPbb
		}
		data["biaya_kontrak"] = 0
		data["scan_kontrak"] = ""
		data["jumlah_kepala_keluarga"] = req.JumlahKepalaKeluarga
	case "kontrak":
		data["status_kepemilikan"] = req.StatusKepemilikan
		data["luas_tanah"] = ""
		data["luas_bangunan"] = ""
		data["status_sertifikat"] = ""
		data["biaya_pbb"] = 0
		data["scan_pbb"] = ""
		data["biaya_kontrak"] = req.BiayaKontrak
		if req.ScanKontrak != "" {
			data["scan_kontrak"] = req.ScanKontrak
		} else {
			data["scan_kontrak"] = existing.ScanKontrak
		}
		data["jumlah_kepala_keluarga"] = 1
	default: // menumpang / lainnya
		data["status_kepemilikan"] = req.StatusKepemilikan
		data["luas_tanah"] = ""
		data["luas_bangunan"] = ""
		data["status_sertifikat"] = ""
		data["biaya_pbb"] = 0
		data["scan_pbb"] = ""
		data["biaya_kontrak"] = 0
		data["scan_kontrak"] = ""
		data["jumlah_kepala_keluarga"] = 1
	}

	if err := config.DB.Model(&models.Rumah{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Rumah{}, err
	}
	var rumah models.Rumah
	config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&rumah)
	return rumah, nil
}

func (s *RumahService) AddLog(user models.Rumah, atribut string, executor string, timestamp *time.Time) error {
	logRmh := models.LogRumah{
		NoPeserta:            user.NoPeserta,
		StatusKepemilikan:    user.StatusKepemilikan,
		LuasTanah:            user.LuasTanah,
		LuasBangunan:         user.LuasBangunan,
		StatusSertifikat:     user.StatusSertifikat,
		BiayaPbb:             user.BiayaPbb,
		ScanPbb:              user.ScanPbb,
		BiayaKontrak:         user.BiayaKontrak,
		ScanKontrak:          user.ScanKontrak,
		JumlahKepalaKeluarga: user.JumlahKepalaKeluarga,
		Atribut:              atribut,
		Executor:             executor,
		Timestamp:            timestamp,
	}
	return config.DB.Create(&logRmh).Error
}

func (s *RumahService) CheckData(noPeserta string) (bool, error) {
	var res models.Rumah
	if err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error; err != nil {
		return false, err
	}

	// Replicating Node.js "delete and check" logic using a map
	data := map[string]interface{}{
		"no_peserta":           res.NoPeserta,
		"status_kepemilikan":    res.StatusKepemilikan,
		"luas_tanah":            res.LuasTanah,
		"luas_bangunan":         res.LuasBangunan,
		"status_sertifikat":     res.StatusSertifikat,
		"biaya_pbb":             res.BiayaPbb,
		"scan_pbb":              res.ScanPbb,
		"biaya_kontrak":         res.BiayaKontrak,
		"scan_kontrak":          res.ScanKontrak,
		"jumlah_kepala_keluarga": res.JumlahKepalaKeluarga,
		"atribut":              res.Atribut,
	}

	switch res.StatusKepemilikan {
	case "milik_sendiri":
		delete(data, "biaya_kontrak")
		delete(data, "scan_kontrak")
	case "bersama_saudara":
		delete(data, "status_sertifikat")
		delete(data, "biaya_kontrak")
		delete(data, "scan_kontrak")
	case "menumpang":
		delete(data, "luas_tanah")
		delete(data, "luas_bangunan")
		delete(data, "status_sertifikat")
		delete(data, "biaya_pbb")
		delete(data, "scan_pbb")
		delete(data, "jumlah_kepala_keluarga")
		delete(data, "biaya_kontrak")
		delete(data, "scan_kontrak")
	case "kontrak":
		delete(data, "luas_tanah")
		delete(data, "luas_bangunan")
		delete(data, "status_sertifikat")
		delete(data, "biaya_pbb")
		delete(data, "scan_pbb")
	}

	for _, val := range data {
		if val == nil || val == "" || val == 0 || val == "0" {
			return false, nil
		}
	}

	return true, nil
}

func (s *RumahService) GetByLoggedIn(noPeserta string) (models.Rumah, error) {
	db := config.DB
	var rumah models.Rumah
	err := db.Where("no_peserta = ?", noPeserta).First(&rumah).Error
	return rumah, err
}
