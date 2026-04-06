package main

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"fmt"
	"log"
)

func main() {
	config.ConnectDB()
	db := config.DB

	var mhs models.CMahasiswa
	noPeserta := "925111008305"
	if err := db.Where("no_peserta = ?", noPeserta).First(&mhs).Error; err != nil {
		log.Fatalf("Mhs not found: %v", err)
	}
	fmt.Printf("Mhs: %s (%s)\n", mhs.NamaCmahasiswa, mhs.NoPeserta)
	fmt.Printf("Foto: [%s]\n", mhs.FotoCmahasiswa)

	var v models.Kendaraan
	db.Where("no_peserta = ? AND atribut = ?", noPeserta, "original").First(&v)
	fmt.Printf("Scan Motor: [%s]\n", v.ScanMotor)
}
