document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DARK MODE TOGGLE ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.documentElement;
    const icon = themeBtn.querySelector('i');

    themeBtn.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            icon.classList.replace('fa-sun', 'fa-moon');
        } else {
            body.setAttribute('data-theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    });

    // --- 2. DRAWER FILTER LOGIC (BUKA & TUTUP) ---
    const filterSidebar = document.getElementById('filter-sidebar');
    const filterBackdrop = document.getElementById('filter-backdrop');
    
    // Ambil dua pemicu buka (Ikon di header & Tombol di dekat katalog)
    const openHeaderFilterBtn = document.getElementById('header-filter-toggle');
    const openInlineFilterBtn = document.getElementById('inline-filter-btn');
    const closeFilterBtn = document.getElementById('close-filter');

    // Fungsi buka filter
    function openFilter() {
        filterSidebar.classList.add('open');
        filterBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden'; // Kunci scroll halaman agar tidak goyang
    }

    // Fungsi tutup filter
    function closeFilter() {
        filterSidebar.classList.remove('open');
        filterBackdrop.classList.remove('active');
        document.body.style.overflow = ''; // Mengembalikan scroll halaman
    }

    // Listener Event
    if (openHeaderFilterBtn) openHeaderFilterBtn.addEventListener('click', openFilter);
    if (openInlineFilterBtn) openInlineFilterBtn.addEventListener('click', openFilter);
    if (closeFilterBtn) closeFilterBtn.addEventListener('click', closeFilter);
    if (filterBackdrop) filterBackdrop.addEventListener('click', closeFilter);


    // --- 3. MOBILE HAMBURGER MENU ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    menuToggle.addEventListener('click', () => {
        if (navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.width = '100%';
            navMenu.style.backgroundColor = 'var(--bg-color)';
            navMenu.style.padding = '1rem';
            navMenu.style.borderBottom = '1px solid var(--border-color)';
        }
    });

    // Menangani perubahan ukuran layar (Resize) agar Nav Menu kembali normal
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            navMenu.removeAttribute('style');
        }
    });
});