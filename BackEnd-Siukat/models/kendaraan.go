package models

type Kendaraan struct {
	IDKendaraan int    `gorm:"primaryKey;column:id_kendaraan" json:"id_kendaraan"`
	NoPeserta   string `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	StatusMotor string `gorm:"column:status_motor;type:enum('ada','tidak')" json:"status_motor"`
	JumlahMotor int    `gorm:"column:jumlah_motor" json:"jumlah_motor"`
	PajakMotor  int    `gorm:"column:pajak_motor" json:"pajak_motor"`
	ScanMotor   string `gorm:"column:scan_motor;type:varchar(255)" json:"scan_motor"`
	StatusMobil string `gorm:"column:status_mobil;type:enum('ada','tidak')" json:"status_mobil"`
	JumlahMobil int    `gorm:"column:jumlah_mobil" json:"jumlah_mobil"`
	PajakMobil  int    `gorm:"column:pajak_mobil" json:"pajak_mobil"`
	ScanMobil   string `gorm:"column:scan_mobil;type:varchar(255)" json:"scan_mobil"`
	Atribut     string `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
}

func (Kendaraan) TableName() string {
	return "tb_kendaraan"
}
