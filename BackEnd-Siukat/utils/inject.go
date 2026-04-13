package utils

import (
	"BackEnd-Siukat/config"
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
	"golang.org/x/crypto/bcrypt"
)

func InjectDataExcel(c *gin.Context) {
	// 1. Ambil File dari Request (Frontend Admin)
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(400, gin.H{"message": "Gagal mengambil file dari request. Pastikan file terlampir."})
		return
	}

	f, err := excelize.OpenReader(file)
	if err != nil {
		c.JSON(500, gin.H{"message": "Gagal membuka file Excel. Pastikan format .xlsx benar."})
		return
	}
	defer f.Close()

	db := config.DB
	tx := db.Begin()
	sheets := f.GetSheetList()

	fmt.Println("🚀 Memulai Injeksi Data SNBP 2026...")

	for _, sheetName := range sheets {
		rows, err := f.GetRows(sheetName)
		if err != nil {
			fmt.Printf("⚠️ Skip sheet %s karena error: %v\n", sheetName, err)
			continue
		}
		if len(rows) <= 1 {
			continue // Skip sheet kosong atau cuma ada header
		}

		fmt.Printf("📂 Injecting Sheet: %s (%d rows)\n", sheetName, len(rows)-1)

		for i, row := range rows {
			if i == 0 || len(row) < 2 {
				continue // Skip header dan baris tidak lengkap
			}

			switch sheetName {
			case "tb_user":
				// Mapping 1:1 [no_peserta password role jalur_masuk]
				noPeserta := row[0]
				pass := row[1]
				role := row[2]
				jalurMasuk := ""
				if len(row) > 3 {
					jalurMasuk = row[3]
				}

				// Hashing Password Mahasiswa
				hashedPass, _ := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
				tx.Exec("INSERT IGNORE INTO tb_user (no_peserta, password, role, jalur_masuk) VALUES (?, ?, ?, ?)",
					noPeserta, string(hashedPass), role, jalurMasuk)

			case "tb_admin":
				// Mapping 1:1 [username nama_lengkap no_telepon role password]
				if len(row) >= 5 {
					username := row[0]
					nama := row[1]
					telp := row[2]
					role := row[3]
					pass := row[4]

					// Hashing Password Admin
					hashedPass, _ := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
					tx.Exec("INSERT IGNORE INTO tb_admin (username, nama_lengkap, no_telepon, role, password) VALUES (?, ?, ?, ?, ?)",
						username, nama, telp, role, string(hashedPass))
				}

			case "tb_cmahasiswa":
				// Mapping Eksplisit 9 Kolom Sesuai Excel
				// [id_cmahasiswa no_peserta nama_cmahasiswa bidik_misi_cmahasiswa fakultas_cmahasiswa prodi_cmahasiswa jalur_cmahasiswa gender_cmahasiswa tanggal_lahir_cmahasiswa]
				if len(row) >= 9 {
					tx.Exec(`INSERT IGNORE INTO tb_cmahasiswa 
						(id_cmahasiswa, no_peserta, nama_cmahasiswa, bidik_misi_cmahasiswa, fakultas_cmahasiswa, prodi_cmahasiswa, jalur_cmahasiswa, gender_cmahasiswa, tanggal_lahir_cmahasiswa) 
						VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
						row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8])
				}

			case "tb_ayah", "tb_ibu", "tb_wali", "tb_rumah", "tb_listrik", "tb_kendaraan", "tb_pendukung", "tb_value", "tb_verifikasi":
				// Mapping Standar 1:1 [ID, No Peserta]
				idField := fmt.Sprintf("id_%s", strings.TrimPrefix(sheetName, "tb_"))
				query := fmt.Sprintf("INSERT IGNORE INTO %s (%s, no_peserta) VALUES (?, ?)", sheetName, idField)
				tx.Exec(query, row[0], row[1])

			case "tb_verifikasi_akademik":
				// Mapping Khusus [id_verifikasi_raport, no_peserta]
				tx.Exec("INSERT IGNORE INTO tb_verifikasi_akademik (id_verifikasi_raport, no_peserta) VALUES (?, ?)", row[0], row[1])
			}
		}
	}

	// 2. Commit atau Rollback
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		fmt.Printf("❌ Gagal Commit Database: %v\n", err)
		c.JSON(500, gin.H{"message": "Gagal injeksi database: " + err.Error()})
		return
	}

	fmt.Println("✅ Injeksi Data Selesai Berhasil!")
	c.JSON(200, gin.H{
		"status":  "success",
		"message": "Gaspol Berhasil! 13 Sheet Data SNBP 2026 sudah sinkron 1:1 ke Database.",
	})
}