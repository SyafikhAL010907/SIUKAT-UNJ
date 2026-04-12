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

	// 2. Resolve User Role (Check tb_user for Students/Old Admins first)
	var user models.User
	userFound := false
	if err := config.DB.Where("no_peserta = ?", cleanNoPeserta).First(&user).Error; err == nil {
		userFound = true
	}

	// 3. Handle Admin (Check tb_admin as primary source if not a student role or not found in tb_user)
	if !userFound || (user.Role != "cmahasiswa" && user.Role != "belum_lengkap") {
		log.Printf("DEBUG [GetUser]: Checking tb_admin for [%s]", cleanNoPeserta)
		var admin models.Admin
		if err := config.DB.Where("username = ?", cleanNoPeserta).First(&admin).Error; err == nil {
			log.Printf("DEBUG [GetUser]: Admin [%s] found in tb_admin", cleanNoPeserta)
			return admin, nil
		}
		
		// If it was found in tb_user with an admin role but not in tb_admin, return fallback
		if userFound && (user.Role == "admin" || user.Role == "developer" || user.Role == "operator" || user.Role == "validator") {
			return models.Admin{Username: cleanNoPeserta, Role: user.Role}, nil
		}
	}

	// If it reached here and not found in tb_user, it's a dead end
	if !userFound {
		log.Printf("ERROR [GetUser]: User/Admin [%s] not found in any table", cleanNoPeserta)
		return nil, errors.New("User tidak ditemukan")
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
