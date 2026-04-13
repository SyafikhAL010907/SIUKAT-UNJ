package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/utils"
	"errors"
	"fmt"
	"os"
	"time"

	"gorm.io/gorm"
)

type CMahasiswaService struct{}

// generateTagihan — Parity penuh dengan Node.js
// Di Node.js: stage dari info.stage || process.env.STAGE
// Di Go: stage dari info.StatusPenilaian || os.Getenv("STAGE")
func GenerateTagihan(info models.Info, noPeserta string) (string, error) {
	year := time.Now().Format("06") // "YY" — identik dengan moment().format("YY")

	// Prioritas: dari DB (info.Stage), fallback ke env STAGE
	stageSource := info.Stage
	if stageSource == "" {
		stageSource = os.Getenv("STAGE")
	}

	var stage string
	switch stageSource {
	case "snmptn", "snbt":
		stage = "1"
	case "sbmptn":
		stage = "2"
	case "japres":
		stage = "2"
	case "mandiri":
		stage = "3"
	default:
		return "", fmt.Errorf("stage tidak valid: %s", stageSource)
	}

	tagihan := year + stage + noPeserta
	return tagihan, nil
}

func (s *CMahasiswaService) All() ([]models.CMahasiswa, error) {
	db := config.DB
	var result []models.CMahasiswa
	err := db.Model(&models.CMahasiswa{}).
		Preload("Fakultas").Preload("Prodi").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Joins("LEFT JOIN tb_cmahasiswa AS t2 ON tb_cmahasiswa.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'").
		Where("tb_cmahasiswa.atribut = 'sanggah' OR (tb_cmahasiswa.atribut = 'original' AND t2.id_cmahasiswa IS NULL)").
		Find(&result).Error
	return result, err
}

func (s *CMahasiswaService) AllSelesai() ([]models.CMahasiswa, error) {
	db := config.DB
	var result []models.CMahasiswa
	err := db.Model(&models.CMahasiswa{}).
		Preload("Fakultas").Preload("Prodi").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Joins("LEFT JOIN tb_cmahasiswa AS t2 ON tb_cmahasiswa.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'").
		Where("tb_cmahasiswa.flag = ? AND tb_cmahasiswa.ukt_tinggi = ?", "selesai_isi", "tidak").
		Where("tb_cmahasiswa.atribut = 'sanggah' OR (tb_cmahasiswa.atribut = 'original' AND t2.id_cmahasiswa IS NULL)").
		Find(&result).Error
	return result, err
}

func (s *CMahasiswaService) Add(req models.CMahasiswa, atribut string) (models.CMahasiswa, error) {
	db := config.DB
	req.Atribut = atribut
	err := db.Create(&req).Error
	return req, err
}

