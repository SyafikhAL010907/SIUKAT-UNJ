package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"github.com/xuri/excelize/v2"
	"BackEnd-Siukat/config"
	"strings"
)

func main() {
	godotenv.Load()
	config.ConnectDB()
	db := config.DB

	// Load No Peserta from the original file
	excelPath := `c:\Project Coding Syafikh\ProjectSiukat\BackEnd-Siukat\DATA\inject_snbp_2026_new.xlsx`
	f, err := excelize.OpenFile(excelPath)
	if err != nil {
		fmt.Printf("Gagal buka file: %v\n", err)
		return
	}
	defer f.Close()

	rows, _ := f.GetRows("tb_user")
	if len(rows) <= 1 {
		fmt.Println("Gak ada data buat di-rollback.")
		return
	}

	var noPesertas []string
	for i, row := range rows {
		if i == 0 || len(row) < 1 { continue }
		val := strings.TrimSpace(row[0])
		if val != "" {
			noPesertas = append(noPesertas, val)
		}
	}

	fmt.Printf("Mulai Rollback %d data mahasiswa (Safety Clean)...\n", len(noPesertas))

	tables := []string{
		"tb_user", "tb_cmahasiswa", "tb_ayah", "tb_ibu", "tb_wali",
		"tb_rumah", "tb_listrik", "tb_kendaraan", "tb_pendukung",
		"tb_value", "tb_verifikasi", "tb_verifikasi_akademik",
	}

	tx := db.Begin()
	for _, table := range tables {
		fmt.Printf("- Cleaning %s...\n", table)
		if err := tx.Exec(fmt.Sprintf("DELETE FROM %s WHERE no_peserta IN (?)", table), noPesertas).Error; err != nil {
			fmt.Printf("Warning at %s: %v\n", table, err)
		}
	}
	tx.Commit()

	fmt.Println("ROLLBACK / CLEANUP BERHASIL! Database siap di-inject ulang.")
}
