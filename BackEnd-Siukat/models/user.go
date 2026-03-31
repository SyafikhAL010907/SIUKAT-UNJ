package models

import "gorm.io/gorm"

// User merupakan mirror dari tb_user
type User struct {
	NoPeserta  string         `gorm:"primaryKey;type:varchar(255)" json:"no_peserta"`
	Password   string         `gorm:"type:varchar(255)" json:"password"`
	Role       string         `gorm:"type:enum('cmahasiswa', 'admin')" json:"role"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"deleted_at"` // soft-delete

	// Association (GORM HasOne / BelongsTo)
	CMahasiswa CMahasiswa `gorm:"foreignKey:NoPeserta;references:NoPeserta" json:"cmahasiswa"`
}

func (User) TableName() string {
	return "tb_user" // Sesuai freezeTableName: true di Sequelize
}
