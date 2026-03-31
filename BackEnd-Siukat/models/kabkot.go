package models

// Kabkot adalah representasi tabel ref_kabkot
type Kabkot struct {
	Kode     string `gorm:"primaryKey;type:varchar(255)" json:"kode"`
	Provinsi string `gorm:"type:varchar(255)" json:"provinsi"`
	Nama     string `gorm:"type:varchar(255)" json:"nama"`
}

func (Kabkot) TableName() string { return "ref_kabkot" }
