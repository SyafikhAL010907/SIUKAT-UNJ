package models

type Info struct {
	Kode               int    `gorm:"primaryKey;column:kode" json:"kode"`
	Pengisian          string `gorm:"column:pengisian;type:varchar(255)" json:"pengisian"`
	Pengumuman         string `gorm:"column:pengumuman;type:varchar(255)" json:"pengumuman"`
	KlarifikasiTanggal string `gorm:"column:klarifikasi_tanggal;type:varchar(255)" json:"klarifikasi_tanggal"`
	KlarifikasiLokasi  string `gorm:"column:klarifikasi_lokasi;type:varchar(255)" json:"klarifikasi_lokasi"`
	Pembayaran         string `gorm:"column:pembayaran;type:varchar(255)" json:"pembayaran"`
	LaporDiri          string `gorm:"column:lapor_diri;type:varchar(255)" json:"lapor_diri"`
	Kontak             string `gorm:"column:kontak;type:varchar(255)" json:"kontak"`
	Stage              string `gorm:"column:stage;type:varchar(255)" json:"stage"`
	StageDetail        string `gorm:"column:stage_detail;type:varchar(255)" json:"stage_detail"`
}

func (Info) TableName() string {
	return "ref_info"
}
