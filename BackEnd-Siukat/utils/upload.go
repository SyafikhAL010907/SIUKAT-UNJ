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
	// 1. Hapus semua karakter yang bukan huruf, angka, atau underscore
	reg, _ := regexp.Compile("[^a-zA-Z0-9_]+")
	s = reg.ReplaceAllString(s, "")

	return s
}

// HandleDynamicUpload creates dynamic directory and saves file (overwrites if exists)
// Folder structure: uploads/{SanitizedNama}_{NoPeserta}/{Original|Sanggah}/{Sanitized_Filename.ext}
// forcedFilename (optional): if provided, uses this name instead of original while keeping extension
func HandleDynamicUpload(c *gin.Context, file *multipart.FileHeader, namaMahasiswa string, noPeserta string, atribut string, forcedFilename ...string) (string, error) {
	// 1. Sanitize Nama and NoPeserta for Folder Name
	sanitizedNama := SanitizeString(namaMahasiswa)
	folderName := fmt.Sprintf("%s_%s", sanitizedNama, noPeserta)

	// 2. Define Root & Sub Directory (Original/Sanggah)
	// Kita gunakan strings.Title agar rapi (misal: "sanggah" -> "Sanggah")
	subFolder := strings.Title(strings.ToLower(atribut))
	if subFolder == "" {
		subFolder = "Original" // Default jika kosong
	}
	
	targetDir := filepath.Join("uploads", folderName, subFolder)

	// 3. Create Directory if it doesn't exist (MkdirAll is idempotent)
	if err := os.MkdirAll(targetDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create directory: %v", err)
	}

	// 4. Sanitize Filename (keep extension)
	ext := filepath.Ext(file.Filename)
	var finalFilename string

	if len(forcedFilename) > 0 && forcedFilename[0] != "" {
		baseForce := SanitizeString(forcedFilename[0])
		
		fmt.Printf("🧹 STORAGE CLEANUP (Wildcard): Searching for previous files in [%s]\n", targetDir)
		
		var pattern string
		if strings.HasPrefix(baseForce, "Profile") {
			pattern = filepath.Join(targetDir, "Profile_*")
		} else {
			pattern = filepath.Join(targetDir, baseForce+".*")
		}

		matches, _ := filepath.Glob(pattern)
		for _, match := range matches {
			fmt.Printf("🧹 Removing old match: [%s]\n", match)
			os.Remove(match)
		}

		finalFilename = baseForce + ext
	} else {
		base := strings.TrimSuffix(file.Filename, ext)
		sanitizedBase := SanitizeString(base)
		finalFilename = sanitizedBase + ext
	}

	// 5. Construct Final Path for SaveUploadedFile
	finalSavePath := filepath.Join(targetDir, finalFilename)

	if err := c.SaveUploadedFile(file, finalSavePath); err != nil {
		return "", fmt.Errorf("failed to save file: %v", err)
	}

	// Return relative path for database storage (uploads/Folder/SubFolder/File.ext)
	dbPath := filepath.ToSlash(filepath.Join("uploads", folderName, subFolder, finalFilename))
	fmt.Printf("📂 DEBUG DYNAMIC UPLOAD: TargetDir [%s] DBPath [%s]\n", targetDir, dbPath)
	return dbPath, nil
}

// CopyStudentFiles — Menyalin fisik isi folder dari satu atribut ke atribut lain (misal: Original -> Sanggah)
func CopyStudentFiles(namaMahasiswa, noPeserta string, fromAtribut, toAtribut string) error {
	folderName := fmt.Sprintf("%s_%s", SanitizeString(namaMahasiswa), noPeserta)
	
	fromSub := strings.Title(strings.ToLower(fromAtribut))
	toSub := strings.Title(strings.ToLower(toAtribut))
	
	srcDir := filepath.Join("uploads", folderName, fromSub)
	dstDir := filepath.Join("uploads", folderName, toSub)

	// 1. Cek folder sumber, kalau nggak ada ya berarti belum ada upload, return nil aja
	if _, err := os.Stat(srcDir); os.IsNotExist(err) {
		return nil
	}

	// 2. Buat folder tujuan
	if err := os.MkdirAll(dstDir, 0755); err != nil {
		return err
	}

	// 3. Baca semua file di folder sumber & copy ke tujuan
	entries, err := os.ReadDir(srcDir)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		if entry.IsDir() { continue }
		
		sourcePath := filepath.Join(srcDir, entry.Name())
		destPath := filepath.Join(dstDir, entry.Name())

		// Baca file
		input, err := os.ReadFile(sourcePath)
		if err != nil { return err }

		// Tulis file ke tujuan (Otomatis Replace jika ada)
		err = os.WriteFile(destPath, input, 0644)
		if err != nil { return err }
	}

	fmt.Printf("📋 STORAGE CLONE: Success copying all files from [%s] to [%s]\n", srcDir, dstDir)
	return nil
}

// DeleteOldFile — Safely removes a file from the filesystem if it exists.
func DeleteOldFile(filePath string) {
	if filePath == "" {
		return
	}
	
	if _, err := os.Stat(filePath); err == nil {
		fmt.Printf("🧹 STORAGE CLEANUP: Removing old file [%s]\n", filePath)
		err := os.Remove(filePath)
		if err != nil {
			fmt.Printf("⚠️ WARNING: Failed to delete old file [%s]: %v\n", filePath, err)
		}
	}
}

// SyncStudentFolder — Mengganti nama folder (Rename) di sistem file jika Nama atau NoPeserta berubah.
func SyncStudentFolder(oldName, oldNP, newName, newNP string) error {
	oldFolder := fmt.Sprintf("%s_%s", SanitizeString(oldName), oldNP)
	newFolder := fmt.Sprintf("%s_%s", SanitizeString(newName), newNP)

	if oldFolder == newFolder {
		return nil
	}

	oldPath := filepath.Join("uploads", oldFolder)
	newPath := filepath.Join("uploads", newFolder)

	if _, err := os.Stat(oldPath); os.IsNotExist(err) {
		return nil
	}

	if _, err := os.Stat(newPath); err == nil {
		fmt.Printf("📦 STORAGE SYNC: Merging [%s] into existing [%s]\n", oldPath, newPath)
		entries, err := os.ReadDir(oldPath)
		if err != nil { return err }
		
		for _, entry := range entries {
			oldSub := filepath.Join(oldPath, entry.Name())
			newSub := filepath.Join(newPath, entry.Name())
			
			// Jika subfolder (Original/Sanggah) sudah ada di tujuan, merge isinya
			if entry.IsDir() {
				os.MkdirAll(newSub, 0755)
				files, _ := os.ReadDir(oldSub)
				for _, f := range files {
					os.Rename(filepath.Join(oldSub, f.Name()), filepath.Join(newSub, f.Name()))
				}
				os.Remove(oldSub)
			} else {
				os.Rename(oldSub, newSub)
			}
		}
		os.Remove(oldPath)
	} else {
		fmt.Printf("🚚 STORAGE SYNC: Renaming folder [%s] -> [%s]\n", oldPath, newPath)
		return os.Rename(oldPath, newPath)
	}

	return nil
}