func (s *CMahasiswaService) Edit(data map[string]interface{}, noPeserta string, atribut string) (models.CMahasiswa, error) {
	db := config.DB
	
	fmt.Printf("📝 DB UPDATE: Updating Student [%s] Atribut [%s] with data: %v\n", noPeserta, atribut, data)
	
	if err := db.Model(&models.CMahasiswa{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(data).Error; err != nil {
		fmt.Printf("❌ DB UPDATE ERROR: %v\n", err)
		return models.CMahasiswa{}, err
	}
	
	var mhs models.CMahasiswa
	if err := db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&mhs).Error; err != nil {
		// Fallback jika First gagal (mungkin no_peserta sedang berganti)
		fmt.Printf("⚠️ DB UPDATE: Record not found with exact atribut [%s] after update, trying pure NP lookup...\n", atribut)
		db.Where("no_peserta = ?", noPeserta).First(&mhs)
	}
	
	fmt.Printf("✅ DB UPDATE SUCCESS: Photo in record is now [%s]\n", mhs.FotoCmahasiswa)
	return mhs, nil
}

func (s *CMahasiswaService) AddLog(user models.CMahasiswa, executor string, timestamp *time.Time) (models.LogCMahasiswa, error) {
	db := config.DB
	logMhs := models.LogCMahasiswa{
		NoPeserta:              user.NoPeserta,
		NamaCmahasiswa:         user.NamaCmahasiswa,
		BidikMisiCmahasiswa:    user.BidikMisiCmahasiswa,
		FakultasCmahasiswa:     user.FakultasCmahasiswa,
		ProdiCmahasiswa:        user.ProdiCmahasiswa,
		JalurCmahasiswa:        user.JalurCmahasiswa,
		SosmedCmahasiswa:       user.SosmedCmahasiswa,
		AlamatCmahasiswa:       user.AlamatCmahasiswa,
		ProvinsiCmahasiswa:     user.ProvinsiCmahasiswa,
		KabkotCmahasiswa:       user.KabkotCmahasiswa,
		KecamatanCmahasiswa:    user.KecamatanCmahasiswa,
		GenderCmahasiswa:       user.GenderCmahasiswa,
		TeleponCmahasiswa:      user.TeleponCmahasiswa,
		GoldarCmahasiswa:       user.GoldarCmahasiswa,
		TempatLahirCmahasiswa:  user.TempatLahirCmahasiswa,
		TanggalLahirCmahasiswa: user.TanggalLahirCmahasiswa,
		FotoCmahasiswa:         user.FotoCmahasiswa,
		PenghasilanCmahasiswa:  user.PenghasilanCmahasiswa,
		GolonganID:             user.GolonganID,
		UktTinggi:              user.UktTinggi,
		Flag:                   user.Flag,
		WaktuSelesai:           user.WaktuSelesai,
		Atribut:                user.Atribut,
		Tagihan:                user.Tagihan,
		NoRegistrasi:           user.NoRegistrasi,
		Executor:               executor,
		Timestamp:              timestamp,
	}
	err := db.Create(&logMhs).Error
	return logMhs, err
}

func (s *CMahasiswaService) UktTinggi(golonganId string, noPeserta string) error {
	db := config.DB
	return db.Model(&models.CMahasiswa{}).Where("no_peserta = ?", noPeserta).Updates(map[string]interface{}{
		"golongan_id": golonganId,
		"ukt_tinggi":  "ya",
		"flag":        "pengisian",
	}).Error
}

func (s *CMahasiswaService) UktTinggiTidak(noPeserta string) error {
	db := config.DB
	return db.Model(&models.CMahasiswa{}).Where("no_peserta = ?", noPeserta).Updates(map[string]interface{}{
		"ukt_tinggi": "tidak",
		"flag":       "pengisian",
	}).Error
}

// Fix #5: CheckData — Parity penuh dengan cmahasiswa.js Node.js
// Cek semua field mandatory, bukan hanya 3 field
func (s *CMahasiswaService) CheckData(noPeserta string) (bool, error) {
	db := config.DB
	var mhs models.CMahasiswa
	if err := db.Where("no_peserta = ?", noPeserta).First(&mhs).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}

	// Replicating Node.js "delete and check" logic using a map
	data := map[string]interface{}{
		"no_peserta":               mhs.NoPeserta,
		"nama_cmahasiswa":         mhs.NamaCmahasiswa,
		"bidik_misi_cmahasiswa":    mhs.BidikMisiCmahasiswa,
		"fakultas_cmahasiswa":     mhs.FakultasCmahasiswa,
		"prodi_cmahasiswa":        mhs.ProdiCmahasiswa,
		"jalur_cmahasiswa":        mhs.JalurCmahasiswa,
		"sosmed_cmahasiswa":       mhs.SosmedCmahasiswa,
		"alamat_cmahasiswa":       mhs.AlamatCmahasiswa,
		"provinsi_cmahasiswa":     mhs.ProvinsiCmahasiswa,
		"kabkot_cmahasiswa":       mhs.KabkotCmahasiswa,
		"kecamatan_cmahasiswa":    mhs.KecamatanCmahasiswa,
		"gender_cmahasiswa":       mhs.GenderCmahasiswa,
		"telepon_cmahasiswa":      mhs.TeleponCmahasiswa,
		"goldar_cmahasiswa":       mhs.GoldarCmahasiswa,
		"tempat_lahir_cmahasiswa": mhs.TempatLahirCmahasiswa,
		"tanggal_lahir_cmahasiswa": mhs.TanggalLahirCmahasiswa,
		"foto_cmahasiswa":         mhs.FotoCmahasiswa,
		"penghasilan_cmahasiswa":  mhs.PenghasilanCmahasiswa,
		"golongan_id":             mhs.GolonganID,
		"ukt_tinggi":              mhs.UktTinggi,
		// Field di bawah ini ditiadakan dari checklist awal biar centang muncul pas data siap
		// "flag":                   mhs.Flag,
		// "waktu_selesai":           mhs.WaktuSelesai,
		// "atribut":                mhs.Atribut,
	}

	delete(data, "tagihan")
	delete(data, "no_registrasi")
	delete(data, "penghasilan_cmahasiswa")
	delete(data, "spu")
	delete(data, "penalty")

	if mhs.UktTinggi == "ya" {
		delete(data, "sosmed_cmahasiswa")
	} else {
		delete(data, "golongan_id")
	}

	for _, val := range data {
		if val == nil || val == "" || val == 0 {
			return false, nil
		}
	}

	return true, nil
}

