
localhost:3000 ke localhost:8080/api/v1
# SIUKAT API Documentation (Restructured Golang)

Dokumentasi ini berisi daftar "jalur kabel" (endpoint) Backend Golang SIUKAT biar lu gampang sinkronin sama Frontend.

- **Base URL**: `http://localhost:8080/api/v1`
- **Auth Strategy**: JWT Bearer Token (Header: `Authorization: <token>`)

---

## 🔐 Authentication & Security

### 1. Captcha Challenge
Gunakan ini sebelum login buat dapetin kode & jawaban captcha.
- **URL**: `GET /api/v1/captcha/`
- **Response**:
  ```json
  {
    "kode": "uuid-kode",
    "jawaban": "data:image/png;base64..." 
  }
  ```

### 2. Login Mahasiswa/Admin
- **URL**: `POST /api/v1/users/login`
- **Body**:
  ```json
  {
    "no_peserta": "12345",
    "password": "password",
    "kode": "uuid-dari-captcha",
    "jawaban": "hasil-jawaban-user"
  }
  ```
- **Response**:
  ```json
  {
    "message": "ok",
    "token": "JWT_TOKEN_HERE",
    "flag": "belum_isi/pengisian/selesai_isi"
  }
  ```

---

## 🎓 Biodata Mahasiswa (`/cmahasiswa`)

### 1. Cek Kelangkapan Data (Verifikasi)
Dipakai buat nentuin apakah tombol "Selesai Isi" boleh muncul.
- **URL**: `GET /api/v1/cmahasiswa/verifikasi` (Auth Required)
- **Response**:
  ```json
  {
    "verifikasi": true,
    "cmahasiswa": true,
    "ayah": true,
    "ibu": true,
    "rumah": true,
    ...
  }
  ```

### 2. Update Data Mahasiswa
- **URL**: `PUT /api/v1/cmahasiswa/edit` (Auth Required)
- **Method**: `multipart/form-data` (kalo ada upload foto)
- **Fields**: Semua field `tb_cmahasiswa`.

---

## 👨‍👩‍👦 Data Keluarga & Ekonomi

### 1. Data Ayah/Ibu/Wali
- **URL**: `PUT /api/v1/ayah/edit`, `PUT /api/v1/ibu/edit`, `PUT /api/v1/wali/edit` (Auth Required)
- **Logic**: Backend bakal otomatis ngelakuin "Set Empty" kalo statusnya "Wafat" atau "Tidak Ada".

### 2. Data Aset (Rumah, Kendaraan, Listrik)
- **URL**: `PUT /api/v1/rumah/edit`, `PUT /api/v1/kendaraan/edit`, `PUT /api/v1/listrik/edit`
- **Logic**: Menyesuaikan status kepemilikan (misal: kalo kontrak, field PBB dihapus).

---

## 📊 Dashboard Admin (`/dashboard`)

### 1. Stats Ringkasan
- **URL**: `GET /api/v1/dashboard/meta` (Auth Required - Admin)
- **Output**: Jumlah mahasiswa per fakultas & status pengisian.

---

## 📄 Output & PDF

### 1. Cetak Bukti UKT
- **URL**: `GET /api/v1/pdf/generate/:no_peserta`
- **Output**: Stream PDF file.

---

> [!IMPORTANT]
> **Status Jalur Kabel**: Amannn Brooo! Jalur koneksi ke database `siukat_2026_unj` udah gua tes, query-nya udah sinkron sama skema tabel yang baru. Frontend tinggal nembak ke endpoint di atas.