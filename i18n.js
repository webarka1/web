/* =====================================================
   I18N.JS — OPSI BAHASA (Indonesia / English) + isi PANDUAN
   File ini dipisah dari script.js (sama kaya projects-data.js) biar gampang diedit.
   CARA KERJA: teks asli di index.html TETAP dibiarkan apa adanya. Saat bahasa diganti, teks yang
   cocok dengan daftar I18N_PAIRS di bawah otomatis diganti ([Indonesia, English]). Teks yang BELUM
   ada di daftar tetap tampil seperti aslinya (aman, gak error).
   CARA TAMBAH TERJEMAHAN: tambahkan baris  ["teks Indonesia","English text"],  ke I18N_PAIRS.
   Teks harus PERSIS sama dengan yang ada di halaman (huruf besar/kecil ngaruh).
   ===================================================== */
const I18N_PAIRS=[
  // --- header & menu ---
  ["Terbuka Kolaborasi","Open to Collab"],["TUTUP ✕","CLOSE ✕"],
  ["BERANDA","HOME"],["TENTANG SAYA","ABOUT ME"],["Profil singkat","Short profile"],["PROYEK","PROJECTS"],["KEAHLIAN","SKILLS"],
  ["PENCAPAIAN","ACHIEVEMENTS"],["RELASI","CONNECTIONS"],["TESTIMONI","TESTIMONIALS"],["Kata mereka","What they say"],["KONTAK","CONTACT"],
  // --- hero & about ---
  ["Siswa, penggemar teknologi, dan pembelajar kreatif yang fokus pada","Student, tech enthusiast, and creative learner focused on"],
  ["pengembangan web","web development"],["hardware komputer","computer hardware"],["Memuat…","Loading…"],
  ["Profil","Profile"],["Fokus pada jaringan, pengembangan web, dan perangkat keras komputer — dengan pencapaian Rank 1 di kelas.","Focused on networking, web development, and computer hardware — with a Rank 1 achievement in class."],
  ["Semester Rank 1","Rank 1 Semesters"],["Riwayat Peringkat","Rank History"],["Proyek Dikerjakan","Projects Completed"],
  ["NAMA","NAME"],["SEKOLAH","SCHOOL"],["KELAS","CLASS"],["PRESTASI","ACHIEVEMENT"],["Rank 1 di kelas","Rank 1 in class"],
  // --- highlights ---
  ["SOROTAN","HIGHLIGHTS"],["Pencapaian","Achievements"],["Relasi","Connections"],["Saran","Suggestions"],["Trofi","Trophies"],["Proyek","Projects"],["Keahlian","Skills"],
  ["Rank 1 di kelas XII TJKT 1.","Rank 1 in class XII TJKT 1."],["Sekolah, kelas, dan relasi profesional.","School, classes, and professional connections."],
  ["Rekomendasi dan target ke depan.","Suggestions and upcoming goals."],["Sertifikat dan penghargaan.","Certificates and awards."],["Proyek networking dan web.","Networking and web projects."],
  ["LIHAT →","VIEW →"],
  // --- projects ---
  ["Karya","Work"],["LIHAT PROYEK","VIEW PROJECT"],["Kategori — Tahun","Category — Year"],
  ["Konfigurasi jaringan dan routing menggunakan MikroTik untuk kebutuhan lab sekolah.","Network configuration and routing with MikroTik for the school lab."],
  ["Membangun website responsif dengan HTML, CSS, dan JavaScript.","Building a responsive website with HTML, CSS, and JavaScript."],
  ["Proyek sensor jarak berbasis Arduino untuk deteksi objek.","An Arduino-based distance sensor project for object detection."],
  ["Proyek editing video dan konten kreatif digital.","Video editing and digital creative content project."],
  ["Penggunaan Linux dan VirtualBox yang lumayan mahir.","Fairly advanced use of Linux and VirtualBox."],
  ["Penggunaaan dan pembuatan Komputer yang mahir.","Skilled use and building of computers."],
  // popup proyek
  ["Tentang Proyek","About the Project"],["Yang Dikerjakan","What Was Done"],["Proses Pengerjaan","Work Process"],["Tantangan & Solusi","Challenges & Solutions"],
  ["Hasil","Results"],["Yang Dipelajari","What I Learned"],["Tools & Teknologi","Tools & Technology"],["Galeri","Gallery"],["Tautan","Links"],
  ["← SEBELUMNYA","← PREVIOUS"],["BERIKUTNYA →","NEXT →"],["Peran","Role"],["Durasi","Duration"],["Tahun","Year"],["Status","Status"],
  ["Selesai","Completed"],["Berjalan","Ongoing"],["Terus dikembangkan","Continuously developed"],
  // --- skills & media ---
  ["Kemampuan","Abilities"],["Konten","Content"],["Karya Editing & Konten","Editing Works & Content"],["Karya editing & konten","Editing works & content"],["Gaya Tampilan","Display Style"],["Gaya Barebone (polos & minimalis)","Barebone Style (plain & minimal)"],["Menyembunyikan dekorasi dan efek (partikel, aurora, blur, badge, penanda posisi, animasi) supaya tampilan lebih bersih dan ringan. Konten dan fitur tetap sama. Bisa dimatikan kapan saja.","Hides decorations and effects (particles, aurora, blur, badges, position marker, animations) for a cleaner, lighter look. Content and features stay the same. Can be turned off anytime."],["GANTI deskripsi Media Creation di sini.","REPLACE the Media Creation description here."],["Video Pilihan","Featured Video"],["Video Terbaru","Latest Videos"],["Kunjungi Channel","Visit Channel"],
  ["Video Pilihan — anomalitoetttoett","Featured Video — anomalitoetttoett"],
  ["2 bulan lalu","2 months ago"],["1 bulan lalu","1 month ago"],["3 bulan lalu","3 months ago"],["3 minggu lalu","3 weeks ago"], ["2 minggu lalu","2 weeks ago"],
  ["19 ditonton","19 views"],["73 ditonton","73 views"],["13 ditonton","13 views"],["2.716 ditonton","2,716 views"],["1.843 ditonton","1,843 views"],["1.743 ditonton","1,743 views"],
  // --- achievements / connections / trophies ---
  ["Periode","Period"],["Peringkat","Rank"],["Total Riwayat","Total History"],["Detail Lengkap","More Details"],
  ["Kelas X – XII","Grade X – XII"],["Kelas 7 – 9","Grade 7 – 9"],["Kelas 1 – 6 (SD)","Grade 1 – 6 (Elementary)"],
  ["Wali Kelas","Homeroom Teacher"],["Guru Produktif","Vocational Teachers"],["Teman Sekelas","Classmates"],
  ["Penghargaan","Awards"],["TROFI","TROPHIES"],["Nilai Sertifikat PKL","Internship (PKL) Score Certificate"],["Sertifikat S2C Juara 1","S2C 1st Place Certificate"],
  ["Sertifikat Juara 1 kelas 11","Grade 11 1st Place Certificate"],["Sertifikat Juara 1 kelas 10","Grade 10 1st Place Certificate"],["Surat Juara 1","1st Place Letter"],
  ["Kata Mereka","What They Say"],
  // --- contact & footer ---
  ["Hubungi","Get in touch"],
  ["XII TJKT 1, SMKS Binong Permai. Terbuka untuk kolaborasi proyek jaringan, web development, maupun editing kreatif.","XII TJKT 1, SMKS Binong Permai. Open to collaboration on networking projects, web development, and creative editing."],
  ["WA Bisnis — 0812-8045-8402","Business WA — 0812-8045-8402"],["WA Pribadi — 0851-1910-5268","Personal WA — 0851-1910-5268"],
  // --- settings ---
  ["Pengaturan Tampilan","Display Settings"],["Mode Tampilan","Display Mode"],["☀ Terang","☀ Light"],["● Gelap","● Dark"],["◐ Otomatis","◐ Auto"],
  ["Otomatis = ikut setting terang/gelap HP atau laptop kamu.","Auto = follows your phone or laptop's light/dark setting."],
  ["Tema Warna","Color Theme"],["Warna Dasar","Base Color"],["Warna Aksen","Accent Color"],["Reset ke Biru (Default)","Reset to Blue (Default)"],
  ["Efek Interaktif","Interactive Effects"],["Foto 3D ikut gerakan kursor","3D photo follows the cursor"],
  ["Kalau dimatikan, foto di Hero tetap tampil tapi diam — gak ikut gerakan mouse. Website tetap normal seperti biasa.","If turned off, the Hero photo stays visible but still — it won't follow the mouse. The website works as usual."],
  ["Animasi","Animation"],["Aktifkan Seluruh Animasi UI","Enable all UI animations"],
  ["Kalau dimatikan, semua efek gerak (muncul pas scroll, vignette, shimmer judul, dll) langsung tampil diam di tempat tanpa animasi — web tetap jalan normal, cuma lebih \"kaku\" dan ringan.","If turned off, all motion effects (scroll reveals, vignette, title shimmer, etc.) show instantly without animation — the site still works, just stiffer and lighter."],
  ["Performa","Performance"],["Mode Ringan (HP / laptop low-end)","Lite Mode (phones / low-end laptops)"],
  ["Mengurangi efek yang paling berat (partikel global, blur, zoom background) tanpa mengubah tampilan utama. Otomatis nyala di perangkat yang terdeteksi lemah/ngelag — bisa kamu matikan di sini.","Reduces the heaviest effects (global particles, blur, background zoom) without changing the main look. Turns on automatically on devices detected as weak/laggy — you can turn it off here."],
  ["Putar otomatis Video Pilihan","Autoplay Featured Videos"],
  ["Kalau dimatikan, video di section Media Creation gak jalan sendiri — tinggal tekan play. Kalau nyala, video hanya diputar saat terlihat di layar (hemat baterai & kuota).","If turned off, videos in the Media Creation section won't start by themselves — just press play. If on, videos only play while visible on screen (saves battery & data)."],
  ["Mulai Mode Presentasi","Start Presentation Mode"],
  ["Menyembunyikan semua tombol & navigasi supaya tampilan bersih dan layar penuh — cocok buat proyektor. Keluar dengan tombol Esc, atau tombol kecil yang muncul di atas layar.","Hides all buttons & navigation for a clean full-screen view — great for projectors. Exit with Esc, or the small button that appears at the top."],
  ["✕ Keluar Mode Presentasi","✕ Exit Presentation Mode"],["Mode Presentasi aktif — tekan Esc untuk keluar","Presentation Mode is on — press Esc to exit"],
  // --- BARU: bahasa, panduan, welcome, form saran, slider ---
  ["Lihat Proyek","View Projects"],["Hubungi Saya","Contact Me"],
  ["1 bulan","1 month"],["3 Minggu","3 Weeks"],["1 Hari","1 Day"],["6 Bulan","6 Months"],["1 Tahun","1 Year"],["3 Tahun","3 Years"],
  ["Konfigurasi & Troubleshooting","Configuration & Troubleshooting"],["Desain & Pengembangan","Design & Development"],["Perakitan & Pemrograman","Assembly & Programming"],
  ["Editor Video","Video Editor"],["Pengguna & Administrator","User & Administrator"],["Perakit & Teknisi","Assembler & Technician"],
  ["Mulai Tur Singkat","Start Quick Tour"],["Lewati","Skip"],["Lanjut →","Next →"],["Selesai ✓","Done ✓"],
  ["Bahasa","Language"],["Pilihan bahasa tersimpan otomatis.","Your language choice is saved automatically."],
  ["Panduan & Bantuan","Guide & Help"],["Buka Panduan","Open Guide"],["Tampilkan Panduan Awal Lagi","Show the Welcome Setup Again"],
  ["Berisi cara mematikan musik, animasi, mode ringan, dan penjelasan semua fitur web.","Includes how to turn off music, animations, lite mode, and an explanation of every feature."],
  ["Selamat datang","Welcome"],["Atur dulu biar web nyaman dipakai di perangkatmu. Pilihan ini tersimpan otomatis dan bisa diubah kapan saja.","Set things up so the site feels smooth on your device. Your choices are saved automatically and can be changed anytime."],
  ["Normal","Normal"],["Semua efek & animasi aktif. Cocok untuk laptop / HP yang kencang.","All effects & animations on. Best for fast laptops / phones."],
  ["Ringan","Lite"],["Kurangi efek berat. Disarankan kalau HP agak ngelag.","Reduces heavy effects. Recommended if your phone lags a bit."],
  ["Sangat Ringan","Ultra Lite"],["Tanpa animasi sama sekali. Paling mulus untuk perangkat lawas.","No animations at all. Smoothest for older devices."],
  ["Mulai Jelajahi","Start Exploring"],["Butuh bantuan? Tekan tombol ? di pojok atas kapan saja.","Need help? Press the ? button at the top anytime."],
  ["Kirim Saran & Masukan","Send Suggestions & Feedback"],["Isi form di bawah, lalu pesanmu dikirim lewat WhatsApp ke aku.","Fill in the form below and your message will be sent to me via WhatsApp."],
  ["Nama (opsional)","Name (optional)"],["Kelas / Asal (opsional)","Class / From (optional)"],["Jenis masukan","Type of feedback"],["Kekurangan","Shortcomings"],["Tambahan","Additions"],
  ["Pesan","Message"],["Rating","Rating"],["Kirim via WhatsApp","Send via WhatsApp"],
  ["Kamu akan diarahkan ke WhatsApp. Pesan baru terkirim setelah kamu menekan kirim di sana.","You'll be taken to WhatsApp. The message is only sent once you press send there."],
  ["Pesan belum diisi.","Please write a message."],["Rating belum dipilih.","Please choose a rating."],
  ["Geser untuk melihat kartu","Slide to browse the cards"],["Ganti bahasa","Change language"],["Panduan","Guide"],["Mode presentasi","Presentation mode"],
  // --- aria / title ---
  ["Buka menu","Open menu"],["Tutup","Close"],["Pengaturan tampilan","Display settings"],["Kembali ke atas","Back to top"],["Lagu berikutnya","Next song"],["Lagu sebelumnya","Previous song"],
  ["Suka lagu ini","Like this song"],["Posisi lagu","Song position"],["Posisi baca","Reading position"],["Sebelumnya","Previous"],["Berikutnya","Next"],["Scroll ke bawah","Scroll down"],
  ["Waktu lokal","Local time"],["Ganti cepat warna tema","Quick theme colors"],["Biru","Blue"],["Biru (Default)","Blue (Default)"],["Hijau Hutan","Forest Green"],["Ungu Malam","Night Violet"]
];
// Pola umum (dipakai saat bahasa English) untuk teks yang ada angka/variabelnya
const I18N_RX=[
  [/\bKelas (\d+|[IVX]+)\b/g,'Grade $1'],
  [/^Berikut tools utama yang dipakai untuk bidang (.+), lengkap dengan fungsinya masing-masing\.$/,'Main tools used for $1, along with what each one does.']
];

