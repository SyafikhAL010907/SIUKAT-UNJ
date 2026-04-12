package models

type User struct {
	NoPeserta  string      `gorm:"primaryKey;column:no_peserta;type:varchar(255)" json:"no_peserta"`
	Password   string      `gorm:"column:password;type:varchar(255)" json:"password"`
	Role       string      `gorm:"column:role;type:enum('cmahasiswa','admin','developer','operator','validator','belum_lengkap')" json:"role"`

	CMahasiswa *CMahasiswa `gorm:"foreignKey:NoPeserta;references:NoPeserta" json:"cmahasiswa,omitempty"`
	JalurMasuk string      `gorm:"column:jalur_masuk;type:varchar(255)" json:"jalur_masuk"`
}

func (User) TableName() string {
	return "tb_user"
}
