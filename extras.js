/* =====================================================
   EXTRAS.JS — tambahan BARU (file terpisah, kode asli gak diubah).
   1) YOUTUBE LIVE  → judul, thumbnail, tanggal, views, subscriber & link video terbaru terisi OTOMATIS dari YouTube.
   2) TOMBOL CV     → muncul otomatis kalau file files/CV-Arka.pdf ada (kalau gak ada, tombol gak muncul).
   Kalau API key belum diisi / YouTube gagal dimuat, isi manual di index.html tetap tampil seperti biasa.
   ===================================================== */

/* ---------- KONFIGURASI (cukup edit bagian ini) ---------- */
const YT_LIVE = {
  apiKey: "AIzaSyDTWYlRaTpIIGNhxPiKI0-DHhBqlXKoAXg",            // ← TEMPEL API KEY YouTube Data API v3 di sini (lihat panduan di chat). Kosong = fitur live mati.
  cacheMenit: 10,        // data disimpan di browser pengunjung selama ini, biar hemat kuota API
  channels: [
    { handle: "@CHANNELARKA67", cards: ["1","2","3"],       shorts: false }, // cards = nilai data-video di index.html
    { handle: "@ano.cc21",      cards: ["ano1","ano2","ano3"], shorts: true  }  // shorts:true → link dibuka sebagai /shorts/
  ]
};
const CV_FILE = "files/CV-Arka.pdf"; // taruh CV kamu di folder files/ dengan nama ini

