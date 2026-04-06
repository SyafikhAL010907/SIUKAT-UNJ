package routes

import (
	"fmt"
	"os"
	"path/filepath"
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

		// Remove leading slash if any
		path = strings.TrimPrefix(path, "/")

		// Handle duplicate "uploads/" prefix if database already has it
		// (since Admin prepends service + "/uploads")
		if strings.HasPrefix(path, "uploads/") {
			path = strings.TrimPrefix(path, "uploads/")
		}

		// 1. Try direct path (standard static serving)
		fullPath := filepath.Join("uploads", path)
		if _, err := os.Stat(fullPath); err == nil {
			c.File(fullPath)
			return
		}

		// 2. If not found, check if it's just a filename (no subfolders in requested path)
		filename := filepath.Base(path)
		if !strings.Contains(path, "/") {
			// Search recursively in uploads/
			foundPath := ""
			filepath.Walk("uploads", func(p string, info os.FileInfo, err error) error {
				if err == nil && !info.IsDir() && info.Name() == filename {
					foundPath = p
					return fmt.Errorf("found") // stop walking
				}
				return nil
			})

			if foundPath != "" {
				c.File(foundPath)
				return
			}
		}

		c.JSON(404, gin.H{"error": "File not found", "requested": path})
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
