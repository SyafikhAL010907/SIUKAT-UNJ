package models

import "gorm.io/gorm"

// LogRumah menyimpan log perubahan data rumah
type LogRumah struct {
	IdLogRumah           int            `gorm:"primaryKey;autoIncrement" json:"id_log_rumah"`
	NoPeserta            string         `gorm:"type:varchar(255)" json:"no_peserta"`
	BiayaPbb             float64        `gorm:"type:int" json:"biaya_pbb"`
	JumlahKepalaKeluarga float64        `gorm:"type:int" json:"jumlah_kepala_keluarga"`
	BiayaKontrak         float64        `gorm:"type:int" json:"biaya_kontrak"`
	Atribut              string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	Executor             string         `gorm:"type:varchar(255)" json:"executor"`
	DeletedAt            gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (LogRumah) TableName() string { return "tb_log_rumah" }
