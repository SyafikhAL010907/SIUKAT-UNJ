package models

// Kecamatan adalah representasi tabel ref_kecamatan
type Kecamatan struct {
	Kode   string `gorm:"primaryKey;type:varchar(255)" json:"kode"`
	Kabkot string `gorm:"type:varchar(255)" json:"kabkot"`
	Nama   string `gorm:"type:varchar(255)" json:"nama"`
}

func (Kecamatan) TableName() string { return "ref_kecamatan" }
