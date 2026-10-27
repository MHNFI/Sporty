// SISTEM KEAMANAN & LOGOUT
document.addEventListener("DOMContentLoaded", () => {
    // Cek hak akses admin
    const roleUser = localStorage.getItem("roleAkses");
    if (roleUser !== "admin") {
        alert("Akses ditolak! Silakan login sebagai Admin.");
        window.location.href = "../../login.html";
        return;
    }

    // Fitur Logout
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("roleAkses");
            window.location.href = "../../login.html";
        });
    }
});


// CRUD PRODUK KATALOG
const API_PRODUK = 'http://localhost:3000/api/produk';

const tabelProduk = document.getElementById("tabel-produk");

if (tabelProduk) {
    
    // READ: Ambil dan tampilkan data produk ke tabel
    async function muatProduk() {
        try {
            const response = await fetch(API_PRODUK);
            const data = await response.json();
            
            tabelProduk.innerHTML = "";
            
            if (!data || data.length === 0) {
                tabelProduk.innerHTML = `<tr><td colspan="5" style="text-align: center;">Belum ada data produk.</td></tr>`;
                return;
            }

            data.forEach((item, index) => {
                tabelProduk.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${item.nama}</strong></td>
                        <td>${item.stok} Pcs</td>
                        <td>Rp ${Number(item.harga).toLocaleString('id-ID')}</td>
                        <td>
                            <button class="btn btn-edit" onclick="siapkanEditProduk(${item.id}, '${item.nama}', ${item.harga}, ${item.stok})"><i class="fas fa-edit"></i> Edit</button>
                            <button class="btn btn-hapus" onclick="hapusProduk(${item.id})"><i class="fas fa-trash"></i> Hapus</button>
                        </td>
                    </tr>
                `;
            });
        } catch (err) {
            console.error("Gagal memuat data produk:", err);
            tabelProduk.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Gagal mengambil data dari server.</td></tr>`;
        }
    }

    // CREATE & UPDATE: Simpan Baru / Perbarui Data Produk
    const formProduk = document.getElementById("form-produk");
    if (formProduk) {
        formProduk.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const id = document.getElementById("produk-id").value;
            const fileInput = document.getElementById("gambar-produk");
            
            const formData = new FormData();
            formData.append("nama", document.getElementById("nama-produk").value);
            formData.append("harga", document.getElementById("harga-produk").value);
            formData.append("stok", document.getElementById("stok-produk").value);
            
            // Masukkan gambar ke formdata jika user memilih gambar
            if (fileInput.files.length > 0) {
                formData.append("gambar", fileInput.files[0]);
            }

            const url = id ? `${API_PRODUK}/${id}` : API_PRODUK;
            const method = id ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 
                        'x-role-akses': localStorage.getItem('roleAkses')
                    },
                    body: formData
                });
                
                const result = await response.json();
                alert(result.message || result.error);
                
                document.getElementById("modal-produk").classList.remove("active");
                muatProduk();
            } catch (err) {
                console.error("Gagal menyimpan produk:", err);
                alert("Terjadi kesalahan saat menyimpan produk!");
            }
        });
    }

    // GLOBAL EDIT: Isi data lama ke form modal
    window.siapkanEditProduk = (id, nama, harga, stok) => {
        document.getElementById("produk-id").value = id;
        document.getElementById("nama-produk").value = nama;
        document.getElementById("harga-produk").value = harga;
        document.getElementById("stok-produk").value = stok;
        // Kosongkan input file setiap kali modal Edit dibuka
        document.getElementById("gambar-produk").value = ""; 
        
        document.getElementById("modal-title-produk").innerText = "Edit Produk";
        document.getElementById("modal-produk").classList.add("active");
    };

    // GLOBAL DELETE: Hapus Produk dari Database
    window.hapusProduk = async (id) => {
        if (!confirm("Yakin ingin menghapus produk ini dari katalog?")) return;

        try {
            const response = await fetch(`${API_PRODUK}/${id}`, { 
                method: 'DELETE',
                headers: {
                    'x-role-akses': localStorage.getItem('roleAkses')
                }
            });
            const result = await response.json();
            alert(result.message || result.error);
            muatProduk();
        } catch (err) {
            console.error("Gagal menghapus produk:", err);
            alert("Terjadi kesalahan saat menghapus produk!");
        }
    };

    // Kontrol Pop-Up Modal
    const btnTambahProduk = document.getElementById("btn-tambah-produk");
    const btnTutupProduk = document.getElementById("btn-tutup-produk");
    
    if (btnTambahProduk) {
        btnTambahProduk.addEventListener("click", () => {
            formProduk.reset();
            document.getElementById("produk-id").value = "";
            document.getElementById("modal-title-produk").innerText = "Tambah Produk Baru";
            document.getElementById("modal-produk").classList.add("active");
        });
    }

    if (btnTutupProduk) {
        btnTutupProduk.addEventListener("click", () => {
            document.getElementById("modal-produk").classList.remove("active");
        });
    }

    muatProduk();
}


