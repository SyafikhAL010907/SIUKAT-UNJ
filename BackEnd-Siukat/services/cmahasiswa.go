package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"errors"
	"fmt"
	"os"
	"time"

	"gorm.io/gorm"
)

type CMahasiswaService struct{}

// generateTagihan — Parity penuh dengan Node.js
// Di Node.js: stage dari info.stage || process.env.STAGE
// Di Go: stage dari info.StatusPenilaian || os.Getenv("STAGE")
func GenerateTagihan(info models.Info, noPeserta string) (string, error) {
	year := time.Now().Format("06") // "YY" — identik dengan moment().format("YY")

	// Prioritas: dari DB (info.Stage), fallback ke env STAGE
	stageSource := info.Stage
	if stageSource == "" {
		stageSource = os.Getenv("STAGE")
	}

	var stage string
	switch stageSource {
	case "snmptn", "snbt":
		stage = "1"
	case "sbmptn":
		stage = "2"
	case "japres":
		stage = "2"
	case "mandiri":
		stage = "3"
	default:
		return "", fmt.Errorf("stage tidak valid: %s", stageSource)
	}

	tagihan := year + stage + noPeserta
	return tagihan, nil
}

func (s *CMahasiswaService) All() ([]models.CMahasiswa, error) {
	db := config.DB
	var result []models.CMahasiswa
	err := db.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").Find(&result).Error
	return result, err
}

func (s *CMahasiswaService) AllSelesai() ([]models.CMahasiswa, error) {
	db := config.DB
	var result []models.CMahasiswa
	err := db.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("flag = ? AND ukt_tinggi = ?", "selesai_isi", "tidak").
		Find(&result).Error
	return result, err
}

func (s *CMahasiswaService) Add(req models.CMahasiswa, atribut string) (models.CMahasiswa, error) {
	db := config.DB
	req.Atribut = atribut
	err := db.Create(&req).Error
	return req, err
}

func (s *CMahasiswaService) Edit(data map[string]interface{}, noPeserta string, atribut string) (models.CMahasiswa, error) {
	db := config.DB
	if err := db.Model(&models.CMahasiswa{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		return models.CMahasiswa{}, err
	}
	var mhs models.CMahasiswa
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&mhs)
	return mhs, nil
}

func (s *CMahasiswaService) AddLog(user models.CMahasiswa, executor string, timestamp *time.Time) (models.LogCMahasiswa, error) {
	db := config.DB
	logMhs := models.LogCMahasiswa{
		NoPeserta:              user.NoPeserta,
		NamaCmahasiswa:         user.NamaCmahasiswa,
		BidikMisiCmahasiswa:    user.BidikMisiCmahasiswa,
		FakultasCmahasiswa:     user.FakultasCmahasiswa,
		ProdiCmahasiswa:        user.ProdiCmahasiswa,
		JalurCmahasiswa:        user.JalurCmahasiswa,
		SosmedCmahasiswa:       user.SosmedCmahasiswa,
		AlamatCmahasiswa:       user.AlamatCmahasiswa,
		ProvinsiCmahasiswa:     user.ProvinsiCmahasiswa,
		KabkotCmahasiswa:       user.KabkotCmahasiswa,
		KecamatanCmahasiswa:    user.KecamatanCmahasiswa,
		GenderCmahasiswa:       user.GenderCmahasiswa,
		TeleponCmahasiswa:      user.TeleponCmahasiswa,
		GoldarCmahasiswa:       user.GoldarCmahasiswa,
		TempatLahirCmahasiswa:  user.TempatLahirCmahasiswa,
		TanggalLahirCmahasiswa: user.TanggalLahirCmahasiswa,
		FotoCmahasiswa:         user.FotoCmahasiswa,
		PenghasilanCmahasiswa:  user.PenghasilanCmahasiswa,
		GolonganID:             user.GolonganID,
		UktTinggi:              user.UktTinggi,
		Flag:                   user.Flag,
		WaktuSelesai:           user.WaktuSelesai,
		Atribut:                user.Atribut,
		Tagihan:                user.Tagihan,
		NoRegistrasi:           user.NoRegistrasi,
		Executor:               executor,
		Timestamp:              timestamp,
	}
	err := db.Create(&logMhs).Error
	return logMhs, err
}

func (s *CMahasiswaService) UktTinggi(golonganId string, noPeserta string) error {
	db := config.DB
	return db.Model(&models.CMahasiswa{}).Where("no_peserta = ?", noPeserta).Updates(map[string]interface{}{
		"golongan_id": golonganId,
		"ukt_tinggi":  "ya",
		"flag":        "pengisian",
	}).Error
}

func (s *CMahasiswaService) UktTinggiTidak(noPeserta string) error {
	db := config.DB
	return db.Model(&models.CMahasiswa{}).Where("no_peserta = ?", noPeserta).Updates(map[string]interface{}{
		"ukt_tinggi": "tidak",
		"flag":       "pengisian",
	}).Error
}

