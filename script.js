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
// NOMOR WA PRIBADI untuk form Suggestions (format internasional tanpa + dan tanpa 0 di depan: 62 + nomor). GANTI di sini kalau perlu.
const WA_PRIBADI='6285119105268';
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
    // BUG FIX: html punya scroll-behavior:smooth, jadi scrollTo() dulu "meluncur" dari paling atas ke posisi semula
    // (bikin pusing). Sekarang smooth dimatikan sebentar → loncat INSTAN ke posisi terakhir, lalu dikembalikan.
    const de=document.documentElement, prev=de.style.scrollBehavior;
    de.style.scrollBehavior='auto';
    window.scrollTo(0,_scrollLockY);
    de.style.scrollBehavior=prev;
  }
}
// =====================================
// PERFORMANCE MODE — auto-deteksi perangkat lemah / ngelag, bisa diatur manual di Settings
// =====================================
// Mode Ringan cuma ngematiin efek yang PALING mahal (lihat html.perf-lite di style.css). Animasi & GUI utama tetap sama.
// Urutan keputusan: pilihan user di Settings (arkaLite on/off) > perangkat lemah (CPU<=4 core / RAM<=4GB) > tes FPS 2,5 detik pertama.
(function initPerfMode(){
  const root=document.documentElement; let pref=null;
  try{ pref=localStorage.getItem('arkaLite'); }catch(e){}
  const weak=(navigator.hardwareConcurrency||8)<=4 || (navigator.deviceMemory||8)<=4 || (navigator.connection && navigator.connection.saveData);
  if(pref==='on') root.classList.add('perf-lite');
  else if(pref==='off') root.classList.remove('perf-lite');
  else if(weak) root.classList.add('perf-lite');
  else{
    let frames=0, start=0, hiddenSeen=false;
    document.addEventListener('visibilitychange',()=>{ if(document.hidden) hiddenSeen=true; });
    (function loop(t){
      if(!start) start=t; frames++;
      if(t-start<2500){ requestAnimationFrame(loop); return; }
      let p=null; try{ p=localStorage.getItem('arkaLite'); }catch(e){}
      if(!hiddenSeen && !p && frames/((t-start)/1000)<38) root.classList.add('perf-lite');
    })(performance.now());
  }
})();
// OPTIMASI: tab browser lagi gak dibuka → semua animasi CSS dijeda (hemat CPU & baterai, lihat html.tab-hidden di style.css)
document.addEventListener('visibilitychange',()=>{ document.documentElement.classList.toggle('tab-hidden',document.hidden); });
// =====================================
// DATA — EDIT KONTEN DETAIL DI SINI
// =====================================
const detailData = {
  achievements:{tag:"01 — Achievements", title:"Rank 1, XII TJKT 1", body:"Meraih peringkat 1 di kelas XII TJKT 1, SMKS Binong Permai, berkat konsistensi belajar dan fokus pada bidang jaringan serta pengembangan web. Pencapaian ini melanjutkan tren peningkatan peringkat sejak semester-semester sebelumnya.", extra:"<p>Lihat riwayat lengkap dari Sekolah Dasar sampai kelas XII — lengkap dengan trofi emas, perak, dan perunggu — di bagian Achievements pada halaman utama.</p>"},
  connections:{tag:"02 — Connections", title:"Sekolah & Relasi", body:"Selama di SMKS Binong Permai, kelas XII TJKT 1 dibimbing oleh wali kelas dan guru produktif TJKT yang mendukung proses belajar di bidang jaringan dan teknologi. Relasi ini terbentuk sejak SD, berlanjut ke SMP, hingga sekarang di bangku SMK.", extra:"<p>Buka bagian Connections di halaman utama untuk melihat detail wali kelas, guru produktif, dan teman sekelas di tiap jenjang pendidikan.</p>"},
  suggestions:{tag:"03 — Suggestions", title:"Rencana Ke Depan", body:"Rencana jangka pendek adalah memperdalam networking dan web development lewat proyek nyata, sambil mengejar sertifikasi MikroTik sebagai bekal profesional.", extra:"<ul style=\"margin-top:18px; padding-left:20px; color:#333; line-height:1.8;\"><li>Mengikuti sertifikasi MikroTik (MTCNA)</li><li>Membangun lebih banyak proyek web dan jaringan</li><li>Mengasah kemampuan creative editing lewat konten YouTube</li></ul>"},
  trophies:{tag:"04 — Trophies", title:"Sertifikat & Milestone", body:"Kumpulan sertifikat, penghargaan, dan milestone akan terus ditambahkan di sini seiring bertambahnya prestasi selama masa sekolah.", extra:"<div class=\"trophy-grid\" style=\"margin-top:20px\">"+[1,2,3,4].map(function(n){return "<div class=\"ph light\" data-label=\"sertifikat-"+n+".webp\"><img src=\"images/sertifikat-"+n+".webp\" alt=\"Sertifikat "+n+"\" loading=\"lazy\" onload=\"this.parentElement.classList.add('has-img')\" onerror=\"this.remove()\"></div>";}).join("")+"</div>"},
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
// Isi detail tiap proyek (projectDetail) SEKARANG ADA DI FILE TERPISAH: projects-data.js — edit teks/gambar proyek di sana
// (komentar "SLOT PROYEK BARU: GANTI judul, kategori, deskripsi, gambar ..." juga pindah ke file itu).
// Di sini cuma logika tampilan popup-nya.
function projImg(file, alt){
  return `<div class="ph" data-label="${file}"><img src="images/${file}" alt="${alt}" loading="lazy" decoding="async" onload="this.parentElement.classList.add('has-img')" onerror="this.remove()"></div>`;
}
function renderProject(key){
  const d=projectDetail[key]; if(!d) return '';
  let i=0; const blk=(html,cls)=>`<div class="pd-block${cls?' '+cls:''}" style="--i:${i++}">${html}</div>`;
  const sec=(title,inner)=>blk(`<h4>${title}</h4>${inner}`,'pd-section');
  const list=a=>`<ul class="pd-list">${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;
  let h='';
  h+=blk(`<div class="ph detail-banner" data-label="${d.img}"><img src="images/${d.img}" alt="${d.title}" loading="lazy" decoding="async" onload="this.parentElement.classList.add('has-img')" onerror="this.remove()"></div><div class="card-tag">${d.tag}</div><h3>${d.title}</h3><p class="pd-lead">${d.body}</p>`);
  if(d.meta) h+=blk(`<dl class="pd-meta">${Object.keys(d.meta).map(k=>`<div><dt>${k}</dt><dd>${d.meta[k]}</dd></div>`).join('')}</dl>`);
  if(d.overview&&d.overview.length) h+=sec('Tentang Proyek', d.overview.map(p=>`<p>${p}</p>`).join(''));
  if(d.features&&d.features.length) h+=sec('Yang Dikerjakan', list(d.features));
  if(d.steps&&d.steps.length) h+=sec('Proses Pengerjaan', `<div class="pd-steps">${d.steps.map((st,n)=>`<div class="pd-step"><div class="pd-step-n">${n+1}</div><div><div class="pd-step-t">${st.t}</div><div class="pd-step-d">${st.d}</div></div></div>`).join('')}</div>`);
  if(d.challenges&&d.challenges.length) h+=sec('Tantangan & Solusi', `<div class="pd-qa">${d.challenges.map(c=>`<div><div class="pd-q">${c.q}</div><div class="pd-a">${c.a}</div></div>`).join('')}</div>`);
  if(d.results&&d.results.length) h+=sec('Hasil', list(d.results));
  if(d.learned&&d.learned.length) h+=sec('Yang Dipelajari', list(d.learned));
  const tools=d.tools||d.tags||[];
  if(tools.length) h+=sec('Tools & Teknologi', `<div class="pd-chips">${tools.map(t=>`<span class="pd-chip">${t}</span>`).join('')}</div>`);
  if(d.gallery&&d.gallery.length) h+=sec('Galeri', `<div class="pd-gallery">${d.gallery.map(g=>projImg(g,d.title)).join('')}</div>`);
  if(d.links&&d.links.length) h+=sec('Tautan', `<div class="pd-links">${d.links.map(l=>`<a class="rb-cta" href="${l.href}" target="_blank" rel="noopener noreferrer">${l.label}</a>`).join('')}</div>`);
  const keys=Object.keys(projectDetail), idx=keys.indexOf(key);
  const prev=projectDetail[keys[(idx-1+keys.length)%keys.length]], next=projectDetail[keys[(idx+1)%keys.length]];
  h+=blk(`<button type="button" data-pd="${keys[(idx-1+keys.length)%keys.length]}"><small>← SEBELUMNYA</small><span>${prev.title}</span></button><button type="button" data-pd="${keys[(idx+1)%keys.length]}"><small>BERIKUTNYA →</small><span>${next.title}</span></button>`,'pd-nav');
  return h;
}
function openProject(key){
  if(!projectDetail[key]) return;
  const wasOpen=detailView.classList.contains('open');
  detailInner.innerHTML=renderProject(key);
  detailView.classList.add('open'); detailClose.style.display='block';
  if(!wasOpen) lockScroll();
  detailView.scrollTop=0;
}
document.querySelectorAll('[data-project]').forEach(item=>{
  item.addEventListener('click',()=>openProject(item.dataset.project));
});
// BUG FIX: tombol Sebelumnya/Berikutnya di bawah popup proyek (data-pd) dulu gak punya handler klik sama sekali.
// Sekarang pakai event delegation di detailInner biar tetap jalan walau isinya di-render ulang.
document.addEventListener('click',e=>{
  const b=e.target.closest('#detailInner [data-pd]');
  if(b) openProject(b.dataset.pd);
});

// ---- ACHIEVEMENTS — "MORE DETAILS" (versi lengkap & profesional; teks otomatis dari achHistory + bahasa aktif) ----
const TIER_LABEL={gold:['Peringkat Terbaik','Top Rank'],silver:['Prestasi Unggul','Outstanding Achievement'],bronze:['Prestasi Berkembang','Growing Achievement']};
function rankNum(r){ return parseInt(String(r).replace(/[^0-9]/g,''),10)||99; }
function levelOf(d){ return /SMKS|SMK/.test(d.school)?'smk':(/^SMP/.test(d.school)?'smp':'sd'); }
function renderAchDetail(idx){
  const d=achHistory[idx], lv=levelOf(d), n=achHistory.length;
  const older=achHistory[idx+1], newer=achHistory[idx-1];
  const gold=achHistory.filter(x=>x.tier==='gold').length, silver=achHistory.filter(x=>x.tier==='silver').length, bronze=achHistory.filter(x=>x.tier==='bronze').length;
  const lvName={smk:T('Sekolah Menengah Kejuruan (SMK)','Vocational High School (SMK)'),smp:T('Sekolah Menengah Pertama (SMP)','Junior High School (SMP)'),sd:T('Sekolah Dasar (SD)','Elementary School (SD)')}[lv];
  let summary;
  if(d.tier==='gold') summary=T(`Pada periode ${d.period} di ${d.school}, Arka menempati peringkat ${d.rank} di kelas. Capaian ini menunjukkan konsistensi belajar, disiplin mengerjakan tugas, dan fokus yang kuat pada bidang jaringan serta pengembangan web.`,`In the ${d.period} period at ${d.school}, Arka ranked ${d.rank} in class. This reflects consistent study habits, disciplined work on assignments, and a strong focus on networking and web development.`);
  else if(d.tier==='silver') summary=T(`Pada periode ${d.period} di ${d.school}, Arka berada di peringkat ${d.rank} dan secara konsisten bertahan di jajaran terbaik kelas selama beberapa tahun berturut-turut.`,`In the ${d.period} period at ${d.school}, Arka ranked ${d.rank} and stayed among the top of the class for several years in a row.`);
  else summary=T(`Pada periode ${d.period} di ${d.school}, Arka berada di peringkat ${d.rank}. Masa ini menjadi fase adaptasi dan pembentukan kebiasaan belajar yang kemudian mendorong peningkatan peringkat di jenjang berikutnya.`,`In the ${d.period} period at ${d.school}, Arka ranked ${d.rank}. This was a phase of adjustment and building study habits that later drove the rise in rank at the next level.`);
  let trend;
  if(!older) trend=T('Ini adalah titik awal perjalanan akademik yang tercatat — fondasi dari seluruh peningkatan setelahnya.','This is the earliest recorded point of the academic journey — the foundation of every improvement after it.');
  else{
    const diff=rankNum(older.rank)-rankNum(d.rank);
    trend=diff>0?T(`Naik ${diff} peringkat dibandingkan periode sebelumnya (${older.period}, peringkat ${older.rank}).`,`Up ${diff} rank${diff>1?'s':''} compared with the previous period (${older.period}, rank ${older.rank}).`)
      :diff===0?T(`Mempertahankan peringkat yang sama dengan periode sebelumnya (${older.period}, peringkat ${older.rank}).`,`Maintained the same rank as the previous period (${older.period}, rank ${older.rank}).`)
      :T(`Turun dari periode sebelumnya (${older.period}, peringkat ${older.rank}) — menjadi bahan evaluasi dan motivasi untuk bangkit.`,`Down from the previous period (${older.period}, rank ${older.rank}) — used as evaluation and motivation to bounce back.`);
  }
  const factors={
    smk:[T('Konsistensi belajar dan manajemen waktu','Consistent study habits and time management'),T('Fokus pada jaringan (MikroTik) dan pengembangan web','Focus on networking (MikroTik) and web development'),T('Praktik langsung lewat proyek nyata di luar materi sekolah','Hands-on practice through real projects beyond the school curriculum'),T('Bimbingan wali kelas dan guru produktif TJKT','Guidance from the homeroom teacher and TJKT vocational teachers')],
    smp:[T('Membangun kebiasaan belajar mandiri','Building independent study habits'),T('Adaptasi dengan mata pelajaran yang lebih kompleks','Adapting to more complex subjects'),T('Dukungan wali kelas dan teman sekelas','Support from homeroom teachers and classmates')],
    sd:[T('Fondasi kemampuan dasar membaca, menulis, dan berhitung','A foundation in basic reading, writing, and math'),T('Rasa ingin tahu dan semangat belajar sejak dini','Curiosity and a love of learning from an early age'),T('Dukungan keluarga dan guru','Support from family and teachers')]
  }[lv];
  const meta=[[T('Periode','Period'),d.period],[T('Institusi','Institution'),d.school],[T('Jenjang','Level'),lvName],[T('Peringkat','Rank'),d.rank],[T('Kategori','Category'),T(TIER_LABEL[d.tier][0],TIER_LABEL[d.tier][1])],[T('Urutan Timeline','Timeline Position'),`${n-idx} / ${n}`]];
  const tl=achHistory.map((x,i)=>`<li class="${i===idx?'on':''}"><button type="button" data-ach="${i}"><span class="ach-tl-r">#${x.rank}</span><span class="ach-tl-p">${x.period}</span><span class="ach-tl-s">${x.school}</span></button></li>`).join('');
  const stats=`<div class="ach-stats"><div><b>${n}</b><span>${T('Periode tercatat','Recorded periods')}</span></div><div><b>${gold}</b><span>${T('Peringkat 1','Rank 1')}</span></div><div><b>${silver}</b><span>${T('Peringkat 2–3','Rank 2–3')}</span></div><div><b>${bronze}</b><span>${T('Peringkat 4+','Rank 4+')}</span></div></div>`;
  return `<div class="card-tag">${d.period}</div><h3>Rank ${d.rank}</h3><p class="pd-lead">${d.school} — ${T(TIER_LABEL[d.tier][0],TIER_LABEL[d.tier][1])}</p>
  <dl class="pd-meta">${meta.map(m=>`<div><dt>${m[0]}</dt><dd>${m[1]}</dd></div>`).join('')}</dl>
  <div class="pd-section"><h4>${T('Ringkasan','Summary')}</h4><p>${summary}</p></div>
  <div class="pd-section"><h4>${T('Perkembangan','Progress')}</h4><p>${trend}</p></div>
  <div class="pd-section"><h4>${T('Faktor Pendukung','Supporting Factors')}</h4><ul class="pd-list">${factors.map(f=>`<li>${f}</li>`).join('')}</ul></div>
  <div class="pd-section"><h4>${T('Ringkasan Perjalanan Akademik','Academic Journey Overview')}</h4>${stats}<ol class="ach-tl">${tl}</ol></div>
  <div class="pd-nav"><button type="button" data-ach="${older?idx+1:idx}" ${older?'':'disabled'}><small>${T('← PERIODE SEBELUMNYA','← EARLIER PERIOD')}</small><span>${older?older.period:'—'}</span></button><button type="button" data-ach="${newer?idx-1:idx}" ${newer?'':'disabled'}><small>${T('PERIODE BERIKUTNYA →','NEXT PERIOD →')}</small><span>${newer?newer.period:'—'}</span></button></div>`;
}
let _achDetailIdx=-1;
function openAchDetail(idx){
  const wasOpen=detailView.classList.contains('open');
  _achDetailIdx=idx; detailInner.innerHTML=renderAchDetail(idx);
  detailView.classList.add('open'); detailClose.style.display='block';
  if(!wasOpen) lockScroll(); // BUG FIX: dulu pakai body.style.overflow='hidden' yang gak pernah dibalikin pas ditutup (scroll jadi nyangkut)
  detailView.scrollTop=0;
}
document.getElementById('achMoreBtn').addEventListener('click',()=>openAchDetail(achIndex));
document.addEventListener('click',e=>{
  const b=e.target.closest('#detailInner [data-ach]'); if(b && !b.disabled) openAchDetail(parseInt(b.dataset.ach,10));
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
window.addEventListener('scroll',()=>{ header.classList.toggle('scrolled', window.scrollY>40); },{passive:true});

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
  blue:{navy:'#0A2E4F',navy2:'#0F3C66',accent:'#D71920',accent2:'#2563B0'},
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
  let cgX=0, cgY=0, cgRaf=0;
  window.addEventListener('mousemove',e=>{
    cgX=e.clientX; cgY=e.clientY;
    if(!cgRaf) cgRaf=requestAnimationFrame(()=>{ cgRaf=0; cursorGlow.style.transform=`translate3d(${cgX}px, ${cgY}px, 0) translate(-50%,-50%)`; cursorGlow.classList.add('show'); }); // OPTIMASI: 1x per frame
  },{passive:true});
  window.addEventListener('mouseleave',()=>cursorGlow.classList.remove('show'));
}

// --- TILT 3D: sekarang jalan di mouse (hover) DAN layar sentuh (HP) ---
// BUG FIX HP: sebelumnya efek 3D cuma dengerin "mousemove" + diblok kalau bukan mouse beneran, jadi di HP gak ada
// yang gerak (kecuali ditahan lama, itu cuma hover palsu dari browser). Sekarang pakai pointer events: di HP cukup
// sentuh/tahan kartunya, dan miringnya ngikutin jari. Update dibatasi 1x per frame (requestAnimationFrame) biar ringan.
function attachTilt(el,opts){
  const target=opts.target||el;
  let raf=0, px=.5, py=.5, live=false;
  function paint(){
    raf=0; if(!live) return;
    if(opts.enabled && !opts.enabled()) return;
    target.style.transform=opts.transform(px,py);
    if(opts.onMove) opts.onMove(px,py);
  }
  function update(e){
    const r=el.getBoundingClientRect();
    px=(e.clientX-r.left)/r.width; py=(e.clientY-r.top)/r.height;
    if(!raf) raf=requestAnimationFrame(paint);
  }
  function start(){ live=true; if(opts.onStart) opts.onStart(); }
  function end(){
    if(!live && !opts.alwaysReset) return;
    live=false; if(raf){ cancelAnimationFrame(raf); raf=0; }
    if(opts.onEnd) opts.onEnd(); else target.style.transform='';
  }
  el.addEventListener('pointerenter',e=>{ if(e.pointerType==='mouse' && animOk()) start(); },{passive:true});
  el.addEventListener('pointerdown',e=>{ if(e.pointerType!=='mouse' && animOk()){ start(); update(e); } },{passive:true});
  el.addEventListener('pointermove',e=>{
    if(!animOk()) return;
    if(e.pointerType==='mouse' && !live) start();
    if(live) update(e);
  },{passive:true});
  ['pointerup','pointercancel'].forEach(t=>el.addEventListener(t,e=>{ if(e.pointerType!=='mouse') end(); },{passive:true}));
  el.addEventListener('pointerleave',end,{passive:true});
}

// --- tilt 3D di carousel card, project item, testimonial card ---
document.querySelectorAll('.tilt-card').forEach(card=>{
  attachTilt(card,{
    transform:(x,y)=>`perspective(800px) rotateX(${(0.5-y)*10}deg) rotateY(${(x-0.5)*10}deg) translateY(-6px)`,
    onStart:()=>{ card.style.transition='transform .08s linear'; card.classList.add('tilting'); },
    onMove:(x,y)=>{ card.style.setProperty('--gx',(x*100).toFixed(0)+'%'); card.style.setProperty('--gy',(y*100).toFixed(0)+'%'); },
    onEnd:()=>{ card.style.transform=''; card.style.transition=''; card.classList.remove('tilting'); }
  });
});

// --- trophy 3D: ikut muter sesuai posisi kursor/jari di area Achievements ---
const achTrophyStageEl=document.getElementById('achTrophyStage');
const achRbMain=document.querySelector('.ach-rb-main');
if(achTrophyStageEl && achRbMain){
  attachTilt(achRbMain,{
    target:achTrophyStageEl,
    transform:(x,y)=>`perspective(900px) rotateX(${(0.5-y)*22}deg) rotateY(${(x-0.5)*34}deg)`,
    onEnd:()=>{ achTrophyStageEl.style.transform='perspective(900px) rotateX(0deg) rotateY(0deg)'; }
  });
}

// --- foto 3D di sisi hero: miring ngikutin kursor/jari (bisa dimatikan di panel Pengaturan) ---
// (catatan: di layar HP kecil foto ini memang disembunyikan lewat CSS biar gak numpuk sama judul; di tablet/layar lebar jalan)
const heroSectionEl=document.getElementById('hero');
const heroFigureImg=document.getElementById('heroFigureImg');
if(heroSectionEl && heroFigureImg){
  attachTilt(heroSectionEl,{
    target:heroFigureImg,
    enabled:()=>heroTiltEnabled,
    transform:(x,y)=>`perspective(1200px) rotateX(${(0.5-y)*14}deg) rotateY(${(x-0.5)*26}deg) translateZ(10px)`,
    onEnd:()=>{ heroFigureImg.style.transform=''; }
  });
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
// kedalaman (depth). OPTIMASI: dulu SEMUA gambar dihitung ulang (getBoundingClientRect) tiap frame scroll;
// sekarang cuma gambar yang lagi dekat layar (dipantau IntersectionObserver) yang dihitung.
// =====================================
(function initScrollParallax(){
  if(reduceMotion) return;
  const items=[...document.querySelectorAll('.proj-item .ph img, .trophy-item .ph img')];
  if(!items.length) return;
  const near=new Set(); let ticking=false;
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting) near.add(e.target); else near.delete(e.target); });
    schedule();
  },{rootMargin:'150px 0px'});
  items.forEach(img=>io.observe(img));
  function update(){
    ticking=false;
    if(document.documentElement.classList.contains('animations-off')){
      near.forEach(img=>img.style.setProperty('--parallax','0px'));
      return;
    }
    const vh=window.innerHeight, list=[...near];
    const rects=list.map(img=>img.getBoundingClientRect()); // baca semua dulu, baru tulis (hindari layout thrashing)
    list.forEach((img,i)=>{
      const r=rects[i];
      const rel=(r.top+r.height/2-vh/2)/vh;
      const offset=Math.max(-1,Math.min(1,rel))*-16; // maksimal geser 16px, lembut aja
      img.style.setProperty('--parallax',offset.toFixed(1)+'px');
    });
  }
  function schedule(){ if(!ticking){ requestAnimationFrame(update); ticking=true; } }
  window.addEventListener('scroll',schedule,{passive:true});
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
// THEME MUSIC PLAYER — 3 lagu, prev/next, playlist, loop infinite, waveform progress, glow ngikutin bass
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
  const $=id=>document.getElementById(id);
  const titleEl=$('tpTrackTitle'), playBtn=$('tpPlay'), playIcon=$('tpPlayIcon'), prevBtn=$('tpPrev'), nextBtn=$('tpNext');
  const wf=$('tpWaveform'), timeCurrent=$('tpTimeCurrent'), timeTotal=$('tpTimeTotal');
  const loopBtn=$('tpLoop'), likeBtn=$('tpLike'), countEl=$('tpCount'), listEl=$('tpPlaylist'), glowEl=$('tpGlow'), ringEl=$('tpRing');
  const ICON_PLAY='<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  const ICON_PAUSE='<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

  // waveform dekoratif (tinggi tiap batang tetap, rata tengah) — dua lapis: abu-abu (dasar) + merah (yang udah diputar, di-clip)
  let bars='';
  for(let i=0;i<46;i++){
    const v=Math.abs(Math.sin(i*.9)*Math.cos(i*.33+1.2));
    bars+=`<span style="height:${Math.round(22+v*78)}%"></span>`;
  }
  wf.innerHTML=`<div class="tp-wf tp-wf-base">${bars}</div><div class="tp-wf tp-wf-fill">${bars}</div>`;

  let trackIndex=0, userPaused=true, duckedResume=false, fadeId=0;
  // MODE ULANG (BUG FIX: tombol infinite dulu cuma on/off tanpa tanda yang jelas & gak bisa ngulang 1 lagu):
