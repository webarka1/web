/* =====================================================
   SCRIPT.JS — Portofolio Arka Arthand Syach
   Berisi: menu hamburger, carousel, popup detail (achievements,
   connections, suggestions, trophies, projects, skills), pager
   Achievements & Connections, dan scroll reveal.
   Data yang paling sering diedit ditandai komentar "EDIT ... DI SINI".
   ===================================================== */
// =====================================
// SCROLL LOCK (BUG FIX KHUSUS HP) — kunci scroll background pas overlay fullscreen kebuka
// =====================================
// Sebelumnya cuma pakai document.body.style.overflow='hidden', yang ternyata gak cukup di Safari
// iOS — halaman di belakang overlay (menu/detail popup) masih bisa ke-scroll/"mantul" pas user
// swipe di HP, keliatan kaya bug/nge-glitch. Fix standar buat iOS: body di-"freeze" di posisi
// scroll saat itu pakai position:fixed, baru dikembaliin persis ke posisi semula pas ditutup.
let _scrollLockY=0, _scrollLockCount=0;
function lockScroll(){
  if(_scrollLockCount===0){
    _scrollLockY=window.scrollY||window.pageYOffset||0;
    document.body.style.position='fixed';
    document.body.style.top=(-_scrollLockY)+'px';
    document.body.style.left='0';
    document.body.style.right='0';
    document.body.style.width='100%';
  }
  _scrollLockCount++;
}
function unlockScroll(){
  _scrollLockCount=Math.max(0,_scrollLockCount-1);
  if(_scrollLockCount===0){
    document.body.style.position='';
    document.body.style.top='';
    document.body.style.left='';
    document.body.style.right='';
    document.body.style.width='';
    window.scrollTo(0,_scrollLockY);
  }
}
// =====================================
// DATA — EDIT KONTEN DETAIL DI SINI
// =====================================
const detailData = {
  achievements:{tag:"01 — Achievements", title:"Rank 1, XII TJKT 1", body:"Meraih peringkat 1 di kelas XII TJKT 1, SMKS Binong Permai, berkat konsistensi belajar dan fokus pada bidang jaringan serta pengembangan web. Pencapaian ini melanjutkan tren peningkatan peringkat sejak semester-semester sebelumnya.", extra:"<p>Lihat riwayat lengkap dari Sekolah Dasar sampai kelas XII — lengkap dengan trofi emas, perak, dan perunggu — di bagian Achievements pada halaman utama.</p>"},
  connections:{tag:"02 — Connections", title:"Sekolah & Relasi", body:"Selama di SMKS Binong Permai, kelas XII TJKT 1 dibimbing oleh wali kelas dan guru produktif TJKT yang mendukung proses belajar di bidang jaringan dan teknologi. Relasi ini terbentuk sejak SD, berlanjut ke SMP, hingga sekarang di bangku SMK.", extra:"<p>Buka bagian Connections di halaman utama untuk melihat detail wali kelas, guru produktif, dan teman sekelas di tiap jenjang pendidikan.</p>"},
  suggestions:{tag:"03 — Suggestions", title:"Rencana Ke Depan", body:"Rencana jangka pendek adalah memperdalam networking dan web development lewat proyek nyata, sambil mengejar sertifikasi MikroTik sebagai bekal profesional.", extra:"<ul style=\"margin-top:18px; padding-left:20px; color:#333; line-height:1.8;\"><li>Mengikuti sertifikasi MikroTik (MTCNA)</li><li>Membangun lebih banyak proyek web dan jaringan</li><li>Mengasah kemampuan creative editing lewat konten YouTube</li></ul>"},
  trophies:{tag:"04 — Trophies", title:"Sertifikat & Milestone", body:"Kumpulan sertifikat, penghargaan, dan milestone akan terus ditambahkan di sini seiring bertambahnya prestasi selama masa sekolah.", extra:"<div class=\"trophy-grid\" style=\"margin-top:20px\">"+[1,2,3,4].map(function(n){return "<div class=\"ph light\" data-label=\"sertifikat-"+n+".jpg\"><img src=\"images/sertifikat-"+n+".jpg\" alt=\"Sertifikat "+n+"\" loading=\"lazy\" onload=\"this.parentElement.classList.add('has-img')\" onerror=\"this.remove()\"></div>";}).join("")+"</div>"},
  projects:{tag:"05 — Projects", title:"Proyek yang Dibangun", body:"Empat proyek utama merepresentasikan tiga bidang minat: jaringan, pengembangan web, dan hardware — dikerjakan sebagai latihan praktik nyata di luar materi sekolah.", extra:"<ul style=\"margin-top:18px; padding-left:20px; color:#333; line-height:1.8;\"><li>MikroTik Configuration — konfigurasi routing jaringan</li><li>Website Project — portfolio responsif HTML/CSS/JS</li><li>Arduino Ultrasonic Sensor — deteksi jarak berbasis Arduino</li><li>Creative Editing Project — video editing kreatif</li></ul>"},
  skills:{tag:"06 — Skills", title:"Kemampuan Utama", body:"Empat bidang kemampuan yang terus diasah: web development, networking, hardware, dan creative editing.", extra:"<p>Klik masing-masing baris di bagian Skills pada halaman utama untuk melihat tools yang dipakai di tiap bidang.</p>"}
};

// =====================================
// ACHIEVEMENTS — RB-STYLE PAGER (EDIT RIWAYAT RANK DI SINI)
// =====================================
const achHistory=[
  {rank:"1", period:"XII TJKT 1", school:"SMKS Binong Permai", tier:"gold"},
  {rank:"1", period:"XI · Semester 2", school:"SMKS Binong Permai", tier:"gold"},
  {rank:"1", period:"XI · Semester 1", school:"SMKS Binong Permai", tier:"gold"},
  {rank:"1", period:"X · Semester 2", school:"SMKS Binong Permai", tier:"gold"},
  {rank:"1", period:"X · Semester 1", school:"SMKS Binong Permai", tier:"gold"},
  {rank:"4", period:"Kelas 9", school:"SMP", tier:"bronze"},
  {rank:"5", period:"Kelas 8", school:"SMP", tier:"bronze"},
  {rank:"8", period:"Kelas 7", school:"SMP", tier:"bronze"},
  {rank:"2–3", period:"Kelas 6", school:"SD Bina Benih Bangsa", tier:"silver"},
  {rank:"2–3", period:"Kelas 5", school:"SD Bina Benih Bangsa", tier:"silver"},
  {rank:"2–3", period:"Kelas 4", school:"SD Bina Benih Bangsa", tier:"silver"},
  {rank:"2–3", period:"Kelas 3", school:"SD Bina Benih Bangsa", tier:"silver"},
  {rank:"2–3", period:"Kelas 2", school:"SD Bina Benih Bangsa", tier:"silver"},
  {rank:"2–3", period:"Kelas 1", school:"SD Bina Benih Bangsa", tier:"silver"}
];
const tierGrad={
  gold:{t1:"#fff6d8",t2:"#f0c04a",t3:"#8a5b12",d1:"#c9922c",d2:"#6b430c"},
  silver:{t1:"#ffffff",t2:"#c9c9c9",t3:"#6e6e6e",d1:"#a8a8a8",d2:"#555555"},
  bronze:{t1:"#ffdcb8",t2:"#c57a3d",t3:"#6b3a15",d1:"#a5622c",d2:"#5c320f"}
};
let achIndex=0;
const achBigNum=document.getElementById('achBigNum');
const achCaption=document.getElementById('achCaption');
const achTrophySvg=document.getElementById('achTrophySvg');
const achTrophyStage=document.getElementById('achTrophyStage');
const panelTitle=document.getElementById('panelTitle');
const panelRank=document.getElementById('panelRank');
const panelTotal=document.getElementById('panelTotal');
if(panelTotal) panelTotal.textContent=achHistory.length;

