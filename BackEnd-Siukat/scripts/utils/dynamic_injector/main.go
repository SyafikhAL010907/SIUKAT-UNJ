package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"github.com/xuri/excelize/v2"
	"golang.org/x/crypto/bcrypt"
	"BackEnd-Siukat/config"
	"strings"
)

func main() {
	godotenv.Load()
	config.ConnectDB()
	db := config.DB

	excelPath := `./DATA/inject_snbp_2026_new.xlsx`
	f, err := excelize.OpenFile(excelPath)
	if err != nil {
		fmt.Printf("Gagal buka file: %v\n", err)
		return
	}
	defer f.Close()

	sheets := f.GetSheetList()
	tx := db.Begin()

	for _, sheetName := range sheets {
		rows, _ := f.GetRows(sheetName)
		if len(rows) <= 1 { continue }

		fmt.Printf(">> Memproses Sheet [%s]...\n", sheetName)
		headers := rows[0]
		headerMap := make(map[string]int)
		for i, h := range headers {
			headerMap[strings.TrimSpace(h)] = i
		}

		injectCount := 0
		for i, row := range rows {
			if i == 0 || len(row) == 0 { continue }

			switch sheetName {
			case "tb_user":
				noPeserta := getCol(row, headerMap, "no_peserta")
				pass := getCol(row, headerMap, "password")
				role := getCol(row, headerMap, "role")
				if noPeserta == "" { continue }
				hashed, _ := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
				query := "INSERT IGNORE INTO tb_user (no_peserta, password, role, jalur_masuk) VALUES (?, ?, ?, ?)"
				tx.Exec(query, noPeserta, string(hashed), role, "1")
				injectCount++
			case "tb_cmahasiswa":
				id := getCol(row, headerMap, "id_cmahasiswa")
				noPeserta := getCol(row, headerMap, "no_peserta")
				nama := getCol(row, headerMap, "nama_cmahasiswa")
				bidikMisi := getCol(row, headerMap, "bidik_misi_cmahasiswa")
				fakultas := getCol(row, headerMap, "fakultas_cmahasiswa")
				prodi := getCol(row, headerMap, "prodi_cmahasiswa")
				jalur := getCol(row, headerMap, "jalur_cmahasiswa")
				gender := getCol(row, headerMap, "gender_cmahasiswa")
				tglLahir := getCol(row, headerMap, "tanggal_lahir_cmahasiswa")
				if id == "" { continue }
				query := `INSERT IGNORE INTO tb_cmahasiswa (id_cmahasiswa, no_peserta, nama_cmahasiswa, bidik_misi_cmahasiswa, fakultas_cmahasiswa, prodi_cmahasiswa, jalur_cmahasiswa, gender_cmahasiswa, tanggal_lahir_cmahasiswa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
				tx.Exec(query, id, noPeserta, nama, bidikMisi, fakultas, prodi, jalur, gender, tglLahir)
				injectCount++
			case "tb_admin":
				user := getCol(row, headerMap, "username")
				nama := getCol(row, headerMap, "nama_lengkap")
				telp := getCol(row, headerMap, "no_telepon")
				role := getCol(row, headerMap, "role")
				if user == "" { continue }
				tx.Exec("INSERT IGNORE INTO tb_admin (username, nama_lengkap, no_telepon, role) VALUES (?, ?, ?, ?)", user, nama, telp, role)
				injectCount++
			default:
				idField := strings.Replace(sheetName, "tb_", "id_", 1)
				if sheetName == "tb_verifikasi_akademik" { idField = "id_verifikasi_raport" }
				id := getCol(row, headerMap, idField)
				noPeserta := getCol(row, headerMap, "no_peserta")
				if id == "" || noPeserta == "" { continue }
				tx.Exec(fmt.Sprintf("INSERT IGNORE INTO %s (%s, no_peserta) VALUES (?, ?)", sheetName, idField), id, noPeserta)
				injectCount++
			}
		}
		fmt.Printf("- Berhasil: %d row.\n", injectCount)
	}
	tx.Commit()
	fmt.Println("\nFINISH: Injeksi Selesai!")
}

func getCol(row []string, m map[string]int, key string) string {
	idx, ok := m[key]
	if !ok || idx >= len(row) { return "" }
	return strings.TrimSpace(row[idx])
}
