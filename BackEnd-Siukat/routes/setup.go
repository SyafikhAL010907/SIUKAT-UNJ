package routes

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
)

// SetupRoutes mendaftarkan semua route ke Gin Engine
// Parity dengan app.js / router di Node.js (semua endpoint digabung di sini)
func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api/v1")
	api.Static("/img", "./public/img")
	
	// Smart Uploads Resolver: Handles both new paths (uploads/Folder/File) and legacy paths (File)
	api.GET("/uploads/*filepath", func(c *gin.Context) {
		path := c.Param("filepath")

		// Smart Trim: handle any number of leading slashes and duplicate "uploads/" prefixes
		// (Common when frontend manually prepends these to already-fixed paths)
		for {
			newPath := strings.TrimPrefix(path, "/")
			newPath = strings.TrimPrefix(newPath, "uploads/")
			if newPath == path {
				break
			}
			path = newPath
		}
		
		// 1. Try direct path (standard static serving)
		fullPath := filepath.Join("uploads", path)
		if _, err := os.Stat(fullPath); err == nil {
			c.File(fullPath)
			return
		}

		// 1.1 TRY SUBFOLDER FALLBACK (Standard Smart Resolver)
		// Jika request adalah "uploads/Folder/File", coba "uploads/Folder/Original/File" atau "uploads/Folder/Sanggah/File"
		parts := strings.Split(filepath.ToSlash(path), "/")
		if len(parts) >= 2 {
			// Misal: parts = ["Maulana_ID", "Profile.jpg"]
			folder := parts[0]
			file := parts[1]
			
			// Coba Original
			origPath := filepath.Join("uploads", folder, "Original", file)
			if _, err := os.Stat(origPath); err == nil {
				c.File(origPath)
				return
			}
			
			// Coba Sanggah
			sangPath := filepath.Join("uploads", folder, "Sanggah", file)
			if _, err := os.Stat(sangPath); err == nil {
				c.File(sangPath)
				return
			}
		}

		// 2. Smart Fallback for Legacy/Admin Links
		// If exact match fails, try to find a file in any student folder that matches keywords
		filename := filepath.Base(path)
		
		// Extract potential ID or Name keywords (roughly)
		// We prioritize searching by NoPeserta found in the requested filename
		re := regexp.MustCompile(`\d{10,}`)
		studentID := re.FindString(filename)
		
		foundPath := ""
		filepath.Walk("uploads", func(p string, info os.FileInfo, err error) error {
			if err != nil || info.IsDir() {
				return nil
			}
			
			// If we have a student ID, look for it in the path
			if studentID != "" && strings.Contains(p, studentID) {
				// And check if the category matches
				categories := []string{
					"KTP", "Slip", "Profile", "Foto", "Listrik", 
					"STNK", "Motor", "Mobil", "KartuKeluarga", "KK",
					"PBB", "Kontrak", "Rumah", "Pernyataan", "Wali", "Kebenaran",
				}
				for _, cat := range categories {
					lowerCat := strings.ToLower(cat)
					lowerFile := strings.ToLower(filename)
					lowerDisk := strings.ToLower(info.Name())

					// Standard Match
					matchReq := strings.Contains(lowerFile, lowerCat)
					matchDisk := strings.Contains(lowerDisk, lowerCat)

					// Synonym Match: KK <-> KartuKeluarga
					if !matchReq && lowerCat == "kk" && strings.Contains(lowerFile, "kartukeluarga") { matchReq = true }
					if !matchReq && lowerCat == "kartukeluarga" && strings.Contains(lowerFile, "kk") { matchReq = true }
					if !matchDisk && lowerCat == "kk" && strings.Contains(lowerDisk, "kartukeluarga") { matchDisk = true }
					if !matchDisk && lowerCat == "kartukeluarga" && strings.Contains(lowerDisk, "kk") { matchDisk = true }

					if matchReq && matchDisk {
						foundPath = p
						return fmt.Errorf("found")
					}
				}
			}
			
			// Last resort: Exact filename match anywhere
			if info.Name() == filename {
				foundPath = p
				return fmt.Errorf("found")
			}
			return nil
		})

		if foundPath != "" {
			c.File(foundPath)
			return
		}

		c.JSON(404, gin.H{"error": "File not found", "requested": path, "hint": "Please re-upload if problem persists"})
	})

	// === Index ===
	IndexRoutes(api)

	// === Auth & Users ===
	AuthRoutes(api)

	// === Dashboard ===
	DashboardApiRoutes(api)
	SummaryRoutes(api)

	// === Referensi Master ===
	FakultasRoutes(api)
	ProdiRoutes(api)
	ProvinsiRoutes(api)
	KabkotRoutes(api)
	KecamatanRoutes(api)
	PekerjaanRoutes(api)
	InfoRoutes(api)
	UktRoutes(api)
	UktRefRoutes(api)


	// === Data Mahasiswa ===
	CmahasiswaRoutes(api)
	AyahRoutes(api)
	IbuRoutes(api)
	WaliRoutes(api)

	// === Data Ekonomi & Aset ===
	KendaraanRoutes(api)
	RumahRoutes(api)
	ListrikRoutes(api)
	PendukungRoutes(api)

	// === Keringanan & Verifikasi ===
	KeringananRoutes(api)
	VerifikasiRoutes(api)

	// === Admin ===
	AdminRoutes(api)

	// === Captcha ===
	CaptchaRoutes(api)

	// === PDF ===
	PdfRoutes(api)
}
