package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"fmt"
	"strconv"
	"time"
)

type WsdlService struct{}

func (s *WsdlService) SyncToWsdl(noPeserta string) error {
	// 1. Ambil data mahasiswa dengan Prioritas (Sanggah > Original)
	cmahasiswaService := CMahasiswaService{}
	mhs, err := cmahasiswaService.GetCmahasiswa(noPeserta)
	if err != nil {
		return fmt.Errorf("mahasiswa tidak ditemukan: %v", err)
	}

	// 2. Hitung Nominal Tagihan
	var ukt models.Ukt
	nominal := 0 // Default nominal
	if err := config.DB.Where("major_id = ? AND CAST(entrance AS CHAR) = ?", mhs.ProdiCmahasiswa, mhs.JalurCmahasiswa).First(&ukt).Error; err == nil {
		nominal = cmahasiswaService.CalculateNominalValue(ukt, mhs.GolonganID)
		nominal = nominal + mhs.Spu // Tambahkan SPU jika ada
	}

	// 3. Cari Data Jalur Masuk & Info Stage
	var user models.User
	if err := config.DB.Where("no_peserta = ?", mhs.NoPeserta).First(&user).Error; err != nil {
		fmt.Printf("⚠️ WARNING: User tidak ditemukan di tb_user, default pakai jalur mahasiswa. Error: %v\n", err)
		user.JalurMasuk = mhs.JalurCmahasiswa // Fallback
	}

	// Mapping Jalur Masuk ('1', '2', '3') => string ('snmptn', 'sbmptn', 'mandiri')
	var stageName string
	switch user.JalurMasuk {
	case "1":
		stageName = "snmptn"
	case "2":
		stageName = "sbmptn"
	case "3":
		stageName = "mandiri"
	default:
		stageName = "snmptn" // Default safe fallback
	}

	var info models.Info
	if err := config.DB.Where("stage = ?", stageName).First(&info).Error; err != nil {
		return fmt.Errorf("info stage (periode) tidak ditemukan untuk stageName: %v", stageName)
	}

	billIssueID := info.BillIssueID
	if billIssueID == 0 {
		fmt.Printf("⚠️ WARNING: BillIssueID tidak ditemukan untuk stage %s\n", stageName)
	}

	// Generate Bill Number
	billNumber, errTagihan := GenerateTagihan(info, mhs.NoPeserta)
	if errTagihan != nil {
		// Fallback safe bill_number (jika stage tidak valid dsb)
		billNumber = "BN" + mhs.NoPeserta
	}

	// 4. Persiapkan Parsing WSDL & Cek Status Bayar
	majorID, _ := strconv.Atoi(mhs.ProdiCmahasiswa)
	semesterAwal := 110 
	if yp, err := strconv.Atoi(time.Now().Format("06")); err == nil {
		semesterAwal = (yp * 5) - 20 
	}

	if config.DBWsdl == nil {
		fmt.Println("❌ ERROR: Koneksi DB WSDL NIL / Tidak Aktif!")
		return fmt.Errorf("koneksi database WSDL tidak aktif")
	}

	var existingStatus string
	errWsdl := config.DBWsdl.Raw("SELECT flag_status FROM tb_bill_detail WHERE nim = ? AND bill_issue_id = ?", mhs.NoPeserta, billIssueID).Scan(&existingStatus).Error
	
	// Jika flag_status di tb_bill_detail WSDL BUKAN '01' (sync) atau '88' (local), berarti udah bayar
	if errWsdl == nil && existingStatus != "" && existingStatus != "01" && existingStatus != "88" {
		fmt.Printf("⚠️ SKIP WSDL SYNC: Mahasiswa [%s] sudah bayar (flag_status: %s). WSDL Insert dibatalkan.\n", mhs.NoPeserta, existingStatus)

		// Tetap update Tagihan (nominal) lokal di SIUKAT demi sinkronisasi UI/Rekap
		nominalStr := strconv.Itoa(nominal)
		config.DB.Model(&models.CMahasiswa{}).Where("id_cmahasiswa = ?", mhs.IDCmahasiswa).Update("tagihan", nominalStr)
		
		return nil
	}

	// 5. EKSEKUSI PUSH KE DATABASE WSDL (tb_bill_detail)
	queryWsdl := `REPLACE INTO tb_bill_detail 
		(bill_issue_id, bill_number, ukt_category, amount, nim, major_id, semester, name, flag_status) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	
	fmt.Printf("🚀 DEBUG WSDL: Sending NIM [%s] to tb_bill_detail, Nominal [%d], flag [01]\n", mhs.NoPeserta, nominal)

	resWsdl := config.DBWsdl.Exec(queryWsdl, 
		billIssueID,
		billNumber, 
		mhs.GolonganID,
		nominal,
		mhs.NoPeserta, 
		majorID, 
		semesterAwal, 
		mhs.NamaCmahasiswa, 
		"01", // Default Flag Status = Sync
	)

	if resWsdl.Error != nil {
		fmt.Printf("❌ ERROR WSDL EXECUTION: %v\n", resWsdl.Error)
		return fmt.Errorf("gagal push ke WSDL: %v", resWsdl.Error)
	}

	fmt.Printf("📊 WSDL tb_bill_detail Rows Affected: %d\n", resWsdl.RowsAffected)

	// 6. UPDATE TAGIHAN (NOMINAL) DI SIUKAT
	nominalStr := strconv.Itoa(nominal)
	fmt.Printf("📝 DEBUG: Updating SIUKAT ID [%d] with Tagihan [%s]\n", mhs.IDCmahasiswa, nominalStr)
	
	if errUpdate := config.DB.Model(&models.CMahasiswa{}).Where("id_cmahasiswa = ?", mhs.IDCmahasiswa).Update("tagihan", nominalStr).Error; errUpdate != nil {
		fmt.Printf("❌ ERROR SIUKAT UPDATE: %v\n", errUpdate)
		return fmt.Errorf("gagal update tagihan di SIUKAT: %v", errUpdate)
	}

	fmt.Printf("✅ SUCCESS: Sync WSDL tb_bill_detail [%s] - Nominal: %s - Atribut: %s\n", noPeserta, nominalStr, mhs.Atribut)
	return nil
}

