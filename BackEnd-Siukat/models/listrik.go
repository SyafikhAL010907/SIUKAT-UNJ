package models

type Listrik struct {
	IDListrik      int    `gorm:"primaryKey;column:id_listrik" json:"id_listrik"`
	NoPeserta      string `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	NoPelanggan    string `gorm:"column:no_pelanggan;type:varchar(255)" json:"no_pelanggan"`
	JenisPemakaian string `gorm:"column:jenis_pemakaian;type:enum('prabayar','pascabayar')" json:"jenis_pemakaian"`
	Pengeluaran    int    `gorm:"column:pengeluaran" json:"pengeluaran"`
	ScanListrik    string `gorm:"column:scan_listrik;type:varchar(255)" json:"scan_listrik"`
	Atribut        string `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
}

func (Listrik) TableName() string {
	return "tb_listrik"
}
