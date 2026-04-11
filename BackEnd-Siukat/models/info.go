package models

import "time"

type Info struct {
	Kode               int    `gorm:"primaryKey;column:kode" json:"kode"`
	TanggalMulai       *time.Time `gorm:"column:tanggal_mulai;type:datetime" json:"tanggal_mulai"`
	TanggalSelesai     *time.Time `gorm:"column:tanggal_selesai;type:datetime" json:"tanggal_selesai"`
	Pengisian          string     `gorm:"column:pengisian;type:varchar(255)" json:"pengisian"`
	Pengumuman         string     `gorm:"column:pengumuman;type:varchar(255)" json:"pengumuman"`
	KlarifikasiTanggal string     `gorm:"column:klarifikasi_tanggal;type:varchar(255)" json:"klarifikasi_tanggal"`
	KlarifikasiLokasi  string     `gorm:"column:klarifikasi_lokasi;type:varchar(255)" json:"klarifikasi_lokasi"`
	Pembayaran         string     `gorm:"column:pembayaran;type:varchar(255)" json:"pembayaran"`
	LaporDiri          string     `gorm:"column:lapor_diri;type:varchar(255)" json:"lapor_diri"`
	Kontak             string     `gorm:"column:kontak;type:varchar(255)" json:"kontak"`
	Stage              string     `gorm:"column:stage;type:varchar(255)" json:"stage"`
	StageDetail        string     `gorm:"column:stage_detail;type:varchar(255)" json:"stage_detail"`
	TanggalAkhir       *time.Time `gorm:"column:tanggal_akhir;type:datetime" json:"tanggal_akhir"`
}

func (Info) TableName() string {
	return "ref_info"
}
