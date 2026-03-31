package routes

import (
	"github.com/gin-gonic/gin"
)

// SetupRoutes mengatur root mounting seluruh route service SIUKAT
func SetupRoutes(r *gin.Engine) {
	// Root Endpoint sama seperti "GET /" di app.js
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to SIUKAT Service API (Golang Version)",
			"status":  "Online",
		})
	})

	// Mounting semua router dari sub module
	api := r.Group("/")
	AuthRoutes(api)       // Mounting endpoint /users/login
	UktRoutes(api)        // Mounting endpoint /ukt/...
	CmahasiswaRoutes(api) // Mounting endpoint /cmahasiswa/...
	AyahRoutes(api)       // Mounting endpoint /ayah/...
	IbuRoutes(api)
	RumahRoutes(api)
	ListrikRoutes(api)
	KendaraanRoutes(api)
	PendukungRoutes(api)
	WaliRoutes(api)
	PdfRoutes(api)
	DashboardRoutes(api)
	FakultasRoutes(api)
	KabkotRoutes(api)
	KecamatanRoutes(api)
	PekerjaanRoutes(api)
	ProdiRoutes(api)
	ProvinsiRoutes(api)
	InfoRoutes(api)
	AdminRoutes(api)
	CaptchaRoutes(api)
	KeringananRoutes(api)
	SummaryRoutes(api)
	VerifikasiRoutes(api)
}