// 'on' = ulangi SEMUA lagu terus-menerus (default) → 'one' = ulangi 1 lagu ini terus (ada angka 1) → 'off' = berhenti di lagu terakhir
let loopMode='on'; try{ const sv=localStorage.getItem('arkaThemeLoop'); if(sv==='off'||sv==='one') loopMode=sv; }catch(e){}
  let likes=[]; try{ likes=JSON.parse(localStorage.getItem('arkaThemeLikes')||'[]'); }catch(e){}

  function fmtTime(sec){
    if(!isFinite(sec)||sec<0) sec=0;
    const m=Math.floor(sec/60), s=Math.floor(sec%60);
    return m+':'+String(s).padStart(2,'0');
  }
  function renderPlaylist(){
    listEl.innerHTML=themeTracks.map((t,i)=>`<li class="${i===trackIndex?'active':''}"><button type="button" data-i="${i}"><span class="tp-pl-num">${i+1}</span><span class="tp-pl-name">${t.title}</span></button></li>`).join('');
  }
  function syncLoopUI(){
    audio.loop=(loopMode==='one');
    loopBtn.classList.toggle('on',loopMode!=='off'); loopBtn.dataset.mode=loopMode;
    loopBtn.setAttribute('aria-pressed',String(loopMode!=='off'));
    const lbl=loopMode==='on'?T('Ulangi semua lagu: NYALA','Repeat all: ON'):loopMode==='one'?T('Ulangi 1 lagu ini terus: NYALA','Repeat this song: ON'):T('Ulangi: MATI (berhenti setelah lagu terakhir)','Repeat: OFF (stops after the last song)');
    loopBtn.title=lbl; loopBtn.setAttribute('aria-label',lbl);
  }
  document.addEventListener('arkalang',syncLoopUI);
  function syncLikeUI(){ const on=likes.indexOf(themeTracks[trackIndex].src)>-1; likeBtn.classList.toggle('on',on); likeBtn.setAttribute('aria-pressed',String(on)); }
  function setProgress(p){ wf.style.setProperty('--p',(p*100).toFixed(2)+'%'); wf.setAttribute('aria-valuenow',String(Math.round(p*100))); }

  function loadTrack(i, autoplay){
    trackIndex=(i+themeTracks.length)%themeTracks.length;
    const t=themeTracks[trackIndex];
    titleEl.textContent=t.title;
    countEl.textContent=(trackIndex+1)+' / '+themeTracks.length;
    audio.src=t.src;
    setProgress(0); timeCurrent.textContent='0:00'; timeTotal.textContent='0:00';
    renderPlaylist(); syncLikeUI();
    if(autoplay){ userPaused=false; ensureAnalyser(); audio.play().catch(()=>{ /* diblokir browser atau file belum ada — diam aja, user tinggal pencet play lagi */ }); }
  }
  function setPlayingUI(isPlaying){
    card.classList.toggle('is-playing', isPlaying);
    playIcon.innerHTML = isPlaying ? ICON_PAUSE : ICON_PLAY;
    playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
    syncFx();
  }

  // ---- ANALYSER (bass/volume) — hidup cuma pas lagu diputar & kartunya kelihatan, 30fps (20fps di Mode Ringan) ----
  // Catatan: Web Audio butuh web dibuka lewat http(s) (hosting/localhost). Kalau dibuka langsung dari file:// browser
  // bikin suara jadi BISU kalau disambung ke analyser, jadi di mode itu glow pakai simulasi denyut biar tetap hidup.
  let actx=null, analyser=null, fdata=null, analyserOK=false, level=0, peak=.25, lastFrame=0, rafId=0, zeroFrames=0, visible=true;
  function ensureAnalyser(){
    if(actx){ if(actx.state==='suspended') actx.resume().catch(()=>{}); return; }
    if(!/^https?:$/.test(location.protocol)) return;
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    try{
      actx=new AC(); analyser=actx.createAnalyser(); analyser.fftSize=1024; analyser.smoothingTimeConstant=.78;
      const src=actx.createMediaElementSource(audio); src.connect(analyser); analyser.connect(actx.destination);
      fdata=new Uint8Array(analyser.frequencyBinCount); analyserOK=true;
      if(actx.state==='suspended') actx.resume().catch(()=>{});
    }catch(e){ analyserOK=false; }
  }
  function resetFx(){
    level=0;
    glowEl.style.opacity=''; glowEl.style.transform=''; ringEl.style.opacity=''; ringEl.style.transform=''; wf.style.transform='';
  }
  function frame(ts){
    rafId=requestAnimationFrame(frame);
    if(ts-lastFrame < (document.documentElement.classList.contains('perf-lite')?50:33)) return;
    lastFrame=ts;
    if(!animOk()){ resetFx(); return; }
    let target=0;
    if(analyserOK){
      analyser.getByteFrequencyData(fdata);
      const avg=(fdata[1]+fdata[2]+fdata[3]+fdata[4]+fdata[5])/5/255; // ~43–215Hz = area bass
      if(avg<=0){ zeroFrames++; if(zeroFrames>90 && audio.currentTime>4) analyserOK=false; } else zeroFrames=0;
      peak=Math.max(avg, peak*.997, .2);
      target=Math.pow(avg/peak,3); // ditajamkan: cuma "pukulan" bass yang bikin glow melonjak
    } else {
      const t=(ts%520)/520; target=Math.pow(1-t,3)*.85+Math.random()*.08; // simulasi denyut (~115 BPM)
    }
    level+=(target-level)*(target>level?.55:.14);
    glowEl.style.opacity=(.14+level*.86).toFixed(3);
    glowEl.style.transform='scale('+(.92+level*.3).toFixed(3)+')';
    ringEl.style.opacity=(level*.9).toFixed(3);
    ringEl.style.transform='scale('+(1+level*.28).toFixed(3)+')';
    wf.style.transform='scaleY('+(1+level*.22).toFixed(3)+')';
  }
  function syncFx(){
    const should=!audio.paused && visible && !document.hidden;
    if(should && !rafId){ lastFrame=0; rafId=requestAnimationFrame(frame); }
    else if(!should && rafId){ cancelAnimationFrame(rafId); rafId=0; if(audio.paused) resetFx(); }
  }
  if('IntersectionObserver' in window) new IntersectionObserver(es=>{ visible=es[0].isIntersecting; syncFx(); }).observe(card);
  document.addEventListener('visibilitychange',syncFx);

  // ---- kontrol ----
  playBtn.addEventListener('click',()=>{
    if(audio.paused){
      userPaused=false; duckedResume=false; ensureAnalyser();
      audio.play().catch(()=>{ titleEl.textContent=themeTracks[trackIndex].title+' — file belum ada'; });
    } else { userPaused=true; audio.pause(); }
  });
  prevBtn.addEventListener('click',()=>{ duckedResume=false; loadTrack(trackIndex-1, true); });
  nextBtn.addEventListener('click',()=>{ duckedResume=false; loadTrack(trackIndex+1, true); });
  listEl.addEventListener('click',e=>{ const b=e.target.closest('button[data-i]'); if(b){ duckedResume=false; loadTrack(parseInt(b.dataset.i,10), true); } });
  loopBtn.addEventListener('click',()=>{ loopMode=loopMode==='on'?'one':(loopMode==='one'?'off':'on'); try{ localStorage.setItem('arkaThemeLoop',loopMode); }catch(e){} syncLoopUI(); });
  likeBtn.addEventListener('click',()=>{
    const src=themeTracks[trackIndex].src, k=likes.indexOf(src);
    if(k>-1) likes.splice(k,1); else likes.push(src);
    try{ localStorage.setItem('arkaThemeLikes',JSON.stringify(likes)); }catch(e){}
    syncLikeUI();
  });
  audio.addEventListener('play',()=>{
    setPlayingUI(true);
    // lagu dinyalain → video pilihan yang ada suaranya dijeda biar gak tabrakan
    document.querySelectorAll('.featured-video video').forEach(v=>{ if(!v.paused && !v.muted) v.pause(); });
  });
  audio.addEventListener('pause',()=>setPlayingUI(false));
  audio.addEventListener('ended',()=>{
    // (mode 'one' ditangani langsung oleh audio.loop=true, jadi event ini gak dipanggil di mode itu)
    if(trackIndex===themeTracks.length-1 && loopMode==='off'){ loadTrack(0,false); setPlayingUI(false); } // loop mati: berhenti setelah lagu terakhir
    else loadTrack(trackIndex+1, true); // loop nyala: lanjut terus & muter lagi dari lagu pertama
  });
  audio.addEventListener('loadedmetadata',()=>{ timeTotal.textContent=fmtTime(audio.duration); });
  function updateTime(){
    timeCurrent.textContent=fmtTime(audio.currentTime);
    if(audio.duration) setProgress(audio.currentTime/audio.duration);
  }
  audio.addEventListener('timeupdate',updateTime);
  audio.addEventListener('error',()=>{
    setPlayingUI(false);
    titleEl.textContent=themeTracks[trackIndex].title+' — file belum ada';
  });
  // klik / geser di waveform buat loncat ke bagian lagu tertentu (mouse & sentuhan)
  let dragging=false;
  function seekFrom(e){
    if(!audio.duration) return;
    const r=wf.getBoundingClientRect();
    audio.currentTime=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))*audio.duration; updateTime();
  }
  wf.addEventListener('pointerdown',e=>{ dragging=true; try{ wf.setPointerCapture(e.pointerId); }catch(_){} seekFrom(e); });
  wf.addEventListener('pointermove',e=>{ if(dragging) seekFrom(e); });
  ['pointerup','pointercancel'].forEach(t=>wf.addEventListener(t,()=>{ dragging=false; }));
  wf.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'){ audio.currentTime=Math.min(audio.duration||0,audio.currentTime+5); e.preventDefault(); }
    if(e.key==='ArrowLeft'){ audio.currentTime=Math.max(0,audio.currentTime-5); e.preventDefault(); }
  });

  // ---- dipakai modul Video Pilihan: musik "ngalah" (fade lalu pause) pas video diputar, lanjut lagi pas video ditinggalin ----
  window.arkaTheme={
    isPlaying:()=>!audio.paused,
    duck(){
      if(audio.paused) return;
      duckedResume=true;
      const v0=audio.volume, token=++fadeId; let k=0;
      const id=setInterval(()=>{
        if(token!==fadeId){ clearInterval(id); audio.volume=v0; return; }
        k++; audio.volume=Math.max(0,v0*(1-k/8));
        if(k>=8){ clearInterval(id); audio.pause(); audio.volume=v0; }
      },40);
    },
    release(){
      fadeId++;
      if(duckedResume){
        duckedResume=false;
        if(audio.paused && !userPaused) audio.play().catch(()=>{});
      }
    }
  };

  syncLoopUI(); loadTrack(0,false);
})();