// JOURNEY TIMELINE — dots dirender otomatis dari achHistory, klik buat loncat ke periode itu
const journeyTrack=document.getElementById('journeyTrack');
function renderJourneyTrack(){
  if(!journeyTrack) return;
  journeyTrack.innerHTML=achHistory.map((d,i)=>
    `<button class="journey-dot${i===achIndex?' active':''}" data-i="${i}" style="--jt:${tierGrad[d.tier].t2}" aria-label="${d.period}, ${d.school}"><span class="journey-dot-tip">${d.period}</span></button>`
  ).join('');
  journeyTrack.querySelectorAll('.journey-dot').forEach(btn=>{
    btn.addEventListener('click',()=>{ achIndex=parseInt(btn.dataset.i,10); renderAch(); });
  });
}
function updateJourneyActive(){
  if(!journeyTrack) return;
  journeyTrack.querySelectorAll('.journey-dot').forEach((btn,i)=>btn.classList.toggle('active', i===achIndex));
}

function renderAch(){
  const d=achHistory[achIndex]; const g=tierGrad[d.tier];
  [achBigNum,achCaption,achTrophySvg,panelTitle,panelRank].forEach(el=>el.classList.add('rb-fade'));
  setTimeout(()=>{
    achBigNum.textContent=d.rank;
    achCaption.textContent=`${d.period} · ${d.school}`;
    panelTitle.innerHTML=`${d.period}<br>${d.school}`;
    panelRank.textContent=d.rank;
    Object.entries(g).forEach(([k,v])=>achTrophyStage.style.setProperty('--'+k,v));
    [achBigNum,achCaption,achTrophySvg,panelTitle,panelRank].forEach(el=>el.classList.remove('rb-fade'));
    updateJourneyActive();
  },160);
}
document.getElementById('achUp').addEventListener('click',()=>{ achIndex=(achIndex-1+achHistory.length)%achHistory.length; renderAch(); });
document.getElementById('achDown').addEventListener('click',()=>{ achIndex=(achIndex+1)%achHistory.length; renderAch(); });
renderJourneyTrack();
// =====================================
// PROJECTS — RICH DETAIL POPUP (EDIT KONTEN PROYEK DI SINI)
// =====================================
const projectDetail={
  mikrotik:{tag:"Networking — 2026", title:"MikroTik Configuration", img:"project-1.jpg",
    body:"Konfigurasi jaringan dan routing menggunakan router MikroTik untuk kebutuhan lab jaringan sekolah, mencakup pengaturan IP, firewall dasar, dan manajemen bandwidth antar client.",
    tags:["MikroTik","Routing","Bandwidth Management"]},
  website:{tag:"Web Development — 2026", title:"Website Project", img:"project-2.jpg",
    body:"Membangun website responsif dari nol menggunakan HTML, CSS, dan JavaScript murni — termasuk portfolio ini sendiri, lengkap dengan animasi scroll dan komponen interaktif.",
    tags:["HTML","CSS","JavaScript"]},
  arduino:{tag:"Hardware — 2026", title:"Arduino Ultrasonic Sensor", img:"project-3.jpg",
    body:"Proyek sensor jarak berbasis Arduino yang membaca jarak objek menggunakan sensor ultrasonik HC-SR04, lalu menampilkan hasilnya secara real-time.",
    tags:["Arduino","Sensor","C++"]},
  editing:{tag:"Creative — 2026", title:"Creative Editing Project", img:"project-4.jpg",
    body:"Proyek editing video kreatif menggunakan Premiere Pro, After Effects, dan Alight Motion — mulai dari cutting, color grading, sampai motion graphics sederhana.",
    tags:["Premiere Pro","After Effects","Alight Motion"]},
  // SLOT PROYEK BARU — GANTI tag, title, img (taruh file di images/project-5.jpg), body, dan tags
  project5:{tag:"Kategori — Tahun", title:"Judul Proyek Baru", img:"project-5.jpg",
    body:"Ganti dengan deskripsi lengkap proyek ini.",
    tags:["Tag1","Tag2"]},
  // SLOT PROYEK BARU — GANTI tag, title, img (taruh file di images/project-6.jpg), body, dan tags
  project6:{tag:"Kategori — Tahun", title:"Judul Proyek Baru", img:"project-6.jpg",
    body:"Ganti dengan deskripsi lengkap proyek ini.",
    tags:["Tag1","Tag2"]}
};
document.querySelectorAll('[data-project]').forEach(item=>{
  item.addEventListener('click',()=>{
    const d=projectDetail[item.dataset.project]; if(!d) return;
    const tagChips=d.tags.map(t=>`<span style="display:inline-block; border:1px solid #d8d6d0; border-radius:20px; padding:6px 14px; font-size:.78rem; margin:4px 8px 0 0;">${t}</span>`).join('');
    detailInner.innerHTML=`<div class="ph detail-banner" data-label="${d.img}"><img src="images/${d.img}" alt="${d.title}" loading="lazy" onload="this.parentElement.classList.add('has-img')" onerror="this.remove()"></div><div class="card-tag">${d.tag}</div><h3>${d.title}</h3><p>${d.body}</p><div>${tagChips}</div>`;
    detailView.classList.add('open'); detailClose.style.display='block'; lockScroll();
  });
});

document.getElementById('achMoreBtn').addEventListener('click',()=>{
  const d=achHistory[achIndex];
  detailInner.innerHTML=`<div class="card-tag">${d.period}</div><h3>Rank ${d.rank}</h3><p>${d.period}, ${d.school}.</p>`;
  detailView.classList.add('open'); detailClose.style.display='block'; document.body.style.overflow='hidden';
});

