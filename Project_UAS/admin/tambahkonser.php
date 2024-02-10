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


?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Tangani data yang dikirim dari formulir
    $nama_konser = $_POST['nama_konser'];
    $waktu = $_POST['waktu'];
    $gambar = $_POST['gambar'];
    $harga = $_POST['harga'];
    $stok = $_POST['stok'];
    $deskripsi = $_POST['deskripsi'];

    $query = "INSERT INTO keranjang (nama_konser, waktu, gambar, harga, stok_tiket, deskripsi) VALUES ('$nama_konser', '$waktu', '$gambar', '$harga', '$stok', '$deskripsi')";
    $result = mysqli_query($koneksi, $query);

    if ($result) {
        echo "<script>alert('Data berhasil ditambahkan.')</script>";
        $page = "datakonser.php";
        $detik = "2";
        header("Refresh: $detik; url=$page");
    } else {
        echo "<script>alert('Gagal menambahkan data. Silakan coba lagi.')</script>";
    }
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
    <link rel="stylesheet" href="../css/custom.css">

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
                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
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
                </ul>
            </div>


        </div>
    </section>
    <br>
    <br>
    <br>
    <section id="update-data">
        <div class="container-fluid" style="background-color: white;">

            <!-- Page Heading -->
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 class="h3 mb-0 text-gray-800">Tambah Data Konser</h1>
            </div>

            <form method="POST">
            <div class="form-group">
                <label for="nama_konser">Nama Konser</label>
                <input type="text" class="form-control" id="nama_konser" name="nama_konser" required>
            </div>
            <div class="form-group">
                <label for="waktu">Waktu</label>
                <input type="datetime-local" class="form-control" id="waktu" name="waktu" required>
            </div>
            <div class="form-group">
                <label for="gambar">Gambar</label>
                <input type="text" class="form-control" id="gambar" name="gambar" required>
            </div>
            <div class="form-group">
                <label for="harga">Harga</label>
                <input type="text" class="form-control" id="harga" name="harga" required>
            </div>
            <div class="form-group">
                <label for="stok">Stok</label>
                <input type="text" class="form-control" id="stok" name="stok" required>
            </div>
            <div class="form-group">
                <label for="deskripsi">Deskripsi</label>
                <textarea class="form-control" id="deskripsi" name="deskripsi" required></textarea>
            </div>
            <button type="submit" class="btn btn-danger">Tambahkan</button>
        </form>


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

    <section class="modal fade" id="modal-form" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content modal-popup">

                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row">

                            <div class="col-md-12 col-sm-12">
                                <div class="modal-title">
                                    <h2>OCTATIX </h2>
                                </div>

                                <ul class="nav nav-tabs" role="tablist">
                                    <li class="active"><a href="#sign_up" aria-controls="sign_up" role="tab"
                                            data-toggle="tab">Create an account</a></li>
                                    <li><a href="#sign_in" aria-controls="sign_in" role="tab" data-toggle="tab">Sign
                                            In</a></li>
                                </ul>

                                <div class="tab-content">
                                    <div role="tabpanel" class="tab-pane fade in active" id="sign_up">
                                        <form action="#" method="post">
                                            <input type="text" class="form-control" name="name" placeholder="Name"
                                                required>
                                            <input type="telephone" class="form-control" name="telephone"
                                                placeholder="Telephone" required>
                                            <input type="email" class="form-control" name="email" placeholder="Email"
                                                required>
                                            <input type="password" class="form-control" name="password"
                                                placeholder="Password" required>
                                            <input type="submit" class="form-control" name="submit"
                                                value="Submit Button">
                                        </form>
                                    </div>

                                    <div role="tabpanel" class="tab-pane fade in" id="sign_in">
                                        <form action="#" method="post">
                                            <input type="email" class="form-control" name="email" placeholder="Email"
                                                required>
                                            <input type="password" class="form-control" name="password"
                                                placeholder="Password" required>
                                            <input type="submit" class="form-control" name="submit"
                                                value="Submit Button">
                                            <a href="#">Forgot your password?</a>
                                        </form>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

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

</body>

</html>