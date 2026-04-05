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
	var mhs []models.CMahasiswa
	targetNoPeserta := "925111008305"
	
	fmt.Printf("--- DEBUGGING DATABASE FOR NO_PESERTA: %s ---\n", targetNoPeserta)
	
	err = config.DB.Where("no_peserta = ?", targetNoPeserta).Find(&mhs).Error
	if err != nil {
		fmt.Printf("Error during query: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Count found: %d\n", len(mhs))
	for i, v := range mhs {
		fmt.Printf("[%d] ID: %d | Nama: '%s' | Atribut: '%s' | Flag: '%s'\n", 
			i+1, v.IDCmahasiswa, v.NamaCmahasiswa, v.Atribut, v.Flag)
	}
	
	if len(mhs) == 0 {
		fmt.Println("❌ NO RECORDS FOUND in tb_cmahasiswa for this NoPeserta.")
	} else {
		fmt.Println("✅ Record exists in DB.")
	}
}
