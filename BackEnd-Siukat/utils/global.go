package utils

import (
	"fmt"
	"strings"
)

// Rupiah — Mirroring logic from global.js Node.js
// Mengonversi angka menjadi format mata uang Rupiah (contoh: 10000 -> Rp 10.000)
func Rupiah(angka interface{}) string {
	if angka == nil {
		return ""
	}

	// Konversi ke string dan hapus titik (desimal) jika ada, sesuai logic Node.js
	str := fmt.Sprintf("%v", angka)
	str = strings.ReplaceAll(str, ".", "")

	var result string
	length := len(str)
	for i := 0; i < length; i++ {
		// Tambahkan titik setiap 3 digit dari belakang
		if i > 0 && i%3 == 0 {
			result = "." + result
		}
		result = string(str[length-1-i]) + result
	}

	return "Rp " + result
}
