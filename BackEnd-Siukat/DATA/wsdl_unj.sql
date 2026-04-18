-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 15, 2026 at 04:04 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wsdl_unj`
--

-- --------------------------------------------------------

--
-- Table structure for table `captcha`
--

CREATE TABLE `captcha` (
  `kode` int(11) NOT NULL,
  `pertanyaan` varchar(100) NOT NULL,
  `jawaban` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ref_bank`
--

CREATE TABLE `ref_bank` (
  `id_bank` int(11) NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `bank_code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ref_bank`
--

INSERT INTO `ref_bank` (`id_bank`, `bank_name`, `bank_code`) VALUES
(1, 'BNI', '009'),
(2, 'Mandiri', '008'),
(3, 'BTN', '200'),
(4, 'Bukopin', '441'),
(5, 'Keuangan', '999'),
(6, 'pustikom', '099'),
(7, 'Bank DKI', '111'),
(8, 'Bank BRI', '002');

-- --------------------------------------------------------

--
-- Table structure for table `ref_bill_group`
--

CREATE TABLE `ref_bill_group` (
  `id_bill_group` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `detail` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `group_code` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ref_bill_group`
--

INSERT INTO `ref_bill_group` (`id_bill_group`, `name`, `detail`, `description`, `group_code`) VALUES
(1, 'PENMABA D3', 'PENMABA D3', 'Pendaftaran D3', '001'),
(2, 'PENMABA S1', 'PENMABA S1', 'Pendaftaran S1', '002'),
(3, 'PENMABA Pascasarjana', 'PENMABA Pascasarjana', 'Pendaftaran Pascasarjana', '003'),
(4, 'PENMABA S3', 'PENMABA S3', 'Pendaftaran S3', '004'),
(5, 'SPP UKT D3/D4', 'SPP D3/D4', 'SPP D3/D4', '005'),
(6, 'SPP UKT S1', 'SPP S1', 'SPP S1', '006'),
(7, 'SPP UKT S2', 'SPP S2', 'SPP S2', '007'),
(8, 'SPP UKT S3', 'SPP S3', 'SPP S3', '008'),
(9, 'CUTI D3/D4', 'CUTI D3/D4', 'Cuti D3/D4', '009'),
(10, 'CUTI S1', 'CUTI S1', 'Cuti S1', '010'),
(11, 'CUTI S2', 'CUTI S2', 'Cuti S2', '011'),
(12, 'CUTI S3', 'CUTI S3', 'Cuti S3', '012'),
(13, 'SPU', 'SPU D3/S1', 'SPU D3/S1', '013'),
(14, 'PENMABA PRESTASI', 'PENMABA PRESTASI', 'Pendaftaran Mandiri Prestasi', '014'),
(15, 'PENMABA UJIAN TULIS', 'PENMABA UJIAN TULIS', 'Pendaftaran Mandiri Ujian Tulis', '015'),
(16, 'SPP PASCASARJANA', 'SPP PASCASARJANA', 'SPP PASCASARJANA', '016'),
(17, 'INGGRIS PASCASARJANA', 'INGGRIS PASCASARJANA', 'INGGRIS PASCASARJANA', '017'),
(18, 'MATRIKULASI PASCASARJANA', 'MATRIKULASI PASCASARJANA', 'MATRIKULASI PASCASARJANA', '018'),
(19, 'PENMABA RPL', 'PENMABA RPL', 'Pendaftaran RPL', '019'),
(20, 'SPU', 'SPU D3/S1 Cicilan Ke-2', 'SPU D3/S1 Cicilan ke-2', '020'),
(21, 'SPU', 'SPU D3/S1 Cicilan Ke-3', 'SPU D3/S1 Cicilan ke-3', '021'),
(22, 'SPP UKT D3', 'SPP D3 Cicilan ke-2', 'SPP D3 Cicilan ke-2', '022'),
(23, 'SPP UKT S1', 'SPP S1 Cicilan ke-2', 'SPP S1 Cicilan ke-2', '023'),
(24, 'SPP RPL/Pindahan', 'SPP RPL/Pindahan', 'SPP RPL/Pindahan', '024'),
(25, 'SPP UKT D4', 'SPP D4', 'SPP D4', '025'),
(26, 'SPU', 'SPU D4/S1', 'SPU D4/S1', '026'),
(27, 'Kurang UKT', 'Kekurangan Bayar UKT', 'Ada kekurangan bayar pada pembayaran UKT', '027'),
(28, 'SPU', 'SPU D4/S1 Cicilan Ke-2', 'SPU D4/S1 Cicilan ke-2', '028'),
(29, 'SPU', 'SPU D4/S1 Cicilan Ke-3', 'SPU D4/S1 Cicilan ke-3', '029'),
(30, 'LSP UNJ', 'LSP UNJ', 'LSP UNJ', '030'),
(31, 'PENMABA Asing', 'PENMABA Asing', 'Pendaftaran Asing', '031'),
(32, 'SA', 'Semester Antara', 'Pembayaran Semester Antara', '032'),
(33, 'PENMABA SNBP', 'PENMABA SNBP', 'Pendaftaran Mandiri Rapor', '033'),
(34, 'PENMABA RAPOR INTERNASIONAL', 'PENMABA RAPOR INTERNASIONAL', 'Pendaftaran Rapor Internasional', '034'),
(35, 'PENMABA UTBK MANDIRI', 'PENMABA UTBK MANDIRI', 'Pendaftaran UTBK MANDIRI', '035'),
(36, 'PENMABA DISABILITAS MANDIRI', 'PENMABA DISABILITAS MANDIRI', 'Pendaftaran Disabilitas Mandiri', '036'),
(37, 'IPI', 'IPI MANDIRI', 'IPI MANDIRI', '037'),
(38, 'IPI', 'IPI JAPRES', 'IPI JAPRES', '038'),
(39, 'PENMABA PINDAHAN MANDIRI', 'PENMABA PINDAHAN MANDIRI', 'Pendaftaran Pindahan MANDIRI', '039'),
(40, 'PENMABA TEST INTERNASIONAL', 'PENMABA TEST INTERNASIONAL', 'Pendaftaran Test Internasional', '040'),
(41, 'Test Pembayarann', 'Test Pembayaran', 'Test Pembayaran BTN', '041'),
(42, 'SPU', 'SPU D4/S1 Cicilan Ke-2', 'SPU D4/S1 Cicilan Ke-2', '042'),
(43, 'Tes Pembayaran', 'Detail Tes Pembayaran', 'Deskripsi Tes Pembayaran', '043'),
(44, 'PENMABA CBT KAMPUS', 'PENMABA CBT KAMPUS', 'Pendaftaran Mandiri CBT Kampus', '044'),
(45, 'PENMABA CBT KEDIAMAN', 'PENMABA CBT KEDIAMAN', 'Pendaftaran Mandiri CBT Kediaman', '045'),
(46, 'UKT S1', 'UKT S1', 'UKT S1', '046'),
(47, 'UKT D4', 'UKT D4', 'UKT D4', '047'),
(48, 'UKT S2', 'UKT S2', 'UKT S2', '048'),
(49, 'UKT S3', 'UKT S3', 'UKT S3', '049');

-- --------------------------------------------------------

--
-- Table structure for table `ref_bill_group_bank`
--

CREATE TABLE `ref_bill_group_bank` (
  `bill_group_id` int(11) NOT NULL,
  `bank_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ref_bill_group_bank`
--

INSERT INTO `ref_bill_group_bank` (`bill_group_id`, `bank_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 6),
(1, 7),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 6),
(2, 7),
(3, 1),
(3, 2),
(3, 3),
(3, 6),
(3, 7),
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(4, 6),
(4, 7),
(5, 1),
(5, 2),
(5, 3),
(5, 4),
(5, 6),
(5, 7),
(6, 1),
(6, 2),
(6, 3),
(6, 4),
(6, 6),
(6, 7),
(6, 8),
(7, 1),
(7, 2),
(7, 3),
(7, 4),
(7, 6),
(7, 7),
(8, 1),
(8, 2),
(8, 3),
(8, 4),
(8, 6),
(8, 7),
(9, 1),
(9, 2),
(9, 3),
(9, 4),
(9, 6),
(9, 7),
(10, 1),
(10, 2),
(10, 3),
(10, 4),
(10, 6),
(10, 7),
(11, 1),
(11, 2),
(11, 3),
(11, 4),
(11, 6),
(11, 7),
(12, 1),
(12, 2),
(12, 3),
(12, 4),
(12, 6),
(12, 7),
(13, 1),
(13, 2),
(13, 3),
(13, 4),
(13, 6),
(13, 7),
(14, 1),
(14, 2),
(14, 3),
(14, 4),
(14, 6),
(14, 7),
(15, 1),
(15, 2),
(15, 3),
(15, 4),
(15, 6),
(15, 7),
(16, 1),
(16, 2),
(16, 3),
(16, 4),
(16, 6),
(16, 7),
(17, 1),
(17, 2),
(17, 3),
(17, 4),
(17, 6),
(17, 7),
(18, 1),
(18, 2),
(18, 3),
(18, 4),
(18, 6),
(18, 7),
(19, 1),
(19, 2),
(19, 3),
(19, 4),
(19, 6),
(19, 7),
(20, 1),
(20, 2),
(20, 3),
(20, 4),
(20, 6),
(20, 7),
(21, 1),
(21, 2),
(21, 3),
(21, 4),
(21, 6),
(21, 7),
(22, 7),
(23, 7),
(24, 1),
(24, 2),
(24, 3),
(24, 4),
(24, 6),
(24, 7),
(25, 1),
(25, 2),
(25, 3),
(25, 4),
(25, 6),
(25, 7),
(26, 1),
(26, 2),
(26, 3),
(26, 4),
(26, 6),
(26, 7),
(27, 7),
(28, 1),
(28, 2),
(28, 3),
(28, 4),
(28, 6),
(28, 7),
(29, 1),
(29, 2),
(29, 3),
(29, 4),
(29, 6),
(29, 7),
(30, 1),
(30, 2),
(30, 3),
(30, 4),
(30, 6),
(30, 7),
(31, 1),
(31, 2),
(31, 3),
(31, 4),
(31, 6),
(31, 7),
(32, 1),
(32, 2),
(32, 3),
(32, 7),
(33, 1),
(33, 2),
(33, 3),
(33, 4),
(33, 6),
(33, 7),
(34, 1),
(34, 2),
(34, 3),
(34, 4),
(34, 6),
(34, 7),
(35, 1),
(35, 2),
(35, 3),
(35, 4),
(35, 6),
(35, 7),
(36, 1),
(36, 2),
(36, 3),
(36, 4),
(36, 6),
(36, 7),
(37, 1),
(37, 2),
(37, 3),
(37, 4),
(37, 6),
(37, 7),
(38, 1),
(38, 2),
(38, 3),
(38, 4),
(38, 6),
(38, 7),
(39, 1),
(39, 2),
(39, 3),
(39, 4),
(39, 6),
(39, 7),
(40, 1),
(40, 2),
(40, 3),
(40, 4),
(40, 6),
(40, 7),
(41, 1),
(41, 2),
(41, 3),
(41, 4),
(41, 6),
(41, 7),
(42, 1),
(42, 2),
(42, 3),
(42, 4),
(42, 6),
(42, 7),
(43, 2),
(44, 1),
(44, 2),
(44, 3),
(44, 4),
(44, 6),
(44, 7),
(45, 1),
(45, 2),
(45, 3),
(45, 4),
(45, 6),
(45, 7),
(49, 1),
(49, 2),
(49, 3),
(49, 4),
(49, 6),
(49, 7);

