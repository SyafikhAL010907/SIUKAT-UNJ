package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"time"
)

type IbuService struct{}

// Add — parity dengan ibu.prototype.add di Node.js
func (s *IbuService) Add(req models.Ibu, atribut string) (models.Ibu, error) {
	db := config.DB
	req.Atribut = atribut
	err := db.Create(&req).Error
	return req, err
}

func (s *IbuService) Edit(data map[string]interface{}, noPeserta string, atribut string) (models.Ibu, error) {
	db := config.DB
	var ibu models.Ibu

	// SURGICAL FIX: Use Count instead of First to avoid "Scan error" on corrupted existing data
	var count int64
	db.Model(&models.Ibu{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Count(&count)

	if count == 0 {
		// 1. Jika BELUM ADA, maka Create
		data["no_peserta"] = noPeserta
		data["atribut"] = atribut
		if errCreate := db.Model(&models.Ibu{}).Create(data).Error; errCreate != nil {
			return models.Ibu{}, errCreate
		}
	} else {
		// 2. Jika SUDAH ADA, maka Update menggunakan Table/Where (aman dari Scan error)
		if errUpdate := db.Table("tb_ibu").Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; errUpdate != nil {
			return models.Ibu{}, errUpdate
		}
	}

	// 3. Ambil data terbaru untuk return
	err := db.Preload("Pekerjaan").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&ibu).Error
	return ibu, err
}

// AddLog — Fix #4: Implementasi fungsi AddLog yang hilang
// Parity dengan ibu.prototype.addLog di Node.js
func (s *IbuService) AddLog(user models.Ibu, atribut string, executor string, timestamp *time.Time) error {
	db := config.DB
	logIbu := models.LogIbu{
		NoPeserta:       user.NoPeserta,
		StatusIbu:       user.StatusIbu,
		NamaIbu:         user.NamaIbu,
		NikIbu:          user.NikIbu,
		TeleponIbu:      user.TeleponIbu,
		AlamatIbu:       user.AlamatIbu,
		ProvinsiIbu:     user.ProvinsiIbu,
		KabkotIbu:       user.KabkotIbu,
		KecamatanIbu:    user.KecamatanIbu,
		PekerjaanIbu:    user.PekerjaanIbu,
		PenghasilanIbu:  user.PenghasilanIbu,
		SampinganIbu:    user.SampinganIbu,
		ScanKtpIbu:      user.ScanKtpIbu,
		ScanSlipIbu:     user.ScanSlipIbu,
		TempatLahirIbu:  user.TempatLahirIbu,
		TanggalLahirIbu: user.TanggalLahirIbu,
		Atribut:         atribut,
		Executor:        executor,
		Timestamp:       timestamp,
	}
	return db.Create(&logIbu).Error
}

// GetByLoggedIn — parity dengan ibu.prototype.getByLoggedIn di Node.js
func (s *IbuService) GetByLoggedIn(noPeserta string) (models.Ibu, error) {
	db := config.DB
	var ibu models.Ibu

	// ROBUST FETCH: Use the same strategy as AyahService
	// 1. PRIORITAS: Cek data 'sanggah' dulu dengan relasi lengkap
	err := db.Preload("Pekerjaan").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&ibu).Error
	
	if err == nil {
		return ibu, nil
	}

	// 2. FALLBACK: Jika tidak ada sanggah, ambil data 'original' dengan relasi lengkap
	err = db.Preload("Pekerjaan").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&ibu).Error
	
	if err != nil {
		return models.Ibu{NoPeserta: noPeserta}, nil
	}

	return ibu, nil
}

// CheckData — parity dengan ibu.prototype.checkData di Node.js
func (s *IbuService) CheckData(noPeserta string, uktTinggi string) (bool, error) {
	db := config.DB
	var ibu models.Ibu
	if err := db.Where("no_peserta = ?", noPeserta).First(&ibu).Error; err != nil {
		return false, err
	}

	// Replicating Node.js "delete and check" logic using a map
	data := map[string]interface{}{
		"no_peserta":         ibu.NoPeserta,
		"status_ibu":       ibu.StatusIbu,
		"nama_ibu":         ibu.NamaIbu,
		"nik_ibu":          ibu.NikIbu,
		"telepon_ibu":      ibu.TeleponIbu,
		"alamat_ibu":       ibu.AlamatIbu,
		"provinsi_ibu":     ibu.ProvinsiIbu,
		"kabkot_ibu":       ibu.KabkotIbu,
		"kecamatan_ibu":    ibu.KecamatanIbu,
		"pekerjaan_ibu":    ibu.PekerjaanIbu,
		"penghasilan_ibu":  ibu.PenghasilanIbu,
		"sampingan_ibu":    ibu.SampinganIbu,
		"scan_ktp_ibu":     ibu.ScanKtpIbu,
		"scan_slip_ibu":    ibu.ScanSlipIbu,
		"tempat_lahir_ibu": ibu.TempatLahirIbu,
		"tanggal_lahir_ibu": ibu.TanggalLahirIbu,
		"atribut":           ibu.Atribut,
	}

	if ibu.StatusIbu == "wafat" {
		// Only name is required
		return ibu.NamaIbu != "", nil
	}

	if uktTinggi == "ya" {
		delete(data, "nik_ibu")
		delete(data, "pekerjaan_ibu")
		delete(data, "penghasilan_ibu")
		delete(data, "scan_ktp_ibu")
		delete(data, "scan_slip_ibu")
	}

	if ibu.PekerjaanIbu == "11" { // Tidak bekerja
		delete(data, "penghasilan_ibu")
	}

	delete(data, "sampingan_ibu")

	for _, val := range data {
		if val == nil || val == "" || val == 0 {
			return false, nil
		}
	}

	return true, nil
}
