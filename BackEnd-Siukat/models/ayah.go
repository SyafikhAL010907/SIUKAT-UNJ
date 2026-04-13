package models

import "time"

type Ayah struct {
	IDAyah           int        `gorm:"primaryKey;column:id_ayah" json:"id_ayah"`
	NoPeserta        string     `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	StatusAyah       string     `gorm:"column:status_ayah;type:enum('hidup','wafat')" json:"status_ayah"`
	NamaAyah         string     `gorm:"column:nama_ayah;type:varchar(255)" json:"nama_ayah"`
	NikAyah          string     `gorm:"column:nik_ayah;type:varchar(255)" json:"nik_ayah"`
	TeleponAyah      string     `gorm:"column:telepon_ayah;type:varchar(255)" json:"telepon_ayah"`
	AlamatAyah       string     `gorm:"column:alamat_ayah;type:text" json:"alamat_ayah"`
	ProvinsiAyah     string     `gorm:"column:provinsi_ayah;type:varchar(255)" json:"provinsi_ayah"`
	KabkotAyah       string     `gorm:"column:kabkot_ayah;type:varchar(255)" json:"kabkot_ayah"`
	KecamatanAyah    string     `gorm:"column:kecamatan_ayah;type:varchar(255)" json:"kecamatan_ayah"`
	PekerjaanAyah    string     `gorm:"column:pekerjaan_ayah" json:"pekerjaan_ayah"`
	PenghasilanAyah  int        `gorm:"column:penghasilan_ayah" json:"penghasilan_ayah"`
	SampinganAyah    int        `gorm:"column:sampingan_ayah" json:"sampingan_ayah"`
	ScanKtpAyah      string     `gorm:"column:scan_ktp_ayah;type:varchar(255)" json:"scan_ktp_ayah"`
	ScanSlipAyah     string     `gorm:"column:scan_slip_ayah;type:varchar(255)" json:"scan_slip_ayah"`
	TempatLahirAyah  string     `gorm:"column:tempat_lahir_ayah;type:varchar(255)" json:"tempat_lahir_ayah"`
	TanggalLahirAyah *time.Time `gorm:"column:tanggal_lahir_ayah;type:date" json:"tanggal_lahir_ayah"`
	Atribut          string     `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`

	// Relational associations (using pragmatic types to match PKs)
	Provinsi  *Provinsi  `gorm:"foreignKey:ProvinsiAyah;references:ProvinsiID" json:"provinsi,omitempty"`
	Kabkot    *Kabkot    `gorm:"foreignKey:KabkotAyah;references:KabID" json:"kabkot,omitempty"`
	Kecamatan *Kecamatan `gorm:"foreignKey:KecamatanAyah;references:KecamID" json:"kecamatan,omitempty"`
	Pekerjaan *Pekerjaan `gorm:"foreignKey:PekerjaanAyah;references:Kode" json:"pekerjaan,omitempty"`
}

func (Ayah) TableName() string {
	return "tb_ayah"
}
