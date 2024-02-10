<?php
// Uncomment the following line to start the session
session_start();

require("../koneksi.php");

// Check if the user is not logged in, redirect to the error page
if (empty($_SESSION['id'])) {
    header("Location: ../login.php");
    exit(); // Ensure script stops execution after redirect
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];
} else {
    // If no ID is provided, you can handle it as an error or redirect to a default page
    header("Location: ../login.php");
    exit();
}

// Check if the form is submitted
if (isset($_POST['btnUpdate'])) {
    // Retrieve data from the form
    $nama = $_POST['nama'];
    $username = $_POST['username'];
    $email = $_POST['email'];

    // Update user data in the database based on the form input
    $update_query = "UPDATE user SET username='$username', nama='$nama', email='$email' WHERE id='$id'";
    $result = mysqli_query($koneksi, $update_query);

    // Check if the update was successful
    if ($result) {
        echo "<script>alert('Data updated successfully!');</script>";
        $page = "user.php";
        $detik = "3";
        header("Refresh: $detik; url=$page");
    } else {
        echo "<script>alert('Error updating data: " . mysqli_error($koneksi) . "');</script>";
    }
}

// Proses penghapusan data jika tombol hapus ditekan
if (isset($_POST['hapus'])) {
    $idToDelete = $_POST['id'];

    // Query untuk menghapus data dari database
    $delete_query = "DELETE FROM user WHERE id='$idToDelete'";
    $delete_result = mysqli_query($koneksi, $delete_query);

    if ($delete_result) {
        // Hapus session untuk logout
        session_destroy();
        header("Location: ../login.php");
    } else {
        echo "<script>alert('Gagal menghapus data: " . mysqli_error($koneksi) . "');</script>";
    }
}

$aa_query = "SELECT * FROM user WHERE id='$id'";
$result = mysqli_query($koneksi, $aa_query);

// Fetch user data
$userData = mysqli_fetch_assoc($result);

$_SESSION['nama'] = $userData['nama'];
$_SESSION['username'] = $userData['username'];
$_SESSION['email'] = $userData['email'];

// Close the database connection
mysqli_close($koneksi);
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
        .card {
            border-radius: 10px;
            padding: 20px;
        }
    </style>
</head>

<body>


    <section class="navbar custom-navbar navbar-fixed-top" role="navigation">
        <div class="container">

            <div class="navbar-header">
                <button class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon icon-bar"></span>
                    <span class="icon icon-bar"></span>
                    <span class="icon icon-bar"></span>
                </button>

                <a href="../index.php" class="navbar-brand"><img height="50px" width="150px"
                        src="../images/melodytix5.png" alt="LogoTubes"></a>
            </div>

            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav navbar-nav-first">
                    <li class="section-btn" style="background-color: black;">
                        <a href="user.php">
                            Kembali
                        </a>
                    </li>
                    <li class="section-btn" style="background-color: red;">
                        <a href="../forgot.php">
                            Update Password
                        </a>
                    </li>
                    <li class="section-btn">
                        <a class="dropdown-item" href=#" data-toggle="modal" data-target="#logoutModal">
                            <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Logout
                        </a>
                    </li>
                </ul>
            </div>

        </div>
    </section>


    <section id="blog" data-stellar-background-ratio="0.5" style="padding-top: 0">
        <div class="container-fluid">
            <div class="row">
                <div class="container h-100">
                    <div class="card fat" style="background-color: black; margin-bottom: 20px;">
                        <div class="card-body">
                            <h3 class="card-title" style="color: white;">Profile</h3>
                            <h5 style="color: white;">Nama :
                                <?php echo $_SESSION['nama'] ?>
                            </h5>
                            <h5 style="color: white;">Email :
                                <?php echo $_SESSION['email'] ?>
                            </h5>
                            <h5 style="color: white;">Username :
                                <?php echo $_SESSION['username'] ?>
                            </h5>
                        </div>
                    </div>
                    <div class="card fat" style="background-color: black">
                        <div class="card-body">
                            <h4 class="card-title" style="color: white">Update Profile</h4>
                            <form action="" method="post" enctype=" multipart/form-data">
                                <div class="form-group">
                                    <label style="color: white;" for="update-email">Email Baru:</label>
                                    <input name="email" type="email" class="form-control" required
                                        oninvalid="this.setCustomValidity('Email Tidak Boleh Kosong & Email Harus Diisi Sesuai Kriteria &#34; email@email.com &#34;')"
                                        value="<?php echo isset($userData['email']) ? $userData['email'] : ''; ?>">
                                </div>

                                <div class="form-group">
                                    <label style="color: white;" for="update-nama">Nama Baru:</label>
                                    <input name="nama" type="text" class="form-control" required
                                        oninvalid="this.setCustomValidity('Nama Tidak Boleh Kosong')"
                                        value="<?php echo isset($userData['nama']) ? $userData['nama'] : ''; ?>">
                                </div>

                                <div class="form-group">
                                    <label style="color: white;" for="update-username">Username Baru:</label>
                                    <input name="username" type="text" class="form-control" required
                                        value="<?php echo isset($userData['username']) ? $userData['username'] : ''; ?>"
                                        oninvalid="this.setCustomValidity('Username Tidak Boleh Kosong')">
                                </div>

                                <div class="form-group m-0">
                                    <button type="submit" name="btnUpdate" class="btn btn-primary btn-block">
                                        Update Profile
                                    </button>
                                </div>

                        </div>
                        </form>
                        <button type="button" class="btn btn-danger btn-block" data-toggle="modal"
                            data-target="#deleteConfirmationModal">
                            Delete Account </button>
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

    <!-- modal logout -->
    <div class="modal" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
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

    <div class="modal" id="deleteConfirmationModal" tabindex="-1" role="dialog"
        aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteConfirmationModalLabel" style="color: white;">Are you sure you
                        want to delete your
                        account?</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="color: white;">
                    This action cannot be undone. Are you sure you want to proceed?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal"
                        style="margin: 5 0 5 0;">Cancel</button>
                    <!-- Button to trigger the deletion process -->
                    <form method="post">
                        <input type="hidden" name="id" value="<?php echo $userData['id']; ?>">
                        <button type="submit" name="hapus" class="btn btn-danger">Yes, Delete My Account</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
        integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
        crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"></script>
    <script src="../js/login.js"></script>
    <script src="../js/jquery.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../js/jquery.stellar.min.js"></script>
    <script src="../js/jquery.magnific-popup.min.js"></script>
    <script src="../js/smoothscroll.js"></script>
    <script src="../js/custom.js"></script>

    <div class=" mx-2 my-2 row">
        <?php
        $id = $_SESSION['username'];
        $pelacakan_data = mysqli_query($koneksi, "SELECT * FROM user WHERE username='$id'");
        $nomor = 1;
        while ($data = mysqli_fetch_array($pelacakan_data)) {
            ?>
            <form method="post" action="">
                <!-- ... (your existing form fields) ... -->

                <!-- Add the following hidden input field to pass 'id' to the PHP script -->
                <input type="hidden" name="id" value="<?php echo $data['id'] ?>">

                <!-- ... (your existing form fields) ... -->

                <div class="form-group m-0">
                    <button type="submit" class="btn btn-primary btn-block">
                        Ubah Data
                    </button>
                </div>
            </form>
        <?php } ?>
    </div>


</body>

</html>