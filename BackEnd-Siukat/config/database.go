package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

var DBWsdl *gorm.DB  // Koneksi ke WSDL_UNJ (Baru)


func ConnectDB() {
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASS")
	host := os.Getenv("DB_HOST")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "3306"
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Asia%%2FJakarta",
		user, password, host, port, dbname)

	// Custom logger agar query lebih teratur tampilnya (optional, mirroring console logging biasa)
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold: time.Second,   // Slow SQL threshold
			LogLevel:      logger.Silent, // Log level
			Colorful:      true,          // Disable color
		},
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})

	if err != nil {
		// FALLBACK 1: Jika koneksi ke host utama (Server) gagal, coba ke localhost
		if host != "localhost" && host != "127.0.0.1" {
			log.Printf("FALLBACK: Gagal koneksi ke %s (%v). Mencoba ke localhost...", host, err)
			host = "localhost"
			dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Asia%%2FJakarta",
				user, password, host, port, dbname)
			db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
				Logger: newLogger,
			})

			// FALLBACK 2: Jika di localhost masih gagal (biasanya karena perbedaan password), coba tanpa password
			if err != nil {
				log.Printf("FALLBACK: Koneksi localhost dengan password gagal. Mencoba tanpa password...")
				dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Asia%%2FJakarta",
					user, "", host, port, dbname)
				db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
					Logger: newLogger,
				})
			}
		}

		if err != nil {
			log.Fatalf("FAILED: Unable to connect to database: %v", err)
		}
	}

	// Set timezone ke WIB (+07:00) secara manual pas koneksi terbuka
	db.Exec("SET time_zone = '+07:00'")

	fmt.Println("SUCCESS: Connection to database SIUKAT established successfully.")
	DB = db

	// --- KONEKSI 2: WSDL UNJ (With Robust Fallback) ---
	hostWsdl := os.Getenv("WSDL_DB_HOST")
	dsnWsdl := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Asia%%2FJakarta",
		os.Getenv("WSDL_DB_USER"), os.Getenv("WSDL_DB_PASS"), hostWsdl, os.Getenv("WSDL_DB_PORT"), os.Getenv("WSDL_DB_NAME"))
	
	dbWsdl, errWsdl := gorm.Open(mysql.Open(dsnWsdl), &gorm.Config{})

	// FALLBACK 1: Jika gagal, coba ke localhost
	if errWsdl != nil && hostWsdl != "localhost" && hostWsdl != "127.0.0.1" {
		log.Printf("FALLBACK WSDL: Gagal koneksi ke %s. Mencoba ke localhost...", hostWsdl)
		hostWsdl = "localhost"
		dsnWsdl = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Asia%%2FJakarta",
			os.Getenv("WSDL_DB_USER"), os.Getenv("WSDL_DB_PASS"), hostWsdl, os.Getenv("WSDL_DB_PORT"), os.Getenv("WSDL_DB_NAME"))
		dbWsdl, errWsdl = gorm.Open(mysql.Open(dsnWsdl), &gorm.Config{})

		// FALLBACK 2: Jika masih gagal, coba tanpa password (khusus localhost)
		if errWsdl != nil {
			log.Printf("FALLBACK WSDL: Koneksi localhost dengan password gagal. Mencoba tanpa password...")
			dsnWsdl = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Asia%%2FJakarta",
				os.Getenv("WSDL_DB_USER"), "", hostWsdl, os.Getenv("WSDL_DB_PORT"), os.Getenv("WSDL_DB_NAME"))
			dbWsdl, errWsdl = gorm.Open(mysql.Open(dsnWsdl), &gorm.Config{})
		}
	}

	if errWsdl != nil {
		log.Printf("WARNING: Gagal koneksi ke DB WSDL: %v. Aplikasi tetap berjalan tanpa fitur WSDL.", errWsdl)
	} else {
		DBWsdl = dbWsdl
		fmt.Println("SUCCESS: Connection to database WSDL established successfully.")
	}
}

