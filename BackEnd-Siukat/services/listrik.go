package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"time"
)

type ListrikService struct{}

func (s *ListrikService) Add(req models.Listrik, atribut string) (models.Listrik, error) {
	req.Atribut = atribut
	err := config.DB.Create(&req).Error
	return req, err
}

func (s *ListrikService) Edit(req models.Listrik, noPeserta string, existing models.Listrik, atribut string) (models.Listrik, error) {
	data := map[string]interface{}{
		"no_pelanggan":    req.NoPelanggan,
		"jenis_pemakaian": req.JenisPemakaian,
		"pengeluaran":     req.Pengeluaran,
	}

	if req.ScanListrik != "" {
		data["scan_listrik"] = req.ScanListrik
	} else {
		data["scan_listrik"] = existing.ScanListrik
	}

	if err := config.DB.Model(&models.Listrik{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Listrik{}, err
	}
	var res models.Listrik
	config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&res)
	return res, nil
}

func (s *ListrikService) AddLog(user models.Listrik, atribut string, executor string, timestamp *time.Time) error {
	logLst := models.LogListrik{
		NoPeserta:      user.NoPeserta,
		NoPelanggan:    user.NoPelanggan,
		JenisPemakaian: user.JenisPemakaian,
		Pengeluaran:    user.Pengeluaran,
		ScanListrik:    user.ScanListrik,
		Atribut:        atribut,
		Executor:       executor,
		Timestamp:      timestamp,
	}
	return config.DB.Create(&logLst).Error
}

func (s *ListrikService) GetByLoggedIn(noPeserta string) (models.Listrik, error) {
	var res models.Listrik
	err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error
	return res, err
}

func (s *ListrikService) CheckData(noPeserta string) (bool, error) {
	var res models.Listrik
	if err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error; err != nil {
		return false, err
	}

	if res.NoPelanggan == "" || res.JenisPemakaian == "" || res.Pengeluaran == 0 || res.ScanListrik == "" {
		return false, nil
	}
	return true, nil
}
