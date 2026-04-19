package main

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"fmt"
	"encoding/json"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	config.ConnectDB()
	var ayah models.Ayah
	config.DB.Where("no_peserta = ? AND atribut = ?", "426000002", "original").First(&ayah)
	
	bytes, _ := json.Marshal(ayah)
	fmt.Println("JSON:", string(bytes))
	
	if ayah.TanggalLahirAyah != nil {
		fmt.Println("Raw Time in Go:", ayah.TanggalLahirAyah.String())
	} else {
		fmt.Println("Tanggal Lahir is nil")
	}
}
