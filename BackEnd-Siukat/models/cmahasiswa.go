package models

import (
    "time"
    "gorm.io/gorm"
)

// CMahasiswa adalah representasi dari tabel tb_cmahasiswa.
// Semua relasi yang mengarah ke bio_cmahasiswa telah DIHAPUS.
type CMahasiswa struct {
	IdCMahasiswa           int        `gorm:"primaryKey;autoIncrement" json:"id_cmahasiswa"`
	NoPeserta              string     `gorm:"type:varchar(255)" json:"no_peserta"`
	NamaCMahasiswa         string     `gorm:"type:varchar(255)" json:"nama_cmahasiswa"`
	BidikMisiCMahasiswa    string     `gorm:"type:varchar(255)" json:"bidik_misi_cmahasiswa"`
	FakultasCMahasiswa     int        `gorm:"type:int" json:"fakultas_cmahasiswa"`
	ProdiCMahasiswa        int        `gorm:"type:int" json:"prodi_cmahasiswa"`
	JalurCMahasiswa        string     `gorm:"type:char(1)" json:"jalur_cmahasiswa"`
	SosmedCMahasiswa       string     `gorm:"type:varchar(255)" json:"sosmed_cmahasiswa"`
	AlamatCMahasiswa       string     `gorm:"type:varchar(255)" json:"alamat_cmahasiswa"`
	ProvinsiCMahasiswa     int        `gorm:"type:int" json:"provinsi_cmahasiswa"`
	KabkotCMahasiswa       int        `gorm:"type:int" json:"kabkot_cmahasiswa"`
	KecamatanCMahasiswa    int        `gorm:"type:int" json:"kecamatan_cmahasiswa"`
	GenderCMahasiswa       string     `gorm:"type:enum('laki-laki','perempuan')" json:"gender_cmahasiswa"`
	TeleponCMahasiswa      string     `gorm:"type:varchar(255)" json:"telepon_cmahasiswa"`
	GoldarCMahasiswa       string     `gorm:"type:varchar(255)" json:"goldar_cmahasiswa"`
	TempatLahirCMahasiswa  string     `gorm:"type:varchar(255)" json:"tempat_lahir_cmahasiswa"`
	TanggalLahirCMahasiswa *time.Time `gorm:"type:date" json:"tanggal_lahir_cmahasiswa"`
	FotoCMahasiswa         string     `gorm:"type:varchar(255)" json:"foto_cmahasiswa"`
	PenghasilanCMahasiswa  int        `gorm:"type:int" json:"penghasilan_cmahasiswa"`
	GolonganId             string     `gorm:"type:varchar(255)" json:"golongan_id"`
	UktTinggi              string     `gorm:"type:enum('ya','tidak')" json:"ukt_tinggi"`
	Flag                   string     `gorm:"type:enum('belum_login','pengisian','selesai_isi','pengumuman','terima_ukt','sanggah_ukt','selesai_sanggah')" json:"flag"`
	WaktuSelesai           *time.Time `gorm:"type:datetime" json:"waktu_selesai"`
	Atribut                string     `gorm:"type:enum('original','sanggah')" json:"atribut"`
	Tagihan                string     `gorm:"type:varchar(255)" json:"tagihan"`
	NoRegistrasi           string     `gorm:"type:varchar(255)" json:"no_registrasi"`
	Spu                    int        `gorm:"type:int" json:"spu"`
	Penalty                string     `gorm:"type:enum('1','0')" json:"penalty"`

	// Soft Delete (replacement for paranoid: true)
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`

	// Associations - NO BIO_ REFERENCES
	Fakultas  Fakultas  `gorm:"foreignKey:FakultasCMahasiswa" json:"fakultas"`
	Prodi     Prodi     `gorm:"foreignKey:ProdiCMahasiswa" json:"prodi"`
	Provinsi  Provinsi  `gorm:"foreignKey:ProvinsiCMahasiswa" json:"provinsi"`
	Kabkot    Kabkot    `gorm:"foreignKey:KabkotCMahasiswa" json:"kabkot"`
	Kecamatan Kecamatan `gorm:"foreignKey:KecamatanCMahasiswa" json:"kecamatan"`
	Ukt       Ukt       `gorm:"foreignKey:ProdiCMahasiswa;references:MajorId" json:"ukt"`
}

func (CMahasiswa) TableName() string {
	return "tb_cmahasiswa" // FreezeTableName
}
