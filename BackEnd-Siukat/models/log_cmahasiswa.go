package models

import "time"

type LogCMahasiswa struct {
	IDLogCmahasiswa        int        `gorm:"primaryKey;column:id_log_cmahasiswa" json:"id_log_cmahasiswa"`
	NoPeserta              string     `gorm:"column:no_peserta;type:varchar(255)" json:"no_peserta"`
	NamaCmahasiswa         string     `gorm:"column:nama_cmahasiswa;type:varchar(255)" json:"nama_cmahasiswa"`
	BidikMisiCmahasiswa    string     `gorm:"column:bidik_misi_cmahasiswa;type:varchar(255)" json:"bidik_misi_cmahasiswa"`
	FakultasCmahasiswa     int        `gorm:"column:fakultas_cmahasiswa" json:"fakultas_cmahasiswa"`
	ProdiCmahasiswa        string     `gorm:"column:prodi_cmahasiswa;type:varchar(255)" json:"prodi_cmahasiswa"`
	JalurCmahasiswa        string     `gorm:"column:jalur_cmahasiswa;type:char(1)" json:"jalur_cmahasiswa"`
	SosmedCmahasiswa       string     `gorm:"column:sosmed_cmahasiswa;type:varchar(255)" json:"sosmed_cmahasiswa"`
	AlamatCmahasiswa       string     `gorm:"column:alamat_cmahasiswa;type:text" json:"alamat_cmahasiswa"`
	ProvinsiCmahasiswa     string     `gorm:"column:provinsi_cmahasiswa;type:varchar(255)" json:"provinsi_cmahasiswa"`
	KabkotCmahasiswa       string     `gorm:"column:kabkot_cmahasiswa;type:varchar(255)" json:"kabkot_cmahasiswa"`
	KecamatanCmahasiswa    string     `gorm:"column:kecamatan_cmahasiswa;type:varchar(255)" json:"kecamatan_cmahasiswa"`
	GenderCmahasiswa       string     `gorm:"column:gender_cmahasiswa;type:enum('laki-laki','perempuan')" json:"gender_cmahasiswa"`
	TeleponCmahasiswa      string     `gorm:"column:telepon_cmahasiswa;type:varchar(255)" json:"telepon_cmahasiswa"`
	GoldarCmahasiswa       string     `gorm:"column:goldar_cmahasiswa;type:varchar(255)" json:"goldar_cmahasiswa"`
	TempatLahirCmahasiswa  string     `gorm:"column:tempat_lahir_cmahasiswa;type:varchar(255)" json:"tempat_lahir_cmahasiswa"`
	TanggalLahirCmahasiswa *time.Time `gorm:"column:tanggal_lahir_cmahasiswa;type:date" json:"tanggal_lahir_cmahasiswa"`
	FotoCmahasiswa         string     `gorm:"column:foto_cmahasiswa;type:varchar(255)" json:"foto_cmahasiswa"`
	PenghasilanCmahasiswa  int        `gorm:"column:penghasilan_cmahasiswa" json:"penghasilan_cmahasiswa"`
	GolonganID             string     `gorm:"column:golongan_id" json:"golongan_id"`
	UktTinggi              string     `gorm:"column:ukt_tinggi;type:enum('ya','tidak')" json:"ukt_tinggi"`
	Flag                   string     `gorm:"column:flag;type:enum('belum_login','pengisian','selesai_isi','pengumuman','terima_ukt','sanggah_ukt','selesai_sanggah')" json:"flag"`
	WaktuSelesai           *time.Time `gorm:"column:waktu_selesai;type:datetime" json:"waktu_selesai"`
	Atribut                string     `gorm:"column:atribut;type:enum('original','sanggah')" json:"atribut"`
	Tagihan                string     `gorm:"column:tagihan;type:varchar(255)" json:"tagihan"`
	NoRegistrasi           string     `gorm:"column:no_registrasi;type:varchar(255)" json:"no_registrasi"`
	Executor               string     `gorm:"column:executor;type:varchar(255)" json:"executor"`
	Timestamp              *time.Time `gorm:"column:timestamp;type:datetime" json:"timestamp"`
}

func (LogCMahasiswa) TableName() string {
	return "log_cmahasiswa"
}
