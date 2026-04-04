package models

type Provinsi struct {
	ProvinsiID   string `gorm:"primaryKey;column:provinsi_id;type:varchar(255)" json:"provinsi_id"`
	ProvinsiNama string `gorm:"column:provinsi_nama;type:varchar(255)" json:"provinsi_nama"`
}

func (Provinsi) TableName() string {
	return "ref_provinsi"
}
