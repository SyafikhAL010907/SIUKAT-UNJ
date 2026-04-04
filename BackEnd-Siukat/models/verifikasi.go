package models

type Verifikasi struct {
	IDVerifikasi    int    `gorm:"primaryKey;column:id_verifikasi" json:"id_verifikasi"`
	NoPeserta       int    `gorm:"column:no_peserta" json:"no_peserta"`
	VerAkademik     string `gorm:"column:ver_akademik;type:enum('lolos','tidak_lolos','belum_verifikasi')" json:"ver_akademik"`
	KetAkademik     string `gorm:"column:ket_akademik;type:varchar(255)" json:"ket_akademik"`
	VerBidikMisi    string `gorm:"column:ver_bidik_misi;type:enum('lolos','tidak_lolos','belum_verifikasi')" json:"ver_bidik_misi"`
	KetBidikMisi    string `gorm:"column:ket_bidik_misi;type:varchar(255)" json:"ket_bidik_misi"`
	VerKeterampilan string `gorm:"column:ver_keterampilan;type:enum('lolos','tidak_lolos','belum_verifikasi')" json:"ver_keterampilan"`
	KetKeterampilan string `gorm:"column:ket_keterampilan;type:varchar(255)" json:"ket_keterampilan"`
	VerKjmu         string `gorm:"column:ver_kjmu;type:enum('lolos','tidak_lolos','belum_verifikasi')" json:"ver_kjmu"`
	KetKjmu         string `gorm:"column:ket_kjmu;type:varchar(255)" json:"ket_kjmu"`
	VerKipk         string `gorm:"column:ver_kipk;type:enum('lolos','tidak_lolos','belum_verifikasi')" json:"ver_kipk"`
	KetKipk         string `gorm:"column:ket_kipk;type:varchar(255)" json:"ket_kipk"`
}

func (Verifikasi) TableName() string {
	return "tb_verifikasi"
}
