-- Skema minimum yang diperlukan oleh aplikasi MelodyTix.
-- Repository asli tidak menyertakan dump database atau data awal.

CREATE DATABASE IF NOT EXISTS db_concert
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_concert;

CREATE TABLE IF NOT EXISTS `user` (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  nama VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  level VARCHAR(20) NOT NULL DEFAULT 'customer',
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_username (username),
  UNIQUE KEY uq_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS keranjang (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nama_konser VARCHAR(255) NOT NULL,
  waktu DATETIME NOT NULL,
  gambar VARCHAR(255) NOT NULL,
  harga DECIMAL(15, 2) NOT NULL,
  stok_tiket INT NOT NULL,
  deskripsi TEXT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pesanan (
  idpesanan INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  nama_konser VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  tanggal_pembelian TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_harga DECIMAL(15, 2) NOT NULL,
  buktitf MEDIUMBLOB NOT NULL,
  tipe_file VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (idpesanan),
  KEY idx_pesanan_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
