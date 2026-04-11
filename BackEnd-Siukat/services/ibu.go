package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"time"
)

type IbuService struct{}

// Add — parity dengan ibu.prototype.add di Node.js
func (s *IbuService) Add(req models.Ibu, atribut string) (models.Ibu, error) {
	db := config.DB
	req.Atribut = atribut
	err := db.Create(&req).Error
	return req, err
}

func (s *IbuService) Edit(data map[string]interface{}, noPeserta string, atribut string) (models.Ibu, error) {
	db := config.DB

	if err := db.Model(&models.Ibu{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.Ibu{}, err
	}

	var ibu models.Ibu
	db.Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&ibu)
	return ibu, nil
}

// AddLog — Fix #4: Implementasi fungsi AddLog yang hilang
// Parity dengan ibu.prototype.addLog di Node.js
func (s *IbuService) AddLog(user models.Ibu, atribut string, executor string, timestamp *time.Time) error {
	db := config.DB
	logIbu := models.LogIbu{
		NoPeserta:       user.NoPeserta,
		StatusIbu:       user.StatusIbu,
		NamaIbu:         user.NamaIbu,
		NikIbu:          user.NikIbu,
		TeleponIbu:      user.TeleponIbu,
		AlamatIbu:       user.AlamatIbu,
		ProvinsiIbu:     user.ProvinsiIbu,
		KabkotIbu:       user.KabkotIbu,
		KecamatanIbu:    user.KecamatanIbu,
		PekerjaanIbu:    user.PekerjaanIbu,
		PenghasilanIbu:  user.PenghasilanIbu,
		SampinganIbu:    user.SampinganIbu,
		ScanKtpIbu:      user.ScanKtpIbu,
		ScanSlipIbu:     user.ScanSlipIbu,
		TempatLahirIbu:  user.TempatLahirIbu,
		TanggalLahirIbu: user.TanggalLahirIbu,
		Atribut:         atribut,
		Executor:        executor,
		Timestamp:       timestamp,
	}
	return db.Create(&logIbu).Error
}

// GetByLoggedIn — parity dengan ibu.prototype.getByLoggedIn di Node.js
func (s *IbuService) GetByLoggedIn(noPeserta string) (models.Ibu, error) {
	db := config.DB
	var ibu models.Ibu

	// 1. Fetch main record without preloads first
	if err := db.Where("no_peserta = ?", noPeserta).First(&ibu).Error; err != nil {
		// Return empty object if not found to prevent 500 error in route
		return models.Ibu{NoPeserta: noPeserta}, nil
	}

	// 2. Separately try to load associations
	_ = db.Model(&ibu).Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").First(&ibu).Error

	return ibu, nil
}

// CheckData — parity dengan ibu.prototype.checkData di Node.js
func (s *IbuService) CheckData(noPeserta string, uktTinggi string) (bool, error) {
	db := config.DB
	var ibu models.Ibu
	if err := db.Where("no_peserta = ?", noPeserta).First(&ibu).Error; err != nil {
		return false, err
	}

	// Replicating Node.js "delete and check" logic using a map
	data := map[string]interface{}{
		"no_peserta":         ibu.NoPeserta,
		"status_ibu":       ibu.StatusIbu,
		"nama_ibu":         ibu.NamaIbu,
		"nik_ibu":          ibu.NikIbu,
		"telepon_ibu":      ibu.TeleponIbu,
		"alamat_ibu":       ibu.AlamatIbu,
		"provinsi_ibu":     ibu.ProvinsiIbu,
		"kabkot_ibu":       ibu.KabkotIbu,
		"kecamatan_ibu":    ibu.KecamatanIbu,
		"pekerjaan_ibu":    ibu.PekerjaanIbu,
		"penghasilan_ibu":  ibu.PenghasilanIbu,
		"sampingan_ibu":    ibu.SampinganIbu,
		"scan_ktp_ibu":     ibu.ScanKtpIbu,
		"scan_slip_ibu":    ibu.ScanSlipIbu,
		"tempat_lahir_ibu": ibu.TempatLahirIbu,
		"tanggal_lahir_ibu": ibu.TanggalLahirIbu,
		"atribut":           ibu.Atribut,
	}

	if ibu.StatusIbu == "wafat" {
		// Only name is required
		return ibu.NamaIbu != "", nil
	}

	if uktTinggi == "ya" {
		delete(data, "nik_ibu")
		delete(data, "pekerjaan_ibu")
		delete(data, "penghasilan_ibu")
		delete(data, "scan_ktp_ibu")
		delete(data, "scan_slip_ibu")
	}

	if ibu.PekerjaanIbu == 11 { // Tidak bekerja
		delete(data, "penghasilan_ibu")
	}

	delete(data, "sampingan_ibu")

	for _, val := range data {
		if val == nil || val == "" || val == 0 {
			return false, nil
		}
	}

	return true, nil
}
