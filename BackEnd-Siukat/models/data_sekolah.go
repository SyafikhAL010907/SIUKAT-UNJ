package models

type DataSekolah struct {
	Npsn              string `gorm:"primaryKey;column:npsn;type:varchar(255)" json:"npsn"`
	NamaSekolah       string `gorm:"column:nama_sekolah;type:varchar(255)" json:"nama_sekolah"`
	JenisSekolah      string `gorm:"column:jenis_sekolah;type:varchar(255)" json:"jenis_sekolah"`
	NamaKabupaten     string `gorm:"column:nama_kabupaten;type:varchar(255)" json:"nama_kabupaten"`
	NamaProvinsi      string `gorm:"column:nama_provinsi;type:varchar(255)" json:"nama_provinsi"`
	AkreditasiSekolah string `gorm:"column:akreditasi_sekolah;type:varchar(255)" json:"akreditasi_sekolah"`
	Kepemilikan       string `gorm:"column:kepemilikan;type:varchar(255)" json:"kepemilikan"`
}

func (DataSekolah) TableName() string {
	return "data_sekolah"
}
