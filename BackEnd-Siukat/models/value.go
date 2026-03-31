package models

import "gorm.io/gorm"

// Value merupakan GORM Model untuk tabel tb_value
type Value struct {
	IdValue   int            `gorm:"primaryKey;autoIncrement" json:"id_value"`
	NoPeserta string         `gorm:"type:varchar(255)" json:"no_peserta"`
	V1        float64        `gorm:"type:decimal" json:"v1"`
	V2        float64        `gorm:"type:decimal" json:"v2"`
	V3        float64        `gorm:"type:decimal" json:"v3"`
	V4        float64        `gorm:"type:decimal" json:"v4"`
	V5        float64        `gorm:"type:decimal" json:"v5"`
	Av1       float64        `gorm:"type:decimal" json:"av1"`
	Bv2       float64        `gorm:"type:decimal" json:"bv2"`
	Cv3       float64        `gorm:"type:decimal" json:"cv3"`
	Dv4       float64        `gorm:"type:decimal" json:"dv4"`
	Ev5       float64        `gorm:"type:decimal" json:"ev5"`
	Ikb       float64        `gorm:"type:decimal" json:"ikb"`
	Atribut   string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (Value) TableName() string { return "tb_value" }
