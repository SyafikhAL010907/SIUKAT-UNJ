package utils

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"mime/multipart"
)

// SanitizeString — Membersihkan string (Gabungkan semua karakter alphanumeric)
func SanitizeString(s string) string {
	// 1. Hapus semua karakter yang bukan huruf atau angka (termasuk spasi)
	reg, _ := regexp.Compile("[^a-zA-Z0-9]+")
	s = reg.ReplaceAllString(s, "") // Digabung jaya!

	return s
}

// HandleDynamicUpload creates dynamic directory and saves file (overwrites if exists)
// Folder structure: uploads/{SanitizedNama}_{NoPeserta}/{Sanitized_Filename.ext}
func HandleDynamicUpload(c *gin.Context, file *multipart.FileHeader, namaMahasiswa string, noPeserta string) (string, error) {
	// 1. Sanitize Nama and NoPeserta for Folder Name
	sanitizedNama := SanitizeString(namaMahasiswa)
	// Balikin '_' sebagai pemisah antara Nama (yang sudah digabung) dan NoPeserta
	folderName := fmt.Sprintf("%s_%s", sanitizedNama, noPeserta)

	// 2. Define Root Directory
	targetDir := filepath.Join("uploads", folderName)

	// 3. Create Directory if it doesn't exist (MkdirAll is idempotent)
	if err := os.MkdirAll(targetDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create directory: %v", err)
	}

	// 4. Sanitize Filename (keep extension)
	ext := filepath.Ext(file.Filename)
	base := strings.TrimSuffix(file.Filename, ext)
	sanitizedBase := SanitizeString(base)
	finalFilename := sanitizedBase + ext

	// 5. Construct Final Path for SaveUploadedFile (using / for DB portability)
	finalPath := filepath.Join(targetDir, finalFilename)
	
	// Save file (Gin uses os.Create which will overwrite if exists)
	if err := c.SaveUploadedFile(file, finalPath); err != nil {
		return "", fmt.Errorf("failed to save file: %v", err)
	}

	// Return relative path for database storage (standardize to forward slashes)
	dbPath := filepath.ToSlash(finalPath)
	return dbPath, nil
}

// DeleteOldFile — Safely removes a file from the filesystem if it exists.
// Used for storage efficiency (Cleanup) as requested by USER.
func DeleteOldFile(filePath string) {
	if filePath == "" {
		return
	}
	
	// Check if file exists before attempting removal
	if _, err := os.Stat(filePath); err == nil {
		fmt.Printf("🧹 STORAGE CLEANUP: Removing old file [%s]\n", filePath)
		err := os.Remove(filePath)
		if err != nil {
			fmt.Printf("⚠️ WARNING: Failed to delete old file [%s]: %v\n", filePath, err)
		}
	}
}
