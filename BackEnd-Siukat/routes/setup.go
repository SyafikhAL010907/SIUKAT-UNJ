package routes

import "github.com/gin-gonic/gin"

// SetupRoutes mendaftarkan semua route ke Gin Engine
// Parity dengan app.js / router di Node.js (semua endpoint digabung di sini)
func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api/v1")
	api.Static("/img", "./public/img")
	api.Static("/uploads", "./uploads")

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
