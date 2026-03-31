package models

import (
	"time"

	"gorm.io/gorm"
)

// LogIbu menyimpan log perubahan data ibu — Full fields sesuai ibu.js
type LogIbu struct {
	IdLogIbu        int            `gorm:"primaryKey;autoIncrement" json:"id_log_ibu"`
	NoPeserta       string         `gorm:"type:varchar(255)" json:"no_peserta"`
	StatusIbu       string         `gorm:"type:varchar(255)" json:"status_ibu"`
	NamaIbu         string         `gorm:"type:varchar(255)" json:"nama_ibu"`
	NikIbu          string         `gorm:"type:varchar(255)" json:"nik_ibu"`
	TeleponIbu      string         `gorm:"type:varchar(255)" json:"telepon_ibu"`
	AlamatIbu       string         `gorm:"type:text" json:"alamat_ibu"`
	ProvinsiIbu     int            `gorm:"type:int" json:"provinsi_ibu"`
	KabkotIbu       int            `gorm:"type:int" json:"kabkot_ibu"`
	KecamatanIbu    int            `gorm:"type:int" json:"kecamatan_ibu"`
	PekerjaanIbu    string         `gorm:"type:varchar(255)" json:"pekerjaan_ibu"`
	PenghasilanIbu  float64        `gorm:"type:decimal" json:"penghasilan_ibu"`
	SampinganIbu    float64        `gorm:"type:decimal" json:"sampingan_ibu"`
	ScanKtpIbu      string         `gorm:"type:varchar(255)" json:"scan_ktp_ibu"`
	ScanSlipIbu     string         `gorm:"type:varchar(255)" json:"scan_slip_ibu"`
	TempatLahirIbu  string         `gorm:"type:varchar(255)" json:"tempat_lahir_ibu"`
	TanggalLahirIbu *time.Time     `gorm:"type:date" json:"tanggal_lahir_ibu"`
	Atribut         string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	Executor        string         `gorm:"type:varchar(255)" json:"executor"`
	Timestamp       *time.Time     `gorm:"type:datetime" json:"timestamp"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (LogIbu) TableName() string { return "tb_log_ibu" }
