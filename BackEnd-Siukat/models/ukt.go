package models

import "gorm.io/gorm"

// UktKategori merupakan GORM Model untuk tabel tb_ukt
type UktKategori struct {
	MajorId  int            `gorm:"primaryKey" json:"major_id"`
	Entrance string         `gorm:"type:varchar(255)" json:"entrance"`
	I        float64        `gorm:"column:I;type:decimal" json:"i"`
	II       float64        `gorm:"column:II;type:decimal" json:"ii"`
	III      float64        `gorm:"column:III;type:decimal" json:"iii"`
	IV       float64        `gorm:"column:IV;type:decimal" json:"iv"`
	V        float64        `gorm:"column:V;type:decimal" json:"v"`
	VI       float64        `gorm:"column:VI;type:decimal" json:"vi"`
	VII      float64        `gorm:"column:VII;type:decimal" json:"vii"`
	VIII     float64        `gorm:"column:VIII;type:decimal" json:"viii"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

// Ukt adalah alias untuk keperluan query association di `cmahasiswa.go`
type Ukt = UktKategori

func (UktKategori) TableName() string { return "tb_ukt" }
