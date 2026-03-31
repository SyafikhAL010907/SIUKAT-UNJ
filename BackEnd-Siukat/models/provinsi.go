package models

// Provinsi adalah representasi tabel ref_provinsi
type Provinsi struct {
	Kode string `gorm:"primaryKey;type:varchar(255)" json:"kode"`
	Nama string `gorm:"type:varchar(255)" json:"nama"`
}

func (Provinsi) TableName() string { return "ref_provinsi" }