/* ---------- TAMBAHAN TERJEMAHAN (batch bahasa) — [Indonesia, English]. Teks harus PERSIS sama dengan yang tampil di halaman. ---------- */
I18N_PAIRS.push(
  // sapaan menu & penanda posisi
  ["Selamat pagi ·","Good morning ·"],["Selamat siang ·","Good afternoon ·"],["Selamat sore ·","Good evening ·"],["Selamat malam ·","Good night ·"],
  ["Beranda","Home"],["Tentang","About"],["Sorotan","Highlights"],["Testimoni","Testimonials"],["Kontak","Contact"],
  // istilah bidang (tampil di marquee, About, Skills, hero)
  ["Jaringan","Networking"],["JARINGAN","NETWORKING"],["jaringan","networking"],
  ["Pengembangan Web","Web Development"],["PENGEMBANGAN WEB","WEB DEVELOPMENT"],
  ["Hardware Komputer","Computer Hardware"],["Hardware PC","PC Hardware"],["HARDWARE PC","PC HARDWARE"],
  ["Editing Kreatif","Creative Editing"],["EDITING KREATIF","CREATIVE EDITING"],["editing kreatif","creative editing"],["KREATIF","CREATIVE"],
  ["Proyek Digital Kreatif","Creative Digital Projects"],["Musik Tema","Theme Music"],["Pemutar Musik Tema","Theme Music Player"],
  ["MikroTik / Konfigurasi Jaringan","MikroTik / Network Configuration"],["Hardware PC / Pemecahan Masalah","PC Hardware / Troubleshooting"],["Editing Video / After Effects","Video Editing / After Effects"],
  // judul & kategori proyek
  ["Konfigurasi MikroTik","MikroTik Configuration"],["Proyek Website","Website Project"],["Sensor Ultrasonik Arduino","Arduino Ultrasonic Sensor"],
  ["Proyek Editing Kreatif","Creative Editing Project"],["Penggunaan Linux","Usage of Linux"],["Penggunaan dan Pembuatan Komputer","Usage and Making Of Computers"],
  ["Jaringan — 2026","Networking — 2026"],["Pengembangan Web — 2026","Web Development — 2026"],["Kreatif — 2026","Creative — 2026"],
  ["Warna & audio","Color & audio"],["Potongan kasar","Rough cut"],["Ekspor & unggah","Export & publish"],["Konfigurasi Jaringan","Network Config"],
  // Media Creation
  ["Portofolio ini menampilkan berbagai karya editing saya, mulai dari editan UFC hingga konten edukatif dan media digital. Meskipun memiliki topik yang berbeda, setiap karya menunjukkan kemampuan saya dalam mengolah visual, storytelling, transisi, dan penyampaian pesan secara menarik.","This portfolio showcases my editing works, from UFC edits to educational content and digital media. Although the topics differ, each piece shows my ability to work with visuals, storytelling, transitions, and delivering a message in an engaging way."],
  ["Portofolio ini menampilkan berbagai karya editing saya! Bukan hanya satu tipe konten.","This portfolio showcases my various editing works! Not just one type of content."],
  ["Video featured di channel ano.cc21.","Featured video on the ano.cc21 channel."],
  ["Video kesukaan karena merupakan video favorit yang pernah dibuat selama editing, dan merupakan featured videos dari channel ano.cc21.","A personal favorite, as it is the best video I have made while editing, and it is the featured video of the ano.cc21 channel."],
  ["Cara mengkonfigurasi minisipserver dengan sipnetic dan portsip agar dapat berkomunikasi","How to configure a mini SIP server with Sipnetic and PortSIP so they can communicate"],
  ["Cara konfigurasi PBX Admin, Mizu VOIP, 3CX Phone dan SIP Phone dan PortSIP","How to configure PBX Admin, Mizu VOIP, 3CX Phone, SIP Phone, and PortSIP"],
  ["70 subscriber","70 subscribers"],["55 subscriber","55 subscribers"],
  ["Saya editor Capcut dan Alight Motion. Saya tidak mencuri editan seperti banyak editor mobile lainnya; semuanya dibuat di dalam aplikasi yang saya pakai..","I'm a Capcut and Alight Motion editor, I don't steal edits unlike many other mobile editors, all are made within the apps I use.."],
  ["GANTI caption singkat video pilihan di sini.","REPLACE this short featured-video caption here."],
  // testimoni
  ["\"Memiliki pemahaman materi yang sangat baik, sikap profesional, dan kepedulian tinggi terhadap sesama. Selalu berfokus pada tugasnya serta sangat andal dalam membagikan pengetahuan kepada rekan-rekannya.\"","\"Has a very good grasp of the material, a professional attitude, and great care for others. Always focused on the task and highly reliable in sharing knowledge with peers.\""],
  ["\"Memiliki penguasaan materi yang seimbang antara teori dan praktik. Selalu proaktif dan terbuka untuk membagikan ilmu serta membantu teman-teman yang membutuhkan.\"","\"Has a balanced command of both theory and practice. Always proactive and open to sharing knowledge and helping friends in need.\""],
  ["\"Interaktif, komunikatif, dan memiliki penyampaian materi yang terstruktur. Sangat dapat diandalkan dalam membantu serta mengedukasi rekan kerjanya..\"","\"Interactive, communicative, and delivers material in a well-structured way. Very dependable in helping and educating teammates..\""],
  ["Teman - 12 TJKT 1","Friend - 12 TJKT 1"],["Teman — 12 TJKT 1","Friend — 12 TJKT 1"],
  // label tombol / aksesibilitas
  ["Warna dasar kustom","Custom base color"],["Warna aksen kustom","Custom accent color"],
  ["Mode Presentasi","Presentation Mode"],["Mode Presentasi (P)","Presentation Mode (P)"],
  // popup detail Highlights
  ["01 — Pencapaian","01 — Achievements"],["02 — Relasi","02 — Connections"],["03 — Saran","03 — Suggestions"],["04 — Trofi","04 — Trophies"],["05 — Proyek","05 — Projects"],["06 — Keahlian","06 — Skills"],
  ["Sekolah & Relasi","School & Connections"],["Rencana Ke Depan","Future Plans"],["Sertifikat & Milestone","Certificates & Milestones"],["Proyek yang Dibangun","Projects Built"],["Kemampuan Utama","Core Skills"],
  ["Meraih peringkat 1 di kelas XII TJKT 1, SMKS Binong Permai, berkat konsistensi belajar dan fokus pada bidang jaringan serta pengembangan web. Pencapaian ini melanjutkan tren peningkatan peringkat sejak semester-semester sebelumnya.","Achieved rank 1 in class XII TJKT 1, SMKS Binong Permai, thanks to consistent study and a focus on networking and web development. This continues an upward ranking trend from previous semesters."],
  ["Lihat riwayat lengkap dari Sekolah Dasar sampai kelas XII — lengkap dengan trofi emas, perak, dan perunggu — di bagian Achievements pada halaman utama.","See the full history from elementary school to grade XII — with gold, silver, and bronze trophies — in the Achievements section on the main page."],
  ["Selama di SMKS Binong Permai, kelas XII TJKT 1 dibimbing oleh wali kelas dan guru produktif TJKT yang mendukung proses belajar di bidang jaringan dan teknologi. Relasi ini terbentuk sejak SD, berlanjut ke SMP, hingga sekarang di bangku SMK.","At SMKS Binong Permai, class XII TJKT 1 is guided by a homeroom teacher and TJKT productive teachers who support learning in networking and technology. These connections began in elementary school, continued through junior high, and now in vocational high school."],
  ["Buka bagian Connections di halaman utama untuk melihat detail wali kelas, guru produktif, dan teman sekelas di tiap jenjang pendidikan.","Open the Connections section on the main page to see details of homeroom teachers, productive teachers, and classmates at each education level."],
  ["Rencana jangka pendek adalah memperdalam networking dan web development lewat proyek nyata, sambil mengejar sertifikasi MikroTik sebagai bekal profesional.","The short-term plan is to deepen networking and web development through real projects, while pursuing MikroTik certification as a professional foundation."],
  ["Mengikuti sertifikasi MikroTik (MTCNA)","Taking the MikroTik certification (MTCNA)"],["Membangun lebih banyak proyek web dan jaringan","Building more web and network projects"],["Mengasah kemampuan creative editing lewat konten YouTube","Sharpening creative editing skills through YouTube content"],
  ["Kumpulan sertifikat, penghargaan, dan milestone akan terus ditambahkan di sini seiring bertambahnya prestasi selama masa sekolah.","Certificates, awards, and milestones will keep being added here as achievements grow throughout school."],
  ["Empat proyek utama merepresentasikan tiga bidang minat: jaringan, pengembangan web, dan hardware — dikerjakan sebagai latihan praktik nyata di luar materi sekolah.","Four main projects represent three areas of interest: networking, web development, and hardware — built as real practice beyond the school curriculum."],
  ["Konfigurasi MikroTik — konfigurasi routing jaringan","MikroTik Configuration — network routing setup"],
  ["Proyek Website — portofolio responsif HTML/CSS/JS","Website Project — responsive HTML/CSS/JS portfolio"],
  ["Sensor Ultrasonik Arduino — deteksi jarak berbasis Arduino","Arduino Ultrasonic Sensor — Arduino-based distance detection"],
  ["Proyek Editing Kreatif — video editing kreatif","Creative Editing Project — creative video editing"],
  ["Empat bidang kemampuan yang terus diasah: web development, networking, hardware, dan creative editing.","Four areas of skill that keep being sharpened: web development, networking, hardware, and creative editing."],
  ["Klik masing-masing baris di bagian Skills pada halaman utama untuk melihat tools yang dipakai di tiap bidang.","Click each row in the Skills section on the main page to see the tools used in each area."],
  // popup Skills
  ["Bahasa dasar untuk menyusun struktur halaman — heading, paragraf, gambar, dan elemen konten lainnya.","The foundational language for structuring a page — headings, paragraphs, images, and other content elements."],
  ["Mengatur tampilan visual: warna, layout, spacing, dan responsivitas di berbagai ukuran layar.","Controls the visual look: colors, layout, spacing, and responsiveness across screen sizes."],
  ["Menambahkan interaktivitas — menu, animasi, dan logika di sisi browser.","Adds interactivity — menus, animations, and logic on the browser side."],
  ["Konfigurasi router, routing, dan manajemen bandwidth untuk jaringan lokal maupun lab sekolah.","Router configuration, routing, and bandwidth management for local networks and the school lab."],
  ["Setup, pengkabelan, dan troubleshooting jaringan dari sisi hardware maupun software.","Setup, cabling, and network troubleshooting on both the hardware and software side."],
  ["Perakitan komputer dari komponen dasar serta pemeliharaan rutin perangkat.","Assembling computers from basic components plus routine device maintenance."],
  ["Mendiagnosa dan memperbaiki masalah umum pada PC dan perangkat jaringan.","Diagnosing and fixing common problems on PCs and network devices."],
  ["Software editing video utama — memotong, menyusun timeline, color grading, dan mixing audio untuk hasil akhir.","The main video editing software — cutting, arranging the timeline, color grading, and audio mixing for the final result."],
  ["Dipakai untuk motion graphics, visual effect, dan animasi teks yang memperkuat video.","Used for motion graphics, visual effects, and text animation that strengthen the video."],
  ["Editor mobile untuk mengedit dan membuat animasi cepat langsung dari HP, cocok untuk konten singkat.","A mobile editor for quick editing and animation straight from the phone, great for short content."],
  // panduan
  ["Relasi, Trofi, Testimoni","Connections, Trophies, Testimonials"]
);

