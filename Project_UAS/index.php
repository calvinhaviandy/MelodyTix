<?php
session_start();
require "koneksi.php";
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

     <link rel="stylesheet" href="css/bootstrap.min.css">
     <link rel="stylesheet" href="css/magnific-popup.css">
     <link rel="stylesheet" href="css/font-awesome.min.css">

     <link rel="stylesheet" href="css/main-style.css">
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

                    <a href="index.html" class="navbar-brand"><img height="50px" width="150px"
                              src="images/MelodyTix5.png" alt="LogoTubes"></a>
               </div>

               <div class="collapse navbar-collapse">
                    <ul class="nav navbar-nav navbar-nav-first">
                         <li><a href="#home" class="smoothScroll">Home</a></li>
                         <li><a href="#about" class="smoothScroll">About</a></li>
                         <li><a href="#blog" class="smoothScroll">Concerts</a></li>
                         <li><a href="#work" class="smoothScroll">Developers</a></li>
                         <li><a href="#contact" class="smoothScroll">Contacts</a></li>
                         <?php
                         if (isset($_SESSION['username'])): ?>
                              <?php if ($_SESSION['level'] == "1"): ?>
                                   <li class="section-btn" style="color: red;"><a
                                             href="admin/profileadmin.php?id=<?php echo $_SESSION['id']; ?>">
                                             <?php echo $_SESSION['nama'] ?>
                                        </a></li>
                                   <li class="section-btn" style="color: black;"><a href="admin/index.php">
                                             Admin Dashboard
                                        </a></li>
                              <?php else: ?>
                                   <li class="section-btn" style="color: black;"><a
                                             href="user/profile.php?id=<?php echo $_SESSION['id']; ?>">
                                             <?php echo $_SESSION['nama'] ?>
                                        </a></li>
                                   <li class="section-btn" style="color: red;"><a href="user/user.php">
                                             Buy Tickets
                                        </a></li>
                              <?php endif; ?>
                         <?php else: ?>
                              <li class="section-btn" style="color: black;"><a href="register.html"
                                        role="button">Register</a></li>
                              <li class="section-btn"><a href="login.php" role="button">Login</a></li>

                         <?php endif; ?>
                    </ul>
               </div>

          </div>
     </section>

     <section id="home" data-stellar-background-ratio="0.5">
          <div class="overlay"></div>
          <div class="container">
               <div class="row">

                    <div class="col-md-6 col-sm-12">
                         <div class="home-info">
                              <h1>We Provide Tickets for the best concert experience.</h1>
                              <a href="#about" class="btn section-btn smoothScroll">About MelodyTix</a>
                              <span>
                                   CALL US (+62) 821 4367 7247
                                   <small>Akbar Imada</small>
                              </span>
                         </div>
                    </div>

                    <div class="col-md-6 col-sm-12">
                         <div class="home-video">
                              <div class="embed-responsive embed-responsive-16by9">
                                   <img src="images/melodytix5.png" width="90%" alt="LogoTubes">
                              </div>
                         </div>
                    </div>

               </div>
          </div>
     </section>

     <section id="about" data-stellar-background-ratio="0.5">
          <div class="container">
               <div class="row">

                    <div class="col-md-5 col-sm-6">
                         <div class="about-info">
                              <div class="section-title">
                                   <h2>Let us introduce</h2>
                                   <span class="line-bar">...</span>
                              </div>
                              <p>MelodyTix adalah sebuah platform inovatif yang dibuat oleh Kelompok 5 menghadirkan pengalaman tak terlupakan bagi para penggemar musik dan konser. dengan MelodyTix, anda dapat dengan mudah menjelajahi dan membeli tiket untuk konser-konser di Indonesia</p>
                              <p> The primary objective is to offer fans unforgettable experiences and assist artists in
                                   promoting their creations.</p>
                         </div>
                    </div>

                    <div class="col-md-3 col-sm-6">
                         <div class="about-info skill-thumb">
                              <div class="progress">
                                   <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="70"
                                        style="color: white;" aria-valuemin="0" aria-valuemax="100" style="width: 70%;">
                                   </div>
                              </div>
                         </div>
                    </div>

                    <div class="col-md-4 col-sm-12">
                         <div class="about-image">
                              <img src="images/a-only-octatix.png" class="img-responsive" alt="">
                         </div>
                    </div>

               </div>
          </div>
     </section>

     <section id="blog" data-stellar-background-ratio="0.5" style="height:220vh">
          <div class="container">
               <div class="row">

                    <div class="col-md-12 col-sm-12">
                         <div class="section-title">
                              <h2>Concerts</h2>
                              <span class="line-bar">...</span>
                         </div>
                    </div>
                    <?php
                    $query = "SELECT * FROM keranjang";
                    $hasil = mysqli_query($koneksi, $query);
                    foreach ($hasil as $data) {
                         ?>
                         <div class="col-md-6 col-sm-6">
                              <!-- BLOG THUMB -->
                              <div class="media blog-thumb">
                                   <div class="media-object media-left">
                                        <a href="#" data-toggle="modal" data-target="#modal-form"><img
                                                  src="images/<?php echo $data['gambar'] ?>" class="img-responsive"
                                                  alt=""></a>
                                   </div>
                                   <div class="media-body blog-info">
                                        <small><i class="fa fa-clock-o"></i>
                                             <?php echo $data['waktu'] ?>
                                        </small>
                                        <h3><a href="#" data-toggle="modal" data-target="#modal-form">
                                                  <?php echo $data['nama_konser'] ?>
                                             </a></h3>
                                        <p>
                                             <?php $konten = $data['deskripsi'];
                                             if (strlen($konten) > 200) {
                                                  $konten = substr($konten, 0, 200);
                                                  echo "$konten ...";
                                             } else {
                                                  echo "$konten";
                                             }
                                             ?>
                                        </p>
                                   </div>
                              </div>
                         </div>
                    <?php } ?>
               </div>
          </div>
     </section>

     <section id="work" data-stellar-background-ratio="0.5">
          <div class="container">
               <div class="row">
                    <div class="col-md-12 col-sm-12">
                         <div class="section-title">
                              <h2>Kelompok 5</h2>
                              <span class="line-bar">...</span>
                         </div>
                    </div>
               </div>

               <div class="row">

                    <div class="col-md-2 col-sm-6">
                         <!-- WORK THUMB -->
                         <div class="work-thumb">
                              <a href="images/dimas1.png" class="image-popup">
                                   <img src="images/dimas1.png" class="img-responsive" alt="dimas">
                                   
                                   <div class="work-info">
                                        <h3>Dimas Eka Surya Saputra</h3>
                                        <small>2210671021</small>
                                   </div>
                              </a>
                         </div>
                    </div>
                    <div class="col-md-2 col-sm-6">
                         <!-- WORK THUMB -->
                         <div class="work-thumb">
                              <a href="images/calvin.png" class="image-popup">
                                   <img src="images/calvin.png" class="img-responsive" alt="calvin">

                                   <div class="work-info">
                                        <h3>Calvin Valeon Haviandy</h3>
                                        <small>2210671025</small>
                                   </div>
                              </a>
                         </div>
                    </div>

                    <div class="col-md-2 col-sm-6">
                         <!-- WORK THUMB -->
                         <div class="work-thumb">
                              <a href="images/chachaa.png" class="image-popup">
                                   <img src="images/chachaa.png" class="img-responsive" alt="chacha">

                                   <div class="work-info">
                                        <h3>Andani Chacha Cahya Dewi</h3>
                                        <small>2210671022</small>
                                   </div>
                              </a>
                         </div>
                    </div>
                    <div class="col-md-2 col-sm-6">
                         <!-- WORK THUMB -->
                         <div class="work-thumb">
                              <a href="images/haikal.jpg" class="image-popup">
                                   <img src="images/haikal.jpg" class="img-responsive" alt="haikal">

                                   <div class="work-info">
                                        <h3>Achmad Haekal Sya'ma</h3>
                                        <small>2210671024</small>
                                   </div>
                              </a>
                         </div>
                    </div>
                    <div class="col-md-2 col-sm-6">
                         <!-- WORK THUMB -->
                         <div class="work-thumb">
                              <a href="images/yudha2_1.png" class="image-popup">
                                   <img src="images/yudha2_1.png" class="img-responsive" alt="yudha">

                                   <div class="work-info">
                                        <h3>Yudha Reyhan Ilham</h3>
                                        <small>2210671023</small>
                                   </div>
                              </a>
                         </div>
                    </div>

               </div>
          </div>
     </section>

     <!-- CONTACT -->
     <section id="contact" data-stellar-background-ratio="0.5">
          <div class="container">
               <div class="row">

                    <div class="col-md-12 col-sm-12">
                         <div class="section-title">
                              <h2>Contact us</h2>
                              <span class="line-bar">...</span>
                         </div>
                    </div>

                    <div class="col-md-8 col-sm-8">

                         <!-- CONTACT FORM HERE -->
                         <form id="contact-form" role="form" action="https://formspree.io/f/mrgngywa" method="post">

                              <div class="col-md-12 col-sm-12">
                                   <input type="email" class="form-control" placeholder="Your Email" id="cf-email"
                                        name="email" required="">
                              </div>

                              <div class="col-md-12 col-sm-12">
                                   <textarea class="form-control" rows="6" placeholder="Your requirements"
                                        id="cf-message" name="message" required=""></textarea>
                              </div>

                              <div class="col-md-4 col-sm-12">
                                   <button type="submit" class="form-control"
                                        style="background-color: red; color: white;">Send</button>
                              </div>

                         </form>
                    </div>

                    <div class="col-md-4 col-sm-4">
                         <div class="google-map">
                              <iframe
                                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.2737085625276!2d113.71511797575513!3d-8.175157081943844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd695d36a97d3d3%3A0x9e61351069cb89d0!2sUniversitas%20Muhammadiyah%20Jember!5e0!3m2!1sid!2sid!4v1704388023524!5m2!1sid!2sid"
                                   allowfullscreen></iframe>
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
                                   <li><a href="https://www.facebook.com/templatemo" class="fa fa-facebook-square"
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
                                   <br>
                                   <li>
                                        <p>0341248712</p>
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
                                        <p>Copyright &copy; 2023 KELOMPOK 5</p>
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
                         <a class="btn btn-danger" href="logout.php">Logout</a>
                    </div>
               </div>
          </div>
     </div>

     <script src="js/jquery.js"></script>
     <script src="js/bootstrap.min.js"></script>
     <script src="js/jquery.stellar.min.js"></script>
     <script src="js/jquery.magnific-popup.min.js"></script>
     <script src="js/smoothscroll.js"></script>
     <script src="js/custom.js"></script>

</body>

</html>