// Fix #5: CheckData — Parity penuh dengan cmahasiswa.js Node.js
// Cek semua field mandatory, bukan hanya 3 field
func (s *CMahasiswaService) CheckData(noPeserta string) (bool, error) {
	db := config.DB
	var mhs models.CMahasiswa
	if err := db.Where("no_peserta = ?", noPeserta).First(&mhs).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}

	// Replicating Node.js "delete and check" logic using a map
	data := map[string]interface{}{
		"no_peserta":               mhs.NoPeserta,
		"nama_cmahasiswa":         mhs.NamaCmahasiswa,
		"bidik_misi_cmahasiswa":    mhs.BidikMisiCmahasiswa,
		"fakultas_cmahasiswa":     mhs.FakultasCmahasiswa,
		"prodi_cmahasiswa":        mhs.ProdiCmahasiswa,
		"jalur_cmahasiswa":        mhs.JalurCmahasiswa,
		"sosmed_cmahasiswa":       mhs.SosmedCmahasiswa,
		"alamat_cmahasiswa":       mhs.AlamatCmahasiswa,
		"provinsi_cmahasiswa":     mhs.ProvinsiCmahasiswa,
		"kabkot_cmahasiswa":       mhs.KabkotCmahasiswa,
		"kecamatan_cmahasiswa":    mhs.KecamatanCmahasiswa,
		"gender_cmahasiswa":       mhs.GenderCmahasiswa,
		"telepon_cmahasiswa":      mhs.TeleponCmahasiswa,
		"goldar_cmahasiswa":       mhs.GoldarCmahasiswa,
		"tempat_lahir_cmahasiswa": mhs.TempatLahirCmahasiswa,
		"tanggal_lahir_cmahasiswa": mhs.TanggalLahirCmahasiswa,
		"foto_cmahasiswa":         mhs.FotoCmahasiswa,
		"penghasilan_cmahasiswa":  mhs.PenghasilanCmahasiswa,
		"golongan_id":             mhs.GolonganID,
		"ukt_tinggi":              mhs.UktTinggi,
		"flag":                   mhs.Flag,
		"waktu_selesai":           mhs.WaktuSelesai,
		"atribut":                mhs.Atribut,
		"tagihan":                mhs.Tagihan,
		"no_registrasi":          mhs.NoRegistrasi,
		"spu":                    mhs.Spu,
		"penalty":                mhs.Penalty,
	}

	delete(data, "tagihan")
	delete(data, "no_registrasi")
	delete(data, "penghasilan_cmahasiswa")
	delete(data, "spu")
	delete(data, "penalty")

	if mhs.UktTinggi == "ya" {
		delete(data, "sosmed_cmahasiswa")
	} else {
		delete(data, "golongan_id")
	}

	for _, val := range data {
		if val == nil || val == "" || val == 0 {
			return false, nil
		}
	}

	return true, nil
}

func (s *CMahasiswaService) SelesaiIsi(info models.Info, noPeserta string, atribut string) error {
	db := config.DB
	now := time.Now()

	tagihan, err := GenerateTagihan(info, noPeserta)
	if err != nil {
		// Fallback jika stage tidak dikenal — gunakan format sederhana
		tagihan = noPeserta
	}

	return db.Model(&models.CMahasiswa{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(map[string]interface{}{
		"flag":          "selesai_isi",
		"waktu_selesai": now,
		"tagihan":       tagihan,
	}).Error
}

func (s *CMahasiswaService) FlagTerima(noPeserta string) error {
	return config.DB.Model(&models.CMahasiswa{}).Where("no_peserta = ?", noPeserta).Update("flag", "terima_ukt").Error
}

func (s *CMahasiswaService) FlagKlarifikasi(noPeserta string) error {
	return config.DB.Model(&models.CMahasiswa{}).Where("no_peserta = ?", noPeserta).Update("flag", "sanggah_ukt").Error
}

func (s *CMahasiswaService) FlagBatalKlarifikasi(noPeserta string) error {
	now := time.Now()
	return config.DB.Model(&models.CMahasiswa{}).Where("no_peserta = ?", noPeserta).Updates(map[string]interface{}{
		"flag":          "terima_ukt",
		"waktu_selesai": now,
	}).Error
}

func (s *CMahasiswaService) FlagSelesaiKlarifikasi(noPeserta string) error {
	return config.DB.Model(&models.CMahasiswa{}).Where("no_peserta = ?", noPeserta).Update("flag", "selesai_sanggah").Error
}

func (s *CMahasiswaService) GetCmahasiswa(noPeserta string) (models.CMahasiswa, error) {
	db := config.DB
	var mhs models.CMahasiswa

	// 1. Cek sanggah dulu dengan Preload (Relasi Lengkap)
	err := db.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&mhs).Error
	if err == nil {
		return mhs, nil
	}

	// 2. Cek original dengan Preload (Relasi Lengkap)
	err = db.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ?", noPeserta).First(&mhs).Error
	if err == nil {
		return mhs, nil
	}

	// 3. FALLBACK: Kalau Preload gagal (mungkin data di tabel referensi belum ada),
	// kita tarik MURNI data dari tb_cmahasiswa tanpa Preload (Supaya Nama tetap dapet).
	fmt.Printf("⚠️ WARNING: Preload gagal untuk %s, mencoba ambil data murni...\n", noPeserta)
	err = db.Where("no_peserta = ?", noPeserta).First(&mhs).Error
	
	return mhs, err
}

// GetSanggah — Ambil mahasiswa yang dalam status sanggah UKT
func (s *CMahasiswaService) GetSanggah() ([]models.CMahasiswa, error) {
	var data []models.CMahasiswa
	err := config.DB.Preload("Fakultas").Preload("Prodi").
		Where("flag = ?", "sanggah_ukt").Find(&data).Error
	return data, err
}

// GetBM — Ambil mahasiswa Bidik Misi
func (s *CMahasiswaService) GetBM() ([]models.CMahasiswa, error) {
	var data []models.CMahasiswa
	err := config.DB.Preload("Fakultas").Preload("Prodi").
		Where("bidik_misi_cmahasiswa = ?", "Ya").Find(&data).Error
	return data, err
}

// CekTagihan — Cek apakah no_peserta sudah punya tagihan
func (s *CMahasiswaService) CekTagihan(noPeserta string) (models.CMahasiswa, error) {
	var mhs models.CMahasiswa
	err := config.DB.Where("no_peserta = ? AND tagihan IS NOT NULL AND tagihan != ''", noPeserta).First(&mhs).Error
	return mhs, err
}
