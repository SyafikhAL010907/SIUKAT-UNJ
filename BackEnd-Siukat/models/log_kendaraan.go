package models

import "time"

type LogKendaraan struct {
	IDLogKendaraan int        `gorm:"primaryKey;column:id_log_kendaraan" json:"id_log_kendaraan"`
	NoPeserta      string     `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	StatusMotor    string     `gorm:"column:status_motor;type:enum('memiliki','tidak_memiliki')" json:"status_motor"`
	JumlahMotor    int        `gorm:"column:jumlah_motor" json:"jumlah_motor"`
	PajakMotor     int        `gorm:"column:pajak_motor" json:"pajak_motor"`
	ScanMotor      string     `gorm:"column:scan_motor;type:varchar(255)" json:"scan_motor"`
	StatusMobil    string     `gorm:"column:status_mobil;type:enum('memiliki','tidak_memiliki')" json:"status_mobil"`
	JumlahMobil    int        `gorm:"column:jumlah_mobil" json:"jumlah_mobil"`
	PajakMobil     int        `gorm:"column:pajak_mobil" json:"pajak_mobil"`
	ScanMobil      string     `gorm:"column:scan_mobil;type:varchar(255)" json:"scan_mobil"`
	Atribut        string     `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
	Executor       string     `gorm:"column:executor;type:varchar(255)" json:"executor"`
	Timestamp      *time.Time `gorm:"column:timestamp;type:datetime" json:"timestamp"`
}

func (LogKendaraan) TableName() string {
	return "log_kendaraan"
}
