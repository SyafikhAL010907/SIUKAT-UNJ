
package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"errors"
	"strings"
	"time"

	"gorm.io/gorm"
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

	// 1. Normalisasi: Jika status 'tidak', bersihkan field wilayah agar Preload tidak crash
	if status, ok := data["status_wali"].(string); ok && status == "tidak" {
		data["nama_wali"] = "-"
		data["alamat_wali"] = "-"
		data["provinsi_wali"] = ""  // String kosong lebih aman daripada "-"
		data["kabkot_wali"] = ""
		data["kecamatan_wali"] = ""
		data["kesanggupan_wali"] = 0
	}

	// 2. Cek keberadaan record
	err := db.Where("no_peserta = ? AND LOWER(atribut) = ?", noPeserta, strings.ToLower(atribut)).First(&wali).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			data["no_peserta"] = noPeserta
			data["atribut"] = strings.ToLower(atribut)
			if errCreate := db.Model(&models.Wali{}).Create(data).Error; errCreate != nil {
				return models.Wali{}, errCreate
			}
		} else {
			return models.Wali{}, err
		}
	} else {
		// 3. Update data yang sudah ada
		if errUpdate := db.Model(&wali).Updates(data).Error; errUpdate != nil {
			return models.Wali{}, errUpdate
		}
	}

	// 4. Fetch ulang dengan Preload Selektif
	// Kita ambil data mentahnya dulu
	finalQuery := db.Where("no_peserta = ? AND LOWER(atribut) = ?", noPeserta, strings.ToLower(atribut))
	finalQuery.First(&wali)

	// Hanya lakukan Preload jika ProvinsiWali berisi karakter yang bukan "-" atau kosong
	if wali.ProvinsiWali != "" && wali.ProvinsiWali != "-" {
		db.Model(&wali).
			Preload("Provinsi").
			Preload("Kabkot").
			Preload("Kecamatan").
			First(&wali)
	}

	return wali, nil
}

func (s *WaliService) GetByLoggedIn(noPeserta string) (models.Wali, error) {
	db := config.DB
	var res models.Wali

	// Coba cari data sanggah dulu
	err := db.Where("no_peserta = ? AND LOWER(atribut) = ?", noPeserta, "sanggah").First(&res).Error
	
	// Jika tidak ada sanggah, cari yang original
	if err != nil {
		err = db.Where("no_peserta = ? AND LOWER(atribut) = ?", noPeserta, "original").First(&res).Error
	}

	// Jika data ditemukan sama sekali (sanggah atau original)
	if err == nil {
		// Lakukan preload hanya jika datanya valid (bukan tanda strip)
		if res.ProvinsiWali != "" && res.ProvinsiWali != "-" {
			db.Model(&res).Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").First(&res)
		}
		return res, nil
	}

	// Fallback jika benar-benar tidak ada data di DB
	return models.Wali{NoPeserta: noPeserta, StatusWali: "tidak"}, nil
}

func (s *WaliService) CheckData(noPeserta string, uktTinggi string) (bool, error) {
	var wali models.Wali
	if err := config.DB.Where("no_peserta = ?", noPeserta).First(&wali).Error; err != nil {
		return false, err
	}

	// Gunakan map untuk validasi field wajib
	dataCheck := map[string]interface{}{
		"status_wali":    wali.StatusWali,
		"nama_wali":      wali.NamaWali,
		"alamat_wali":    wali.AlamatWali,
		"provinsi_wali":  wali.ProvinsiWali,
		"kabkot_wali":    wali.KabkotWali,
		"kecamatan_wali": wali.KecamatanWali,
	}

	if wali.StatusWali == "tidak" {
		// Jika tidak ada wali, yang wajib hanya status dan tanda strip di nama
		return wali.NamaWali != "", nil
	}

	// Jika UKT tidak tinggi, wajib isi kesanggupan dan scan
	if uktTinggi != "ya" {
		dataCheck["kesanggupan_wali"] = wali.KesanggupanWali
		dataCheck["scan_wali"] = wali.ScanWali
	}

	for _, val := range dataCheck {
		if val == nil || val == "" || val == 0 || val == "-" {
			return false, nil
		}
	}

	return true, nil
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