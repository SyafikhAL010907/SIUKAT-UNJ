package models

import "time"

type LogListrik struct {
	IDLogListrik   int        `gorm:"primaryKey;column:id_log_listrik" json:"id_log_listrik"`
	NoPeserta      string     `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	NoPelanggan    string     `gorm:"column:no_pelanggan;type:varchar(255)" json:"no_pelanggan"`
	JenisPemakaian string     `gorm:"column:jenis_pemakaian;type:enum('prabayar','pascabayar')" json:"jenis_pemakaian"`
	Pengeluaran    int        `gorm:"column:pengeluaran" json:"pengeluaran"`
	ScanListrik    string     `gorm:"column:scan_listrik;type:varchar(255)" json:"scan_listrik"`
	Atribut        string     `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
	Executor       string     `gorm:"column:executor;type:varchar(255)" json:"executor"`
	Timestamp      *time.Time `gorm:"column:timestamp;type:datetime" json:"timestamp"`
}

func (LogListrik) TableName() string {
	return "log_listrik"
}
