<?php
require "koneksi.php";
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
            alt="LogoTubes" /></a>
      </div>
    </div>
  </section>

  <section id="blog" data-stellar-background-ratio="0.5" style="padding-top: 0">
    <div class="modal-dialog modal-lg">
      <div class="modal-content modal-popup">
        <div class="modal-body">
          <div class="container-fluid">
            <div class="row">
                <?php
                $username = $_POST['username'];
                $nama = $_POST['nama'];
                $email = $_POST['email'];
                $password = md5($_POST['password']);
                $level = 'customer';

                $pemeriksaan_username_dan_email = mysqli_num_rows(mysqli_query($koneksi, "SELECT * FROM user WHERE username='$_POST[username]' or email='$_POST[email]'"));
                if ($pemeriksaan_username_dan_email > 0) {
                  echo "<div class='col-md-12 col-sm-17'>";
                  echo "<h3 class='modal-title' style='color: red;'>Kesalahan</h3>";
                  echo "<div class='tab-content'>";
                  echo "<h4 style='color: red;'> Akun anda telah terdaftar, silahkan ubah form anda! </h4>";
                  echo "<p align = 'center'><a href = 'register.html' class='btn btn-danger' /> Register </a></p>";
                  echo "</div>";
                  echo "</div>";
                } else {
                  $sql = "INSERT INTO user (username,password,nama,email,level) VALUES 
                      ('$username', '$password', '$nama','$email', '$level')";

                  if ($koneksi->query($sql) === TRUE) {
                    echo "<div class='col-md-12 col-sm-17'>";
                    echo "<h3 class='modal-title' style='color: white;'>Akun terdaftar</h3>";
                    echo "<div class='tab-content'>";
                    echo "<h4 style='color: white;'>Registrasi Akun Anda Berhasil</h4>";
                    echo "<p align = 'center'><a href = 'login.php' class='btn btn-danger' /> Login </a></p>";
                    echo "</div>";
                  echo "</div>";
                  } else {
                    echo "<div class='col-md-12 col-sm-17'>";
                    echo "<div class='tab-content'>";
                    echo "<p align = 'center' style='color: white;'>Terjadi kesalahan: " . $sql . "<br/>" . $koneksi->error . "</p>";
                    echo "</div>";
                    echo "</div>";
                  }
                }
                $koneksi->close();

                ?>
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
                <a href="#" class="fa fa-facebook-square" attr="facebook icon"></a>
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
                <p>0898364324</p>
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