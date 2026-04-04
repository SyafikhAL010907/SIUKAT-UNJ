package models

type Fakultas struct {
	Kode int    `gorm:"primaryKey;column:kode" json:"kode"`
	Nama string `gorm:"column:nama;type:varchar(255)" json:"nama"`
}

func (Fakultas) TableName() string {
	return "ref_fakultas"
}
