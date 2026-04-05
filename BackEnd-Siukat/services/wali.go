package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"time"
)

type WaliService struct{}

func (s *WaliService) Add(req models.Wali, atribut string) (models.Wali, error) {
	req.Atribut = atribut
	err := config.DB.Create(&req).Error
	return req, err
}

func (s *WaliService) Edit(data map[string]interface{}, noPeserta string, atribut string) (models.Wali, error) {
	if err := config.DB.Model(&models.Wali{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Wali{}, err
	}
	var res models.Wali
	config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&res)
	return res, nil
}

func (s *WaliService) GetByLoggedIn(noPeserta string) (models.Wali, error) {
	var res models.Wali
	
	// 1. Fetch main record without preloads first
	if err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error; err != nil {
		// Return empty object if not found
		return models.Wali{NoPeserta: noPeserta}, nil
	}

	// 2. Separately try to load associations
	_ = config.DB.Model(&res).Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").First(&res).Error

	return res, nil
}

func (s *WaliService) AddLog(user models.Wali, atribut string, executor string, timestamp *time.Time) error {
	logWali := models.LogWali{
		NoPeserta:       user.NoPeserta,
		StatusWali:      user.StatusWali,
		NamaWali:        user.NamaWali,
		AlamatWali:      user.AlamatWali,
		ProvinsiWali:    user.ProvinsiWali,
		KabkotWali:      user.KabkotWali,
		KecamatanWali:   user.KecamatanWali,
		KesanggupanWali: user.KesanggupanWali,
		ScanWali:        user.ScanWali,
		Atribut:         atribut,
		Executor:        executor,
		Timestamp:       timestamp,
	}
	return config.DB.Create(&logWali).Error
}

func (s *WaliService) CheckData(noPeserta string, uktTinggi string) (bool, error) {
	var wali models.Wali
	if err := config.DB.Where("no_peserta = ?", noPeserta).First(&wali).Error; err != nil {
		return false, err
	}

	// Replicating Node.js "delete and check" logic using a map
	data := map[string]interface{}{
		"no_peserta":       wali.NoPeserta,
		"status_wali":      wali.StatusWali,
		"nama_wali":        wali.NamaWali,
		"alamat_wali":      wali.AlamatWali,
		"provinsi_wali":    wali.ProvinsiWali,
		"kabkot_wali":      wali.KabkotWali,
		"kecamatan_wali":   wali.KecamatanWali,
		"kesanggupan_wali": wali.KesanggupanWali,
		"scan_wali":        wali.ScanWali,
		"atribut":          wali.Atribut,
	}

	if wali.StatusWali == "tidak" {
		delete(data, "nama_wali")
		delete(data, "alamat_wali")
		delete(data, "kesanggupan_wali")
		delete(data, "scan_wali")
		delete(data, "provinsi_wali")
		delete(data, "kabkot_wali")
		delete(data, "kecamatan_wali")
	}

	if uktTinggi == "ya" {
		delete(data, "kesanggupan_wali")
		delete(data, "scan_wali")
	}

	for _, val := range data {
		if val == nil || val == "" || val == 0 || val == "0" {
			return false, nil
		}
	}

	return true, nil
}
