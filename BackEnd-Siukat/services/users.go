package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
)

type UsersService struct{}

func (s *UsersService) GetUser(noPeserta string) (interface{}, error) {
	var user models.User
	if err := config.DB.Where("no_peserta = ?", noPeserta).First(&user).Error; err != nil {
		return nil, err
	}

	if user.Role == "admin" {
		var admin models.Admin
		if err := config.DB.Where("username = ?", noPeserta).First(&admin).Error; err == nil {
			return admin, nil
		}
		return admin, nil
	}

	var mhs models.CMahasiswa
	// Sanggah lookup
	if err := config.DB.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").
		Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&mhs).Error; err == nil {
		
		// SAFETY: Pastikan Prodi/Fakultas gak nil biar React gak crash
		if mhs.Prodi == nil {
			mhs.Prodi = &models.Prodi{}
		}
		if mhs.Fakultas == nil {
			mhs.Fakultas = &models.Fakultas{}
		}
		
		return mhs, nil
	}

	// Original fallback
	if err := config.DB.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").
		Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&mhs).Error; err == nil {
		return mhs, nil
	}

	// Broad fallback for any attribute (e.g., 'pengisian' or others)
	if err := config.DB.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").
		Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ?", noPeserta).First(&mhs).Error; err == nil {
		
		// SAFETY: Pastikan Prodi/Fakultas gak nil biar React gak crash
		if mhs.Prodi == nil {
			mhs.Prodi = &models.Prodi{}
		}
		if mhs.Fakultas == nil {
			mhs.Fakultas = &models.Fakultas{}
		}
		
		return mhs, nil
	}

	return nil, nil // Not found
}