// =====================================
// CAROUSEL
// =====================================
const carousel=document.getElementById('carousel');
// langkah geser = lebar 1 kartu + jarak (bukan angka tetap 360px) biar kartu selalu pas rata di tepi
function carStep(){ const c=carousel.querySelector('.card'); return c ? c.getBoundingClientRect().width+20 : 360; }
document.getElementById('carPrev').addEventListener('click',()=>carousel.scrollBy({left:-carStep(),behavior:'smooth'}));
document.getElementById('carNext').addEventListener('click',()=>carousel.scrollBy({left:carStep(),behavior:'smooth'}));

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
    else carousel.scrollBy({left:carStep(),behavior:'smooth'});
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
    detailInner.innerHTML=`<div class="ph detail-banner" data-label="${card.dataset.detail}.webp"><img src="images/${card.dataset.detail}.webp" alt="${d.title}" loading="lazy" onload="this.parentElement.classList.add('has-img')" onerror="this.remove()"></div><div class="card-tag">${d.tag}</div><h3>${d.title}</h3><p>${d.body}</p>${d.extra||''}`;
    if(card.dataset.detail==='suggestions') detailInner.insertAdjacentHTML('beforeend',suggestFormHTML());
    detailView.classList.add('open'); detailClose.style.display='block'; lockScroll();
  });
});

