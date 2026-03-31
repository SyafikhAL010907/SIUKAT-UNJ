package models

import "gorm.io/gorm"

// Admin merupakan GORM Model untuk tabel tb_admin
type Admin struct {
	IdAdmin   int            `gorm:"primaryKey;autoIncrement" json:"id_admin"`
	Username  string         `gorm:"type:varchar(255)" json:"username"`
	Password  string         `gorm:"type:varchar(255)" json:"password"`
	Role      string         `gorm:"type:varchar(255)" json:"role"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (Admin) TableName() string { return "tb_admin" }
