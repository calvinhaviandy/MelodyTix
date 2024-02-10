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
                        <a href="datauser.php">
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

    <section id="data-user" data-stellar-background-ratio="0.5" style="background-color: white;">
        <br>
        <br>
        <section id="update-data">
            <div class="container-fluid">

                <!-- Page Heading -->
                <div class="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 class="h3 mb-0 text-gray-800">Update Data Akun</h1>
                </div>

                <!-- Menampilkan Data Akun -->
                <div class="row">
                    <?php
                    $id = $_POST['id'];
                    $query = "SELECT * FROM user WHERE id='$id'";
                    $hasil = mysqli_query($koneksi, $query);
                    foreach ($hasil as $data) {


                        ?>
                    </div>


                    <form method="POST" class="my-login-validation" novalidate="">

                        <div class="form-group">
                            <input type="text" name="id" value="<?php echo $data['id']; ?>" readonly><br><br>
                            <label for="uname">Username</label>
                            <input disabled value="<?php echo $data['username']; ?>" id="username" type="text"
                                class="form-control" name="username" required autofocus>
                            <div class="invalid-feedback">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <input value="<?php echo $data['password']; ?>" id="password" type="password"
                                class="form-control" name="password" required data-eye>
                            <div class="invalid-feedback">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="name">Name</label>
                            <input value="<?php echo $data['nama']; ?>" id="nama" type="text" class="form-control"
                                name="nama" required autofocus>
                            <div class="invalid-feedback">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="email">E-Mail Address</label>
                            <input value="<?php echo $data['email']; ?>" id="email" type="email" class="form-control"
                                name="email" required>
                            <div class="invalid-feedback">
                            </div>
                        </div>
                        <br>

                        <div class="form-group m-0">
                            <button name="btnUpdate" type="submit" class="btn btn-primary btn-block">
                                Update
                            </button>
                        </div>
                    </form>

                    <?php
                    }
                    ?>

                <?php
                if (isset($_POST['btnUpdate'])) {
                    $id = $_POST['id'];
                    $password = md5($_POST['password']);
                    $nama = $_POST['nama'];
                    $email = $_POST['email'];

                    $query = "UPDATE user SET password='$password', nama='$nama', email='$email' WHERE id='$id'";
                    $hasil = mysqli_query($koneksi, $query);
                    echo "<p class='alert alert-success text-center'>";
                    echo "<b>Data Berhasil Diupdate</b>";
                    echo "</p>";
                    $page = "index.php";
                    $detik = "2";
                    header("Refresh: $detik; url=$page");
                }
                ?>
        </section>
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

<?php ob_end_flush(); ?>