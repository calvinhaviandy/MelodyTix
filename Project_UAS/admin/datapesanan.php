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


ob_start();
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
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css">

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

                <a href="index.php" class="navbar-brand"><img height="50px" width="150px"
                        src="../images/melodytix5.png" alt="LogoTubes"></a>
            </div>

            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav navbar-nav-first">
                    <li class="section-btn" style="background-color: black;">
                        <a href="index.php">
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
                        <a href="profileadmin.php?id=<?php echo $_SESSION['id']; ?>">
                            <?php
                            echo $_SESSION['nama'];
                            ?>
                        </a>
                    </li>
                    <li class="section-btn" id="current_timestamp" style="background-color: black; color: white">
                        <span id="current-time"></span>
                    </li>
                </ul>
            </div>


        </div>
    </section>

    <section id="data-pesanan" data-stellar-background-ratio="0.5" style="background-color: white;">
        <br>
        <br>
        <div class="container">
            <table id="tabelPesanan" class="display">
                <thead>
                    <tr>
                        <th>ID Pesanan</th>
                        <th>Username</th>
                        <th>Nama Konser</th>
                        <th>Quantity</th>
                        <th>Waktu Beli</th>
                        <th>Total Harga</th>
                        <th>Bukti Transfer</th>
                        <th>Tipe File</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $query = "SELECT * FROM pesanan";
                    $hasil = mysqli_query($koneksi, $query);
                    foreach ($hasil as $data) {
                        ?>
                        <tr>
                            <td>
                                <?php echo $data['idpesanan']; ?>
                            </td>
                            <td>
                                <?php echo $data['username']; ?>
                            </td>
                            <td>
                                <?php echo $data['nama_konser']; ?>
                            </td>
                            <td>
                                <?php echo $data['quantity']; ?>
                            </td>
                            <td>
                                <?php echo $data['tanggal_pembelian']; ?>
                            </td>
                            <td>
                                <?php echo $data['total_harga']; ?>
                            </td>
                            <td>
                                <?php
                                if (($data['tipe_file'] === 'image/jpeg') || ($data['tipe_file'] === 'image/png')) {
                                    echo "<a href='download_blob.php?id=" . $data['idpesanan'] . "'>Download</a>";
                                } else {
                                    echo "Tidak ada file yang bisa diunduh";
                                }
                                ?>
                            </td>
                            <td>
                                <?php echo $data['tipe_file']; ?>
                            </td>
                            <td>
                                <?php echo $data['status']; ?>
                            </td>
                            <td>
                                <form method='post' style='width: 28rem;'>
                                    <input type='hidden' name='idpesanan' value='<?php echo $data['idpesanan']; ?>'>
                                    <!-- Tombol aksi -->
                                    <button type='submit' class='btn btn-success' name='btnAccept'>Accept</button>
                                    <button type='submit' class='btn btn-warning' name='btnPending'>Pending</button>
                                    <button type='submit' class='btn btn-danger' name='btnDeny'>Deny</button>
                                </form>
                            </td>
                        </tr>
                        <?php
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </section>

    <?php
    if (isset($_POST['btnAccept'])) {
        $idpesanan = $_POST['idpesanan'];
        $query = "UPDATE pesanan SET status = 'accept' WHERE idpesanan = $idpesanan";
        mysqli_query($koneksi, $query);
        echo "<p class='alert alert-success'>";
        echo "<b>Data Berhasil Diterima</b>";
        echo "</p>";
        $page = "datapesanan.php";
        $detik = "2";
        header("Refresh: $detik; url=$page");
    } elseif (isset($_POST['btnDeny'])) {
        $idpesanan = $_POST['idpesanan'];
        $query = "UPDATE pesanan SET status = 'deny' WHERE idpesanan = $idpesanan";
        mysqli_query($koneksi, $query);
        echo "<p class='alert alert-warning'>";
        echo "<b>Data Berhasil Ditolak</b>";
        echo "</p>";
        $page = "datapesanan.php";
        $detik = "2";
        header("Refresh: $detik; url=$page");
    } elseif (isset($_POST['btnPending'])) {
        $idpesanan = $_POST['idpesanan'];
        $query = "UPDATE pesanan SET status = 'pending' WHERE idpesanan = $idpesanan";
        mysqli_query($koneksi, $query);
        echo "<p class='alert alert-info'>";
        echo "<b>Status berhasil diubah menjadi Pending</b>";
        echo "</p>";
        $page = "datapesanan.php";
        $detik = "2";
        header("Refresh: $detik; url=$page");
    } elseif ($koneksi->connect_error) {
        echo "<p class='alert alert-danger text-center'>";
        echo "<b>Data Gagal Diproses</b>";
        echo "Terjadi Kesalahan: " . $koneksi->connect_error;
        echo "</p>";
    }

    ?>

    <!-- FOOTER -->
    <footer data-stellar-background-ratio="0.5">
        <div class="container">
            <div class="row">

                <div class="col-md-5 col-sm-12">
                    <div class="footer-thumb footer-info">
                        <h2>Melody Tix</h2>
                        <p>MelodyTix adalah sebuah platform inovatif yang dibuat oleh Kelompok 5 menghadirkan pengalaman tak terlupakan bagi para penggemar musik dan konser. dengan MelodyTix, anda dapat dengan mudah menjelajahi dan membeli tiket untuk konser-konser di Indonesia.</p>
                    </div>
                </div>

                <div class="col-md-3 col-sm-4">
                    <div class="footer-thumb">
                        <h2>Connect</h2>
                        <ul class="social-icon">
                            <li><a href="#" class="fa fa-facebook-square" attr="facebook icon"></a></li>
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

    <!-- modal logout -->
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
                <div class="modal-body" style="color:white;">Select "Logout" below if you are ready to end your current
                    session.</div>
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
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <script>
        $(document).ready(function () {
            $('#tabelPesanan').DataTable();
        });
    </script>
    <script>
        function updateClock() {
            const now = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            };
            const currentDateTime = now.toLocaleDateString('en-US', options); // Mengambil waktu lengkap saat ini
            document.getElementById('current-time').textContent = currentDateTime; // Menampilkan waktu lengkap pada elemen span
        }

        // Memanggil fungsi untuk pertama kali saat halaman dimuat
        updateClock();

        // Memperbarui waktu setiap detik
        setInterval(updateClock, 1000); b
    </script>

</body>

</html>

<?php ob_end_flush(); ?>