// =====================================
// FORM SUGGESTIONS — saran / kekurangan / tambahan + rating, dikirim ke WhatsApp pribadi (WA_PRIBADI di atas)
// Nama & Kelas OPSIONAL; Jenis, Pesan, dan Rating wajib. Pesan baru benar-benar terkirim setelah pengunjung menekan kirim di WhatsApp.
// =====================================
const sugState={name:'',cls:'',type:'saran',msg:'',rating:0};
const SUG_TYPES=[['saran','Saran','Suggestion'],['kekurangan','Kekurangan','Shortcoming'],['tambahan','Tambahan','Addition']];
function suggestFormHTML(){
  const esc=v=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  return `<div class="sug-form" id="sugForm"><h4>${T('Kirim Saran & Masukan','Send Suggestions & Feedback')}</h4>
  <p class="sug-sub">${T('Isi form di bawah, lalu pesanmu dikirim lewat WhatsApp ke aku.','Fill in the form below and your message will be sent to me via WhatsApp.')}</p>
  <label class="sug-field"><span>${T('Nama (opsional)','Name (optional)')}</span><input type="text" id="sugName" maxlength="60" value="${esc(sugState.name)}" placeholder="${T('Nama kamu','Your name')}"></label>
  <label class="sug-field"><span>${T('Kelas / Asal (opsional)','Class / From (optional)')}</span><input type="text" id="sugCls" maxlength="60" value="${esc(sugState.cls)}" placeholder="${T('Contoh: XII TJKT 2','e.g. XII TJKT 2')}"></label>
  <div class="sug-lbl">${T('Jenis masukan','Type of feedback')}</div>
  <div class="sug-types">${SUG_TYPES.map(t=>`<button type="button" class="${sugState.type===t[0]?'on':''}" data-sug-type="${t[0]}">${T(t[1],t[2])}</button>`).join('')}</div>
  <label class="sug-field"><span>${T('Pesan','Message')}</span><textarea id="sugMsg" rows="5" maxlength="800" placeholder="${T('Tulis saran, kekurangan, atau tambahan yang kamu mau...','Write your suggestion, shortcoming, or addition...')}">${esc(sugState.msg)}</textarea></label>
  <div class="sug-lbl">${T('Rating','Rating')}</div>
  <div class="sug-stars" role="radiogroup" aria-label="Rating">${[1,2,3,4,5].map(n=>`<button type="button" class="${n<=sugState.rating?'on':''}" data-sug-star="${n}" role="radio" aria-checked="${n===sugState.rating}" aria-label="${n}/5">★</button>`).join('')}</div>
  <div class="sug-err" id="sugErr" role="alert"></div>
  <button class="rb-cta sug-send" id="sugSend" type="button">${T('Kirim via WhatsApp','Send via WhatsApp')}</button>
  <p class="sug-note">${T('Kamu akan diarahkan ke WhatsApp. Pesan baru terkirim setelah kamu menekan kirim di sana.','You\'ll be taken to WhatsApp. The message is only sent once you press send there.')}</p></div>`;
}
document.addEventListener('input',e=>{
  if(e.target.id==='sugName') sugState.name=e.target.value;
  else if(e.target.id==='sugCls') sugState.cls=e.target.value;
  else if(e.target.id==='sugMsg'){ sugState.msg=e.target.value; const er=document.getElementById('sugErr'); if(er) er.textContent=''; }
});
document.addEventListener('click',e=>{
  const form=e.target.closest('#sugForm'); if(!form) return;
  const ty=e.target.closest('[data-sug-type]');
  if(ty){ sugState.type=ty.dataset.sugType; form.querySelectorAll('[data-sug-type]').forEach(b=>b.classList.toggle('on',b===ty)); return; }
  const st=e.target.closest('[data-sug-star]');
  if(st){ sugState.rating=parseInt(st.dataset.sugStar,10); form.querySelectorAll('[data-sug-star]').forEach(b=>{ const n=parseInt(b.dataset.sugStar,10); b.classList.toggle('on',n<=sugState.rating); b.setAttribute('aria-checked',String(n===sugState.rating)); }); const er=document.getElementById('sugErr'); if(er) er.textContent=''; return; }
  if(e.target.closest('#sugSend')){
    const er=document.getElementById('sugErr');
    if(!sugState.msg.trim()){ er.textContent=T('Pesan belum diisi.','Please write a message.'); return; }
    if(!sugState.rating){ er.textContent=T('Rating belum dipilih.','Please choose a rating.'); return; }
    const jenis={saran:'Saran',kekurangan:'Kekurangan',tambahan:'Tambahan'}[sugState.type]||'Saran';
    const text=['*Masukan dari Website Portofolio*','','Nama: '+(sugState.name.trim()||'Anonim'),'Kelas/Asal: '+(sugState.cls.trim()||'-'),'Jenis: '+jenis,'Rating: '+'⭐'.repeat(sugState.rating)+' ('+sugState.rating+'/5)','','Pesan:',sugState.msg.trim()].join('\n');
    const a=document.createElement('a'); a.href='https://wa.me/'+WA_PRIBADI+'?text='+encodeURIComponent(text); a.target='_blank'; a.rel='noopener noreferrer';
    document.body.appendChild(a); a.click(); a.remove();
    sugState.name=sugState.cls=sugState.msg=''; sugState.rating=0; sugState.type='saran';
    form.outerHTML=suggestFormHTML().replace('<div class="sug-err" id="sugErr" role="alert"></div>','<div class="sug-err ok" id="sugErr" role="status">'+T('Terima kasih! WhatsApp dibuka — tinggal tekan kirim.','Thank you! WhatsApp is opening — just press send.')+'</div>');
  }
});

