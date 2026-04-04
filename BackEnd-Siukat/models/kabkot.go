package models

type Kabkot struct {
	KabID      string `gorm:"primaryKey;column:kab_id;type:varchar(255)" json:"kab_id"`
	KabNama    string `gorm:"column:kab_nama;type:varchar(255)" json:"kab_nama"`
	ProvinsiID string `gorm:"column:provinsi_id;type:varchar(255)" json:"provinsi_id"`
}

func (Kabkot) TableName() string {
	return "ref_kabupaten"
}