// =====================================
// CONNECTIONS PAGER — EDIT RELASI DI SINI
// =====================================
const connHistory=[
  {title:"SMKS Binong Permai", sub:"Kelas X – XII", rows:[
    {label:"Wali Kelas", val:"Kelas X: Pa Dwi Karyanto<br>Kelas XI–XII: Pa Sukardi"},
    {label:"Guru Produktif", val:"Pa Andre, Pa Panji, Pa Dwi, Pa Dede Imam"},
    {label:"Teman Sekelas", val:"Omar Benezka Athaya, Mufti Raharja Putra, Dian Wahyu Juvanda, Ghalih Sumadinata, Afif Al-Maturidi"}
  ]},
  {title:"SMP", sub:"Kelas 7 – 9", rows:[
    {label:"Wali Kelas", val:"Kelas 7: Bu Evi<br>Kelas 8: Bu Sumi<br>Kelas 9: Bu Indah"},
    {label:"Teman Sekelas", val:"Omar Benezka Athaya, Mufti Raharja Putra, Dian Wahyu Juvanda, Ghalih Sumadinata, Afif Al-Maturidi"}
  ]},
  {title:"Bina Benih Bangsa", sub:"Kelas 1 – 6 (SD)", rows:[
    {label:"Wali Kelas", val:"—"},
    {label:"Teman Sekelas", val:"Koresy, Jevier"}
  ]}
];
let connIndex=0;
const connTitleEl=document.getElementById('connTitle');
const connSubEl=document.getElementById('connSub');
const connDetailsEl=document.getElementById('connDetails');
const connCountEl=document.getElementById('connCount');
function renderConn(){
  const d=connHistory[connIndex];
  const hero=document.getElementById('connHero');
  hero.classList.add('conn-fade');
  setTimeout(()=>{
    connTitleEl.textContent=d.title; connSubEl.textContent=d.sub;
    connDetailsEl.innerHTML=d.rows.map(r=>`<div><dt>${r.label}</dt><dd>${r.val}</dd></div>`).join('');
    connCountEl.textContent=`${String(connIndex+1).padStart(2,'0')} / ${String(connHistory.length).padStart(2,'0')}`;
    hero.classList.remove('conn-fade');
  },150);
}
document.getElementById('connPrev').addEventListener('click',()=>{ connIndex=(connIndex-1+connHistory.length)%connHistory.length; renderConn(); });
document.getElementById('connNext').addEventListener('click',()=>{ connIndex=(connIndex+1)%connHistory.length; renderConn(); });
renderConn();

// =====================================
// HEADER SCROLL BEHAVIOR
// =====================================
const header=document.getElementById('siteHeader');
window.addEventListener('scroll',()=>{ header.classList.toggle('scrolled', window.scrollY>40); });

// =====================================
// HAMBURGER MENU / FULLSCREEN NAVIGATION
// =====================================
const overlay=document.getElementById('navOverlay');
const openBtn=document.getElementById('menuOpen');
const closeBtn=document.getElementById('menuClose');
// posisi tombol hamburger dijadikan titik asal lingkaran pembuka menu (lihat .overlay di style.css)
function setMenuOrigin(){
  const r=openBtn.getBoundingClientRect();
  const ox=((r.left+r.width/2)/window.innerWidth*100).toFixed(1);
  const oy=((r.top+r.height/2)/window.innerHeight*100).toFixed(1);
  overlay.style.setProperty('--ox', ox+'%');
  overlay.style.setProperty('--oy', oy+'%');
}
function openMenu(){ setMenuOrigin(); overlay.classList.add('open'); openBtn.classList.add('active'); lockScroll(); }
function closeMenu(){ overlay.classList.remove('open'); openBtn.classList.remove('active'); unlockScroll(); }
openBtn.addEventListener('click',()=>{ overlay.classList.contains('open') ? closeMenu() : openMenu(); });
closeBtn.addEventListener('click',closeMenu);
overlay.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',closeMenu));

// =====================================
// ACTIVE NAV LINK WHILE SCROLLING
// =====================================
const navLinks=[...overlay.querySelectorAll('nav a')];
const trackedSections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const overlayCurrentSectionEl=document.getElementById('overlayCurrentSection');
const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id='#'+entry.target.id;
      navLinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href')===id));
      // "Lagi di: ..." di footer menu fullscreen — otomatis ikut section mana yang lagi keliatan
      if(overlayCurrentSectionEl){
        const activeLink=navLinks.find(a=>a.getAttribute('href')===id);
        const label=activeLink ? activeLink.querySelector('.menu-text').childNodes[0].textContent.trim() : '';
        overlayCurrentSectionEl.textContent = label ? ('· Lagi di: '+label) : '';
      }
    }
  });
},{rootMargin:'-45% 0px -50% 0px'});
trackedSections.forEach(sec=>navObserver.observe(sec));

// =====================================
// OVERLAY CLOCK — jam + sapaan kecil di pojok menu fullscreen, biar menu-nya kerasa "hidup" & real-time
// =====================================
(function initOverlayClock(){
  const el=document.getElementById('overlayClock');
  if(!el) return;
  function greeting(h){
    if(h<4) return 'Selamat malam';
    if(h<11) return 'Selamat pagi';
    if(h<15) return 'Selamat siang';
    if(h<19) return 'Selamat sore';
    return 'Selamat malam';
  }
  function tick(){
    const now=new Date();
    const hh=String(now.getHours()).padStart(2,'0');
    const mm=String(now.getMinutes()).padStart(2,'0');
    el.innerHTML=`${greeting(now.getHours())} · <span class="ov-time">${hh}:${mm}</span>`;
  }
  tick();
  setInterval(tick,15000);
})();

// =====================================
// SCROLL PROGRESS BAR
// =====================================
const scrollProgress=document.getElementById('scrollProgress');
function updateScrollProgress(){
  const scrollTop=window.scrollY;
  const docHeight=document.documentElement.scrollHeight-window.innerHeight;
  const pct=docHeight>0 ? (scrollTop/docHeight)*100 : 0;
  if(scrollProgress) scrollProgress.style.width=pct+'%';
}
window.addEventListener('scroll',updateScrollProgress,{passive:true});
updateScrollProgress();