// =====================================
// SKILLS — TOOL BADGE POPUP (EDIT TOOLS DI SINI)
// =====================================
const skillTools={
  web:{title:"Web Development", tools:[
    {abbr:"HT",color:"#e34c26",name:"HTML",img:"html.webp",desc:"Bahasa dasar untuk menyusun struktur halaman — heading, paragraf, gambar, dan elemen konten lainnya."},
    {abbr:"CS",color:"#2965f1",name:"CSS",img:"css.webp",desc:"Mengatur tampilan visual: warna, layout, spacing, dan responsivitas di berbagai ukuran layar."},
    {abbr:"JS",color:"#c9a227",name:"JavaScript",img:"javascript.webp",desc:"Menambahkan interaktivitas — menu, animasi, dan logika di sisi browser."}
  ]},
  networking:{title:"Networking", tools:[
    {abbr:"MT",color:"#2b3a42",name:"MikroTik",img:"mikrotik.webp",desc:"Konfigurasi router, routing, dan manajemen bandwidth untuk jaringan lokal maupun lab sekolah."},
    {abbr:"NW",color:"#1b4e8c",name:"Network Config",img:"network-config.webp",desc:"Setup, pengkabelan, dan troubleshooting jaringan dari sisi hardware maupun software."}
  ]},
  hardware:{title:"Hardware", tools:[
    {abbr:"PC",color:"#4a4a4a",name:"PC Hardware",img:"pc-hardware.webp",desc:"Perakitan komputer dari komponen dasar serta pemeliharaan rutin perangkat."},
    {abbr:"TS",color:"#6b6b6b",name:"Troubleshooting",img:"troubleshooting.webp",desc:"Mendiagnosa dan memperbaiki masalah umum pada PC dan perangkat jaringan."}
  ]},
  creative:{title:"Creative Editing", tools:[
    {abbr:"Pr",color:"#26205c",name:"Premiere Pro",img:"premiere-pro.webp",desc:"Software editing video utama — memotong, menyusun timeline, color grading, dan mixing audio untuk hasil akhir."},
    {abbr:"Ae",color:"#1c1830",name:"After Effects",img:"after-effects.webp",desc:"Dipakai untuk motion graphics, visual effect, dan animasi teks yang memperkuat video."},
    {abbr:"AM",color:"#7c3aed",name:"Alight Motion",img:"alight-motion.webp",desc:"Editor mobile untuk mengedit dan membuat animasi cepat langsung dari HP, cocok untuk konten singkat."}
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


// =====================================
// OPTIMASI: JEDA ANIMASI SECTION YANG LAGI GAK KELIHATAN
// =====================================
// Kelas .offscreen ditempel ke section/marquee yang di luar layar → CSS ngejeda animasi infinite di dalamnya
// (blob, partikel, zoom background, dll). Begitu masuk layar lagi, otomatis jalan lagi — tampilannya sama persis.
(function initOffscreenPause(){
  if(!('IntersectionObserver' in window)) return;
  const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('offscreen',!e.isIntersecting)),{rootMargin:'120px 0px'});
  document.querySelectorAll('section, .marquee').forEach(el=>io.observe(el));
  document.querySelectorAll('img').forEach(img=>{ img.decoding='async'; });
})();

// =====================================
// VIDEO PILIHAN — autoplay cuma pas kelihatan + setting autoplay + musik tema ngalah
// =====================================
(function initFeaturedVideos(){
  const videos=[...document.querySelectorAll('.featured-video video')];
  const KEY='arkaVideoAutoplay';
  let autoplayOn=true; try{ autoplayOn=localStorage.getItem(KEY)!=='off'; }catch(e){}
  const vis=new Map(); videos.forEach(v=>vis.set(v,false));
  const theme=()=>window.arkaTheme;
  const anyVisible=()=>videos.some(v=>vis.get(v));
  const tryPlay=v=>{ const p=v.play(); if(p&&p.catch) p.catch(()=>{}); };
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(en=>{
      const v=en.target; vis.set(v,en.isIntersecting);
      if(en.isIntersecting){ if(autoplayOn) tryPlay(v); }
      else v.pause(); // OPTIMASI: video di luar layar dijeda (hemat CPU/baterai/kuota)
      if(!anyVisible() && theme()) theme().release(); // video udah ditinggalin → musik tema lanjut lagi
    }),{threshold:.35});
    videos.forEach(v=>io.observe(v));
  }
  // video mulai diputar (otomatis / ditekan user) di layar → musik tema dijeda biar suara videonya kedengeran
  videos.forEach(v=>v.addEventListener('play',()=>{ if(vis.get(v) && theme()) theme().duck(); }));
  const tog=document.getElementById('videoAutoplayToggle');
  if(tog){
    tog.checked=autoplayOn;
    tog.addEventListener('change',()=>{
      autoplayOn=tog.checked;
      try{ localStorage.setItem(KEY,autoplayOn?'on':'off'); }catch(e){}
      videos.forEach(v=>{ if(autoplayOn){ if(vis.get(v)) tryPlay(v); } else v.pause(); });
      if(!autoplayOn && !videos.some(v=>!v.paused) && theme()) theme().release();
    });
  }
})();

