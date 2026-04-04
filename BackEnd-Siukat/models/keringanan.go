package models

type Keringanan struct {
	IDKeringanan   int    `gorm:"primaryKey;column:id_keringanan" json:"id_keringanan"`
	NoPeserta      string `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	ScanKeringanan string `gorm:"column:scan_keringanan;type:varchar(255)" json:"scan_keringanan"`
	Flag           string `gorm:"column:flag;type:enum('menunggu','ditolak','diterima')" json:"flag"`
	Atribut        string `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
}

func (Keringanan) TableName() string {
	return "tb_keringanan"
}
