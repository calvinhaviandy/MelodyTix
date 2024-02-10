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

    <style>
                    .invoice-box {
                         max-width: 800px;
                         margin: auto;
                         padding: 30px;
                         border: 5px solid #eee;
                         box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                         font-size: 16px;
                         line-height: 24px;
                         font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                         color: #ffffff;
                         background-color: #5e090f;
                    }

                    .invoice-box table {
                         width: 100%;
                         line-height: inherit;
                         text-align: left;
                    }

                    .invoice-box table td {
                         color: #ffffff;
                         padding: 5px;
                         vertical-align: top;
                    }

                    .invoice-box table tr td:nth-child(2) {
                         text-align: right;
                    }

                    .invoice-box table tr.top table td {
                         padding-bottom: 20px;
                    }

                    .invoice-box table tr.top table td.title {
                         font-size: 45px;
                         line-height: 45px;
                         color: #333;
                    }

                    .invoice-box table tr.information table td {
                         padding-bottom: 40px;
                    }

                    .invoice-box table tr.heading td {
                         background: #000000;
                         border-bottom: 1px solid #ddd;
                         font-weight: bold;
                    }

                    .invoice-box table tr.upload td {
                         padding-bottom: 20px;
                         font-style: italic;
                    }

                    .invoice-box table tr.total td:nth-child(2) {
                         border-top: 2px solid #eee;
                         font-weight: bold;
                    }

                    @media only screen and (max-width: 600px) {
                         .invoice-box table tr.top table td {
                              width: 100%;
                              display: block;
                              text-align: center;
                         }

                         .invoice-box table tr.information table td {
                              width: 100%;
                              display: block;
                              text-align: center;
                         }
                    }

                    /* RTL */
                    .invoice-box.rtl {
                         direction: rtl;
                         font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                    }

                    .invoice-box.rtl table {
                         text-align: right;
                    }

                    .invoice-box.rtl table tr td:nth-child(2) {
                         text-align: left;
                    }
               </style>
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

                         <a href="user.php" class="navbar-brand"><img height="50px" width="150px" src="../images/melodytix5.png" alt="LogoTubes"></a>
                    </div>

                    <div class="collapse navbar-collapse">
                         <ul class="nav navbar-nav navbar-nav-first">
                              <li class="section-btn">
                                   <a href="profile.php?id=<?php echo $_SESSION['id']; ?>">
                                        <?php
                                        echo $_SESSION['nama'];
                                        ?>
                                   </a>
                              </li>
                              <li class="section-btn">
                                   <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                        <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Logout
                                   </a>
                              </li>
                         </ul>
                    </div>
                    

               </div>
          </section>

          <section id="home" data-stellar-background-ratio="0.5">
               
          <div class="invoice-box">
                    <table cellpadding="0" cellspacing="0">
                         <tr class="top">
                              <td colspan="2">
                                   <table>
                                        <tr>
                                             <td class="title">
                                                  <img
                                                       src="../images/melodytix5.png"
                                                       style="width: 100%; max-width: 300px"
                                                  />
                                             </td>


                                            <?php
                                            if (!empty($_GET['idpesanan'])) {
                                                 $idPesanan = $_GET['idpesanan'];

                                                 // Gunakan $idPesanan untuk melakukan query atau operasi lainnya sesuai kebutuhan
                                            } else {
                                                 // Jika ID pesanan tidak tersedia dalam URL
                                                 echo "ID pesanan tidak tersedia.";
                                                 // Atau lakukan tindakan lainnya sesuai logika aplikasi Anda
                                            }

                                            if (!isset($_SESSION['invoice_number'])) {
                                                 $ran = random_int(001, 100);
                                                 $date = date("Ymd");
                                                 $inv = "INV-" . $date . $ran;
                                                 $_SESSION['invoice_number'] = $inv;
                                                 $tgl = date("d M Y");
                                            } else {
                                                 $inv = $_SESSION['invoice_number'];
                                                 // Ambil tanggal dari session jika faktur sud ah ada
                                                 $tgl = date("d M Y");
                                            }
                                            ?>
                                             <td>
                                                  ID Pesanan: <i><span><?php echo $idPesanan; ?></span></i> <br />
                                                  Invoice: <i><span><?php echo $inv; ?></span></i> <br />
                                                  Tanggal: <i><span><?php echo $tgl; ?></span></i><br />
                                             </td>
                                        </tr>
                                   </table>
                              </td>
                         </tr>

                         <tr class="information">
                              <td colspan="2">
                                   <table>
                                        <tr>
                                             <td>
                                                  Fakultas Teknik<br />
                                                  Universitas Muhammadiyah Jember<br />
                                                  Jember 2023.
                                             </td>  

                                            
                                            <?php
                                            $query = "SELECT nama, email FROM user WHERE id = '$_SESSION[id]'";
                                            $result = mysqli_query($koneksi, $query);

                                            if ($result && mysqli_num_rows($result) > 0) {
                                                 $dataPengguna = mysqli_fetch_assoc($result);
                                                 $nama = $dataPengguna['nama'];
                                                 $email = $dataPengguna['email'];

                                                 // Tampilkan informasi pengguna di dalam sebuah row tabel
                                                 echo "<tr>";
                                                 echo "<td>$nama</td>";
                                                 echo "<td>$email</td>";
                                                 echo "</tr>";
                                            } else {
                                                 // Jika tidak ada data, tampilkan pesan di row tabel
                                                 echo "<tr><td colspan='2'>Tidak dapat menemukan informasi pengguna.</td></tr>";
                                            }
                                            ?>
                                             </td>
                                        </tr>
                                   </table>
                              </td>
                         </tr>

                        <?php

                        $query = "SELECT nama_konser, quantity, total_harga FROM pesanan WHERE idpesanan = '$idPesanan'";
                        $result = mysqli_query($koneksi, $query);

                        if ($result && mysqli_num_rows($result) > 0) {
                             $row = mysqli_fetch_assoc($result);

                             $band_konser = $row['nama_konser'];
                             $quantity = $row['quantity'];
                             $harga_konser = $row['total_harga'];
                        } else {
                             $band_konser = "Data tidak tersedia";
                             $quantity = "Data tidak tersedia";
                             $harga_konser = "Data tidak tersedia";
                        }
                        ?>

                        <table>
                            <tr class="heading">
                                <td>Band</td>
                                <td>
                                    <?php echo $band_konser; ?>
                                </td>
                            </tr>
                            <tr class="heading">
                                <td>Quantity</td>
                                <td>
                                    <?php echo $quantity; ?>
                                </td>
                            </tr>
                            <tr class="heading">
                                <td>Total Harga</td>
                                <td>
                                    <?php echo $harga_konser; ?>
                                </td>
                            </tr>

                        <tr class="total">
                            <td></td>

                              <td>Terimakasih telah mempercayai Melody Tix Sebagai <br>
                                Tempat Membeli Konser Anda.</td>
                              </td>
                         </tr>

                         <tr class="upload">
                              <td></td>
                              <td>
                              <a href="../pdf/<?php echo $band_konser ?>.pdf" target="_blank">
                              <button type="button" name="btnProses">Print Ticket</button>
                              </a>
                         </td>
                         </tr>

                         <style>
                         .upload {
                         align-items: center;
                         }

                         input[type="file"] {
                         margin-bottom: 5px;
                         padding: 5px;
                         border-radius: 2.5px;
                         }


                         button[name="btnProses"] {
                         padding: 10px 10px;
                         background-color: #ff0303;
                         color: white;
                         border: none;
                         border-radius: 5px;
                         cursor: pointer;
                         font-size: 16px;
                         transition: background-color 0.3s ease;
                         }

                         button[name="btnProses"]:hover {
                         background-color: #360b0b;
                         }
                                             
                         </style>

                    </table>
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