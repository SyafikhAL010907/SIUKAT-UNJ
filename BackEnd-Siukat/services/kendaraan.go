package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
)

type KendaraanService struct{}

func (s *KendaraanService) Add(req models.Kendaraan, atribut string) (models.Kendaraan, error) {
	req.Atribut = atribut
	err := config.DB.Create(&req).Error
	return req, err
}

func (s *KendaraanService) Edit(data map[string]interface{}, noPeserta string, atribut string) (models.Kendaraan, error) {
	if err := config.DB.Model(&models.Kendaraan{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Kendaraan{}, err
	}
	var res models.Kendaraan
	config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&res)
	return res, nil
}

func (s *KendaraanService) GetByLoggedIn(noPeserta string) (models.Kendaraan, error) {
	var res models.Kendaraan
	err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error
	return res, err
}