-- --------------------------------------------------------

--
-- Table structure for table `ref_faculty`
--

CREATE TABLE `ref_faculty` (
  `id_faculty` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ref_faculty`
--

INSERT INTO `ref_faculty` (`id_faculty`, `name`) VALUES
(11, 'Fakultas Ilmu Pendidikan'),
(12, 'Fakultas Bahasa dan Seni'),
(13, 'Fakultas Matematika dan IPA'),
(14, 'Fakultas Ilmu Sosial dan Hukum'),
(15, 'Fakultas Teknik'),
(16, 'Fakultas Ilmu Keolahragaan dan Kesehatan'),
(17, 'Fakultas Ekonomi dan Bisnis'),
(18, 'Fakultas Pendidikan Psikologi'),
(20, 'PPG'),
(99, 'Pascasarjana');

-- --------------------------------------------------------

--
-- Table structure for table `ref_major`
--

CREATE TABLE `ref_major` (
  `id_major` int(11) NOT NULL,
  `entrance` int(11) NOT NULL COMMENT 'jalur masuk',
  `name` varchar(255) NOT NULL,
  `degree` varchar(10) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `old_code` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ref_major`
--

INSERT INTO `ref_major` (`id_major`, `entrance`, `name`, `degree`, `faculty_id`, `old_code`) VALUES
(11016, 2, 'Teknologi Pendidikan', 'S1', 11, '1215'),
(11026, 2, 'Pendidikan Khusus', 'S1', 11, '1335'),
(11036, 2, 'Manajemen Pendidikan', 'S1', 11, '1445'),
(11046, 2, 'Pendidikan Masyarakat', 'S1', 11, '1515'),
(11056, 2, 'Pendidikan Anak Usia Dini', 'S1', 11, '1615'),
(11066, 2, 'Bimbingan & Konseling', 'S1', 11, '1715'),
(11076, 2, 'Pendidikan Guru Sekolah Dasar', 'S1', 11, '1815'),
(11088, 2, 'Bimbingan Konseling', 'S2', 11, '1726'),
(11098, 3, 'Pendidikan Masyarakat', 'S2', 11, ''),
(11108, 3, 'Teknologi Pendidikan', 'S2', 11, ''),
(11118, 3, 'Manajemen Pendidikan', 'S2', 11, ''),
(11128, 3, 'Pendidikan Anak Usia Dini', 'S2', 11, ''),
(11138, 3, 'Pendidikan Dasar', 'S2', 11, ''),
(11148, 3, 'Pendidikan Khusus', 'S2', 11, ''),
(11156, 2, 'Perpusatakakan dan Saint Informasi', 'S1', 11, ' '),
(11189, 3, 'Teknologi Pendidikan', 'S3', 11, ''),
(11199, 3, 'Manajemen Pendidikan', 'S3', 11, ''),
(11209, 3, 'Pendidikan Dasar', 'S3', 11, ''),
(11219, 3, 'Pendidikan Dasar', 'S3', 11, ''),
(12016, 2, 'Pendidikan Bahasa Indonesia', 'S1', 12, '2115'),
(12026, 2, 'Pendidikan Bahasa Inggris', 'S1', 12, '2215'),
(12036, 2, 'Pendidikan Bahasa Jerman', 'S1', 12, '2615'),
(12046, 2, 'Pendidikan Bahasa Perancis', 'S1', 12, '2315'),
(12056, 2, 'Pendidikan Bahasa Arab', 'S1', 12, '2715'),
(12066, 2, 'Pendidikan Seni Rupa', 'S1', 12, '2415'),
(12076, 2, 'Pendidikan Tari', 'S1', 12, '2525'),
(12086, 2, 'Pendidikan Musik', 'S1', 12, '2815'),
(12096, 2, 'Sastra Inggris', 'S1', 12, '2225'),
(12106, 2, 'Sastra Indonesia', 'S1', 12, '2125'),
(12116, 2, 'Pendidikan Bahasa Jepang', 'S1', 12, '2915'),
(12128, 2, 'Magister Pendidikan Bahasa Inggris', 'S2', 12, '2236'),
(12136, 2, 'Pendidikan Bahasa Mandarin', 'S1', 12, '2925'),
(12148, 3, 'Pendidikan Bahasa Indonesia\r\n', 'S2', 12, ''),
(12158, 3, 'Pendidikan Bahasa Arab', 'S2', 12, ' '),
(12168, 2, 'Pendidikan Seni', 'S2', 12, ''),
(13016, 1, 'Pendidikan Matematika', 'S1', 13, '3115'),
(13026, 1, 'Pendidikan Fisika', 'S1', 13, '3215'),
(13036, 1, 'Pendidikan Kimia', 'S1', 13, '3315'),
(13046, 1, 'Pendidikan Biologi', 'S1', 13, '3415'),
(13056, 1, 'Matematika', 'S1', 13, '3125'),
(13066, 1, 'Fisika', 'S1', 13, '3225'),
(13076, 1, 'Kimia', 'S1', 13, '3325'),
(13086, 1, 'Biologi', 'S1', 13, '3425'),
(13098, 1, 'Pendidikan Matematika', 'S2', 13, '3136'),
(13108, 1, 'Pendidikan Fisika', 'S2', 13, '3236'),
(13118, 1, 'Pendidikan Kimia', 'S2', 13, '3336'),
(13128, 1, 'Pendidikan Biologi', 'S2', 13, '3436'),
(13136, 1, 'Ilmu Komputer', 'S1', 13, '3145'),
(13146, 1, 'Statistika', 'S1', 13, '3155'),
(14016, 2, 'Pendidikan Pancasila dan Kewarganegaraan', 'S1', 14, '4115'),
(14026, 2, 'Pendidikan Geografi', 'S1', 14, '4315'),
(14036, 2, 'Pendidikan Sejarah', 'S1', 14, '4415'),
(14046, 2, 'Pendidikan Agama Islam', 'S1', 14, '4715'),
(14056, 2, 'Pendidikan Sosiologi', 'S1', 14, '4815'),
(14066, 2, 'Sosiologi', 'S1', 14, '4825'),
(14076, 2, 'Pendidikan Ilmu Pengetahuan Sosial', 'S1', 14, '4915'),
(14085, 2, 'Hubungan Masyarakat', 'D3', 14, '4123'),
(14095, 2, 'Perjalanan Wisata', 'D3', 14, '4423'),
(14106, 2, 'Ilmu Komunikasi', 'S1', 14, ''),
(14116, 2, 'Geografi', 'S1', 14, ''),
(14128, 2, 'Geografi', 'S2', 14, ''),
(14138, 3, 'Pendidikan Sejarah', 'S2', 14, ''),
(14144, 3, 'Hubungan Masyarakat Dan Komunikasi Digital', 'D4', 14, ''),
(14154, 3, 'Usaha Perjalanan Wisata', 'D4', 14, ''),
(14168, 3, 'Pendidikan Pancasila dan Kewarganegaraan', 'S2', 99, ' '),
(14176, 2, 'Ilmu Hukum', 'S1', 14, ''),
(15016, 1, 'Pendidikan Vokasional Teknik Elektro', 'S1', 15, '5115'),
(15026, 1, 'Pendidikan Vokasional Teknik Mesin', 'S1', 15, '5315'),
(15036, 1, 'Pendidikan Teknik Sipil', 'S1', 15, '5415'),
(15046, 2, 'Pendidikan Vokasional Kesejahteraan Keluarga', 'S1', 15, '5545'),
(15055, 1, 'Teknologi Mesin', 'D3', 15, '5353'),
(15065, 1, 'Teknologi Konstuksi Bangunan Gedung', 'D3', 15, '5423'),
(15075, 1, 'Teknologi Elektronika', 'D3', 15, '5223'),
(15085, 2, 'Bisnis Jasa Makanan', 'D3', 15, '5573'),
(15095, 2, 'Perdagangan Mode', 'D3', 15, '5583'),
(15105, 2, 'Tata Rias', 'D3', 15, '5593'),
(15115, 2, 'Manajemen Pelabuhan', 'D3', 15, '5433'),
(15126, 1, 'Pendidikan Teknik Informatika dan Komputer', 'S1', 15, '5235'),
(15136, 1, 'Pendidikan Vokasional Teknik Elektronika', 'S1', 15, '5215'),
(15146, 2, 'Pendidikan Tata Boga', 'S1', 15, '5515'),
(15156, 2, 'Pendidikan Tata Busana', 'S1', 15, '5525'),
(15166, 2, 'Pendidikan Tata Rias', 'S1', 15, '5535'),
(15178, 1, 'Pendidikan Teknologi Kejuruan', 'S2', 15, '5616'),
(15186, 1, 'Rekayasa Keselamatan Kebakaran', 'S1', 15, ''),
(15196, 1, 'Sistem dan Teknologi Informasi', 'S1', 15, ''),
(15206, 1, 'Teknik Mesin', 'S1', 15, ''),
(15214, 3, 'Desain Mode', 'D4', 15, ''),
(15224, 3, 'Kosmetik dan Perawatan Kecantikan', 'D4', 15, ''),
(15234, 3, 'Manajemen Pelabuhan dan Logistik Maritim', 'D4', 15, ''),
(15244, 3, 'Seni Kuliner dan Pengelolaan Jasa Makanan', 'D4', 15, ''),
(15254, 3, 'Teknologi Rekayasa Konstruksi Bangunan Gedung', 'D4', 15, ''),
(15264, 3, 'Teknologi Rekayasa Manufaktur', 'D4', 15, ''),
(15274, 3, 'Teknologi Rekayasa Otomasi', 'D4', 15, ''),
(16016, 2, 'Pendidikan Jasmani', 'S1', 16, '6135'),
(16026, 2, 'Pendidikan Kepelatihan Olahraga', 'S1', 16, '6315'),
(16036, 1, 'Ilmu Keolahragaan', 'S1', 16, '6815'),
(16046, 2, 'Kepelatihan Kecabangan Olahraga', 'S1', 16, ''),
(16056, 2, 'Olahraga Rekreasi', 'S1', 16, ''),
(16068, 3, 'Pendidikan Jasmani', 'S2', 16, ''),
(16078, 3, 'Ilmu Keolahragaan', 'S2', 16, ''),
(16089, 3, 'Pendidikan Jasmani', 'S3', 16, ''),
(17016, 2, 'Pendidikan Ekonomi', 'S1', 17, '8105'),
(17025, 2, 'Manajemen Pemasaran', 'D3', 17, '8223'),
(17035, 2, 'Administrasi Perkantoran', 'D3', 17, '8143'),
(17045, 2, 'Akuntansi', 'D3', 17, '8323'),
(17056, 2, 'Manajemen', 'S1', 17, '8215'),
(17066, 2, 'Akuntansi', 'S1', 17, '8335'),
(17076, 2, 'Pendidikan Bisnis', 'S1', 17, '8135'),
(17088, 2, 'Magister Manajemen', 'S2', 17, '8326'),
(17096, 2, 'Pendidikan Administrasi Perkantoran', 'S1', 17, '8125'),
(17106, 2, 'Bisnis Digital', 'S1', 17, ''),
(17118, 3, 'S2 Akuntansi', 'S2', 17, ''),
(17124, 3, 'Administrasi Perkantoran Digital', 'D4', 17, ''),
(17134, 3, 'Akuntansi Sektor Publik', 'D4', 17, ''),
(17144, 3, 'Pemasaran Digital', 'D4', 17, ''),
(17156, 2, 'Pendidikan Akuntansi', 'S1', 17, ''),
(17168, 3, 'Pendidikan Ekonomi', 'S2', 99, ' '),
(17179, 3, 'Ilmu Manajemen', 'S3', 17, ''),
(17189, 2, 'Ilmu Akuntansi', 'S2', 17, ''),
(17199, 3, 'Manajemen Bisnis', 'S3', 17, ''),
(18016, 2, 'Psikologi', 'S1', 18, '9115'),
(18028, 3, 'Psikologi', 'S2', 18, ''),
(99018, 3, 'Teknologi Pendidikan', 'S2', 99, ''),
(99029, 3, 'Teknologi Pendidikan', 'S3', 99, ''),
(99038, 3, 'Pendidikan Olahraga', 'S2', 99, ''),
(99049, 3, 'Pendidikan Olahraga', 'S3', 99, ''),
(99058, 3, 'Pendidikan Bahasa', 'S2', 99, ''),
(99069, 3, 'Linguistik Terapan', 'S3', 99, ''),
(99078, 3, 'Pendidikan Kependudukan dan Lingkungan Hidup', 'S2', 99, ''),
(99089, 3, 'Pendidikan Kependudukan dan Lingkungan Hidup', 'S3', 99, ''),
(99098, 3, 'Pendidikan Anak Usia Dini', 'S2', 99, ''),
(99108, 3, 'Manajemen Pendidikan', 'S2', 99, ''),
(99119, 3, 'Manajemen Pendidikan', 'S3', 99, ''),
(99128, 3, 'Penelitian Dan Evaluasi Pendidikan', 'S2', 99, ''),
(99139, 3, 'Penelitian Dan Evaluasi Pendidikan', 'S3', 99, ''),
(99148, 3, 'Manajemen Lingkungan', 'S2', 99, ''),
(99158, 3, 'Pendidikan Sejarah', 'S2', 99, ''),
(99168, 3, 'Linguistik Terapan', 'S2', 99, ''),
(99179, 3, 'Ilmu Manajemen', 'S3', 99, ''),
(99188, 3, 'Pendidikan Dasar', 'S2', 99, ''),
(99199, 3, 'Pendidikan Dasar', 'S3', 99, ''),
(99209, 3, 'Pendidikan Anak Usia Dini', 'S3', 99, ''),
(99218, 3, 'Pendidikan Bahasa Indonesia', 'S2', 99, ''),
(99228, 3, 'Manajemen Pendidikan Tinggi', 'S2', 99, '');

-- --------------------------------------------------------

--
-- Table structure for table `ref_major_x`
--

CREATE TABLE `ref_major_x` (
  `id_major` int(11) NOT NULL,
  `entrance` int(11) NOT NULL COMMENT 'jalur masuk',
  `name` varchar(255) NOT NULL,
  `degree` varchar(10) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `old_code` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ref_major_x`
--

INSERT INTO `ref_major_x` (`id_major`, `entrance`, `name`, `degree`, `faculty_id`, `old_code`) VALUES
(11016, 2, 'Teknologi Pendidikan', 'S1', 11, '1215'),
(11026, 2, 'Pendidikan Khusus', 'S1', 11, '1335'),
(11036, 2, 'Manajemen Pendidikan', 'S1', 11, '1445'),
(11046, 2, 'Pendidikan Masyarakat', 'S1', 11, '1515'),
(11056, 2, 'Pendidikan Anak Usia Dini', 'S1', 11, '1615'),
(11066, 2, 'Bimbingan & Konseling', 'S1', 11, '1715'),
(11076, 2, 'Pendidikan Guru Sekolah Dasar', 'S1', 11, '1815'),
(11088, 2, 'Bimbingan Konseling', 'S2', 11, '1726'),
(12016, 2, 'Pendidikan Bahasa Indonesia', 'S1', 12, '2115'),
(12026, 2, 'Pendidikan Bahasa Inggris', 'S1', 12, '2215'),
(12036, 2, 'Pendidikan Bahasa Jerman', 'S1', 12, '2615'),
(12046, 2, 'Pendidikan Bahasa Perancis', 'S1', 12, '2315'),
(12056, 2, 'Pendidikan Bahasa Arab', 'S1', 12, '2715'),
(12066, 2, 'Pendidikan Seni Rupa', 'S1', 12, '2415'),
(12076, 2, 'Pendidikan Tari', 'S1', 12, '2525'),
(12086, 2, 'Pendidikan Musik', 'S1', 12, '2815'),
(12096, 2, 'Sastra Inggris', 'S1', 12, '2225'),
(12106, 2, 'Sastra Indonesia', 'S1', 12, '2125'),
(12116, 2, 'Pendidikan Bahasa Jepang', 'S1', 12, '2915'),
(12128, 2, 'Magister Pendidikan Bahasa Inggris', 'S2', 12, '2236'),
(12136, 2, 'Pendidikan Bahasa Mandarin', 'S1', 12, '2925'),
(13016, 1, 'Pendidikan Matematika', 'S1', 13, '3115'),
(13026, 1, 'Pendidikan Fisika', 'S1', 13, '3215'),
(13036, 1, 'Pendidikan Kimia', 'S1', 13, '3315'),
(13046, 1, 'Pendidikan Biologi', 'S1', 13, '3415'),
(13056, 1, 'Matematika', 'S1', 13, '3125'),
(13066, 1, 'Fisika', 'S1', 13, '3225'),
(13076, 1, 'Kimia', 'S1', 13, '3325'),
(13086, 1, 'Biologi', 'S1', 13, '3425'),
(13098, 1, 'Pendidikan Matematika', 'S2', 13, '3136'),
(13108, 1, 'Pendidikan Fisika', 'S2', 13, '3236'),
(13118, 1, 'Pendidikan Kimia', 'S2', 13, '3336'),
(13128, 1, 'Pendidikan Biologi', 'S2', 13, '3436'),
(13136, 1, 'Ilmu Komputer', 'S1', 13, '3145'),
(13146, 1, 'Statistika', 'S1', 13, '3155'),
(14016, 2, 'Pendidikan Pancasila dan Kewarganegaraan', 'S1', 14, '4115'),
(14026, 2, 'Pendidikan Geografi', 'S1', 14, '4315'),
(14036, 2, 'Pendidikan Sejarah', 'S1', 14, '4415'),
(14046, 2, 'Pendidikan Agama Islam', 'S1', 14, '4715'),
(14056, 2, 'Pendidikan Sosiologi', 'S1', 14, '4815'),
(14066, 2, 'Sosiologi', 'S1', 14, '4825'),
(14076, 2, 'Pendidikan Ilmu Pengetahuan Sosial', 'S1', 14, '4915'),
(14085, 2, 'Hubungan Masyarakat', 'D3', 14, '4123'),
(14095, 2, 'Perjalanan Wisata', 'D3', 14, '4423'),
(14106, 2, 'Ilmu Komunikasi', 'S1', 14, ''),
(15016, 1, 'Pendidikan Vokasional Teknik Elektro', 'S1', 15, '5115'),
(15026, 1, 'Pendidikan Vokasional Teknik Mesin', 'S1', 15, '5315'),
(15036, 1, 'Pendidikan Vokasional Konstruksi Bangunan', 'S1', 15, '5415'),
(15036, 4, 'Pendidikan Teknik Sipil', 'S1', 15, '5415'),
(15046, 2, 'Pendidikan Vokasional Kesejahteraan Keluarga', 'S1', 15, '5545'),
(15055, 1, 'Teknologi Mesin', 'D3', 15, '5353'),
(15065, 1, 'Teknologi Konstuksi Bangunan Gedung', 'D3', 15, '5423'),
(15075, 1, 'Teknologi Elektronika', 'D3', 15, '5223'),
(15085, 2, 'Bisnis Jasa Makanan', 'D3', 15, '5573'),
(15095, 2, 'Perdagangan Mode', 'D3', 15, '5583'),
(15105, 2, 'Tata Rias', 'D3', 15, '5593'),
(15115, 2, 'Manajemen Pelabuhan', 'D3', 15, '5433'),
(15126, 1, 'Pendidikan Informatika', 'S1', 15, '5235'),
(15126, 4, 'Pendidikan Teknik Informatika dan Komputer', 'S1', 15, '5235'),
(15136, 1, 'Pendidikan Vokasional Teknik Elektronika', 'S1', 15, '5215'),
(15146, 2, 'Pendidikan Vokasional Seni Kuliner', 'S1', 15, '5515'),
(15146, 4, 'Pendidikan Tata Boga', 'S1', 15, '5515'),
(15156, 2, 'Pendidikan Vokasional Desain Fashion', 'S1', 15, '5525'),
(15156, 4, 'Pendidikan Tata Busana', 'S1', 15, '5525'),
(15166, 2, 'Pendidikan Vokasional Tata Rias', 'S1', 15, '5535'),
(15166, 4, 'Pendidikan Tata Rias', 'S1', 15, '5535'),
(15178, 1, 'Pendidikan Teknologi Kejuruan', 'S2', 15, '5616'),
(15186, 1, 'Rekayasa Keselamatan Kebakaran', 'S1', 15, ''),
(16016, 2, 'Pendidikan Jasmani', 'S1', 16, '6135'),
(16026, 2, 'Pendidikan Kepelatihan Olahraga', 'S1', 16, '6315'),
(16036, 1, 'Ilmu Keolahragaan', 'S1', 16, '6815'),
(16046, 2, 'Kepelatihan Kecabangan Olahraga', 'S1', 16, ''),
(16056, 2, 'Olahraga Rekreasi', 'S1', 16, ''),
(17016, 2, 'Pendidikan Ekonomi', 'S1', 17, '8105'),
(17025, 2, 'Manajemen Pemasaran', 'D3', 17, '8223'),
(17035, 2, 'Administrasi Perkantoran', 'D3', 17, '8143'),
(17045, 2, 'Akuntansi', 'D3', 17, '8323'),
(17056, 2, 'Manajemen', 'S1', 17, '8215'),
(17056, 4, 'Manajemen', 'S1', 17, '8215'),
(17066, 2, 'Akuntansi', 'S1', 17, '8335'),
(17066, 4, 'Akuntansi', 'S1', 17, '8335'),
(17076, 2, 'Pendidikan Bisnis', 'S1', 17, '8135'),
(17088, 2, 'Magister Manajemen', 'S2', 17, '8326'),
(17096, 2, 'Pendidikan Administrasi Perkantoran', 'S1', 17, '8125'),
(18016, 2, 'Psikologi', 'S1', 18, '9115');

-- --------------------------------------------------------

--
-- Table structure for table `ref_major_xx`
--

CREATE TABLE `ref_major_xx` (
  `id_major` int(11) NOT NULL,
  `entrance` int(11) NOT NULL COMMENT 'jalur masuk',
  `name` varchar(255) NOT NULL,
  `degree` varchar(10) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `old_code` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ref_terminal`
--

CREATE TABLE `ref_terminal` (
  `id_terminal` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ref_terminal`
--

INSERT INTO `ref_terminal` (`id_terminal`, `name`) VALUES
(1, 'Teller'),
(2, 'ATM'),
(3, 'Mobile Banking'),
(4, 'Internet Banking'),
(5, 'Sms Banking');

-- --------------------------------------------------------

--
-- Table structure for table `ref_ukt`
--

CREATE TABLE `ref_ukt` (
  `id` int(11) NOT NULL,
  `major_id` int(11) NOT NULL,
  `entrance` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `status` enum('aktif','nonaktif') NOT NULL,
  `decree` varchar(255) NOT NULL,
  `bkt` int(11) NOT NULL,
  `I` int(11) NOT NULL,
  `II` int(11) NOT NULL,
  `III` int(11) NOT NULL,
  `IV` int(11) NOT NULL,
  `V` int(11) NOT NULL,
  `VI` int(11) NOT NULL,
  `VII` int(11) NOT NULL,
  `VIII` int(11) NOT NULL,
  `bidikmisi` int(11) DEFAULT NULL,
  `kerjasama` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ref_ukt`
--

INSERT INTO `ref_ukt` (`id`, `major_id`, `entrance`, `semester`, `status`, `decree`, `bkt`, `I`, `II`, `III`, `IV`, `V`, `VI`, `VII`, `VIII`, `bidikmisi`, `kerjasama`) VALUES
(1, 11016, 2, 107, 'aktif', '', 0, 500000, 1000000, 3000000, 4000000, 4700000, 5300000, 6000000, 6700000, 2400000, NULL),
(2, 11026, 2, 107, 'aktif', '', 0, 500000, 1000000, 3000000, 3900000, 4500000, 5100000, 5800000, 6400000, 2400000, NULL),
(3, 11036, 2, 107, 'aktif', '', 0, 500000, 1000000, 3000000, 4000000, 4700000, 5300000, 6000000, 6700000, 2400000, NULL),
(4, 11046, 2, 107, 'aktif', '', 0, 500000, 1000000, 3000000, 4000000, 4700000, 5300000, 6000000, 6700000, 2400000, NULL),
(5, 11056, 2, 107, 'aktif', '', 0, 500000, 1000000, 3000000, 3900000, 4500000, 5100000, 5800000, 6400000, 2400000, NULL),
(6, 11066, 2, 107, 'aktif', '', 0, 500000, 1000000, 3000000, 3900000, 4500000, 5100000, 5800000, 6400000, 2400000, NULL),
(7, 11076, 2, 107, 'aktif', '', 0, 500000, 1000000, 3000000, 3900000, 4500000, 5100000, 5800000, 6400000, 2400000, NULL),
(8, 12016, 2, 107, 'aktif', '', 0, 500000, 1000000, 4000000, 4700000, 5400000, 6000000, 6400000, 6700000, 2400000, NULL),
(9, 12026, 2, 107, 'aktif', '', 0, 500000, 1000000, 3900000, 4500000, 5200000, 5900000, 6100000, 6400000, 2400000, NULL),
(10, 12036, 2, 107, 'aktif', '', 0, 500000, 1000000, 3700000, 4300000, 5000000, 5600000, 5900000, 6200000, 2400000, NULL),
(11, 12046, 2, 107, 'aktif', '', 0, 500000, 1000000, 3900000, 4500000, 5200000, 5900000, 6100000, 6400000, 2400000, NULL),
(12, 12056, 2, 107, 'aktif', '', 0, 500000, 1000000, 3900000, 4500000, 5200000, 5900000, 6100000, 6400000, 2400000, NULL),
(13, 12066, 2, 107, 'aktif', '', 0, 500000, 1000000, 4500000, 5200000, 5900000, 6700000, 7100000, 7400000, 2400000, NULL),
(14, 12076, 2, 107, 'aktif', '', 0, 500000, 1000000, 4500000, 5200000, 5900000, 6700000, 7100000, 7400000, 2400000, NULL),
(15, 12086, 2, 107, 'aktif', '', 0, 500000, 1000000, 4500000, 5200000, 5900000, 6700000, 7100000, 7400000, 2400000, NULL),
(16, 12096, 2, 107, 'aktif', '', 0, 500000, 1000000, 4500000, 5200000, 5900000, 6700000, 7100000, 7400000, 2400000, NULL),
(17, 12106, 2, 107, 'aktif', '', 0, 500000, 1000000, 4600000, 5500000, 6200000, 6900000, 7400000, 7700000, 2400000, NULL),
(18, 12116, 2, 107, 'aktif', '', 0, 500000, 1000000, 3700000, 4300000, 5000000, 5600000, 5900000, 6200000, 2400000, NULL),
(19, 12136, 2, 107, 'aktif', '', 0, 500000, 1000000, 3700000, 4300000, 5000000, 5600000, 5900000, 6200000, 2400000, NULL),
(20, 13016, 1, 107, 'aktif', '', 0, 500000, 1000000, 3800000, 4300000, 5000000, 6000000, 7000000, 9000000, 2400000, NULL),
(21, 13026, 1, 107, 'aktif', '', 0, 500000, 1000000, 3800000, 4300000, 5000000, 6000000, 7000000, 9000000, 2400000, NULL),
(22, 13036, 1, 107, 'aktif', '', 0, 500000, 1000000, 3950000, 4500000, 5200000, 6200000, 7500000, 9000000, 2400000, NULL),
(23, 13046, 1, 107, 'aktif', '', 0, 500000, 1000000, 3950000, 4500000, 5200000, 6200000, 7500000, 9000000, 2400000, NULL),
(24, 13056, 1, 107, 'aktif', '', 0, 500000, 1000000, 4000000, 4500000, 5200000, 6200000, 8000000, 9000000, 2400000, NULL),
(25, 13066, 1, 107, 'aktif', '', 0, 500000, 1000000, 4000000, 4500000, 5200000, 6200000, 8000000, 10000000, 2400000, NULL),
(26, 13076, 1, 107, 'aktif', '', 0, 500000, 1000000, 4150000, 4650000, 5250000, 6250000, 8000000, 10000000, 2400000, NULL),
(27, 13086, 1, 107, 'aktif', '', 0, 500000, 1000000, 4150000, 4650000, 5250000, 6250000, 8000000, 10000000, 2400000, NULL),
(28, 13136, 1, 107, 'aktif', '', 0, 500000, 1000000, 4000000, 4500000, 5200000, 6200000, 8000000, 8800000, 2400000, NULL),
(29, 13146, 1, 107, 'aktif', '', 0, 500000, 1000000, 4000000, 5200000, 6400000, 7300000, 8300000, 9000000, 2400000, NULL),
(30, 14016, 2, 107, 'aktif', '', 0, 500000, 1000000, 3200000, 3700000, 4500000, 5000000, 5700000, 6700000, 2400000, NULL),
(31, 14026, 2, 107, 'aktif', '', 0, 500000, 1000000, 3100000, 3700000, 4500000, 5000000, 5500000, 6400000, 2400000, NULL),
(32, 14036, 2, 107, 'aktif', '', 0, 500000, 1000000, 3200000, 3700000, 4500000, 5000000, 5700000, 6700000, 2400000, NULL),
(33, 14046, 2, 107, 'aktif', '', 0, 500000, 1000000, 3100000, 3700000, 5000000, 5600000, 5800000, 6400000, 2400000, NULL),
(34, 14056, 2, 107, 'aktif', '', 0, 500000, 1000000, 3100000, 3700000, 4500000, 5000000, 5500000, 6400000, 2400000, NULL),
(35, 14066, 2, 107, 'aktif', '', 0, 500000, 1000000, 3100000, 3700000, 5000000, 5600000, 5800000, 6400000, 2400000, NULL),
(36, 14076, 2, 107, 'aktif', '', 0, 500000, 1000000, 3100000, 3700000, 4500000, 5000000, 5500000, 6200000, 2400000, NULL),
(37, 14085, 2, 107, 'aktif', '', 0, 500000, 1000000, 4650000, 4800000, 5000000, 5300000, 5800000, 6200000, 2400000, NULL),
(38, 14095, 2, 107, 'aktif', '', 0, 500000, 1000000, 4800000, 5000000, 5100000, 5600000, 6160000, 7100000, 2400000, NULL),
(39, 15016, 1, 107, 'aktif', '', 0, 500000, 1000000, 4100000, 4600000, 5200000, 6100000, 7900000, 9700000, 2400000, NULL),
(40, 15026, 1, 107, 'aktif', '', 0, 500000, 1000000, 4100000, 4600000, 5200000, 6100000, 7900000, 9700000, 2400000, NULL),
(41, 15036, 1, 107, 'aktif', '', 0, 500000, 1000000, 4100000, 4600000, 5200000, 6100000, 7900000, 9700000, 2400000, NULL),
(42, 15046, 2, 107, 'aktif', '', 0, 500000, 1000000, 4100000, 4600000, 5200000, 6000000, 7700000, 9300000, 2400000, NULL),
(43, 15055, 1, 107, 'aktif', '', 0, 500000, 1000000, 4300000, 4800000, 5300000, 6400000, 7600000, 8800000, 2400000, NULL),
(44, 15065, 1, 107, 'aktif', '', 0, 500000, 1000000, 4300000, 4800000, 5300000, 6900000, 8600000, 10300000, 2400000, NULL),
(45, 15075, 1, 107, 'aktif', '', 0, 500000, 1000000, 4300000, 4800000, 5300000, 6600000, 8000000, 9300000, 2400000, NULL),
(46, 15085, 2, 107, 'aktif', '', 0, 500000, 1000000, 4300000, 4800000, 5300000, 5500000, 5900000, 6400000, 2400000, NULL),
(47, 15095, 2, 107, 'aktif', '', 0, 500000, 1000000, 4300000, 4800000, 5300000, 5500000, 5900000, 6400000, 2400000, NULL),
(48, 15105, 2, 107, 'aktif', '', 0, 500000, 1000000, 4300000, 4800000, 5300000, 5500000, 5900000, 6400000, 2400000, NULL),
(49, 15115, 2, 107, 'aktif', '', 0, 500000, 1000000, 4300000, 4800000, 5300000, 6500000, 7800000, 9100000, 2400000, NULL),
(50, 15126, 1, 107, 'aktif', '', 0, 500000, 1000000, 4100000, 4600000, 5200000, 6000000, 7700000, 9300000, 2400000, NULL),
(51, 15136, 1, 107, 'aktif', '', 0, 500000, 1000000, 4100000, 4600000, 5200000, 6000000, 7700000, 9300000, 2400000, NULL),
(52, 15146, 2, 107, 'aktif', '', 0, 500000, 1000000, 4100000, 4600000, 5200000, 6200000, 8100000, 10100000, 2400000, NULL),
(53, 15156, 2, 107, 'aktif', '', 0, 500000, 1000000, 4100000, 4600000, 5200000, 6200000, 8100000, 10100000, 2400000, NULL),
(54, 15166, 2, 107, 'aktif', '', 0, 500000, 1000000, 4100000, 4600000, 5200000, 6200000, 8100000, 10100000, 2400000, NULL),
(55, 16016, 2, 107, 'aktif', '', 0, 500000, 1000000, 2700000, 3400000, 4000000, 4700000, 5400000, 5700000, 2400000, NULL),
(56, 16026, 2, 107, 'aktif', '', 0, 500000, 1000000, 2700000, 3400000, 4000000, 4700000, 5400000, 5700000, 2400000, NULL),
(57, 16036, 1, 107, 'aktif', '', 0, 500000, 1000000, 3200000, 4300000, 5400000, 6500000, 7600000, 8600000, 2400000, NULL),
(58, 17016, 2, 107, 'aktif', '', 0, 500000, 1000000, 3100000, 3550000, 4100000, 4900000, 5700000, 6700000, 2400000, NULL),
(59, 17025, 2, 107, 'aktif', '', 0, 500000, 1000000, 4100000, 4300000, 4700000, 4960000, 5560000, 6700000, 2400000, NULL),
(60, 17035, 2, 107, 'aktif', '', 0, 500000, 1000000, 4100000, 4300000, 4600000, 4850000, 5560000, 6400000, 2400000, NULL),
(61, 17045, 2, 107, 'aktif', '', 0, 500000, 1000000, 4100000, 4300000, 4600000, 4850000, 5560000, 6400000, 2400000, NULL),
(62, 17056, 2, 107, 'aktif', '', 0, 500000, 1000000, 3500000, 4500000, 5000000, 5400000, 5800000, 6400000, 2400000, NULL),
(63, 17066, 2, 107, 'aktif', '', 0, 500000, 1000000, 3700000, 4900000, 5500000, 6100000, 7200000, 8400000, 2400000, NULL),
(64, 17076, 2, 107, 'aktif', '', 0, 500000, 1000000, 3100000, 3550000, 4100000, 4900000, 5700000, 6400000, 2400000, NULL),
(65, 17096, 2, 107, 'aktif', '', 0, 500000, 1000000, 3100000, 4050000, 5000000, 5500000, 6000000, 6400000, 2400000, NULL),
(66, 18016, 2, 107, 'aktif', '', 0, 500000, 1000000, 4000000, 6200000, 7200000, 8200000, 9300000, 10300000, 2400000, NULL),
(67, 14106, 2, 107, 'aktif', ' ', 0, 500000, 1000000, 4400000, 5200000, 5900000, 6202000, 6202000, 6202000, 2400000, NULL),
(68, 16046, 2, 107, 'aktif', ' ', 0, 500000, 1000000, 3200000, 4300000, 5400000, 6202000, 6202000, 6202000, 2400000, NULL),
(69, 16056, 2, 107, 'aktif', ' ', 0, 500000, 1000000, 3200000, 4300000, 5400000, 6500000, 7600000, 8600000, 2400000, NULL),
(70, 15186, 1, 107, 'aktif', ' ', 0, 500000, 1000000, 4100000, 4600000, 5200000, 6100000, 7900000, 9700000, 2400000, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ref_ukt_try`
--

CREATE TABLE `ref_ukt_try` (
  `id_ukt` int(11) NOT NULL,
  `major_id` int(11) NOT NULL,
  `entrance` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `status` enum('aktif','nonaktif') NOT NULL,
  `decree` varchar(255) NOT NULL,
  `bkt` int(11) NOT NULL,
  `I` int(11) NOT NULL,
  `II` int(11) NOT NULL,
  `III` int(11) NOT NULL,
  `IV` int(11) NOT NULL,
  `V` int(11) NOT NULL,
  `VI` int(11) NOT NULL,
  `VII` int(11) NOT NULL,
  `VIII` int(11) NOT NULL,
  `bidikmisi` int(11) DEFAULT NULL,
  `kerjasama` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ref_ukt_try`
--

INSERT INTO `ref_ukt_try` (`id_ukt`, `major_id`, `entrance`, `semester`, `status`, `decree`, `bkt`, `I`, `II`, `III`, `IV`, `V`, `VI`, `VII`, `VIII`, `bidikmisi`, `kerjasama`) VALUES
(1, 99999, 2, 108, 'aktif', '', 0, 5, 10, 15, 20, 25, 30, 35, 40, 24, 0),
(2, 88888, 2, 108, 'aktif', '', 0, 5, 10, 15, 20, 25, 30, 35, 40, 24, 0),
(3, 77777, 2, 108, 'aktif', '', 0, 5, 10, 15, 20, 25, 30, 35, 40, 24, 0),
(4, 55555, 2, 108, 'aktif', '', 0, 5, 10, 15, 20, 25, 30, 35, 40, 24, 0),
(5, 66666, 2, 108, 'aktif', '', 0, 5, 10, 15, 20, 25, 30, 35, 40, 24, 0),
(6, 44444, 2, 108, 'aktif', '', 0, 5, 10, 15, 20, 25, 30, 35, 40, 24, 0),
(7, 33333, 2, 108, 'aktif', '', 0, 5, 10, 15, 20, 25, 30, 35, 40, 24, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tb_bill_detail`
--

CREATE TABLE `tb_bill_detail` (
  `bill_issue_id` int(11) NOT NULL,
  `bill_number` varchar(255) NOT NULL,
  `ukt_category` varchar(255) DEFAULT NULL,
  `amount` double NOT NULL,
  `nim` varchar(13) NOT NULL,
  `major_id` int(11) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `amount_paid` double DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `bank_id` int(11) DEFAULT NULL,
  `terminal_id` int(11) DEFAULT NULL,
  `payment_number` varchar(255) DEFAULT NULL,
  `transaction` varchar(255) DEFAULT NULL,
  `transaction_date` datetime DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `flag_status` enum('88','01','02','03','04','05') NOT NULL COMMENT '88: local, 01: sync, 02: paid, 03: partial paid, 04: internal failure, 05: fail transaction'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci COMMENT='00: local, 01: sync, 02: success, 03: fail transaction, 04: fail transaction(uang sudah masuk rek virtual), 05: \n\ncorenya ini';

--
-- Dumping data for table `tb_bill_detail`
--

INSERT INTO `tb_bill_detail` (`bill_issue_id`, `bill_number`, `ukt_category`, `amount`, `nim`, `major_id`, `semester`, `name`, `amount_paid`, `total_amount`, `bank_id`, `terminal_id`, `payment_number`, `transaction`, `transaction_date`, `keterangan`, `due_date`, `flag_status`) VALUES
(1, '261426000002', 'VIII', 9300000, '426000002', 15126, 110, 'Mahasiswa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '01');

-- --------------------------------------------------------

--
-- Table structure for table `tb_bill_issue`
--

CREATE TABLE `tb_bill_issue` (
  `id_bill_issue` int(11) NOT NULL,
  `bill_group_id` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `semester` int(4) DEFAULT NULL,
  `input_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `start_date` datetime DEFAULT '0000-00-00 00:00:00',
  `end_date` timestamp NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tb_bill_issue`
--

INSERT INTO `tb_bill_issue` (`id_bill_issue`, `bill_group_id`, `description`, `semester`, `input_date`, `start_date`, `end_date`) VALUES
(1, 1, 'PENMABA D3', 110, '2019-10-17 07:01:37', '2018-12-13 09:00:00', '2019-12-12 02:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `tb_log`
--

CREATE TABLE `tb_log` (
  `bill_number` varchar(255) NOT NULL,
  `bank_id` int(11) NOT NULL,
  `payment_number` varchar(255) DEFAULT NULL,
  `transaction` varchar(255) NOT NULL,
  `flag_before` enum('88','01','02','03','04','05') NOT NULL,
  `flag_after` enum('88','01','02','03','04','05') NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tb_log`
--

INSERT INTO `tb_log` (`bill_number`, `bank_id`, `payment_number`, `transaction`, `flag_before`, `flag_after`, `description`, `created_at`, `updated_at`) VALUES
('25012857291033', 2, '2557H2800001', '00002b34-b36b-4eca-b86b-3dc65225080a', '01', '02', 'payment', '2025-05-07 17:28:01', '2025-05-07 17:28:01');

-- --------------------------------------------------------

--
-- Table structure for table `tb_log_activity`
--

CREATE TABLE `tb_log_activity` (
  `uxer_id` int(11) NOT NULL,
  `activity_name` varchar(255) NOT NULL,
  `reference_key` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tb_log_activity`
--

INSERT INTO `tb_log_activity` (`uxer_id`, `activity_name`, `reference_key`, `description`, `created_at`, `updated_at`) VALUES
(111022, 'addBill', '2915121911112006', 'Add Bill, Bill Issue Id: 133, Bill Number: 2915121911112006, data: {\"bill_issue_id\":133,\"bill_number\":\"2915121911112006\",\"ukt_category\":null,\"amount\":1320000,\"nim\":\"2915121911\",\"name\":\"LISDA ARIYANTI\",\"semester\":112,\"due_date\":\"2021-06-07T14:00:00.884Z\",\"', '2021-06-07 07:46:02', '2021-06-07 14:47:55');

-- --------------------------------------------------------

--
-- Table structure for table `tb_student`
--

CREATE TABLE `tb_student` (
  `nim` varchar(13) NOT NULL,
  `semester_awal` int(4) NOT NULL COMMENT 'Rilis SK',
  `bidikmisi` enum('ya','tidak') NOT NULL DEFAULT 'tidak',
  `name` varchar(255) NOT NULL,
  `faculty_id` int(11) DEFAULT NULL,
  `major_id` int(11) NOT NULL,
  `entrance` int(11) NOT NULL COMMENT 'Jalur Masuk',
  `ukt_category` varchar(11) NOT NULL COMMENT 'Kelompok UKT',
  `degree` text NOT NULL COMMENT 'Surat Keputusan'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tb_student`
--

INSERT INTO `tb_student` (`nim`, `semester_awal`, `bidikmisi`, `name`, `faculty_id`, `major_id`, `entrance`, `ukt_category`, `degree`) VALUES
('1101617001', 107, 'tidak', 'RACHMAT HIDAYAT', 11, 11016, 1, '-', 'S1');

-- --------------------------------------------------------

--
-- Table structure for table `tb_uxer`
--

CREATE TABLE `tb_uxer` (
  `id_uxer` int(11) NOT NULL,
  `usx` varchar(255) NOT NULL,
  `pwx` varchar(255) NOT NULL,
  `remember_token` mediumtext DEFAULT NULL,
  `role` enum('keuangan','pustikom','bank','super') NOT NULL,
  `role_desc` varchar(255) NOT NULL COMMENT 'bank bni, wr2, staff wr2',
  `bank_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tb_uxer`
--

INSERT INTO `tb_uxer` (`id_uxer`, `usx`, `pwx`, `remember_token`, `role`, `role_desc`, `bank_id`) VALUES
(111011, 'admina', '$2a$10$Kr1ykyF9ACETk3dpmTWd.uq8iOX5P5tDFCGyLNfzj7Ys0EZr0dPOK', NULL, 'bank', 'Bank Mandiri', 2),
(111016, 'adminb', '$2a$10$w4sBSv7U4iFd//JwJkDxbuLECF5HVZfJreK6UaeCioE1t5Z1WADf6', NULL, 'bank', 'bbb', NULL),
(111017, 'ridhoo', '$2a$10$LIr8qLIGjnJKZpQem34pY.UvaP.w7e6ycInfUPMAj01A5BS/SB6Bq', NULL, 'keuangan', 'wr2', 99),
(111018, 'mandiri_x', '$2a$10$xRwbJPxEQY8pBicWB/5NuehZqTgHUOepV1QM9LIzvmvRlSahJ8JQa', NULL, 'bank', 'Bank Mandiri', 2),
(111019, 'bni_kmz', '$2a$10$T/9YVVDtnWgWMAaPPhdhI.lQUBTjTzXEc4fHcMHNOoFlZS2Uyo/XO', NULL, 'bank', 'Bank BNI', 1),
(111020, 'btn_xyz', '$2a$10$0FUVcVT4Mt0GeILz2NlJm.MpclYASqBtfKvxSsX09Ym7AaQUUL1r6', NULL, 'bank', 'Bank BTN', 3),
(111021, 'buk0p1n_x', '$2a$10$AA2Ahk35uukxTa7F9EmfCOkOxyl.5YdIFMYfyGtXPo.Hnlh45Z1vC', NULL, 'bank', 'Bank Bukopin', 4),
(111022, 'pustikom', '$2a$10$qhkg/I3zxNpfVkNawtBmtO32xKSedouEI8EngVwGc/p3PjvVDmoOW', '10056|nJVQ1QvLK3XJveoRFB08jq7gvyMNsVjqMY5YfUSQ', 'pustikom', 'Pustikom', 6),
(111023, 'super', '$2a$10$qhkg/I3zxNpfVkNawtBmtO32xKSedouEI8EngVwGc/p3PjvVDmoOW', NULL, 'pustikom', 'Pustikom', 100),
(111024, 'keuangan', '$2a$10$qhkg/I3zxNpfVkNawtBmtO32xKSedouEI8EngVwGc/p3PjvVDmoOW', '', 'keuangan', 'Keuangan WR 2', 98),
(111025, 'bakhum', '$2a$10$qhkg/I3zxNpfVkNawtBmtO32xKSedouEI8EngVwGc/p3PjvVDmoOW', '1961|J7QTPyzr4du6zYjDPmTU9bbEXzdg1KAHvEziBSos', 'keuangan', 'Bakhum', NULL),
(111026, 'pelaporan', '$2a$10$qhkg/I3zxNpfVkNawtBmtO32xKSedouEI8EngVwGc/p3PjvVDmoOW', NULL, 'keuangan', 'keuangan', 6),
(111027, 'dki_x', '$2a$10$sxdMPpaZ0UMZIXCRo3Jro.l6EUg6ozN.rrYdLAh3bQWPuaROCTvJ2', NULL, 'bank', 'Bank DKI', 7),
(111028, 'API_LSP', '$2y$10$XLfJ5YuFkLjOL7XlUbd.PO.xfJJ0iye.BY0hfCXhezIpCQF.8OBjy', '8928|BqjZK830rYPfrLQSGb2GuyLROH4jl72BnLgUTuZk', 'pustikom', 'Pustikom', NULL),
(111029, 'admisiunj', '$2a$10$QDnbgmn1FFQCJwfo/70xeOv7JH.8XMuZRG4XwBJo6zr9BqyOH.kE2', NULL, 'pustikom', 'Pustikom', NULL),
(111030, 'bri', '$2b$10$2YBER0i4MNst5dBMNXXsseBWRjZuB98Pd4J/3EGWb9qbzcFzIEyji', NULL, 'bank', 'Bank BRI', 8);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `captcha`
--
ALTER TABLE `captcha`
  ADD PRIMARY KEY (`kode`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`(191),`tokenable_id`);

--
-- Indexes for table `ref_bank`
--
ALTER TABLE `ref_bank`
  ADD PRIMARY KEY (`id_bank`);

--
-- Indexes for table `ref_bill_group`
--
ALTER TABLE `ref_bill_group`
  ADD PRIMARY KEY (`id_bill_group`);

--
-- Indexes for table `ref_bill_group_bank`
--
ALTER TABLE `ref_bill_group_bank`
  ADD PRIMARY KEY (`bill_group_id`,`bank_id`),
  ADD KEY `bill_group_id` (`bill_group_id`),
  ADD KEY `bank_id` (`bank_id`);

--
-- Indexes for table `ref_faculty`
--
ALTER TABLE `ref_faculty`
  ADD PRIMARY KEY (`id_faculty`);

--
-- Indexes for table `ref_major`
--
ALTER TABLE `ref_major`
  ADD PRIMARY KEY (`id_major`),
  ADD KEY `faculty_code` (`faculty_id`) USING BTREE;

--
-- Indexes for table `ref_major_x`
--
ALTER TABLE `ref_major_x`
  ADD PRIMARY KEY (`id_major`,`entrance`) USING BTREE,
  ADD KEY `faculty_code` (`faculty_id`) USING BTREE;

--
-- Indexes for table `ref_major_xx`
--
ALTER TABLE `ref_major_xx`
  ADD PRIMARY KEY (`id_major`,`entrance`) USING BTREE,
  ADD KEY `faculty_code` (`faculty_id`) USING BTREE;

--
-- Indexes for table `ref_terminal`
--
ALTER TABLE `ref_terminal`
  ADD PRIMARY KEY (`id_terminal`);

--
-- Indexes for table `ref_ukt`
--
ALTER TABLE `ref_ukt`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `majod_id` (`major_id`,`entrance`);

--
-- Indexes for table `ref_ukt_try`
--
ALTER TABLE `ref_ukt_try`
  ADD PRIMARY KEY (`id_ukt`),
  ADD UNIQUE KEY `majod_id` (`major_id`,`entrance`);

--
-- Indexes for table `tb_bill_detail`
--
ALTER TABLE `tb_bill_detail`
  ADD PRIMARY KEY (`bill_number`,`bill_issue_id`),
  ADD UNIQUE KEY `bill_number` (`bill_number`,`bill_issue_id`) USING BTREE,
  ADD KEY `bill_issue_id` (`bill_issue_id`),
  ADD KEY `tb_bill_detail_FK` (`major_id`);

--
-- Indexes for table `tb_bill_issue`
--
ALTER TABLE `tb_bill_issue`
  ADD PRIMARY KEY (`id_bill_issue`),
  ADD UNIQUE KEY `id_bill_issue` (`id_bill_issue`),
  ADD KEY `bill_group_id` (`bill_group_id`);

--
-- Indexes for table `tb_log`
--
ALTER TABLE `tb_log`
  ADD PRIMARY KEY (`transaction`,`bill_number`);

--
-- Indexes for table `tb_log_activity`
--
ALTER TABLE `tb_log_activity`
  ADD PRIMARY KEY (`uxer_id`,`created_at`);

--
-- Indexes for table `tb_student`
--
ALTER TABLE `tb_student`
  ADD PRIMARY KEY (`nim`);

--
-- Indexes for table `tb_uxer`
--
ALTER TABLE `tb_uxer`
  ADD PRIMARY KEY (`id_uxer`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `captcha`
--
ALTER TABLE `captcha`
  MODIFY `kode` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10051;

--
-- AUTO_INCREMENT for table `ref_bank`
--
ALTER TABLE `ref_bank`
  MODIFY `id_bank` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `ref_bill_group`
--
ALTER TABLE `ref_bill_group`
  MODIFY `id_bill_group` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `ref_faculty`
--
ALTER TABLE `ref_faculty`
  MODIFY `id_faculty` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `ref_major`
--
ALTER TABLE `ref_major`
  MODIFY `id_major` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99229;

--
-- AUTO_INCREMENT for table `ref_major_x`
--
ALTER TABLE `ref_major_x`
  MODIFY `id_major` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18017;

--
-- AUTO_INCREMENT for table `ref_major_xx`
--
ALTER TABLE `ref_major_xx`
  MODIFY `id_major` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ref_terminal`
--
ALTER TABLE `ref_terminal`
  MODIFY `id_terminal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ref_ukt`
--
ALTER TABLE `ref_ukt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `ref_ukt_try`
--
ALTER TABLE `ref_ukt_try`
  MODIFY `id_ukt` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tb_bill_issue`
--
ALTER TABLE `tb_bill_issue`
  MODIFY `id_bill_issue` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=464;

--
-- AUTO_INCREMENT for table `tb_uxer`
--
ALTER TABLE `tb_uxer`
  MODIFY `id_uxer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111031;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ref_bill_group_bank`
--
ALTER TABLE `ref_bill_group_bank`
  ADD CONSTRAINT `ref_bill_group_bank_ibfk_1` FOREIGN KEY (`bill_group_id`) REFERENCES `ref_bill_group` (`id_bill_group`),
  ADD CONSTRAINT `ref_bill_group_bank_ibfk_2` FOREIGN KEY (`bank_id`) REFERENCES `ref_bank` (`id_bank`);

--
-- Constraints for table `ref_major`
--
ALTER TABLE `ref_major`
  ADD CONSTRAINT `ref_major_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `ref_faculty` (`id_faculty`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tb_bill_detail`
--
ALTER TABLE `tb_bill_detail`
  ADD CONSTRAINT `tb_bill_detail_FK` FOREIGN KEY (`major_id`) REFERENCES `ref_major` (`id_major`),
  ADD CONSTRAINT `tb_bill_detail_ibfk_1` FOREIGN KEY (`bill_issue_id`) REFERENCES `tb_bill_issue` (`id_bill_issue`);

--
-- Constraints for table `tb_bill_issue`
--
ALTER TABLE `tb_bill_issue`
  ADD CONSTRAINT `tb_bill_issue_ibfk_1` FOREIGN KEY (`bill_group_id`) REFERENCES `ref_bill_group` (`id_bill_group`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
