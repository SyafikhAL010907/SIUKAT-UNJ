package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
)

type PendukungService struct{}

func (s *PendukungService) Add(req models.Pendukung, atribut string) (models.Pendukung, error) {
	req.Atribut = atribut
	err := config.DB.Create(&req).Error
	return req, err
}

func (s *PendukungService) Edit(data map[string]interface{}, noPeserta string, atribut string) (models.Pendukung, error) {
	if err := config.DB.Model(&models.Pendukung{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Pendukung{}, err
	}
	var res models.Pendukung
	config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&res)
	return res, nil
}

func (s *PendukungService) GetByLoggedIn(noPeserta string) (models.Pendukung, error) {
	var res models.Pendukung
	err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error
	return res, err
}
