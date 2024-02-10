
// Fungsi untuk menampilkan alert pmbayaran
function showUploadSuccessAlert() {
$('#alert-success').fadeIn().delay(3000).fadeOut();  // Munculkan selama 3 detik
}

// Fungsi untuk menampilkan pop-up keranjang
function tampilkanKeranjang(jenisTiket) {
$('#keranjang-popup').modal('show');
}

// Fungsi untuk menampilkan alert pesanan tersimpan
function tampilkanAlert() {
alert('Pesanan Anda telah disimpan. Terima kasih!');
}
// Setelah pemesanan tiket berhasil
// Menampilkan pop-up keranjang
tampilkanKeranjang();

// Menampilkan alert pesanan tersimpan
tampilkanAlert();