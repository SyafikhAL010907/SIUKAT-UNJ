package models

import "time"

type LogKeringanan struct {
	IDLogKeringanan int        `gorm:"primaryKey;column:id_log_keringanan" json:"id_log_keringanan"`
	NoPeserta       string     `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	ScanKeringanan  string     `gorm:"column:scan_keringanan;type:varchar(255)" json:"scan_keringanan"`
	Flag            string     `gorm:"column:flag;type:enum('menunggu','ditolak','diterima')" json:"flag"`
	Atribut         string     `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
	Executor        string     `gorm:"column:executor;type:varchar(255)" json:"executor"`
	Timestamp       *time.Time `gorm:"column:timestamp;type:datetime" json:"timestamp"`
}

func (LogKeringanan) TableName() string {
	return "log_keringanan"
}
