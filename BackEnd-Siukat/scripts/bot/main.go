package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
)

const (
	baseURL  = "http://localhost:8080/api/v1"
	username = "925111008305"
	password = "16092006"
)

type LoginResponse struct {
	Token string `json:"token"`
}

func main() {
	fmt.Println("🚀 SIUKAT FULL-DOCUMENT TESTER BOT")
	fmt.Println("------------------------------------")

	// 1. LOGIN
	fmt.Printf("logging in as %s...\n", username)
	token, err := login()
	if err != nil {
		fmt.Printf("❌ Login Failed: %v\n", err)
		return
	}
	fmt.Println("✅ Login successful! Token acquired.")

	// 2. DEFINE ALL UPLOAD TEST CASES (Field vs Endpoint)
	testCases := []struct {
		endpoint  string
		fieldName string
		fileName  string
	}{
		{"/cmahasiswa/upload-foto", "foto", "Foto_Profil_Mhs.jpg"},
		{"/ayah/edit", "file_scan_ktp_ayah", "KTP_Ayah_Daniel.jpg"},
		{"/ayah/edit", "file_scan_slip_ayah", "Slip_Gaji_Ayah.pdf"},
		{"/ibu/edit", "file_scan_ktp_ibu", "KTP_Ibu_Daniel.jpg"},
		{"/ibu/edit", "file_scan_slip_ibu", "Slip_Gaji_Ibu.pdf"},
		{"/rumah/edit", "file_scan_pbb", "Pajak_Bumi_Bangunan.pdf"},
		{"/listrik/edit", "file_scan_listrik", "Tagihan_Listrik_Bulanan.pdf"},
		{"/kendaraan/edit", "file_scan_motor", "STNK_Motor_PCX.jpg"},
		{"/kendaraan/edit", "file_scan_mobil", "STNK_Mobil_Alphard.jpg"},
		{"/pendukung/edit", "file_scan_kk", "Kartu_Keluarga_Fix.jpg"},
		{"/pendukung/edit", "file_scan_pernyataan_kebenaran", "Surat_Pernyataan_Kejujuran.pdf"},
		{"/wali/edit", "file_scan_wali", "Scan_Dokumen_Wali.pdf"},
	}

	for _, tc := range testCases {
		// Create Dummy File
		fmt.Printf("\n📂 Testing Field: [%s]\n", tc.fieldName)
		content := fmt.Sprintf("Ini adalah isi dummy untuk dokumen %s", tc.fileName)
		if err := os.WriteFile(tc.fileName, []byte(content), 0644); err != nil {
			fmt.Printf("❌ Failed to create file %s: %v\n", tc.fileName, err)
			continue
		}

		// Trigger Upload
		fmt.Printf("   Firing request to: %s\n", tc.endpoint)
		resp, err := uploadFile(token, tc.endpoint, tc.fieldName, tc.fileName)
		
		if err != nil {
			fmt.Printf("   ❌ Upload Request Failed: %v\n", err)
			os.Remove(tc.fileName)
			continue
		}
		
		// Print Response
		body, _ := io.ReadAll(resp.Body)
		if resp.StatusCode == http.StatusOK {
			fmt.Println("   ✅ SUCCESS: File saved to dynamic folder.")
		} else {
			fmt.Printf("   ⚠️ FAILED (Status %d): %s\n", resp.StatusCode, string(body))
		}
		
		resp.Body.Close()
		os.Remove(tc.fileName)
	}

	fmt.Println("\n------------------------------------")
	fmt.Println("🏁 SIUKAT BOT: All documents sent. Check your 'uploads/' folder now!")
}

func login() (string, error) {
	loginData := map[string]interface{}{
		"no_peserta":    username,
		"password":      password,
		"kode_captcha": 1,
		"jawaban":      "4",
	}
	jsonData, _ := json.Marshal(loginData)

	resp, err := http.Post(baseURL+"/users/login", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("login status: %d, body: %s", resp.StatusCode, string(body))
	}

	var lr LoginResponse
	if err := json.NewDecoder(resp.Body).Decode(&lr); err != nil {
		return "", err
	}
	return lr.Token, nil
}

func uploadFile(token, endpoint, fieldName, filePath string) (*http.Response, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Extra metadata for various endpoints (simulating real forms)
	_ = writer.WriteField("nama_ayah", "DANIEL VALENTINO")
	_ = writer.WriteField("status_ayah", "hidup")
	_ = writer.WriteField("nama_ibu", "IBU DANIEL")
	_ = writer.WriteField("status_ibu", "hidup")
	_ = writer.WriteField("status_kepemilikan", "milik_sendiri")
	_ = writer.WriteField("status_motor", "ada")
	_ = writer.WriteField("status_mobil", "ada")

	part, err := writer.CreateFormFile(fieldName, filepath.Base(filePath))
	if err != nil {
		return nil, err
	}
	_, err = io.Copy(part, file)
	if err != nil {
		return nil, err
	}
	writer.Close()

	// All our edit endpoints are PUT
	method := "PUT"
	req, err := http.NewRequest(method, baseURL+endpoint, body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	return client.Do(req)
}
