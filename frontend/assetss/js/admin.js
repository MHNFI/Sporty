// CRUD PRODUK KATALOG
const API_URL = 'http://localhost:3000/api/produk';

// Ambil role dari localStorage yang disimpan pas login
const roleUser = localStorage.getItem('role') || '';

// READ
async function muatKatalog() {
    const response = await fetch(API_URL);
    const result = await response.json();
    
    let html = '';
    result.data.forEach(item => {
        html += `
            <tr>
                <td>${item.nama}</td>
                <td>Rp ${item.harga}</td>
                <td>${item.stok}</td>
                <td>
                    <button onclick="siapkanEdit(${item.id}, '${item.nama}', ${item.harga}, ${item.stok}, '${item.gambar}')">Edit</button>
                    <button onclick="hapusProduk(${item.id})">Hapus</button>
                </td>
            </tr>
        `;
    });
    document.getElementById('tabel-produk').innerHTML = html;
}

// CREATE
async function simpanProduk(dataProduk) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-role-akses': roleUser // Kirim header verifikasi Admin
        },
        body: JSON.stringify(dataProduk)
    });
    
    const result = await response.json();
    alert(result.message);
    muatKatalog();
}

// DELETE
async function hapusProduk(id) {
    if (!confirm('Yakin mau hapus produk ini?')) return;

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'x-role-akses': roleUser // Kirim header verifikasi Admin
        }
    });

    const result = await response.json();
    alert(result.message);
    muatKatalog();
}

// CRUD DISKON
const API_DISKON = 'http://localhost:3000/api/diskon';

