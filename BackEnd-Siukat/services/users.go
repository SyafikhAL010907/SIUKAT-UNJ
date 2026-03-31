package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
)

type UsersService struct{}

func (s *UsersService) GetUser(noPeserta string) (models.CMahasiswa, error) {
	var mhs models.CMahasiswa
	err := config.DB.Preload("Prodi").Preload("Fakultas").Where("no_peserta = ?", noPeserta).First(&mhs).Error
	return mhs, err
}

func (s *UsersService) GetAllUser() ([]models.CMahasiswa, error) {
	var mhsList []models.CMahasiswa
	err := config.DB.Preload("Prodi").Preload("Fakultas").Find(&mhsList).Error
	return mhsList, err
}
