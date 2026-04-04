package models

import "time"

type LogIbu struct {
	IDLogIbu         int        `gorm:"primaryKey;column:id_log_ibu" json:"id_log_ibu"`
	NoPeserta        string     `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	StatusIbu        string     `gorm:"column:status_ibu;type:enum('hidup','wafat')" json:"status_ibu"`
	NamaIbu          string     `gorm:"column:nama_ibu;type:varchar(255)" json:"nama_ibu"`
	NikIbu           string     `gorm:"column:nik_ibu;type:varchar(255)" json:"nik_ibu"`
	TeleponIbu       string     `gorm:"column:telepon_ibu;type:varchar(255)" json:"telepon_ibu"`
	AlamatIbu        string     `gorm:"column:alamat_ibu;type:text" json:"alamat_ibu"`
	ProvinsiIbu      string     `gorm:"column:provinsi_ibu;type:varchar(255)" json:"provinsi_ibu"`
	KabkotIbu        string     `gorm:"column:kabkot_ibu;type:varchar(255)" json:"kabkot_ibu"`
	KecamatanIbu     string     `gorm:"column:kecamatan_ibu;type:varchar(255)" json:"kecamatan_ibu"`
	PekerjaanIbu     int        `gorm:"column:pekerjaan_ibu" json:"pekerjaan_ibu"`
	PenghasilanIbu   int        `gorm:"column:penghasilan_ibu" json:"penghasilan_ibu"`
	SampinganIbu     int        `gorm:"column:sampingan_ibu" json:"sampingan_ibu"`
	ScanKtpIbu       string     `gorm:"column:scan_ktp_ibu;type:varchar(255)" json:"scan_ktp_ibu"`
	ScanSlipIbu      string     `gorm:"column:scan_slip_ibu;type:varchar(255)" json:"scan_slip_ibu"`
	TempatLahirIbu   string     `gorm:"column:tempat_lahir_ibu;type:varchar(255)" json:"tempat_lahir_ibu"`
	TanggalLahirIbu  *time.Time `gorm:"column:tanggal_lahir_ibu;type:date" json:"tanggal_lahir_ibu"`
	Atribut          string     `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
	Executor         string     `gorm:"column:executor;type:varchar(255)" json:"executor"`
	Timestamp        *time.Time `gorm:"column:timestamp;type:datetime" json:"timestamp"`
}

func (LogIbu) TableName() string {
	return "log_ibu"
}