/* ---------- ENGINE (biasanya gak perlu diedit) ---------- */
let _arkaLang=''; try{ _arkaLang=localStorage.getItem('arkaLang')||''; }catch(e){}
if(_arkaLang!=='id' && _arkaLang!=='en') _arkaLang='id'; // DEFAULT selalu Indonesia dulu (web ini untuk orang Indonesia); pengunjung bisa ganti ke English
function L(){ return _arkaLang; }
function T(id,en){ return _arkaLang==='en'?en:id; }
(function initI18n(){
  const norm=s=>s.replace(/\s+/g,' ').trim();
  const ID_MAP=new Map(), EN_MAP=new Map();
  I18N_PAIRS.forEach(p=>{ ID_MAP.set(norm(p[0]),p); EN_MAP.set(norm(p[1]),p); });
  function trStr(orig){
    if(!/[A-Za-z]/.test(orig)) return null;
    const k=norm(orig), p=ID_MAP.get(k)||EN_MAP.get(k);
    let out=null;
    if(p) out=p[_arkaLang==='en'?1:0];
    else if(_arkaLang==='en'){ let o=orig; I18N_RX.forEach(r=>{ o=o.replace(r[0],r[1]); }); if(o!==orig) out=o; }
    if(out===null) return null;
    if(p) return orig.match(/^\s*/)[0]+out+orig.match(/\s*$/)[0];
    return out;
  }
  function procText(n){
    if(!/\S/.test(n.nodeValue)) return;
    const par=n.parentNode; if(!par || par.nodeType!==1 || /^(SCRIPT|STYLE|TEXTAREA)$/.test(par.tagName)) return;
    if(!(n._o!==undefined && n._t===n.nodeValue)) n._o=n.nodeValue;
    const r=trStr(n._o), v=r===null?n._o:r;
    n._t=v; if(n.nodeValue!==v) n.nodeValue=v;
  }
  const ATTRS=['aria-label','title','placeholder'];
  function procAttr(el,a){
    const cur=el.getAttribute(a); if(cur===null) return;
    el._oa=el._oa||{}; el._ta=el._ta||{};
    if(!(el._oa[a]!==undefined && el._ta[a]===cur)) el._oa[a]=cur;
    const r=trStr(el._oa[a]), v=r===null?el._oa[a]:r;
    el._ta[a]=v; if(cur!==v) el.setAttribute(a,v);
  }
  function walk(root){
    if(root.nodeType===3){ procText(root); return; }
    if(root.nodeType!==1) return;
    const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); let n;
    while((n=tw.nextNode())) procText(n);
    const els=root.querySelectorAll('[aria-label],[title],[placeholder]');
    els.forEach(el=>ATTRS.forEach(a=>procAttr(el,a)));
    ATTRS.forEach(a=>{ if(root.hasAttribute(a)) procAttr(root,a); });
  }
  function ui(){
    document.documentElement.lang=_arkaLang;
    const lb=document.getElementById('langBtnLabel'); if(lb) lb.textContent=_arkaLang.toUpperCase();
    document.querySelectorAll('.lang-pick').forEach(b=>b.classList.toggle('active',b.dataset.lang===_arkaLang));
  }
  function setLang(l,save){
    if(l!=='id' && l!=='en') return;
    _arkaLang=l;
    if(save!==false){ try{ localStorage.setItem('arkaLang',l); }catch(e){} }
    walk(document.body); ui();
    document.dispatchEvent(new CustomEvent('arkalang'));
  }
  walk(document.body); ui();
  new MutationObserver(ms=>ms.forEach(m=>{
    if(m.type==='childList') m.addedNodes.forEach(walk);
    else if(m.type==='characterData') procText(m.target);
    else if(m.type==='attributes') procAttr(m.target,m.attributeName);
  })).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:ATTRS});
  document.addEventListener('click',e=>{
    const b=e.target.closest('.lang-pick'); if(b){ setLang(b.dataset.lang); return; }
    if(e.target.closest('#langBtn')) setLang(_arkaLang==='id'?'en':'id');
  });
  window.arkaSetLang=setLang;
  window.arkaAddPairs=function(list){ list.forEach(p=>{ if(!p[0]||!p[1]) return; const q=[p[0],p[1]]; ID_MAP.set(norm(q[0]),q); EN_MAP.set(norm(q[1]),q); }); walk(document.body); };
})();

