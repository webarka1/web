/* =====================================================
   PROJECTS-DATA.JS — Isi DETAIL LENGKAP tiap proyek (popup yang kebuka pas kartu proyek diklik)
   File ini sengaja dipisah dari script.js biar gampang diedit & gak bercampur sama logika web.
   Tampilan popup-nya sendiri (animasi, layout) diatur di script.js (fungsi openProject) + style.css (.pd-*).

   CARA EDIT:
   - Semua teks tinggal diganti langsung di sini. Field yang gak dipakai boleh dihapus/dikosongin
     (misal "links", "challenges") — bagian itu otomatis gak ditampilin.
   - GAMBAR: taruh file di folder images/ dengan nama PERSIS seperti di "img" dan "gallery".
     Belum ada filenya? Otomatis tampil placeholder (nama file muncul sebagai petunjuk), aman.
   - Teks yang diawali "GANTI" itu data yang cuma kamu yang tahu (durasi, link, dll) — ganti ya.
   - LINK: isi "links" misal [{label:"Lihat Dokumentasi", href:"https://..."}]. Kalau kosong, tombolnya gak muncul.
   ===================================================== */
const projectDetail={
  mikrotik:{tag:"Networking — 2026", title:"MikroTik Configuration", img:"project-1.webp",
    body:"Konfigurasi jaringan dan routing menggunakan router MikroTik untuk kebutuhan lab jaringan sekolah, mencakup pengaturan IP, firewall dasar, dan manajemen bandwidth antar client.",
    meta:{Peran:"Konfigurasi & Troubleshooting", Durasi:"1 bulan", Tahun:"2026", Status:"Selesai"},
    overview:[
      "Proyek ini berawal dari kebutuhan lab jaringan sekolah: client harus bisa saling terhubung, dapat IP otomatis, dan tetap bisa internetan tanpa satu perangkat pun menghabiskan seluruh bandwidth.",
      "Router MikroTik dipakai sebagai pusat jaringan — mengatur alamat IP, membagikan IP lewat DHCP, meneruskan trafik ke internet lewat NAT, memfilter trafik lewat firewall, dan membatasi bandwidth tiap client."
    ],
    features:["Pengalamatan IP & pembagian segmen jaringan lab","DHCP Server supaya client dapat IP otomatis","NAT (masquerade) untuk akses internet","Firewall dasar untuk mengamankan router dari akses yang tidak perlu","Simple Queue untuk manajemen bandwidth antar client"],
    steps:[
      {t:"Reset & akses awal router", d:"Menyiapkan router dari kondisi bersih, lalu masuk lewat Winbox untuk mulai konfigurasi."},
      {t:"Pengaturan IP Address", d:"Menentukan IP untuk interface WAN dan LAN sesuai rancangan jaringan lab."},
      {t:"DHCP Server & DNS", d:"Membuat pool IP, mengaktifkan DHCP server, dan mengatur DNS agar client langsung bisa browsing."},
      {t:"NAT & Routing", d:"Menambahkan rule masquerade dan default route supaya trafik lab keluar ke internet."},
      {t:"Firewall & Bandwidth", d:"Menyusun rule firewall dasar dan Simple Queue, lalu menguji hasilnya dari beberapa client."}
    ],
    challenges:[
      {q:"Client sudah dapat IP tapi tidak bisa internetan", a:"Dicek bertahap dari gateway, DNS, sampai rule NAT — ternyata rule masquerade belum mengarah ke interface yang benar."},
      {q:"Bandwidth tidak merata antar client", a:"Diatasi dengan Simple Queue agar tiap client mendapat jatah yang adil."}
    ],
    results:["Seluruh client lab terhubung & dapat internet stabil","Bandwidth terbagi lebih merata","Dokumentasi konfigurasi bisa dipakai ulang untuk praktik berikutnya"],
    learned:["Alur kerja jaringan dari IP, DHCP, NAT sampai firewall","Cara troubleshooting jaringan secara berurutan","Dasar-dasar persiapan sertifikasi MikroTik (MTCNA)"],
    tools:["MikroTik","Winbox","Routing","Firewall","Bandwidth Management"],
    links:[]},
  website:{tag:"Web Development — 2026", title:"Website Project", img:"project-2.webp",
    body:"Membangun website responsif dari nol menggunakan HTML, CSS, dan JavaScript murni — termasuk portfolio ini sendiri, lengkap dengan animasi scroll dan komponen interaktif.",
    meta:{Peran:"Desain & Pengembangan", Durasi:"3 Minggu", Tahun:"2026", Status:"Terus dikembangkan"},
    overview:[
      "Website ini dibangun tanpa framework — hanya HTML untuk struktur, CSS untuk tampilan, dan JavaScript untuk interaksi — supaya setiap bagian benar-benar dipahami cara kerjanya.",
      "Fokusnya: tampilan yang nyaman di HP maupun laptop, animasi yang halus, dan konten yang gampang diedit tanpa harus membongkar kode."
    ],
    features:["Layout responsif (HP, tablet, laptop)","Mode terang/gelap dan pilihan tema warna","Animasi scroll, efek 3D, dan pemutar musik tema","Popup detail untuk tiap konten","Pengaturan tampilan yang tersimpan di browser"],
    steps:[
      {t:"Rancangan & struktur", d:"Menentukan section, alur halaman, dan palet warna sebelum menulis kode."},
      {t:"HTML & CSS", d:"Menyusun markup semantik dan styling dengan variabel warna agar tema mudah diganti."},
      {t:"Interaksi JavaScript", d:"Menambahkan menu, carousel, popup, animasi scroll, dan pengaturan tampilan."},
      {t:"Uji & optimasi", d:"Menguji di berbagai ukuran layar dan merapikan performa."}
    ],
    challenges:[
      {q:"Animasi terasa berat di perangkat low-end", a:"Mengurangi efek yang mahal dan menjeda animasi di bagian yang tidak terlihat."},
      {q:"Efek 3D tidak jalan di layar sentuh", a:"Menambahkan dukungan sentuhan (touch/pointer) selain hover mouse."}
    ],
    results:["Website portfolio yang responsif dan interaktif","Kode terorganisir, mudah diedit lewat komentar panduan","Pengalaman nyata membangun website dari nol"],
    learned:["Struktur HTML semantik & CSS modern","Event, DOM, dan animasi di JavaScript","Optimasi performa web"],
    tools:["HTML","CSS","JavaScript"],
    links:[]},
  arduino:{tag:"Hardware — 2026", title:"Arduino Ultrasonic Sensor", img:"project-3.webp",
    body:"Proyek sensor jarak berbasis Arduino yang membaca jarak objek menggunakan sensor ultrasonik HC-SR04, lalu menampilkan hasilnya secara real-time.",
    meta:{Peran:"Perakitan & Pemrograman", Durasi:"1 Hari", Tahun:"2026", Status:"Selesai"},
    overview:[
      "Sensor ultrasonik HC-SR04 memancarkan gelombang suara dan menghitung waktu pantulannya untuk mengetahui jarak sebuah objek.",
      "Arduino membaca data tersebut, mengubahnya menjadi jarak (cm), lalu menampilkannya secara real-time sehingga perubahan jarak langsung terlihat."
    ],
    features:["Pengukuran jarak objek secara real-time","Rangkaian sederhana dan mudah dikembangkan","Program Arduino (C++) yang rapi dan dikomentari","Bisa dikembangkan jadi alarm jarak atau sensor parkir"],
    steps:[
      {t:"Merakit rangkaian", d:"Menghubungkan pin VCC, GND, Trig, dan Echo sensor ke Arduino."},
      {t:"Menulis program", d:"Mengirim sinyal trigger, membaca durasi echo, lalu menghitung jarak."},
      {t:"Menampilkan hasil", d:"Menampilkan nilai jarak secara real-time dan memeriksa ketelitiannya."},
      {t:"Kalibrasi & uji", d:"Membandingkan hasil sensor dengan pengukuran penggaris pada beberapa jarak."}
    ],
    challenges:[
      {q:"Pembacaan jarak sering loncat-loncat", a:"Ditambah pembacaan berulang dan perataan nilai supaya hasil lebih stabil."}
    ],
    results:["Sensor berhasil membaca jarak dengan cukup akurat","Pemahaman dasar tentang sensor, pin digital, dan pemrograman Arduino"],
    learned:["Cara kerja sensor ultrasonik","Dasar pemrograman Arduino (C++)","Merangkai komponen elektronik dengan benar"],
    tools:["Arduino","HC-SR04","C++","Breadboard"],
    links:[]},
  editing:{tag:"Creative — 2026", title:"Creative Editing Project", img:"project-4.webp",
    body:"Proyek editing video kreatif menggunakan Premiere Pro, After Effects, dan Alight Motion — mulai dari cutting, color grading, sampai motion graphics sederhana.",
    meta:{Peran:"Editor Video", Durasi:"6 Bulan", Tahun:"2026", Status:"Berjalan"},
    overview:[
      "Proyek editing ini mengolah footage mentah menjadi video yang rapi dan enak ditonton — dari memotong klip, mengatur ritme, sampai menambah efek dan teks bergerak.",
      "Alat yang dipakai disesuaikan kebutuhan: Premiere Pro untuk susunan utama, After Effects untuk motion graphics, dan Alight Motion untuk konten singkat dari HP."
    ],
    features:["Cutting & penyusunan timeline","Color grading agar warna konsisten","Motion graphics dan animasi teks","Mixing audio dan musik latar","Konten pendek (Shorts) dari HP"],
    steps:[
      {t:"Kumpulkan & pilih footage", d:"Memilah klip terbaik dan menentukan alur cerita video."},
      {t:"Rough cut", d:"Menyusun urutan klip dan memotong bagian yang tidak perlu."},
      {t:"Efek & motion graphics", d:"Menambah transisi, teks bergerak, dan efek visual."},
      {t:"Color & audio", d:"Menyamakan warna dan menyeimbangkan suara."},
      {t:"Export & publish", d:"Mengekspor dengan pengaturan yang pas lalu mengunggah ke channel."}
    ],
    challenges:[
      {q:"Hasil export terlalu besar / berat", a:"Menyesuaikan bitrate dan resolusi sesuai platform tujuan."}
    ],
    results:["Beberapa video dan konten pendek sudah dipublikasikan","Gaya editing yang makin konsisten"],
    learned:["Ritme dan alur penyuntingan video","Dasar motion graphics","Alur kerja produksi konten dari awal sampai publish"],
    tools:["Premiere Pro","After Effects","Alight Motion"],
    links:[]},
  // SLOT PROYEK BARU — GANTI tag, title, img (taruh file di images/project-5.webp), body, dan tags
  project5:{tag:"VirtualBox - 2026", title:"Usage of Linux", img:"project-5.webp",
    body:"Penggunaan Linux dan VirtualBox yang lumayan mahir.",
    meta:{Peran:"Pengguna & Administrator", Durasi:"1 Tahun", Tahun:"2026", Status:"Berjalan"},
    overview:[
      "Linux dipakai lewat VirtualBox sehingga bisa bereksperimen dengan aman tanpa mengganggu sistem utama — instal, utak-atik, dan ulangi dari awal kapan pun dibutuhkan.",
      "Dari sini terbiasa bekerja lewat terminal, mengelola paket, user, dan layanan dasar yang juga berguna untuk dunia jaringan dan server."
    ],
    features:["Instalasi distro Linux di VirtualBox","Mode jaringan VM (NAT, Bridged, Host-only)","Perintah dasar terminal & manajemen file","Manajemen user, hak akses, dan paket","Snapshot untuk eksperimen tanpa takut rusak"],
    steps:[
      {t:"Menyiapkan VirtualBox", d:"Membuat mesin virtual dengan RAM, storage, dan jaringan yang sesuai."},
      {t:"Instalasi Linux", d:"Menginstal distro, partisi, dan pengaturan awal sistem."},
      {t:"Belajar terminal", d:"Navigasi file, edit konfigurasi, hak akses, dan instal paket."},
      {t:"Jaringan antar VM", d:"Mencoba mode jaringan yang berbeda dan menguji koneksi antar VM."}
    ],
    challenges:[
      {q:"VM tidak bisa terhubung ke internet / VM lain", a:"Memahami perbedaan mode jaringan VirtualBox dan memilih mode yang tepat."}
    ],
    results:["Nyaman memakai Linux lewat terminal","Punya lab virtual pribadi untuk latihan"],
    learned:["Konsep virtualisasi","Dasar administrasi Linux","Jaringan pada mesin virtual"],
    tools:["VirtualBox","Linux","Terminal","Debian/Ubuntu"],
    links:[]},
  // SLOT PROYEK BARU — GANTI tag, title, img (taruh file di images/project-6.webp), body, dan tags
  project6:{tag:"Kategori — Tahun", title:"Usage and Making Of Computers", img:"project-6.webp",
    body:"Penggunaaan dan pembuatan Komputer yang mahir.",
    meta:{Peran:"Perakit & Teknisi", Durasi:"3 Tahun", Tahun:"2026", Status:"Selesai"},
    overview:[
      "Proyek ini mencakup merakit komputer dari komponen dasar, memasang sistem operasi, dan merawat serta memperbaikinya saat bermasalah.",
      "Memahami hardware dari dalam membuat troubleshooting jauh lebih cepat — tahu mana yang rusak, mana yang cuma salah setting."
    ],
    features:["Perakitan PC dari komponen (CPU, RAM, storage, PSU, dll)","Instalasi sistem operasi & driver","Pengaturan BIOS/UEFI dasar","Pemeliharaan rutin dan pembersihan","Troubleshooting masalah umum hardware & software"],
    steps:[
      {t:"Persiapan komponen", d:"Mengecek kompatibilitas komponen dan menyiapkan alat."},
      {t:"Merakit", d:"Memasang prosesor, RAM, storage, dan power supply dengan benar."},
      {t:"Instalasi sistem", d:"Mengatur BIOS, menginstal OS, driver, dan aplikasi dasar."},
      {t:"Uji & perawatan", d:"Menguji kestabilan dan merapikan kabel serta aliran udara."}
    ],
    challenges:[
      {q:"Komputer tidak mau menyala / tidak ada tampilan", a:"Diperiksa bertahap dari kabel daya, RAM, sampai konektor monitor."}
    ],
    results:["Komputer berhasil dirakit dan berjalan stabil","Mampu mendiagnosis masalah hardware umum"],
    learned:["Fungsi tiap komponen komputer","Cara troubleshooting yang sistematis","Perawatan perangkat agar awet"],
    tools:["PC Hardware","BIOS/UEFI","Windows/Linux","Troubleshooting"],
    links:[]}
};
