package models

type Prodi struct {
	Kode     string `gorm:"primaryKey;column:kode;type:varchar(255)" json:"kode"`
	Jalur    int    `gorm:"column:jalur" json:"jalur"`
	Nama     string `gorm:"column:nama;type:varchar(255)" json:"nama"`
	Jenjang  string `gorm:"column:jenjang;type:varchar(255)" json:"jenjang"`
	KodeFak  int    `gorm:"column:kode_fak" json:"kode_fak"`
	KodeLama string `gorm:"column:kode_lama;type:varchar(255)" json:"kode_lama"`
}

func (Prodi) TableName() string {
	return "ref_prodi"
}
