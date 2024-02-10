<?php

session_start();
require "../koneksi.php";

if (empty($_SESSION['username'])) {
    header("Location: ../error.php");
    exit();
}

$username = $_SESSION['username'];
$query = "SELECT level FROM user WHERE username = '$username'";
$result = mysqli_query($koneksi, $query);

// Jika query gagal dijalankan atau tidak ada hasil dari query
if (!$result || mysqli_num_rows($result) === 0) {
    header("Location: ../error.php");
    exit();
}

// Ambil data level dari hasil query
$row = mysqli_fetch_assoc($result);
$userLevel = $row['level'];

// Cek jika level tidak sama dengan 'admin', maka arahkan ke error.php
if ($userLevel != 'admin') {
    header("Location: ../error.php");
    exit();
}


if (isset($_POST['btnUpdate'])) {
    $id = $_POST['id'];
    $harga = $_POST['harga'];
    $stok = $_POST['stok'];
    $nama_konser = $_POST['nama_konser'];
    $deskripsi = $_POST['deskripsi'];
    $waktu = $_POST['waktu'];
    $gambar = $_POST['gambar'];

    // Lakukan koneksi dan proses pembaruan ke basis data di sini
    // Misalnya:
    $query = "UPDATE keranjang SET harga='$harga', stok_tiket='$stok', nama_konser='$nama_konser', deskripsi='$deskripsi', waktu='$waktu', gambar='$gambar' WHERE id='$id'";
    $hasil = mysqli_query($koneksi, $query);

    if ($hasil) {
        // Jika pembaruan berhasil
        echo "<script>";
        echo "alert('Data Berhasil Diupdate');";
        echo "</script>";
        $page = "index.php";
        $detik = "2";
        header("Refresh: $detik; url=$page");
    } else {
        // Jika pembaruan gagal
        echo "<script>";
        echo "alert('Update Gagal');";
        echo "</script>";
    }
} else {
    // Jika btnUpdate tidak ditekan
    echo "<script>";
    echo "alert('Tidak ada data yang dikirim');";
    echo "</script>";
}
?>