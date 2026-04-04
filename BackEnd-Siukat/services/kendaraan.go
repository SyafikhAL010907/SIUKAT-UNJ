package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"time"
)

type KendaraanService struct{}

func (s *KendaraanService) Add(req models.Kendaraan, atribut string) (models.Kendaraan, error) {
	req.Atribut = atribut
	err := config.DB.Create(&req).Error
	return req, err
}

func (s *KendaraanService) Edit(req models.Kendaraan, noPeserta string, existing models.Kendaraan, atribut string) (models.Kendaraan, error) {
	data := map[string]interface{}{}

	data["status_motor"] = req.StatusMotor
	if req.StatusMotor == "tidak" {
		data["jumlah_motor"] = 0
		data["pajak_motor"] = 0
		data["scan_motor"] = ""
	} else {
		data["jumlah_motor"] = req.JumlahMotor
		data["pajak_motor"] = req.PajakMotor
		if req.ScanMotor != "" {
			data["scan_motor"] = req.ScanMotor
		} else {
			data["scan_motor"] = existing.ScanMotor
		}
	}

	data["status_mobil"] = req.StatusMobil
	if req.StatusMobil == "tidak" {
		data["jumlah_mobil"] = 0
		data["pajak_mobil"] = 0
		data["scan_mobil"] = ""
	} else {
		data["jumlah_mobil"] = req.JumlahMobil
		data["pajak_mobil"] = req.PajakMobil
		if req.ScanMobil != "" {
			data["scan_mobil"] = req.ScanMobil
		} else {
			data["scan_mobil"] = existing.ScanMobil
		}
	}

	if err := config.DB.Model(&models.Kendaraan{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Kendaraan{}, err
	}
	var res models.Kendaraan
	config.DB.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&res)
	return res, nil
}

func (s *KendaraanService) AddLog(user models.Kendaraan, atribut string, executor string, timestamp *time.Time) error {
	logKen := models.LogKendaraan{
		NoPeserta:   user.NoPeserta,
		StatusMotor: user.StatusMotor,
		JumlahMotor: user.JumlahMotor,
		PajakMotor:  user.PajakMotor,
		ScanMotor:   user.ScanMotor,
		StatusMobil: user.StatusMobil,
		JumlahMobil: user.JumlahMobil,
		PajakMobil:  user.PajakMobil,
		ScanMobil:   user.ScanMobil,
		Atribut:     atribut,
		Executor:    executor,
		Timestamp:   timestamp,
	}
	return config.DB.Create(&logKen).Error
}

func (s *KendaraanService) GetByLoggedIn(noPeserta string) (models.Kendaraan, error) {
	var res models.Kendaraan
	err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error
	return res, err
}

func (s *KendaraanService) CheckData(noPeserta string) (bool, error) {
	var res models.Kendaraan
	if err := config.DB.Where("no_peserta = ?", noPeserta).First(&res).Error; err != nil {
		return false, err
	}

	// Replicating Node.js "delete and check" logic using a map
	data := map[string]interface{}{
		"no_peserta":   res.NoPeserta,
		"status_motor": res.StatusMotor,
		"jumlah_motor": res.JumlahMotor,
		"pajak_motor":  res.PajakMotor,
		"scan_motor":   res.ScanMotor,
		"status_mobil": res.StatusMobil,
		"jumlah_mobil": res.JumlahMobil,
		"pajak_mobil":  res.PajakMobil,
		"scan_mobil":   res.ScanMobil,
		"atribut":     res.Atribut,
	}

	if res.StatusMotor == "tidak" {
		delete(data, "jumlah_motor")
		delete(data, "pajak_motor")
		delete(data, "scan_motor")
	}

	if res.StatusMobil == "tidak" {
		delete(data, "jumlah_mobil")
		delete(data, "pajak_mobil")
		delete(data, "scan_mobil")
	}

	for _, val := range data {
		if val == nil || val == "" || val == 0 || val == "0" {
			return false, nil
		}
	}

	return true, nil
}
