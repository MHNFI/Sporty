// Satpam verifikasi akses khusus Admin
const verifikasiAdmin = (req, res, next) => {
    // Front-end bakal menyelipkan header 'x-role-akses' saat nge-request fitur CRUD Admin
    const roleHeader = req.headers['x-role-akses'];

    if (!roleHeader || roleHeader !== 'admin') {
        return res.status(403).json({ 
            status: "fail", 
            message: "Akses ditolak! Kamu harus login sebagai Admin untuk melakukan aksi ini." 
        });
    }

    // Lanjut ke Controller CRUD kalau role terbukti Admin
    next();
};

module.exports = { verifikasiAdmin };