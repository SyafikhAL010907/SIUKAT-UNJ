package models

type Rumah struct {
	IDRumah              int    `gorm:"primaryKey;column:id_rumah" json:"id_rumah"`
	NoPeserta            string `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	StatusKepemilikan    string `gorm:"column:status_kepemilikan;type:enum('milik_sendiri','bersama_saudara','kontrak','menumpang')" json:"status_kepemilikan"`
	LuasTanah            string `gorm:"column:luas_tanah;type:varchar(255)" json:"luas_tanah"`
	LuasBangunan         string `gorm:"column:luas_bangunan;type:varchar(255)" json:"luas_bangunan"`
	StatusSertifikat     string `gorm:"column:status_sertifikat;type:enum('hak_milik','hak_guna_bangunan','tanpa_sertifikat','tanah_girik','lainnya')" json:"status_sertifikat"`
	BiayaPbb             int    `gorm:"column:biaya_pbb" json:"biaya_pbb"`
	ScanPbb              string `gorm:"column:scan_pbb;type:varchar(255)" json:"scan_pbb"`
	BiayaKontrak         int    `gorm:"column:biaya_kontrak" json:"biaya_kontrak"`
	ScanKontrak          string `gorm:"column:scan_kontrak;type:varchar(255)" json:"scan_kontrak"`
	JumlahKepalaKeluarga int    `gorm:"column:jumlah_kepala_keluarga" json:"jumlah_kepala_keluarga"`
	Atribut              string `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
}

func (Rumah) TableName() string {
	return "tb_rumah"
}
