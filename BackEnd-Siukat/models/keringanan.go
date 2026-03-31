package models

import "gorm.io/gorm"

// Keringanan merupakan GORM Model untuk tabel tb_keringanan
type Keringanan struct {
	IdKeringanan int            `gorm:"primaryKey;autoIncrement" json:"id_keringanan"`
	NoPeserta    string         `gorm:"type:varchar(255)" json:"no_peserta"`
	Alasan       string         `gorm:"type:text" json:"alasan"`
	Status       string         `gorm:"type:enum('pending','diterima','ditolak')" json:"status"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (Keringanan) TableName() string { return "tb_keringanan" }
