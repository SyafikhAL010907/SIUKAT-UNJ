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
