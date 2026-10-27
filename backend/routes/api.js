const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const authController = require('../controllers/authController');
const produkController = require('../controllers/produkController');
const diskonController = require('../controllers/diskonController');
const { verifikasiAdmin } = require('../middlewares/authMiddleware');

// --- KONFIGURASI MULTER (PENYIMPANAN FOTO LOKAL) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Menyimpan file gambar ke lokasi frontend/assetss/img/
        cb(null, path.join(__dirname, '../../frontend/assetss/img'));
    },
    filename: (req, file, cb) => {
        // Membuat nama file unik berdasarkan timestamp agar tidak saling menimpa
        const namaUnik = Date.now() + path.extname(file.originalname);
        cb(null, namaUnik);
    }
});

const upload = multer({ storage: storage });

// Endpoint Rute Login
router.post('/login', authController.loginAdmin);

// CRUD Produk Katalog
router.get('/produk', produkController.getSemuaProduk);                                                     // Read (Publik)
router.post('/produk', verifikasiAdmin, upload.single('gambar'), produkController.tambahProduk);        // Create (Khusus Admin + Upload Foto)
router.put('/produk/:id', verifikasiAdmin, upload.single('gambar'), produkController.editProduk);        // Update (Khusus Admin + Upload Foto)
router.delete('/produk/:id', verifikasiAdmin, produkController.hapusProduk);                                // Delete (Khusus Admin)

// Endpoint CRUD Diskon & Promo
router.get('/diskon', diskonController.getAllDiskon);                                                       // Read (Publik bisa lihat diskon yang aktif)
router.post('/diskon', verifikasiAdmin, diskonController.tambahDiskon);                                     // Create (Khusus Admin)
router.put('/diskon/:id', verifikasiAdmin, diskonController.editDiskon);                                    // Update (Khusus Admin)
router.delete('/diskon/:id', verifikasiAdmin, diskonController.hapusDiskon);                                // Delete (Khusus Admin)

module.exports = router;