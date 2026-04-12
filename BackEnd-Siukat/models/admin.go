package models

type Admin struct {
	Username    string `gorm:"primaryKey;column:username;type:varchar(255)" json:"username"`
	Password    string `gorm:"column:password;type:varchar(255)" json:"password"`
	NamaLengkap string `gorm:"column:nama_lengkap;type:varchar(255)" json:"nama_lengkap"`
	NoTelepon   string `gorm:"column:no_telepon;type:varchar(255)" json:"no_telepon"`
	Role        string `gorm:"column:role;type:enum('developer','operator','validator')" json:"role"`
	Foto        string `gorm:"column:foto;type:varchar(255)" json:"foto"`
}

func (Admin) TableName() string {
	return "tb_admin"
}
