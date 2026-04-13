package models

import "time"

type Wali struct {
	IDWali          int    `gorm:"primaryKey;column:id_wali" json:"id_wali"`
	NoPeserta       string `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	StatusWali      string `gorm:"column:status_wali;type:enum('ada','tidak')" json:"status_wali"`
	NamaWali        string `gorm:"column:nama_wali;type:varchar(255)" json:"nama_wali"`
	AlamatWali      string `gorm:"column:alamat_wali;type:text" json:"alamat_wali"`
	ProvinsiWali    string `gorm:"column:provinsi_wali;type:varchar(255)" json:"provinsi_wali"`
	KabkotWali      string `gorm:"column:kabkot_wali;type:varchar(255)" json:"kabkot_wali"`
	KecamatanWali   string     `gorm:"column:kecamatan_wali;type:varchar(255)" json:"kecamatan_wali"`
	PekerjaanWali   string        `gorm:"column:pekerjaan_wali" json:"pekerjaan_wali"`
	KesanggupanWali int        `gorm:"column:kesanggupan_wali" json:"kesanggupan_wali"`
	ScanWali        string     `gorm:"column:scan_wali;type:varchar(255)" json:"scan_wali"`
	TempatLahirWali string     `gorm:"column:tempat_lahir_wali;type:varchar(255)" json:"tempat_lahir_wali"`
	TanggalLahirWali *time.Time `gorm:"column:tanggal_lahir_wali;type:date" json:"tanggal_lahir_wali"`
	Atribut         string     `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`

	// Relational associations (using pragmatic types to match PKs)
	Provinsi  *Provinsi  `gorm:"foreignKey:ProvinsiWali;references:ProvinsiID" json:"provinsi,omitempty"`
	Kabkot    *Kabkot    `gorm:"foreignKey:KabkotWali;references:KabID" json:"kabkot,omitempty"`
	Kecamatan *Kecamatan `gorm:"foreignKey:KecamatanWali;references:KecamID" json:"kecamatan,omitempty"`
	Pekerjaan *Pekerjaan `gorm:"foreignKey:PekerjaanWali;references:Kode" json:"pekerjaan,omitempty"`
}

func (Wali) TableName() string {
	return "tb_wali"
}
