package constants

import "os"

// GetJWTSecret mengambil JWT secret key dari env atau default fallback
func GetJWTSecret() string {
	secret := os.Getenv("SECRET")
	if secret == "" {
		return "siukat_default_secret_key_change_in_production"
	}
	return secret
}