// =====================================
// LOCAL CLOCK — jam + zona waktu lokal di header (sebelah "Open to Collab")
// =====================================
// GANTI zona waktu di sini kalau pindah (contoh: 'Asia/Makassar' = WITA, 'Asia/Jayapura' = WIT) + label-nya di index.html
(function initLocalClock(){
  const el=document.getElementById('localTime'); if(!el) return;
  const TZ='Asia/Jakarta', ZONE_LABEL='WIB';
  let fmt; try{ fmt=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:TZ}); }catch(e){ return; }
  function tick(){
    const parts=fmt.formatToParts(new Date()); let h='00',m='00';
    parts.forEach(p=>{ if(p.type==='hour') h=p.value; if(p.type==='minute') m=p.value; });
    el.textContent=(h==='24'?'00':h)+'.'+m+' '+ZONE_LABEL;
  }
  function loop(){ tick(); setTimeout(loop, 60000-(Date.now()%60000)+50); } // update pas ganti menit
  loop();
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) tick(); });
})();

// =====================================
// SIDE NAV — penanda posisi baca (scroll spy)
// =====================================
(function initSideNav(){
  const nav=document.getElementById('sideNav'), list=document.getElementById('sideNavList'), fill=document.getElementById('sideNavFill');
  if(!nav || !list) return;
  const items=[
    {id:'hero',label:'Home'},{id:'about',label:'About'},{id:'carousel-section',label:'Highlights'},{id:'projects',label:'Projects'},
    {id:'skills',label:'Skills'},{id:'media',label:'Media'},{id:'achievements',label:'Achievements'},
    {id:'connections',label:'Connections'},{id:'testimonials',label:'Testimonials'},{id:'contact',label:'Contact'}
  ].filter(i=>document.getElementById(i.id));
  list.innerHTML=items.map(i=>`<li><a href="#${i.id}" data-id="${i.id}" aria-label="${i.label}"><span class="sn-label">${i.label}</span><span class="sn-dot"></span></a></li>`).join('');
  function setActive(id){
    let idx=0;
    list.querySelectorAll('a').forEach((a,n)=>{ const on=a.dataset.id===id; a.classList.toggle('active',on); if(on) idx=n; });
    fill.style.transform='scaleY('+(items.length>1?idx/(items.length-1):0)+')';
  }
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) setActive(e.target.id); }),{rootMargin:'-45% 0px -50% 0px'});
    items.forEach(i=>io.observe(document.getElementById(i.id)));
  }
  setActive(items[0].id);
  requestAnimationFrame(()=>nav.classList.add('ready'));
})();

