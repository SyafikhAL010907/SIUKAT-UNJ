package services

// Package services berisi seluruh business logic SIUKAT Golang
// Ini adalah file index untuk mendokumentasikan service-service yang tersedia
//
// Service List:
//   - AyahService     : CRUD data ayah mahasiswa
//   - IbuService      : CRUD data ibu mahasiswa
//   - WaliService     : CRUD data wali mahasiswa
//   - RumahService    : CRUD data rumah mahasiswa
//   - ListrikService  : CRUD data listrik mahasiswa
//   - KendaraanService: CRUD data kendaraan mahasiswa
//   - PendukungService: CRUD data tanggungan mahasiswa
//   - CmahasiswaService: Logika utama mahasiswa & finalisasi
//   - UktService      : Algoritma perhitungan UKT (V1-V5, IKB, decisionMaker)
//   - ValueService    : Set & Get nilai bobot UKT
//   - DashboardService: Raw SQL statistik dashboard admin
//   - KeringananService: Manajemen keringanan UKT
//   - ProdiService    : Referensi program studi
//   - UsersService    : Manajemen user & autentikasi
//   - SummaryService  : Rekap data mahasiswa