// =====================================
// BACK TO TOP
// =====================================
const backToTop=document.getElementById('backToTop');
if(backToTop){
  window.addEventListener('scroll',()=>{ backToTop.classList.toggle('show', window.scrollY>500); },{passive:true});
  backToTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

// =====================================
// ANIMATED COUNTERS (About stats)
// =====================================
const statEls=document.querySelectorAll('.stat-animate');
function animateCount(el){
  const target=parseInt(el.dataset.count,10)||0;
  const duration=1100; const start=performance.now();
  function tick(now){
    const p=Math.min((now-start)/duration,1);
    const eased=1-Math.pow(1-p,3);
    el.textContent=Math.round(eased*target);
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ animateCount(entry.target); statObserver.unobserve(entry.target); }
  });
},{threshold:0.6});
statEls.forEach(el=>statObserver.observe(el));

// =====================================
// HERO LOAD-IN (satu momen animasi pas halaman dibuka)
// =====================================
// Judul hero dipecah jadi per-huruf biar muncul satu-satu kaya air terjun (lihat .hl-line/.hl-char
// di style.css). Teksnya sendiri TETAP diambil apa adanya dari <h1> di index.html — jadi kalau mau
// ganti nama/teks judul, tetep edit langsung di <h1>...</h1> di HTML seperti biasa, gak usah utak-atik sini.
(function splitHeroHeading(){
  const h1=document.querySelector('.hero h1');
  if(!h1) return;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lines=h1.innerHTML.split(/<br\s*\/?>/i).map(s=>s.trim()).filter(Boolean);
  if(!lines.length) return;
  h1.innerHTML='';
  let charIndex=0;
  lines.forEach(line=>{
    const lineEl=document.createElement('span');
    lineEl.className='hl-line';
    [...line].forEach(ch=>{
      const charEl=document.createElement('span');
      charEl.className='hl-char';
      charEl.textContent=ch===' '?' ':ch;
      if(!reduceMotion) charEl.style.transitionDelay=(charIndex*28)+'ms';
      lineEl.appendChild(charEl);
      charIndex++;
    });
    h1.appendChild(lineEl);
  });
  // Overflow:hidden di .hl-line cuma dibutuhin SELAMA animasi cascade (buat nutupin huruf yang
  // masih "ngumpet" di bawah sebelum naik). Begitu semua huruf udah kelar naik, kelas "settled"
  // ditempel supaya overflow dibuka lagi — biar shadow/bevel 3D yang blur-nya lebar gak kepotong
  // rapi jadi kotak keras (itu bug "shadow ke-crop" yang sebelumnya kelihatan).
  const totalDelay=reduceMotion?0:(charIndex*28)+750;
  setTimeout(()=>{ h1.classList.add('settled'); },totalDelay);
})();
requestAnimationFrame(()=>{ document.getElementById('hero').classList.add('loaded'); });

// =====================================
// HERO PARTICLES — bikin titik-titik kecil yang melayang naik terus-menerus di hero
// (lihat .hero-particles / @keyframes particleRise di style.css). Dimatikan kalau
// user minta reduced-motion, biar gak ada gerakan konstan buat yang sensitif.
// =====================================
(function initHeroParticles(){
  const field=document.getElementById('heroParticles');
  if(!field) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const COUNT=22;
  for(let i=0;i<COUNT;i++){
    const p=document.createElement('span');
    p.className='hero-particle';
    const size=(Math.random()*3+1.5).toFixed(1);
    const left=(Math.random()*100).toFixed(1);
    const duration=(Math.random()*14+14).toFixed(1);
    const delay=(Math.random()*-28).toFixed(1);
    const drift=((Math.random()*2-1)*60).toFixed(0);
    const pop=(Math.random()*.35+.25).toFixed(2);
    p.style.cssText=`width:${size}px; height:${size}px; left:${left}%; --drift:${drift}px; --pop:${pop}; animation-duration:${duration}s; animation-delay:${delay}s;`;
    field.appendChild(p);
  }
})();

// =====================================
// GLOBAL PARTICLES — debu cahaya lembut yang melayang naik di SELURUH halaman (fixed, ikut
// kelihatan di section manapun pas discroll, beda sama hero-particles yang cuma di dalam Hero).
// Dibuat sangat subtle (kecil & transparan) jadi gak mengganggu baca konten. Mati otomatis kalau
// reduced-motion aktif, dan ikut disembunyikan oleh .animations-off lewat CSS (Master Toggle).
// =====================================
(function initGlobalParticles(){
  const field=document.getElementById('globalParticles');
  if(!field) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const COUNT=26;
  for(let i=0;i<COUNT;i++){
    const p=document.createElement('span');
    p.className='global-particle';
    const size=(Math.random()*1.4+1).toFixed(1); // ~1–2.4px, tetep kecil tapi cukup kelihatan
    const left=(Math.random()*100).toFixed(1);
    const duration=(Math.random()*26+26).toFixed(1); // pelan: 26–52 detik sekali naik
    const delay=(Math.random()*-52).toFixed(1);
    const drift=((Math.random()*2-1)*40).toFixed(0);
    // opacity dipadu mix-blend-mode:difference (lihat style.css) jadi tetep kelihatan lembut
    // baik di atas background terang maupun gelap
    const pop=(Math.random()*.25+.3).toFixed(2);
    p.style.cssText=`width:${size}px; height:${size}px; left:${left}%; --gdrift:${drift}px; --gpop:${pop}; animation-duration:${duration}s; animation-delay:${delay}s;`;
    field.appendChild(p);
  }
})();

// =====================================
// SETTINGS PANEL — ganti tema warna & toggle efek 3D (tersimpan di localStorage)
// Tema aslinya udah diterapkan lebih dulu oleh script kecil di <head> (biar gak ada
// "kedipan" warna pas reload); kode di sini cuma nyinkronin tampilan panel + nanganin klik.
// EDIT/TAMBAH preset warna: samakan dengan THEME_PRESETS di bawah DAN swatch di index.html.
// =====================================
const THEME_PRESETS={
  blue:{navy:'#061A2B',navy2:'#0A2A44',accent:'#D71920',accent2:'#1B4E8C'},
  forest:{navy:'#0B2318',navy2:'#123524',accent:'#E8B33D',accent2:'#2E7D52'},
  violet:{navy:'#1A1033',navy2:'#261448',accent:'#FF6B6B',accent2:'#7C5CFC'},
  graphite:{navy:'#16181D',navy2:'#202329',accent:'#D71920',accent2:'#4A4F58'},
  maroon:{navy:'#240D0F',navy2:'#341115',accent:'#F2B134',accent2:'#8C2F39'}
};
const settingsBtn=document.getElementById('settingsBtn');
const settingsPanel=document.getElementById('settingsPanel');
const settingsOverlay=document.getElementById('settingsOverlay');
const settingsClose=document.getElementById('settingsClose');
const customNavyInput=document.getElementById('customNavy');
const customAccentInput=document.getElementById('customAccent');
const themeResetBtn=document.getElementById('themeReset');
const tilt3dToggle=document.getElementById('tilt3dToggle');

