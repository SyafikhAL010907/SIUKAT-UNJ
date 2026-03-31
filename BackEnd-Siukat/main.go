package main

import (
	"log"
	"os"

	"BackEnd-Siukat/config"
	"BackEnd-Siukat/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Load Enviroment Variables dari file .env
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
	configCors.AllowOrigins = []string{
		"http://siukat.unj.ac.id",
		// Masukkan origin lain jika perlu, misal: "http://localhost:3000"
	}
	configCors.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	configCors.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(configCors))

	// Serve file statis (img, pdf pengumuman, foto upload mahasiswa)
	r.Static("/public", "./public")
	// Render Views HTML Template untuk endpoint PDF
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