/* ---------- 1) YOUTUBE LIVE ---------- */
(function(){
  /* DIAGNOSA: buka web dengan tambahan ?ytdebug di alamat → muncul kotak hijau di layar berisi status/error (berguna di HP) */
  const DBG=/[?&]ytdebug/.test(location.search); let box;
  function dbg(m){ console.log('[YT]',m); if(!DBG) return;
    if(!box){ box=document.createElement('pre'); box.style.cssText='position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;max-height:45vh;overflow:auto;background:#000;color:#3f3;font:12px/1.4 monospace;padding:10px;border-radius:10px;white-space:pre-wrap;margin:0'; document.body.appendChild(box); }
    box.textContent+=m+'\n'; }
  dbg('extras.js jalan. apiKey: '+(YT_LIVE.apiKey?'terisi ('+YT_LIVE.apiKey.length+' karakter)':'KOSONG ← isi dulu di extras.js'));
  document.addEventListener('securitypolicyviolation',e=>dbg('DIBLOKIR CSP: '+e.blockedURI+' ('+e.violatedDirective+') → index.html belum yang baru'));
  if(!YT_LIVE.apiKey) return;
  const API="https://www.googleapis.com/youtube/v3/", CK="arkaYtCache";
  const isEn=()=>typeof L==='function' && L()==='en';
  let DATA=null;

  function ago(iso){
    const s=(Date.now()-new Date(iso).getTime())/1000;
    const U=[[31536000,'tahun','year'],[2592000,'bulan','month'],[604800,'minggu','week'],[86400,'hari','day'],[3600,'jam','hour'],[60,'menit','minute']];
    for(const [sec,id,en] of U){ if(s>=sec){ const n=Math.floor(s/sec); return isEn()? n+' '+en+(n>1?'s':'')+' ago' : n+' '+id+' lalu'; } }
    return isEn()?'just now':'baru saja';
  }
  const fmt=n=>Number(n).toLocaleString(isEn()?'en-US':'id-ID');

  function render(){
    if(!DATA) return;
    YT_LIVE.channels.forEach(c=>{
      const d=DATA[c.handle]; if(!d) return;
      if(d.subs!=null){
        document.querySelectorAll('.media-channel-handle').forEach(el=>{
          if(el.textContent.indexOf(c.handle)===0) el.textContent=c.handle+' · '+fmt(d.subs)+(isEn()?' subscribers':' subscriber');
        });
      }
      c.cards.forEach((key,i)=>{
        const v=d.videos[i], card=document.querySelector('.media-card[data-video="'+key+'"]'); if(!v||!card) return;
        card.href=(c.shorts?'https://www.youtube.com/shorts/':'https://www.youtube.com/watch?v=')+v.id;
        const t=card.querySelector('.media-title'); if(t) t.textContent=v.title;
        const sp=card.querySelectorAll('.media-meta span');
        if(sp[0]) sp[0].textContent=ago(v.published);
        if(sp[1]) sp[1].textContent=fmt(v.views)+(isEn()?' views':' ditonton');
        const box=card.querySelector('.media-thumb');
        if(box && v.thumb){
          let img=box.querySelector('img');
          if(!img){ img=document.createElement('img'); img.loading='lazy'; img.alt=v.title; box.appendChild(img); }
          if(img.dataset.ytId!==v.id){
            img.dataset.ytId=v.id; img.alt=v.title;
            img.onload=()=>box.classList.add('has-img');
            img.src=v.thumb; if(img.complete && img.naturalWidth) box.classList.add('has-img');
          }
        }
      });
    });
  }

  async function api(path,params){
    const u=new URL(API+path); Object.keys(params).forEach(k=>u.searchParams.set(k,params[k])); u.searchParams.set('key',YT_LIVE.apiKey);
    const ctl=new AbortController(), to=setTimeout(()=>ctl.abort(),8000);
    try{ const r=await fetch(u,{signal:ctl.signal}); if(!r.ok){ let m=''; try{ m=(await r.json()).error.message; }catch(e){} throw new Error(r.status+' '+m); } return await r.json(); } finally{ clearTimeout(to); }
  }
  async function loadChannel(c){
    const ch=await api('channels',{part:'contentDetails,statistics',forHandle:c.handle});
    const it=ch.items&&ch.items[0]; if(!it) throw new Error('channel?');
    const pl=await api('playlistItems',{part:'contentDetails',playlistId:it.contentDetails.relatedPlaylists.uploads,maxResults:c.cards.length});
    const ids=(pl.items||[]).map(x=>x.contentDetails.videoId); if(!ids.length) throw new Error('video?');
    const vs=await api('videos',{part:'snippet,statistics',id:ids.join(',')});
    const by={}; (vs.items||[]).forEach(v=>by[v.id]=v);
    const videos=ids.filter(id=>by[id]).map(id=>{ const v=by[id], th=v.snippet.thumbnails||{};
      return {id, title:v.snippet.title, published:v.snippet.publishedAt, views:v.statistics.viewCount||0,
              thumb:(th.high||th.medium||th.default||{}).url||''}; });
    const st=it.statistics||{};
    return {subs:st.hiddenSubscriberCount?null:Number(st.subscriberCount), videos};
  }
  async function refresh(force){
    let cache=null; try{ cache=JSON.parse(localStorage.getItem(CK)||'null'); }catch(e){}
    if(cache && cache.d){ DATA=cache.d; render(); }                       // tampilkan cache dulu (cepat)
    if(!force && cache && Date.now()-cache.t < YT_LIVE.cacheMenit*60000) return;
    const out=Object.assign({},DATA||{});
    for(const c of YT_LIVE.channels){ try{ out[c.handle]=await loadChannel(c); dbg('OK '+c.handle+' → '+out[c.handle].videos.length+' video, subscriber '+out[c.handle].subs); }catch(e){ dbg('GAGAL '+c.handle+': '+e.message); } }
    DATA=out; render();
    try{ localStorage.setItem(CK,JSON.stringify({t:Date.now(),d:out})); }catch(e){}
  }
  document.addEventListener('arkalang',render);                            // ganti bahasa → teks ikut berubah
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) refresh(false); });
  refresh(false);
})();

/* ---------- 2) TOMBOL CV (muncul otomatis kalau filenya ada) ---------- */
(function(){
  const b=document.getElementById('cvBtn'); if(!b) return;
  if(typeof arkaAddPairs==='function') arkaAddPairs([["Unduh CV","Download CV"]]);
  fetch(CV_FILE,{method:'HEAD'}).then(r=>{ if(r.ok){ b.href=CV_FILE; b.style.display=''; } }).catch(()=>{});
})();

