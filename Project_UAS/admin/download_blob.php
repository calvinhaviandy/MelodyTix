<?php
session_start();

require "../koneksi.php";
if (empty($_SESSION['username'])) {
    header("Location: ../error.php");
    exit();
}

// Fungsi untuk mengonversi data gambar ke format JPEG jika diperlukan
function convertToJPEG($imageData, $imageType)
{
    $image = imagecreatefromstring($imageData);

    // Buat file gambar baru dalam format JPEG
    $tempFile = tempnam(sys_get_temp_dir(), 'image');
    $newFileName = $tempFile . '.jpg';

    // Simpan gambar sebagai file JPEG
    imagejpeg($image, $newFileName);

    // Hapus objek gambar dari memori
    imagedestroy($image);

    return $newFileName;
}

// Mengambil data .bin dari database
if (isset($_GET['id'])) {
    $idpesanan = $_GET['id'];
    $query = "SELECT buktitf, tipe_file FROM pesanan WHERE idpesanan = $idpesanan";
    $result = mysqli_query($koneksi, $query);
    $row = mysqli_fetch_assoc($result);

    // Data .bin dari database
    $imageData = $row['buktitf'];
    $imageType = $row['tipe_file'];

    // Cek apakah tipe file adalah JPEG, jika tidak, konversi ke JPEG
    if ($imageType !== 'image/jpeg') {
        $newFileName = convertToJPEG($imageData, $imageType);

        // Atur header untuk file yang akan diunduh
        header('Content-Type: image/jpeg');
        header('Content-Disposition: attachment; filename="buktitf_' . $idpesanan . '.jpg"');
        header('Content-Length: ' . filesize($newFileName));

        // Baca file dan kirimkan ke output
        readfile($newFileName);

        // Hapus file sementara setelah diunduh
        unlink($newFileName);
    } else {
        // Jika tipe file adalah JPEG, langsung kirim sebagai respons
        header('Content-Type: image/jpeg');
        header('Content-Disposition: attachment; filename="buktitf_' . $idpesanan . '.jpg"');
        header('Content-Length: ' . strlen($imageData));
        echo $imageData;
    }
    exit();
}
?>