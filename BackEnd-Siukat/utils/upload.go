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

	// 5. Construct Final Path for SaveUploadedFile
	finalSavePath := filepath.Join(targetDir, finalFilename)

	// Save file (Gin uses os.Create which will overwrite if exists)
	if err := c.SaveUploadedFile(file, finalSavePath); err != nil {
		return "", fmt.Errorf("failed to save file: %v", err)
	}

	// Return relative path for database storage (uploads/Folder/File.ext)
	// Standardize to forward slashes for DB portability
	dbPath := filepath.ToSlash(filepath.Join("uploads", folderName, finalFilename))
	return dbPath, nil
}

// DeleteOldFile — Safely removes a file from the filesystem if it exists.
// Used for storage efficiency (Cleanup) as requested by USER.
func DeleteOldFile(filePath string) {
	if filePath == "" {
		return
	}
	
	// Check if file exists before attempting removal
	// filePath now includes "uploads/" if coming from HandleDynamicUpload
	if _, err := os.Stat(filePath); err == nil {
		fmt.Printf("🧹 STORAGE CLEANUP: Removing old file [%s]\n", filePath)
		err := os.Remove(filePath)
		if err != nil {
			fmt.Printf("⚠️ WARNING: Failed to delete old file [%s]: %v\n", filePath, err)
		}
	}
}

// SyncStudentFolder — Mengganti nama folder (Rename) di sistem file jika Nama atau NoPeserta berubah.
// Jika folder tujuan sudah ada, maka isi folder lama dipindahkan ke dalam folder tujuan.
func SyncStudentFolder(oldName, oldNP, newName, newNP string) error {
	// 1. Calculate sanitized folder names
	// Kita pakai SanitizeString yang sudah ada di file ini
	oldFolder := fmt.Sprintf("%s_%s", SanitizeString(oldName), oldNP)
	newFolder := fmt.Sprintf("%s_%s", SanitizeString(newName), newNP)

	if oldFolder == newFolder {
		return nil // Tidak ada perubahan folder, aman jaya!
	}

	oldPath := filepath.Join("uploads", oldFolder)
	newPath := filepath.Join("uploads", newFolder)

	// 2. Cek apakah folder lama ada
	if _, err := os.Stat(oldPath); os.IsNotExist(err) {
		// Folder lama tidak ada, mungkin belum pernah upload. Lanjut saja.
		return nil
	}

	// 3. Cek apakah folder baru sudah ada
	if _, err := os.Stat(newPath); err == nil {
		// Folder baru sudah ada (mungkin user pernah iseng create manual atau gonta-ganti nama sebelumnya)
		// Kita pindahkan isi folder lama ke folder baru (Merge content)
		fmt.Printf("📦 STORAGE SYNC: Merging [%s] into existing [%s]\n", oldPath, newPath)
		entries, err := os.ReadDir(oldPath)
		if err != nil {
			return err
		}
		for _, entry := range entries {
			oldFile := filepath.Join(oldPath, entry.Name())
			newFile := filepath.Join(newPath, entry.Name())
			// Pindahkan file satu-persatu (Rename)
			os.Rename(oldFile, newFile)
		}
		// Hapus folder lama yang sudah kosong melompong
		os.Remove(oldPath)
	} else {
		// Folder baru belum ada, langsung ganti nama folder utuh (Instan!)
		fmt.Printf("🚚 STORAGE SYNC: Renaming folder [%s] -> [%s]\n", oldPath, newPath)
		err := os.Rename(oldPath, newPath)
		if err != nil {
			return fmt.Errorf("failed to sync directory: %v", err)
		}
	}

	return nil
}
