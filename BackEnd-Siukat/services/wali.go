package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
)

type WaliService struct{}

func (s *WaliService) Add(req models.Wali, atribut string) (models.Wali, error) {
	req.Atribut = atribut
	err := config.DB.Create(&req).Error
	return req, err
}

func (s *WaliService) Edit(data map[string]interface{}, noPeserta string, atribut string) (models.Wali, error) {
	if err := config.DB.Model(&models.Wali{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Wali{}, err
	}
	var res models.Wali
	config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&res)
	return res, nil
}

func (s *WaliService) GetByLoggedIn(noPeserta string) (models.Wali, error) {
	var res models.Wali
	err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error
	return res, err
}
