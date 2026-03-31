package models

import "gorm.io/gorm"

// Kendaraan merupakan GORM Model untuk tabel tb_kendaraan
type Kendaraan struct {
	IdKendaraan int            `gorm:"primaryKey;autoIncrement" json:"id_kendaraan"`
	NoPeserta   string         `gorm:"type:varchar(255)" json:"no_peserta"`
	PajakMotor  float64        `gorm:"type:int" json:"pajak_motor"`
	PajakMobil  float64        `gorm:"type:int" json:"pajak_mobil"`
	Atribut     string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (Kendaraan) TableName() string { return "tb_kendaraan" }
