package main

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"encoding/json"
	"fmt"
	"log"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: check_db <no_peserta>")
		return
	}
	noPeserta := os.Args[1]

	config.ConnectDB()
	db := config.DB

	var students []models.CMahasiswa
	if err := db.Where("no_peserta = ?", noPeserta).Find(&students).Error; err != nil {
		log.Fatalf("Error querying DB: %v", err)
	}

	fmt.Printf("Found %d records for NoPeserta: %s\n", len(students), noPeserta)
	for _, s := range students {
		data, _ := json.MarshalIndent(s, "", "  ")
		fmt.Printf("Atribut: %s\nData: %s\n", s.Atribut, string(data))
	}
}
