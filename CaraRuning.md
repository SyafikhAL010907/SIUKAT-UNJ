 cd new-siukat
 cd be-siukat-new/siukat-service-dev_snmptn_2022
 npm install
 npm run dev

cd BackEnd-Siukat > go run cmd/api/main.go
go build ./cmd/api/main.go

cd FrontEndAdmin-Siukat > npm install
cd FrontEndAdmin-Siukat > npm start

cd FrontEndCMahasiswa-Siukat > npm install
cd FrontEndCMahasiswa-Siukat > npm start

Nomor Peserta: 925111008305
Password (ddmmyyyy): 16092006 (berdasarkan tanggal lahir 16 September 2006)

login Admin
Username: SyafikhAL
Password: 09012007



-- Reset jika sudah ada data lama
DELETE FROM tb_user WHERE no_peserta = '20260001';
DELETE FROM tb_cmahasiswa WHERE no_peserta = '20260001';
DELETE FROM tb_ayah WHERE no_peserta = '20260001';
DELETE FROM tb_ibu WHERE no_peserta = '20260001';
DELETE FROM tb_kendaraan WHERE no_peserta = '20260001';
DELETE FROM tb_listrik WHERE no_peserta = '20260001';
DELETE FROM tb_rumah WHERE no_peserta = '20260001';
DELETE FROM tb_pendukung WHERE no_peserta = '20260001';
DELETE FROM tb_wali WHERE no_peserta = '20260001';

-- Inject Mahasiswa1
INSERT INTO tb_user (no_peserta, password, role, jalur_masuk, pwsave) VALUES ('20260001', '$2a$10$MOULYKGg4agY3auDir.TEuujxpJxdZF/z7Yi4OE1ffLvWMFVxFDgm', 'cmahasiswa', '2', '12345678');
INSERT INTO tb_cmahasiswa (no_peserta, nama_cmahasiswa, bidik_misi_cmahasiswa, fakultas_cmahasiswa, prodi_cmahasiswa, jalur_cmahasiswa, sosmed_cmahasiswa, alamat_cmahasiswa, provinsi_cmahasiswa, kabkot_cmahasiswa, kecamatan_cmahasiswa, gender_cmahasiswa, telepon_cmahasiswa, goldar_cmahasiswa, tempat_lahir_cmahasiswa, tanggal_lahir_cmahasiswa, foto_cmahasiswa, penghasilan_cmahasiswa, golongan_id, ukt_tinggi, flag, waktu_selesai, atribut, tagihan) VALUES ('20260001', 'Mahasiswa1', 'Tidak', 15, '15126', 2, '', '', 0, 0, 0, 'laki-laki', '', '', '', '1970-01-01', '', 0, '', 'tidak', 'belum_isi', '1970-01-01 00:00:00', 'original', '');
INSERT INTO tb_ayah (no_peserta, status_ayah, nama_ayah, nik_ayah, telepon_ayah, alamat_ayah, provinsi_ayah, kabkot_ayah, kecamatan_ayah, pekerjaan_ayah, penghasilan_ayah, sampingan_ayah, scan_ktp_ayah, scan_slip_ayah, tempat_lahir_ayah, tanggal_lahir_ayah, atribut) VALUES ('20260001', 'hidup', '', '', '', '', 0, 0, 0, '', 0, 0, '', '', '', '1970-01-01', 'original');
INSERT INTO tb_ibu (no_peserta, status_ibu, nama_ibu, nik_ibu, telepon_ibu, alamat_ibu, provinsi_ibu, kabkot_ibu, kecamatan_ibu, pekerjaan_ibu, penghasilan_ibu, sampingan_ibu, scan_ktp_ibu, scan_slip_ibu, tempat_lahir_ibu, atribut) VALUES ('20260001', 'hidup', '', '', '', '', 0, 0, 0, '', 0, 0, '', '', '', 'original');
INSERT INTO tb_kendaraan (no_peserta, status_motor, jumlah_motor, pajak_motor, scan_motor, status_mobil, jumlah_mobil, pajak_mobil, scan_mobil, atribut) VALUES ('20260001', 'tidak_memiliki', 0, 0, '', 'tidak_memiliki', 0, 0, '', 'original');
INSERT INTO tb_listrik (no_peserta, no_pelanggan, jenis_pemakaian, pengeluaran, scan_listrik, atribut) VALUES ('20260001', '', 'prabayar', 0, '', 'original');
INSERT INTO tb_rumah (no_peserta, status_kepemilikan, luas_tanah, luas_bangunan, status_sertifikat, biaya_pbb, scan_pbb, biaya_kontrak, scan_kontrak, jumlah_kepala_keluarga, atribut) VALUES ('20260001', 'milik_sendiri', '', '', 'hak_milik', 0, '', 0, '', 0, 'original');
INSERT INTO tb_pendukung (no_peserta, tanggungan, scan_pernyataan_ukt_tinggi, scan_pernyataan_kebenaran, scan_kk, atribut) VALUES ('20260001', 0, '', '', '', 'original');
INSERT INTO tb_wali (no_peserta, status_wali, nama_wali, alamat_wali, provinsi_wali, kabkot_wali, kecamatan_wali, kesanggupan_wali, scan_wali, atribut) VALUES ('20260001', 'tidak', '', '', 0, 0, 0, 0, '', 'original');
