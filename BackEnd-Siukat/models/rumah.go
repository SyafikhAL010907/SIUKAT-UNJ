package models

import "gorm.io/gorm"

// Rumah merupakan GORM Model untuk tabel tb_rumah
type Rumah struct {
	IdRumah              int            `gorm:"primaryKey;autoIncrement" json:"id_rumah"`
	NoPeserta            string         `gorm:"type:varchar(255)" json:"no_peserta"`
	BiayaPbb             float64        `gorm:"type:int" json:"biaya_pbb"`
	JumlahKepalaKeluarga float64        `gorm:"type:int" json:"jumlah_kepala_keluarga"`
	BiayaKontrak         float64        `gorm:"type:int" json:"biaya_kontrak"`
	Atribut              string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	DeletedAt            gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (Rumah) TableName() string { return "tb_rumah" }
