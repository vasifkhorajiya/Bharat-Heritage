/*
  Bharat Heritage — interactive behaviour and page-level UI logic.
  The script uses plain JavaScript so the project can run directly in a browser.
*/
(() => {
  'use strict';
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  // Loader: INDIA / BHARAT word reveal instead of a single letter.
  const loader = $('#loader');
  const loaderSpans = $$('#loaderWord span');
  const loaderFill = $('#loaderFill');
  loaderSpans.forEach((el, i) => setTimeout(() => el.classList.add('show'), 120 + i * 110));
  setTimeout(() => loaderFill.style.width = '100%', 260);
  setTimeout(() => loader.classList.add('hide'), 1200);

  // Clock
  const clock = $('#clock');
  setInterval(() => {
    const d = new Date();
    clock.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()].map(v => String(v).padStart(2, '0')).join(':');
  }, 1000);

  // Header / mega navigation
  const header = $('#siteHeader'), menuToggle = $('#menuToggle');
  menuToggle.addEventListener('click', () => {
    header.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });
  $$('.mega-nav a').forEach(a => a.addEventListener('click', () => {
    header.classList.remove('open');
    document.body.classList.remove('menu-open');
  }));
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 40), {passive:true});

  // Global scroll progress
  const progressBar = $('#progressBar');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progressBar.style.width = `${Math.max(0, Math.min(100, scrollY / max * 100))}%`;
    const fill = $('#timelineFill');
    const track = $('#timelineTrack');
    if(fill && track){
      const r = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (innerHeight * .7 - r.top) / r.height));
      fill.style.width = `${pct * 100}%`;
      fill.style.height = innerWidth > 1050 ? '100%' : `${pct * 100}%`;
    }
  };
  addEventListener('scroll', updateProgress, {passive:true}); updateProgress();

  // Reveal choreography
  const io = new IntersectionObserver((entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('in')), {threshold:.12});
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${Math.min((i%4)*60,180)}ms`; io.observe(el); });

  // Cursor
  const dot = $('#cursorDot'), ring = $('#cursorRing'); let mx = innerWidth/2, my = innerHeight/2, rx=mx, ry=my;
  addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  const cursorLoop = () => { rx += (mx-rx)*.18;
  ry += (my-ry)*.18;
  dot.style.left=mx+'px';
  dot.style.top=my+'px';
  ring.style.left=rx+'px';
  ring.style.top=ry+'px';
  requestAnimationFrame(cursorLoop);
  };
  cursorLoop();
  $$('a,button,.gallery-item').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('big'));el.addEventListener('mouseleave',()=>ring.classList.remove('big'));});

  // Magnetic interactions
  $$('.magnetic').forEach(el => el.addEventListener('mousemove', e => { const r=el.getBoundingClientRect();
  const x=e.clientX-(r.left+r.width/2);
  const y=e.clientY-(r.top+r.height/2);
  el.style.transform=`translate(${x*.12}px,${y*.12}px)`;
  }));
  $$('.magnetic').forEach(el => el.addEventListener('mouseleave', () => el.style.transform=''));

  // Parallax elements
  const parallaxEls = $$('.hero-media,.future-media,[data-speed]');
  addEventListener('scroll', () => parallaxEls.forEach(el => { const speed = parseFloat(el.dataset.speed || (el.classList.contains('hero-media') ? '-0.08':'-0.12'));
  el.style.transform=`translate3d(0,${scrollY*speed}px,0)`;
  }), {passive:true});

  // Canvas particles
  const canvas = $('#particleCanvas'), ctx = canvas.getContext('2d'); let parts=[];
  const resize = () => { canvas.width=innerWidth*devicePixelRatio;
  canvas.height=innerHeight*devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  parts=Array.from({length:Math.min(150,
    Math.floor(innerWidth/10))},
    ()=>({x:Math.random()*innerWidth,
    y:Math.random()*innerHeight,
    r:Math.random()*1.5+.2,
    v:Math.random()*.22+.03,
    a:Math.random()*.35+.08}));
  };
  resize(); addEventListener('resize',resize);
  const particleLoop=()=>{ctx.clearRect(0,0,innerWidth,innerHeight);
  parts.forEach(p=>{p.y-=p.v;
  if(p.y<0)p.y=innerHeight+4;
  ctx.fillStyle=`rgba(255,240,205,${p.a})`;
  ctx.beginPath();
  ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
  ctx.fill();
  });
  requestAnimationFrame(particleLoop)};
  particleLoop();

  // Number counters
  const counters = $$('.counter');
  const countIO = new IntersectionObserver(entries => entries.forEach(e => {
    if(!e.isIntersecting || e.target.dataset.done) return;
    e.target.dataset.done='1';
    const target=+e.target.dataset.target;
    let start=0;
    const step=()=>{start += Math.max(1, Math.ceil(target/60));
    if(start>=target){e.target.textContent=target.toLocaleString();
    return;
    } e.target.textContent=start.toLocaleString();
    requestAnimationFrame(step)};
    step();
  }), {threshold:.7}); counters.forEach(c=>countIO.observe(c));

  // Atlas data
  const regions = {
    north:{label:'NORTH / HIGH ALTITUDE / OLD ROUTES',
      title:'Landscapes of memory',
      text:'Mountain light, pilgrimage routes, carved stone and old trade paths create a visual language shaped by altitude and exchange.',
      tags:['STONE',
      'TEXTILE',
      'ROUTE'],
      image:'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1800&q=90',
      index:'01'},
    west:{label:'WEST / DESERT + SEA / TRADE',
      title:'Colour in motion',
      text:'Desert architecture, port cities, mirrored surfaces and textiles reveal a culture shaped by travel, trade and adaptation.',
      tags:['DESERT',
      'PORT',
      'TEXTILE'],
      image:'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1800&q=90',
      index:'02'},
    south:{label:'SOUTH / TEMPLE + COAST / RITUAL',
      title:'Ritual as urban system',
      text:'Temple streets, water, music, food and sculpture create dense cultural ecosystems that still organize everyday life.',
      tags:['RITUAL',
      'STONE',
      'COAST'],
      image:'https://images.unsplash.com/photo-1532664189809-02133fee698d?auto=format&fit=crop&w=1800&q=90',
      index:'03'},
    east:{label:'EAST / DELTA + RIVER / STORY',
      title:'Water writes the city',
      text:'River landscapes, craft, literature and foodways create a softer, more fluid cultural vocabulary shaped by monsoon and migration.',
      tags:['RIVER',
      'LITERATURE',
      'MONSOON'],
      image:'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1800&q=90',
      index:'04'},
    northeast:{label:'NORTH-EAST / HILLS + FOREST / LAYERS',
      title:'Many worlds beside each other',
      text:'Mountain ecology, community craft, food traditions and living languages form an extraordinary matrix of local knowledge.',
      tags:['FOREST',
      'COMMUNITY',
      'MUSIC'],
      image:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=90',
      index:'05'}
  };
  $$('.atlas-pin').forEach(btn=>btn.addEventListener('click',()=>{
    const d=regions[btn.dataset.region]; if(!d) return; $$('.atlas-pin').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    $('#regionImage').style.opacity='0';
    setTimeout(()=>{ $('#regionImage').src=d.image;
    $('#regionImage').style.opacity='1';
    $('#regionLabel').textContent=d.label;
    $('#regionTitle').textContent=d.title;
    $('#regionText').textContent=d.text;
    $('#regionIndex').textContent=d.index;
    $('#regionTags').innerHTML=d.tags.map(x=>`<span>${x}</span>`).join('');
    },180);
  }));

  // Material lab
  const materials={thread:['THREAD',
    'WEAVE / RHYTHM',
    '#c1e0b4'],
    metal:['METAL',
    'HEAT / FORM',
    '#e7b86e'],
    wood:['WOOD',
    'GRAIN / TOUCH',
    '#c59d7e'],
    clay:['CLAY',
    'EARTH / VESSEL',
    '#c78567'],
    dye:['DYE',
    'COLOUR / WATER',
    '#92b3de']};
  $$('.material-btn').forEach(btn=>btn.addEventListener('click',()=>{const d=materials[btn.dataset.material];
  $$('.material-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  $('#materialWord').textContent=d[0];
  $('#materialDetail').textContent=d[1];
  document.documentElement.style.setProperty('--gold',d[2]);
  }));

  // Food console
  const foods={
    north:{label:'NORTH INDIA',
      title:'Slow-cooked comfort.',
      text:'Wheat, dairy, smoke and deep spice meet in breads, gravies and winter dishes.',
      grain:'WHEAT',
      climate:'COLD / DRY',
      method:'SLOW COOK',
      img:'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1900&q=90'},
    west:{label:'WEST INDIA',
      title:'Sour, sweet, bright.',
      text:'Coastal salt, millet, legumes and bold chutneys create a cuisine that moves between desert and sea.',
      grain:'MILLET',
      climate:'DRY / COASTAL',
      method:'CHAR / GRIND',
      img:'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=1900&q=90'},
    south:{label:'SOUTH INDIA',
      title:'Fermentation + heat.',
      text:'Rice, lentil, coconut, tamarind and fermentation build layered flavours designed around heat and monsoon.',
      grain:'RICE',
      climate:'TROPICAL',
      method:'FERMENT / STEAM',
      img:'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1900&q=90'},
    east:{label:'EAST INDIA',
      title:'River, rice, mustard.',
      text:'Water, rice, fish, mustard and seasonal greens define a food culture closely tied to river and delta life.',
      grain:'RICE',
      climate:'RIVER / MONSOON',
      method:'STEAM / SIMMER',
      img:'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1900&q=90'}
  };
  $$('.food-tabs button').forEach(btn=>btn.addEventListener('click',()=>{const d=foods[btn.dataset.food];
  $$('.food-tabs button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const img=$('#foodImage');
  img.style.opacity='0';
  setTimeout(()=>{img.src=d.img;
  img.style.opacity='1';
  $('#foodLabel').textContent=d.label;
  $('#foodTitle').textContent=d.title;
  $('#foodText').textContent=d.text;
  $('#foodGrain').textContent=d.grain;
  $('#foodClimate').textContent=d.climate;
  $('#foodMethod').textContent=d.method;
  },150)}));

  // Festival wheel
  const festivals={diwali:['OCT',
    'DIWALI',
    'LIGHT / FAMILY / RENEWAL',
    'OCTOBER / PAN-INDIA',
    'Light as a beginning.',
    'Homes, streets and thresholds become illuminated landscapes. The ritual is also an annual reset: clean, gather, celebrate, begin again.',
    ['LIGHT',
    'FAMILY',
    'RENEWAL']],
    holi:['MAR',
    'HOLI',
    'COLOUR / PLAY / SPRING',
    'MARCH / NORTH + BEYOND',
    'Colour refuses to stay still.',
    'Powder, water, music and community turn public space into an unpredictable moving canvas.',
    ['COLOUR',
    'PLAY',
    'SPRING']],
    onam:['SEP',
    'ONAM',
    'HARVEST / HOME / ABUNDANCE',
    'SEPTEMBER / KERALA',
    'The floor becomes a welcome.',
    'Harvest, feasting and flower arrangements build a festival language of abundance and hospitality.',
    ['HARVEST',
    'HOME',
    'ABUNDANCE']],
    bihu:['APR',
    'BIHU',
    'HARVEST / DANCE / NEW YEAR',
    'APRIL / ASSAM',
    'A new year in motion.',
    'Fields, drums, dance and seasonal food connect the calendar to agricultural change.',
    ['HARVEST',
    'DANCE',
    'NEW YEAR']],
    navratri:['OCT',
    'NAVRATRI',
    'RHYTHM / DEVOTION / COMMUNITY',
    'OCTOBER / GUJARAT + INDIA',
    'Nine nights. One pulse.',
    'Garba and devotional practice turn collective movement into a living social ritual.',
    ['RHYTHM',
    'DEVOTION',
    'COMMUNITY']]};
  $$('.fest-dot').forEach(btn=>btn.addEventListener('click',()=>{const d=festivals[btn.dataset.fest];
  $$('.fest-dot').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  $('#festivalMonth').textContent=d[0];
  $('#festivalName').textContent=d[1];
  $('#festivalDesc').textContent=d[2];
  $('#festivalKicker').textContent=d[3];
  $('#festivalTitle').textContent=d[4];
  $('#festivalText').textContent=d[5];
  $('#festivalTags').innerHTML=d[6].map(x=>`<span>${x}</span>`).join('')}));

  // Lightbox gallery
  const lightbox=$('#lightbox'), lbImg=$('#lightboxImage');
  $$('.gallery-item').forEach(item=>item.addEventListener('click',()=>{lbImg.src=item.dataset.image;lightbox.classList.add('open');document.body.classList.add('lightbox-open');}));
  const closeLb=()=>{lightbox.classList.remove('open');
  document.body.classList.remove('lightbox-open')};
  $('#lightboxClose').addEventListener('click',closeLb);
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLb()});

  // Quick navigation palette
  const palette=$('#palette'), list=$('#paletteList'), input=$('#paletteInput');
  const sections=$$('[data-section]').map((el)=>({name:el.dataset.section,id:el.id || ''}));
  const renderList=(term='')=>{list.innerHTML=sections.filter(s=>s.name.toLowerCase().includes(term.toLowerCase())).map(s=>`<button
  data-id="${s.id}"><span>${s.name}</span><small>GO</small></button>`).join('')||'<div style="padding:1rem;color:#777;font-size:12px">No matching section.</div>';
  $$('#paletteList button').forEach(b=>b.addEventListener('click',()=>{palette.classList.remove('open');
  document.body.classList.remove('lightbox-open');
  const id=b.dataset.id;
  if(id)document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  }));
  };
  renderList();
  $('#paletteTrigger').addEventListener('click',()=>{palette.classList.add('open');
  input.value='';
  renderList();
  input.focus()});
  $('#paletteClose').addEventListener('click',()=>palette.classList.remove('open'));
  input.addEventListener('input',()=>renderList(input.value));
  addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();
  palette.classList.add('open');
  input.focus();
  } if(e.key==='Escape'){palette.classList.remove('open');
  header.classList.remove('open');
  document.body.classList.remove('menu-open');
  closeLb();
  }});

  // Ambient sound toggle — a soft oscillating tone, user-initiated only.
  let audioCtx=null, osc=null, gain=null;
  $('#soundBtn').addEventListener('click',()=>{
    const btn=$('#soundBtn');
    if(!audioCtx){ audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    osc=audioCtx.createOscillator();
    gain=audioCtx.createGain();
    osc.type='sine';
    osc.frequency.value=110;
    gain.gain.value=.0001;
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    }
    if(audioCtx.state==='suspended') audioCtx.resume();
    const on=btn.dataset.on==='1'; btn.dataset.on=on?'0':'1'; btn.querySelector('b').textContent=on?'OFF':'ON'; gain.gain.setTargetAtTime(on?.0001:.018,audioCtx.currentTime,.5);
  });

  // subtle hover depth on editorial cards
  $$('.heritage-feature,.story-panel,.sound-card,.number-card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5;
  const y=(e.clientY-r.top)/r.height-.5;
  card.style.transform=`perspective(1200px) rotateX(${y*-2}deg) rotateY(${x*2.5}deg)`;
  }));
  $$('.heritage-feature,.story-panel,.sound-card,.number-card').forEach(card=>card.addEventListener('pointerleave',()=>card.style.transform=''));
})();
