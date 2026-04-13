package main

import (
	"log"
	"os"

	"BackEnd-Siukat/config"
	"BackEnd-Siukat/models"
	"BackEnd-Siukat/routes"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"html/template"
	"time"
)

func main() {
	// 1. Load Enviroment Variables dari file .env
	// Dikarenakan dieksekusi via "go run cmd/api/main.go" dari root, 
	// godotenv akan mencari .env di root project.
	if err := godotenv.Load(); err != nil {
		log.Println("Note: .env file not found, using system environment variables")
	}

	// 2. Inisialisasi Database
	config.ConnectDB()

	// 3. Inisialisasi Gin Router
	r := gin.Default()

	// 4. Setup Global Middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// Implementasi CORS seperti pada app.js Node.js
	configCors := cors.DefaultConfig()
configCors.AllowOrigins = []string{"http://10.255.1.149:3000", "http://10.255.1.149:3001", "http://localhost:3000"} // Hapus koma di sini
configCors.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"} // Hapus koma di sini
configCors.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"} // Hapus koma di sini)

	// Serve file statis (img, pdf pengumuman, foto upload mahasiswa)
	// Path relatif terhadap root project eksekusi
	r.Static("/public", "./public")
	// Serve folder uploads (foto mahasiswa)
	r.Static("/uploads", "./uploads")
	// Serve logo UNJ langsung agar bisa diakses di template PDF
	r.StaticFile("/unj.png", "./public/img/unj.png")
	
	// Render Views HTML Template untuk endpoint PDF
	// Path relatif terhadap root project eksekusi
	r.SetFuncMap(template.FuncMap{
		"add": func(a, b int) int {
			return a + b
		},
		"date": func(format string) string {
			if format == "Y" {
				return time.Now().Format("2006")
			}
			return time.Now().Format(format)
		},
		"getNominal": func(ukt models.Ukt, golongan string) int {
			switch golongan {
			case "I": return ukt.I
			case "II": return ukt.II
			case "III": return ukt.III
			case "IV": return ukt.IV
			case "V": return ukt.V
			case "VI": return ukt.VI
			case "VII": return ukt.VII
			case "VIII": return ukt.VIII
			case "KJMU": return 3600000 // Standar KJMU
			default: return 0
			}
		},
		"formatRupiah": func(amount int) string {
			s := fmt.Sprintf("%d", amount)
			if len(s) <= 3 {
				return s
			}
			var res string
			for i, v := range s {
				if (len(s)-i)%3 == 0 && i != 0 {
					res += "."
				}
				res += string(v)
			}
			return res
		},
		"now": func() string {
			return time.Now().Format("02 January 2006, 15:04 WIB")
		},
	})
	r.LoadHTMLGlob("views/pdf/*.html")

	// 5. Inisialisasi Routes
	routes.SetupRoutes(r)

	// 6. Jalankan Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Starting Server on Port %s...", port)
	r.Run(":" + port)
}
