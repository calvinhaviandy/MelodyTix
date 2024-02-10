<?php
ob_start();

require "../koneksi.php";
if (empty($_SESSION['username'])) {
    header("Location: ../error.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>


    <title>MelodyTix - Your tickets solutions</title>


    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="../css/bootstrap.min.css">
    <link rel="stylesheet" href="../css/magnific-popup.css">
    <link rel="stylesheet" href="../css/font-awesome.min.css">

    <link rel="stylesheet" href="../css/main-style.css">
</head>

<body>

    <section class="preloader">
        <div class="spinner">
            <span class="spinner-rotate"></span>
        </div>
    </section>

    <section class="navbar custom-navbar navbar-fixed-top" role="navigation">
        <div class="container">

            <div class="navbar-header">
                <button class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon icon-bar"></span>
                    <span class="icon icon-bar"></span>
                    <span class="icon icon-bar"></span>
                </button>

                <a href="user.php" class="navbar-brand"><img height="50px" width="150px"
                        src="../images/melodytix5.png" alt="LogoTubes"></a>
            </div>

            <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav navbar-nav-first">
                    <li class="section-btn" style="background-color: black;">
                        <a href="user.php">
                            Kembali
                        </a>
                    </li>
                    <li class="section-btn">
                        <a class="dropdown-item" href=#" data-toggle="modal" data-target="#logoutModal">
                            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Logout
                        </a>
                    </li>
                    <li class="section-btn" style="background-color: black;">
                        <a href="profile.php?id=<?php echo $_SESSION['id']; ?>">
                            <?php
                            echo $_SESSION['nama'];
                            ?>
                        </a>
                    </li>
                </ul>
            </div>

        </div>
    </section>

    <section id="blog" data-stellar-background-ratio="0.5">
        <div class="modal-dialog modal-lg">
            <div class="modal-content modal-popup">
                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row">
                            <?php
                            if (isset($_POST['btnBeli'])) {
                            $id = $_POST['id'];
                            $query = "SELECT * FROM keranjang WHERE id = '$id'";
                            $hasil = mysqli_query($koneksi, $query);
                            foreach ($hasil as $data) {
                                ?>
                                <div class="col-md-12 col-sm-17">
                                    <div class="modal-title">
                                        <h2>Pesan Tiket</h2>
                                    </div>

                                    <ul class="nav nav-tabs" role="tablist">
                                        <li class="active"><a href="#sign_up" name="jenisTiket" aria-controls="sign_up"
                                                role="tab" data-toggle="tab">
                                                <?php echo $data['nama_konser']; ?>
                                            </a></li>
                                    </ul>

                                    <div class="tab-content">
                                        <form method="post" action="pesanan.php" id="formPesan">
                                            <div class="form-group">
                                                <input type="hidden" name="id_tiket" id="id_tiket"
                                                    value="<?php echo $data['id']; ?>">
                                            </div>
                                                <div class="form-group">
                                                    <label for="jumlahTiket" style="color: white;">Masukkan jumlah Tiket
                                                        :</label>
                                                    <input type="number" min="1" class="form-control" name="jumlahTiket"
                                                        id="jumlahTiket" placeholder="Jumlah tiket" required>
                                                </div>
                                                <div class="form-group">
                                                    <button type="submit" class="btn btn-danger" name="btnPesan">Pesan
                                                        Tiket</button>
                                                </div>
                                        </form>
                                    </div>
                                    <?php } } ?>
                                    <!-- Pop-up Keranjang -->
                                    <div id="keranjang-popup" class="modal" role="dialog">
                                        <!-- Konten modal -->
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                <h2 class="modal-title">Keranjang</h2>
                                            </div>
                                            <div class="modal-body">
                                                <!-- Tempat untuk menampilkan informasi pesanan -->
                                                <div id="infoTiket">
                                                    <?php
                                                    if (isset($_POST['btnPesan'])) {
                                                        // Ambil data dari form
                                                        $idTiket = $_POST['id_tiket'];
                                                        $jumlahTiket = $_POST['jumlahTiket'];

                                                        // Query untuk mengambil data tiket dari database
                                                        $query = "SELECT * FROM keranjang WHERE id = '$idTiket'";
                                                        $result = mysqli_query($koneksi, $query);

                                                        if ($result && mysqli_num_rows($result) > 0) {
                                                            $row = mysqli_fetch_assoc($result);
                                                            $username = $_SESSION['username'];
                                                            $namaKonser = $row['nama_konser'];
                                                            $hargaTiket = $row['harga']; // Sesuaikan dengan nama kolom harga di tabel
                                                
                                                            // Hitung total harga
                                                            $totalHarga = $hargaTiket * $jumlahTiket;

                                                            // Tampilkan informasi pesanan
                                                            echo "<p>Username: $username</p>";
                                                            echo "<p>Nama Konser: $namaKonser</p>";
                                                            echo "<p>Quantity: $jumlahTiket</p>";
                                                            echo "<p>Total Harga: $totalHarga</p>";

                                                            // Form untuk mengupload gambar
                                                            echo "<form method='post' enctype='multipart/form-data'>";
                                                            echo "<input type='file' name='gambar'>";
                                                            echo "<input type='submit' name='btnUpload' value='Upload'>";
                                                            echo "</form>";

                                                            // Jika tombol upload ditekan, tambahkan pesanan ke dalam tabel pesanan
                                                            if (isset($_POST['btnUpload'])) {
                                                                // Proses upload gambar dan tambahkan data ke tabel pesanan
                                                                // Lakukan proses upload dan penambahan ke tabel pesanan di sini
                                                                // Gunakan $_FILES['gambar'] untuk mengakses file yang diupload
                                                                // Pastikan untuk memeriksa keamanan file yang diupload (ukuran, tipe file, dll.)
                                                                // Setelah itu, lakukan penambahan data ke tabel pesanan sesuai dengan informasi yang diberikan
                                                                // Contoh: 
                                                                // $queryPesanan = "INSERT INTO pesanan (username, nama_konser, quantity, total_harga, gambar) VALUES ('$username', '$namaKonser', '$jumlahTiket', '$totalHarga', '$namaFile')";
                                                                // mysqli_query($koneksi, $queryPesanan);
                                                            }
                                                        } else {
                                                            echo "Tidak ada data yang ditemukan";
                                                        }
                                                    }
                                                    ?>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- FOOTER -->
    <footer data-stellar-background-ratio="0.5">
        <div class="container">
            <div class="row">

                <div class="col-md-5 col-sm-12">
                    <div class="footer-thumb footer-info">
                        <h2>Melody Tix</h2>
                        <p>MelodyTix adalah sebuah platform inovatif yang dibuat oleh Kelompok 5 menghadirkan pengalaman tak terlupakan bagi para penggemar musik dan konser. dengan MelodyTix, anda dapat dengan mudah menjelajahi dan membeli tiket untuk konser-konser di Indonesia</p>
                    </div>
                </div>

                <div class="col-md-3 col-sm-4">
                    <div class="footer-thumb">
                        <h2>Connect</h2>
                        <ul class="social-icon">
                            <li><a href="#" class="fa fa-facebook-square"
                                    attr="facebook icon"></a></li>
                            <li><a href="#" class="fa fa-twitter"></a></li>
                            <li><a href="#" class="fa fa-instagram"></a></li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-3 col-sm-4">
                    <div class="footer-thumb">
                        <h2>Contact</h2>
                        <ul class="social-icon">
                            <li>
                                <p>melodytix@gmail.com</p>
                            </li>
                            <li>
                                <p>085361405700</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-2 col-sm-4">
                    <div class="footer-thumb">
                        <h2>Find us</h2>
                        <p>Sistem Informasi <br> Universitas Muhammadiyah Jember</p>
                    </div>
                </div>

                <div class="col-md-12 col-sm-12">
                    <div class="footer-bottom">
                        <div class="copyright-text">
                            <center>
                                <p>Copyright &copy; 2023 Kelompok 5</p>
                            </center>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </footer>

    <div class="modal" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel" style="color:white;">Ready to Leave?</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body" style="color:white;">Select "Logout" below if you are ready to end your
                    current session.</div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <a class="btn btn-danger" href="../logout.php">Logout</a>
                </div>
            </div>
        </div>
    </div>

    <script src="../js/jquery.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../js/jquery.stellar.min.js"></script>
    <script src="../js/jquery.magnific-popup.min.js"></script>
    <script src="../js/smoothscroll.js"></script>
    <script src="../js/custom.js"></script>

</body>

</html>