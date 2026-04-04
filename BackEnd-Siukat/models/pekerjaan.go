package models

type Pekerjaan struct {
	Kode int    `gorm:"primaryKey;column:kode" json:"kode"`
	Nama string `gorm:"column:nama;type:varchar(255)" json:"nama"`
}

func (Pekerjaan) TableName() string {
	return "ref_pekerjaan"
}