// CRUD DISKON
const API_DISKON = 'http://localhost:3000/api/diskon';

const tabelDiskon = document.getElementById("tabel-diskon");

// Pengecekan agar fungsi hanya berjalan di halaman kelola_diskon.html
if (tabelDiskon) {

    // READ: Ambil dan tampilkan data diskon ke tabel
    async function muatDiskon() {
        try {
            const response = await fetch(API_DISKON);
            const result = await response.json();

            tabelDiskon.innerHTML = "";

            if (!result.data || result.data.length === 0) {
                tabelDiskon.innerHTML = `<tr><td colspan="6" style="text-align: center;">Belum ada promo diskon yang aktif.</td></tr>`;
                return;
            }

            result.data.forEach((item, index) => {
                const hargaPotongan = item.harga_asli - (item.harga_asli * (item.persen_diskon / 100));
                tabelDiskon.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${item.nama_produk}</strong></td>
                        <td>Rp ${Number(item.harga_asli).toLocaleString('id-ID')}</td>
                        <td><span style="background:#ffe4e6; color:#e11d48; padding:3px 8px; border-radius:4px; font-weight:bold;">${item.persen_diskon}%</span></td>
                        <td style="color:#0d9488; font-weight:bold;">Rp ${Number(hargaPotongan).toLocaleString('id-ID')}</td>
                        <td>
                            <button class="btn btn-edit" onclick="siapkanEditDiskon(${item.id}, ${item.produk_id}, ${item.persen_diskon})"><i class="fas fa-edit"></i> Edit</button>
                            <button class="btn btn-hapus" onclick="hapusDiskon(${item.id})"><i class="fas fa-trash"></i> Cabut</button>
                        </td>
                    </tr>
                `;
            });
        } catch (err) {
            console.error("Gagal memuat data diskon:", err);
            tabelDiskon.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Gagal mengambil data diskon dari server.</td></tr>`;
        }
    }

    // AMBIL DATA PRODUK UNTUK DROPDOWN SELECT
    async function muatDropdownProduk() {
        try {
            const response = await fetch(API_PRODUK);
            const produk = await response.json();
            const select = document.getElementById("select-produk-diskon");
            
            if (select) {
                select.innerHTML = '<option value="">-- Pilih Produk --</option>';
                produk.forEach(p => {
                    select.innerHTML += `<option value="${p.id}">${p.nama} - Rp ${Number(p.harga).toLocaleString('id-ID')}</option>`;
                });
            }
        } catch (err) {
            console.error("Gagal memuat daftar produk untuk dropdown:", err);
        }
    }

    // CREATE & UPDATE: Simpan / Perbarui Promo Diskon
    const formDiskon = document.getElementById("form-diskon");
    if (formDiskon) {
        formDiskon.addEventListener("submit", async (e) => {
            e.preventDefault();

            const id = document.getElementById("diskon-id").value;
            const produk_id = document.getElementById("select-produk-diskon").value;
            const persen_diskon = parseInt(document.getElementById("persen-diskon").value);

            const url = id ? `${API_DISKON}/${id}` : API_DISKON;
            const method = id ? 'PUT' : 'POST';

            const payload = id ? { persen_diskon } : { produk_id, persen_diskon };

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'x-role-akses': localStorage.getItem('roleAkses')
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                alert(result.message || result.error);

                document.getElementById("modal-diskon").classList.remove("active");
                document.getElementById("select-produk-diskon").disabled = false;
                muatDiskon();
            } catch (err) {
                console.error("Gagal menyimpan diskon:", err);
                alert("Terjadi kesalahan saat menyimpan promo diskon!");
            }
        });
    }

    // GLOBAL EDIT: Isi data diskon ke form modal
    window.siapkanEditDiskon = (id, produkId, persen) => {
        document.getElementById("diskon-id").value = id;
        document.getElementById("select-produk-diskon").value = produkId;
        document.getElementById("select-produk-diskon").disabled = true;
        document.getElementById("modal-title-diskon").innerText = "Edit Persentase Diskon";
        document.getElementById("persen-diskon").value = persen;
        document.getElementById("modal-diskon").classList.add("active");
    };

    // GLOBAL DELETE: Cabut Promo Diskon
    window.hapusDiskon = async (id) => {
        if (!confirm("Yakin ingin mencabut promo diskon dari produk ini?")) return;

        try {
            const response = await fetch(`${API_DISKON}/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-role-akses': localStorage.getItem('roleAkses')
                }
            });

            const result = await response.json();
            alert(result.message || result.error);
            muatDiskon();
        } catch (err) {
            console.error("Gagal menghapus diskon:", err);
            alert("Terjadi kesalahan saat mencabut promo diskon!");
        }
    };

    // Kontrol Pop-Up Modal Form Diskon
    const btnTambahDiskon = document.getElementById("btn-tambah-diskon");
    const btnTutupDiskon = document.getElementById("btn-tutup-diskon");

    if (btnTambahDiskon) {
        btnTambahDiskon.addEventListener("click", () => {
            formDiskon.reset();
            document.getElementById("diskon-id").value = "";
            document.getElementById("select-produk-diskon").disabled = false;
            document.getElementById("modal-title-diskon").innerText = "Pasang Diskon Produk";
            document.getElementById("modal-diskon").classList.add("active");
        });
    }

    if (btnTutupDiskon) {
        btnTutupDiskon.addEventListener("click", () => {
            document.getElementById("modal-diskon").classList.remove("active");
        });
    }

    // Jalankan fungsi saat halaman kelola_diskon.html terbuka
    muatDiskon();
    muatDropdownProduk();
}

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

// FE DISKON
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SISTEM SATPAM ADMIN ---
    const role = localStorage.getItem("roleAkses");
    if (role !== "admin") {
        alert("Akses Ilegal! Anda bukan Admin.");
        window.location.href = "../../login.html"; 
        return;
    }

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("roleAkses");
            window.location.href = "../../login.html";
        });
    }

    // --- 2. FITUR CRD DISKON (Hanya jalan di kelola_diskon.html) ---
    const tabelDiskon = document.getElementById("data-diskon");
    
    if (tabelDiskon) {
        const API_DISKON = 'http://localhost:3000/api/diskon';
        const API_PRODUK = 'http://localhost:3000/api/produk';

        // READ: Ambil data diskon
        async function muatTabelDiskon() {
            try {
                const response = await fetch(API_DISKON);
                const result = await response.json();
                tabelDiskon.innerHTML = "";

                if (!result.data || result.data.length === 0) {
                    tabelDiskon.innerHTML = `<tr><td colspan="6" style="text-align: center;">Belum ada diskon aktif.</td></tr>`;
                    return;
                }

                result.data.forEach((item, index) => {
                    const hargaPotongan = item.harga_asli - (item.harga_asli * (item.persen_diskon / 100));
                    tabelDiskon.innerHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td><strong>${item.nama_produk}</strong></td>
                            <td>Rp ${item.harga_asli.toLocaleString('id-ID')}</td>
                            <td><span style="background:#ffe4e6; color:#e11d48; padding:3px 8px; border-radius:4px; font-weight:bold;">${item.persen_diskon}%</span></td>
                            <td style="color:#0d9488; font-weight:bold;">Rp ${hargaPotongan.toLocaleString('id-ID')}</td>
                            <td>
                                <button class="btn btn-hapus" onclick="hapusDiskon(${item.id})"><i class="fas fa-trash"></i> Cabut Promo</button>
                            </td>
                        </tr>
                    `;
                });
            } catch (err) {
                console.error("Gagal memuat diskon:", err);
            }
        }

        // Dropdown Pilihan Sepatu dari DB
        async function muatDropdownProduk() {
            try {
                const response = await fetch(API_PRODUK);
                const result = await response.json();
                const select = document.getElementById("select-produk-diskon");
                select.innerHTML = '<option value="">-- Pilih Produk --</option>';

                result.data.forEach(item => {
                    select.innerHTML += `<option value="${item.id}">${item.nama} - Rp ${item.harga.toLocaleString('id-ID')}</option>`;
                });
            } catch (err) {
                console.error("Gagal memuat daftar produk:", err);
            }
        }

        // CREATE: Pasang Diskon Baru
        const formDiskon = document.getElementById("form-diskon");
        if (formDiskon) {
            formDiskon.addEventListener("submit", async (e) => {
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
                formDiskon.reset();
                document.getElementById("modal-diskon").classList.remove("active");
                muatTabelDiskon();
            });
        }

        // DELETE: Cabut Diskon
        window.hapusDiskon = async (id) => {
            if (!confirm("Yakin ingin mencabut promo diskon ini?")) return;

            const response = await fetch(`${API_DISKON}/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-role-akses': localStorage.getItem('roleAkses')
                }
            });

            const result = await response.json();
            alert(result.message);
            muatTabelDiskon();
        };

        // Event Modal Pop-up
        document.getElementById("btn-tambah-diskon").addEventListener("click", () => {
            document.getElementById("modal-diskon").classList.add("active");
        });
        document.getElementById("btn-tutup-modal-diskon").addEventListener("click", () => {
            document.getElementById("modal-diskon").classList.remove("active");
        });

        // Jalankan pas halaman terbuka
        muatTabelDiskon();
        muatDropdownProduk();
    }
});