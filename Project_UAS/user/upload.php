<?php
session_start();

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
                            <!-- Tempat untuk menampilkan informasi pesanan -->
                            <div id="infoTiket">
                                <?php
                                // Jika tombol upload ditekan, tambahkan pesanan ke dalam tabel pesanan
                                // Cek apakah tombol btnUpload ditekan dan ada file yang dipilih
                                if (isset($_POST['btnUpload']) && !empty($_FILES['gambar']['name'])) {
                                    $idTiket = $_POST['id_tiket'];
                                    $jumlahTiket = $_POST['jumlahTiket'];
                                    $status = $_POST['status'];

                                    $query = "SELECT * FROM keranjang WHERE id = '$idTiket'";
                                    $result = mysqli_query($koneksi, $query);

                                    if ($result && mysqli_num_rows($result) > 0) {
                                        $row = mysqli_fetch_assoc($result);
                                        $username = $_SESSION['username'];
                                        $namaKonser = $row['nama_konser'];
                                        $hargaTiket = $row['harga'];
                                        $stok = $row['stok_tiket'];
                                        $totalHarga = $hargaTiket * $jumlahTiket;

                                        $namaFile = $_FILES['gambar']['name'];
                                        $ukuranFile = $_FILES['gambar']['size'];
                                        $tipeFile = $_FILES['gambar']['type'];
                                        $tmpName = $_FILES['gambar']['tmp_name'];

                                        $gambar = file_get_contents($tmpName);
                                        $gambar = mysqli_real_escape_string($koneksi, $gambar);

                                        $queryPesanan = "INSERT INTO pesanan (username, nama_konser, quantity, total_harga, buktitf, tipe_file, status) VALUES ('$username', '$namaKonser', '$jumlahTiket', '$totalHarga', '$gambar', '$tipeFile', '$status')";
                                        if (mysqli_query($koneksi, $queryPesanan)) {
                                            // Cek apakah pesanan berhasil di-insert
                                            $idPesananBaru = mysqli_insert_id($koneksi); // Ambil ID pesanan yang baru saja dibuat
                                            
                                            // Tambahkan input hidden untuk menyimpan idpesanan yang baru
                                            echo "<form method='post' action='status.php'>";
                                            echo "<div class='form-group'>";
                                            echo "<label for='idpesanan' style='color: white; align-text: center;'>Cek Status Pesanan</label><br>";
                                            echo "<input type='hidden' name='idpesanan' value='$idPesananBaru'>"; // Simpan idpesanan ke input hidden
                                            echo "<input type='hidden' name='jumlahTiket' value='$jumlahTiket'>";
                                            echo "<input type='hidden' name='stok' value='$stok'>";
                                            echo "<input type='hidden' name='id_tiket' value='$idTiket'>";
                                            echo "<input type='submit' name='status' class='btn btn-danger' value='Cek'>"; // Tombol submit
                                            echo "</div></form>"; // Tutup form
                                        }
                                }
                            }
                                ?>
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