func (s *CMahasiswaService) SelesaiIsi(info models.Info, noPeserta string, atribut string) error {
	db := config.DB
	now := time.Now()

	tagihan, err := GenerateTagihan(info, noPeserta)
	if err != nil {
		// Fallback jika stage tidak dikenal — gunakan format sederhana
		tagihan = noPeserta
	}

	return db.Model(&models.CMahasiswa{}).Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).Updates(map[string]interface{}{
		"flag":          "selesai_isi",
		"waktu_selesai": now,
		"tagihan":       tagihan,
	}).Error
}

func (s *CMahasiswaService) FlagTerima(noPeserta string) error {
	return config.DB.Model(&models.CMahasiswa{}).Where("no_peserta = ?", noPeserta).Update("flag", "terima_ukt").Error
}

func (s *CMahasiswaService) FlagKlarifikasi(noPeserta string) error {
	return config.DB.Model(&models.CMahasiswa{}).Where("no_peserta = ?", noPeserta).Update("flag", "sanggah_ukt").Error
}

func (s *CMahasiswaService) FlagBatalKlarifikasi(noPeserta string) error {
	now := time.Now()
	return config.DB.Model(&models.CMahasiswa{}).Where("no_peserta = ?", noPeserta).Updates(map[string]interface{}{
		"flag":          "terima_ukt",
		"waktu_selesai": now,
	}).Error
}

func (s *CMahasiswaService) FlagSelesaiKlarifikasi(noPeserta string) error {
	return config.DB.Model(&models.CMahasiswa{}).Where("no_peserta = ?", noPeserta).Update("flag", "selesai_sanggah").Error
}

func (s *CMahasiswaService) GetCmahasiswa(noPeserta string) (models.CMahasiswa, error) {
	db := config.DB
	var mhs models.CMahasiswa

	// 1. Cek sanggah dulu dengan Preload (Relasi Lengkap)
	err := db.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&mhs).Error
	if err == nil {
		return mhs, nil
	}

	// 2. Cek original dengan Preload (Relasi Lengkap)
	err = db.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&mhs).Error
	if err == nil {
		return mhs, nil
	}

	// 3. FALLBACK: Jika Preload gagal atau relasi tidak ditemukan
	// Kita tarik MURNI data dari tb_cmahasiswa dengan PRIORITAS tetap (Sanggah > Original)
	fmt.Printf("\u26a0\ufe0f WARNING: Preload gagal untuk %s, mencoba ambil data murni...\n", noPeserta)
	
	// Cek Sanggah murni
	if err := db.Where("no_peserta = ? AND atribut = ?", noPeserta, "sanggah").First(&mhs).Error; err == nil {
		return mhs, nil
	}
	
	// Cek Original murni (First or anyway find something)
	err = db.Where("no_peserta = ?", noPeserta).First(&mhs).Error
	
	return mhs, err
}

