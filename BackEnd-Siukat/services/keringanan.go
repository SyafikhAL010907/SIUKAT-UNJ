package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"time"
)

type KeringananService struct{}

func (s *KeringananService) Add(req models.Keringanan, atribut string) (models.Keringanan, error) {
	req.Atribut = atribut
	err := config.DB.Create(&req).Error
	return req, err
}

func (s *KeringananService) Edit(req models.Keringanan, noPeserta string, existing models.Keringanan, atribut string) (models.Keringanan, error) {
	data := map[string]interface{}{}
	data["flag"] = req.Flag

	if req.Flag == "" {
		data["scan_keringanan"] = ""
	} else if req.ScanKeringanan != "" {
		data["scan_keringanan"] = req.ScanKeringanan
	} else {
		data["scan_keringanan"] = existing.ScanKeringanan
	}

	if err := config.DB.Model(&models.Keringanan{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Keringanan{}, err
	}
	var res models.Keringanan
	config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&res)
	return res, nil
}

func (s *KeringananService) AddLog(user models.Keringanan, atribut string, executor string, timestamp *time.Time) error {
	logLst := models.LogKeringanan{
		NoPeserta:      user.NoPeserta,
		ScanKeringanan: user.ScanKeringanan,
		Flag:           user.Flag,
		Atribut:        atribut,
		Executor:       executor,
		Timestamp:      timestamp,
	}
	return config.DB.Create(&logLst).Error
}

func (s *KeringananService) GetByLoggedIn(noPeserta string) (models.Keringanan, error) {
	var res models.Keringanan
	err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error
	return res, err
}

func (s *KeringananService) CheckData(noPeserta string) (bool, error) {
	var res models.Keringanan
	if err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error; err != nil {
		return false, err
	}

	// Any required logic
	return true, nil
}
