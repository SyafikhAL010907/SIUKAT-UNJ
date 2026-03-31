package models

// Prodi adalah representasi tabel ref_prodi
type Prodi struct {
	Kode     int    `gorm:"primaryKey;autoIncrement" json:"kode"`
	Fakultas string `gorm:"type:varchar(255)" json:"fakultas"`
	Program  string `gorm:"type:varchar(255)" json:"program"`
	Nama     string `gorm:"type:varchar(255)" json:"nama"`
}

func (Prodi) TableName() string { return "ref_prodi" }
