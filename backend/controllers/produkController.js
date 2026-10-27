// Mengimpor koneksi database
const db = require('../config/db');

// READ
const getSemuaProduk = (req, res) => {
    const sql = "SELECT * FROM tb_sepatu";
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Gagal mengambil data katalog" });
        }
        // Mengirim data ke Front-end dalam format JSON
        res.status(200).json(results);
    });
};

// CREATE
const tambahProduk = (req, res) => {
    // req.body berisi data yang dikirim dari form HTML Admin
    const { nama, harga, gambar, stok } = req.body;
    
    // Menggunakan tanda '?' untuk mencegah serangan SQL Injection
    const sql = "INSERT INTO tb_sepatu (nama, harga, gambar, stok) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [nama, harga, gambar, stok], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Gagal menyimpan produk baru" });
        }
        res.status(201).json({ 
            message: "Produk olahraga berhasil ditambahkan!", 
            id_baru: results.insertId 
        });
    });
};

// UPDATE
const editProduk = (req, res) => {
    const id = req.params.id; // Menangkap ID dari URL (misal: /api/produk/1)
    const { nama, harga, gambar, stok } = req.body;
    
    const sql = "UPDATE tb_sepatu SET nama = ?, harga = ?, gambar = ?, stok = ? WHERE id = ?";
    
    db.query(sql, [nama, harga, gambar, stok, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Gagal memperbarui data" });
        }
        res.status(200).json({ message: "Data produk berhasil diperbarui!" });
    });
};

// DELETE
const hapusProduk = (req, res) => {
    const id = req.params.id;
    
    const sql = "DELETE FROM tb_sepatu WHERE id = ?";
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Gagal menghapus produk" });
        }
        res.status(200).json({ message: "Produk ditarik dari katalog!" });
    });
};

// Mengekspor semua fungsi agar bisa digunakan oleh file Route (api.js)
module.exports = {
    getSemuaProduk,
    tambahProduk,
    editProduk,
    hapusProduk
};