const db = require('../config/db');

// READ: Ambil semua data diskon + JOIN nama produknya dari tb_sepatu
const getAllDiskon = (req, res) => {
    const sql = `
        SELECT tb_diskon.id, tb_diskon.produk_id, tb_diskon.persen_diskon, 
               tb_sepatu.nama AS nama_produk, tb_sepatu.harga AS harga_asli 
        FROM tb_diskon 
        JOIN tb_sepatu ON tb_diskon.produk_id = tb_sepatu.id 
        ORDER BY tb_diskon.id DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ status: "error", message: "Gagal mengambil data diskon" });
        res.status(200).json({ status: "success", data: results });
    });
};

// CREATE: Pasang diskon pada produk tertentu
const tambahDiskon = (req, res) => {
    const { produk_id, persen_diskon } = req.body;
    const sql = "INSERT INTO tb_diskon (produk_id, persen_diskon) VALUES (?, ?)";
    
    db.query(sql, [produk_id, persen_diskon], (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: "Gagal menerapkan diskon" });
        res.status(201).json({ status: "success", message: "Diskon produk berhasil diterapkan!" });
    });
};

// UPDATE: Ubah persentase diskon
const editDiskon = (req, res) => {
    const { id } = req.params;
    const { persen_diskon } = req.body;
    const sql = "UPDATE tb_diskon SET persen_diskon = ? WHERE id = ?";
    
    db.query(sql, [persen_diskon, id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: "Gagal mengupdate diskon" });
        res.status(200).json({ status: "success", message: "Diskon berhasil diperbarui!" });
    });
};

// DELETE: Cabut diskon dari produk
const hapusDiskon = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM tb_diskon WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: "Gagal menghapus diskon" });
        res.status(200).json({ status: "success", message: "Diskon berhasil dicabut!" });
    });
};

module.exports = { getAllDiskon, tambahDiskon, editDiskon, hapusDiskon };