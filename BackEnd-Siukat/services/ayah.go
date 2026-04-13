package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"time"
)

type AyahService struct{}

func (s *AyahService) Add(req models.Ayah, atribut string) (models.Ayah, error) {
	db := config.DB
	req.Atribut = atribut
	err := db.Create(&req).Error
	return req, err
}

func (s *AyahService) Edit(data map[string]interface{}, noPeserta string, atribut string) (models.Ayah, error) {
	db := config.DB
	var ayah models.Ayah

	// SURGICAL FIX: Use Count instead of First to avoid "Scan error" on corrupted existing data
	var count int64
	db.Model(&models.Ayah{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Count(&count)

	if count == 0 {
		// 1. Jika BELUM ADA, maka Create
		data["no_peserta"] = noPeserta
		data["atribut"] = atribut
		if errCreate := db.Model(&models.Ayah{}).Create(data).Error; errCreate != nil {
			return models.Ayah{}, errCreate
		}
	} else {
		// 2. Jika SUDAH ADA, maka Update menggunakan Table/Where (aman dari Scan error)
		if errUpdate := db.Table("tb_ayah").Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; errUpdate != nil {
			return models.Ayah{}, errUpdate
		}
	}

	// 3. Ambil data terbaru untuk return (Sekarang Scan error harusnya hilang karena data sudah diperbaiki oleh Updates)
	err := db.Preload("Pekerjaan").Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&ayah).Error
	return ayah, err
}

func (s *AyahService) AddLog(user models.Ayah, atribut string, executor string, timestamp *time.Time) error {
	db := config.DB
	logAyah := models.LogAyah{
		NoPeserta:        user.NoPeserta,
		StatusAyah:       user.StatusAyah,
		NamaAyah:         user.NamaAyah,
		NikAyah:          user.NikAyah,
		TeleponAyah:      user.TeleponAyah,
		AlamatAyah:       user.AlamatAyah,
		ProvinsiAyah:     user.ProvinsiAyah,
		KabkotAyah:       user.KabkotAyah,
		KecamatanAyah:    user.KecamatanAyah,
		PekerjaanAyah:    user.PekerjaanAyah,
		PenghasilanAyah:  user.PenghasilanAyah,
		SampinganAyah:    user.SampinganAyah,
		ScanKtpAyah:      user.ScanKtpAyah,
		ScanSlipAyah:     user.ScanSlipAyah,
		TempatLahirAyah:  user.TempatLahirAyah,
		TanggalLahirAyah: user.TanggalLahirAyah,
		Atribut:          atribut,
		Executor:         executor,
		Timestamp:        timestamp,
	}
	return db.Create(&logAyah).Error
}

func (s *AyahService) GetByLoggedIn(noPeserta string) (models.Ayah, error) {
	db := config.DB
	var ayah models.Ayah
	
	// 1. PRIORITAS: Cek data 'sanggah' dulu dengan relasi lengkap
	err := db.Preload("Pekerjaan").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&ayah).Error
	
	if err == nil {
		return ayah, nil
	}

	// 2. FALLBACK: Jika tidak ada sanggah, ambil data 'original' dengan relasi lengkap
	err = db.Preload("Pekerjaan").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&ayah).Error
	
	if err != nil {
		// Jika beneran nggak ada data sama sekali atau Error scanning
		return models.Ayah{NoPeserta: noPeserta}, nil
	}

	return ayah, nil
}

// CheckData — parity dengan ayah.prototype.checkData di Node.js
func (s *AyahService) CheckData(noPeserta string, uktTinggi string) (bool, error) {
	db := config.DB
	var ayah models.Ayah
	if err := db.Where("no_peserta = ?", noPeserta).First(&ayah).Error; err != nil {
		return false, err
	}

	data := map[string]interface{}{
		"no_peserta":        ayah.NoPeserta,
		"status_ayah":       ayah.StatusAyah,
		"nama_ayah":         ayah.NamaAyah,
		"nik_ayah":          ayah.NikAyah,
		"telepon_ayah":      ayah.TeleponAyah,
		"alamat_ayah":       ayah.AlamatAyah,
		"provinsi_ayah":     ayah.ProvinsiAyah,
		"kabkot_ayah":       ayah.KabkotAyah,
		"kecamatan_ayah":    ayah.KecamatanAyah,
		"pekerjaan_ayah":    ayah.PekerjaanAyah,
		"penghasilan_ayah":  ayah.PenghasilanAyah,
		"sampingan_ayah":    ayah.SampinganAyah,
		"scan_ktp_ayah":     ayah.ScanKtpAyah,
		"scan_slip_ayah":    ayah.ScanSlipAyah,
		"tempat_lahir_ayah": ayah.TempatLahirAyah,
		"tanggal_lahir_ayah": ayah.TanggalLahirAyah,
		"atribut":           ayah.Atribut,
	}

	if ayah.StatusAyah == "wafat" {
		return ayah.NamaAyah != "", nil
	}

	if uktTinggi == "ya" {
		delete(data, "nik_ayah")
		delete(data, "pekerjaan_ayah")
		delete(data, "penghasilan_ayah")
		delete(data, "scan_ktp_ayah")
		delete(data, "scan_slip_ayah")
	}

	if ayah.PekerjaanAyah == "11" { // Tidak bekerja
		delete(data, "penghasilan_ayah")
	}

	delete(data, "sampingan_ayah")

	for _, val := range data {
		if val == nil || val == "" || val == 0 {
			return false, nil
		}
	}

	return true, nil
}
