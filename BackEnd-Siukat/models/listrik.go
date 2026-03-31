package models

import "gorm.io/gorm"

// Listrik merupakan GORM Model untuk tabel tb_listrik
type Listrik struct {
	IdListrik   int            `gorm:"primaryKey;autoIncrement" json:"id_listrik"`
	NoPeserta   string         `gorm:"type:varchar(255)" json:"no_peserta"`
	Pengeluaran float64        `gorm:"type:int" json:"pengeluaran"`
	Atribut     string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (Listrik) TableName() string { return "tb_listrik" }
