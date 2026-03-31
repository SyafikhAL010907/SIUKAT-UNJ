package models

// Captcha mereplikasi verifikasi bot tb_captcha
type Captcha struct {
	Id         uint   `gorm:"primaryKey"`
	Kode       string `gorm:"type:varchar(255)" json:"kode"`
	Pertanyaan string `gorm:"type:varchar(255)" json:"pertanyaan"`
	Jawaban    string `gorm:"type:varchar(255)" json:"jawaban"`
}

func (Captcha) TableName() string { return "tb_captcha" }