// GetCmahasiswaByAtribut — Ambil data mahasiswa dengan atribut spesifik (original/sanggah)
func (s *CMahasiswaService) GetCmahasiswaByAtribut(noPeserta string, atribut string) (models.CMahasiswa, error) {
	db := config.DB
	var mhs models.CMahasiswa

	err := db.Preload("Fakultas").Preload("Prodi").Preload("Provinsi").Preload("Kabkot").Preload("Kecamatan").
		Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&mhs).Error
	if err != nil {
		// Try without preload if failed
		err = db.Where("no_peserta = ? AND atribut = ?", noPeserta, atribut).First(&mhs).Error
	}

	return mhs, err
}

// GetSanggah — Ambil mahasiswa yang dalam status sanggah UKT
func (s *CMahasiswaService) GetSanggah() ([]models.CMahasiswa, error) {
	var data []models.CMahasiswa
	err := config.DB.Preload("Fakultas").Preload("Prodi").
		Where("flag = ?", "sanggah_ukt").Find(&data).Error
	return data, err
}

// GetBM — Ambil mahasiswa Bidik Misi
func (s *CMahasiswaService) GetBM() ([]models.CMahasiswa, error) {
	var data []models.CMahasiswa
	err := config.DB.Preload("Fakultas").Preload("Prodi").
		Where("bidik_misi_cmahasiswa = ?", "Ya").Find(&data).Error
	return data, err
}

// CekTagihan — Cek apakah no_peserta sudah punya tagihan
func (s *CMahasiswaService) CekTagihan(noPeserta string) (models.CMahasiswa, error) {
	var mhs models.CMahasiswa
	err := config.DB.Where("no_peserta = ? AND tagihan IS NOT NULL AND tagihan != ''", noPeserta).First(&mhs).Error
	return mhs, err
}

