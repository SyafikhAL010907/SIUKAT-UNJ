package models

import "gorm.io/gorm"

// Wali merupakan GORM Model untuk tabel tb_wali
type Wali struct {
	IdWali          int            `gorm:"primaryKey;autoIncrement" json:"id_wali"`
	NoPeserta       string         `gorm:"type:varchar(255)" json:"no_peserta"`
	KesanggupanWali float64        `gorm:"type:decimal" json:"kesanggupan_wali"`
	Atribut         string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (Wali) TableName() string { return "tb_wali" }
