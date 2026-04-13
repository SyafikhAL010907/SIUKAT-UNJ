package models

import "time"

type LogWali struct {
	IDLogWali       int        `gorm:"primaryKey;column:id_log_wali" json:"id_log_wali"`
	NoPeserta       string     `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	StatusWali      string     `gorm:"column:status_wali;type:enum('ada','tidak')" json:"status_wali"`
	NamaWali        string     `gorm:"column:nama_wali;type:varchar(255)" json:"nama_wali"`
	AlamatWali      string     `gorm:"column:alamat_wali;type:text" json:"alamat_wali"`
	ProvinsiWali    string     `gorm:"column:provinsi_wali;type:varchar(255)" json:"provinsi_wali"`
	KabkotWali      string     `gorm:"column:kabkot_wali;type:varchar(255)" json:"kabkot_wali"`
	KecamatanWali   string     `gorm:"column:kecamatan_wali;type:varchar(255)" json:"kecamatan_wali"`
	PekerjaanWali   string     `gorm:"column:pekerjaan_wali" json:"pekerjaan_wali"`
	KesanggupanWali int        `gorm:"column:kesanggupan_wali" json:"kesanggupan_wali"`
	ScanWali        string     `gorm:"column:scan_wali;type:varchar(255)" json:"scan_wali"`
	Atribut         string     `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
	Executor        string     `gorm:"column:executor;type:varchar(255)" json:"executor"`
	Timestamp       *time.Time `gorm:"column:timestamp;type:datetime" json:"timestamp"`
}

func (LogWali) TableName() string {
	return "log_wali"
}
