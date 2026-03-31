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
	if err := db.Model(&models.Ayah{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Ayah{}, err
	}
	var ayah models.Ayah
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&ayah)
	return ayah, nil
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
	err := db.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").Where("no_peserta = ?", noPeserta).First(&ayah).Error
	return ayah, err
}

func (s *AyahService) CheckData(noPeserta string, uktTinggi string) (bool, error) {
	db := config.DB
	var ayah models.Ayah
	if err := db.Where("no_peserta = ?", noPeserta).First(&ayah).Error; err != nil {
		return false, err
	}

	valid := true
	if ayah.StatusAyah != "wafat" {
		if uktTinggi != "ya" {
			if ayah.PekerjaanAyah == "" || ayah.PenghasilanAyah == 0 {
				valid = false // Basic validation
			}
		}
		if ayah.NamaAyah == "" {
			valid = false
		}
	} else if ayah.StatusAyah == "wafat" {
		if ayah.NamaAyah == "" {
			valid = false
		}
	}

	return valid, nil
}
