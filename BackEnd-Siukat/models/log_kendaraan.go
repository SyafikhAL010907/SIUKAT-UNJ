package models

import "gorm.io/gorm"

// LogKendaraan menyimpan log perubahan data kendaraan
type LogKendaraan struct {
	IdLogKendaraan int            `gorm:"primaryKey;autoIncrement" json:"id_log_kendaraan"`
	NoPeserta      string         `gorm:"type:varchar(255)" json:"no_peserta"`
	PajakMotor     float64        `gorm:"type:int" json:"pajak_motor"`
	PajakMobil     float64        `gorm:"type:int" json:"pajak_mobil"`
	Atribut        string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	Executor       string         `gorm:"type:varchar(255)" json:"executor"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (LogKendaraan) TableName() string { return "tb_log_kendaraan" }
