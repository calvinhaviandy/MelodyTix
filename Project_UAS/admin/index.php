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

// Cek jika level tidak sama dengan admin, maka arahkan ke error.php
if ($userLevel != 'admin') {
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

                    <a href="index.php" class="navbar-brand"><img height="50px" width="150px"
                              src="../images/melodytix5.png" alt="LogoTubes"></a>
               </div>

               <div class="collapse navbar-collapse">
                    <ul class="nav navbar-nav navbar-nav-first">
                         <li class="section-btn" style="background-color: black;">
                              <a href="../index.php">
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

     <section id="home" data-stellar-background-ratio="0.5">
          <div class="overlay"></div>
          <div class="container">
               <div class="row">
                    <!-- Card Data Akun -->
                    <div class="col-md-4">
                         <div class="card" style="background-color: black; padding: 10px; border-radius: 5px">
                              <div class="card-body">
                                   <h4 class="card-title" style="color: white;">Data Akun</h4>
                                   <p class="card-text">Tampilkan data akun Anda di sini.</p>
                                   <a href="datauser.php" class="btn btn-primary">Lihat Data Akun</a>
                              </div>
                         </div>
                    </div>

                    <!-- Card Data Pesanan -->
                    <div class="col-md-4">
                         <div class="card" style="background-color: black; padding: 10px; border-radius: 5px">
                              <div class="card-body">
                                   <h4 class="card-title" style="color: white;">Data Pesanan</h4>
                                   <p class="card-text">Tampilkan data pesanan di sini.</p>
                                   <a href="datapesanan.php" class="btn btn-primary">Lihat Data Pesanan</a>
                              </div>
                         </div>
                    </div>

                    <!-- Card Data Konser -->
                    <div class="col-md-4">
                         <div class="card" style="background-color: black; padding: 10px; border-radius: 5px">
                              <div class="card-body">
                                   <h4 class="card-title" style="color: white;">Data Konser</h4>
                                   <p class="card-text">Tampilkan data konser di sini.</p>
                                   <a href="datakonser.php" class="btn btn-primary">Lihat Data Konser</a>
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
                                             <h2>Melody Tix </h2>
                                        </div>

                                        <ul class="nav nav-tabs" role="tablist">
                                             <li class="active"><a href="#sign_up" aria-controls="sign_up" role="tab"
                                                       data-toggle="tab">Create an account</a></li>
                                             <li><a href="#sign_in" aria-controls="sign_in" role="tab"
                                                       data-toggle="tab">Sign In</a></li>
                                        </ul>

                                        <div class="tab-content">
                                             <div role="tabpanel" class="tab-pane fade in active" id="sign_up">
                                                  <form action="#" method="post">
                                                       <input type="text" class="form-control" name="name"
                                                            placeholder="Name" required>
                                                       <input type="telephone" class="form-control" name="telephone"
                                                            placeholder="Telephone" required>
                                                       <input type="email" class="form-control" name="email"
                                                            placeholder="Email" required>
                                                       <input type="password" class="form-control" name="password"
                                                            placeholder="Password" required>
                                                       <input type="submit" class="form-control" name="submit"
                                                            value="Submit Button">
                                                  </form>
                                             </div>

                                             <div role="tabpanel" class="tab-pane fade in" id="sign_in">
                                                  <form action="#" method="post">
                                                       <input type="email" class="form-control" name="email"
                                                            placeholder="Email" required>
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
          setInterval(updateClock, 1000);b
     </script>

</body>

</html>