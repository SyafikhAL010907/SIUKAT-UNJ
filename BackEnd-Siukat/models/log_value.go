package models

import "time"

type LogValue struct {
	IDLogValue int        `gorm:"primaryKey;column:id_log_value" json:"id_log_value"`
	NoPeserta  int        `gorm:"column:no_peserta" json:"no_peserta"`
	V1         int        `gorm:"column:v1" json:"v1"`
	V2         int        `gorm:"column:v2" json:"v2"`
	V3         int        `gorm:"column:v3" json:"v3"`
	V4         int        `gorm:"column:v4" json:"v4"`
	V5         int        `gorm:"column:v5" json:"v5"`
	Av1        int        `gorm:"column:av1" json:"av1"`
	Bv2        int        `gorm:"column:bv2" json:"bv2"`
	Cv3        int        `gorm:"column:cv3" json:"cv3"`
	Dv4        int        `gorm:"column:dv4" json:"dv4"`
	Ev5        int        `gorm:"column:ev5" json:"ev5"`
	Ikb        int        `gorm:"column:ikb" json:"ikb"`
	Atribut    string     `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
	Executor   string     `gorm:"column:executor;type:varchar(255)" json:"executor"`
	Timestamp  *time.Time `gorm:"column:timestamp;type:datetime" json:"timestamp"`
}

func (LogValue) TableName() string {
	return "log_value"
}