// variabel ini dibaca ulang oleh efek foto 3D di hero (lihat bagian ALIVE EXTRAS di bawah)
let heroTiltEnabled=localStorage.getItem('arkaTilt3d')!=='off';

function applyTheme(t,save){
  const r=document.documentElement;
  r.style.setProperty('--navy',t.navy);
  r.style.setProperty('--navy2',t.navy2);
  r.style.setProperty('--accent',t.accent);
  r.style.setProperty('--accent2',t.accent2);
  if(customNavyInput) customNavyInput.value=t.navy;
  if(customAccentInput) customAccentInput.value=t.accent;
  if(save){ try{ localStorage.setItem('arkaTheme',JSON.stringify(t)); }catch(e){} }
}
function markActiveSwatch(navyHex){
  const match=Object.keys(THEME_PRESETS).find(k=>THEME_PRESETS[k].navy.toLowerCase()===(navyHex||'').toLowerCase());
  document.querySelectorAll('.theme-swatch').forEach(b=>b.classList.toggle('active', b.dataset.theme===match));
}

if(settingsBtn && settingsPanel && settingsOverlay){
  // setiap panel dibuka, sinkronin ulang posisi semua switch dengan status aktif saat ini —
  // jaga-jaga kalau statenya berubah dari tempat lain (misal OS ganti dark/light pas mode "auto").
  const openSettings=()=>{
    settingsPanel.classList.add('open'); settingsOverlay.classList.add('open'); lockScroll();
    if(tilt3dToggle) tilt3dToggle.checked=(localStorage.getItem('arkaTilt3d')!=='off');
    if(animationsToggle) animationsToggle.checked=(localStorage.getItem('arkaAnimations')!=='off');
    document.querySelectorAll('.mode-btn').forEach(b=>b.classList.toggle('active', b.dataset.mode===(localStorage.getItem('arkaColorMode')||'auto')));
  };
  const closeSettings=()=>{ settingsPanel.classList.remove('open'); settingsOverlay.classList.remove('open'); unlockScroll(); };
  settingsBtn.addEventListener('click',openSettings);
  settingsClose.addEventListener('click',closeSettings);
  settingsOverlay.addEventListener('click',closeSettings);

  // --- MODE TAMPILAN: Terang / Gelap / Otomatis (ikut setting OS) ---
  // Mode aslinya udah diterapkan lebih dulu oleh script kecil di <head> (anti-kedipan);
  // di sini cuma nyinkronin tombol aktif + nanganin klik + dengerin perubahan tema OS pas mode "auto".
  function applyColorMode(mode,save){
    const systemWantsDark=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = mode==='dark' || (mode==='auto' && systemWantsDark);
    document.documentElement.classList.toggle('dark', isDark);
    document.querySelectorAll('.mode-btn').forEach(b=>b.classList.toggle('active', b.dataset.mode===mode));
    if(save){ try{ localStorage.setItem('arkaColorMode',mode); }catch(e){} }
  }
  const savedMode=localStorage.getItem('arkaColorMode')||'auto';
  applyColorMode(savedMode,false);
  document.querySelectorAll('.mode-btn').forEach(btn=>{
    btn.addEventListener('click',()=>applyColorMode(btn.dataset.mode,true));
  });
  if(window.matchMedia){
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',e=>{
      if((localStorage.getItem('arkaColorMode')||'auto')==='auto'){
        document.documentElement.classList.toggle('dark', e.matches);
      }
    });
  }

  document.querySelectorAll('.theme-swatch').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const preset=THEME_PRESETS[btn.dataset.theme]; if(!preset) return;
      applyTheme(preset,true);
      markActiveSwatch(preset.navy);
    });
  });

  function applyCustom(){
    applyTheme({navy:customNavyInput.value, navy2:customNavyInput.value, accent:customAccentInput.value, accent2:customAccentInput.value},true);
    markActiveSwatch(customNavyInput.value);
  }
  customNavyInput.addEventListener('input',applyCustom);
  customAccentInput.addEventListener('input',applyCustom);

  themeResetBtn.addEventListener('click',()=>{
    try{ localStorage.removeItem('arkaTheme'); }catch(e){}
    applyTheme(THEME_PRESETS.blue,false);
    markActiveSwatch(THEME_PRESETS.blue.navy);
  });

  // sinkronin panel dengan tema yang sudah aktif (dari localStorage atau default biru)
  try{
    const saved=JSON.parse(localStorage.getItem('arkaTheme')||'null');
    const active=saved||THEME_PRESETS.blue;
    customNavyInput.value=active.navy;
    customAccentInput.value=active.accent;
    markActiveSwatch(active.navy);
  }catch(e){}

  tilt3dToggle.checked=heroTiltEnabled;
  tilt3dToggle.addEventListener('change',()=>{
    heroTiltEnabled=tilt3dToggle.checked;
    try{ localStorage.setItem('arkaTilt3d', heroTiltEnabled?'on':'off'); }catch(e){}
    document.documentElement.classList.toggle('tilt3d-off', !heroTiltEnabled);
    if(!heroTiltEnabled && heroFigureImg) heroFigureImg.style.transform='';
  });

  // --- MASTER TOGGLE ANIMASI UI: matiin/nyalain semua efek gerak sekaligus (lihat .animations-off di style.css) ---
  // Status awalnya udah diterapkan lebih dulu oleh script anti-kedipan di <head>; di sini cuma
  // nyinkronin posisi switch-nya + nanganin klik user.
  const animationsToggle=document.getElementById('animationsToggle');
  if(animationsToggle){
    const animationsEnabled=localStorage.getItem('arkaAnimations')!=='off';
    animationsToggle.checked=animationsEnabled;
    animationsToggle.addEventListener('change',()=>{
      const on=animationsToggle.checked;
      try{ localStorage.setItem('arkaAnimations', on?'on':'off'); }catch(e){}
      document.documentElement.classList.toggle('animations-off', !on);
    });
  }
}

// =====================================
// "ALIVE" EXTRAS — cursor glow, tilt 3D, cycling word
// Semua dimatikan otomatis kalau user pakai prefers-reduced-motion
// atau device-nya touch (gak ada mouse beneran)
// =====================================
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer=window.matchMedia('(hover:hover) and (pointer:fine)').matches;

// --- cursor glow mengikuti mouse ---
const cursorGlow=document.getElementById('cursorGlow');
if(cursorGlow && hasFinePointer && !reduceMotion){
  window.addEventListener('mousemove',e=>{
    cursorGlow.style.transform=`translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%,-50%)`;
    cursorGlow.classList.add('show');
  },{passive:true});
  window.addEventListener('mouseleave',()=>cursorGlow.classList.remove('show'));
}

