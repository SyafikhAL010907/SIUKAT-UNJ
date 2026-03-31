package models

import (
	"time"

	"gorm.io/gorm"
)

type LogAyah struct {
	IdLogAyah        int            `gorm:"primaryKey;autoIncrement" json:"id_log_ayah"`
	NoPeserta        string         `gorm:"type:varchar(255)" json:"no_peserta"`
	StatusAyah       string         `gorm:"type:enum('hidup','wafat','bercerai')" json:"status_ayah"`
	NamaAyah         string         `gorm:"type:varchar(255)" json:"nama_ayah"`
	NikAyah          string         `gorm:"type:varchar(255)" json:"nik_ayah"`
	TeleponAyah      string         `gorm:"type:varchar(255)" json:"telepon_ayah"`
	AlamatAyah       string         `gorm:"type:text" json:"alamat_ayah"`
	ProvinsiAyah     int            `gorm:"type:int" json:"provinsi_ayah"`
	KabkotAyah       int            `gorm:"type:int" json:"kabkot_ayah"`
	KecamatanAyah    int            `gorm:"type:int" json:"kecamatan_ayah"`
	PekerjaanAyah    string         `gorm:"type:varchar(255)" json:"pekerjaan_ayah"`
	PenghasilanAyah  float64        `gorm:"type:decimal" json:"penghasilan_ayah"`
	SampinganAyah    float64        `gorm:"type:decimal" json:"sampingan_ayah"`
	ScanKtpAyah      string         `gorm:"type:varchar(255)" json:"scan_ktp_ayah"`
	ScanSlipAyah     string         `gorm:"type:varchar(255)" json:"scan_slip_ayah"`
	TempatLahirAyah  string         `gorm:"type:varchar(255)" json:"tempat_lahir_ayah"`
	TanggalLahirAyah *time.Time     `gorm:"type:date" json:"tanggal_lahir_ayah"`
	Atribut          string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	
	Executor  string     `gorm:"type:varchar(255)" json:"executor"`
	Timestamp *time.Time `gorm:"type:datetime" json:"timestamp"`

	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (LogAyah) TableName() string { return "tb_log_ayah" }
