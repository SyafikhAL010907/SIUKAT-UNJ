package models

import "gorm.io/gorm"

// LogPendukung menyimpan log perubahan data pendukung
type LogPendukung struct {
	IdLogPendukung int            `gorm:"primaryKey;autoIncrement" json:"id_log_pendukung"`
	NoPeserta      string         `gorm:"type:varchar(255)" json:"no_peserta"`
	Tanggungan     float64        `gorm:"type:int" json:"tanggungan"`
	Atribut        string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	Executor       string         `gorm:"type:varchar(255)" json:"executor"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (LogPendukung) TableName() string { return "tb_log_pendukung" }
