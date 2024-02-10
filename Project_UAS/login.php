<?php
require "koneksi.php";
?>

<?php

if (isset($_POST['btnlogin'])) {
    $user_login = $_POST['username'];
    $pass_login = md5($_POST['password']);

    $sql = "SELECT * FROM user WHERE username = '{$user_login}'";
    $query = mysqli_query($koneksi, $sql);

    if (!$query) {
        die("Query gagal" . mysqli_error($koneksi));
    }

    while ($row = mysqli_fetch_array($query)) {
        $user = $row['username'];
        $pass = $row['password'];
        $nama = $row['nama'];
        $email = $row['email'];
        $level = $row['level'];
        $id = $row['id'];
    }
    if (($user_login == $user) && ($pass_login == $pass) && $level == "admin") {
        header("Location: admin/index.php");
        $_SESSION['username'] = $user;
        $_SESSION['nama'] = $nama;
        $_SESSION['level'] = $level;
        $_SESSION['email'] = $email;
        $_SESSION['id'] = $id;
    } else if (($user_login == $user) && ($pass_login == $pass) && $level == "customer") {
        header("Location: user/user.php");
        $_SESSION['username'] = $user;
        $_SESSION['nama'] = $nama;
        $_SESSION['level'] = $level;
        $_SESSION['email'] = $email;
        $_SESSION['id'] = $id;
    } else if (($user_login != $user) || ($pass_login != $pass) ) {
        echo "<script>alert('Username atau password yang Anda masukkan salah');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>MelodyTix - Your tickets solutions</title>

    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <meta name="author" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />

    <link rel="stylesheet" href="css/bootstrap.min.css" />
    <link rel="stylesheet" href="css/magnific-popup.css" />
    <link rel="stylesheet" href="css/font-awesome.min.css" />
    <link rel="stylesheet" href="css/main-style.css" />
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
                </button>

                <a href="index.php" class="navbar-brand"><img height="50px" width="150px" src="images/melodytix5.png"
                        alt="melodytix" /></a>
            </div>
        </div>
    </section>

    <section id="blog" data-stellar-background-ratio="0.5" style="padding-top: 0">
        <div class="container-fluid">
            <div class="row">
                <div class="container h-100">
                    <div class="card fat" style="background-color: black">
                        <div class="card-body">
                            <h4 class="card-title" style="color: white">Login</h4>
                            <form method="POST" class="my-login-validation" novalidate="">
                                <div class="form-group">
                                    <label style="color: white;" for="username">Username</label>
                                    <input id="username" type="text" class="form-control" name="username" required
                                        autofocus autocomplete="username">
                                    <div class="invalid-feedback">
                                        Username is invalid
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label style="color: white;" for="password">Password </label>
                                    <a style="color: white;" href="forgot.php" class="float-right">
                                        Forgot Password?
                                    </a>
                                    <input id="password" type="password" class="form-control" name="password" required
                                        data-eye autocomplete="current-password">
                                    <div class="invalid-feedback">
                                        Password is required
                                    </div>
                                </div>

                                <div class="form-group m-0">
                                    <button type="submit" name="btnlogin" class="btn btn-danger btn-block">
                                        Login
                                    </button>
                                </div>
                                <div class="mt-4 text-center">
                                    <p>Don't have an account? <a href="register.html">Create One</a></p>
                                </div>
                            </form>


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
                        <p>
                           MelodyTix adalah sebuah platform inovatif yang dibuat oleh Kelompok 5 menghadirkan pengalaman tak terlupakan bagi para penggemar musik dan konser. dengan MelodyTix, anda dapat dengan mudah menjelajahi dan membeli tiket untuk konser-konser di Indonesia
                        </p>
                    </div>
                </div>

                <div class="col-md-3 col-sm-4">
                    <div class="footer-thumb">
                        <h2>Connect</h2>
                        <ul class="social-icon">
                            <li>
                                <a href="#" class="fa fa-facebook-square"
                                    attr="facebook icon"></a>
                            </li>
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
                                <p>01985741145</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-2 col-sm-4">
                    <div class="footer-thumb">
                        <h2>Find us</h2>
                        <p>
                            Sistem Informasi <br />
                            Universitas Muhammadiyah Jember
                        </p>
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

    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
        integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
        crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"></script>
    <script src="js/jquery.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/jquery.stellar.min.js"></script>
    <script src="js/jquery.magnific-popup.min.js"></script>
    <script src="js/smoothscroll.js"></script>
    <script src="js/custom.js"></script>
    <script src="js/login.js"></script>
</body>

</html>