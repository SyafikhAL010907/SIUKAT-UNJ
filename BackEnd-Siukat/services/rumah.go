package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
)

type RumahService struct{}

func (s *RumahService) Add(req models.Rumah, atribut string) (models.Rumah, error) {
	db := config.DB
	req.Atribut = atribut
	err := db.Create(&req).Error
	return req, err
}

func (s *RumahService) Edit(data map[string]interface{}, noPeserta string, atribut string) (models.Rumah, error) {
	db := config.DB
	if err := db.Model(&models.Rumah{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Rumah{}, err
	}
	var rumah models.Rumah
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&rumah)
	return rumah, nil
}

func (s *RumahService) GetByLoggedIn(noPeserta string) (models.Rumah, error) {
	db := config.DB
	var rumah models.Rumah
	err := db.Where("no_peserta = ?", noPeserta).First(&rumah).Error
	return rumah, err
}
