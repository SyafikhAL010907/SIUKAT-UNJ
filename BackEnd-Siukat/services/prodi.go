package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
)

type ProdiService struct{}

func (s *ProdiService) GetAll() ([]models.Prodi, error) {
	var data []models.Prodi
	err := config.DB.Find(&data).Error
	return data, err
}

func (s *ProdiService) GetByFakultas(kodeFakultas string) ([]models.Prodi, error) {
	var data []models.Prodi
	err := config.DB.Where("fakultas = ?", kodeFakultas).Find(&data).Error
	return data, err
}

// ByCmahasiswa — Manual enrichment helper (Parity with prodi.js Node.js)
// Note: In Go/GORM, usually Preload("Prodi") is preferred.
func (s *ProdiService) ByCmahasiswa(mhs *models.CMahasiswa) error {
	if mhs.ProdiCmahasiswa == "" {
		return nil
	}
	var prodi models.Prodi
	err := config.DB.Where("kode = ? AND jalur = ?", mhs.ProdiCmahasiswa, mhs.JalurCmahasiswa).First(&prodi).Error
	if err == nil {
		mhs.Prodi = &prodi
	}
	return err
}
