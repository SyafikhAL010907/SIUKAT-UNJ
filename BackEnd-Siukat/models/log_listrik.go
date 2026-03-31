package models

import "gorm.io/gorm"

// LogListrik menyimpan log perubahan data listrik
type LogListrik struct {
	IdLogListrik int            `gorm:"primaryKey;autoIncrement" json:"id_log_listrik"`
	NoPeserta    string         `gorm:"type:varchar(255)" json:"no_peserta"`
	Pengeluaran  float64        `gorm:"type:int" json:"pengeluaran"`
	Atribut      string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	Executor     string         `gorm:"type:varchar(255)" json:"executor"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (LogListrik) TableName() string { return "tb_log_listrik" }
