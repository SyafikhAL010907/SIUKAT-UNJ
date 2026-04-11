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
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(400, gin.H{"message": "Gagal mengambil file dari request"})
		return
	}

	f, err := excelize.OpenReader(file)
	if err != nil {
		c.JSON(500, gin.H{"message": "Gagal buka file Excel"})
		return
	}
	defer f.Close()

	db := config.DB
	tx := db.Begin()
	sheets := f.GetSheetList()

	for _, sheetName := range sheets {
		rows, err := f.GetRows(sheetName)
		if err != nil {
			fmt.Printf("Skip sheet %s karena error: %v\n", sheetName, err)
			continue
		}
		if len(rows) <= 1 {
			continue
		} // Skip sheet kosong atau hanya header

		for i, row := range rows {
			if i == 0 || len(row) < 2 {
				continue
			} // Skip header dan baris tidak valid

			switch sheetName {
			case "tb_user":
				noPeserta := row[0]
				pass := row[1]
				role := row[2]
				jalurMasuk := ""
				if len(row) > 3 {
					jalurMasuk = row[3]
				}

				hashedPass, _ := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
				tx.Exec("INSERT IGNORE INTO tb_user (no_peserta, password, role, jalur_masuk) VALUES (?, ?, ?, ?)",
					noPeserta, string(hashedPass), role, jalurMasuk)

			case "tb_cmahasiswa":
				// Mapping (id, no_peserta, nama, bidik_misi, fakultas, prodi, jalur, gender, tgl_lahir)
				// Sesuai Sheet: [id_cmahasiswa no_peserta nama_cmahasiswa bidik_misi_cmahasiswa fakultas_cmahasiswa prodi_cmahasiswa jalur_cmahasiswa gender_cmahasiswa tanggal_lahir_cmahasiswa]
				if len(row) >= 9 {
					tx.Exec(`INSERT IGNORE INTO tb_cmahasiswa 
						(id_cmahasiswa, no_peserta, nama_cmahasiswa, bidik_misi_cmahasiswa, fakultas_cmahasiswa, prodi_cmahasiswa, jalur_cmahasiswa, gender_cmahasiswa, tanggal_lahir_cmahasiswa) 
						VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
						row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8])
				}

			case "tb_ayah", "tb_ibu", "tb_wali", "tb_rumah", "tb_listrik", "tb_kendaraan", "tb_pendukung", "tb_value", "tb_verifikasi":
				// Sheet standar (ID & No Peserta)
				idField := fmt.Sprintf("id_%s", strings.TrimPrefix(sheetName, "tb_"))
				query := fmt.Sprintf("INSERT IGNORE INTO %s (%s, no_peserta) VALUES (?, ?)", sheetName, idField)
				tx.Exec(query, row[0], row[1])

			case "tb_verifikasi_akademik":
				// Khusus tb_verifikasi_akademik (id_verifikasi_raport)
				tx.Exec("INSERT IGNORE INTO tb_verifikasi_akademik (id_verifikasi_raport, no_peserta) VALUES (?, ?)", row[0], row[1])

			case "tb_admin":
				// Mapping (username, nama_lengkap, no_telepon, role)
				if len(row) >= 4 {
					tx.Exec("INSERT IGNORE INTO tb_admin (username, nama_lengkap, no_telepon, role) VALUES (?, ?, ?, ?)",
						row[0], row[1], row[2], row[3])
				}
			}
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(500, gin.H{"message": "Gagal commit database: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{"status": "success", "message": "Data SNBP 2026 Berhasil di-Inject ke 13 Tabel!"})
}