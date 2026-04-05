package services

import (
	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"errors"
	"log"
	"strings"
)

type UsersService struct{}

func (s *UsersService) GetUser(noPeserta string) (interface{}, error) {
	// 1. Clean input
	cleanNoPeserta := strings.TrimSpace(noPeserta)
	log.Printf("DEBUG [GetUser]: Attempting to fetch data for [%s]", cleanNoPeserta)

	// 2. Resolve User Role
	var user models.User
	if err := config.DB.Where("no_peserta = ?", cleanNoPeserta).First(&user).Error; err != nil {
		log.Printf("ERROR [GetUser]: User not found in tb_user for [%s]: %v", cleanNoPeserta, err)
		return nil, err
	}

	// 3. Handle Admin
	if user.Role == "admin" {
		log.Printf("DEBUG [GetUser]: User [%s] is an Admin", cleanNoPeserta)
		var admin models.Admin
		if err := config.DB.Where("username = ?", cleanNoPeserta).First(&admin).Error; err == nil {
			return admin, nil
		}
		return admin, nil
	}

	// 4. Handle Student (CMahasiswa) - ATOMIC ROBUST SEARCH WITH PRELOAD
	var mhs models.CMahasiswa
	found := false

	// Attempt 1: Search by 'sanggah' (Priority)
	if err := config.DB.Preload("Fakultas").Preload("Prodi").
		Where("no_peserta = ? AND atribut = ?", cleanNoPeserta, "sanggah").First(&mhs).Error; err == nil {
		log.Printf("DEBUG [GetUser]: Record found with [sanggah] attribute for [%s]", cleanNoPeserta)
		found = true
	} else if err := config.DB.Preload("Fakultas").Preload("Prodi").
		Where("no_peserta = ? AND atribut = ?", cleanNoPeserta, "original").First(&mhs).Error; err == nil {
		// Attempt 2: Search by 'original'
		log.Printf("DEBUG [GetUser]: Record found with [original] attribute for [%s]", cleanNoPeserta)
		found = true
	} else if err := config.DB.Preload("Fakultas").Preload("Prodi").
		Where("no_peserta = ?", cleanNoPeserta).First(&mhs).Error; err == nil {
		// Attempt 3: SEARCH BY ID ONLY (The ultimate fallback)
		log.Printf("DEBUG [GetUser]: Record found with FALLBACK (no attribute filter) for [%s]", cleanNoPeserta)
		found = true
	}

	if found {
		// FINAL SAFETY CHECK: If Prodi or Fakultas still nil, try manual enrichment
		if mhs.Prodi == nil && mhs.ProdiCmahasiswa != "" {
			log.Printf("WARN [GetUser]: Preload Prodi failed for [%s], trying manual enrichment", cleanNoPeserta)
			ps := ProdiService{}
			_ = ps.ByCmahasiswa(&mhs)
		}
		
		if mhs.Fakultas == nil && mhs.FakultasCmahasiswa != 0 {
			log.Printf("WARN [GetUser]: Preload Fakultas failed for [%s], trying manual enrichment", cleanNoPeserta)
			var fak models.Fakultas
			if err := config.DB.Where("kode = ?", mhs.FakultasCmahasiswa).First(&fak).Error; err == nil {
				mhs.Fakultas = &fak
			}
		}

		log.Printf("DEBUG [GetUser]: Student found (ID: %d). Resulting Prodi: %v", mhs.IDCmahasiswa, mhs.Prodi)
		return mhs, nil
	}

	log.Printf("ERROR [GetUser]: Exhausted all retrieval attempts for [%s]. Sending final failure.", cleanNoPeserta)
	return nil, errors.New("Data mahasiswa tidak ditemukan di tabel cmahasiswa (ID not present)")
}
