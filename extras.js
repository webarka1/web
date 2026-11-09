/* =====================================================
   EXTRAS.JS — tambahan BARU (file terpisah, kode asli gak diubah).
   1) YOUTUBE LIVE  → judul, thumbnail, tanggal, views, subscriber & link video terbaru terisi OTOMATIS dari YouTube.
   2) TOMBOL CV     → muncul otomatis kalau file files/CV-Arka.pdf ada (kalau gak ada, tombol gak muncul).
   Kalau API key belum diisi / YouTube gagal dimuat, isi manual di index.html tetap tampil seperti biasa.
   ===================================================== */

/* ---------- KONFIGURASI (cukup edit bagian ini) ---------- */
const YT_LIVE = {
  apiKey: "",            // ← TEMPEL API KEY YouTube Data API v3 di sini (lihat panduan di chat). Kosong = fitur live mati.
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

/* ---------- 5) PERFORMA, SCROLL REVEAL, VOLUME PLAYER, PENGATURAN iOS 27 ---------- */
(function(){
  const root=document.documentElement, $=id=>document.getElementById(id);
  const en=()=>typeof L==='function' && L()==='en', T=(a,b)=>en()?b:a;

  /* PERFORMA: jeda animasi saat tab disembunyikan & saat scroll (wallpaper/gelembung), gambar dimuat malas */
  document.addEventListener('visibilitychange',()=>root.classList.toggle('tab-hidden',document.hidden));
  let st; window.addEventListener('scroll',()=>{ root.classList.add('is-scrolling'); clearTimeout(st); st=setTimeout(()=>root.classList.remove('is-scrolling'),140); },{passive:true});
  document.querySelectorAll('img').forEach(im=>{ if(!im.closest('#hero')&&!im.hasAttribute('loading')) im.loading='lazy'; im.decoding='async'; });

  /* SCROLL REVEAL halus (kedua tema) */
  try{
    if(!matchMedia('(prefers-reduced-motion:reduce)').matches && 'IntersectionObserver' in window){
      const SEL='.card,.proj-item,.testimonial-card,.media-card,.media-channel,.skill-row,.stat,.conn-hero,.about-facts,.rb-panel,.theme-player-card,.focus-list span';
      const els=[...document.querySelectorAll(SEL)].filter(e=>!e.closest('.reveal,[class*="carousel"]')&&!e.classList.contains('reveal'));
      const idx=new Map(); els.forEach(e=>{ const n=(idx.get(e.parentNode)||0); idx.set(e.parentNode,n+1); e.style.setProperty('--sxd',Math.min(n*0.07,0.35)+'s'); e.classList.add('sx'); });
      const io=new IntersectionObserver(es=>es.forEach(x=>{ if(!x.isIntersecting) return; const e=x.target; io.unobserve(e); requestAnimationFrame(()=>e.classList.add('sx-in'));
        setTimeout(()=>{ e.classList.remove('sx','sx-in'); e.style.removeProperty('--sxd'); },1500); }),{threshold:.08,rootMargin:'0px 0px -6% 0px'});
      els.forEach(e=>io.observe(e));
    }
  }catch(e){ document.querySelectorAll('.sx').forEach(e=>e.classList.remove('sx')); }

  /* VOLUME PLAYER + animasi geser lagu */
  (function(){
    const a=$('tpAudio'), wf=$('tpWaveform'); if(!a||!wf) return;
    let v=.4; try{ const s=localStorage.getItem('arkaVol'); if(s!==null&&!isNaN(+s)) v=Math.min(1,Math.max(0,+s)); }catch(e){}
    a.volume=v; let prev=v||.4;
    const box=document.createElement('div'); box.className='tp-vol';
    box.innerHTML='<button type="button" class="tp-vol-btn" aria-label="Mute"><svg viewBox="0 0 24 24"><path d="M11 5L6 9H3v6h3l5 4z"/><path class="w1" d="M15.5 8.5a5 5 0 010 7"/><path class="w2" d="M18.5 6a9 9 0 010 12"/></svg></button><input class="tp-vol-range" type="range" min="0" max="100" step="1" aria-label="Volume"><span class="tp-vol-num"></span>';
    const tr=$('tpTimeCurrent'); const anchor=tr&&tr.parentNode&&tr.parentNode!==wf?tr.parentNode:wf; anchor.parentNode.insertBefore(box,anchor.nextSibling);
    const r=box.querySelector('input'), n=box.querySelector('.tp-vol-num'), b=box.querySelector('button');
    function paint(){ const p=Math.round(a.volume*100); r.value=p; r.style.setProperty('--v',p+'%'); n.textContent=p+'%'; box.querySelector('.w1').style.opacity=p>0?1:0; box.querySelector('.w2').style.opacity=p>55?1:0; }
    r.addEventListener('input',()=>{ a.volume=r.value/100; if(a.volume>0) prev=a.volume; try{ localStorage.setItem('arkaVol',String(a.volume)); }catch(e){} paint(); });
    b.addEventListener('click',()=>{ a.volume=a.volume>0?0:prev; try{ localStorage.setItem('arkaVol',String(a.volume)); }catch(e){} paint(); });
    paint();
    let t; const sk=()=>{ wf.classList.add('sk'); clearTimeout(t); t=setTimeout(()=>wf.classList.remove('sk'),850); };
    ['pointerdown','keydown'].forEach(ev=>wf.addEventListener(ev,sk));
    if(typeof arkaAddPairs==='function') arkaAddPairs([["Volume","Volume"]]);
  })();

  /* PENGATURAN iOS 27: wallpaper (preset + foto sendiri) + saklar elemen. Hanya tampil saat Tema iOS 27 aktif. */
  (function(){
    const tg=$('lgToggle'); const grp=tg&&tg.closest('.settings-group'); if(!grp) return;
    const DEF={wp:'theme',bub:1,shd:1,d3:1,blur:1,dock:1}; let S=Object.assign({},DEF);
    try{ S=Object.assign(S,JSON.parse(localStorage.getItem('arkaIOS')||'{}')); }catch(e){}
    const img=()=>{ try{ return localStorage.getItem('arkaIOSimg'); }catch(e){ return null; } };
    const WP=[['theme',['Tema asli (ikut Tema Warna)','Original (follows Color Theme)'],'linear-gradient(135deg,var(--accent),var(--accent2))'],['aurora',['Aurora','Aurora'],'linear-gradient(135deg,#2f7bff,#ec4899)'],['senja',['Senja','Sunset'],'linear-gradient(135deg,#ff7a59,#8b5cf6)'],['laut',['Laut','Ocean'],'linear-gradient(135deg,#0ea5e9,#2dd4bf)'],['mint',['Mint','Mint'],'linear-gradient(135deg,#34d399,#38bdf8)'],['grafit',['Grafit','Graphite'],'linear-gradient(135deg,#64748b,#cbd5e1)']];
    const TG=[['bub',['Gelembung kaca melayang','Floating glass bubbles']],['shd',['Bayangan & kedalaman','Shadows & depth']],['d3',['Efek 3D kartu','3D card effect']],['blur',['Blur kaca (matikan jika lag)','Glass blur (turn off if laggy)']],['dock',['Dock navigasi bawah','Bottom navigation dock']]];
    const sub=document.createElement('div'); sub.className='ios-sub';
    sub.innerHTML='<div class="settings-label">'+T('Wallpaper','Wallpaper')+'</div><div class="ios-wp"></div><div class="settings-label">'+T('Elemen tema iOS 27','iOS 27 elements')+'</div>';
    const wp=sub.querySelector('.ios-wp');
    WP.forEach(([k,l,g])=>{ const x=document.createElement('button'); x.type='button'; x.dataset.wp=k; x.innerHTML='<i style="background:'+g+'"></i><span>'+l[en()?1:0]+'</span>'; x.onclick=()=>{ S.wp=k; apply(); }; wp.appendChild(x); });
    const up=document.createElement('button'); up.type='button'; up.dataset.wp='img'; up.innerHTML='<i style="background:linear-gradient(135deg,#555,#999)"></i><span>'+T('Foto sendiri…','My photo…')+'</span>';
    const fi=document.createElement('input'); fi.type='file'; fi.accept='image/*'; fi.hidden=true; up.onclick=()=>fi.click(); wp.appendChild(up); wp.appendChild(fi);
    fi.onchange=()=>{ const f=fi.files&&fi.files[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>{ const im=new Image(); im.onload=()=>{
        const k=Math.min(1,1400/Math.max(im.width,im.height)), c=document.createElement('canvas'); c.width=im.width*k; c.height=im.height*k; c.getContext('2d').drawImage(im,0,0,c.width,c.height);
        const d=c.toDataURL('image/jpeg',.8); try{ localStorage.setItem('arkaIOSimg',d); }catch(e){} root.style.setProperty('--wp-img','url('+d+')'); S.wp='img'; apply(); }; im.src=rd.result; }; rd.readAsDataURL(f); };
    TG.forEach(([k,l])=>{ const lb=document.createElement('label'); lb.className='settings-toggle'; lb.innerHTML='<input type="checkbox" data-k="'+k+'"><span>'+l[en()?1:0]+'</span>'; lb.firstChild.onchange=e=>{ S[k]=e.target.checked?1:0; apply(); }; sub.appendChild(lb); });
    grp.appendChild(sub);
    function apply(){
      if(S.wp==='img'&&!img()) S.wp='theme';
      if(S.wp==='img'){ root.style.setProperty('--wp-img','url('+img()+')'); }
      root.setAttribute('data-wp',S.wp);
      [['bub','ios-no-bub'],['shd','ios-no-shd'],['d3','ios-no-3d'],['blur','ios-no-blur'],['dock','ios-no-dock']].forEach(([k,c])=>root.classList.toggle(c,!S[k]));
      wp.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x.dataset.wp===S.wp));
      sub.querySelectorAll('input[data-k]').forEach(i=>i.checked=!!S[i.dataset.k]);
      try{ localStorage.setItem('arkaIOS',JSON.stringify(S)); }catch(e){}
    }
    apply();
    if(typeof arkaAddPairs==='function') arkaAddPairs([["Wallpaper","Wallpaper"],["Elemen tema iOS 27","iOS 27 elements"]].concat(WP.map(w=>w[1]),[["Foto sendiri…","My photo…"]],TG.map(t=>t[1])));
    /* gelembung */
    const bx=document.createElement('div'); bx.id='ios-bubbles'; bx.setAttribute('aria-hidden','true');
    for(let i=0;i<26;i++){ const e=document.createElement('i'); e.className='ios-bubble'; const s=4+Math.pow(Math.random(),2.2)*20;
      e.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(Math.random()*96)+'%;--dx:'+((Math.random()-.5)*120).toFixed(0)+'px;animation-duration:'+(22+Math.random()*26).toFixed(1)+'s;animation-delay:-'+(Math.random()*40).toFixed(1)+'s;'; bx.appendChild(e); }
    document.body.insertBefore(bx,document.body.firstChild);
  })();
})();
