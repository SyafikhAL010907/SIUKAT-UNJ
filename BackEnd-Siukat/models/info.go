package models

import "time"

// Info merupakan mirror untuk tb_info
type Info struct {
	IdInfo          int       `gorm:"primaryKey;autoIncrement" json:"id_info"`
	WaktuBuka       time.Time `gorm:"type:datetime" json:"waktu_buka"`
	WaktuTutup      time.Time `gorm:"type:datetime" json:"waktu_tutup"`
	StatusPenilaian string    `gorm:"type:enum('belum_dinilai','dinilai','pengumuman')" json:"status_penilaian"`
}

func (Info) TableName() string { return "tb_info" }
