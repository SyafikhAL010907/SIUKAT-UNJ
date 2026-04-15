package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"fmt"
	"strconv"
	"strings"
	"time"
)

type WsdlService struct{}

// SyncToWsdl — Fungsi utama untuk sinkronisasi data mahasiswa ke WSDL_UNJ
func (s *WsdlService) SyncToWsdl(noPeserta string) error {
	// 1. Ambil data mahasiswa dengan Prioritas (Sanggah > Original)
	cmahasiswaService := CMahasiswaService{}
	mhs, err := cmahasiswaService.GetCmahasiswa(noPeserta)
	if err != nil {
		return fmt.Errorf("mahasiswa tidak ditemukan: %v", err)
	}

	// 2. Load Relasi Prodi (buat dapetin Jenjang/Degree)
	var prodi models.Prodi
	if err := config.DB.Where("kode = ?", mhs.ProdiCmahasiswa).First(&prodi).Error; err != nil {
		fmt.Printf("⚠️ WARNING: Relasi Prodi tidak ditemukan untuk mapping Degree: %v\n", err)
	}

	// 3. Hitung Nominal Tagihan
	var ukt models.Ukt
	nominal := 0
	if err := config.DB.Where("major_id = ? AND CAST(entrance AS CHAR) = ?", mhs.ProdiCmahasiswa, mhs.JalurCmahasiswa).First(&ukt).Error; err == nil {
		nominal = cmahasiswaService.CalculateNominalValue(ukt, mhs.GolonganID)
		nominal = nominal + mhs.Spu // Tambahkan SPU jika ada
	}

	// 4. Persiapkan Data untuk WSDL (Mapping)
	majorID, _ := strconv.Atoi(mhs.ProdiCmahasiswa)
	entrance, _ := strconv.Atoi(mhs.JalurCmahasiswa)
	
	// Tentukan Semester Awal (YY + 0/1/2/3)
	// Biasa di WSDL pake format: 110, 107, dsb. 
	// Kita pake default tahun sekarang + kode stage (Contoh: 110)
	semesterAwal := 110 
	yearPrefix := time.Now().Format("06") // "26"
	if yp, err := strconv.Atoi(yearPrefix); err == nil {
		// Logika: 2026 -> 110 (Contoh mapping UNJ)
		// Lu bisa sesuaikan angka ini nanti bro
		semesterAwal = (yp * 5) - 20 
	}

	bidikmisi := "tidak"
	if strings.ToLower(mhs.BidikMisiCmahasiswa) == "ya" {
		bidikmisi = "ya"
	}

	// 5. EKSEKUSI PUSH KE DATABASE WSDL
	if config.DBWsdl == nil {
		fmt.Println("❌ ERROR: Koneksi DB WSDL NIL / Tidak Aktif!")
		return fmt.Errorf("koneksi database WSDL tidak aktif")
	}

	queryWsdl := `REPLACE INTO tb_student 
		(nim, semester_awal, bidikmisi, name, faculty_id, major_id, entrance, ukt_category, degree) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	
	fmt.Printf("🚀 DEBUG WSDL: Sending NIM [%s] Name [%s] Nominal [%d]\n", mhs.NoPeserta, mhs.NamaCmahasiswa, nominal)

	resWsdl := config.DBWsdl.Exec(queryWsdl, 
		mhs.NoPeserta, 
		semesterAwal, 
		bidikmisi, 
		mhs.NamaCmahasiswa, 
		mhs.FakultasCmahasiswa, 
		majorID, 
		entrance, 
		mhs.GolonganID, 
		prodi.Jenjang,
	)

	if resWsdl.Error != nil {
		fmt.Printf("❌ ERROR WSDL EXECUTION: %v\n", resWsdl.Error)
		return fmt.Errorf("gagal push ke WSDL: %v", resWsdl.Error)
	}

	fmt.Printf("📊 WSDL Rows Affected: %d\n", resWsdl.RowsAffected)

	// 6. UPDATE TAGIHAN DI SIUKAT (Database Utama)
	nominalStr := strconv.Itoa(nominal)
	fmt.Printf("📝 DEBUG: Updating SIUKAT ID [%d] with Tagihan [%s]\n", mhs.IDCmahasiswa, nominalStr)
	
	errUpdate := config.DB.Model(&models.CMahasiswa{}).
		Where("id_cmahasiswa = ?", mhs.IDCmahasiswa).
		Update("tagihan", nominalStr).Error

	if errUpdate != nil {
		fmt.Printf("❌ ERROR SIUKAT UPDATE: %v\n", errUpdate)
		return fmt.Errorf("gagal update tagihan di SIUKAT: %v", errUpdate)
	}

	fmt.Printf("✅ SUCCESS: Sync WSDL [%s] - Nominal: %s - Atribut: %s\n", noPeserta, nominalStr, mhs.Atribut)
	return nil
}
