const db = require('../config/db');

const loginAdmin = (req, res) => {
    const { username, password } = req.body;

    // Cek ketersediaan akun di database MySQL Laragon
    const sql = "SELECT * FROM tb_user WHERE username = ? AND password = ?";
    
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Gagal terhubung ke database" });
        }

        if (results.length === 0) {
            return res.status(401).json({ status: "fail", message: "Username atau password salah!" });
        }

        const user = results[0];

        // Memastikan akun yang login benar-benar punya role Admin
        if (user.role !== 'admin') {
            return res.status(403).json({ status: "fail", message: "Akses ditolak! Akun kamu bukan Admin." });
        }

        // Mengirim respons sukses beserta data role ke Front-end
        res.status(200).json({
            status: "success",
            message: "Login Admin berhasil!",
            data: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    });
};

module.exports = { loginAdmin };