package models

type Captcha struct {
	Kode       int    `gorm:"primaryKey;column:kode" json:"kode"`
	Pertanyaan string `gorm:"column:pertanyaan;type:varchar(255)" json:"pertanyaan"`
	Jawaban    int    `gorm:"column:jawaban" json:"jawaban"`
}

func (Captcha) TableName() string {
	return "captcha"
}
