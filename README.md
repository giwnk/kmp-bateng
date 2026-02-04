# KMP Bangka Tengah Website

**Sistem Informasi & Statistik Koperasi Merah Putih - Kabupaten Bangka Tengah**

Website ini dikembangkan selama masa magang 3 bulan di **Dinas Komunikasi, Informatika dan Statistik Kabupaten Bangka Tengah**. Proyek ini bertujuan untuk mendigitalisasi data statistik koperasi secara transparan dan menyediakan sistem pelaporan terpadu bagi pengurus koperasi.

---

## ✨ Fitur Utama

### 🌏 Public Access (Open Source Info)

- **Statistik Real-time:** Visualisasi data koperasi se-Kabupaten Bangka Tengah menggunakan Chart.js.
    
- **WebGIS Sebaran:** Peta interaktif lokasi koperasi menggunakan Leaflet.js.
    
- **Informasi KMP:** Profil singkat dan detail tiap koperasi yang terdaftar.
    

### 🏛️ Admin Dinas Role (Super Power)

- **Executive Dashboard:** Monitoring total koperasi, grafik status aktif/nonaktif, dan laporan masuk terbaru.
    
- **Management Core:** Kendali penuh atas data wilayah, database koperasi, dan manajemen user.
    
- **Validation System:** Fitur verifikasi dan validasi laporan bulanan dari setiap koperasi.
    

### 🏢 User Koperasi Role

- **Financial Dashboard:** Ringkasan total anggota, saldo simpanan (wajib/pokok), dan status laporan bulan berjalan.
    
- **Internal Management:** Kelola data anggota, pengurus, dan riwayat transaksi keuangan secara mandiri.
    
- **Digital Reporting:** Input laporan bulanan langsung dari sistem untuk divalidasi oleh dinas.
    

---

## 🛠️ Tech Stack

|**Komponen**|**Teknologi**|
|---|---|
|**Backend**|Laravel (PHP), Node.js (Runtime)|
|**Frontend**|Inertia.js, Tailwind CSS|
|**Database**|MySQL|
|**Maps & Charts**|Leaflet.js, Chart.js|
|**Icons & Tools**|Lucide Dev Icons, VS Code, Laragon|

---

## ⚙️ Installation Guide

_Buat kamu yang bingung di poin 4, ini adalah cara standar buat jalanin project Laravel + Inertia. Kamu bisa copas ini:_

1. **Clone the Repository**
    
    Bash
    
    ```
    git clone https://github.com/username/kmp-bangka-tengah.git
    cd kmp-bangka-tengah
    ```
    
2. **Install PHP Dependencies**
    
    Bash
    
    ```
    composer install
    ```
    
3. **Install JavaScript Dependencies**
    
    Bash
    
    ```
    npm install
    ```
    
4. **Environment Setup**
    
    - Salin file `.env.example` menjadi `.env`.
        
    - Konfigurasi koneksi database MySQL kamu di dalam file `.env`.
        
    - Jalankan perintah: `php artisan key:generate`.
        
5. **Database Migration & Seed**
    
    Bash
    
    ```
    php artisan migrate --seed
    ```
    
6. **Compile Assets & Run**
    
    - Terminal 1: `npm run dev`
        
    - Terminal 2: `php artisan serve`
        

---

## 📸 Interface Preview

_Visualisasi dari KMP Bangka Tengah Website:_

|**Landing Page & WebGIS**|**Admin Dashboard**|**User Portal**|
|---|---|---|
||||
