const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const produkController = require('../controllers/produkController');
const diskonController = require('../controllers/diskonController');
const { verifikasiAdmin } = require('../middlewares/authMiddleware');

// Endpoint Rute Login
router.post('/login', authController.loginAdmin);
// CRUD Produk Katalog
router.get('/produk', produkController.getSemuaProduk);                         // Read (Publik)
router.post('/produk', verifikasiAdmin, produkController.tambahProduk);        // Create (Khusus Admin)
router.put('/produk/:id', verifikasiAdmin, produkController.editProduk);       // Update (Khusus Admin)
router.delete('/produk/:id', verifikasiAdmin, produkController.hapusProduk);    // Delete (Khusus Admin)

// Endpoint CRUD Diskon & Promo
router.get('/diskon', diskonController.getAllDiskon);                          // Read (Publik bisa lihat diskon yang aktif)
router.post('/diskon', verifikasiAdmin, diskonController.tambahDiskon);        // Create (Khusus Admin)
router.put('/diskon/:id', verifikasiAdmin, diskonController.editDiskon);       // Update (Khusus Admin)
router.delete('/diskon/:id', verifikasiAdmin, diskonController.hapusDiskon);   // Delete (Khusus Admin)

module.exports = router;