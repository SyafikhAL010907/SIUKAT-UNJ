# Laporan Struktur Backend Project (Versi Golang): BackEnd-Siukat

Berikut adalah rancangan struktur folder dan file untuk backend versi Golang (menggantikan Node.js). 
Semua dependensi dan file terkait `bio_` (Bakum) **telah dihapus sepenuhnya**.

## 1. Identifikasi Tech Stack
- **Bahasa**: Golang (Go)
- **Framework Web**: Gin Gonic (`github.com/gin-gonic/gin`) - untuk performa maksimal menggantikan Express.js.
- **Database (ORM)**: GORM (`gorm.io/gorm` & `gorm.io/driver/mysql`) - menggantikan Sequelize.
- **Autentikasi**: JWT (`github.com/golang-jwt/jwt/v5`) - menggantikan Passport.js.
- **File Handling**: Native Gin Multipart Form - menggantikan Multer & Express-FileUpload.
- **Utilitas**:
  - `godotenv`: Untuk manajemen file `.env`.
  - Waktu menggunakan module native `time` bawaan Golang.

## 2. Analisis Pola Arsitektur (Golang Standard Layout)
Pola yang digunakan adalah **MVC dengan Service Repository Pattern**, namun disesuaikan dengan praktek umum di Golang:
- **Models (`/models`)**: Berisi struct untuk pemetaan ke tabel MySQL via GORM. Seluruh `bio_` struct diabaikan, dan relasi yang berkaitan dengannya dilepas.
- **Routes / Controllers (`/routes`)**: Menghandle request HTTP (Gin Handlers). 
- **Services (`/services`)**: Memuat core business logic (hitungan bobot, validasi, dll). Dibuat se-identik mungkin dengan Node.js.
- **Constants (`/constants`)**: Menyimpan secret key, status konstan, atau nilai bawaan lainnya.
- **Config (`/config`)**: Setup koneksi database dan inisialisasi lingkungan.

## 3. Struktur Lengkap Project (File & Folder Golang)

```text
BackEnd-Siukat
├── config/
│   └── database.go                 (Koneksi Database GORM MySQL)
├── constants/
│   ├── port.go                     (Konfigurasi Port Default)
│   └── secret.go                   (JWT Secret Key)
├── models/                         (Daftar Tabel Database Golang Structs - 35 Files)
│   ├── admin.go
│   ├── ayah.go
│   ├── bobot.go
│   ├── captcha.go
│   ├── cmahasiswa.go
│   ├── data_sekolah.go
│   ├── fakultas.go
│   ├── ibu.go
│   ├── info.go
│   ├── kabkot.go
│   ├── kecamatan.go
│   ├── kendaraan.go
│   ├── keringanan.go
│   ├── listrik.go
│   ├── log_ayah.go
│   ├── log_cmahasiswa.go
│   ├── log_ibu.go
│   ├── log_kendaraan.go
│   ├── log_keringanan.go
│   ├── log_listrik.go
│   ├── log_pendukung.go
│   ├── log_rumah.go
│   ├── log_value.go
│   ├── log_wali.go
│   ├── pekerjaan.go
│   ├── pendukung.go
│   ├── prodi.go
│   ├── provinsi.go
│   ├── refInfo.go
│   ├── rumah.go
│   ├── ukt.go
│   ├── user.go
│   ├── value.go
│   ├── verifikasi.go
│   └── wali.go
├── routes/                         (API Endpoints Gin - 25 Files)
│   ├── admin.go
│   ├── ayah.go
│   ├── captcha.go
│   ├── cmahasiswa.go               (Utama: Input Mahasiswa - Tanpa referensi /bio/)
│   ├── dashboardapi.go
│   ├── fakultas.go
│   ├── ibu.go
│   ├── index.go                    (Setup Router Utama dan Middleware)
│   ├── info.go
│   ├── kabkot.go
│   ├── kecamatan.go
│   ├── kendaraan.go
│   ├── keringanan.go
│   ├── listrik.go
│   ├── pdf.go                      (Generate Laporan PDF)
│   ├── pekerjaan.go
│   ├── pendukung.go
│   ├── prodi.go
│   ├── provinsi.go                 (Tanpa routing /bio/)
│   ├── rumah.go
│   ├── summary.go
│   ├── ukt.go                      (Proses UKT API)
│   ├── users.go                    (Manajemen User)
│   ├── verifikasi.go
│   └── wali.go
├── services/                       (Logika Bisnis - 15 Files)
│   ├── ayah.go
│   ├── cmahasiswa.go
│   ├── ibu.go
│   ├── index.go
│   ├── kendaraan.go
│   ├── keringanan.go
│   ├── listrik.go
│   ├── pendukung.go
│   ├── prodi.go
│   ├── rumah.go
│   ├── summarydata.go              (Olahraga Data Dashboard)
│   ├── ukt.go                      (LOGIKA UTAMA UKT - Mirror Calculation)
│   ├── users.go
│   ├── value.go                    (Hitung Nilai Bobot)
│   └── wali.go
├── public/                         (File Statis Image/PDF Temporary)
├── views/                          (Template Tampilan)
├── StrukturDataBE-Golang.md        (Dokumentasi Struktur Ini)
├── .env                            (Configuration Environment)
├── .env.example
├── .gitignore                      (Standard Go Gitignore)
├── go.mod                          (Golang Modules Initialization)
├── go.sum                          (Module Checksums)
└── main.go                         (Entry Point Aplikasi Golang Server)
```

_Catatan:_ Semua file service dan route untuk `bio_cmahasiswa`, `bio_ortu_cmahasiswa`, `bio_sekolah_cmahasiswa`, `bio_agama`, `bio_pendidikan`, dll. tidak diikutkan sesuai dengan _purge_ scope dari project versi terbaru ini.
