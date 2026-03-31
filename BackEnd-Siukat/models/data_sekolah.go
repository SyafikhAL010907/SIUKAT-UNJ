package models

// DataSekolah merupakan GORM Model untuk tabel tb_data_sekolah
type DataSekolah struct {
	IdDataSekolah  int    `gorm:"primaryKey;autoIncrement" json:"id_data_sekolah"`
	NoPeserta      string `gorm:"type:varchar(255)" json:"no_peserta"`
	NamaSekolah    string `gorm:"type:varchar(255)" json:"nama_sekolah"`
	JenjangSekolah string `gorm:"type:varchar(255)" json:"jenjang_sekolah"`
	StatusSekolah  string `gorm:"type:varchar(255)" json:"status_sekolah"`
	ProvinsiSekolah string `gorm:"type:varchar(255)" json:"provinsi_sekolah"`
	KabkotSekolah  string `gorm:"type:varchar(255)" json:"kabkot_sekolah"`
}

func (DataSekolah) TableName() string { return "tb_data_sekolah" }