/* ---------- 3) LIQUID GLASS (iOS 27) — toggle + slider transparansi di panel Pengaturan ---------- */
(function(){
  const tg=document.getElementById('lgToggle'), sl=document.getElementById('lgSlider'); if(!tg||!sl) return;
  if(typeof arkaAddPairs==='function') arkaAddPairs([
    ["Tema iOS 27","iOS 27 Theme"],
    ["Aktifkan Tema iOS 27 (Liquid Glass)","Enable iOS 27 Theme (Liquid Glass)"],
    ["Transparansi Liquid Glass","Liquid Glass transparency"],
    ["Mengubah SELURUH tampilan jadi gaya iPhone iOS 27: font Apple, warna sistem iOS, kartu widget, nav kapsul, tombol kapsul, toggle hijau, dan kaca Liquid Glass. Geser untuk atur Clear (bening) ↔ Tinted (pekat). Warna aksen tetap bisa diganti lewat Tema Warna.","Turns the WHOLE look into iPhone iOS 27 style: Apple font, iOS system colors, widget cards, capsule nav and buttons, green toggles and Liquid Glass. Slide to set Clear ↔ Tinted. Accent color can still be changed via Color Theme."]
  ]);
  const root=document.documentElement;
  let on=false, lvl=50;
  try{ on=localStorage.getItem('arkaLG')==='on'; const v=parseInt(localStorage.getItem('arkaLGlevel'),10); if(!isNaN(v)) lvl=v; }catch(e){}
  function apply(){
    root.classList.toggle('ios27',on);
    root.style.setProperty('--lg-a',(0.08+0.5*lvl/100).toFixed(3));
    root.style.setProperty('--lg-blur',(28-14*lvl/100).toFixed(1)+'px');
    tg.checked=on; sl.value=lvl; sl.disabled=!on;
    try{ localStorage.setItem('arkaLG',on?'on':'off'); localStorage.setItem('arkaLGlevel',String(lvl)); }catch(e){}
  }
  tg.addEventListener('change',()=>{ on=tg.checked; apply(); });
  sl.addEventListener('input',()=>{ lvl=parseInt(sl.value,10)||0; apply(); });
  apply();
})();

