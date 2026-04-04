package constants

import "os"

// GetJWTSecret mengambil JWT secret key dari env atau default fallback
func GetJWTSecret() string {
	secret := os.Getenv("SECRET")
	if secret == "" {
		return "rahasia_negara_siukat_2026_unj"
	}
	return secret
}