// =====================================
// PRESENTATION MODE — tampilan bersih (tanpa tombol/navigasi), cocok buat proyektor
// =====================================
(function initPresentation(){
  const root=document.documentElement;
  const btn=document.getElementById('presentBtn'), btn2=document.getElementById('presentToggleBtn');
  const exitBtn=document.getElementById('presentExit'), toast=document.getElementById('presentToast');
  let on=false, fsActive=false, exitT=0, toastT=0;
  function showExit(){ exitBtn.classList.add('show'); clearTimeout(exitT); exitT=setTimeout(()=>exitBtn.classList.remove('show'),2800); }
  function enter(){
    if(on) return; on=true;
    const so=document.getElementById('settingsOverlay'); if(so && so.classList.contains('open')) so.click();
    if(overlay.classList.contains('open')) closeMenu();
    root.classList.add('presenting');
    try{ const p=root.requestFullscreen ? root.requestFullscreen() : (root.webkitRequestFullscreen ? root.webkitRequestFullscreen() : null); if(p && p.catch) p.catch(()=>{}); }catch(e){}
    toast.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>toast.classList.remove('show'),3200);
    showExit();
  }
  function exit(){
    if(!on) return; on=false;
    root.classList.remove('presenting'); toast.classList.remove('show'); exitBtn.classList.remove('show');
    if(document.fullscreenElement && document.exitFullscreen){ fsActive=false; document.exitFullscreen().catch(()=>{}); }
  }
  const toggle=()=>on?exit():enter();
  if(btn) btn.addEventListener('click',toggle);
  if(btn2) btn2.addEventListener('click',enter);
  exitBtn.addEventListener('click',exit);
  document.addEventListener('fullscreenchange',()=>{
    if(document.fullscreenElement) fsActive=true;
    else if(fsActive){ fsActive=false; exit(); } // user keluar fullscreen lewat Esc/browser → ikut keluar mode presentasi
  });
  ['pointermove','touchstart','keydown'].forEach(t=>document.addEventListener(t,()=>{ if(on) showExit(); },{passive:true}));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      if(detailView.classList.contains('open')) detailClose.click();
      else if(document.getElementById('settingsPanel').classList.contains('open')) document.getElementById('settingsClose').click();
      else if(overlay.classList.contains('open')) closeMenu();
      else exit();
      return;
    }
    const tag=((document.activeElement||{}).tagName||'');
    if((e.key==='p'||e.key==='P') && !e.ctrlKey && !e.metaKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test(tag)) toggle();
  });
})();