/* ---------- 4) FITUR BARU: Spotlight (Ctrl/⌘+K atau "/"), Dock bawah (tema iOS 27), Toast, getar halus ---------- */
(function(){
  const en=()=>typeof L==='function' && L()==='en';
  const T=(id,e)=>en()?e:id;
  const $=(s,r)=> (r||document).querySelector(s);
  const buzz=()=>{ try{ navigator.vibrate&&navigator.vibrate(8); }catch(e){} };
  const SEC={hero:['Beranda','Home'],about:['Tentang','About'],'carousel-section':['Sorotan','Highlights'],projects:['Proyek','Projects'],skills:['Skills','Skills'],media:['Media','Media'],achievements:['Prestasi','Achievements'],connections:['Koneksi','Connections'],testimonials:['Testimoni','Testimonials'],contact:['Kontak','Contact']};
  const go=id=>{ const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); };

  /* TOAST */
  const toastEl=document.createElement('div'); toastEl.id='ex-toast'; document.body.appendChild(toastEl); let tt;
  function toast(m){ toastEl.textContent=m; toastEl.classList.add('on'); clearTimeout(tt); tt=setTimeout(()=>toastEl.classList.remove('on'),2200); }

  /* AKSI */
  const act=[
    {k:T('Ganti Mode Terang/Gelap','Toggle Light/Dark mode'), f:()=>{ const b=document.querySelector('.mode-btn:not(.active)'); b&&b.click(); }},
    {k:T('Aktifkan/Matikan Tema iOS 27','Toggle iOS 27 theme'), f:()=>{ const t=document.getElementById('lgToggle'); t&&t.click(); }},
    {k:T('Salin link web','Copy site link'), f:()=>{ (navigator.clipboard?navigator.clipboard.writeText(location.href.split('?')[0]):Promise.reject()).then(()=>toast(T('Link disalin ✓','Link copied ✓'))).catch(()=>toast(location.href)); }},
    {k:T('Bagikan web ini','Share this site'), f:()=>{ if(navigator.share) navigator.share({title:document.title,url:location.href.split('?')[0]}).catch(()=>{}); else toast(T('Perangkat ini belum mendukung Bagikan','Share not supported here')); }},
    {k:T('Kembali ke atas','Back to top'), f:()=>window.scrollTo({top:0,behavior:'smooth'})}
  ];
  function items(){
    const r=[];
    Object.keys(SEC).forEach(id=>{ if(document.getElementById(id)) r.push({k:'→ '+T(SEC[id][0],SEC[id][1]), f:()=>go(id)}); });
    try{ if(typeof projectDetail==='object') Object.keys(projectDetail).forEach(key=>r.push({k:'◧ '+projectDetail[key].title, f:()=>{ go('projects'); setTimeout(()=>{ typeof openProject==='function'&&openProject(key); },450); }})); }catch(e){}
    const cv=document.getElementById('cvBtn'); if(cv&&cv.style.display!=='none') r.push({k:T('Unduh CV','Download CV'), f:()=>cv.click()});
    return r.concat(act);
  }

  /* SPOTLIGHT */
  const sp=document.createElement('div'); sp.id='spot'; sp.innerHTML='<div class="spot-box" role="dialog" aria-label="Spotlight"><input id="spotIn" type="text" autocomplete="off" spellcheck="false"><ul id="spotList"></ul></div>';
  document.body.appendChild(sp);
  const inp=sp.querySelector('#spotIn'), ul=sp.querySelector('#spotList'); let list=[], sel=0;
  function draw(){ const q=inp.value.trim().toLowerCase(); list=items().filter(i=>!q||i.k.toLowerCase().includes(q)); sel=Math.min(sel,Math.max(0,list.length-1));
    ul.innerHTML=''; list.slice(0,30).forEach((it,i)=>{ const li=document.createElement('li'); li.textContent=it.k; if(i===sel) li.className='on'; li.onclick=()=>run(it); ul.appendChild(li); });
    if(!list.length){ const li=document.createElement('li'); li.className='none'; li.textContent=T('Tidak ada hasil','No results'); ul.appendChild(li); } }
  function run(it){ close(); buzz(); setTimeout(it.f,120); }
  function open(){ inp.placeholder=T('Cari bagian, proyek, atau aksi…','Search sections, projects or actions…'); inp.value=''; sel=0; draw(); sp.classList.add('on'); setTimeout(()=>inp.focus(),30); }
  function close(){ sp.classList.remove('on'); inp.blur(); }
  window.arkaSpotlight=open;
  inp.addEventListener('input',()=>{ sel=0; draw(); });
  sp.addEventListener('click',e=>{ if(e.target===sp) close(); });
  document.addEventListener('keydown',e=>{
    const typing=/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName||'')) && e.target!==inp;
    if((e.key==='k'&&(e.ctrlKey||e.metaKey))||(e.key==='/'&&!typing&&!sp.classList.contains('on'))){ e.preventDefault(); open(); return; }
    if(!sp.classList.contains('on')) return;
    if(e.key==='Escape') close();
    else if(e.key==='ArrowDown'){ e.preventDefault(); sel=Math.min(sel+1,list.length-1); draw(); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); sel=Math.max(sel-1,0); draw(); }
    else if(e.key==='Enter'&&list[sel]){ e.preventDefault(); run(list[sel]); }
  });

  /* DOCK BAWAH (tampil hanya di Tema iOS 27) */
  const IC={hero:'<path d="M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',about:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',projects:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',achievements:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0zM17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3"/>',contact:'<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/>'};
  const dock=document.createElement('nav'); dock.id='ios-dock'; dock.setAttribute('aria-label','Dock');
  Object.keys(IC).forEach(id=>{ if(!document.getElementById(id)) return; const a=document.createElement('button'); a.type='button'; a.dataset.s=id; a.className='dk';
    a.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+IC[id]+'</svg><span></span>'; a.onclick=()=>{ buzz(); go(id); }; dock.appendChild(a); });
  const sb=document.createElement('button'); sb.type='button'; sb.className='dk'; sb.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><span></span>'; sb.onclick=()=>{ buzz(); open(); }; dock.appendChild(sb);
  document.body.appendChild(dock);
  function labels(){ dock.querySelectorAll('.dk').forEach(b=>{ const s=b.dataset.s, sp2=b.querySelector('span'); sp2.textContent=s?T(SEC[s][0],SEC[s][1]):T('Cari','Search'); }); }
  labels(); document.addEventListener('arkalang',()=>{ labels(); });
  if('IntersectionObserver' in window){ const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) dock.querySelectorAll('.dk').forEach(b=>b.classList.toggle('on',b.dataset.s===e.target.id)); }),{threshold:.35});
    Object.keys(IC).forEach(id=>{ const el=document.getElementById(id); el&&io.observe(el); }); }
  document.addEventListener('change',e=>{ if(e.target&&e.target.closest&&e.target.closest('.settings-toggle')) buzz(); });
})();
