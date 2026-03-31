package models

import (
	"time"
	"gorm.io/gorm"
)

// LogValue merupakan mirror dari tb_log_value
type LogValue struct {
	IdLogValue int            `gorm:"primaryKey;autoIncrement" json:"id_log_value"`
	NoPeserta  string         `gorm:"type:varchar(255)" json:"no_peserta"`
	V1         float64        `gorm:"type:decimal" json:"v1"`
	V2         float64        `gorm:"type:decimal" json:"v2"`
	V3         float64        `gorm:"type:decimal" json:"v3"`
	V4         float64        `gorm:"type:decimal" json:"v4"`
	V5         float64        `gorm:"type:decimal" json:"v5"`
	Av1        float64        `gorm:"type:decimal" json:"av1"`
	Bv2        float64        `gorm:"type:decimal" json:"bv2"`
	Cv3        float64        `gorm:"type:decimal" json:"cv3"`
	Dv4        float64        `gorm:"type:decimal" json:"dv4"`
	Ev5        float64        `gorm:"type:decimal" json:"ev5"`
	Ikb        float64        `gorm:"type:decimal" json:"ikb"`
	Atribut    string         `gorm:"type:enum('original','sanggah')" json:"atribut"`
	Executor   string         `gorm:"type:varchar(255)" json:"executor"`
	Timestamp  time.Time      `gorm:"type:datetime" json:"timestamp"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (LogValue) TableName() string {
	return "tb_log_value" // assuming table name is tb_log_value
}