/* =====================================================
   PANDUAN (muncul di tombol "?" di header). Tiap item: [judul ID, judul EN, isi ID, isi EN]
   Edit/tambah item di sini kalau ada fitur baru.
   ===================================================== */
const GUIDE_DATA=[
  {h:["Mulai dari Sini","Start Here"], items:[
    ["Pertama kali buka web ini?","First time on this site?",
     "Web ini adalah portofolio satu halaman: <b>scroll ke bawah</b> untuk melihat semua bagian (Tentang, Highlights, Projects, Skills, Media Creation, Achievements, Connections, Testimonials, Contact). Tombol ☰ di kiri atas membuka menu loncat cepat. Klik kartu atau baris apa pun untuk membuka detailnya. Tekan <b>Mulai Tur Singkat</b> di atas untuk dipandu langkah demi langkah.",
     "This is a one-page portfolio: <b>scroll down</b> to see every section (About, Highlights, Projects, Skills, Media Creation, Achievements, Connections, Testimonials, Contact). The ☰ button at the top left opens a quick-jump menu. Click any card or row to open its details. Press <b>Start Quick Tour</b> above to be guided step by step."]
  ]},
  {h:["Bantuan Cepat","Quick Help"], items:[
    ["Web terasa ngelag / berat?","Site feels laggy / heavy?",
     "Buka ⚙ Pengaturan → nyalakan <b>Mode Ringan</b>. Kalau masih berat, matikan juga <b>Aktifkan Seluruh Animasi UI</b>. Bisa juga pilih \"Ringan\" atau \"Sangat Ringan\" lewat <b>Panduan Awal</b> (tombol di bagian bawah Pengaturan). Semua pilihan tersimpan otomatis, jadi cukup diatur sekali.",
     "Open ⚙ Settings → turn on <b>Lite Mode</b>. If it's still heavy, also turn off <b>Enable all UI animations</b>. You can also pick \"Lite\" or \"Ultra Lite\" in the <b>Welcome Setup</b> (button at the bottom of Settings). Everything is saved automatically, so you only set it once."],
    ["Cara mematikan musik tema","How to turn off the theme music",
     "Musik tidak menyala sendiri. Kalau sedang main, tekan tombol <b>pause</b> di Theme Music Player (di bawah Hero). Musik juga otomatis berhenti sementara saat Video Pilihan diputar.",
     "The music never starts by itself. If it's playing, press the <b>pause</b> button in the Theme Music Player (below the Hero). It also pauses automatically while a Featured Video plays."],
    ["Cara mematikan video otomatis","How to stop autoplay videos",
     "⚙ Pengaturan → matikan <b>Putar otomatis Video Pilihan</b>. Video baru jalan kalau kamu menekan play.",
     "⚙ Settings → turn off <b>Autoplay Featured Videos</b>. Videos will only play when you press play."],
    ["Cara mematikan efek 3D / animasi","How to turn off 3D / animations",
     "⚙ Pengaturan → matikan <b>Foto 3D ikut gerakan kursor</b> untuk efek 3D, atau <b>Aktifkan Seluruh Animasi UI</b> untuk semua animasi sekaligus.",
     "⚙ Settings → turn off <b>3D photo follows the cursor</b> for the 3D effect, or <b>Enable all UI animations</b> to stop every animation at once."],
    ["Cara ganti bahasa","How to change the language",
     "Tekan tombol <b>ID / EN</b> di header, atau pilih di ⚙ Pengaturan → Bahasa. Teks yang belum punya terjemahan tetap tampil dalam bahasa aslinya.",
     "Press the <b>ID / EN</b> button in the header, or choose it in ⚙ Settings → Language. Text without a translation yet stays in its original language."],
    ["Cara ganti warna & mode gelap","How to change colors & dark mode",
     "⚙ Pengaturan → <b>Mode Tampilan</b> (Terang / Gelap / Otomatis) dan <b>Tema Warna</b>. Warna kustom juga bisa dipilih sendiri.",
     "⚙ Settings → <b>Display Mode</b> (Light / Dark / Auto) and <b>Color Theme</b>. You can also pick custom colors."],
    ["Layar tidak bisa di-scroll / tersangkut?","Screen won't scroll / stuck?",
     "Kemungkinan ada popup yang masih terbuka. Tekan <b>CLOSE ✕</b> di pojok kanan atas, atau tombol <b>Esc</b> di keyboard.",
     "A popup is probably still open. Press <b>CLOSE ✕</b> at the top right, or the <b>Esc</b> key on your keyboard."],
    ["Mau mengembalikan semua pengaturan?","Want to reset all settings?",
     "Tema warna bisa di-reset lewat tombol <b>Reset ke Biru</b>. Untuk menghapus semua pilihan, hapus data situs (site data) di pengaturan browser, lalu muat ulang halaman.",
     "Reset the color theme with the <b>Reset to Blue</b> button. To clear every saved choice, clear the site data in your browser settings, then reload the page."]
  ]},
  {h:["Panduan Semua Fitur","All Features Guide"], items:[
    ["Menu layar penuh (☰)","Fullscreen menu (☰)",
     "Tombol di kiri atas membuka menu ke semua section. Di dalamnya ada pilihan warna cepat dan tautan sosial.",
     "The top-left button opens a menu to every section. It also has quick theme colors and social links."],
    ["Header: jam, bahasa, panduan, presentasi","Header: clock, language, guide, presentation",
     "Jam lokal (WIB) tampil di layar lebar. <b>ID/EN</b> mengganti bahasa, <b>?</b> membuka panduan ini, dan tombol sudut membuka <b>Mode Presentasi</b>.",
     "The local clock (WIB) shows on wide screens. <b>ID/EN</b> switches language, <b>?</b> opens this guide, and the corner icon starts <b>Presentation Mode</b>."],
    ["Penanda posisi baca & progress bar","Reading marker & progress bar",
     "Garis tipis di atas layar menunjukkan seberapa jauh kamu membaca. Di layar lebar ada titik-titik navigasi di sisi kanan; tombol ↑ muncul untuk kembali ke atas.",
     "The thin line at the top shows how far you've read. On wide screens there are navigation dots on the right; the ↑ button appears to jump back to the top."],
    ["Theme Music Player","Theme Music Player",
     "Play/pause, lagu sebelumnya/berikutnya, dan playlist. Klik atau geser di gelombang suara untuk loncat ke bagian lagu. Tombol ♡ menyimpan lagu favorit. Tombol <b>ulang</b> punya 3 mode: ulangi semua lagu → ulangi 1 lagu (ada angka 1) → mati (berhenti di akhir).",
     "Play/pause, previous/next, and a playlist. Click or drag the waveform to jump within a song. The ♡ button saves favorites. The <b>repeat</b> button has 3 modes: repeat all → repeat one song (shows a 1) → off (stops at the end)."],
    ["Highlights (kartu geser)","Highlights (swipe cards)",
     "Geser kartu dengan jari/mouse, panah ← →, atau <b>slider</b> di bawahnya. Klik kartu untuk detail. Di kartu Suggestions ada form untuk mengirim saran, kekurangan, atau tambahan plus rating langsung ke WhatsApp.",
     "Swipe cards with your finger/mouse, the ← → arrows, or the <b>slider</b> below. Click a card for details. The Suggestions card has a form to send suggestions, shortcomings, or additions plus a rating straight to WhatsApp."],
    ["Projects","Projects",
     "Klik kartu proyek untuk membuka halaman detail lengkap (proses, tantangan, hasil, galeri). Di bagian bawah ada tombol Sebelumnya / Berikutnya untuk pindah proyek.",
     "Click a project card to open its full detail page (process, challenges, results, gallery). At the bottom, Previous / Next buttons move between projects."],
    ["Skills","Skills",
     "Klik salah satu baris skill untuk melihat tools yang dipakai beserta fungsinya.",
     "Click any skill row to see the tools used and what each one does."],
    ["Media Creation","Media Creation",
     "Video Pilihan diputar otomatis hanya saat terlihat di layar (bisa dimatikan di Pengaturan). Thumbnail dan tombol Kunjungi Channel membuka YouTube.",
     "Featured videos autoplay only while visible on screen (can be turned off in Settings). Thumbnails and the Visit Channel button open YouTube."],
    ["Achievements","Achievements",
     "Tombol ↑ ↓ atau titik timeline berpindah antar periode peringkat. <b>Detail Lengkap</b> menampilkan analisis periode itu. Piala ikut miring mengikuti kursor/jari.",
     "The ↑ ↓ buttons or timeline dots move between rank periods. <b>More Details</b> shows an analysis of that period. The trophy tilts to follow your cursor/finger."],
    ["Connections, Trophies, Testimonials","Connections, Trophies, Testimonials",
     "Connections: tombol &lt; &gt; berpindah jenjang sekolah. Trophies: kumpulan sertifikat. Testimonials: kata teman & guru.",
     "Connections: the &lt; &gt; buttons switch school levels. Trophies: a collection of certificates. Testimonials: words from friends & teachers."],
    ["Contact","Contact",
     "GitHub, Email, dan WhatsApp membuka tautan masing-masing. Tombol <b>Lihat Proyek</b> dan <b>Hubungi Saya</b> di bagian paling atas membawamu langsung ke Projects dan Contact.",
     "GitHub, Email, and WhatsApp open their links. The <b>View Projects</b> and <b>Contact Me</b> buttons at the very top take you straight to Projects and Contact."],
    ["⚙ Pengaturan","⚙ Settings",
     "Berisi: mode terang/gelap, bahasa, tema warna, efek 3D, animasi, Mode Ringan, autoplay video, Mode Presentasi, dan panduan. Semua pilihan tersimpan otomatis di browser.",
     "Includes: light/dark mode, language, color theme, 3D effect, animation, Lite Mode, video autoplay, Presentation Mode, and the guide. All choices are saved automatically in your browser."],
    ["Pintasan keyboard","Keyboard shortcuts",
     "<b>P</b> = Mode Presentasi · <b>Esc</b> = tutup popup / menu / keluar presentasi · <b>Enter</b> pada kartu = buka detail.",
     "<b>P</b> = Presentation Mode · <b>Esc</b> = close popup / menu / exit presentation · <b>Enter</b> on a card = open details."]
  ]}
];

