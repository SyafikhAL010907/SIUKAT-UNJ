package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
)

type KeringananService struct{}

func (s *KeringananService) GetAll() ([]models.Keringanan, error) {
	var data []models.Keringanan
	err := config.DB.Find(&data).Error
	return data, err
}

func (s *KeringananService) Add(req models.Keringanan) (models.Keringanan, error) {
	req.Status = "pending"
	err := config.DB.Create(&req).Error
	return req, err
}

func (s *KeringananService) UpdateStatus(id int, status string, catatan string) error {
	return config.DB.Model(&models.Keringanan{}).Where("id_keringanan = ?", id).
		Updates(map[string]interface{}{"status": status}).Error
}

func (s *KeringananService) GetByNoPeserta(noPeserta string) (models.Keringanan, error) {
	var data models.Keringanan
	err := config.DB.Where("no_peserta = ?", noPeserta).First(&data).Error
	return data, err
}
