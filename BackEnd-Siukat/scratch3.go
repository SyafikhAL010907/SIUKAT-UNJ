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
	var cm models.CMahasiswa
	config.DB.Where("no_peserta = ?", "426000002").First(&cm)
	
	bytes, _ := json.Marshal(cm)
	fmt.Println("JSON:", string(bytes))
	
	if cm.TanggalLahirCmahasiswa != nil {
		fmt.Println("Raw Time in Go:", cm.TanggalLahirCmahasiswa.String())
	} else {
		fmt.Println("Tanggal Lahir is nil")
	}
}