// UpdateIdentity — Sinkronisasi Nama, NoPeserta, dan Path Folder di seluruh Database & Filesystem.
// Ini dieksekusi jika user mengubah Nama Lengkap atau Nomor Peserta di form biodata.
func (s *CMahasiswaService) UpdateIdentity(oldName, oldNP, newName, newNP string) error {
	db := config.DB

	// 1. Sinkronisasi Folder Fisik (Rename/Merge) di /uploads
	if err := utils.SyncStudentFolder(oldName, oldNP, newName, newNP); err != nil {
		return fmt.Errorf("gagal sinkronisasi folder fisik: %v", err)
	}

	// 2. Hitung nama folder lama & baru untuk replacement di DB path
	oldFolder := fmt.Sprintf("%s_%s", utils.SanitizeString(oldName), oldNP)
	newFolder := fmt.Sprintf("%s_%s", utils.SanitizeString(newName), newNP)

	// Jika tidak ada perubahan folder, dan no_peserta ttp sama, ttp return nil
	if oldFolder == newFolder && oldNP == newNP {
		return nil
	}

	// 3. Jalankan Update Database secara massal (Atomic Transaction)
	return db.Transaction(func(tx *gorm.DB) error {
		// A. Update NoPeserta di tabel utama dan semua tabel pendukung jika NoPeserta berubah
		if oldNP != newNP {
			tables := []string{
				"tb_user", "tb_cmahasiswa", "tb_ayah", "tb_ibu", "tb_wali",
				"tb_rumah", "tb_listrik", "tb_kendaraan", "tb_pendukung",
				"tb_verifikasi", "tb_summary_data", "tb_bobot_ekonomi",
			}
			for _, table := range tables {
				if err := tx.Exec(fmt.Sprintf("UPDATE %s SET no_peserta = ? WHERE no_peserta = ?", table), newNP, oldNP).Error; err != nil {
					return fmt.Errorf("failed to update no_peserta in %s: %v", table, err)
				}
			}
		}

		// B. Update Semua Path File (Replace Folder Name di string path)
		fileColumns := map[string][]string{
			"tb_cmahasiswa": {"foto_cmahasiswa"},
			"tb_ayah":      {"scan_ktp_ayah", "scan_slip_ayah"},
			"tb_ibu":       {"scan_ktp_ibu", "scan_slip_ibu"},
			"tb_wali":      {"scan_wali"},
			"tb_rumah":      {"scan_pbb", "scan_kontrak"},
			"tb_listrik":    {"scan_listrik"},
			"tb_kendaraan":  {"scan_stnk"},
			"tb_pendukung":  {"scan_pernyataan_ukt_tinggi", "scan_pernyataan_kebenaran", "scan_kk"},
		}

		targetNP := newNP // NoPeserta baru (karena sudah diupdate di atas jika berubah)

		for table, columns := range fileColumns {
			for _, col := range columns {
				query := fmt.Sprintf("UPDATE %s SET %s = REPLACE(%s, ?, ?) WHERE no_peserta = ?", table, col, col)
				if err := tx.Exec(query, oldFolder, newFolder, targetNP).Error; err != nil {
					return fmt.Errorf("failed to update paths in %s.%s: %v", table, col, err)
				}
			}
		}

		return nil
	})
}
// CountFlag — Parity dengan Node.js untuk statistik dashboard admin
func (s *CMahasiswaService) CountFlag() (map[string]interface{}, error) {
	db := config.DB
	
	result := make(map[string]interface{})
	
	// List of categories to count
	categories := []struct {
		Key   string
		Field string
		Value string
	}{
		{"belum_isi", "flag", "belum_isi"},
		{"pengisian", "flag", "pengisian"},
		{"selesai_isi", "flag", "selesai_isi"},
		{"pengumuman", "flag", "pengumuman"},
		{"terima_ukt", "flag", "terima_ukt"},
		{"sanggah_ukt", "flag", "sanggah_ukt"},
		{"selesai_sanggah", "flag", "selesai_sanggah"},
		{"ukt_tinggi", "ukt_tinggi", "ya"},
		{"ukt_tinggi_tidak", "ukt_tinggi", "tidak"},
	}

	for _, cat := range categories {
		var count int64
		// Gunakan logic "Pintar" (Priority Sanggah > Original) untuk menghindari double count di statistik
		err := db.Table("tb_cmahasiswa").
			Joins("LEFT JOIN tb_cmahasiswa AS t2 ON tb_cmahasiswa.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'").
			Where(fmt.Sprintf("tb_cmahasiswa.%s = ?", cat.Field), cat.Value).
			Where("tb_cmahasiswa.atribut = 'sanggah' OR (tb_cmahasiswa.atribut = 'original' AND t2.id_cmahasiswa IS NULL)").
			Count(&count).Error
			
		if err != nil {
			return nil, err
		}
		// Format: kategori: [{kategori: count}]
		result[cat.Key] = []map[string]int64{{cat.Key: count}}
	}

	return result, nil
}

// PopulateHasSanggah — Helper massal buat nge-cek status sanggah tiap mahasiswa di list
// Biar frontend tau baris mana yang tombol Sanggah-nya harus diumpetin (PENTING buat Integritas Data)
func (s *CMahasiswaService) PopulateHasSanggah(mhs []models.CMahasiswa) {
	if len(mhs) == 0 {
		return
	}

	var pks []string
	for _, m := range mhs {
		pks = append(pks, m.NoPeserta)
	}

	var hasSanggahMap = make(map[string]bool)
	var sanggahRecords []struct{ NoPeserta string }
	config.DB.Table("tb_cmahasiswa").Where("no_peserta IN ? AND atribut = ?", pks, "sanggah").Select("no_peserta").Find(&sanggahRecords)
	
	for _, r := range sanggahRecords {
		hasSanggahMap[r.NoPeserta] = true
	}

	for i := range mhs {
		mhs[i].HasSanggah = hasSanggahMap[mhs[i].NoPeserta]
	}
}

