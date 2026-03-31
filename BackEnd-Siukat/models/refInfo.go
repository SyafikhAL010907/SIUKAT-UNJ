package models

import "time"

// RefInfo adalah model untuk tabel ref_info (data referensi informasi statis)
type RefInfo struct {
	ID        int        `gorm:"primaryKey;autoIncrement" json:"id"`
	Key       string     `gorm:"type:varchar(255)" json:"key"`
	Value     string     `gorm:"type:text" json:"value"`
	CreatedAt *time.Time `gorm:"type:datetime" json:"created_at"`
}

func (RefInfo) TableName() string { return "ref_info" }