// =====================================
// SETTINGS EXTRAS — toggle Mode Ringan + aksesibilitas kartu (bisa difokus & Enter)
// =====================================
(function initSettingsExtras(){
  const root=document.documentElement, lite=document.getElementById('liteToggle');
  if(lite){
    const sync=()=>{ lite.checked=root.classList.contains('perf-lite'); };
    sync();
    lite.addEventListener('change',()=>{
      try{ localStorage.setItem('arkaLite', lite.checked?'on':'off'); }catch(e){}
      root.classList.toggle('perf-lite',lite.checked);
    });
    const sb=document.getElementById('settingsBtn'); if(sb) sb.addEventListener('click',sync);
  }
  document.querySelectorAll('[data-project],[data-detail]').forEach(el=>{
    el.tabIndex=0; el.setAttribute('role','button');
    el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); el.click(); } });
  });
})();

// =====================================
// CAROUSEL SLIDER — slider geser di bawah Highlights (sinkron dua arah dengan carousel; berguna di HP yang panahnya disembunyikan)
// =====================================
(function initCarouselSlider(){
  const sl=document.getElementById('carSlider'), wrap=document.getElementById('carSliderWrap');
  if(!sl || !carousel) return;
  let driving=false, t=0;
  const max=()=>Math.max(0,carousel.scrollWidth-carousel.clientWidth);
  const paint=()=>sl.style.setProperty('--p',sl.value+'%');
  function sync(){ if(driving) return; const m=max(); sl.value=m?Math.round(carousel.scrollLeft/m*100):0; paint(); if(wrap) wrap.style.display=m>8?'':'none'; }
  carousel.addEventListener('scroll',sync,{passive:true});
  window.addEventListener('resize',sync,{passive:true});
  sl.addEventListener('input',()=>{ driving=true; carousel.dispatchEvent(new Event('pointerdown')); paint(); carousel.scrollTo({left:max()*sl.value/100,behavior:'auto'}); });
  const done=()=>{ clearTimeout(t); t=setTimeout(()=>{ driving=false; sync(); carousel.dispatchEvent(new Event('touchend')); },350); };
  ['change','pointerup','touchend','keyup'].forEach(ev=>sl.addEventListener(ev,done));
  sync(); setTimeout(sync,600);
})();

// =====================================
// PANDUAN (tombol ?) — isinya di GUIDE_DATA (i18n.js); dibuka di popup detail yang sama
// =====================================
function renderGuide(){
  return `<div class="card-tag">${T('Panduan','Guide')}</div><h3>${T('Panduan Website','Website Guide')}</h3><p class="pd-lead">${T('Klik judul untuk membuka penjelasannya.','Click a title to expand its explanation.')}</p>`+
    GUIDE_DATA.map((sec,si)=>`<div class="pd-section guide-sec"><h4>${T(sec.h[0],sec.h[1])}</h4>${sec.items.map((it,i)=>`<details class="guide-item"${si===0&&i===0?' open':''}><summary>${T(it[0],it[1])}</summary><div class="guide-body">${T(it[2],it[3])}</div></details>`).join('')}</div>`).join('');
}
function openGuide(){
  const wasOpen=detailView.classList.contains('open');
  detailInner.innerHTML=renderGuide();
  detailView.classList.add('open'); detailClose.style.display='block';
  if(!wasOpen) lockScroll();
  detailView.scrollTop=0;
}
(function initGuideButtons(){
  const g=document.getElementById('guideBtn'); if(g) g.addEventListener('click',()=>{ if(overlay.classList.contains('open')) closeMenu(); openGuide(); });
  const sg=document.getElementById('settingsGuideBtn');
  if(sg) sg.addEventListener('click',()=>{ settingsClose.click(); setTimeout(openGuide,60); });
})();
// ganti bahasa saat popup (panduan / detail pencapaian / form saran) lagi terbuka → isinya ikut ganti
document.addEventListener('arkalang',()=>{
  if(!detailView.classList.contains('open')) return;
  if(detailInner.querySelector('.guide-sec')){ const st=detailView.scrollTop; detailInner.innerHTML=renderGuide(); detailView.scrollTop=st; }
  else if(detailInner.querySelector('.ach-tl') && _achDetailIdx>=0){ const st=detailView.scrollTop; detailInner.innerHTML=renderAchDetail(_achDetailIdx); detailView.scrollTop=st; }
  else{ const f=document.getElementById('sugForm'); if(f) f.outerHTML=suggestFormHTML(); }
});

// =====================================
// PANDUAN AWAL (WELCOME) — muncul SEKALI di kunjungan pertama: pilih bahasa + performa. Setelah itu otomatis tersimpan.
// Dibuka lagi lewat Pengaturan → "Tampilkan Panduan Awal Lagi". Kunci penyimpanan: arkaWelcome
// =====================================
(function initWelcome(){
  const w=document.getElementById('welcome'); if(!w) return;
  const root=document.documentElement, opts=[...w.querySelectorAll('.welcome-opt')];
  let seen=false; try{ seen=localStorage.getItem('arkaWelcome')==='1'; }catch(e){}
  let choice='normal', isOpen=false;
  const current=()=>root.classList.contains('animations-off')?'min':(root.classList.contains('perf-lite')?'lite':'normal');
  function pick(c){ choice=c; opts.forEach(o=>o.classList.toggle('active',o.dataset.perf===c)); }
  function apply(c){
    const lite=c!=='normal', anim=c!=='min';
    try{ localStorage.setItem('arkaLite',lite?'on':'off'); localStorage.setItem('arkaAnimations',anim?'on':'off'); }catch(e){}
    root.classList.toggle('perf-lite',lite); root.classList.toggle('animations-off',!anim);
    const lt=document.getElementById('liteToggle'), at=document.getElementById('animationsToggle');
    if(lt) lt.checked=lite; if(at) at.checked=anim;
  }
  function show(){ if(isOpen) return; isOpen=true; pick(current()); w.classList.add('open'); lockScroll(); }
  function hide(save){ if(!isOpen) return; isOpen=false; w.classList.remove('open'); unlockScroll(); try{ localStorage.setItem('arkaWelcome','1'); }catch(e){} }
  opts.forEach(o=>o.addEventListener('click',()=>pick(o.dataset.perf)));
  document.getElementById('welcomeGo').addEventListener('click',()=>{ apply(choice); hide(); });
  document.addEventListener('keydown',e=>{ if(isOpen && e.key==='Escape'){ e.stopPropagation(); hide(); } },true);
  const again=document.getElementById('welcomeAgainBtn');
  if(again) again.addEventListener('click',()=>{ settingsClose.click(); setTimeout(show,80); });
  if(!seen) setTimeout(show,700);
})();

// =====================================
// LINK SOSIAL — link di menu layar penuh otomatis ngikutin link di section CONTACT (edit sekali di Contact aja)
// Link yang masih "#" (belum diisi) gak bikin halaman loncat ke atas.
// =====================================
(function initSocialLinks(){
  const src=[...document.querySelectorAll('#contact .contact-links a')];
  document.querySelectorAll('.overlay-social a').forEach(a=>{
    const m=src.find(x=>x.textContent.trim().toLowerCase()===a.textContent.trim().toLowerCase());
    if(m){ a.setAttribute('href',m.getAttribute('href')); if(m.target){ a.target=m.target; a.rel='noopener noreferrer'; } }
  });
  document.addEventListener('click',e=>{ const a=e.target.closest('a[href="#"]'); if(a) e.preventDefault(); });
})();
