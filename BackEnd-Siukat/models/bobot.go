package models

import "gorm.io/gorm"

// Bobot merupakan GORM Model untuk tabel ref_bobot
type Bobot struct {
	ID      int            `gorm:"primaryKey;autoIncrement" json:"id"`
	A       float64        `gorm:"type:decimal" json:"a"`
	B       float64        `gorm:"type:decimal" json:"b"`
	C       float64        `gorm:"type:decimal" json:"c"`
	D       float64        `gorm:"type:decimal" json:"d"`
	E       float64        `gorm:"type:decimal" json:"e"`
	Pbb     float64        `gorm:"type:decimal" json:"pbb"`
	Kontrak float64        `gorm:"type:decimal" json:"kontrak"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (Bobot) TableName() string { return "ref_bobot" }