/* =====================================================
   TERJEMAHAN ENGLISH ISI PROYEK (popup proyek). Bentuknya SAMA dengan projectDetail di projects-data.js
   dan dicocokkan per URUTAN item. PENTING: kalau kamu menambah/menghapus/memindah item di projects-data.js,
   lakukan hal yang sama di sini supaya urutannya tetap sejajar. Proyek yang gak ada di sini tetap tampil Indonesia.
   ===================================================== */
const PROJECT_EN={
  mikrotik:{body:"Network configuration and routing with a MikroTik router for the school network lab, covering IP setup, basic firewall, and bandwidth management between clients.",
    overview:["This project started from the school network lab's needs: clients must be able to talk to each other, get IPs automatically, and still browse the internet without a single device eating all the bandwidth.","The MikroTik router acts as the network hub — assigning IP addresses, handing out IPs via DHCP, forwarding traffic to the internet via NAT, filtering traffic with the firewall, and limiting each client's bandwidth."],
    features:["IP addressing & splitting the lab network into segments","DHCP Server so clients get IPs automatically","NAT (masquerade) for internet access","Basic firewall to protect the router from unnecessary access","Simple Queue for bandwidth management between clients"],
    steps:[{t:"Reset & initial router access",d:"Preparing the router from a clean state, then logging in via Winbox to start configuring."},{t:"IP Address setup",d:"Assigning IPs for the WAN and LAN interfaces according to the lab network design."},{t:"DHCP Server & DNS",d:"Creating an IP pool, enabling the DHCP server, and setting DNS so clients can browse right away."},{t:"NAT & Routing",d:"Adding a masquerade rule and a default route so lab traffic can reach the internet."},{t:"Firewall & Bandwidth",d:"Writing basic firewall rules and a Simple Queue, then testing the result from several clients."}],
    challenges:[{q:"Clients got an IP but couldn't reach the internet",a:"Checked step by step from the gateway and DNS to the NAT rule — the masquerade rule turned out not to point at the right interface."},{q:"Bandwidth was uneven between clients",a:"Solved with a Simple Queue so each client gets a fair share."}],
    results:["All lab clients connected with a stable internet connection","Bandwidth is shared more evenly","The configuration documentation can be reused for future practice"],
    learned:["The network workflow from IP, DHCP, NAT to firewall","How to troubleshoot a network in order","The basics of preparing for MikroTik certification (MTCNA)"]},
  website:{body:"Building a responsive website from scratch with plain HTML, CSS, and JavaScript — including this portfolio itself, complete with scroll animations and interactive components.",
    overview:["This website is built without any framework — only HTML for structure, CSS for looks, and JavaScript for interaction — so every part is truly understood.","The focus: a layout that feels good on phones and laptops, smooth animations, and content that is easy to edit without digging through code."],
    features:["Responsive layout (phone, tablet, laptop)","Light/dark mode and color theme options","Scroll animations, 3D effects, and a theme music player","Detail popups for each piece of content","Display settings saved in the browser"],
    steps:[{t:"Planning & structure",d:"Deciding the sections, page flow, and color palette before writing code."},{t:"HTML & CSS",d:"Writing semantic markup and styling with color variables so themes are easy to swap."},{t:"JavaScript interaction",d:"Adding the menu, carousel, popups, scroll animations, and display settings."},{t:"Testing & optimizing",d:"Testing on different screen sizes and tidying up performance."}],
    challenges:[{q:"Animations felt heavy on low-end devices",a:"Reduced the expensive effects and paused animations in parts that aren't visible."},{q:"The 3D effect didn't work on touch screens",a:"Added touch/pointer support in addition to mouse hover."}],
    results:["A responsive, interactive portfolio website","Organized code that's easy to edit through guide comments","Real experience building a website from scratch"],
    learned:["Semantic HTML structure & modern CSS","Events, the DOM, and animation in JavaScript","Web performance optimization"]},
  arduino:{body:"An Arduino-based distance sensor project that reads an object's distance with an HC-SR04 ultrasonic sensor and shows the result in real time.",
    overview:["The HC-SR04 ultrasonic sensor sends out sound waves and measures the time they take to bounce back to work out an object's distance.","The Arduino reads that data, converts it to a distance (cm), and shows it in real time so any change in distance is visible immediately."],
    features:["Real-time object distance measurement","A simple circuit that's easy to extend","A tidy, commented Arduino (C++) program","Can be extended into a distance alarm or parking sensor"],
    steps:[{t:"Building the circuit",d:"Connecting the sensor's VCC, GND, Trig, and Echo pins to the Arduino."},{t:"Writing the program",d:"Sending the trigger signal, reading the echo duration, then calculating the distance."},{t:"Displaying the result",d:"Showing the distance value in real time and checking its accuracy."},{t:"Calibration & testing",d:"Comparing the sensor's readings with ruler measurements at several distances."}],
    challenges:[{q:"Distance readings kept jumping around",a:"Added repeated readings and value averaging to make the result steadier."}],
    results:["The sensor reads distance with reasonable accuracy","A basic understanding of sensors, digital pins, and Arduino programming"],
    learned:["How an ultrasonic sensor works","Arduino (C++) programming basics","Wiring electronic components correctly"]},
  editing:{body:"A creative video editing project using Premiere Pro, After Effects, and Alight Motion — from cutting and color grading to simple motion graphics.",
    overview:["This editing project turns raw footage into a neat, enjoyable video — from cutting clips and setting the rhythm to adding effects and moving text.","The tools are chosen to fit the need: Premiere Pro for the main timeline, After Effects for motion graphics, and Alight Motion for short content made on a phone."],
    features:["Cutting & arranging the timeline","Color grading for consistent colors","Motion graphics and text animation","Audio mixing and background music","Short-form content (Shorts) from a phone"],
    steps:[{t:"Gather & select footage",d:"Picking the best clips and deciding the video's storyline."},{t:"Rough cut",d:"Arranging the clip order and trimming unneeded parts."},{t:"Effects & motion graphics",d:"Adding transitions, moving text, and visual effects."},{t:"Color & audio",d:"Matching colors and balancing the sound."},{t:"Export & publish",d:"Exporting with the right settings, then uploading to the channel."}],
    challenges:[{q:"The exported file was too large / heavy",a:"Adjusted the bitrate and resolution to suit the target platform."}],
    results:["Several videos and short pieces have been published","An increasingly consistent editing style"],
    learned:["Rhythm and flow in video editing","Motion graphics basics","The content production workflow from start to publish"]},
  project5:{body:"Fairly advanced use of Linux and VirtualBox.",
    overview:["Linux is used through VirtualBox so experiments are safe and don't disturb the main system — install, tinker, and start over whenever needed.","This builds comfort working in the terminal and managing packages, users, and basic services, which also helps in networking and servers."],
    features:["Installing Linux distros in VirtualBox","VM network modes (NAT, Bridged, Host-only)","Basic terminal commands & file management","User, permission, and package management","Snapshots for experimenting without fear of breaking things"],
    steps:[{t:"Setting up VirtualBox",d:"Creating a virtual machine with suitable RAM, storage, and network."},{t:"Installing Linux",d:"Installing the distro, partitioning, and initial system setup."},{t:"Learning the terminal",d:"Navigating files, editing configs, permissions, and installing packages."},{t:"Networking between VMs",d:"Trying different network modes and testing connections between VMs."}],
    challenges:[{q:"The VM couldn't reach the internet / other VMs",a:"Understanding the differences between VirtualBox network modes and choosing the right one."}],
    results:["Comfortable using Linux through the terminal","A personal virtual lab for practice"],
    learned:["Virtualization concepts","Linux administration basics","Networking on virtual machines"]},
  project6:{body:"Skilled use and building of computers.",
    overview:["This project covers assembling a computer from basic components, installing the operating system, and maintaining and repairing it when problems come up.","Understanding hardware from the inside makes troubleshooting much faster — you know what's broken and what's just a wrong setting."],
    features:["Assembling a PC from components (CPU, RAM, storage, PSU, etc.)","Installing the operating system & drivers","Basic BIOS/UEFI setup","Routine maintenance and cleaning","Troubleshooting common hardware & software problems"],
    steps:[{t:"Preparing components",d:"Checking component compatibility and preparing the tools."},{t:"Assembling",d:"Installing the processor, RAM, storage, and power supply correctly."},{t:"System installation",d:"Setting up the BIOS, installing the OS, drivers, and basic apps."},{t:"Testing & maintenance",d:"Testing stability and tidying the cables and airflow."}],
    challenges:[{q:"The computer won't turn on / no display",a:"Checked step by step from the power cable and RAM to the monitor connector."}],
    results:["The computer was assembled and runs stably","Able to diagnose common hardware problems"],
    learned:["The function of each computer component","How to troubleshoot systematically","Caring for devices so they last"]}
};
function registerProjectPairs(){
  if(typeof projectDetail==='undefined' || !window.arkaAddPairs) return;
  const out=[], add=(a,b)=>{ if(typeof a==='string' && typeof b==='string') out.push([a,b]); };
  Object.keys(PROJECT_EN).forEach(k=>{
    const a=projectDetail[k], e=PROJECT_EN[k]; if(!a) return;
    add(a.body,e.body);
    ['overview','features','results','learned'].forEach(f=>(a[f]||[]).forEach((x,i)=>add(x,(e[f]||[])[i])));
    (a.steps||[]).forEach((x,i)=>{ const y=(e.steps||[])[i]||{}; add(x.t,y.t); add(x.d,y.d); });
    (a.challenges||[]).forEach((x,i)=>{ const y=(e.challenges||[])[i]||{}; add(x.q,y.q); add(x.a,y.a); });
  });
  window.arkaAddPairs(out);
}