// READ: Tampilkan data diskon ke tabel HTML Admin
async function muatTabelDiskon() {
    try {
        const response = await fetch(API_DISKON);
        const result = await response.json();
        const tbody = document.getElementById("data-diskon");
        tbody.innerHTML = "";

        if (!result.data || result.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Belum ada diskon yang aktif.</td></tr>`;
            return;
        }

        result.data.forEach((item, index) => {
            const hargaPotongan = item.harga_asli - (item.harga_asli * (item.persen_diskon / 100));
            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${item.nama_produk}</strong></td>
                    <td>Rp ${item.harga_asli.toLocaleString('id-ID')}</td>
                    <td><span style="background:#ffe4e6; color:#e11d48; padding:3px 8px; border-radius:4px; font-weight:bold;">${item.persen_diskon}%</span></td>
                    <td style="color:#0d9488; font-weight:bold;">Rp ${hargaPotongan.toLocaleString('id-ID')}</td>
                    <td>
                        <button class="btn btn-hapus" onclick="hapusDiskon(${item.id})"><i class="fas fa-trash"></i> Cabut</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Gagal memuat diskon:", err);
    }
}

//  CREATE: Simpan Diskon Baru ke Database via Fetch POST
document.getElementById("form-diskon").addEventListener("submit", async (e) => {
    e.preventDefault();
    const produk_id = document.getElementById("select-produk-diskon").value;
    const persen_diskon = parseInt(document.getElementById("persen-diskon").value);

    const response = await fetch(API_DISKON, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-role-akses': localStorage.getItem('roleAkses')
        },
        body: JSON.stringify({ produk_id, persen_diskon })
    });

    const result = await response.json();
    alert(result.message);
    document.getElementById("modal-diskon").classList.remove("active");
    muatTabelDiskon();
});

// DELETE: Hapus/Cabut Diskon via Fetch DELETE
async function hapusDiskon(id) {
    if (!confirm("Cabut promo diskon dari produk ini?")) return;

    const response = await fetch(`${API_DISKON}/${id}`, {
        method: 'DELETE',
        headers: {
            'x-role-akses': localStorage.getItem('roleAkses')
        }
    });

    const result = await response.json();
    alert(result.message);
    muatTabelDiskon();
}

// Event Buka/Tutup Modal Diskon
document.getElementById("btn-tambah-diskon").addEventListener("click", () => {
    document.getElementById("modal-diskon").classList.add("active");
});
document.getElementById("btn-tutup-modal-diskon").addEventListener("click", () => {
    document.getElementById("modal-diskon").classList.remove("active");
});

// FE DASHBOARD
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SISTEM SATPAM (Proteksi Halaman) ---
    const role = localStorage.getItem("roleAkses");
    if (role !== "admin") {
        alert("Akses Ilegal! Anda bukan Admin.");
        window.location.href = "../../login.html"; 
        return; // Hentikan script jika bukan admin
    }

    // --- 2. FITUR LOGOUT ---
    document.getElementById("btn-logout").addEventListener("click", () => {
        localStorage.removeItem("roleAkses");
        window.location.href = "../../login.html";
    });

    // --- 3. INTERAKSI UI MODAL (POP-UP FORM) ---
    const modal = document.getElementById("modal-produk");
    const formProduk = document.getElementById("form-produk");
    const modalTitle = document.getElementById("modal-title");

    // Buka form tambah produk
    document.getElementById("btn-tambah-produk").addEventListener("click", () => {
        formProduk.reset();
        document.getElementById("produk-id").value = "";
        modalTitle.innerText = "Tambah Produk Baru";
        modal.classList.add("active");
    });

    // Tutup form
    document.getElementById("btn-tutup-modal").addEventListener("click", () => {
        modal.classList.remove("active");
    });

    // --- 4. DATA SIMULASI CRUD SEMENTARA ---
    // (Agar kamu bisa klik tombol Tambah, Edit, Hapus dan melihat hasilnya di tabel sebelum Node.js menyala)
    let dummyData = [
        { id: 1, nama: "Haze Vision 1.0", kategori: "Daily Trainer", harga: 549000 },
        { id: 2, nama: "Enerpro Zenith", kategori: "Marathon / Race", harga: 699000 }
    ];

    function renderTabel() {
        const tbody = document.getElementById("data-katalog");
        tbody.innerHTML = "";
        
        dummyData.forEach((item, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td><strong>${item.nama}</strong></td>
                    <td>${item.kategori}</td>
                    <td>Rp ${item.harga.toLocaleString('id-ID')}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editData(${item.id})"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-hapus" onclick="hapusData(${item.id})"><i class="fas fa-trash"></i> Hapus</button>
                    </td>
                </tr>
            `;
        });
    }

    // CREATE & UPDATE: Submit form
    formProduk.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("produk-id").value;
        const nama = document.getElementById("nama-produk").value;
        const kategori = document.getElementById("kategori-produk").value;
        const harga = parseInt(document.getElementById("harga-produk").value);

        if (id) {
            // Proses Update (Edit)
            const index = dummyData.findIndex(item => item.id == id);
            dummyData[index] = { id: parseInt(id), nama, kategori, harga };
            alert("Produk berhasil diperbarui!");
        } else {
            // Proses Create (Tambah Baru)
            const newId = dummyData.length > 0 ? dummyData[dummyData.length - 1].id + 1 : 1;
            dummyData.push({ id: newId, nama, kategori, harga });
            alert("Produk baru berhasil ditambahkan!");
        }

        modal.classList.remove("active");
        renderTabel();
    });

    // EDIT: Tarik data ke form
    window.editData = (id) => {
        const produk = dummyData.find(item => item.id == id);
        if (produk) {
            document.getElementById("produk-id").value = produk.id;
            document.getElementById("nama-produk").value = produk.nama;
            document.getElementById("kategori-produk").value = produk.kategori;
            document.getElementById("harga-produk").value = produk.harga;
            modalTitle.innerText = "Edit Produk";
            modal.classList.add("active");
        }
    };

    // DELETE: Hapus data
    window.hapusData = (id) => {
        if (confirm("Yakin ingin menghapus produk ini dari katalog?")) {
            dummyData = dummyData.filter(item => item.id !== id);
            renderTabel();
        }
    };

    // Tampilkan tabel saat halaman pertama kali dimuat
    renderTabel();
});