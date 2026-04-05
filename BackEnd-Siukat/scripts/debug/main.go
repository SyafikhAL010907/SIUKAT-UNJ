package main

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"fmt"
	"github.com/joho/godotenv"
	"os"
)

func main() {
	// 1. Manually set environment or load .env
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Warning: .env file not found")
	}

	// 2. Connect to Database
	config.ConnectDB()

	// 3. Query all records for the test user
	targetNoPeserta := "925111008305"
	fmt.Printf("--- DEBUGGING DATABASE FOR NO_PESERTA: %s ---\n", targetNoPeserta)

	var user models.User
	if err := config.DB.Where("no_peserta = ?", targetNoPeserta).First(&user).Error; err != nil {
		fmt.Printf("❌ USER NOT FOUND in tb_user: %v\n", err)
	} else {
		fmt.Printf("✅ User exists in tb_user. Role: '%s'\n", user.Role)
	}

	var mhs []models.CMahasiswa
	err = config.DB.Where("no_peserta = ?", targetNoPeserta).Find(&mhs).Error
	if err != nil {
		fmt.Printf("Error during query: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Count found in tb_cmahasiswa: %d\n", len(mhs))
	for i, v := range mhs {
		fmt.Printf("[%d] ID: %d | Nama: '%s' | Prodi: '%s' | Fakultas: %d\n", 
			i+1, v.IDCmahasiswa, v.NamaCmahasiswa, v.ProdiCmahasiswa, v.FakultasCmahasiswa)
		
		// Verify Prodi
		var p models.Prodi
		if err := config.DB.Where("kode = ?", v.ProdiCmahasiswa).First(&p).Error; err != nil {
			fmt.Printf("   ⚠️ WARNING: Prodi Code '%s' NOT FOUND in ref_prodi!\n", v.ProdiCmahasiswa)
		} else {
			fmt.Printf("   ✅ Prodi Found: '%s'\n", p.Nama)
		}

		// Verify Fakultas
		var f models.Fakultas
		if err := config.DB.Where("kode = ?", v.FakultasCmahasiswa).First(&f).Error; err != nil {
			fmt.Printf("   ⚠️ WARNING: Fakultas Code %d NOT FOUND in ref_fakultas!\n", v.FakultasCmahasiswa)
		} else {
			fmt.Printf("   ✅ Fakultas Found: '%s'\n", f.Nama)
		}
	}
	
	if len(mhs) == 0 {
		fmt.Println("❌ NO RECORDS FOUND in tb_cmahasiswa for this NoPeserta.")
	}
}
