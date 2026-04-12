package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"BackEnd-Siukat/config"
)

func main() {
	godotenv.Load()
	config.ConnectDB()
	db := config.DB

	// 1. Ambil semua no_peserta dari tb_user yang rolenya 'cmahasiswa'
	var studentNPs []string
	if err := db.Table("tb_user").Where("role = ?", "cmahasiswa").Pluck("no_peserta", &studentNPs).Error; err != nil {
		fmt.Printf("❌ Gagal ambil daftar mahasiswa: %v\n", err)
		return
	}

	if len(studentNPs) == 0 {
		fmt.Println("✅ Database sudah bersih dari role 'cmahasiswa'. Tidak ada yang dihapus.")
		return
	}

	fmt.Printf("🧹 Menemukan %d akun mahasiswa. Memulai pembersihan total...\n", len(studentNPs))

	tables := []string{
		"tb_cmahasiswa", "tb_ayah", "tb_ibu", "tb_wali",
		"tb_rumah", "tb_listrik", "tb_kendaraan", "tb_pendukung",
		"tb_value", "tb_verifikasi", "tb_verifikasi_akademik",
		"tb_bobot_ekonomi", "tb_summary_data",
	}

	tx := db.Begin()

	// A. Hapus data di tabel-tabel detail mahasiswa
	for _, table := range tables {
		fmt.Printf("- Cleaning %s...\n", table)
		if err := tx.Exec(fmt.Sprintf("DELETE FROM %s WHERE no_peserta IN (?)", table), studentNPs).Error; err != nil {
			fmt.Printf("⚠️ Warning at %s: %v\n", table, err)
		}
	}

	// B. Hapus akun mahasiswanya sendiri di tb_user
	fmt.Println("- Cleaning tb_user (role 'cmahasiswa' only)...")
	if err := tx.Exec("DELETE FROM tb_user WHERE role = ?", "cmahasiswa").Error; err != nil {
		fmt.Printf("❌ Gagal hapus tb_user: %v\n", err)
		tx.Rollback()
		return
	}

	tx.Commit()

	fmt.Println("\n✨ MEGA ROLLBACK BERHASIL! Database kembali steril.")
	fmt.Println("   Akun Developer, Operator, dan Validator aman terkendali.")
}
