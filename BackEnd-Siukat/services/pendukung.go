package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"time"
)

type PendukungService struct{}

func (s *PendukungService) Add(req models.Pendukung, atribut string) (models.Pendukung, error) {
	req.Atribut = atribut
	err := config.DB.Create(&req).Error
	return req, err
}

func (s *PendukungService) Edit(req models.Pendukung, noPeserta string, existing models.Pendukung, atribut string) (models.Pendukung, error) {
	data := map[string]interface{}{
		"tanggungan": req.Tanggungan,
	}

	if req.ScanPernyataanUktTinggi != "" {
		data["scan_pernyataan_ukt_tinggi"] = req.ScanPernyataanUktTinggi
	} else {
		data["scan_pernyataan_ukt_tinggi"] = existing.ScanPernyataanUktTinggi
	}

	if req.ScanPernyataanKebenaran != "" {
		data["scan_pernyataan_kebenaran"] = req.ScanPernyataanKebenaran
	} else {
		data["scan_pernyataan_kebenaran"] = existing.ScanPernyataanKebenaran
	}

	if req.ScanKk != "" {
		data["scan_kk"] = req.ScanKk
	} else {
		data["scan_kk"] = existing.ScanKk
	}

	if err := config.DB.Model(&models.Pendukung{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Pendukung{}, err
	}
	var res models.Pendukung
	config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&res)
	return res, nil
}

func (s *PendukungService) AddLog(user models.Pendukung, atribut string, executor string, timestamp *time.Time) error {
	logLst := models.LogPendukung{
		NoPeserta:               user.NoPeserta,
		Tanggungan:              user.Tanggungan,
		ScanPernyataanUktTinggi: user.ScanPernyataanUktTinggi,
		ScanPernyataanKebenaran: user.ScanPernyataanKebenaran,
		ScanKk:                  user.ScanKk,
		Atribut:                 atribut,
		Executor:                executor,
		Timestamp:               timestamp,
	}
	return config.DB.Create(&logLst).Error
}

func (s *PendukungService) GetByLoggedIn(noPeserta string) (models.Pendukung, error) {
	var res models.Pendukung
	err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error
	return res, err
}

func (s *PendukungService) CheckData(noPeserta string, uktTinggi string) (bool, error) {
	var res models.Pendukung
	if err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error; err != nil {
		return false, err
	}

	if uktTinggi == "ya" {
		if res.ScanPernyataanUktTinggi == "" {
			return false, nil
		}
	} else {
		if res.Tanggungan == 0 || res.ScanKk == "" {
			return false, nil
		}
	}
	return true, nil
}

func (s *PendukungService) CheckDataVerifikasi(noPeserta string, uktTinggi string) (bool, error) {
	var res models.Pendukung
	if err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error; err != nil {
		return false, err
	}

	if uktTinggi == "ya" {
		if res.ScanPernyataanUktTinggi == "" {
			return false, nil
		}
	} else {
		if res.ScanPernyataanKebenaran == "" {
			return false, nil
		}
	}
	return true, nil
}
