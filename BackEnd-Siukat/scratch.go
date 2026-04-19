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
	var ibu models.Ibu
	config.DB.Where("no_peserta = ? AND atribut = ?", "426000002", "original").First(&ibu)
	
	bytes, _ := json.Marshal(ibu)
	fmt.Println("JSON:", string(bytes))
	
	if ibu.TanggalLahirIbu != nil {
		fmt.Println("Raw Time in Go:", ibu.TanggalLahirIbu.String())
	} else {
		fmt.Println("Tanggal Lahir is nil")
	}
}
