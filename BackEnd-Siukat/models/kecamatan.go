package models

type Kecamatan struct {
	KecamID   string `gorm:"primaryKey;column:kecam_id;type:varchar(255)" json:"kecam_id"`
	KecamNama string `gorm:"column:kecam_nama;type:varchar(255)" json:"kecam_nama"`
	KabID     string `gorm:"column:kab_id;type:varchar(255)" json:"kab_id"`
}

func (Kecamatan) TableName() string {
	return "ref_kecamatan"
}
