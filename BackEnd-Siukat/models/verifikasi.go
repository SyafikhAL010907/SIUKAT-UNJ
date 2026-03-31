package models

import "gorm.io/gorm"

// Verifikasi merupakan GORM Model untuk tabel tb_verifikasi
type Verifikasi struct {
	IdVerifikasi int            `gorm:"primaryKey;autoIncrement" json:"id_verifikasi"`
	NoPeserta    string         `gorm:"type:varchar(255)" json:"no_peserta"`
	Status       string         `gorm:"type:enum('pending','terverifikasi','ditolak')" json:"status"`
	Catatan      string         `gorm:"type:text" json:"catatan"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (Verifikasi) TableName() string { return "tb_verifikasi" }
