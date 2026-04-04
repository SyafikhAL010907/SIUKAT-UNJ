package models

import "time"

type LogAyah struct {
	IDLogAyah        int        `gorm:"primaryKey;column:id_log_ayah" json:"id_log_ayah"`
	NoPeserta        string     `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	StatusAyah       string     `gorm:"column:status_ayah;type:enum('hidup','wafat')" json:"status_ayah"`
	NamaAyah         string     `gorm:"column:nama_ayah;type:varchar(255)" json:"nama_ayah"`
	NikAyah          string     `gorm:"column:nik_ayah;type:varchar(255)" json:"nik_ayah"`
	TeleponAyah      string     `gorm:"column:telepon_ayah;type:varchar(255)" json:"telepon_ayah"`
	AlamatAyah       string     `gorm:"column:alamat_ayah;type:text" json:"alamat_ayah"`
	ProvinsiAyah     string     `gorm:"column:provinsi_ayah;type:varchar(255)" json:"provinsi_ayah"`
	KabkotAyah       string     `gorm:"column:kabkot_ayah;type:varchar(255)" json:"kabkot_ayah"`
	KecamatanAyah    string     `gorm:"column:kecamatan_ayah;type:varchar(255)" json:"kecamatan_ayah"`
	PekerjaanAyah    int        `gorm:"column:pekerjaan_ayah" json:"pekerjaan_ayah"`
	PenghasilanAyah  int        `gorm:"column:penghasilan_ayah" json:"penghasilan_ayah"`
	SampinganAyah    int        `gorm:"column:sampingan_ayah" json:"sampingan_ayah"`
	ScanKtpAyah      string     `gorm:"column:scan_ktp_ayah;type:varchar(255)" json:"scan_ktp_ayah"`
	ScanSlipAyah     string     `gorm:"column:scan_slip_ayah;type:varchar(255)" json:"scan_slip_ayah"`
	TempatLahirAyah  string     `gorm:"column:tempat_lahir_ayah;type:varchar(255)" json:"tempat_lahir_ayah"`
	TanggalLahirAyah *time.Time `gorm:"column:tanggal_lahir_ayah;type:date" json:"tanggal_lahir_ayah"`
	Atribut          string     `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
	Executor         string     `gorm:"column:executor;type:varchar(255)" json:"executor"`
	Timestamp        *time.Time `gorm:"column:timestamp;type:datetime" json:"timestamp"`
}

func (LogAyah) TableName() string {
	return "log_ayah"
}
