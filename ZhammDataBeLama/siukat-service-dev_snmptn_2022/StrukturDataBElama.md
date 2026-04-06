# Laporan Analisis Struktur Backend Project: siukat-service-dev

Halo bro! Ini hasil analisis mendalam gua buat struktur folder dan file di project backend **siukat-service-dev_snmptn_2022**.

## 1. Identifikasi Tech Stack
Berdasarkan file `package.json` dan `app.js`, berikut adalah teknologi yang dipake:
- **Runtime**: Node.js
- **Framework**: Express.js (v4.17.1)
- **Database (ORM)**: Sequelize (v4.44.4) dengan `mysql2`.
- **Autentikasi**: Passport.js dengan strategi JWT (JSON Web Token).
- **Template Engine**: Jade/EJS (digunakan untuk rendering PDF atau tabel tertentu di sisi server).
- **File Handling**: 
  - `Multer`: Untuk upload file (biasanya foto/dokumen).
  - `Express-FileUpload`: Library alternatif buat handling upload.
- **Utils**: 
  - `Moment.js` & `Moment-timezone`: Handling waktu.
  - `Lodash`: Utility manipulasi data.
  - `Bcrypt`: Enkripsi password.
  - `Morgan`: HTTP request logger.

## 2. Analisis Pola Arsitektur
Project ini menggunakan pola **Hybrid MVC (Model-View-Controller)** dengan tambahan **Service Layer** agar logika bisnis tidak menumpuk di route.
- **Model Layer (`/models`)**: Mengurus skema tabel database via Sequelize.
- **Route/Controller Layer (`/routes`)**: Mengurus endpoint API dan kontrol alur request. Di sini banyak logika kontroler yang langsung ditaruh di route file.
- **Service Layer (`/services`)**: Ini bagian paling bagusnya, di mana logika bisnis yang berat (kayak hitung UKT atau sinkronisasi data) dipisah biar rapi.
- **View Layer (`/views`)**: Digunakan buat template dokumen (PDF/HTML) yang digenerate dari server.
- **Middleware (`/app.js`)**: Settingan global kayak CORS, Body Parser, dan Passport Auth ada di sini.

## 3. Kritik & Saran Struktur
Strukturnya udah lumayan rapi buat project skala menengah, tapi ada beberapa catatan:
- **Redundansi Dependencies**: Ada `bcrypt` dan `bcrypt-nodejs` di depedensi. Saran gua pake salah satu aja (pilih `bcrypt`) biar gak ambigu.
- **Double Upload Handler**: Pake `multer` dan `express-fileupload` sekaligus bisa bikin bingung tim dev. Lebih baik pilih salah satu yang paling cocok.
- **Penyimpanan Dummy Data**: Di folder `DATA/` ada file `.sql` yang ukurannya cukup gede. Sebaiknya ditaruh di luar folder project utama atau di `/ignored` biar gak ikutan ke-push ke repo production.
- **Lokasi File Global**: File `global.js` dan `index.html` yang ada di root sebaiknya dipindahin ke folder khusus (misal: `config/` atau `public/`) biar root project tetep bersih.

## 4. File Krusial Buat Dipelajarin (Alur Data)
Kalo lu mau cepet paham, pelajarin file ini urutannya:
1.  **`app.js`**: Pusat syaraf project. Lu bisa liat middleware apa aja yang jalan dan daftar endpoint-nya di mana.
2.  **`bin/www`**: File yang sebenernya "nge-gas" servernya. Lu bisa tau servernya jalan di port berapa.
3.  **`models/user.js` & `models/cmahasiswa.js`**: Biar lu paham struktur data Mahasiswa dan User itu kayak gimana di database.
4.  **`routes/cmahasiswa.js`**: Lu bisa liat gimana cara API nerima data inputan mahasiswa.
5.  **`services/ukt.js`**: Ini file paling "otak" di project ini, karena di sini logika penentuan UKT dikerjain.

---

## Struktur Lengkap Project (File & Folder)
Berikut adalah "peta" lengkap isi project lu:

```text
Project: siukat-service-dev_snmptn_2022
.
├── app.js                          (Konfigurasi Utama Express)
├── bin/
│   └── www                         (Entry Point Server)
├── config/
│   ├── database.js                 (Koneksi Database)
│   ├── multer.js                   (Setting Upload File)
├── constants/
│   ├── port.js                     (Konfigurasi Port)
│   └── secret.js                   (JWT Secret Key)
├── DATA/
│   ├── lengkap mandiri.sql         (Dump DB - Backup)
│   ├── ukt_2020_snmptn_devel.sql   (Dump DB - Development)
│   └── ukt_development_2018.sql    (Dump DB - Legacy)
├── global.js                       (Variabel Global App)
├── index.html                      (Fallback/Landing Simple)
├── models/                         (Daftar Tabel Database - 46 Files)
│   ├── admin.js
│   ├── ayah.js
│   ├── bio_cmahasiswa.js
│   ├── bio_ortu_cmahasiswa.js
│   ├── bio_ref_agama.js
│   ├── bio_ref_jurusan.js
│   ├── bio_ref_pekerjaan.js
│   ├── bio_ref_pendidikan.js
│   ├── bio_ref_penghasilan.js
│   ├── bio_ref_tinggal.js
│   ├── bio_ref_transportasi.js
│   ├── bio_ref_wilayah.js
│   ├── bio_sekolah_cmahasiswa.js
│   ├── bobot.js
│   ├── captcha.js
│   ├── cmahasiswa.js
│   ├── data_sekolah.js
│   ├── fakultas.js
│   ├── ibu.js
│   ├── info.js
│   ├── kabkot.js
│   ├── kecamatan.js
│   ├── kendaraan.js
│   ├── keringanan.js
│   ├── listrik.js
│   ├── log_ayah.js
│   ├── log_cmahasiswa.js
│   ├── log_ibu.js
│   ├── log_kendaraan.js
│   ├── log_keringanan.js
│   ├── log_listrik.js
│   ├── log_pendukung.js
│   ├── log_rumah.js
│   ├── log_value.js
│   ├── log_wali.js
│   ├── pekerjaan.js
│   ├── pendukung.js
│   ├── prodi.js
│   ├── provinsi.js
│   ├── refInfo.js
│   ├── rumah.js
│   ├── ukt.js
│   ├── user.js
│   ├── value.js
│   ├── verifikasi.js
│   └── wali.js
├── routes/                         (API Endpoints - 35 Files)
│   ├── admin.js
│   ├── ayah.js
│   ├── bio_agama.js
│   ├── bio_cmahasiswa.js
│   ├── bio_jurusan.js
│   ├── bio_ortu_cmahasiswa.js
│   ├── bio_pendidikan.js
│   ├── bio_penghasilan.js
│   ├── bio_ref_sekolah.js
│   ├── bio_sekolah_cmahasiswa.js
│   ├── bio_tinggal.js
│   ├── bio_transportasi.js
│   ├── captcha.js
│   ├── cmahasiswa.js               (Utama: Input Mahasiswa)
│   ├── dashboardapi.js
│   ├── fakultas.js
│   ├── ibu.js
│   ├── index.js
│   ├── info.js
│   ├── kabkot.js
│   ├── kecamatan.js
│   ├── kendaraan.js
│   ├── keringanan.js
│   ├── listrik.js
│   ├── pdf.js                      (Generate Laporan PDF)
│   ├── pekerjaan.js
│   ├── pendukung.js
│   ├── prodi.js
│   ├── provinsi.js
│   ├── rumah.js
│   ├── summary.js
│   ├── ukt.js                      (Proses UKT API)
│   ├── users.js                    (Manajemen User)
│   ├── verifikasi.js
│   └── wali.js
├── services/                       (Logika Bisnis - 18 Files)
│   ├── ayah.js
│   ├── bio_cmahasiswa.js
│   ├── bio_ortu_cmahasiswa.js
│   ├── bio_sekolah_cmahasiswa.js
│   ├── cmahasiswa.js
│   ├── ibu.js
│   ├── index.js
│   ├── kendaraan.js
│   ├── keringanan.js
│   ├── listrik.js
│   ├── pendukung.js
│   ├── prodi.js
│   ├── rumah.js
│   ├── summarydata.js              (Olahraga Data Dashboard)
│   ├── ukt.js                      (LOGIKA UTAMA UKT)
│   ├── users.js
│   ├── value.js                    (Hitung Nilai Bobot)
│   └── wali.js
├── views/                          (Template Tampilan Server)
│   ├── error.jade
│   ├── index.jade
│   ├── layout.jade
│   ├── ukt-table.jade
│   └── pdf/                        (Template Laporan PDF - 8 Files)
│       ├── alur.html
│       ├── bukti-selesai.html
│       ├── kontrak.html
│       ├── pdf-bm.html
│       ├── pdf-sanggah.html
│       ├── slip-pembayaran.html
│       ├── surat-validasi.html
│       └── wali.html
├── public/                         (File Statis)
│   ├── favicon.ico
│   ├── img/                        (Assets Gambar - 21 Files)
│   │   ├── 5050.png
│   │   ├── alur.png
│   │   ├── alur_.png
│   │   ├── alur_bm.png
│   │   ├── alur_old.png
│   │   ├── bank-btn.jpg
│   │   ├── bayar_head.jpg
│   │   ├── bayar_head_.jpg
│   │   ├── bni.png
│   │   ├── bukti_head.jpg
│   │   ├── loading.gif
│   │   ├── Logo-BNI.jpg
│   │   ├── logo-unj.jpg
│   │   ├── logo.png
│   │   ├── mandiri.png
│   │   ├── profile.png
│   │   ├── proses-selesai_.png
│   │   ├── thx.jpg
│   │   ├── unj.png
│   │   ├── validasi_head.jpg
│   │   └── welcome.jpg
│   ├── pdf/                        (Temporary PDF Storage)
│   └── stylesheets/                (CSS Files)
│       └── style.css
├── .env                            (Configuration Environment)
├── .env.example
├── .editorconfig
├── .eslintrc.json
├── .gitignore
├── package.json                    (Daftar Library & Scripts)
└── package-lock.json
```

---
Gitu bro analisis lengkapnya. Kalo ada yang bingung atau mau dibahas detail di file tertentu, langsung tanyain aja ya!
