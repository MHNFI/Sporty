// Mengimpor koneksi database
const db = require('../config/db');

// READ
const getSemuaProduk = (req, res) => {
    const sql = "SELECT * FROM tb_sepatu";
    
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Gagal mengambil data katalog" });
        }
        res.status(200).json(results);
    });
};

// CREATE
const tambahProduk = (req, res) => {
    const { nama, harga, stok } = req.body;
    
    // Mengambil nama file yang baru saja diupload oleh multer
    // Jika tidak ada gambar, set menjadi string kosong atau null
    const gambar = req.file ? req.file.filename : '';
    
    const sql = "INSERT INTO tb_sepatu (nama, harga, gambar, stok) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [nama, harga, gambar, stok], (err, results) => {
        if (err) {
            console.error(err);
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
    const id = req.params.id;
    const { nama, harga, stok } = req.body;
    
    let sql = "";
    let params = [];
    
    // Cek apakah Admin meng-upload gambar baru saat edit
    if (req.file) {
        const gambarBaru = req.file.filename;
        sql = "UPDATE tb_sepatu SET nama = ?, harga = ?, gambar = ?, stok = ? WHERE id = ?";
        params = [nama, harga, gambarBaru, stok, id];
    } else {
        // Jika gambar tidak diubah, jangan update kolom gambar
        sql = "UPDATE tb_sepatu SET nama = ?, harga = ?, stok = ? WHERE id = ?";
        params = [nama, harga, stok, id];
    }
    
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
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

module.exports = {
    getSemuaProduk,
    tambahProduk,
    editProduk,
    hapusProduk
};