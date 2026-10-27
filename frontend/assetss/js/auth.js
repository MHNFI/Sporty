document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");

    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault(); 

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            // --- SIMULASI VERIFIKASI ROLE (Client-Side) ---
            if (username === "admin" && password === "admin123") {
                localStorage.setItem("roleAkses", "admin");
                alert("Berhasil masuk sebagai Admin!");
                
                // Masuk ke direktori admin di dalam folder frontend
                window.location.href = "frontend/admin/dashboard.html";
            } 
            else if (username === "user" && password === "user123") {
                localStorage.setItem("roleAkses", "user");
                alert("Berhasil masuk. Selamat datang, User!");
                
                // Masuk ke direktori user di dalam folder frontend
                window.location.href = "frontend/user/index.html";
            } 
            else {
                alert("Username atau Password salah!");
            }
        });
    }
});