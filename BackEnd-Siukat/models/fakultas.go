package models

// Fakultas adalah representasi tabel ref_fakultas
type Fakultas struct {
	Kode string `gorm:"primaryKey;type:varchar(255)" json:"kode"`
	Nama string `gorm:"type:varchar(255)" json:"nama"`
}

func (Fakultas) TableName() string { return "ref_fakultas" }
