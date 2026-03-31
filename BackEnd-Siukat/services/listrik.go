package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
)

type ListrikService struct{}

func (s *ListrikService) Add(req models.Listrik, atribut string) (models.Listrik, error) {
	req.Atribut = atribut
	err := config.DB.Create(&req).Error
	return req, err
}

func (s *ListrikService) Edit(data map[string]interface{}, noPeserta string, atribut string) (models.Listrik, error) {
	if err := config.DB.Model(&models.Listrik{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Listrik{}, err
	}
	var res models.Listrik
	config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&res)
	return res, nil
}

func (s *ListrikService) GetByLoggedIn(noPeserta string) (models.Listrik, error) {
	var res models.Listrik
	err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error
	return res, err
}