// --- tilt 3D di carousel card, project item, testimonial card ---
if(hasFinePointer && !reduceMotion){
  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width; const py=(e.clientY-r.top)/r.height;
      const rx=(0.5-py)*10; const ry=(px-0.5)*10;
      card.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      card.style.transition='transform .08s linear';
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform=''; card.style.transition='';
    });
  });
}

// --- trophy 3D: ikut muter sesuai posisi kursor di area Achievements ---
const achTrophyStageEl=document.getElementById('achTrophyStage');
const achRbMain=document.querySelector('.ach-rb-main');
if(achTrophyStageEl && achRbMain && hasFinePointer && !reduceMotion){
  achRbMain.addEventListener('mousemove',e=>{
    const r=achRbMain.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width; const py=(e.clientY-r.top)/r.height;
    const ry=(px-0.5)*34; const rx=(0.5-py)*22;
    achTrophyStageEl.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  achRbMain.addEventListener('mouseleave',()=>{
    achTrophyStageEl.style.transform='perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}

// --- foto 3D di sisi hero: miring ngikutin posisi kursor (bisa dimatikan di panel Pengaturan) ---
const heroSectionEl=document.getElementById('hero');
const heroFigureImg=document.getElementById('heroFigureImg');
if(heroSectionEl && heroFigureImg){
  heroSectionEl.addEventListener('mousemove',e=>{
    if(!heroTiltEnabled || !hasFinePointer || reduceMotion){ heroFigureImg.style.transform=''; return; }
    const r=heroSectionEl.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width; const py=(e.clientY-r.top)/r.height;
    const ry=(px-0.5)*26; const rx=(0.5-py)*14;
    heroFigureImg.style.transform=`perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
  });
  heroSectionEl.addEventListener('mouseleave',()=>{ heroFigureImg.style.transform=''; });
}

// --- cycling word di subtitle hero ---
const cycleEl=document.getElementById('cycleWord');
if(cycleEl){
  const cycleWords=['networking','pengembangan web','hardware komputer','creative editing'];
  let cycleIndex=0;
  if(!reduceMotion){
    setInterval(()=>{
      cycleEl.classList.add('swap');
      setTimeout(()=>{
        cycleIndex=(cycleIndex+1)%cycleWords.length;
        cycleEl.textContent=cycleWords[cycleIndex];
        cycleEl.classList.remove('swap');
      },250);
    },2600);
  }
}

// =====================================
// RIPPLE & MAGNETIC BUTTONS — micro-interaction feedback di tombol-tombol utama
// =====================================
// Helper kecil: kondisi "animasi boleh jalan" dicek ULANG tiap kejadian (bukan cuma sekali di awal),
// soalnya Master Toggle Animasi di panel Settings bisa diubah user kapan aja tanpa reload halaman.
function animOk(){ return !reduceMotion && !document.documentElement.classList.contains('animations-off'); }

// --- ripple: lingkaran kecil yang membesar & memudar dari titik klik ---
(function initRipple(){
  const RIPPLE_SEL='.rb-cta, .carousel-nav button, .settings-btn, .back-to-top, #tpPlay';
  document.addEventListener('click',e=>{
    if(!animOk()) return;
    const target=e.target.closest(RIPPLE_SEL);
    if(!target) return;
    const r=target.getBoundingClientRect();
    const size=Math.max(r.width,r.height)*1.4;
    const span=document.createElement('span');
    span.className='ripple-fx';
    span.style.width=span.style.height=size+'px';
    span.style.left=(e.clientX-r.left-size/2)+'px';
    span.style.top=(e.clientY-r.top-size/2)+'px';
    target.appendChild(span);
    span.addEventListener('animationend',()=>span.remove());
  });
})();

// --- magnetic: tombol CTA utama & panah carousel ikut "tertarik" dikit ke arah kursor pas dideketin ---
if(hasFinePointer && !reduceMotion){
  document.querySelectorAll('.rb-cta, .carousel-nav button').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      if(!animOk()) return;
      const r=btn.getBoundingClientRect();
      const mx=(e.clientX-r.left-r.width/2)*0.28;
      const my=(e.clientY-r.top-r.height/2)*0.28;
      btn.style.transform=`translate(${mx}px, ${my}px)`;
    });
    btn.addEventListener('mouseleave',()=>{ btn.style.transform=''; });
  });
}

// =====================================
// SCROLL PARALLAX — gambar project & trophy gerak sedikit lebih lambat dari scroll, biar ada kesan
// kedalaman (depth). Dihitung ulang tiap frame scroll (rAF-throttled, sama pola kaya vignette).
// =====================================
(function initScrollParallax(){
  if(reduceMotion) return;
  const items=[...document.querySelectorAll('.proj-item .ph img, .trophy-item .ph img')];
  if(!items.length) return;
  let ticking=false;
  function update(){
    ticking=false;
    if(document.documentElement.classList.contains('animations-off')){
      items.forEach(img=>img.style.setProperty('--parallax','0px'));
      return;
    }
    const vh=window.innerHeight;
    items.forEach(img=>{
      const r=img.getBoundingClientRect();
      const center=r.top+r.height/2;
      // posisi relatif terhadap tengah layar (-1 = masih di bawah layar, 1 = udah lewat di atas)
      const rel=(center-vh/2)/vh;
      const offset=Math.max(-1,Math.min(1,rel))*-16; // maksimal geser 16px, lembut aja
      img.style.setProperty('--parallax',offset.toFixed(1)+'px');
    });
  }
  window.addEventListener('scroll',()=>{
    if(!ticking){ requestAnimationFrame(update); ticking=true; }
  },{passive:true});
  update();
})();

// =====================================
// FEATURED VIDEO ASPECT-RATIO — biar video portrait (Shorts) gak ke-crop paksa jadi 16:9
// =====================================
// BUG FIX: sebelumnya kotak video di-hardcode rasio 16:9 lewat CSS (padding-top:56.25%) +
// object-fit:cover, jadi video portrait/Shorts selalu kepotong kiri-kanannya biar nutup kotak
// landscape — gak ngaruh device-nya HP atau PC, videonya sendiri yang gak pernah dicek orientasinya.
// Sekarang begitu metadata video kebaca (videoWidth/videoHeight asli dari file-nya), ukuran kotak
// (--vratio) disesuaikan PERSIS sama rasio video itu — landscape tetap landscape, portrait (9:16,
// 3:4, dll) jadi portrait, gak ada yang ke-crop lagi, di HP maupun PC sama-sama ngikut video aslinya.
document.querySelectorAll('.featured-video video').forEach(video=>{
  function syncRatio(){
    const w=video.videoWidth, h=video.videoHeight;
    if(!w || !h) return;
    const wrap=video.closest('.featured-video');
    if(!wrap) return;
    wrap.style.setProperty('--vratio', w+'/'+h);
    wrap.classList.toggle('is-portrait', h>w);
  }
  video.addEventListener('loadedmetadata', syncRatio);
  if(video.readyState>=1) syncRatio(); // metadata udah kebaca duluan (misal video ke-cache)
});

// =====================================
// THEME MUSIC PLAYER — 3 lagu, prev/next, helm avatar "nyala" pas diputar
// =====================================
// GANTI JUDUL/FILE LAGU DI SINI: urutan array ini yang nentuin urutan prev/next.
// File-nya sendiri ditaruh di folder audio/ (lihat komentar panduan di index.html bagian ini).
const themeTracks=[
  {title:'Tema 1', src:'audio/theme-1.mp3'},
  {title:'Tema 2', src:'audio/theme-2.mp3'},
  {title:'Tema 3', src:'audio/theme-3.mp3'}
];
(function initThemePlayer(){
  const card=document.getElementById('themePlayerCard');
  const audio=document.getElementById('tpAudio');
  if(!card || !audio) return;
  const titleEl=document.getElementById('tpTrackTitle');
  const playBtn=document.getElementById('tpPlay');
  const playIcon=document.getElementById('tpPlayIcon');
  const prevBtn=document.getElementById('tpPrev');
  const nextBtn=document.getElementById('tpNext');
  const progress=document.getElementById('tpProgress');
  const progressFill=document.getElementById('tpProgressFill');
  const timeCurrent=document.getElementById('tpTimeCurrent');
  const timeTotal=document.getElementById('tpTimeTotal');
  const waveform=document.getElementById('tpWaveform');

  // bikin bar equalizer dekoratif (cuma visual, jumlah & kecepatannya acak dikit biar natural)
  for(let i=0;i<24;i++){
    const bar=document.createElement('span');
    bar.style.animationDuration=(Math.random()*.6+.7)+'s';
    bar.style.animationDelay=(Math.random()*-1)+'s';
    waveform.appendChild(bar);
  }

  let trackIndex=0;

  function fmtTime(sec){
    if(!isFinite(sec)||sec<0) sec=0;
    const m=Math.floor(sec/60), s=Math.floor(sec%60);
    return m+':'+String(s).padStart(2,'0');
  }
  function loadTrack(i, autoplay){
    trackIndex=(i+themeTracks.length)%themeTracks.length;
    const t=themeTracks[trackIndex];
    titleEl.textContent=t.title;
    audio.src=t.src;
    progressFill.style.width='0%';
    timeCurrent.textContent='0:00';
    timeTotal.textContent='0:00';
    if(autoplay) audio.play().catch(()=>{ /* diblokir browser atau file belum ada — diam aja, user tinggal pencet play lagi */ });
  }
  function setPlayingUI(isPlaying){
    card.classList.toggle('is-playing', isPlaying);
    playIcon.textContent = isPlaying ? '❚❚' : '▶';
    playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  }

  loadTrack(0, false);

  playBtn.addEventListener('click',()=>{
    if(audio.paused){
      audio.play().catch(()=>{
        titleEl.textContent=themeTracks[trackIndex].title+' — file belum ada';
      });
    } else {
      audio.pause();
    }
  });
  prevBtn.addEventListener('click',()=>loadTrack(trackIndex-1, true));
  nextBtn.addEventListener('click',()=>loadTrack(trackIndex+1, true));
  audio.addEventListener('play',()=>setPlayingUI(true));
  audio.addEventListener('pause',()=>setPlayingUI(false));
  audio.addEventListener('ended',()=>loadTrack(trackIndex+1, true)); // lanjut otomatis ke lagu berikutnya
  audio.addEventListener('loadedmetadata',()=>{ timeTotal.textContent=fmtTime(audio.duration); });
  audio.addEventListener('timeupdate',()=>{
    timeCurrent.textContent=fmtTime(audio.currentTime);
    if(audio.duration) progressFill.style.width=((audio.currentTime/audio.duration)*100)+'%';
  });
  audio.addEventListener('error',()=>{
    setPlayingUI(false);
    titleEl.textContent=themeTracks[trackIndex].title+' — file belum ada';
  });
  // klik di progress bar buat loncat ke bagian lagu tertentu
  progress.addEventListener('click',e=>{
    if(!audio.duration) return;
    const r=progress.getBoundingClientRect();
    audio.currentTime=((e.clientX-r.left)/r.width)*audio.duration;
  });
})();

// =====================================
// CAROUSEL
// =====================================
const carousel=document.getElementById('carousel');
document.getElementById('carPrev').addEventListener('click',()=>carousel.scrollBy({left:-360,behavior:'smooth'}));
document.getElementById('carNext').addEventListener('click',()=>carousel.scrollBy({left:360,behavior:'smooth'}));

// --- auto-advance pelan-pelan kalau lagi gak disentuh, biar carousel-nya kerasa "hidup" sendiri ---
// Berhenti otomatis kalau: user lagi hover/sentuh/drag carouselnya, reduced-motion aktif,
// atau carousel lagi gak kelihatan di layar (hemat resource pas user scroll ke section lain).
(function autoAdvanceCarousel(){
  if(!carousel) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let paused=false, visible=false;
  const resumeEvents=['mouseenter','touchstart','pointerdown','wheel'];
  resumeEvents.forEach(ev=>carousel.addEventListener(ev,()=>{paused=true;},{passive:true}));
  const unpauseEvents=['mouseleave','touchend'];
  unpauseEvents.forEach(ev=>carousel.addEventListener(ev,()=>{
    clearTimeout(carousel._resumeT);
    carousel._resumeT=setTimeout(()=>{paused=false;},2200);
  },{passive:true}));
  const io=new IntersectionObserver(entries=>{
    entries.forEach(en=>{visible=en.isIntersecting;});
  },{threshold:.4});
  io.observe(carousel);
  setInterval(()=>{
    if(paused||!visible) return;
    const atEnd=carousel.scrollLeft+carousel.clientWidth>=carousel.scrollWidth-8;
    if(atEnd) carousel.scrollTo({left:0,behavior:'smooth'});
    else carousel.scrollBy({left:360,behavior:'smooth'});
  },4200);
})();

// =====================================
// CARD DETAIL OVERLAY
// =====================================
const detailView=document.getElementById('detailView');
const detailInner=document.getElementById('detailInner');
const detailClose=document.getElementById('detailClose');
document.querySelectorAll('[data-detail]').forEach(card=>{
  card.addEventListener('click',()=>{
    const d=detailData[card.dataset.detail];
    detailInner.innerHTML=`<div class="ph detail-banner" data-label="${card.dataset.detail}.jpg"><img src="images/${card.dataset.detail}.jpg" alt="${d.title}" loading="lazy" onload="this.parentElement.classList.add('has-img')" onerror="this.remove()"></div><div class="card-tag">${d.tag}</div><h3>${d.title}</h3><p>${d.body}</p>${d.extra||''}`;
    detailView.classList.add('open'); detailClose.style.display='block'; lockScroll();
  });
});

// =====================================
// SKILLS — TOOL BADGE POPUP (EDIT TOOLS DI SINI)
// =====================================
const skillTools={
  web:{title:"Web Development", tools:[
    {abbr:"HT",color:"#e34c26",name:"HTML",img:"html.jpg",desc:"Bahasa dasar untuk menyusun struktur halaman — heading, paragraf, gambar, dan elemen konten lainnya."},
    {abbr:"CS",color:"#2965f1",name:"CSS",img:"css.jpg",desc:"Mengatur tampilan visual: warna, layout, spacing, dan responsivitas di berbagai ukuran layar."},
    {abbr:"JS",color:"#c9a227",name:"JavaScript",img:"javascript.jpg",desc:"Menambahkan interaktivitas — menu, animasi, dan logika di sisi browser."}
  ]},
  networking:{title:"Networking", tools:[
    {abbr:"MT",color:"#2b3a42",name:"MikroTik",img:"mikrotik.jpg",desc:"Konfigurasi router, routing, dan manajemen bandwidth untuk jaringan lokal maupun lab sekolah."},
    {abbr:"NW",color:"#1b4e8c",name:"Network Config",img:"network-config.jpg",desc:"Setup, pengkabelan, dan troubleshooting jaringan dari sisi hardware maupun software."}
  ]},
  hardware:{title:"Hardware", tools:[
    {abbr:"PC",color:"#4a4a4a",name:"PC Hardware",img:"pc-hardware.jpg",desc:"Perakitan komputer dari komponen dasar serta pemeliharaan rutin perangkat."},
    {abbr:"TS",color:"#6b6b6b",name:"Troubleshooting",img:"troubleshooting.jpg",desc:"Mendiagnosa dan memperbaiki masalah umum pada PC dan perangkat jaringan."}
  ]},
  creative:{title:"Creative Editing", tools:[
    {abbr:"Pr",color:"#26205c",name:"Premiere Pro",img:"premiere-pro.jpg",desc:"Software editing video utama — memotong, menyusun timeline, color grading, dan mixing audio untuk hasil akhir."},
    {abbr:"Ae",color:"#1c1830",name:"After Effects",img:"after-effects.jpg",desc:"Dipakai untuk motion graphics, visual effect, dan animasi teks yang memperkuat video."},
    {abbr:"AM",color:"#7c3aed",name:"Alight Motion",img:"alight-motion.jpg",desc:"Editor mobile untuk mengedit dan membuat animasi cepat langsung dari HP, cocok untuk konten singkat."}
  ]}
};
document.querySelectorAll('.skill-row').forEach(row=>{
  row.addEventListener('click',()=>{
    const d=skillTools[row.dataset.skill]; if(!d) return;
    const grid=d.tools.map(t=>`<div class="tool-card"><div class="ph tool-thumb" data-label="${t.img}"><img src="images/${t.img}" alt="${t.name}" loading="lazy" onload="this.parentElement.classList.add('has-img')" onerror="this.remove()"></div><div class="tool-card-body"><div class="tool-head"><div class="tool-icon" style="background:${t.color}">${t.abbr}</div><div class="tool-name">${t.name}</div></div><div class="tool-desc">${t.desc}</div></div></div>`).join('');
    detailInner.innerHTML=`<div class="card-tag">Skills — ${d.title}</div><h3>${d.title}</h3><p>Berikut tools utama yang dipakai untuk bidang ${d.title.toLowerCase()}, lengkap dengan fungsinya masing-masing.</p><div class="tool-grid">${grid}</div>`;
    detailView.classList.add('open'); detailClose.style.display='block'; lockScroll();
  });
});
detailClose.addEventListener('click',()=>{ detailView.classList.remove('open'); detailClose.style.display='none'; unlockScroll(); });

// =====================================
// SCROLL REVEAL (termasuk varian berarah: reveal-left/right/top/bottom)
// =====================================
// Tiap elemen dikasih --stg (urutannya di antara saudara-saudara persisnya dalam satu parent yang
// sama) via JS, dipakai CSS buat stagger delay (lihat transition-delay:calc(var(--stg,0)*70ms) di
// style.css) — jadi kartu-kartu dalam satu grid/carousel masuk gantian, bukan bareng semua.
const revealSelector='.reveal, .reveal-left, .reveal-right, .reveal-top, .reveal-bottom';
const revealGroups=new Map();
document.querySelectorAll(revealSelector).forEach(el=>{
  const parent=el.parentElement;
  const n=revealGroups.get(parent)||0;
  el.style.setProperty('--stg',n);
  revealGroups.set(parent,n+1);
});
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:0.15});
document.querySelectorAll(revealSelector).forEach(el=>io.observe(el));

// --- SKILL BARS: isi bar skill pelan-pelan pas baris skill-nya kelihatan di layar ---
const skillBarIO=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const row=e.target;
    row.style.setProperty('--lvl',(row.dataset.level||0)+'%');
    row.classList.add('filled');
    skillBarIO.unobserve(row);
  });
},{threshold:0.3});
document.querySelectorAll('.skill-row[data-level]').forEach(row=>skillBarIO.observe(row));

renderAch();

// =====================================
// VIGNETTE SCROLL — overlay gelap di bawah Hero pudar pelan-pelan seiring discroll ke bawah,
// sampai transparan penuh pas Hero udah lewat, biar warna tema asli (navy/light/dark) kelihatan.
// Pakai requestAnimationFrame biar listener scroll-nya ringan (gak ngitung ulang tiap event,
// cuma sekali per frame).
// =====================================
(function initVignetteScroll(){
  const vig=document.getElementById('heroVignette');
  const heroEl=document.getElementById('hero');
  if(!vig || !heroEl) return;
  let ticking=false;
  function update(){
    ticking=false;
    const h=heroEl.offsetHeight||1;
    const progress=Math.min(1, Math.max(0, window.scrollY/(h*0.7)));
    vig.style.opacity=String(1-progress);
  }
  window.addEventListener('scroll',()=>{
    if(!ticking){ requestAnimationFrame(update); ticking=true; }
  },{passive:true});
  update();
})();
