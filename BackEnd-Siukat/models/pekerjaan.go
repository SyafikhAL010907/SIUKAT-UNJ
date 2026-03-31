package models

// Pekerjaan adalah representasi tabel ref_pekerjaan
type Pekerjaan struct {
	Kode string `gorm:"primaryKey;type:varchar(255)" json:"kode"`
	Nama string `gorm:"type:varchar(255)" json:"nama"`
}

func (Pekerjaan) TableName() string { return "ref_pekerjaan" }
