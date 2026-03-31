package models

import "gorm.io/gorm"

// LogKeringanan menyimpan log perubahan data keringanan
type LogKeringanan struct {
	IdLogKeringanan int            `gorm:"primaryKey;autoIncrement" json:"id_log_keringanan"`
	NoPeserta       string         `gorm:"type:varchar(255)" json:"no_peserta"`
	Alasan          string         `gorm:"type:text" json:"alasan"`
	Status          string         `gorm:"type:varchar(255)" json:"status"`
	Executor        string         `gorm:"type:varchar(255)" json:"executor"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (LogKeringanan) TableName() string { return "tb_log_keringanan" }
