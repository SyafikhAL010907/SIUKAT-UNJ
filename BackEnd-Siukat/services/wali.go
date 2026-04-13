package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"errors"
	"gorm.io/gorm"
	"time"
)

type WaliService struct{}

func (s *WaliService) Add(req models.Wali, atribut string) (models.Wali, error) {
	req.Atribut = atribut
	err := config.DB.Create(&req).Error
	return req, err
}

func (s *WaliService) Edit(data map[string]interface{}, noPeserta string, atribut string) (models.Wali, error) {
	db := config.DB
	var wali models.Wali

	// 1. Cek apakah record sudah ada
	err := db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&wali).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 2. Jika BELUM ADA, maka Create (UPSERT)
			data["no_peserta"] = noPeserta
			data["atribut"] = atribut
			if errCreate := db.Model(&models.Wali{}).Create(data).Error; errCreate != nil {
				return models.Wali{}, errCreate
			}
		} else {
			return models.Wali{}, err
		}
	} else {
		// 3. Jika SUDAH ADA, maka Update
		if errUpdate := db.Model(&wali).Updates(data).Error; errUpdate != nil {
			return models.Wali{}, errUpdate
		}
	}

	// 4. Ambil data terbaru untuk return
	db.Preload("Pekerjaan").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&wali)
	return wali, nil
}

func (s *WaliService) GetByLoggedIn(noPeserta string) (models.Wali, error) {
	db := config.DB
	var res models.Wali
	
	// 1. PRIORITAS: Cek data 'sanggah' dulu
	err := db.Preload("Pekerjaan").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&res).Error
	
	if err == nil {
		return res, nil
	}

	// 2. FALLBACK: Jika tidak ada sanggah, ambil data 'original'
	err = db.Preload("Pekerjaan").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&res).Error
	
	if err != nil {
		return models.Wali{NoPeserta: noPeserta}, nil
	}

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
		PekerjaanWali:   user.PekerjaanWali,
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
		// Tetap butuh 'nama_wali' (diisi otomatis '-' oleh Backend) biar centang gak muncul di awal
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