// Datatable — Pagination & Search untuk daftar mahasiswa
func (s *CMahasiswaService) Datatable(page, perPage int, keyword string) (map[string]interface{}, error) {
	db := config.DB
	var mhs []models.CMahasiswa
	var count int64

	// Smart Prioritas (v2 - Metode JOIN): Memberi prioritas Sanggah > Original.
	// Kita join tabel ini ke dirinya sendiri (t2) untuk mendeteksi apakah baris original punya pasangan baris sanggah.
	query := db.Model(&models.CMahasiswa{}).Preload("Fakultas").Preload("Prodi").
		Joins("LEFT JOIN tb_cmahasiswa AS t2 ON tb_cmahasiswa.no_peserta = t2.no_peserta AND t2.atribut = 'sanggah'").
		Where("tb_cmahasiswa.atribut = 'sanggah' OR (tb_cmahasiswa.atribut = 'original' AND t2.id_cmahasiswa IS NULL)")
	
	if keyword != "" {
		query = query.Where("(tb_cmahasiswa.no_peserta LIKE ? OR tb_cmahasiswa.nama_cmahasiswa LIKE ?)", "%"+keyword+"%", "%"+keyword+"%")
	}

	if err := query.Count(&count).Error; err != nil {
		return nil, err
	}

	offset := (page - 1) * perPage
	if err := query.Limit(perPage).Offset(offset).Find(&mhs).Error; err != nil {
		return nil, err
	}

	// 1. Cek Status Sanggah secara massal (Helper-based)
	s.PopulateHasSanggah(mhs)

	// 2. Hitung Nominal UKT berdasarkan GolonganID untuk tiap baris
	for i := range mhs {

		var ukt models.Ukt
		// Find correct UKT record for this specific student's prodi and entrance path
		if err := db.Where("major_id = ? AND entrance = ?", mhs[i].ProdiCmahasiswa, mhs[i].JalurCmahasiswa).First(&ukt).Error; err == nil {
			mhs[i].Ukt = &ukt
			switch mhs[i].GolonganID {
			case "I":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.I
			case "II":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.II
			case "III":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.III
			case "IV":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.IV
			case "V":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.V
			case "VI":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.VI
			case "VII":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.VII
			case "VIII":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.VIII
			}
		}
	}

	return map[string]interface{}{
		"count":       count,
		"rows": mhs,
		"currentPage": page,
		"perPage":     perPage,
		"keyword":     keyword,
	}, nil
}

// DatatableSanggah — Pagination & Search untuk daftar mahasiswa sanggah
func (s *CMahasiswaService) DatatableSanggah(page, perPage int, keyword string) (map[string]interface{}, error) {
	db := config.DB
	var mhs []models.CMahasiswa
	var count int64

	query := db.Model(&models.CMahasiswa{}).Preload("Fakultas").Preload("Prodi").Where("flag = ? AND atribut = ?", "sanggah_ukt", "sanggah")
	
	if keyword != "" {
		query = query.Where("no_peserta LIKE ? OR nama_cmahasiswa LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}

	if err := query.Count(&count).Error; err != nil {
		return nil, err
	}

	offset := (page - 1) * perPage
	if err := query.Limit(perPage).Offset(offset).Find(&mhs).Error; err != nil {
		return nil, err
	}

	// 1. Cek Status Sanggah secara massal (Helper-based)
	// Penting: Meskipun ini DatatableSanggah, kita tetap cek has_sanggah 
	// biar row original yang kebetulan nyempung di sini statusnya akurat.
	s.PopulateHasSanggah(mhs)

	// 2. Hitung Nominal UKT berdasarkan GolonganID untuk tiap baris
	for i := range mhs {
		var ukt models.Ukt
		// Find correct UKT record for this specific student's prodi and entrance path
		if err := db.Where("major_id = ? AND entrance = ?", mhs[i].ProdiCmahasiswa, mhs[i].JalurCmahasiswa).First(&ukt).Error; err == nil {
			mhs[i].Ukt = &ukt
			switch mhs[i].GolonganID {
			case "I":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.I
			case "II":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.II
			case "III":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.III
			case "IV":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.IV
			case "V":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.V
			case "VI":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.VI
			case "VII":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.VII
			case "VIII":
				mhs[i].Ukt.Nominal = mhs[i].Ukt.VIII
			}
		}
	}

	return map[string]interface{}{
		"count":       count,
		"rows": mhs,
		"currentPage": page,
		"perPage":     perPage,
		"keyword":     keyword,
	}, nil
}
