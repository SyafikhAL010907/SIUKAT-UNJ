package models

import "gorm.io/gorm"

// LogWali menyimpan log perubahan data wali
type LogWali struct {
	IdLogWali       int            `gorm:"primaryKey;autoIncrement" json:"id_log_wali"`
	NoPeserta       string         `gorm:"type:varchar(255)" json:"no_peserta"`
	KesanggupanWali float64        `gorm:"type:decimal" json:"kesanggupan_wali"`
	Atribut         string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	Executor        string         `gorm:"type:varchar(255)" json:"executor"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (LogWali) TableName() string { return "tb_log_wali" }
