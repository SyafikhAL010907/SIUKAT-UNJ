package models

import "gorm.io/gorm"

// Pendukung merupakan GORM Model untuk tabel tb_pendukung
type Pendukung struct {
	IdPendukung int            `gorm:"primaryKey;autoIncrement" json:"id_pendukung"`
	NoPeserta   string         `gorm:"type:varchar(255)" json:"no_peserta"`
	Tanggungan  float64        `gorm:"type:int" json:"tanggungan"`
	Atribut     string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (Pendukung) TableName() string { return "tb_pendukung" }
