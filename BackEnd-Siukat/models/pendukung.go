package models

type Pendukung struct {
	IDPendukung             int    `gorm:"primaryKey;column:id_pendukung" json:"id_pendukung"`
	NoPeserta               string `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	Tanggungan              int    `gorm:"column:tanggungan" json:"tanggungan"`
	ScanPernyataanUktTinggi string `gorm:"column:scan_pernyataan_ukt_tinggi;type:varchar(255)" json:"scan_pernyataan_ukt_tinggi"`
	ScanPernyataanKebenaran string `gorm:"column:scan_pernyataan_kebenaran;type:varchar(255)" json:"scan_pernyataan_kebenaran"`
	ScanKk                  string `gorm:"column:scan_kk;type:varchar(255)" json:"scan_kk"`
	Atribut                 string `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
}

func (Pendukung) TableName() string {
	return "tb_pendukung"
}
