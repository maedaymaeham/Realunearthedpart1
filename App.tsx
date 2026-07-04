// UNEARTHED v12 — Blueprint done right.
// One voice. How and why on everything. Moment → ahead → big picture.
// Location adaptive. Portrait not data dump.
import { useState, useEffect, useMemo, useCallback, useRef } from "react";

async function sGet(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}}
async function sSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}

// Set to true only if you later add an ANTHROPIC_API_KEY + a /api/claude proxy back in.
const AI_ENABLED=false;

// ─── STYLES ──────────────────────────────────────────────────────────────────
const Styles=()=>(<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Spectral:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
  :root{
    --bg:#F6F0E6;--bgc:#FDFAF4;--bgm:#EDE5D4;--bgl:#E4D8C4;--bgd:#2C2318;
    --bl:#DDD3BE;--bm:#C4B89A;--bh:#A89870;
    --ink:#1C1810;--body:#3A3020;--mut:#6A5E40;--dim:#9A8E70;--ghost:#C0B498;
    --gold:#9A7218;--gbr:#C09030;--gbg:#FCF5DC;--gbdr:#C8A84048;
    --open:#366040;--om:#508858;--obg:#EEF7F0;--obdr:#B4D8BC;
    --tens:#7A5010;--tm:#A87020;--tbg:#FDF4E2;--tbdr:#DEB878;
    --avoid:#7A2828;--am:#A04040;--abg:#FBF0EE;--abdr:#D8ACA8;
    --lun:#504890;--lbg:#F2F0FA;--lbdr:#C4BCE8;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{height:100%;height:100dvh;overflow:hidden;background:var(--bg);}
  body,#root{font-family:'Spectral',Georgia,serif;color:var(--body);overscroll-behavior:none;}
  #root{display:flex;flex-direction:column;}
  .shell{max-width:430px;margin:0 auto;width:100%;height:100dvh;background:var(--bg);display:flex;flex-direction:column;overflow:hidden;position:relative;}
  .scr{flex:1 1 0;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain;padding-bottom:90px;}
  .scr::-webkit-scrollbar{display:none;}
  .obs{flex:1 1 0;min-height:0;display:flex;flex-direction:column;overflow:hidden;}
  .obd{flex:1 1 0;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;}
  .obf{flex:0 0 auto;padding:12px 24px max(20px,env(safe-area-inset-bottom));background:var(--bgc);border-top:1px solid var(--bl);}
  .td{font-family:'Fraunces',serif;font-weight:300;color:var(--ink);line-height:1.15;}
  .ti{font-family:'Fraunces',serif;font-style:italic;font-weight:300;color:var(--ink);line-height:1.3;}
  .tb{font-family:'Spectral',serif;font-weight:400;color:var(--body);line-height:1.75;}
  .tl{font-family:'Inter',sans-serif;font-weight:500;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);}
  .tc{font-family:'Inter',sans-serif;font-weight:400;font-size:9px;letter-spacing:.09em;text-transform:uppercase;color:var(--dim);}
  .card{background:var(--bgc);border-radius:16px;border:1px solid var(--bl);}
  .ins{background:var(--bgm);border-radius:12px;border:1px solid var(--bl);}
  .so{background:var(--obg);border-radius:14px;border:1px solid var(--obdr);}
  .st{background:var(--tbg);border-radius:14px;border:1px solid var(--tbdr);}
  .sa{background:var(--abg);border-radius:14px;border:1px solid var(--abdr);}
  .sl{background:var(--lbg);border-radius:14px;border:1px solid var(--lbdr);}
  .sg{background:var(--gbg);border-radius:14px;border:1px solid var(--gbdr);}
  .bnav{flex:0 0 auto;background:var(--bgd);border-top:1px solid #3C2E18;display:flex;justify-content:space-around;align-items:center;padding:10px 8px max(16px,env(safe-area-inset-bottom));z-index:100;}
  .nb{display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 8px;background:none;border:none;cursor:pointer;color:#6A5230;transition:color .2s;min-width:54px;}
  .nb.on{color:var(--gbr);}
  .ni{font-size:15px;line-height:1;}
  .nl{font-family:'Inter',sans-serif;font-size:9px;letter-spacing:.1em;text-transform:uppercase;}
  .bp{background:var(--bgd);color:#EDE4CC;border:none;border-radius:12px;padding:15px 24px;font-family:'Inter',sans-serif;font-size:12px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;width:100%;transition:opacity .2s;}
  .bp:hover{opacity:.85;}
  .bs{background:transparent;color:var(--gold);border:1px solid var(--gbdr);border-radius:12px;padding:13px 20px;font-family:'Inter',sans-serif;font-size:12px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;width:100%;transition:all .2s;}
  .bs:hover{background:var(--gbg);}
  .bg{background:transparent;color:var(--mut);border:1px solid var(--bm);border-radius:10px;padding:10px 16px;font-family:'Inter',sans-serif;font-size:11px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;width:100%;transition:all .2s;}
  .bg:hover{border-color:var(--bh);color:var(--body);}
  .fld{background:var(--bgc);border:1px solid var(--bm);border-radius:12px;color:var(--ink);font-family:'Spectral',serif;font-size:15px;padding:13px 16px;width:100%;outline:none;transition:border-color .2s;}
  .fld:focus{border-color:var(--gold);}
  .fld::placeholder{color:var(--ghost);}
  textarea.fld{resize:none;}
  .chip{background:var(--bgc);border:1px solid var(--bl);border-radius:20px;color:var(--mut);font-family:'Inter',sans-serif;font-size:10px;letter-spacing:.07em;text-transform:uppercase;padding:5px 13px;cursor:pointer;transition:all .15s;white-space:nowrap;}
  .chip:hover{border-color:var(--bm);color:var(--body);}
  .chip.on{background:var(--gbg);border-color:var(--gbdr);color:var(--gold);}
  .tag{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:.09em;text-transform:uppercase;}
  .to{background:var(--obg);color:var(--open);border:1px solid var(--obdr);}
  .tt{background:var(--tbg);color:var(--tens);border:1px solid var(--tbdr);}
  .tav{background:var(--abg);color:var(--avoid);border:1px solid var(--abdr);}
  .tg{background:var(--gbg);color:var(--gold);border:1px solid var(--gbdr);}
  .tlu{background:var(--lbg);color:var(--lun);border:1px solid var(--lbdr);}
  .sec{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
  .sl2{flex:1;height:1px;background:linear-gradient(90deg,var(--bl),transparent);}
  /* Hero — dark gem surface */
  .hero{background:linear-gradient(150deg,#2C2318 0%,#3A2C1A 55%,#281E0E 100%);border-radius:20px;padding:24px 20px;position:relative;overflow:hidden;margin-bottom:16px;}
  .hero::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#C8A84060,transparent);}
  .hero::after{content:'';position:absolute;top:-60px;right:-60px;width:180px;height:180px;background:radial-gradient(circle,#C8A84010 0%,transparent 65%);pointer-events:none;}
  /* Why button — inline expand */
  .why-btn{background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);padding:4px 0 0;display:inline-flex;align-items:center;gap:4px;opacity:.8;transition:opacity .15s;}
  .why-btn:hover{opacity:1;}
  .why-box{background:var(--gbg);border:1px solid var(--gbdr);border-radius:10px;padding:12px 14px;margin-top:8px;}
  /* Hour rows */
  .hrr{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;margin-bottom:3px;cursor:pointer;transition:background .12s;border:1px solid transparent;}
  .hrr:hover{background:var(--bgm);border-color:var(--bl);}
  .hrr.curr{background:var(--gbg);border-color:var(--gbdr);}
  .hrr.past{opacity:.42;}
  /* Modal */
  .ov{position:fixed;inset:0;background:rgba(28,18,8,.48);z-index:200;display:flex;align-items:flex-end;}
  .sh{background:var(--bgc);border-radius:24px 24px 0 0;padding:20px 20px max(32px,env(safe-area-inset-bottom));width:100%;max-height:88dvh;overflow-y:auto;border-top:1px solid var(--bm);}
  .hd{width:36px;height:3px;background:var(--bm);border-radius:2px;margin:0 auto 20px;}
  /* Calendar */
  .cg{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}
  .cd{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;font-size:12px;color:var(--mut);border-radius:8px;cursor:default;position:relative;}
  .cd.tod{color:var(--gold);font-weight:500;}
  .cd.oth{color:var(--ghost);}
  .cdot{position:absolute;bottom:3px;width:3px;height:3px;border-radius:50%;left:50%;transform:translateX(-50%);}
  /* Portrait sections */
  .portrait-block{background:var(--bgc);border-radius:16px;border:1px solid var(--bl);padding:18px;margin-bottom:12px;}
  .portrait-row{display:flex;gap:8px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--bl);}
  .portrait-row:last-child{border-bottom:none;padding-bottom:0;}
  /* Codex */
  .cxc{background:var(--bgc);border-radius:14px;border-left:3px solid var(--bl);border-top:1px solid var(--bl);border-right:1px solid var(--bl);border-bottom:1px solid var(--bl);padding:14px 16px;margin-bottom:8px;cursor:pointer;transition:all .15s;}
  .cxc:hover{background:var(--bgm);}
  .cxc.done{border-left-color:#5070C0;}
  .cxc.planned{border-left-color:var(--gold);}
  .cxc.seed{border-left-color:var(--lun);}
  .cxc.note{border-left-color:var(--bm);}
  @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  .ent{animation:fadeUp .3s ease;}
  @keyframes spin{to{transform:rotate(360deg)}}
  .sp{animation:spin 1.4s linear infinite;display:inline-block;}
  @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
`}</style>);

// ─── ASTRO MATH ───────────────────────────────────────────────────────────────
const SIGNS=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
function jd(d){const a=Math.floor((14-d.getUTCMonth()-1)/12),y=d.getUTCFullYear()+4800-a,m=d.getUTCMonth()+1+12*a-3;return d.getUTCDate()+Math.floor((153*m+2)/5)+365*y+Math.floor(y/4)-Math.floor(y/100)+Math.floor(y/400)-32045-0.5+(d.getUTCHours()+(d.getUTCMinutes()+d.getUTCSeconds()/60)/60)/24;}
function mLon(j){const T=(j-2451545)/36525,L0=218.3164477+481267.88123421*T,M=357.5291092+35999.0502909*T,Mp=134.9633964+477198.8675055*T,D=297.8501921+445267.1114034*T,F=93.2720950+483202.0175233*T;return(((L0+6.288774*Math.sin(Mp*Math.PI/180)+1.274027*Math.sin((2*D-Mp)*Math.PI/180)+0.658314*Math.sin(2*D*Math.PI/180)+0.213618*Math.sin(2*Mp*Math.PI/180)-0.185116*Math.sin(M*Math.PI/180)-0.114332*Math.sin(2*F*Math.PI/180))%360)+360)%360;}

// ─── PERSONAL/SOCIAL PLANETS — Mercury through Saturn ────────────────────────
// Low-precision Keplerian orbital elements (Paul Schlyter's well-known public-
// domain "planetary positions" method — accurate to well under a degree for
// these five planets around the modern era, which is more than sufficient for
// determining a zodiac sign). Unlike Rising, these only need a birth DATE —
// no birth time or place required — so every user gets these placements
// immediately from what they already provided at onboarding.
const PLANET_ELEMENTS={
  Mercury:{N:[48.3313,3.24587e-5],i:[7.0047,5.00e-8],w:[29.1241,1.01444e-5],a:0.387098,e:[0.205635,5.59e-10],M:[168.6562,4.0923344368]},
  Venus:{N:[76.6799,2.46590e-5],i:[3.3946,2.75e-8],w:[54.8910,1.38374e-5],a:0.723330,e:[0.006773,-1.302e-9],M:[48.0052,1.6021302244]},
  Mars:{N:[49.5574,2.11081e-5],i:[1.8497,-1.78e-8],w:[286.5016,2.92961e-5],a:1.523688,e:[0.093405,2.516e-9],M:[18.6021,0.5240207766]},
  Jupiter:{N:[100.4542,2.76854e-5],i:[1.3030,-1.557e-7],w:[273.8777,1.64505e-5],a:5.20256,e:[0.048498,4.469e-9],M:[19.8950,0.0830853001]},
  Saturn:{N:[113.6634,2.38980e-5],i:[2.4886,-1.081e-7],w:[339.3939,2.97661e-5],a:9.55475,e:[0.055546,-9.499e-9],M:[316.9670,0.0334442282]},
};
// The Sun's apparent orbital elements (= Earth's heliocentric elements), needed
// to convert each planet's heliocentric position into a geocentric one.
const SUN_ELEMENTS={w:[282.9404,4.70935e-5],a:1.000000,e:[0.016709,-1.151e-9],M:[356.0470,0.9856002585]};
const D2R=Math.PI/180,R2D=180/Math.PI;
function solveKepler(Mdeg,e){
  let E=Mdeg+e*R2D*Math.sin(Mdeg*D2R)*(1+e*Math.cos(Mdeg*D2R));
  for(let k=0;k<6;k++){
    const dE=(E-e*R2D*Math.sin(E*D2R)-Mdeg)/(1-e*Math.cos(E*D2R));
    E-=dE;
    if(Math.abs(dE)<1e-6)break;
  }
  return E;
}
function getPlanetLon(planet,date){
  const d=jd(date)-2451543.5; // days since epoch used by these elements
  const el=PLANET_ELEMENTS[planet];
  const N=el.N[0]+el.N[1]*d,i=el.i[0]+el.i[1]*d,w=el.w[0]+el.w[1]*d,a=el.a,e=el.e[0]+el.e[1]*d;
  const M=((el.M[0]+el.M[1]*d)%360+360)%360;
  const E=solveKepler(M,e);
  const xv=a*(Math.cos(E*D2R)-e),yv=a*(Math.sqrt(1-e*e)*Math.sin(E*D2R));
  const v=Math.atan2(yv,xv)*R2D,r=Math.sqrt(xv*xv+yv*yv);
  const vw=(v+w)*D2R,Nr=N*D2R,ir=i*D2R;
  const xh=r*(Math.cos(Nr)*Math.cos(vw)-Math.sin(Nr)*Math.sin(vw)*Math.cos(ir));
  const yh=r*(Math.sin(Nr)*Math.cos(vw)+Math.cos(Nr)*Math.sin(vw)*Math.cos(ir));
  // Sun's geocentric position (flat in the ecliptic, N=0, i=0)
  const sM=((SUN_ELEMENTS.M[0]+SUN_ELEMENTS.M[1]*d)%360+360)%360,sE_=SUN_ELEMENTS.e[0]+SUN_ELEMENTS.e[1]*d;
  const sEcc=solveKepler(sM,sE_);
  const sxv=SUN_ELEMENTS.a*(Math.cos(sEcc*D2R)-sE_),syv=SUN_ELEMENTS.a*(Math.sqrt(1-sE_*sE_)*Math.sin(sEcc*D2R));
  const sLon=Math.atan2(syv,sxv)*R2D+SUN_ELEMENTS.w[0]+SUN_ELEMENTS.w[1]*d;
  const sr=Math.sqrt(sxv*sxv+syv*syv);
  const xs=sr*Math.cos(sLon*D2R),ys=sr*Math.sin(sLon*D2R);
  const xg=xh+xs,yg=yh+ys;
  return(((Math.atan2(yg,xg)*R2D)%360)+360)%360;
}
// Every user has a DOB — so these five signs are always available, computed at
// noon UTC on the birth date (precise enough: these planets rarely change sign
// within a single day, unlike the Moon).
function derivePlanetSigns(dob){
  if(!dob)return null;
  try{
    const d=new Date(dob+'T12:00:00Z');
    const out={};
    for(const p of['Mercury','Venus','Mars','Jupiter','Saturn'])out[p]=SIGNS[Math.floor(getPlanetLon(p,d)/30)];
    return out;
  }catch{return null;}
}
// What each planet governs — used to write a genuinely combined "planet in
// sign" sentence from existing sign content (SD) rather than needing 60
// hand-authored blurbs (5 planets × 12 signs).
const PLANET_DOMAIN={
  Mercury:{label:'how you think and communicate',icon:'☿',col:'#387888'},
  Venus:{label:'how you love, connect, and what you find beautiful',icon:'♀',col:'#985068'},
  Mars:{label:'how you take action, assert yourself, and pursue what you want',icon:'♂',col:'#903030'},
  Jupiter:{label:'where you naturally grow, expand, and find opportunity',icon:'♃',col:'#4848A0'},
  Saturn:{label:'where you build discipline and meet necessary limits',icon:'♄',col:'#686858'},
};
function sSgn(m,d){
  // Each entry is [sign, monthItStarts, dayItStarts] — the day a NEW sign begins.
  // We walk this in calendar order and return the sign whose start date is the
  // most recent one at or before the given (m,d), wrapping around for early January.
  const starts=[
    ['Capricorn',1,1],   // Jan 1–19 is still Capricorn (started Dec 22 prior year)
    ['Aquarius',1,20],
    ['Pisces',2,19],
    ['Aries',3,21],
    ['Taurus',4,20],
    ['Gemini',5,21],
    ['Cancer',6,21],
    ['Leo',7,23],
    ['Virgo',8,23],
    ['Libra',9,23],
    ['Scorpio',10,23],
    ['Sagittarius',11,22],
    ['Capricorn',12,22],
  ];
  // Convert (m,d) to a comparable value and find the last start date <= it.
  const val=m*100+d;
  let result=starts[0][0];
  for(const[sign,sm,sd] of starts){
    const startVal=sm*100+sd;
    if(val>=startVal)result=sign;
  }
  return result;
}
function lpN(dob){let n=dob.replace(/-/g,'').split('').map(Number).reduce((a,b)=>a+b,0);while(n>9&&n!==11&&n!==22&&n!==33){n=String(n).split('').map(Number).reduce((a,b)=>a+b,0);}return n;}
function mFromB(dob,bt,lat,lng){
  // bt is already in 24h local time — convert to UTC using timezone
  try{
    const[h,mi]=bt.split(':').map(Number);
    const birthDate=new Date(dob+'T12:00:00Z');
    const offset=(lat!=null&&lng!=null)?getTZOffset(lat,lng,birthDate):0;
    const utcH=((h+mi/60-offset)%24+24)%24;
    const uH=Math.floor(utcH),uM=Math.round((utcH-uH)*60);
    const d2=new Date(`${dob}T${String(uH).padStart(2,'0')}:${String(uM<60?uM:0).padStart(2,'0')}:00Z`);
    return SIGNS[Math.floor(mLon(jd(d2))/30)];
  }catch{return null;}
}
function mFromD(dob){
  // Best estimate: calculate at noon (midpoint of day) — correct for ~half the population
  // Also check start and end of day to flag if moon changes sign
  try{
    const noon=SIGNS[Math.floor(mLon(jd(new Date(dob+'T12:00:00Z')))/30)];
    const start=SIGNS[Math.floor(mLon(jd(new Date(dob+'T00:00:00Z')))/30)];
    const end=SIGNS[Math.floor(mLon(jd(new Date(dob+'T23:59:00Z')))/30)];
    const certain=start===end; // moon didn't change sign this day
    return{sign:noon,certain,otherSign:certain?null:(start===noon?end:start)};
  }catch{return null;}
}
// Known timezone offsets (standard/DST) for geocoded cities
// DST in US: second Sunday March → first Sunday November
function isDST(date,tz){
  // Approximate US DST: mid-March to early-November
  const m=date.getMonth()+1,d=date.getDate();
  if(tz==='America/Phoenix')return false; // no DST
  const isDSTRange=(m>3&&m<11)||(m===3&&d>=8)||(m===11&&d<=7);
  return isDSTRange;
}
function getTZOffset(lat,lng,date){
  // Map longitude ranges to timezone base offsets (standard time, hours from UTC)
  const offsets=[
    {lngMin:-75,lngMax:-67,std:-5,tz:'America/New_York'},    // Eastern
    {lngMin:-95,lngMax:-75,std:-6,tz:'America/Chicago'},     // Central east
    {lngMin:-100,lngMax:-95,std:-6,tz:'America/Chicago'},    // Central west (Nebraska etc)
    {lngMin:-104,lngMax:-100,std:-7,tz:'America/Denver'},    // Mountain
    {lngMin:-125,lngMax:-104,std:-8,tz:'America/Los_Angeles'}, // Pacific
    {lngMin:-170,lngMax:-125,std:-9,tz:'America/Anchorage'},
    // International approximations
    {lngMin:-7,lngMax:2,std:0,tz:'Europe/London'},
    {lngMin:2,lngMax:15,std:1,tz:'Europe/Paris'},
    {lngMin:135,lngMax:145,std:9,tz:'Asia/Tokyo'},
    {lngMin:148,lngMax:155,std:10,tz:'Australia/Sydney'},
    {lngMin:55,lngMax:60,std:4,tz:'Asia/Dubai'},
    {lngMin:100,lngMax:105,std:8,tz:'Asia/Singapore'},
    {lngMin:72,lngMax:78,std:5.5,tz:'Asia/Kolkata'},
  ];
  // Phoenix special case (no DST)
  if(lat>31&&lat<37&&lng>-115&&lng<-109)return -7;
  const match=offsets.find(o=>lng>=o.lngMin&&lng<o.lngMax);
  if(!match)return Math.round(lng/15); // fallback
  const dst=isDST(date,match.tz);
  return match.std+(dst?1:0);
}
function gRising(dob,bt,lat,lng){
  if(!dob||!bt||lat==null||lng==null)return null;
  try{
    const[h,m]=bt.split(':').map(Number);
    const birthDate=new Date(dob+'T12:00:00Z');
    const offset=getTZOffset(lat,lng,birthDate);
    const utcH=h+m/60-offset;
    const utcAdj=((utcH%24)+24)%24;
    const uH=Math.floor(utcAdj),uM=Math.round((utcAdj-uH)*60);
    const d2=new Date(`${dob}T${String(uH).padStart(2,'0')}:${String(uM<60?uM:0).padStart(2,'0')}:00Z`);
    const j2=jd(d2);
    const T=(j2-2451545)/36525;
    const GMST=((280.46061837+360.98564736629*(j2-2451545)+0.000387933*T*T-T*T*T/38710000)%360+360)%360;
    const LST=((GMST+lng)%360+360)%360;
    const eps=(23.439291111-0.013004167*T)*Math.PI/180;
    const latR=lat*Math.PI/180,thetaR=LST*Math.PI/180;
    const tanAsc=-Math.cos(thetaR)/(Math.sin(thetaR)*Math.cos(eps)+Math.tan(latR)*Math.sin(eps));
    let asc=Math.atan(tanAsc)*180/Math.PI;
    if(LST>=0&&LST<180)asc+=180;
    asc=((asc%360)+360)%360;
    return SIGNS[Math.floor(asc/30)];
  }catch(e){return null;}
}
function chZ(year,month,day){const A=['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'],E=['Wood','Fire','Earth','Metal','Water'],EM={Rat:'🐀',Ox:'🐂',Tiger:'🐅',Rabbit:'🐇',Dragon:'🐉',Snake:'🐍',Horse:'🐎',Goat:'🐐',Monkey:'🐒',Rooster:'🐓',Dog:'🐕',Pig:'🐖'};const adj=month<2||(month===2&&day<4)?year-1:year,animal=A[(adj-4+1200)%12],element=E[Math.floor(((adj-4)%10)/2)];return{animal,element,emoji:EM[animal],full:`${element} ${animal}`};}

// ─── CHINESE ZODIAC — full tradition ──────────────────────────────────────────
// Per-animal personality data, matching the depth of Western sign data (SD).
const ZH_ANIMALS={
  Rat:{strength:'Quick-witted, resourceful, and adaptable. You read a room before anyone else does and find the opening others miss.',shadow:'A tendency toward restlessness and stockpiling — security can become hoarding, of resources or of grudges.',needs:'Intellectual stimulation and the freedom to move toward opportunity the moment you spot it.',why:'The Rat leads the Chinese zodiac cycle — first of the twelve, associated with new beginnings, sharp intelligence, and an instinct for survival. In folklore the Rat won the great race by cleverness, not strength, which is the whole point of the sign: you win by being smart, not by being loudest.'},
  Ox:{strength:'Steady, dependable, and quietly powerful. You build through patient, unglamorous effort that others underestimate until they see the results.',shadow:'Stubbornness — once your mind is set, changing course can feel like a personal defeat rather than a reasonable update.',needs:'Routine, clear expectations, and recognition for consistency rather than spectacle.',why:'The Ox is the second sign, symbolizing diligence and the strength to carry real weight. In the founding myth, the Ox would have won the race outright but let the clever Rat ride on its back — strength married to a forgiving nature.'},
  Tiger:{strength:'Brave, magnetic, and unafraid to lead. You move through obstacles other signs would route around.',shadow:'Impulsiveness and a need for control that can read as combative even when your intent is protective.',needs:'Autonomy, respect, and real challenges worthy of your courage — boredom is what actually defeats you.',why:'The Tiger represents courage and authority in Chinese tradition — historically a symbol of military strength and protection against evil. The third sign carries fierce, generous energy: a born leader who fights for others as readily as for itself.'},
  Rabbit:{strength:'Gentle, perceptive, and diplomatically sharp. You de-escalate conflict instinctively and notice what people actually need before they ask.',shadow:'Conflict avoidance that can tip into withdrawal — peace at the cost of your own voice.',needs:'A genuinely safe environment and people who don\'t mistake your softness for a lack of conviction.',why:'The Rabbit is the fourth sign, associated with longevity, grace, and quiet good fortune. Where the Tiger fights for victory, the Rabbit achieves the same outcomes by reading the moment and moving with it rather than against it.'},
  Dragon:{strength:'Charismatic, visionary, and naturally larger than life. You carry an energy people are drawn to without quite knowing why.',shadow:'A tendency toward grandiosity — the same self-belief that inspires others can tip into not hearing feedback.',needs:'A stage worthy of your vision and people who can keep pace rather than simply admire from a distance.',why:'The Dragon is the only mythical animal in the cycle and historically the most revered — associated with imperial power, luck, and command over the elements. Fifth in the sequence, it carries an authority none of the other signs are expected to match.'},
  Snake:{strength:'Intuitive, strategic, and quietly magnetic. You see the real structure beneath a situation while others react to the surface.',shadow:'Secretiveness — your instinct to hold information close can read as distance or distrust, even when it\'s really just caution.',needs:'Privacy, depth, and partners willing to earn your trust rather than demand instant transparency.',why:'The Snake is the sixth sign, associated with wisdom and transformation — in Chinese tradition considered a "small dragon," carrying refined versions of the Dragon\'s power without needing to announce it. Patience and perception are your actual weapons.'},
  Horse:{strength:'Energetic, independent, and built for forward motion. You bring momentum into any room and chafe against anything that slows you down.',shadow:'Restlessness that can undercut your own commitments — the same drive that gets you moving can make staying difficult.',needs:'Freedom of movement, both literal and metaphorical, and people who don\'t mistake your independence for disinterest.',why:'The Horse is the seventh sign, symbolizing freedom and travel — historically associated with the cavalry, speed, and the ability to cover ground others couldn\'t. The cycle\'s midpoint carries the most outward, kinetic energy of any animal.'},
  Goat:{strength:'Gentle, artistic, and deeply empathetic. You create beauty and comfort wherever you land and genuinely feel what others are going through.',shadow:'Indecisiveness under pressure and a tendency to absorb others\' anxiety as your own.',needs:'A stable, harmonious environment and explicit reassurance — ambiguity is more draining for you than for most signs.',why:'The Goat (sometimes Sheep) is the eighth sign, associated with art, compassion, and a peaceable nature. In tradition, Goat years are considered gentle ones precisely because this sign\'s entire orientation is toward harmony over conflict.'},
  Monkey:{strength:'Clever, playful, and an excellent problem-solver. You find the unconventional solution others walk right past.',shadow:'A tendency toward mischief or restlessness that can undercut follow-through — brilliant starts, inconsistent finishes.',needs:'Mental stimulation and an audience that appreciates wit, not just results.',why:'The Monkey is the ninth sign, famous in Chinese folklore (most notably Sun Wukong, the Monkey King) for cleverness, mischief, and the ability to outthink stronger opponents. Intelligence is the actual superpower here, not force.'},
  Rooster:{strength:'Observant, honest, and meticulous. You see details others miss and say what you actually mean, even when it\'s inconvenient.',shadow:'A critical streak — the same precision that catches real problems can come across as nitpicking when turned on people instead of tasks.',needs:'Order, honesty in return, and genuine acknowledgment of the work you do that goes unnoticed.',why:'The Rooster is the tenth sign, associated with honesty, punctuality, and vigilance — traditionally the animal that announces the dawn, the one who tells the truth whether or not anyone wants to hear it yet.'},
  Dog:{strength:'Loyal, principled, and protective of the people and causes you care about. You show up consistently in ways that quietly define real trust.',shadow:'Anxiety and a tendency toward suspicion — the same loyalty that makes you steadfast can make you slow to extend trust to new people.',needs:'Honesty and consistency from others — you give loyalty completely and need it returned in kind, not performed.',why:'The Dog is the eleventh sign, symbolizing loyalty, justice, and honesty — historically considered the guardian sign, watchful and protective. Of all twelve animals, the Dog is most associated with genuine, unglamorous faithfulness.'},
  Pig:{strength:'Warm, generous, and genuinely good-natured. You bring abundance and comfort to the people around you without keeping score.',shadow:'Naivety that can be taken advantage of — your generosity assumes good faith in others that isn\'t always returned.',needs:'Genuine warmth in return and people who won\'t exploit your trusting nature.',why:'The Pig closes the twelve-year cycle, associated in Chinese tradition with honesty, generosity, and good fortune — considered a fortunate sign to be born under because of its connection to abundance and a contented nature.'},
};

// Five Element generating cycle (Sheng): each element feeds/creates the next.
// Wood burns → Fire; Fire's ash becomes → Earth; Earth compacts → Metal (ore);
// Metal melts/condenses moisture → Water; Water nourishes → Wood.
const FIVE_EL_CYCLE={Wood:{feeds:'Fire',controlledBy:'Metal',controls:'Earth'},Fire:{feeds:'Earth',controlledBy:'Water',controls:'Metal'},Earth:{feeds:'Metal',controlledBy:'Wood',controls:'Water'},Metal:{feeds:'Water',controlledBy:'Fire',controls:'Wood'},Water:{feeds:'Wood',controlledBy:'Earth',controls:'Fire'}};
const FIVE_EL_DESC={
  Wood:'Growth, vision, and generosity. Wood always reaches toward light — expansive, idealistic, and rarely satisfied standing still.',
  Fire:'Passion, transformation, and visibility. Fire changes everything it touches — dynamic, expressive, drawn to being seen.',
  Earth:'Stability, nourishment, and patience. Earth builds to last — grounded, reliable, the element everything else depends on.',
  Metal:'Precision, principle, and refinement. Metal sharpens what it touches — disciplined, exacting, built for excellence.',
  Water:'Depth, intuition, and adaptability. Water finds the path of least resistance — perceptive, flexible, moving around rather than through obstacles.',
};

// The 4 Trines of Harmony — animals that naturally support and understand each other.
const ZH_TRINES=[['Rat','Dragon','Monkey'],['Ox','Snake','Rooster'],['Tiger','Horse','Dog'],['Rabbit','Goat','Pig']];
// The 6 Secret Friend pairs — quieter, one-on-one mutual support outside the trines.
const ZH_SECRET_FRIENDS=[['Rat','Ox'],['Tiger','Pig'],['Rabbit','Dog'],['Dragon','Rooster'],['Snake','Monkey'],['Horse','Goat']];
// The 6 Clashes — animals directly opposite on the 12-year wheel, classic friction pairs.
const ZH_CLASHES=[['Rat','Horse'],['Ox','Goat'],['Tiger','Monkey'],['Rabbit','Rooster'],['Dragon','Dog'],['Snake','Pig']];

function getZhCompat(animalA,animalB){
  if(!animalA||!animalB)return null;
  if(animalA===animalB)return{tier:'mirror',label:'Mirror',desc:`Same animal year — you understand each other's instincts immediately, for better and worse. The ${animalA}'s strengths and shadow both show up doubled in this pairing.`};
  const inTrine=ZH_TRINES.some(t=>t.includes(animalA)&&t.includes(animalB));
  if(inTrine)return{tier:'trine',label:'Trine of Harmony',desc:`${animalA} and ${animalB} sit in the same Trine of Harmony — one of the four traditional groupings where temperaments naturally reinforce each other. This is considered one of the most supportive pairings in the whole system.`};
  const isSecretFriend=ZH_SECRET_FRIENDS.some(([a,b])=>(a===animalA&&b===animalB)||(a===animalB&&b===animalA));
  if(isSecretFriend)return{tier:'friend',label:'Secret Friends',desc:`${animalA} and ${animalB} are traditional Secret Friends — a quieter, one-on-one bond outside the trines. Less flashy than a Trine match, but steady and genuinely loyal.`};
  const isClash=ZH_CLASHES.some(([a,b])=>(a===animalA&&b===animalB)||(a===animalB&&b===animalA));
  if(isClash)return{tier:'clash',label:'Direct Clash',desc:`${animalA} and ${animalB} sit directly opposite each other on the 12-year wheel — a traditional clash pairing. This doesn't mean incompatible, it means the friction is real and conscious effort matters more here than in most pairings.`};
  return{tier:'neutral',label:'Neutral',desc:`${animalA} and ${animalB} have no special traditional relationship — neither reinforcing nor clashing. Compatibility here depends more on the rest of the chart than on the animal signs alone.`};
}

function bdN(dob){const d=parseInt(dob.split('-')[2]||'1',10);return{raw:d,red:d>9?Math.floor(d/10)+d%10:d};}
function pY(dob,yr){const p=dob.split('-');let s=parseInt(p[1])+parseInt(p[2])+yr;while(s>9&&s!==11&&s!==22&&s!==33){s=String(s).split('').map(Number).reduce((a,b)=>a+b,0);}return s;}
function pM(py,mo){let s=py+mo;while(s>9&&s!==11&&s!==22&&s!==33){s=String(s).split('').map(Number).reduce((a,b)=>a+b,0);}return s;}
function pD(pm,d){let s=pm+d;while(s>9){s=String(s).split('').map(Number).reduce((a,b)=>a+b,0);}return s;}
function mSign(date){return SIGNS[Math.floor(mLon(jd(date))/30)];}

// ─── MOON ─────────────────────────────────────────────────────────────────────
const PHASES=[
  {name:'New Moon',emoji:'🌑',p0:0,p1:.025,tier:'open',energy:'Begin within. Seeds planted in darkness grow unseen first.',works:['new beginnings','inner intention','planting seeds'],avoid:'Launching what needs public momentum yet.',practices:'Write new intentions and set them into a stone or piece of paper to carry through the cycle. Charge new tools or jewelry for the first time. Plant literal or figurative seeds.',why:'The New Moon is when the moon is between Earth and the Sun — completely dark from our perspective. In every wisdom tradition this is the moment of potential before form. Think of it like a held breath before a word. The energy is inward, generative, quiet. Things started here have the full lunar cycle to build momentum, which is why intentions set at New Moon carry unusual staying power.'},
  {name:'Waxing Crescent',emoji:'🌒',p0:.025,p1:.25,tier:'open',energy:'Take first steps. Lean into what you set in motion.',works:['growth','building','attraction'],avoid:'Second-guessing what you already committed to.',practices:'Begin the practical steps toward your New Moon intention. Light a candle for a goal already in motion. Not a cleansing or clearing window — keep moving forward.',why:'The first sliver of light after New Moon. The seed is beginning to push through soil. This is not the time for new intentions — it\'s the time to act on the ones you already set. The moon\'s growing light mirrors growing momentum. Movement now compounds.'},
  {name:'First Quarter',emoji:'🌓',p0:.25,p1:.275,tier:'open',energy:'Push through resistance. Decisive action is the assignment.',works:['courage','action','breaking blocks'],avoid:'Passive waiting — this moon rewards those who move.',practices:'Do the thing you\'ve been putting off. Good window for courage rituals or breaking through a specific block — not for rest or reflection work.',why:'Half the moon is lit. This is the tension point of the lunar cycle — the moment where what you started meets real resistance. The square aspect between Sun and Moon creates friction that is generative, not destructive. Think of it like the resistance in a workout. It\'s not a sign you\'re wrong. It\'s the sign you\'re building something real.'},
  {name:'Waxing Gibbous',emoji:'🌔',p0:.275,p1:.5,tier:'open',energy:'Refine and strengthen. You are approaching the peak.',works:['refinement','abundance','strengthening'],avoid:'Abandoning what is almost ready.',practices:'Fine-tune what\'s already working rather than starting fresh. Good window for abundance and prosperity workings as the energy builds toward the peak.',why:'More than half the moon is lit and growing. The energy here is about refinement — you\'ve done the hard initiating work, now you polish and perfect. This is not the time to start something new. It\'s the time to make what you already started undeniable.'},
  {name:'Full Moon',emoji:'🌕',p0:.5,p1:.525,tier:'open',energy:'Peak power. Illuminate what is true. Release what is complete.',works:['manifestation','release','gratitude','completion'],avoid:'Beginning what needs quiet gestation.',practices:'The traditional window to cleanse and recharge crystals — leave them out under the moonlight overnight. Charge water for later use. Do manifestation work at peak strength. Hold a gratitude practice for what\'s come to completion.',why:'The moon is fully lit — Earth is between the Sun and Moon. Peak illumination means peak visibility, peak emotion, peak energy. Nothing stays hidden at Full Moon. This is why it amplifies everything — the good and the difficult. Use it to complete, celebrate, and release. What you begin now will be oversized and hard to sustain.'},
  {name:'Waning Gibbous',emoji:'🌖',p0:.525,p1:.75,tier:'tens',energy:'Integrate and share. Let go of what exceeded its usefulness.',works:['gratitude','releasing excess','integration'],avoid:'Forcing new beginnings — the tide turns inward.',practices:'Journal what the Full Moon revealed. Share results or gratitude with others. Begin sorting what to release — the actual letting go comes next phase.',why:'The moon\'s light is receding. This is the harvest phase — you take what the Full Moon illuminated and integrate it. Share what you learned. Release what was exposed as unnecessary. The energy is generous but inward-turning. New launches here tend to fade quickly.'},
  {name:'Last Quarter',emoji:'🌗',p0:.75,p1:.775,tier:'tens',energy:'Release. Make space. Clear what no longer serves.',works:['banishing','cord cutting','release'],avoid:'Initiating anything new — clear first.',practices:'Banishing and cord-cutting work belongs here. Cleanse your space — smoke cleansing, sweeping, decluttering. Cleanse crystals that have been absorbing heavy energy (saltwater or running water, not all stones tolerate this — check first).',why:'Another square — this time between a waning Moon and the Sun. The tension here is about release, not resistance. What needs to end? What are you still holding that has already completed its purpose? This moon is a cosmic editor. Let it cut.'},
  {name:'Waning Crescent',emoji:'🌘',p0:.775,p1:1,tier:'tens',energy:'Rest. Withdraw. Prepare the ground for what comes.',works:['rest','reflection','shadow work'],avoid:'Social launches or anything needing outward energy.',practices:'Shadow work and quiet reflection. Put tools away rather than using them. Rest is the actual practice here — not a gap between practices.',why:'The final sliver before darkness. In farming traditions this was the fallow period — the field is not empty, it\'s resting and preparing. Your nervous system needs this. Your creativity needs this. The New Moon that follows will be more potent for the rest you allowed now.'},
];
function getMoon(date){const ref=new Date('2000-01-06T18:14:00Z'),pct=((((date-ref)/(86400000))%29.53058867)+29.53058867)%29.53058867/29.53058867;return{...PHASES.find(p=>pct>=p.p0&&pct<p.p1)||PHASES[0],pct};}

// ─── PLANETS ──────────────────────────────────────────────────────────────────
const PL={
  Sun:{sym:'☉',col:'#A07818',best:['confidence','visibility','leadership','solar workings','signing agreements'],avoid:['shadow work','endings'],tier:'open',
    why:'The Sun rules Sunday and solar hours for the same reason it anchors our solar system — it\'s the source of light and life force. In the Chaldean system, each hour is governed by a planet in descending order of orbital speed as seen from Earth. Solar hours amplify anything that needs to be seen, recognized, or confirmed. For you specifically, your Sun sign tells you how solar energy hits — a Virgo Sun uses a Sun hour for precision and craft, a Leo Sun uses it for creative expression. Same hour, different expression.'},
  Moon:{sym:'☽',col:'#6050A0',best:['intuition','emotional healing','divination','dream work','inner reflection'],avoid:['high-energy launches','aggressive action'],tier:'open',
    why:'The Moon governs water, cycles, emotion, and the unconscious. Lunar hours are when your intuition runs clearest and your body most responds to subtle energy. This is the hour for anything that works beneath the surface — healing, dreaming, divination, anything requiring feeling over force. Your Moon sign shapes how this hits you personally. A Scorpio Moon in a lunar hour has unusually deep access to what lies beneath.'},
  Mars:{sym:'♂',col:'#903030',best:['protection','banishing','courage','cord cutting','decisive action'],avoid:['love workings','peace negotiations','softness'],tier:'tens',
    why:'Mars is the planet of will, action, and severance. Its hours carry direct, forceful energy that cuts through hesitation. This is not bad energy — it\'s clarifying energy. Use it to end what needs ending, protect what needs protecting, or move decisively on something you\'ve been avoiding. The tension comes when you try to use Mars hours for gentle or receptive work. Mars doesn\'t do gentle.'},
  Mercury:{sym:'☿',col:'#387888',best:['communication','contracts','study','written workings','precision thinking'],avoid:['vague intentions','passive waiting'],tier:'open',
    why:'Mercury governs the mind, language, and the movement of information. Mercury hours are when your thinking is sharpest and your words carry most precision. Best for conversations that matter, agreements that need to hold, studying something complex, or any working that involves written language. Mercury retrograde affects these hours more than others — you\'ll feel it as a slight drag on clarity.'},
  Jupiter:{sym:'♃',col:'#4848A0',best:['abundance','expansion','luck','growth','legal matters','teaching'],avoid:['banishing','constriction','limitation workings'],tier:'open',
    why:'Jupiter is the great expander — the largest planet, associated with luck, philosophy, abundance, and growth. Jupiter hours amplify whatever you put into them. Start something you want to grow. Ask for what you want. Make the big ask. Apply for the opportunity. The only thing Jupiter hours are poor for is endings and releases — expansion energy fights contraction.'},
  Venus:{sym:'♀',col:'#985068',best:['love','beauty','attraction','self-love','harmony','creative work'],avoid:['aggressive action','banishing'],tier:'open',
    why:'Venus governs love, beauty, pleasure, and the art of attraction. Venus hours open the heart and soften edges. They\'re best for anything involving relationship — romantic or otherwise — and for creative work that needs aesthetic judgment. Self-care practices done in Venus hours tend to land deeper. The energy here is receptive and magnetic rather than forceful.'},
  Saturn:{sym:'♄',col:'#686858',best:['banishing','cord cutting','endings','strong boundaries','long-term discipline'],avoid:['new beginnings','love workings','attraction','launches'],tier:'avoid',
    why:'Saturn is the cosmic editor and timekeeper. It rules endings, limitations, and the structures that outlast everything else. Saturn hours are exceptional for releasing, banishing, cutting cords, and any work that requires saying a final no. The mistake people make is treating Saturn hours as unlucky — they\'re not unlucky, they\'re just wrong for starts. Anything you launch in a Saturn hour will face unusual resistance or contraction. Use them for what they\'re built for.'},
};
const CHL=['Saturn','Jupiter','Mars','Sun','Venus','Mercury','Moon'],DR=[3,6,2,5,1,4,0];

function getHours(date,lat,lng){
  const n=jd(date)-2451545,L=(280.460+0.9856474*n)%360,g=(357.528+0.9856003*n)*Math.PI/180;
  const lambda=(L+1.915*Math.sin(g)+0.020*Math.sin(2*g))*Math.PI/180,eps=23.439*Math.PI/180;
  const sinDec=Math.sin(eps)*Math.sin(lambda),dec=Math.asin(sinDec),latR=lat*Math.PI/180;
  const cosH=(Math.sin(-0.0145)-Math.sin(latR)*Math.sin(dec))/(Math.cos(latR)*Math.cos(dec));
  if(Math.abs(cosH)>1)return null;
  const H=Math.acos(cosH)*180/Math.PI,GMST=280.460+360.9856474*n;
  const RA=Math.atan2(Math.cos(eps)*Math.sin(lambda),Math.cos(lambda))*180/Math.PI;
  const transit=(RA+lng-GMST+720)%360/15,rise=(transit-H/15+24)%24,set=(transit+H/15+24)%24;
  const dayL=(set-rise+24)%24,nightL=24-dayL,dH=dayL/12,nH=nightL/12,dsi=DR[date.getDay()];
  const nowU=date.getUTCHours()+date.getUTCMinutes()/60,lst=((nowU+lng/15)%24+24)%24;
  const mk=(i,start,ruler,isDay)=>{
    const s=(start+24)%24,e=(s+(isDay?dH:nH))%24;
    const isCurr=(s<e)?(lst>=s&&lst<e):(lst>=s||lst<e),isPast=!isCurr&&(s<e?lst>=e:false);
    const h=Math.floor(s),m=Math.round((s-h)*60);
    const minLeft=isCurr?Math.round(((e>s?e:e+24)-lst)*60):0;
    return{num:i+1+(isDay?0:12),ruler,pl:PL[ruler],start:s,end:e,isCurr,isPast,minLeft,label:`${h===0?12:h>12?h-12:h}:${String(m).padStart(2,'0')} ${h<12?'AM':'PM'}`,isDay};
  };
  const hrs=[...Array(12).keys()].map(i=>mk(i,(rise+i*dH+24)%24,CHL[(dsi+i)%7],true))
    .concat([...Array(12).keys()].map(i=>mk(i,(set+i*nH+24)%24,CHL[(dsi+12+i)%7],false)));
  return{hours:hrs,rise,set,curr:hrs.find(h=>h.isCurr)||null,dayLen:dayL};}

// ─── SEASONS ──────────────────────────────────────────────────────────────────
function getSeason(date,lat){
  const m=date.getMonth()+1,d=date.getDate(),N=lat>=0;
  const sp=(m===3&&d>=20)||(m>3&&m<6)||(m===6&&d<21),su=(m===6&&d>=21)||(m>6&&m<9)||(m===9&&d<22),fa=(m===9&&d>=22)||(m>9&&m<12)||(m===12&&d<21);
  const S={
    Spring:{name:'Spring',energy:'Emergence and new growth. Plant, begin, reach outward.',el:'Air/Earth',tier:'open',emoji:'🌱',best:'Launching, beginning collaborations, making yourself visible, planting intentions.',why:'Spring is the natural season of initiation. The earth\'s energy is literally rising — sap moving up, seeds germinating, days lengthening. Working with spring means working with momentum that already exists. Your intentions planted now have the entire growing season ahead of them.'},
    Summer:{name:'Summer',energy:'Peak vitality. Full expansion. Visibility and abundance.',el:'Fire',tier:'open',emoji:'☀️',best:'Peak effort, visibility, celebration, expansion — everything working gets amplified.',why:'Summer is maximum solar energy. The sun is at its height, days are longest, life force is most outward and visible. What you\'ve been building becomes most visible now. This is the season to show up fully, to harvest early wins, to be seen. The same project you started in spring now has maximum tailwind.'},
    Autumn:{name:'Autumn',energy:'Harvest and release. Take honest stock. Let fall what is ready.',el:'Earth/Air',tier:'tens',emoji:'🍂',nav:'Take stock honestly. Harvest what is genuinely ready. Release without forcing. This season supports completion, not new starts.',why:'Autumn is the season of honest reckoning. What actually grew? What didn\'t? The trees don\'t mourn their leaves — they strategically withdraw resources from what can\'t survive winter to protect what can. This is the season for the same kind of clarity.'},
    Winter:{name:'Winter',energy:'Rest and gestation. Inner work. Prepare the ground.',el:'Water/Earth',tier:'tens',emoji:'❄️',nav:'Rest without guilt. Study, reflect, tend inner work. What you plant in darkness now blooms in spring.',why:'Winter is not absence of growth — it\'s underground growth. Seeds are stratifying. The tree\'s energy is in its roots. This is when your deepest learning happens, when your next cycle\'s foundation is quietly laid. Cultures that honored winter understood that the fallow period makes the fertile period possible.'},
  };
  // Astronomical/calendar season name still reverses correctly by hemisphere —
  // but the descriptive content must also genuinely reflect what's happening
  // in that hemisphere, not just borrow the Northern Hemisphere's words under a new label.
  if(N){if(sp)return S.Spring;if(su)return S.Summer;if(fa)return S.Autumn;return S.Winter;}
  // Southern Hemisphere: when it's astronomically Spring there (Sep–Dec), the lived experience
  // genuinely matches Spring's content — growth, lengthening days, emergence — it's just
  // happening during the Northern Hemisphere's autumn calendar months. So return the season
  // whose CONTENT matches what's actually happening at this latitude, not a relabeled opposite.
  if(sp)return{...S.Autumn,name:'Autumn'}; // Northern "spring" calendar window = Southern Autumn
  if(su)return{...S.Winter,name:'Winter'};
  if(fa)return{...S.Spring,name:'Spring'};
  return{...S.Summer,name:'Summer'};
}

// ─── NUMEROLOGY ───────────────────────────────────────────────────────────────
const PMM={
  1:{theme:'New Beginning',tier:'open',desc:'A fresh chapter opens within your larger Personal Year. Initiate something this month — even small starts carry real momentum right now.',why:'Personal Month follows the same 1-9 numerology as Personal Year, but compressed to a single month instead of nine years. Month 1 carries initiating energy at month-scale — not the full force of a Year 1, but enough to make this the right window to start something specific within whatever your year is already asking of you.'},
  2:{theme:'Patience & Partnership',tier:'tens',desc:'Progress this month happens quietly, often through other people. Collaboration outperforms solo effort right now.',why:'Month 2 brings receptive, connective energy for a few weeks rather than a few years. This is a good month to listen more than you push, and to let partnerships — work or personal — carry some of the weight you\'d otherwise carry alone.'},
  3:{theme:'Expression',tier:'open',desc:'A good month to be visible. Share what you\'ve been working on — communication and creative output land well right now.',why:'Month 3 opens a window for expression and social momentum. Whatever you\'ve been quietly building, this is a reasonable month to put it in front of people. The visibility tends to open doors rather than invite criticism.'},
  4:{theme:'Foundation',tier:'tens',desc:'Practical, unglamorous effort this month pays off later. Not a month for inspiration — a month for showing up and doing the work.',why:'Month 4 is a structure-building window within your year — organize, plan, and handle the administrative or foundational tasks you\'ve been putting off. The payoff isn\'t immediate, but skipping this month\'s groundwork tends to cost you later in the cycle.'},
  5:{theme:'Change & Movement',tier:'open',desc:'Expect this month to feel less predictable than most. Plans may shift — treat that as the month working as intended, not as something going wrong.',why:'Month 5 sits at the numerological midpoint and tends to bring genuine, sometimes welcome disruption to whatever routine the previous months established. Flexibility is rewarded; rigid plans tend to meet resistance specifically this month.'},
  6:{theme:'Responsibility & Care',tier:'tens',desc:'Relationships and home life ask for real attention this month. What you give generously now tends to return multiplied later in the cycle.',why:'Month 6 turns focus toward people and responsibility rather than personal ambition. It\'s a relational month — the kind of effort that doesn\'t always show up as visible progress but matters more than it appears to in the moment.'},
  7:{theme:'Reflection',tier:'tens',desc:'A naturally quieter month. Study, rest, and inward attention serve you better than forcing outward momentum right now.',why:'Month 7 is the most introspective stretch within most Personal Years — even active, outward years tend to have a noticeably quieter month 7. Trust the slower pace; it\'s not stagnation, it\'s the month doing its actual job.'},
  8:{theme:'Material Focus',tier:'open',desc:'Financial and material matters come into focus this month. Good window to ask for what you\'re worth or make a tangible move you\'ve been preparing for.',why:'Month 8 carries authority and material-world energy at month-scale — a useful window for negotiations, asks, or decisions involving money and resources, separate from whatever your broader Personal Year theme is doing.'},
  9:{theme:'Completion',tier:'tens',desc:'Something wraps up this month. Let it close rather than forcing it to continue past its natural end — Month 1 of the next cycle follows shortly.',why:'Month 9 closes the 1-9 sequence at month-scale, the same way Personal Year 9 closes the larger cycle. Things that have run their course tend to resolve on their own this month if you stop holding onto them.'},
  11:{theme:'Illumination',tier:'open',desc:'A higher-intensity 2 month. Intuition runs unusually strong — pay attention to what arrives through dreams, hunches, or sudden clarity.',why:'11 is a master number even at month-scale — it doesn\'t reduce to 2 because it carries a more intense, more psychically open version of that same connective energy, just for a few weeks instead of a few years.'},
  22:{theme:'Master Building',tier:'open',desc:'A higher-intensity 4 month. What you build this month has unusual potential to matter beyond just you — take any large ideas that arrive seriously.',why:'22 at month-scale is rare and carries the master builder energy in compressed form — a short but real window where the scale of what feels possible is genuinely larger than an ordinary Month 4.'},
};
const PYM={
  1:{theme:'New Beginning',tier:'open',desc:'This is your initiation year. What you plant now shapes the entire next 9-year cycle. The energy is fresh and directional — decisions made this year have unusual staying power.',why:'Numerology works in 9-year cycles. Year 1 is the seed point of the entire sequence. The number 1 carries initiation, independence, and directional force. Anything you start in a Year 1 has the energy of the whole cycle behind it. This is why this year feels like it matters — because it does.'},
  2:{theme:'Patience & Partnership',tier:'tens',desc:'This year things develop below the surface. Collaboration, patience, and subtle perception are your tools. What you cannot yet see is still growing.',why:'Year 2 follows the initiating force of Year 1 with receptive, connective energy. The number 2 governs partnership, intuition, and the space between two things. Progress this year is real but often invisible. Trust the process more than the evidence.'},
  3:{theme:'Expression',tier:'open',desc:'Create, communicate, connect. Joy is data this year — what lights you up is pointing you somewhere real. What you share opens doors.',why:'Year 3 is where the seed planted in Year 1 and tended in Year 2 breaks the surface and becomes visible. The number 3 governs creativity, communication, and social expansion. This year your output matters. Share it.'},
  4:{theme:'Foundation',tier:'tens',desc:'Build the structure. The work is practical and unglamorous. What you establish this year outlasts everything that comes after.',why:'Year 4 is the architect year of the cycle. The number 4 governs structure, discipline, and material reality. You cannot skip this year — the foundation you lay here determines how high everything else can go. The work feels slow because you are building something permanent.'},
  5:{theme:'Change & Freedom',tier:'open',desc:'Expect the unexpected. This year rewards flexibility and punishes rigidity. Change is not happening to you — it is you, moving.',why:'Year 5 is the pivot point of the 9-year cycle. The number 5 sits at the center and governs freedom, change, and the unexpected. After four years of building structure, the structure gets tested and often transformed. This is not instability — it is necessary movement.'},
  6:{theme:'Responsibility',tier:'tens',desc:'Relationships, home, and community ask for your genuine attention. This year\'s meaning is relational, not individual.',why:'Year 6 follows the disruption of Year 5 with a call to tend what matters most — people, home, and responsibility. The number 6 governs service, love, and community. What you give this year returns multiplied in future years.'},
  7:{theme:'Depth & Solitude',tier:'tens',desc:'Study, reflect, withdraw from noise. What you discover about yourself this year cannot be learned any other way.',why:'Year 7 is the inner year — when external progress slows so internal development can accelerate. The number 7 governs wisdom, mystery, and the inner life. This year is not stagnation. It is the deepest work of the cycle, even when it feels quiet.'},
  8:{theme:'Abundance & Power',tier:'open',desc:'Material and financial matters take center stage. Claim what you have built across this cycle. Power wielded with integrity transforms.',why:'Year 8 is the harvest year — when the work of years 1 through 7 produces material results. The number 8 governs abundance, authority, and the material world. This is the year to ask for what you\'re worth, make the move you\'ve been preparing for, and step into the authority you\'ve earned.'},
  9:{theme:'Completion',tier:'tens',desc:'Release what no longer belongs in your next chapter. Trust the clearing. Year 1 follows this.',why:'Year 9 is the completion year — the exhale before the next inhale. The number 9 governs wisdom, endings, and universal service. What releases this year creates space for the entirely new cycle that begins in Year 1. Holding on this year costs more than letting go.'},
  11:{theme:'Illumination',tier:'open',desc:'A higher-vibration 2 year. You are receiving transmissions. Pay close attention to what you sense, dream, and notice.',why:'11 is a master number — it doesn\'t reduce to 2 because it carries a higher octave of that energy. Where Year 2 is about patience and partnership, Year 11 is about intuitive transmission and spiritual illumination. You are more psychically open this year than usual. Trust what arrives.'},
  22:{theme:'Master Building',tier:'open',desc:'You are capable of building something that truly matters — not just for you, but for others. This year can be a legacy year.',why:'22 is the master builder number — the highest practical expression in numerology. Where Year 4 builds personal structure, Year 22 builds structures that serve many people and outlast the builder. The scale of what\'s possible this year is larger than usual. Take it seriously.'},
};
const PDM={
  1:{theme:'Initiation',tier:'open',desc:'Strong for new starts, first moves, and decisive action.',why:'Personal Day 1 carries the same initiating energy as Personal Year 1 — but compressed into a single day. Your forward movement today has unusual momentum. First steps taken today tend to stick.'},
  2:{theme:'Patience',tier:'tens',desc:'Cooperate, listen, wait. Pushing costs more than it earns today.',why:'Day 2 energy is receptive and connective. The work today is in listening and sensing, not driving. Things pushed forcefully on a 2 day tend to create friction that wasn\'t necessary.'},
  3:{theme:'Expression',tier:'open',desc:'Communicate, create, connect. A good day to be seen and heard.',why:'Day 3 opens the channel for communication and creative expression. Conversations started today tend to have unusual warmth. Creative work flows more easily. Show up and share.'},
  4:{theme:'Work',tier:'tens',desc:'Build, organize, plan. Productivity over inspiration today.',why:'Day 4 is practical and grounded. The energy supports effort, organization, and building rather than inspiration or expansion. Do the unglamorous work — it compounds.'},
  5:{theme:'Change',tier:'open',desc:'Expect the unexpected. Lean into movement and flexibility.',why:'Day 5 energy is dynamic and unpredictable. Plans may shift. Opportunities appear sideways. The person who stays flexible today moves farther than the person with a rigid agenda.'},
  6:{theme:'Harmony',tier:'tens',desc:'Tend relationships and home. Service over personal ambition today.',why:'Day 6 draws your attention to the people and spaces that matter. This is a giving day — what you offer generously today creates conditions for what you need tomorrow.'},
  7:{theme:'Reflection',tier:'tens',desc:'Go inward. Study, rest, observe. Not a day to push outward.',why:'Day 7 is the inner day of the week-within-the-week. Your intuition runs clearer when you\'re quiet. Insights arrived at through reflection on a 7 day tend to be unusually accurate.'},
  8:{theme:'Abundance',tier:'open',desc:'Financial and material focus. Good day to ask for what you\'re worth.',why:'Day 8 puts material reality in focus. Conversations about money, value, and resources tend to land better today. Ask for what you want with the direct confidence this day supports.'},
  9:{theme:'Release',tier:'tens',desc:'Let go. Conclude. Clear. Something completes today.',why:'Day 9 carries completion energy — the end of a mini-cycle. What\'s been dragging gets resolved. What\'s been postponed gets decided. Let the day complete itself rather than forcing new beginnings.'},
  11:{theme:'Illumination',tier:'open',desc:'Heightened intuition. Pay close attention to what arrives.',why:'Day 11 is a master day — the intuitive channel is unusually open. Dreams, synchronicities, and sudden insights today are worth recording. Something may arrive that changes how you see a situation.'},
  22:{theme:'Vision',tier:'open',desc:'Big-picture clarity. Your sense of what truly matters is unusually sharp.',why:'Day 22 is a master day for vision and large-scale thinking. Ideas that arrive today about what you want to build over the long term carry unusual signal. Take them seriously and write them down.'},
};
const WK=[
  {name:'Sunday',planet:'Sun',tier:'open',desc:'Solar day. Best for confidence, visibility, and anything that benefits from being seen.',why:'Sunday is named for the Sun across almost every language and culture. The day carries the Sun\'s energy — outward, confident, generative. Activities aligned with being visible and recognized have the day\'s energy behind them.'},
  {name:'Monday',planet:'Moon',tier:'tens',desc:'Lunar day. Good for inner work, emotional intelligence, and intuition — not aggressive outreach.',why:'Monday comes from "Moon\'s day." The lunar energy of Monday makes it ideal for emotional and intuitive work rather than forceful outward action. Notice what you feel on Mondays before deciding — your emotional intelligence is heightened.'},
  {name:'Tuesday',planet:'Mars',tier:'tens',desc:'Mars day. Action, courage, cutting. Use it decisively or not at all.',why:'Tuesday comes from Tiw, the Norse god of war — equivalent to Mars. The day carries martial energy: direct, forceful, willing to cut. Use it to make hard decisions, protect what matters, or push through something you\'ve been avoiding. Avoid delicate negotiations.'},
  {name:'Wednesday',planet:'Mercury',tier:'open',desc:'Mercury day. Communication, wit, quick thinking. Best for anything involving words and agreements.',why:'Wednesday comes from Woden\'s day — Mercury\'s equivalent. The day sharpens the mind and tongue. Contracts signed Wednesday tend to hold. Conversations had Wednesday tend to be clear. Study what you want to actually retain.'},
  {name:'Thursday',planet:'Jupiter',tier:'open',desc:'Jupiter day. Expansion, abundance, wisdom. Best for growth-oriented work and big asks.',why:'Thursday comes from Thor\'s day — Jupiter\'s equivalent. The energy is expansive, optimistic, and fortunate. Make the ask you\'ve been building toward. Start the project you want to grow. Jupiter hours on a Jupiter day compound.'},
  {name:'Friday',planet:'Venus',tier:'open',desc:'Venus day. Love, beauty, pleasure. Best for relationships, creative work, and self-care.',why:'Friday comes from Freya\'s day — Venus\'s equivalent. The energy is magnetic, pleasure-oriented, and relational. Put effort into things that require beauty and connection today. Self-care done on Friday tends to restore more deeply.'},
  {name:'Saturday',planet:'Saturn',tier:'avoid',desc:'Saturn day. Discipline, endings, contraction. Best for banishing and releasing — close the door on new starts.',why:'Saturday is literally Saturn\'s day. The planet of time, limitation, and structure governs the whole day. This is not unlucky — it\'s specific. Use Saturday for what Saturn does best: ending what needs to end, releasing what needs to go, disciplined work on something long-term. Starting something new on Saturday tends to meet unusual resistance.'},
];

// ─── SIGN DATA ─────────────────────────────────────────────────────────────────
const SD={
  Aries:{el:'Fire',ruler:'Mars',desc:'Bold initiator. You open doors others have not seen yet.',shadow:'Impatience and leaving cycles unfinished.',stones:['Red Jasper','Carnelian'],herbs:['Ginger','Nettle'],why:'Aries is the first sign — the cosmic pioneer. Ruled by Mars, the energy is initiating, direct, and willing to go first even without a map. The gift is courage and momentum. The shadow is that the same energy that launches well sometimes doesn\'t land.'},
  Taurus:{el:'Earth',ruler:'Venus',desc:'Deep builder. You make lasting things from patient effort.',shadow:'Resistance to necessary change.',stones:['Rose Quartz','Malachite'],herbs:['Rose','Thyme'],why:'Taurus is the sign of material mastery — ruled by Venus and rooted in Earth. The gift is the ability to build real, lasting things through patient sustained effort. The shadow is that the same steadiness that creates permanence can resist change that is genuinely needed.'},
  Gemini:{el:'Air',ruler:'Mercury',desc:'Swift connector. You see the thread between things others miss.',shadow:'Scattered attention and surface-level engagement.',stones:['Citrine','Agate'],herbs:['Lavender','Mint'],why:'Gemini is ruled by Mercury and governs the movement of information, ideas, and connection. The gift is the ability to hold multiple perspectives simultaneously and find the unexpected connection. The shadow is that the same agile mind that connects everything can have trouble committing to one thread long enough to go deep.'},
  Cancer:{el:'Water',ruler:'Moon',desc:'Deep nurturer. Your sensitivity is your superpower, not your weakness.',shadow:'Withdrawal and holding onto the past beyond its usefulness.',stones:['Moonstone','Selenite'],herbs:['Chamomile','Jasmine'],why:'Cancer is ruled by the Moon and governs the emotional body, home, and memory. The gift is an emotional intelligence so deep it borders on psychic — you feel what\'s real before you can name it. The shadow is that the same depth that makes you perceptive can become a retreat from present reality.'},
  Leo:{el:'Fire',ruler:'Sun',desc:'Radiant center. You are here to be fully seen and to make others feel seen.',shadow:'Pride that closes the heart and blocks genuine connection.',stones:['Sunstone','Amber'],herbs:['Frankincense','Calendula'],why:'Leo is ruled by the Sun and governs creative self-expression, courage, and the generous heart. The gift is the ability to bring warmth and vitality into any room — to make people feel genuinely seen and celebrated. The shadow is that the need to be central can occasionally obscure the genuine generosity underneath.'},
  Virgo:{el:'Earth',ruler:'Mercury',desc:'Precise discerner. You see what is actually there, not what should be there.',shadow:'Perfectionism that prevents action and self-criticism that goes too far.',stones:['Amazonite','Peridot'],herbs:['Lavender','Rosemary'],why:'Virgo is ruled by Mercury and governs analysis, refinement, and service. The gift is a precision of perception that catches what everyone else misses — you see the actual pattern beneath the surface. The shadow is that the same exacting standard applied to yourself can become immobilizing. The criticism you would never apply to someone you love, you apply without hesitation to yourself.'},
  Libra:{el:'Air',ruler:'Venus',desc:'Elegant balancer. You see all sides and hold space for genuine complexity.',shadow:'Indecision and losing yourself in the mirror of others.',stones:['Rose Quartz','Opal'],herbs:['Rose','Spearmint'],why:'Libra is ruled by Venus and governs justice, beauty, relationship, and balance. The gift is the ability to genuinely hold multiple truths simultaneously — to see the valid part of every perspective. The shadow is that this same capacity for balance can make decisive action feel like a violation of fairness.'},
  Scorpio:{el:'Water',ruler:'Pluto',desc:'Deep transformer. You go where others will not and come back with what matters.',shadow:'Control, slow-burning resentment, and withholding as protection.',stones:['Obsidian','Garnet'],herbs:['Wormwood','Myrrh'],why:'Scorpio is ruled by Pluto and governs transformation, depth, and the hidden truth beneath the surface. The gift is a willingness to face what is real even when it is uncomfortable — and the capacity to transform through that facing. The shadow is that the same intensity that creates depth can become controlling when vulnerability feels too dangerous.'},
  Sagittarius:{el:'Fire',ruler:'Jupiter',desc:'Expansive seeker. You carry the horizon with you wherever you go.',shadow:'Over-commitment and avoiding the details that make big visions land.',stones:['Turquoise','Lapis'],herbs:['Sage','Clove'],why:'Sagittarius is ruled by Jupiter and governs philosophy, expansion, and the search for meaning. The gift is an innate sense that life is larger than any single experience of it — and the courage to keep reaching. The shadow is that the same vision that sees the horizon clearly can miss the ground directly underfoot.'},
  Capricorn:{el:'Earth',ruler:'Saturn',desc:'Master builder. You know exactly what it actually takes and you are willing to do it.',shadow:'Coldness and measuring personal worth by achievement alone.',stones:['Garnet','Onyx'],herbs:['Comfrey','Horsetail'],why:'Capricorn is ruled by Saturn and governs mastery, structure, and the long game. The gift is the rare ability to delay gratification long enough to build something that actually lasts. The shadow is that the same discipline that creates mastery can become a cage when worth is only measured by output.'},
  Aquarius:{el:'Air',ruler:'Uranus',desc:'Future bearer. You see what is possible before it exists.',shadow:'Emotional detachment used as self-protection rather than self-awareness.',stones:['Amethyst','Labradorite'],herbs:['Myrrh','Peppermint'],why:'Aquarius is ruled by Uranus and governs innovation, collective intelligence, and the future. The gift is genuine originality — the ability to see a version of reality that hasn\'t happened yet and care about it enough to work toward it. The shadow is that the same visionary quality can create distance from the immediate emotional reality of people nearby.'},
  Pisces:{el:'Water',ruler:'Neptune',desc:'Boundless feeler. You dissolve the separation between things and sense what connects everything.',shadow:'Escapism and absorbing others\' energy without realizing it.',stones:['Aquamarine','Blue Lace Agate'],herbs:['Jasmine','Mugwort'],why:'Pisces is ruled by Neptune and governs transcendence, compassion, and the dissolution of boundaries. The gift is an empathy so complete it borders on merger — you feel what others feel and this makes you unusually healing to be around. The shadow is that the same permeability that makes you sensitive can make it hard to know where you end and others begin.'},
};

// ─── CHAKRAS ──────────────────────────────────────────────────────────────────
const CK=[
  {name:'Root',col:'#C05050',el:'Earth',desc:'Security, survival, and belonging. Your foundation.',stones:['Red Jasper','Hematite'],herbs:['Vetiver','Ginger'],why:'The Root chakra is your relationship with physical safety and belonging. When it\'s flowing, you feel at home in your body and in your life. When it\'s blocked, everything else feels unstable even if nothing is technically wrong. Ground before you reach.'},
  {name:'Sacral',col:'#D07830',el:'Water',desc:'Creativity, pleasure, emotion, and flow.',stones:['Carnelian','Sunstone'],herbs:['Orange Peel','Calendula'],why:'The Sacral chakra governs your creative and emotional life. This is where desire lives — not just romantic desire, but the desire to make things, to feel things, to be fully alive. When it\'s flowing, ideas come easily and life feels pleasurable. When it\'s blocked, creativity dries up and emotion either floods or disappears.'},
  {name:'Solar Plexus',col:'#C8A820',el:'Fire',desc:'Personal power, will, and confidence.',stones:['Citrine','Tiger\'s Eye'],herbs:['Chamomile','Turmeric'],why:'The Solar Plexus is your sense of personal authority — the feeling that you have the right to take up space and make choices. When it\'s flowing, you act from confidence rather than fear. When it\'s blocked, you either give your power away easily or overcompensate with control.'},
  {name:'Heart',col:'#50A860',el:'Air',desc:'Love, compassion, and connection. The bridge between the personal and the universal.',stones:['Rose Quartz','Malachite'],herbs:['Rose','Hawthorn'],why:'The Heart chakra is the midpoint of the seven — it bridges the lower chakras (survival, desire, power) with the upper ones (expression, vision, consciousness). When it\'s flowing, love moves freely both inward and outward. When it\'s blocked, you may give easily but struggle to receive, or vice versa.'},
  {name:'Throat',col:'#4888C8',el:'Ether',desc:'Authentic voice, communication, and expression.',stones:['Blue Lace Agate','Aquamarine'],herbs:['Peppermint','Sage'],why:'The Throat chakra governs your ability to speak what is actually true for you. Not what you think others want to hear — what is real. When it\'s flowing, communication feels natural and honest. When it\'s blocked, you may find yourself saying yes when you mean no, or feeling unable to name what you actually need.'},
  {name:'Third Eye',col:'#6860B8',el:'Light',desc:'Intuition, vision, and inner knowing.',stones:['Amethyst','Labradorite'],herbs:['Mugwort','Lavender'],why:'The Third Eye governs perception beyond the five senses — pattern recognition, intuition, and the ability to see what\'s actually happening rather than just what\'s visible. When it\'s flowing, you trust your perception. When it\'s blocked, you second-guess what you clearly sense.'},
  {name:'Crown',col:'#9870C0',el:'Thought',desc:'Connection to source, higher consciousness, and your place in the larger whole.',stones:['Clear Quartz','Selenite'],herbs:['Frankincense','Lotus'],why:'The Crown chakra is your felt sense of connection to something larger than yourself — whatever you call it. When it\'s flowing, life feels meaningful even when it\'s hard. When it\'s blocked, you may feel cut off, isolated, or like you\'re simply going through the motions without knowing why.'},
];
// ─── SOLFEGGIO FREQUENCIES ──────────────────────────────────────────────────────
// The traditional nine-tone solfeggio scale. The first six (396–852 Hz) are the
// historically-attested core scale rediscovered by Dr. Joseph Puleo; 963 Hz is the
// commonly-added "crown" tone completing the set to nine. Each is correlated here
// to the chakra it's most associated with in modern sound-healing practice, so it
// chains naturally off the chart-derived chakra logic already built.
const SOLFEGGIO=[
  {hz:396,name:'Liberation',chakra:'Root',desc:'Releasing guilt and fear. Turning grief into something you can finally put down.',why:'396 Hz is associated with the Latin syllable "Ut queant laxis" — "so that these relax" — from the original Solfeggio hymn to St. John the Baptist. In modern sound practice it\'s linked to the Root chakra because both share the same work: clearing the foundational fear and guilt that keep you from feeling safe enough to grow.'},
  {hz:417,name:'Change',chakra:'Sacral',desc:'Undoing stuck patterns and facilitating change. Clearing the way for new creative cycles.',why:'417 Hz corresponds to "Resonare fibris" — "to resonate the fibers." It\'s traditionally associated with the Sacral chakra because both govern transition — the Sacral is the seat of creative and emotional flow, and 417 Hz is the tone most linked to breaking patterns that have calcified past their usefulness.'},
  {hz:528,name:'Transformation',chakra:'Solar Plexus',desc:'Often called the "miracle tone" — associated with transformation, DNA repair claims, and personal will.',why:'528 Hz corresponds to "Mira gestorum" — "miracle." It\'s the most popularly known solfeggio frequency, linked in modern sound healing to the Solar Plexus because both concern personal power and the will to transform — taking raw potential and actually becoming something with it.'},
  {hz:639,name:'Connection',chakra:'Heart',desc:'Harmonizing relationships, communication between people, and the heart\'s capacity for connection.',why:'639 Hz corresponds to "Famuli tuorum" — "family/servants." It\'s associated with the Heart chakra because both govern relationship — the bridge between self and other, the tone most linked in sound practice to repairing and deepening genuine connection.'},
  {hz:741,name:'Expression',chakra:'Throat',desc:'Awakening intuition and clearing the way for honest self-expression.',why:'741 Hz corresponds to "Solve polluti" — "solve pollution." It\'s linked to the Throat chakra because both concern clearing what blocks authentic voice — removing static so what you actually mean can be heard, by others and by yourself.'},
  {hz:852,name:'Awakening',chakra:'Third Eye',desc:'Returning to spiritual order, raising awareness, and quieting an overactive mind.',why:'852 Hz corresponds to "Labii reatum" — "guilt of the lips." It\'s associated with the Third Eye because both concern clarity of perception — quieting mental noise enough to actually see what\'s true rather than what fear or habit assumes.'},
  {hz:963,name:'Unity',chakra:'Crown',desc:'Connection to oneness and higher consciousness. Often used to close a frequency practice.',why:'963 Hz is the most commonly added ninth tone, sometimes called the "frequency of the gods." It\'s associated with the Crown chakra because both concern the felt sense of connection to something larger than the individual self — the natural top note when working through the full scale in order.'},
];
function getActiveFrequency(chakraName){return SOLFEGGIO.find(f=>f.chakra===chakraName)||SOLFEGGIO[2];}
// Each chakra maps to an element family. We pick today's active chakra by genuinely
// correlating the chart, not rotating through a fixed sequence:
// - Your Sun's element sets your baseline chakra home base.
// - The Moon's current transiting sign shifts which chakra is *activated* today —
//   the same logic the rest of the alignment engine already uses for moon/sun harmony.
// - When sun-element and moon-element agree, we land on your baseline chakra (reinforced).
// - When they differ, the day pulls you toward the chakra of whichever element is moving —
//   that's the one asking for attention right now.
const EL_TO_CHAKRA={
  Earth:['Root'],          // grounding, survival, material — Earth
  Water:['Sacral','Heart'],// emotion/flow (Sacral) and connection (also Water-adjacent via Heart bridge)
  Fire:['Solar Plexus'],   // will, confidence, personal power — Fire
  Air:['Throat','Crown'],  // communication and higher mind — Air
};
function dCK(chart,date){
  const sunEl=SD[chart.sun]?.el;
  const moonSgn=mSign(date);
  const moonEl=SD[moonSgn]?.el;
  // Candidates from your Sun element (your baseline) and today's Moon element (what's active)
  const sunCandidates=EL_TO_CHAKRA[sunEl]||['Heart'];
  const moonCandidates=EL_TO_CHAKRA[moonEl]||['Heart'];
  // If sun and moon elements share a candidate chakra, that's reinforced — use it.
  const shared=sunCandidates.find(c=>moonCandidates.includes(c));
  const pickName=shared||moonCandidates[0]||sunCandidates[0];
  const chakra=CK.find(c=>c.name===pickName)||CK[0];
  // Attach the reasoning so the UI can explain WHY this chakra, specifically, today.
  const reinforced=!!shared;
  return{
    ...chakra,
    reason:reinforced
      ?`Your ${chart.sun} Sun (${sunEl}) and today's Moon in ${moonSgn} (${moonEl}) are both pointing to the same center — this one is reinforced today, not just active.`
      :`Today's Moon in ${moonSgn} (${moonEl}) is activating a different center than your ${chart.sun} Sun (${sunEl}) usually runs through. This is the chakra asking for attention right now — not necessarily your default.`,
  };
}

// ─── LIFE AREAS ─────────────────────────────────────────────────────────────
// Career/Love/Family/Health percentages — each grounded in real signals already
// computed by buildAlign (day ruler, moon phase, retrogrades, personal day), not
// a random number. Every note names the specific signal driving it.
const LIFE_AREA_RULERS={career:['Saturn','Sun','Jupiter','Mercury'],love:['Venus','Moon'],family:['Moon','Venus'],health:['Sun','Mars','Moon']};
const LIFE_AREA_WHY={
  career:`Career draws on Saturn (structure and long-term discipline), the Sun (visibility and confidence), Jupiter (growth and opportunity), and Mercury (communication and deals). When today's ruling planet — the day ruler, active retrogrades, or your Personal Day — touches one of these four, your career score moves. Personal Day 8 always gives it a boost, since 8 is numerology's own material-and-authority day.`,
  love:`Love draws on Venus (attraction, affection, what you find beautiful) and the Moon (emotional openness and how safe closeness feels today). A supportive Moon phase or a Venus-ruled day tends to lift this score; Venus retrograde pulls it down, since that's a window for reassessing what you already value rather than starting something new. Personal Day 6 — the relationship day — gives it a direct boost.`,
  family:`Family draws on the Moon (home, nurturing, emotional roots) and Venus (harmony and affection). A supportive Moon phase lifts this score directly, since the Moon is the primary ruler of home and family in this system. Personal Days 2 and 6 — partnership and responsibility — both favor it.`,
  health:`Health draws on the Sun (vitality and life force), Mars (physical energy and drive), and the Moon (rest, body-awareness, and cycles). A day ruled by any of these three shifts the score; retrogrades touching them are read as a signal to slow down rather than push output. Personal Day 4 — the grounding, body-focused day — gives it a boost.`,
};
function deriveLifeAreas(chart,aln){
  const dayRuler=aln.wd.planet;
  const moonTier=aln.moon.tier;
  const retroPlanets=aln.retro.map(r=>r.planet);
  const domains={};
  const NOTES={
    career:{
      dayOpen:`${dayRuler} day gives momentum for structure, not for launching anything new.`,
      dayAvoid:`${dayRuler} day pulls focus away from career matters — better for other things today.`,
      retro:(p,end)=>`${p} retrograde until ${end} — review existing work rather than starting anything career-facing.`,
      moonOpen:`${aln.moon.name} supports steady, visible progress on what's already moving.`,
      base:`A workable day for career — nothing strongly pulling for or against it.`,
    },
    love:{
      dayOpen:`${dayRuler} day favors depth over small talk — say the real thing, not the easy thing.`,
      dayAvoid:`${dayRuler} day isn't naturally suited to love or connection — keep it low-key.`,
      retro:(p,end)=>`${p} retrograde until ${end} — revisit what you already value rather than starting something new.`,
      moonOpen:`${aln.moon.name} opens the door for closeness and honest conversation.`,
      base:`A steady day for love — no strong pull either way.`,
    },
    family:{
      dayOpen:`${dayRuler} day favors showing up through action, not through words — that's the love language today.`,
      dayAvoid:`${dayRuler} day leans outward, not toward home — family matters may need to wait.`,
      retro:(p,end)=>`${p} retrograde until ${end} — old family patterns may resurface for review, not resolution.`,
      moonOpen:`${aln.moon.name} supports nurturing and home-centered energy.`,
      base:`A steady day for family — nothing strongly activated.`,
    },
    health:{
      dayOpen:`${dayRuler} day favors refining an existing habit rather than starting a new one.`,
      dayAvoid:`${dayRuler} day pulls energy elsewhere — be extra deliberate about rest and body today.`,
      retro:(p,end)=>`${p} retrograde until ${end} — a good window to slow down rather than push output.`,
      moonOpen:`${aln.moon.name} supports listening to what your body is actually asking for.`,
      base:`A steady day for health — no strong signal either way.`,
    },
  };
  Object.entries(LIFE_AREA_RULERS).forEach(([domain,rulers])=>{
    let score=50;const reasons=[];
    if(rulers.includes(dayRuler)){
      if(aln.wd.tier==='open'){score+=15;reasons.push(NOTES[domain].dayOpen);}
      else if(aln.wd.tier==='avoid'){score-=15;reasons.push(NOTES[domain].dayAvoid);}
      else{score+=5;}
    }
    if(moonTier==='open'&&(domain==='love'||domain==='family')){score+=10;reasons.push(NOTES[domain].moonOpen);}
    const hitRetroPlanet=retroPlanets.find(p=>rulers.includes(p));
    const hitRetro=hitRetroPlanet?aln.retro.find(r=>r.planet===hitRetroPlanet):null;
    if(hitRetro){score-=12;reasons.push(NOTES[domain].retro(hitRetro.planet,hitRetro.endLabel));}
    if(domain==='career'&&aln.pd===8){score+=10;reasons.push(`Personal Day 8 activates career and material matters directly.`);}
    if(domain==='family'&&(aln.pd===6||aln.pd===2)){score+=10;reasons.push(`Personal Day ${aln.pd} leans toward home and connection.`);}
    if(domain==='love'&&aln.pd===6){score+=8;reasons.push(`Personal Day 6 favors love and relationship focus.`);}
    if(domain==='health'&&aln.pd===4){score+=8;reasons.push(`Personal Day 4 favors grounding and body-focused work.`);}
    score=Math.max(30,Math.min(90,score));
    domains[domain]={score,note:reasons[0]||NOTES[domain].base,allReasons:reasons};
  });
  const overall=Math.round((domains.career.score+domains.love.score+domains.family.score+domains.health.score)/4);
  return{...domains,overall};
}

// ─── HD ───────────────────────────────────────────────────────────────────────
const HDT={
  Generator:{strategy:'Respond',not_self:'Frustration',sig:'Satisfaction',desc:'You are built to respond to what genuinely calls you. Your gut response is your most accurate guidance — it knows before your mind catches up.',why:'Generators make up about 70% of the population and are the primary life force of the planet. The Generator aura is open and enveloping — it pulls things and people in. This is why waiting to respond works: things come to you. When you initiate from the mind rather than responding from the gut, you often find yourself in work and relationships that drain you. The frustration you feel when you\'re doing the wrong thing is not a problem — it\'s a compass.'},
  ManifestingGenerator:{strategy:'Respond then Inform',not_self:'Frustration & Anger',sig:'Satisfaction & Peace',desc:'Multi-passionate and fast. You respond first, then inform before acting. You are not built for one linear path and you never will be.',why:'Manifesting Generators have the Generator\'s sacral response combined with the Manifestor\'s capacity for initiation. The result is someone who can move quickly through multiple tracks simultaneously. The trap is skipping steps — moving so fast that you forget to inform the people your decisions affect. That creates the resistance that triggers the anger. Slow down just enough to say what you\'re doing before you do it.'},
  Projector:{strategy:'Wait for the Invitation',not_self:'Bitterness',sig:'Success',desc:'You are a guide — designed to see into people and systems with a clarity others cannot access. Your wisdom lands only when it\'s been invited.',why:'Projectors have a focused, penetrating aura that can see to the core of things and people. This is a profound gift and also the source of the main challenge: your wisdom, offered without invitation, tends to be rejected or ignored — not because it\'s wrong, but because the aura wasn\'t open to receive it. Waiting for the invitation isn\'t passive. It\'s strategic. Recognition comes before the invitation, and recognition comes from being genuinely yourself.'},
  Manifestor:{strategy:'Inform',not_self:'Anger',sig:'Peace',desc:'You are one of the few types built to initiate without waiting. Inform before you act — not to ask permission, but to remove the friction your closed aura creates.',why:'Manifestors have a closed, repelling aura — which means others instinctively feel they cannot read you and become wary. Informing is not about asking permission. It\'s about removing the resistance that your aura naturally generates before you\'ve said anything. When people know what you\'re doing, the resistance drops. When they don\'t, it accumulates into opposition that slows you down.'},
  Reflector:{strategy:'Wait a Lunar Cycle',not_self:'Disappointment',sig:'Surprise',desc:'You are the rarest type — a mirror of the community and environment around you. Major decisions need a full lunar cycle to process. The right environment is everything.',why:'Reflectors have completely open charts — they sample and reflect the energy of everyone around them. This makes them the community\'s barometer: when a Reflector is thriving, the community is healthy. The 28-day decision cycle isn\'t arbitrary — it takes a full lunar cycle to move through all the gate activations and get a complete read on a major decision. Rushing this always costs Reflectors more than the wait.'},
};

// ─── HUMAN DESIGN AUTHORITY ──────────────────────────────────────────────────
// Strategy tells you WHEN to initiate. Authority tells you HOW to know if a
// decision is actually right once it's in motion — arguably more practically
// useful day-to-day, and previously missing entirely from this app.
const HD_AUTHORITY={
  Emotional:{desc:'You are not built to decide in the moment — no matter how certain it feels right now. Your clarity arrives only after riding a full emotional wave, high and low. The decision that feels obvious today may look completely different in a few days, and that later view is the one to trust.',why:'Emotional authority means the Solar Plexus center is defined in your chart — the largest center, governing emotional waves that move through highs and lows over time. There is no "true now" for emotional authority; clarity is a process, not a moment. Sleeping on a big decision isn\'t indecisive for you — it\'s the actual mechanism.'},
  Sacral:{desc:'Your gut response in the moment — a felt yes or no in your body, not a thought — is your most reliable guide. It shows up instantly and it\'s rarely wrong. The danger is overriding it with reasoning after the fact.',why:'Sacral authority means your Sacral center is defined and your Solar Plexus (emotional) center is not — so there\'s no emotional wave to wait out. The response is immediate: an audible or felt "uh-huh" or "unh-uh" in the body, faster than conscious thought. Trusting it over-thinking it is the entire practice.'},
  Splenic:{desc:'Your instinct speaks once, quietly, in the present moment — and it does not repeat itself. If you miss it because you were busy rationalizing, it\'s gone. The skill is learning to catch a whisper instead of waiting for a shout.',why:'Splenic authority is the oldest, most primal awareness system in the body — instinctive, in-the-moment safety and rightness, evolved to keep you alive. Unlike emotional authority, it doesn\'t repeat or build. It speaks once and moves on, which is why splenic types often second-guess a true instinct simply because it didn\'t insist.'},
  Ego:{desc:'Your authority lives in willpower and what you genuinely have the heart and energy for — not what you think you should want. If you don\'t have real gut-level will behind something, it\'s not yours to commit to right now, regardless of how good it looks on paper.',why:'Ego (Heart) authority means the Heart/Will center is defined and drives decision-making — this center governs willpower, material ego, and the energy to make good on your word. Decisions made without real will behind them tend to quietly fail to materialize, not from sabotage but from genuine lack of fuel.'},
  'Self-Projected':{desc:'You find your own truth by talking it out loud to someone who will simply listen — not advise, not interrupt. The clarity isn\'t in their feedback; it\'s in hearing your own voice say it.',why:'Self-Projected authority comes from a defined G center (identity) with an open or undefined emotional and sacral system — your truth is self-referential, not externally verified. Talking through a decision with a trusted listener isn\'t seeking their opinion; it\'s how your own knowing becomes audible to you.'},
  Lunar:{desc:'As the rarest authority type, you genuinely need a full lunar cycle — about 28 days — to process major decisions, sampling how a choice feels across many different days and moods before it\'s actually clear.',why:'Lunar authority belongs specifically to Reflectors, whose entire chart is undefined — they have no fixed internal authority to draw from moment to moment, so the Moon\'s 28-day transit through all the chart\'s gates becomes the timekeeper for genuine clarity. This is not indecision; it is the correct mechanism for a completely open design.'},
};

function deriveHDAuthority(c,hdType){
  // Honest estimate, same family as Type: Moon sign element is the closest proxy
  // available from a birth chart for emotional/instinctive processing style.
  // A genuine Authority reading requires a calculated bodygraph (defined/open
  // centers from exact planetary positions), which this app does not compute.
  // Reflectors always carry Lunar authority in the real system — that mapping
  // is fixed, not estimated from Moon element like the other four types.
  if(hdType==='Reflector')return'Lunar';
  if(!c.moon)return null;
  const moonEl=SD[c.moon]?.el;
  const riseEl=c.rising?SD[c.rising]?.el:null;
  // Self-Projected authority corresponds to a defined G center (identity) with
  // open emotional/sacral — the closest proxy here is when Moon and Rising
  // share the same element (a stable, self-referential identity signature)
  // and that element is Air, since Self-Projected is fundamentally about
  // verbalizing your own truth — an Air-domain (communication) process.
  if(riseEl&&moonEl===riseEl&&moonEl==='Air')return'Self-Projected';
  if(moonEl==='Water')return'Emotional';
  if(moonEl==='Fire')return'Sacral';
  if(moonEl==='Air')return'Splenic';
  if(moonEl==='Earth')return'Ego';
  return'Sacral';
}

// ─── CHART COMPLETENESS ────────────────────────────────────────────────────────
// Single source of truth for what we actually know vs. estimated vs. missing.
// Everything downstream (AI prompts, Human Design, Tree of Life, UI labels)
// should check this instead of silently guessing or defaulting.
function chartCompleteness(c){
  const hasMoon=!!c.moon;
  const moonConfirmed=hasMoon&&c.moonCertain!==false; // certain unless explicitly flagged uncertain
  const hasRising=!!c.rising&&c.riseOk!==false;
  const riseConfirmed=hasRising&&!c.riseApprox; // false when birth place came from a device-timezone guess, not a real match
  return{
    hasMoon,
    moonConfirmed, // true = exact, false = best estimate from date alone
    hasRising,     // requires both birth time AND birth place to be genuinely known
    riseConfirmed, // true = real location match, false = approximated from device timezone
    isFullChart:moonConfirmed&&riseConfirmed,
    missingParts:[!hasMoon||!moonConfirmed?'exact Moon sign (needs birth time)':null,!hasRising?'Rising sign (needs birth time + city)':!riseConfirmed?'a confirmed birth city (Rising was approximated)':null].filter(Boolean),
  };
}
function deriveHD(c){if([c.moon,c.rising].filter(Boolean).every(s=>['Cancer','Scorpio'].includes(s))&&c.lifePath===7)return'Reflector';if(['Aries','Leo','Sagittarius','Capricorn'].includes(c.sun)&&[1,8].includes(c.lifePath)&&['Aries','Leo','Sagittarius','Capricorn'].includes(c.rising||''))return'Manifestor';if(['Virgo','Pisces','Gemini','Aquarius','Libra'].includes(c.sun)&&[2,6,7,11].includes(c.lifePath))return'Projector';if(['Gemini','Sagittarius','Aries'].includes(c.sun)&&[3,5,9,22].includes(c.lifePath))return'ManifestingGenerator';return'Generator';}

// ─── TREE OF LIFE ─────────────────────────────────────────────────────────────
const SEPH=[
  {n:1,name:'Kether',title:'The Crown',planet:'Divine',col:'#909090',desc:'Pure consciousness. The point before differentiation.',work:'Meditation, unity, connection to source.',why:'Kether is the first emanation — consciousness before it takes any form. It\'s called the Crown because it sits above all the other sephiroth and is the point where the infinite becomes the first traceable something. Working with Kether is not about doing — it\'s about being in the stillest possible awareness.'},
  {n:2,name:'Chokmah',title:'Wisdom',planet:'Zodiac',col:'#7090C0',desc:'Pure dynamic force. The first movement. Raw creative impulse.',work:'Visionary work, channeling, inspiration.',why:'Chokmah is the first real emanation — undifferentiated creative force before it takes shape. Think of it as the flash of inspiration before the idea has form. Working with Chokmah is about accessing the creative force that precedes structure.'},
  {n:3,name:'Binah',title:'Understanding',planet:'Saturn',col:'#5040A0',desc:'Form-giver. The womb that shapes raw force into pattern.',work:'Long-term manifestation, structure, protection.',why:'Binah is where Chokmah\'s raw force gets shaped into something that can exist. She is the understanding that gives form to wisdom. Saturn rules Binah because Saturn governs time and structure — the containers that make things real. Working with Binah is about creating sustainable form for what you want to manifest.'},
  {n:4,name:'Chesed',title:'Mercy',planet:'Jupiter',col:'#3870B8',desc:'Loving expansion. Abundance flowing freely.',work:'Abundance, healing, generosity, benevolence.',why:'Chesed is the first emanation below the abyss — the first place where the divine becomes truly personal. Jupiter rules here because Chesed governs abundance, mercy, and the expansive generosity that creates conditions for growth. Working with Chesed is about opening to receive and give freely.'},
  {n:5,name:'Geburah',title:'Strength',planet:'Mars',col:'#A03030',desc:'Severity and divine will in action. The cosmic surgeon.',work:'Banishing, protection, cord cutting, courage.',why:'Geburah is often misread as evil or harsh. It is neither. Geburah is the necessary force that removes what has exceeded its usefulness — the surgeon\'s cut, the pruning that enables growth. Mars rules here. Working with Geburah is about having the courage to remove what no longer serves, even when it was once beloved.'},
  {n:6,name:'Tiphareth',title:'Beauty',planet:'Sun',col:'#B09030',desc:'The heart of the Tree. Where all paths cross. The healing center.',work:'Healing, solar workings, integration, heart-centered manifestation.',why:'Tiphareth sits at the exact center of the Tree of Life — every other sephirah connects through it. The Sun rules here. This is why solar work and heart-centered healing are so foundational — they work at the crossroads where everything else converges. Working with Tiphareth is working at the center of your own system.'},
  {n:7,name:'Netzach',title:'Victory',planet:'Venus',col:'#509050',desc:'Desire, love, beauty, and nature. Where love actually lives.',work:'Love workings, beauty, art, emotional healing.',why:'Netzach governs the realm of feeling, nature, and the raw creative energy that drives desire. Venus rules here — not the refined Venus of Libra, but the primal force of attraction and beauty. Working with Netzach means working with what you genuinely want, not what you think you should want.'},
  {n:8,name:'Hod',title:'Splendor',planet:'Mercury',col:'#4878B8',desc:'Language, precision, and the magic of the word.',work:'Sigils, written workings, contracts, communication.',why:'Hod governs the intellect in service of the magical — language, symbols, and the precise use of words to shape reality. Mercury rules here. Sigil work and written intention-setting are Hod\'s domain because they use the mind\'s precision to give form to desire.'},
  {n:9,name:'Yesod',title:'Foundation',planet:'Moon',col:'#8070C0',desc:'The etheric realm, dreams, and the astral foundation of the material.',work:'Moon workings, dream magic, intuition, cyclical work.',why:'Yesod is the sphere just above the material world — the energetic template for what manifests in Malkuth. The Moon rules here because the Moon governs cycles, tides, and the rhythms that shape material reality from beneath. Working with Yesod means working with the pattern before the thing.'},
  {n:10,name:'Malkuth',title:'The Kingdom',planet:'Earth',col:'#806040',desc:'The material world. Where all spiritual energy finally lands.',work:'Grounding, physical manifestation, embodied practice.',why:'Malkuth is the endpoint of all the other sephiroth — where everything that was potential becomes actual. Earth rules here. Working with Malkuth means grounding: bringing what you\'ve worked with spiritually into your actual physical life. The most beautiful intention means nothing without Malkuth.'},
];
// Classical planet → sephirah (the seven classical planets the Tree's middle/lower spheres map to).
// Outer planets (discovered after the system was codified) take their common esoteric attribution:
// Uranus -> Hod (sudden/disruptive intellect), Neptune -> Yesod (dissolving the astral foundation),
// Pluto -> Geburah (transformative severity).
const PLANET_TO_SEPH={Sun:6,Moon:9,Mercury:8,Venus:7,Mars:5,Jupiter:4,Saturn:3,Uranus:8,Neptune:9,Pluto:5};
// The 22 traditional paths on the Tree, expressed as direct sphere-to-sphere connections.
// Used to tell you genuinely whether your active points are directly connected or not.
const TREE_PATHS=[[1,2],[1,3],[1,6],[2,3],[2,4],[2,6],[3,5],[3,6],[4,5],[4,6],[4,7],[5,6],[5,8],[6,7],[6,8],[6,9],[7,8],[7,9],[7,10],[8,9],[8,10],[9,10]];
function sephPathExists(a,b){return TREE_PATHS.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));}

function gSeph(c){
  const lm={1:6,2:9,3:8,4:3,5:7,6:7,7:9,8:4,9:6,11:2,22:4,33:6};
  const sm={Aries:5,Taurus:7,Gemini:8,Cancer:9,Leo:6,Virgo:8,Libra:7,Scorpio:3,Sagittarius:4,Capricorn:3,Aquarius:2,Pisces:9};
  const primary=SEPH.find(s=>s.n===(lm[c.lifePath]||6));
  const secondary=SEPH.find(s=>s.n===(sm[c.sun]||6));
  // Tertiary point: genuinely derived from your Moon sign's ruling planet — not a static lookup
  // keyed to the same two inputs as primary/secondary. This is what was missing — Moon and
  // Rising never fed into the Tree of Life at all before.
  const moonRuler=c.moon?SD[c.moon]?.ruler:null;
  const tertiary=moonRuler?SEPH.find(s=>s.n===PLANET_TO_SEPH[moonRuler]):null;
  // Rising point too, when available, so the whole chart — not just Life Path + Sun — is represented.
  const riseRuler=c.rising?SD[c.rising]?.ruler:null;
  const riseSeph=riseRuler?SEPH.find(s=>s.n===PLANET_TO_SEPH[riseRuler]):null;
  // Check genuine path connections between your active points — telling the truth about
  // whether they're structurally close on the Tree or require crossing distance.
  const connections=[];
  const points=[{label:'Life Path',s:primary},{label:'Sun',s:secondary},{label:'Moon',s:tertiary},{label:'Rising',s:riseSeph}].filter(p=>p.s);
  for(let i=0;i<points.length;i++){
    for(let j=i+1;j<points.length;j++){
      if(points[i].s.n===points[j].s.n)continue;
      connections.push({a:points[i],b:points[j],connected:sephPathExists(points[i].s.n,points[j].s.n)});
    }
  }
  return{primary,secondary,tertiary,riseSeph,connections,activeNumbers:[...new Set(points.map(p=>p.s.n))]};
}

// ─── RETROGRADES ─────────────────────────────────────────────────────────────
const RETRO_WINDOWS=[{p:'Mercury',why:'Mercury retrograde is a review window, not a broken one. Communication, contracts, and travel plans made now are more prone to miscommunication or reversal — not because the universe is against you, but because Mercury governs exactly these domains and its apparent backward motion asks you to revisit rather than launch. Re-read before you send. Confirm before you assume.',r:[['2025-03-15','2025-04-07'],['2025-07-18','2025-08-11'],['2025-11-09','2025-11-29'],['2026-02-26','2026-03-20'],['2026-06-29','2026-07-23'],['2026-10-24','2026-11-13'],['2027-02-09','2027-03-03']]},{p:'Venus',why:'Venus retrograde turns love, money, and self-worth inward for reassessment. New relationships or big purchases started now often need to be revisited once Venus goes direct — not doomed, just unproven. Use it to examine what you already value rather than acquiring something new.',r:[['2025-03-01','2025-04-12'],['2026-04-21','2026-06-04'],['2026-10-03','2026-11-14']]},{p:'Mars',why:'Mars retrograde pulls action energy inward. Momentum you push for now meets more resistance than usual — the same effort produces less visible result. Strategy and internal drive matter more than external action during this window.',r:[['2024-12-06','2025-02-23'],['2027-01-10','2027-04-01']]},{p:'Jupiter',why:'Jupiter retrograde turns growth and expansion inward. This is a window for integrating wisdom you already have rather than reaching for more — outward growth initiated now tends to need reworking once Jupiter direct returns.',r:[['2025-11-11','2026-03-10'],['2026-12-12','2027-04-12']]},{p:'Saturn',why:'Saturn retrograde tests existing structures rather than building new ones. Commitments, foundations, and long-term plans made now benefit from extra scrutiny — Saturn is asking what actually holds weight before you build further on it.',r:[['2025-07-13','2025-11-28'],['2026-07-26','2026-12-10']]},{p:'Uranus',why:'Uranus retrograde slows sudden external change into internal revolution. Shifts that would normally arrive abruptly instead surface as internal realization — the disruption is happening, just beneath the surface first.',r:[['2025-09-06','2026-02-04'],['2026-09-10','2027-02-08']]},{p:'Neptune',why:'Neptune retrograde clears illusion. What felt hazy, idealized, or hard to pin down tends to come into sharper, sometimes less flattering focus during this window — useful for seeing what is actually real versus what you wanted to believe.',r:[['2025-07-04','2025-12-10'],['2026-07-07','2026-12-12']]}];
// Verified against Cafe Astrology, Astro-Seek, and AstroTwins (cross-checked, May–June 2026
// publication dates) on 2026-07-04. Corrected three real errors found in the previous data:
// Venus's second 2026 window was fabricated (real dates are Oct 3–Nov 14, not Jul 23–Sep 6),
// Mars has NO retrograde at all in 2026 (the previous Oct30–Jan2 window didn't exist — its next
// real retrograde is Jan 10–Apr 1, 2027), and Saturn/Neptune's 2026 windows were each off by
// 1–2 weeks. This table should be re-verified again in early 2027 the same way.
function getRetro(date){
  const t=new Date(date).getTime();
  return RETRO_WINDOWS.filter(({r})=>r.some(([s,e])=>t>=new Date(s).getTime()&&t<=new Date(e).getTime())).map(({p,why,r})=>{
    const activeWindow=r.find(([s,e])=>t>=new Date(s).getTime()&&t<=new Date(e).getTime());
    const endDate=new Date(activeWindow[1]);
    const daysLeft=Math.round((endDate.getTime()-t)/86400000);
    return{planet:p,why,endDate,endLabel:endDate.toLocaleDateString('en-US',{month:'long',day:'numeric'}),daysLeft};
  });
}

// ─── LOCATION CHARACTER ────────────────────────────────────────────────────────
function getLocationNote(lat,lng){
  if(lat==null||lng==null)return null;
  if(lat>=36&&lat<=49&&lng>=-105&&lng<=-95)return'Great Plains: vast open sky amplifies celestial workings — moon, stars, and wind carry extra charge here. Deep ancient earth beneath you supports grounding and root work.';
  if(lat>=35&&lat<=49&&lng>=-120&&lng<=-104)return'Mountain elevation: closer to sky vibrations. Earth workings carry mountain permanence — good for long-lasting intentions.';
  if(lat>=42&&lat<=49&&lng>=-125&&lng<=-116)return'Pacific Northwest: rain and moss energy — water workings are naturally amplified here, and forest proximity brings deep earth energy.';
  if(lat>=25&&lat<=37&&lng>=-115&&lng<=-100)return'Southwest desert: ancient red earth energy — fire and earth combined. Strong for solar workings and anything requiring staying power.';
  if(lat>=25&&lat<=48&&(lng>=-82&&lng<=-65||lng<=-115))return'Coastal energy: water proximity amplifies emotional, love, and moon workings. Tidal rhythms mirror lunar cycles naturally.';
  return null;
}

// ─── GEOCODE ─────────────────────────────────────────────────────────────────
const CITIES={'lincoln':[40.8136,-96.7026],'omaha':[41.2565,-95.9345],'blair':[41.5436,-96.1306],'new york':[40.7128,-74.006],'los angeles':[34.0522,-118.2437],'chicago':[41.8781,-87.6298],'houston':[29.7604,-95.3698],'phoenix':[33.4484,-112.074],'san francisco':[37.7749,-122.4194],'seattle':[47.6062,-122.3321],'denver':[39.7392,-104.9903],'boston':[42.3601,-71.0589],'nashville':[36.1627,-86.7816],'las vegas':[36.1699,-115.1398],'portland':[45.5231,-122.6765],'atlanta':[33.749,-84.388],'miami':[25.7617,-80.1918],'minneapolis':[44.9778,-93.265],'dallas':[32.7767,-96.797],'austin':[30.2672,-97.7431],'philadelphia':[39.9526,-75.1652],'salt lake city':[40.7608,-111.891],'kansas city':[39.0997,-94.5786],'new orleans':[29.9511,-90.0715],'tampa':[27.9506,-82.4572],'london':[51.5074,-0.1278],'toronto':[43.6532,-79.3832],'sydney':[-33.8688,151.2093],'paris':[48.8566,2.3522],'berlin':[52.52,13.405],'tokyo':[35.6762,139.6503],'dubai':[25.2048,55.2708],'singapore':[1.3521,103.8198],'mumbai':[19.076,72.8777]};
const TZC={'America/New_York':[40.71,-74],'America/Chicago':[41.85,-87.65],'America/Denver':[39.74,-104.98],'America/Los_Angeles':[34.05,-118.24],'America/Phoenix':[33.45,-112.07],'America/Anchorage':[61.22,-149.9],'America/Honolulu':[21.31,-157.86],'America/Toronto':[43.65,-79.38],'Europe/London':[51.51,-0.13],'Europe/Paris':[48.85,2.35],'Europe/Berlin':[52.52,13.4],'Asia/Tokyo':[35.69,139.69],'Australia/Sydney':[-33.87,151.21]};
// Confidence-tagged geocoding. Order matters: a known city match or a real
// network lookup (Nominatim) is always tried before ever guessing from the
// device's current timezone. The device-timezone guess is a LAST resort only
// — it assumes birth location = wherever the phone happens to be right now,
// which is routinely wrong (e.g. traveling, or simply living somewhere other
// than you were born). Previously this guess ran BEFORE the real geocoder,
// silently overriding it for the majority of typed city names. Every result
// now carries a `confidence` flag so the UI can honestly show when a
// Rising/Moon calculation is resting on a guess instead of a real location.
function geocode(input){
  if(input){
    const raw=input.toLowerCase().trim();
    for(const[c,co]of Object.entries(CITIES))if(raw.includes(c))return Promise.resolve({lat:co[0],lng:co[1],confidence:'exact'});
    const fp=raw.split(',')[0].trim();
    for(const[c,co]of Object.entries(CITIES))if(fp===c||c.startsWith(fp))return Promise.resolve({lat:co[0],lng:co[1],confidence:'exact'});
    return fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&limit=1`)
      .then(r=>r.json())
      .then(d=>d?.[0]?{lat:parseFloat(d[0].lat),lng:parseFloat(d[0].lon),confidence:'exact'}:null)
      .catch(()=>null)
      .then(result=>{
        if(result)return result;
        // Real lookup failed (offline, no match, etc) — fall back to device
        // timezone as a last resort, but mark it clearly as low-confidence.
        try{const tz=Intl.DateTimeFormat().resolvedOptions().timeZone,c=TZC[tz];if(c)return{lat:c[0],lng:c[1],confidence:'approx'};}catch{}
        return null;
      });
  }
  return Promise.resolve(null);
}

// ─── ALIGNMENT ENGINE ─────────────────────────────────────────────────────────
function buildAlign(chart,date,loc){
  const moon=getMoon(date),moonSgn=mSign(date);
  const py=pY(chart.dob,date.getFullYear()),pm=pM(py,date.getMonth()+1),pd=pD(pm,date.getDate());
  const wd=WK[date.getDay()],season=getSeason(date,loc?loc.lat:40),locNote=loc?getLocationNote(loc.lat,loc.lng):null;
  const allHrs=loc?getHours(date,loc.lat,loc.lng):null;
  const currHr=allHrs?.curr||null;
  const sunEl=SD[chart.sun]?.el,moonEl=SD[moonSgn]?.el;
  const harm={'Fire':['Fire','Air'],'Earth':['Earth','Water'],'Air':['Air','Fire'],'Water':['Water','Earth']};
  const opens=[],tens=[],avoids=[],hi=[];

  // Moon phase
  if(moon.tier==='open')opens.push({src:'Moon Phase',text:`${moon.name} — ${moon.energy}`,why:moon.why});
  else tens.push({src:'Moon Phase',text:`${moon.name} — ${moon.energy}`,why:moon.why});

  // Moon sign vs sun element
  if(harm[sunEl]?.includes(moonEl))opens.push({src:'Moon in '+moonSgn,text:`Moon in ${moonSgn} aligns with your ${chart.sun} nature — they share elemental family`,why:`Your ${chart.sun} Sun (${sunEl}) and the Moon currently in ${moonSgn} (${moonEl}) are in elemental harmony. ${sunEl} and ${moonEl} elements support rather than challenge each other. Your emotional body and your identity are pulling in the same direction today.`});
  else if(sunEl&&moonEl)tens.push({src:'Moon in '+moonSgn,text:`Moon in ${moonSgn} creates productive friction with your ${chart.sun} nature`,why:`Your ${chart.sun} Sun (${sunEl}) and the Moon in ${moonSgn} (${moonEl}) are in elemental tension. This is not bad — it creates the kind of productive friction that makes things sharper. You may feel a pull between what you feel and what you think. That gap is information.`});

  // Day of week
  if(wd.tier==='open')opens.push({src:wd.name,text:`${wd.name} · ${wd.planet} day — ${wd.desc.split('.')[0]}`,why:wd.why});
  else if(wd.tier==='avoid')avoids.push({src:wd.name,text:`${wd.name} · ${wd.planet} day — ${wd.desc.split('.')[0]}`,why:wd.why});
  else tens.push({src:wd.name,text:`${wd.name} · ${wd.planet} day — ${wd.desc.split('.')[0]}`,why:wd.why});

  // Personal day
  const pdM=PDM[pd];
  if(pdM){if(pdM.tier==='open')opens.push({src:`Personal Day ${pd}`,text:`PD ${pd} · ${pdM.theme} — ${pdM.desc}`,why:pdM.why});else tens.push({src:`Personal Day ${pd}`,text:`PD ${pd} · ${pdM.theme} — ${pdM.desc}`,why:pdM.why});}

  // Personal month — the missing rung between day and year, now genuinely explained
  const pmM=PMM[pm];
  if(pmM)hi.push({src:`Personal Month ${pm}`,text:`${pmM.theme} month — ${pmM.desc.split('.')[0]}`,why:pmM.why});

  // Personal year
  hi.push({src:`Personal Year ${py}`,text:`${PYM[py]?.theme||'Steady'} year — ${(PYM[py]?.desc||'').split('.')[0]}`,why:PYM[py]?.why});

  // Season
  if(season.tier==='open')opens.push({src:season.name,text:`${season.emoji} ${season.name} — ${season.energy.split('.')[0]}`,why:season.why});
  else tens.push({src:season.name,text:`${season.emoji} ${season.name} — ${season.energy.split('.')[0]}`,why:season.why});

  // Current hour
  if(currHr){const p=PL[currHr.ruler];if(p.tier==='avoid')avoids.push({src:currHr.ruler+' Hour',text:`${currHr.ruler} Hour now — best for ${p.best[0]}; avoid ${p.avoid[0]}`,why:p.why});else opens.push({src:currHr.ruler+' Hour',text:`${currHr.ruler} Hour now — ${p.best.slice(0,2).join(', ')}`,why:p.why});}

  // Retrogrades — real date-range tracking, not flavor text. Each active retrograde
  // is a genuine caution signal that feeds the tier the same way any other tension does.
  const retro=getRetro(date);
  retro.forEach(({planet,why,endLabel})=>{tens.push({src:planet+' Retrograde',text:`${planet} is retrograde until ${endLabel} — review and revisit rather than launch anything in ${planet}'s domain`,why});});

  // Location character — regional energy signature, shown as context rather than a scoring factor
  if(locNote)hi.push({src:'Your Location',text:locNote,why:locNote});

  // Tier reflects the actual balance of signals, not just presence of any single avoid.
  // A lone avoid amid several opens should read as "navigate," not flip the whole day to "avoid."
  const totalSignals=opens.length+tens.length+avoids.length;
  let tier;
  if(totalSignals===0)tier='open';
  else if(avoids.length>0&&avoids.length>=opens.length)tier='avoid'; // avoids match or outnumber opens
  else if(avoids.length>0||tens.length>opens.length)tier='tens'; // some avoid present, or tension dominant
  else tier='open';
  // Numeric score — same underlying signal balance as the tier, just expressed as a single
  // number people can watch move day to day rather than only reading the three-way label.
  const score=Math.max(5,Math.min(95,Math.round(50+opens.length*9-avoids.length*13-tens.length*4)));
  return{moon,moonSgn,py,pm,pd,wd,season,currHr,allHrs,retro,locNote,tier,score,opens,tens,avoids,hi};}

// ─── DIVINE TIMINGS — the forward-looking sacred calendar ────────────────────
// Combines the three things that were previously only visible one day at a
// time (tap into a specific date to see it) into a single scannable timeline:
// upcoming moon phases, upcoming/active observances across traditions, and
// upcoming/active retrograde windows. Nothing new is calculated here — this
// reuses getMoon, getHolidays, and RETRO_WINDOWS exactly as they already work
// elsewhere, just reorganized into "what's coming up" instead of "what's on
// this specific day."
function getDivineTimings(date,horizonDays=45){
  const events=[];
  // Moon phase changes
  let prevName=getMoon(date).name;
  for(let i=1;i<=horizonDays;i++){
    const d=new Date(date);d.setDate(d.getDate()+i);
    const ph=getMoon(d);
    if(ph.name!==prevName){
      events.push({type:'moon',daysAway:i,date:d,label:ph.name,emoji:ph.emoji,desc:ph.energy,col:'var(--lun)'});
    }
    prevName=ph.name;
  }
  // Observances across traditions
  for(let i=0;i<=horizonDays;i++){
    const d=new Date(date);d.setDate(d.getDate()+i);
    getHolidays(d).forEach(h=>{
      events.push({type:'holiday',daysAway:i,date:d,label:h.name,emoji:h.trad==='Wheel of the Year'?'🔥':'✦',desc:h.note||h.trad,trad:h.trad,col:TRAD_COL[h.trad]||'var(--mut)'});
    });
  }
  // Retrograde windows — active now, or starting within the horizon
  const t=date.getTime();
  RETRO_WINDOWS.forEach(({p,why,r})=>{
    r.forEach(([s,e])=>{
      const start=new Date(s).getTime(),end=new Date(e).getTime();
      if(t>=start&&t<=end){
        events.push({type:'retro',daysAway:0,date,label:`${p} Retrograde — active`,emoji:'℞',desc:`Ends ${new Date(e).toLocaleDateString('en-US',{month:'long',day:'numeric'})}. ${why}`,col:'var(--tens)',active:true});
      }else if(start>t&&start-t<=horizonDays*86400000){
        events.push({type:'retro',daysAway:Math.round((start-t)/86400000),date:new Date(s),label:`${p} Retrograde begins`,emoji:'℞',desc:why,col:'var(--tens)'});
      }
    });
  });
  return events.sort((a,b)=>a.daysAway-b.daysAway);
}

function getUpcoming(chart,date){
  const py=pY(chart.dob,date.getFullYear()),evts=[];
  for(let i=1;i<=35;i++){
    const d=new Date(date);d.setDate(d.getDate()+i);
    const ph=getMoon(d);
    const prev=getMoon(new Date(date.getTime()+(i-1)*86400000));
    if(prev.name!==ph.name){
      const isMajor=ph.name==='New Moon'||ph.name==='Full Moon';
      evts.push({
        daysAway:i,
        label:ph.name,
        emoji:ph.emoji,
        energy:ph.energy,
        tier:ph.tier,
        major:isMajor,
        works:ph.works,
        avoid:ph.avoid,
        practices:ph.practices,
        why:ph.why,
        personal:ph.name==='New Moon'?`A new intention set on this day will carry your Personal Year ${py} energy.`
          :ph.name==='Full Moon'?`What has completed in your Personal Year ${py} cycle is ready to be released.`
          :ph.name==='First Quarter'?`Resistance shows up here — push through rather than around it.`
          :ph.name==='Last Quarter'?`A natural point to release what stopped serving your Personal Year ${py} focus.`
          :null,
      });
    }
  }
  return evts;
}

// ─── CODEX LEARNING — real correlation, not frequency-counting ─────────────────
// The old approach counted raw occurrences ("most completed entries happened during
// X") which is meaningless without a baseline — if you start 10 things on Tuesdays
// and 2 on Saturdays, Tuesday will always "win" by volume even with no real signal.
// This computes completion RATE per condition (done ÷ total started under that
// condition) and only surfaces a pattern once there's a real minimum sample size.
const PATTERN_MIN_SAMPLES=3; // don't claim a pattern from 1-2 data points
// Streak — consecutive days with at least one Codex entry, counted back from
// today (or from yesterday if today hasn't been logged yet, so the streak
// doesn't zero out at midnight before someone's had a chance to log). This is
// the core retention loop: it turns "did I use the app" into a number people
// don't want to lose.
function computeStreak(entries){
  if(!entries||entries.length===0)return{count:0,loggedToday:false,atRisk:false};
  const days=new Set(entries.filter(e=>e.date).map(e=>new Date(e.date).toDateString()));
  const today=new Date();
  const loggedToday=days.has(today.toDateString());
  let count=0;
  const cursor=new Date(today);
  if(!loggedToday)cursor.setDate(cursor.getDate()-1); // start counting from yesterday if today's not logged yet
  while(days.has(cursor.toDateString())){
    count++;
    cursor.setDate(cursor.getDate()-1);
  }
  return{count,loggedToday,atRisk:!loggedToday&&count>0};
}

function buildCodexInsights(entries){
  const all=(entries||[]).filter(e=>e.type==='intention'||e.type==='working');
  if(all.length<PATTERN_MIN_SAMPLES)return{insights:[],sampleSize:all.length,ready:false};

  const dimensions=[
    {key:'moonPhase',label:m=>`the ${m} moon`},
    {key:'planetaryHour',label:m=>`${m} Hour workings`},
    {key:'tier',label:m=>m==='open'?'open-window days':m==='avoid'?'close-the-door days':'navigate days'},
    {key:'chakra',label:m=>`days when your ${m} chakra was active`},
    {key:'weekday',label:m=>m},
  ];

  const insights=[];
  for(const dim of dimensions){
    const buckets={};
    all.forEach(e=>{
      const val=e[dim.key];
      if(!val)return;
      if(!buckets[val])buckets[val]={total:0,done:0};
      buckets[val].total++;
      if(e.status==='done')buckets[val].done++;
    });
    // Only consider buckets with enough samples to mean something
    const qualifying=Object.entries(buckets).filter(([_,b])=>b.total>=PATTERN_MIN_SAMPLES);
    if(qualifying.length===0)continue;
    // Compare each bucket against the rate of EVERYTHING ELSE — not a baseline that
    // includes the bucket's own entries, which would understate the real signal.
    const scored=qualifying.map(([val,b])=>{
      const restTotal=all.length-b.total;
      const restDone=all.filter(e=>e.status==='done').length-b.done;
      const restRate=restTotal>0?restDone/restTotal:null; // no comparison possible if this bucket IS everything
      return{val,rate:b.done/b.total,total:b.total,done:b.done,restRate,delta:restRate===null?0:(b.done/b.total)-restRate};
    }).filter(s=>s.restRate!==null); // can't claim a pattern with nothing to compare against
    if(scored.length===0)continue;
    scored.sort((a,b)=>b.delta-a.delta);
    const top=scored[0];
    // Require both a meaningful gap AND a real sample size before calling it a pattern —
    // 3-for-3 alone is encouraging, not yet a "signal."
    if(top&&top.delta>0.2&&top.rate>0&&top.total>=PATTERN_MIN_SAMPLES){
      insights.push({
        dimension:dim.key,
        text:`${Math.round(top.rate*100)}% of your ${dim.label(top.val)} get completed — versus ${Math.round(top.restRate*100)}% for everything else. Based on ${top.total} entries.`,
        confidence:top.total>=6?'strong':'emerging',
      });
    }
  }
  return{insights:insights.slice(0,3),sampleSize:all.length,ready:true};
}


// Merges current planetary hour + moon phase into a clear "do this / not this" answer
function getWorkingGuidance(aln,chart){
  const optimal=new Map(); // text -> {sources:[]}
  const avoid=new Map();

  function addOptimal(text,source){
    const key=text.toLowerCase();
    if(!optimal.has(key))optimal.set(key,{text,sources:[]});
    optimal.get(key).sources.push(source);
  }
  function addAvoid(text,source){
    const key=text.toLowerCase();
    if(!avoid.has(key))avoid.set(key,{text,sources:[]});
    avoid.get(key).sources.push(source);
  }

  // Moon phase contributes its workings/avoid
  aln.moon.works.forEach(w=>addOptimal(w,'Moon Phase'));
  addAvoid(aln.moon.avoid.replace(/\.$/,''),'Moon Phase');

  // Current planetary hour contributes its best/avoid
  if(aln.currHr){
    const p=aln.currHr.pl;
    p.best.forEach(b=>addOptimal(b,aln.currHr.ruler+' Hour'));
    p.avoid.forEach(a=>addAvoid(a,aln.currHr.ruler+' Hour'));
  }

  // Personal layer — without this, the guidance above is identical for every
  // person checking at the same moment, since Moon phase and the planetary
  // hour are universal, not chart-specific. Your Sun, Moon, and Rising each
  // have a ruling planet with its own best/avoid domains — folding those in
  // means two people looking at this on the same day genuinely see different
  // results, and the "why" traces back to an actual placement in your chart.
  if(chart){
    const personalRulers=[
      {sign:chart.sun,label:'Your Sun'},
      {sign:chart.moon,label:'Your Moon'},
      {sign:chart.rising,label:'Your Rising'},
    ].filter(x=>x.sign&&SD[x.sign]?.ruler&&PL[SD[x.sign].ruler]);
    personalRulers.forEach(({sign,label})=>{
      const ruler=SD[sign].ruler,p=PL[ruler];
      p.best.slice(0,2).forEach(b=>addOptimal(b,`${label} (${ruler})`));
      p.avoid.slice(0,1).forEach(a=>addAvoid(a,`${label} (${ruler})`));
    });
  }

  // Cross-check: if something is optimal in one source but avoided in another, flag as "mixed"
  const optimalList=[...optimal.values()];
  const avoidList=[...avoid.values()];
  const mixed=[];
  const cleanOptimal=[];
  const cleanAvoid=[];

  optimalList.forEach(o=>{
    const conflict=avoidList.find(a=>a.text.toLowerCase()===o.text.toLowerCase());
    if(conflict)mixed.push({text:o.text,optimalSources:o.sources,avoidSources:conflict.sources});
    else cleanOptimal.push(o);
  });
  avoidList.forEach(a=>{
    const alreadyMixed=mixed.find(m=>m.text.toLowerCase()===a.text.toLowerCase());
    if(!alreadyMixed)cleanAvoid.push(a);
  });

  // Overall verdict
  const verdict=aln.tier==='avoid'?'Today leans toward closing doors and finishing — not the day for new launches.'
    :aln.tier==='open'?'Today leans open — a genuinely good day to start or commit to something.'
    :'Today asks for care — some things are supported, others need patience.';

  return{optimal:cleanOptimal,avoid:cleanAvoid,mixed,verdict};
}

// A concrete "suggested working" — the abstract categories from getWorkingGuidance
// (e.g. "banishing", "abundance") tell you what TYPE of thing is favored today,
// but not an actual thing to go do. This turns the top-favored type into one
// specific, doable action — and scales its size to today's effort level, so a
// Rest day gets something genuinely small and a Push day gets something worth
// the extra capacity. Same underlying signals, just made actionable.
const WORKING_BUCKETS=[
  {key:'banishing',match:/bani|cord|cutt|releas/i,title:'A Clearing Working',templates:{push:'Do a full clearing — smoke-cleanse your space and write out everything you\'re ready to release, then burn or shred the list.',steady:'Cut cords with one specific thing that\'s been weighing on you. Write it down, then physically discard the paper.',ease:'Declutter one small area — a drawer, your phone\'s home screen — as a gentle release.',rest:'Simply name, out loud or in writing, one thing you\'re ready to let go of. That\'s enough today.'}},
  {key:'newBeginnings',match:/new beginn|beginning|initiat|planting/i,title:'A Beginning Working',templates:{push:'Start the thing you\'ve been circling — send the message, open the account, take the real first step.',steady:'Write a clear intention for what you want to begin, with one concrete next action attached to it.',ease:'Plant a small seed, literally or figuratively — one small starting gesture, nothing bigger.',rest:'Just write down the beginning you\'re considering. Naming it is today\'s work.'}},
  {key:'love',match:/love|attract|self-love|beauty|harmony/i,title:'A Love Working',templates:{push:'Have the real conversation you\'ve been putting off — the one requiring honesty, not small talk.',steady:'Reach out to someone who matters with something specific and true, not just a check-in.',ease:'A small act of care — a message, a favor — nothing that requires a big emotional lift.',rest:'Sit with what you actually feel about a relationship, without needing to act on it yet.'}},
  {key:'communication',match:/communicat|contract|precision|written|study/i,title:'A Communication Working',templates:{push:'Send the contract, make the call, have the direct conversation you\'ve been drafting in your head.',steady:'Write the email or message you\'ve been avoiding — clear, direct, done today.',ease:'Reply to one small thing sitting in your inbox. Keep it light.',rest:'Just jot down what you want to say, for later. No need to send it today.'}},
  {key:'abundance',match:/abundance|expansion|luck|prosper|legal|teach|growth/i,title:'An Abundance Working',templates:{push:'Make the ask — the raise, the pitch, the direct request for what you\'re worth.',steady:'Review your finances or a specific opportunity with real attention — one concrete step forward.',ease:'A small act of appreciation for what you already have. Write down three things.',rest:'Rest is allowed even on an abundance day. Note one thing you\'re grateful for and stop there.'}},
  {key:'courage',match:/courage|action|protect|breaking/i,title:'A Courage Working',templates:{push:'Do the hard, brave thing you\'ve been avoiding. Today\'s the day for it.',steady:'Take one decisive step on something you\'ve been hesitant about.',ease:'Name what you\'re avoiding, honestly, without committing to act on it yet.',rest:'Courage today looks like rest. Protect your energy rather than pushing through.'}},
  {key:'rest',match:/rest|withdraw/i,title:'A Rest Working',templates:{push:'Even on a high-output day, block real rest — 20 minutes, phone away, no exceptions.',steady:'Build in one deliberate pause today — a walk, a stretch, five minutes of stillness.',ease:'Let today be genuinely easier. Cancel one non-essential thing if you can.',rest:'Full permission to do less today. Sleep, unplug, or simply sit without an agenda.'}},
  {key:'reflection',match:/reflect|divination|intuition|dream/i,title:'A Reflection Working',templates:{push:'Journal through the big question you\'ve been circling — give it real, unhurried time today.',steady:'Ten minutes of honest journaling on what\'s actually on your mind.',ease:'A few lines in your journal — just enough to notice what\'s present.',rest:'Sit quietly with your own thoughts. No need to write anything down.'}},
];
function getSuggestedWorking(aln,effort,chart){
  const guide=getWorkingGuidance(aln,chart);
  const topText=guide.optimal[0]?.text||guide.mixed[0]?.text||'reflection';
  const bucket=WORKING_BUCKETS.find(b=>b.match.test(topText))||WORKING_BUCKETS[WORKING_BUCKETS.length-1];
  return{
    title:bucket.title,
    instruction:bucket.templates[effort.level],
    source:topText,
    effortLabel:effort.label,
  };
}

// Effort Level — how much output today's real signals actually support, separate
// from the open/mixed/avoid tier (which says whether to act) and the working
// guide (which says what to act on). This says how HARD to push. Derived from
// waxing/waning moon, day ruler tier, personal day tier, season tier, and active
// retrogrades — the same signal set buildAlign already computes, just weighted
// for output capacity rather than for what type of working is favored.
function getEffortLevel(aln){
  const waxing=aln.moon.pct<0.5;
  const pdM=PDM[aln.pd];
  let score=50;
  score+=waxing?15:-15;
  score+=aln.wd.tier==='open'?10:aln.wd.tier==='avoid'?-15:0;
  score+=pdM?(pdM.tier==='open'?10:-5):0;
  score+=aln.season.tier==='open'?5:-5;
  score-=aln.retro.length*8;
  score=Math.max(10,Math.min(90,Math.round(score)));
  let level,label,icon,desc;
  if(score>=70){level='push';label='Push';icon='⚡';desc='High-output day — tackle the big, ambitious thing while momentum is genuinely behind you.';}
  else if(score>=50){level='steady';label='Steady';icon='→';desc='Normal capacity — keep moving on what\'s already in motion. Nothing needs to be forced today.';}
  else if(score>=30){level='ease';label='Ease';icon='〜';desc='Lighten the load — prioritize only what truly matters and let the rest wait for a better window.';}
  else{level='rest';label='Rest';icon='☾';desc='Recovery day — the signals point inward. Output will cost more than usual; rest is the actually productive move.';}
  const factors=[
    waxing?'Waxing moon favors outward effort and building.':'Waning moon favors inward focus and rest.',
    `${aln.wd.name} (${aln.wd.planet} day) is ${aln.wd.tier==='open'?'supportive of output':aln.wd.tier==='avoid'?'naturally contractive':'mixed'} today.`,
  ];
  if(pdM)factors.push(`Personal Day ${aln.pd} — ${pdM.theme} (${pdM.tier==='open'?'supportive':'better for review than push'}).`);
  if(aln.season.tier)factors.push(`${aln.season.name} is a ${aln.season.tier==='open'?'building':'harvesting/resting'} season.`);
  if(aln.retro.length)factors.push(`${aln.retro.map(r=>`${r.planet} (until ${r.endLabel})`).join(', ')} retrograde right now — review energy pulls against full-output pushes.`);
  return{score,level,label,icon,desc,factors};
}

// A genuine "weather at a glance" module — the thing you check before reading
// anything else, the same way you'd glance at a weather icon before deciding
// whether to grab an umbrella. Pulls from the same real engine as WorkingsGuide
// (verdict + top optimal + top avoid) but renders as one unmistakable visual
// read, not prose you have to parse.
function DayGlance({aln,chart}){
  const guide=useMemo(()=>getWorkingGuidance(aln,chart),[aln,chart]);
  const effort=useMemo(()=>getEffortLevel(aln),[aln]);
  const[effortOpen,setEffortOpen]=useState(false);
  const top=guide.optimal[0];
  const worst=guide.avoid[0];
  const tierMeta={
    open:{icon:'☀️',label:'Open',col:'var(--open)',bg:'var(--obg)',bdr:'var(--obdr)'},
    tens:{icon:'⛅',label:'Mixed',col:'var(--tens)',bg:'var(--tbg)',bdr:'var(--tbdr)'},
    avoid:{icon:'⛈️',label:'Close the Door',col:'var(--avoid)',bg:'var(--abg)',bdr:'var(--abdr)'},
  }[aln.tier];
  const effortCol={push:'var(--open)',steady:'var(--gold)',ease:'var(--tens)',rest:'var(--lun)'}[effort.level];
  const effortBg={push:'var(--obg)',steady:'var(--gbg)',ease:'var(--tbg)',rest:'var(--lbg)'}[effort.level];
  const effortBdr={push:'var(--obdr)',steady:'var(--gbdr)',ease:'var(--tbdr)',rest:'var(--lbdr)'}[effort.level];

  return(
    <div style={{background:tierMeta.bg,border:`1px solid ${tierMeta.bdr}`,borderRadius:18,padding:'18px',marginBottom:14}}>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:12}}>
        <div style={{fontSize:38,lineHeight:1}}>{tierMeta.icon}</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:'Inter',fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:tierMeta.col,fontWeight:600,marginBottom:2}}>Today's Forecast</div>
          <div className="td" style={{fontSize:21,color:tierMeta.col}}>{tierMeta.label}</div>
        </div>
        <div onClick={()=>setEffortOpen(v=>!v)} style={{display:'flex',alignItems:'center',gap:6,background:effortBg,border:`1px solid ${effortBdr}`,borderRadius:20,padding:'6px 12px',cursor:'pointer',flexShrink:0}}>
          <span style={{fontSize:14}}>{effort.icon}</span>
          <span style={{fontFamily:'Inter',fontSize:10,letterSpacing:'.07em',textTransform:'uppercase',color:effortCol,fontWeight:600}}>{effort.label}</span>
        </div>
      </div>
      {effortOpen&&(
        <div style={{background:effortBg,border:`1px solid ${effortBdr}`,borderRadius:10,padding:'10px 12px',marginBottom:12}}>
          <div className="tb" style={{fontSize:12,color:effortCol,lineHeight:1.6,marginBottom:6}}>{effort.desc}</div>
          {effort.factors.map((f,i)=><div key={i} className="tb" style={{fontSize:11,color:'var(--mut)',lineHeight:1.6}}>· {f}</div>)}
        </div>
      )}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
        <div style={{flex:1,height:6,borderRadius:3,background:'var(--bl)',overflow:'hidden'}}>
          <div style={{height:'100%',width:`${aln.score}%`,borderRadius:3,background:tierMeta.col}}/>
        </div>
        <span style={{fontFamily:'Inter',fontSize:12,color:'var(--mut)',flexShrink:0}}>{aln.score}/100</span>
      </div>
      <div className="tb" style={{fontSize:13,lineHeight:1.65,marginBottom:top||worst?12:0}}>{guide.verdict}</div>
      {(top||worst)&&(
        <div style={{display:'flex',gap:8}}>
          {top&&(
            <div style={{flex:1,background:'var(--bgc)',borderRadius:10,padding:'9px 11px',border:'1px solid var(--obdr)'}}>
              <div style={{fontFamily:'Inter',fontSize:9,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--open)',marginBottom:2}}>✓ Do</div>
              <div style={{fontFamily:'Inter',fontSize:12,color:'var(--ink)',textTransform:'capitalize'}}>{top.text}</div>
            </div>
          )}
          {worst&&(
            <div style={{flex:1,background:'var(--bgc)',borderRadius:10,padding:'9px 11px',border:'1px solid var(--abdr)'}}>
              <div style={{fontFamily:'Inter',fontSize:9,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--avoid)',marginBottom:2}}>✕ Avoid</div>
              <div style={{fontFamily:'Inter',fontSize:12,color:'var(--ink)',textTransform:'capitalize'}}>{worst.text}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function WorkingsGuide({aln,compact=false,chart}){
  const guide=useMemo(()=>getWorkingGuidance(aln,chart),[aln,chart]);
  const[expanded,setExpanded]=useState(!compact);

  return(
    <div className="card" style={{padding:compact?'14px 16px':'18px',marginBottom:compact?8:14}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
        <div>
          <div className="tl" style={{marginBottom:3}}>What's Aligned Right Now</div>
          <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.5}}>{guide.verdict}</div>
        </div>
        {compact&&(
          <button onClick={()=>setExpanded(v=>!v)} style={{background:'none',border:'none',color:'var(--dim)',fontSize:11,cursor:'pointer',flexShrink:0,marginLeft:8}}>{expanded?'▲':'▼'}</button>
        )}
      </div>

      {expanded&&(
        <div>
          {guide.optimal.length>0&&(
            <div style={{marginBottom:10}}>
              <div className="tc" style={{color:'var(--open)',marginBottom:6}}>✦ Optimal working types</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {guide.optimal.map((o,i)=>(
                  <span key={i} title={o.sources.join(' · ')} style={{background:'var(--obg)',border:'1px solid var(--obdr)',borderRadius:20,padding:'4px 11px',color:'var(--open)',fontFamily:'Inter',fontSize:10,textTransform:'capitalize'}}>{o.text}</span>
                ))}
              </div>
            </div>
          )}

          {guide.mixed.length>0&&(
            <div style={{marginBottom:10}}>
              <div className="tc" style={{color:'var(--tens)',marginBottom:6}}>◈ Mixed signal — proceed with awareness</div>
              {guide.mixed.map((m,i)=>(
                <div key={i} style={{background:'var(--tbg)',border:'1px solid var(--tbdr)',borderRadius:10,padding:'8px 12px',marginBottom:5}}>
                  <div className="tb" style={{fontSize:12,textTransform:'capitalize',color:'var(--tens)',marginBottom:2}}>{m.text}</div>
                  <div className="tc">{m.optimalSources.join(', ')} supports this · {m.avoidSources.join(', ')} doesn't</div>
                </div>
              ))}
            </div>
          )}

          {guide.avoid.length>0&&(
            <div>
              <div className="tc" style={{color:'var(--avoid)',marginBottom:6}}>— Avoid right now</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {guide.avoid.map((a,i)=>(
                  <span key={i} title={a.sources.join(' · ')} style={{background:'var(--abg)',border:'1px solid var(--abdr)',borderRadius:20,padding:'4px 11px',color:'var(--avoid)',fontFamily:'Inter',fontSize:10,textTransform:'capitalize'}}>{a.text}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── WHY BUTTON ───────────────────────────────────────────────────────────────
function WhyBtn({text,children}){
  const[open,setOpen]=useState(false);
  return(
    <div>
      <button className="why-btn" onClick={()=>setOpen(v=>!v)}>
        <span>{open?'▲':'▼'}</span><span>{open?'less':'why this'}</span>
      </button>
      {open&&(
        <div className="why-box">
          <div className="tb" style={{fontSize:12,lineHeight:1.8,color:'var(--mut)'}}>{text||children}</div>
        </div>
      )}
    </div>
  );
}

// ─── LOCATION PROMPT ─────────────────────────────────────────────────────────
function LocationPrompt({current,onSet,inline=false}){
  const[input,setInput]=useState('');
  const[err,setErr]=useState(false);
  const[loading,setLoading]=useState(false);
  async function handle(){setErr(false);setLoading(true);const co=await geocode(input);if(co){onSet({lat:co.lat,lng:co.lng,city:input.trim()});setInput('');}else setErr(true);setLoading(false);}
  if(inline)return(
    <div style={{display:'flex',gap:6,alignItems:'flex-start'}}>
      <input className="fld" style={{flex:1,fontSize:12,padding:'9px 12px'}} placeholder={current?'Update city…':'Your city…'} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&input.trim()&&handle()}/>
      <button className="bp" style={{width:'auto',padding:'9px 14px',fontSize:10,flexShrink:0,opacity:input.trim()&&!loading?1:.5}} disabled={!input.trim()||loading} onClick={handle}>{loading?'…':'Set'}</button>
    </div>
  );
  return(
    <div>
      {err&&<div style={{color:'var(--avoid)',fontFamily:'Inter',fontSize:11,marginBottom:6}}>City not found — try a different spelling</div>}
      <div style={{display:'flex',gap:6}}>
        <input className="fld" style={{flex:1,fontSize:13}} placeholder="City name" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&input.trim()&&handle()}/>
        <button className="bp" style={{width:'auto',padding:'10px 16px',flexShrink:0,opacity:input.trim()&&!loading?1:.4}} disabled={!input.trim()||loading} onClick={handle}>{loading?'…':'Add'}</button>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({onComplete}){
  const[step,setStep]=useState(0);
  const[name,setName]=useState('');
  const[dob,setDob]=useState('');
  const[bt,setBt]=useState('');
  const[ampm,setAmpm]=useState('AM');
  const[place,setPlace]=useState('');
  const[showT,setShowT]=useState(false);
  const[showS,setShowS]=useState(false);
  const[sSun,setSSun]=useState('');
  const[sMoon,setSMoon]=useState('');
  const[sRise,setSRise]=useState('');
  const[calc,setCalc]=useState(false);

  const prev=useMemo(()=>{if(!dob)return null;try{const[y,m,d]=dob.split('-').map(Number);return{sun:sSgn(m,d),lp:lpN(dob),zh:chZ(y,m,d)};}catch{return null;}},[dob]);

  async function finish(){
    if(!name||!dob)return;setCalc(true);
    const[y,m,d]=dob.split('-').map(Number),cs=sSgn(m,d),zh=chZ(y,m,d),lp=lpN(dob);
    let cMoon=null,cRise=null,moonOk=false,moonCertain=false,coords=null;
    if(showT&&bt){
      const[hR,mR]=bt.split(':').map(Number);let h24=hR;
      if(ampm==='PM'&&hR!==12)h24=hR+12;if(ampm==='AM'&&hR===12)h24=0;
      const bt24=`${String(h24).padStart(2,'0')}:${String(mR||0).padStart(2,'0')}`;
      if(place){coords=await geocode(place);}
      // Pass coordinates so moon uses timezone-corrected local time
      cMoon=mFromB(dob,bt24,coords?.lat,coords?.lng);
      moonOk=true;moonCertain=true;
      if(coords)cRise=gRising(dob,bt24,coords.lat,coords.lng);
    }else{
      const md=mFromD(dob);
      if(md){cMoon=md.sign;moonOk=true;moonCertain=md.certain;}
    }
    setCalc(false);
    onComplete({name,dob,sun:(showS&&sSun)||cs,moon:(showS&&sMoon)||cMoon||null,moonOk,moonCertain,rising:(showS&&sRise)||cRise||null,riseOk:showT&&!!cRise,riseApprox:coords?.confidence==='approx',chinese:zh,lifePath:lp,birthPlace:showT?place:null});
  }

  const L={fontFamily:'Inter',fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--mut)',marginBottom:6,display:'block'};

  if(step===0)return(
    <div style={{height:'100dvh',background:'var(--bg)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 32px',textAlign:'center'}}>
      <Styles/>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
        <div style={{fontSize:56,color:'var(--gold)',fontFamily:'Fraunces,serif',fontWeight:300,marginBottom:20}}>✦</div>
        <div className="td" style={{fontSize:46,letterSpacing:'-.02em',marginBottom:8}}>Unearthed</div>
        <div style={{width:24,height:1,background:'var(--bm)',margin:'0 auto 20px'}}/>
        <div className="tb" style={{fontSize:14,color:'var(--mut)',lineHeight:2,maxWidth:260,fontStyle:'italic'}}>Your cosmic blueprint — built from you, not around you.</div>
      </div>
      <button className="bp" style={{maxWidth:260,width:'100%',marginBottom:48}} onClick={()=>setStep(1)}>Begin</button>
    </div>
  );

  if(step===1)return(
    <div className="obs"><Styles/>
      <div className="obd" style={{padding:'80px 28px 40px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div className="td" style={{fontSize:30,marginBottom:8}}>What's your name?</div>
        <div className="tb" style={{fontSize:14,color:'var(--mut)',marginBottom:32,lineHeight:1.8}}>Everything here is built from you.<br/>This is where it starts.</div>
        <input className="fld" style={{fontSize:20,padding:'16px 18px'}} placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&name.trim()&&setStep(2)} autoFocus/>
      </div>
      <div className="obf"><button className="bp" style={{opacity:name.trim()?1:.35}} onClick={()=>name.trim()&&setStep(2)} disabled={!name.trim()}>Continue</button></div>
    </div>
  );

  if(step===2)return(
    <div className="obs"><Styles/>
      <div className="obd" style={{padding:'56px 24px 24px'}}>
        <div className="td" style={{fontSize:26,marginBottom:8}}>When were you born, {name}?</div>
        <div className="tb" style={{fontSize:13,color:'var(--mut)',marginBottom:24,lineHeight:1.8}}>Your date unlocks your sun sign, life path, and Chinese zodiac. Time and place add your moon and rising.</div>
        <div className="card" style={{padding:'18px',marginBottom:10}}>
          <label style={L}>Date of Birth</label>
          <input className="fld" type="date" value={dob} onChange={e=>setDob(e.target.value)}/>
        </div>
        {prev&&(
          <div style={{display:'flex',gap:8,marginBottom:10}}>
            {[['Sun',prev.sun,'var(--gold)'],['Life Path',String(prev.lp),'var(--open)'],['Chinese',prev.zh.emoji,'var(--ink)']].map(([l,v,c])=>(
              <div key={l} className="card" style={{flex:1,padding:'12px',textAlign:'center'}}>
                <div className="tc" style={{marginBottom:4}}>{l}</div>
                <div className="td" style={{fontSize:l==='Chinese'?22:16,color:c}}>{v}</div>
              </div>
            ))}
          </div>
        )}
        <button onClick={()=>setShowT(v=>!v)} className="bg" style={{marginBottom:8}}>{showT?'▼ Hide birth time':'▶ Add birth time — for moon + rising'}</button>
        {showT&&(
          <div className="card" style={{padding:'18px',marginBottom:10}}>
            <label style={L}>Birth Time</label>
            <div style={{display:'flex',gap:8,marginBottom:10}}>
              <input className="fld" style={{flex:1}} type="time" value={bt} onChange={e=>setBt(e.target.value)}/>
              <div style={{display:'flex',gap:4}}>{['AM','PM'].map(a=><button key={a} onClick={()=>setAmpm(a)} style={{background:ampm===a?'var(--bgd)':'var(--bgm)',border:`1px solid ${ampm===a?'var(--bgd)':'var(--bm)'}`,borderRadius:8,color:ampm===a?'#EDE4CC':'var(--mut)',fontFamily:'Inter',fontSize:12,padding:'0 14px',cursor:'pointer',minHeight:44}}>{a}</button>)}</div>
            </div>
            <label style={L}>Birth City</label>
            <input className="fld" placeholder="City, State or City, Country" value={place} onChange={e=>setPlace(e.target.value)}/>
          </div>
        )}
        <button onClick={()=>setShowS(v=>!v)} className="bg" style={{marginBottom:8}}>{showS?'▼ Hide sign entry':'▶ I know my signs already'}</button>
        {showS&&(
          <div className="card" style={{padding:'18px',marginBottom:10}}>
            {[['Sun',sSun,setSSun],['Moon',sMoon,setSMoon],['Rising',sRise,setSRise]].map(([l,v,s])=>(
              <div key={l} style={{marginBottom:12}}>
                <label style={L}>{l} Sign</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>{SIGNS.map(sg=><button key={sg} className={`chip ${v===sg?'on':''}`} onClick={()=>s(v===sg?'':sg)} style={{fontSize:9}}>{sg}</button>)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="obf">
        <button className="bp" style={{marginBottom:8,opacity:dob&&!calc?1:.35}} onClick={finish} disabled={!dob||calc}>{calc?'Building your blueprint…':'Open Unearthed ✦'}</button>
        <button className="bg" onClick={()=>setStep(1)}>← Back</button>
      </div>
    </div>
  );

  // Step 3 — the reveal
  if(step===3)return null; // handled by parent after onComplete
  return null;
}

// ─── TODAY PAGE ───────────────────────────────────────────────────────────────
function TodayPage({chart,loc,onSetLoc,codexEntries,onNavigate}){
  const[reading,setReading]=useState('');
  const[rdLoad,setRdLoad]=useState(false);
  const[readError,setReadError]=useState(false);
  const[today,setToday]=useState(()=>new Date());
  const[laOpen,setLaOpen]=useState(false);

  // Keep "now" genuinely current — recalculate every minute so hour boundaries,
  // countdowns, and midnight rollovers don't go stale while the app stays open.
  useEffect(()=>{
    const id=setInterval(()=>setToday(new Date()),60000);
    return ()=>clearInterval(id);
  },[]);

  const aln=useMemo(()=>buildAlign(chart,today,loc),[chart,today,loc]);
  const ck=useMemo(()=>dCK(chart,today),[chart,today]);
  const dateStr=today.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  const TT={open:'to',tens:'tt',avoid:'tav'};
  const TL={open:'Open Window',tens:'Navigate',avoid:'Close the Door'};

  const completeness=useMemo(()=>chartCompleteness(chart),[chart]);
  const hdType=useMemo(()=>deriveHD(chart),[chart]);
  const hdAuthority=useMemo(()=>deriveHDAuthority(chart,hdType),[chart,hdType]);
  const seph=useMemo(()=>gSeph(chart),[chart]);
  const streak=useMemo(()=>computeStreak(codexEntries),[codexEntries]);
  const effort=useMemo(()=>getEffortLevel(aln),[aln]);
  const suggested=useMemo(()=>getSuggestedWorking(aln,effort,chart),[aln,effort,chart]);
  const freq=useMemo(()=>getActiveFrequency(ck.name),[ck]);

  async function loadReading(){
    setRdLoad(true);setReadError(false);
    const tierContext=aln.tier==='avoid'?'Today\'s overall balance leans toward closing doors and finishing things — more avoid signals than open ones. The tension sentence should carry real weight, not be a footnote.':aln.tier==='tens'?'Today\'s overall balance is mixed — genuine open windows exist alongside real friction. Hold both honestly without forcing a tidy resolution.':'Today\'s overall balance leans open — more supportive signals than challenging ones. The tension sentence should be real but proportionally smaller than the opportunity.';

    // Only include Moon/Rising-derived depth when we genuinely have it.
    // Never let the model invent or guess at placements we don't actually know.
    const moonLine=completeness.hasMoon?`${chart.moon} Moon${completeness.moonConfirmed?'':' (best estimate from birth date — exact sign needs birth time)'}`:'Moon sign unknown — birth time needed';
    const risingLine=completeness.hasRising?`${chart.rising} Rising`:'Rising sign unknown — birth time + city needed';
    const depthLine=`Human Design: ${hdType}, ${hdAuthority||'?'} Authority${!completeness.isFullChart?' (estimated — full accuracy needs birth time + place)':''} · Tree of Life: ${seph.primary?.name} (Life Path) + ${seph.secondary?.name} (Sun)${seph.tertiary?` + ${seph.tertiary.name} (Moon)`:''} · Today's chakra: ${ck.name} (${ck.reason})`;
    const completenessNote=completeness.isFullChart?'':`IMPORTANT: This person's chart is incomplete — they have not provided ${completeness.missingParts.join(' and ')}. Do NOT invent, guess, or imply certainty about their Moon or Rising sign if unknown. Write the reading using only what is genuinely known: Sun, Life Path, Chinese zodiac, Human Design (note if estimated), and today's timing. The reading should still feel rich and specific — built from what we DO know — never apologetic or thin.`;

    const prompt=`You are Unearthed — a personal guide built from this person's birth data. Every sentence must be specific to THEIR chart. Never generic astrology. Never "Virgos tend to..." — always "Your Virgo Sun means..."

Their blueprint: ${chart.sun} Sun · ${moonLine} · ${risingLine} · Life Path ${chart.lifePath} · ${chart.chinese?.full}
${depthLine}
Today: ${dateStr} · ${aln.moon.name} in ${aln.moonSgn} · ${aln.wd.name} · ${aln.season.name} · Personal Year ${aln.py} · Personal Day ${aln.pd}${aln.currHr?' · '+aln.currHr.ruler+' Hour active':''}
Overall tier: ${aln.tier} (${aln.opens.length} open signals, ${aln.tens.length} tension signals, ${aln.avoids.length} avoid signals). ${tierContext}
${completenessNote}

Write exactly 4 sentences. Each one specific. No filler. No "the stars say." No "the universe."
1: What is most alive in ${chart.name} today — name the exact placement driving it. Draw from Sun, Human Design, Tree of Life, or chakra — not just Sun sign every time.
2: The main open window or opportunity right now — specific to their chart.
3: The main tension to navigate honestly — not alarming, just real.
4: One precise thing worth their attention today.

The overall tone of the reading must match the overall tier above — don't undercut an open day with heavy caution, and don't oversell a navigate/avoid day as effortless.

Voice: warm, direct, like a trusted friend who genuinely knows them. Plain language. No jargon.`;
    try{
      if(!AI_ENABLED)throw new Error('AI disabled — running free/offline');
      const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:300,messages:[{role:'user',content:prompt}]})});
      if(!r.ok)throw new Error('API request failed');
      const data=await r.json();
      const text=(data.content?.map(b=>b.type==='text'?b.text:'').join('')||'').trim();
      if(!text)throw new Error('Empty response');
      setReading(text);
    }catch{
      // Fallback is built only from what we genuinely know — never references
      // Moon/Rising unless confirmed, so an API failure never reads as invented data.
      const sunTrait=SD[chart.sun]?.desc?.split('.')[0]?.toLowerCase()||'particular nature';
      const hdLine=hdType?` Your ${hdType} design means ${hdType==='Generator'?'your gut response is more accurate than your overthinking':hdType==='Projector'?'your insight lands best when it\'s actually invited':hdType==='Manifestor'?'informing people before you act removes resistance you can\'t see':hdType==='ManifestingGenerator'?'moving fast on multiple things is working as intended':'the right environment matters more than forcing a decision'}.`:'';
      setReading(`Your ${chart.sun} ${sunTrait} quality is what today is asking you to trust.${hdLine} The ${aln.moon.name} creates an opening for the kind of work that requires patience over force. There is a productive tension between what you know and what you can immediately act on — that gap is data, not failure. What is one honest thing you can do today that your future self will be glad you did?`);
      setReadError(true);
    }
    setRdLoad(false);
  }

  useEffect(()=>{loadReading();},[]);

  const Row=({item,col})=>{
    const[open,setOpen]=useState(false);
    return(
      <div style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:8}}>
        <div style={{width:5,height:5,borderRadius:'50%',background:col,marginTop:9,flexShrink:0}}/>
        <div style={{flex:1}}>
          <div className="tc" style={{marginBottom:2,color:col}}>{item.src}</div>
          <div className="tb" style={{fontSize:13,lineHeight:1.6,marginBottom:item.why?0:0}}>{item.text}</div>
          {item.why&&<WhyBtn text={item.why}/>}
        </div>
      </div>
    );
  };

  return(
    <div className="scr ent" style={{padding:'20px 16px 0'}}>
      {/* DATE + STATUS */}
      <div style={{marginBottom:14}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
          <div className="tc">{dateStr}</div>
          {streak.count>0&&(
            <div style={{display:'flex',alignItems:'center',gap:4,background:streak.atRisk?'var(--tbg)':'var(--gbg)',border:`1px solid ${streak.atRisk?'var(--tbdr)':'var(--gbdr)'}`,borderRadius:12,padding:'2px 9px'}}>
              <span style={{fontSize:11}}>🔥</span>
              <span style={{fontFamily:'Inter',fontSize:10,fontWeight:600,letterSpacing:'.03em',color:streak.atRisk?'var(--tens)':'var(--gold)'}}>{streak.count} day{streak.count===1?'':'s'}{streak.atRisk?' · log today to keep it':''}</span>
            </div>
          )}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div className="tc">{aln.moonSgn} Moon · {aln.moon.name} · Personal Day {aln.pd}</div>
          <span className={`tag ${TT[aln.tier]}`}>{TL[aln.tier]}</span>
        </div>
      </div>

      {/* TODAY'S FORECAST — the weather-glance moment. This is what you check first. */}
      <DayGlance aln={aln} chart={chart}/>

      {/* AI READING — the deeper "why" behind the forecast above, not the headline itself */}
      <div className="hero">
        <div className="tc" style={{color:'#C8A84070',marginBottom:12}}>The fuller picture · {chart.name}</div>
        {rdLoad?(
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0'}}>
            <span className="sp" style={{fontSize:14,color:'var(--gbr)'}}>✦</span>
            <div style={{fontFamily:'Spectral,serif',fontSize:13,color:'#8A7050',fontStyle:'italic'}}>Reading the terrain…</div>
          </div>
        ):(
          <div style={{fontFamily:'Spectral,serif',fontSize:15,lineHeight:1.9,color:'#EDE4CC'}}>{reading}</div>
        )}
        {readError&&!rdLoad&&<div style={{marginTop:10,fontFamily:'Inter',fontSize:10,color:'#C09060'}}>Couldn't reach your full reading — showing a simpler version.</div>}
        {!rdLoad&&<button onClick={loadReading} style={{marginTop:14,background:'none',border:'none',color:'#6E5A30',fontFamily:'Inter',fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',padding:0}}>Refresh ↺</button>}
      </div>

      {/* LIFE AREAS — Career/Love/Family/Health, each grounded in today's real signals */}
      {(()=>{
        const la=deriveLifeAreas(chart,aln);
        const LC={career:'#A0781C',love:'#8C3050',family:'#3E7850',health:'#2E6888'};
        const order=['career','love','family','health'];
        return(
          <div style={{marginBottom:18}}>
            <div onClick={()=>setLaOpen(v=>!v)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px',background:'var(--bgc)',border:'1px solid var(--bl)',borderRadius:laOpen?'14px 14px 0 0':14,cursor:'pointer'}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:13,color:'var(--gold)'}}>◫</span>
                <div className="tb" style={{fontSize:14,color:'var(--ink)'}}>Your frequency across life areas</div>
              </div>
              <span style={{color:'var(--dim)',fontSize:12,transform:laOpen?'rotate(180deg)':'none',transition:'transform .15s'}}>⌄</span>
            </div>
            {laOpen&&(
              <div>
                <div style={{display:'flex',justifyContent:'flex-end',padding:'10px 16px 0',background:'var(--bgc)',border:'1px solid var(--bl)',borderTop:'none'}}>
                  <div style={{fontFamily:'Fraunces,serif',fontSize:16,color:'var(--gold)'}}>{la.overall}<span style={{fontSize:11,color:'var(--mut)',fontFamily:'Inter,sans-serif'}}> aligned today</span></div>
                </div>
                <div className="card" style={{padding:'4px 16px',borderRadius:'0 0 14px 14px',borderTop:'none',marginTop:0}}>
                  {order.map((d,i)=><LifeAreaRow key={d} domain={d} data={la[d]} color={LC[d]} last={i===order.length-1}/>)}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* TODAY'S CHAKRA — was computed here already for the AI reading but never
          shown. Kept compact since the full Chakra Profile now lives in Blueprint. */}
      <div style={{background:ck.col+'18',border:`1px solid ${ck.col}32`,borderRadius:14,padding:'13px 15px',marginBottom:12,display:'flex',gap:12,alignItems:'flex-start'}}>
        <div style={{width:16,height:16,borderRadius:'50%',background:ck.col,opacity:.85,flexShrink:0,marginTop:2}}/>
        <div style={{flex:1}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
            <div className="tl">{ck.name} Chakra · Active Today</div>
            <div className="tc" style={{color:'var(--lun)'}}>{freq.hz} Hz</div>
          </div>
          <div className="tb" style={{fontSize:12,lineHeight:1.6,marginBottom:4}}>{ck.reason}</div>
          <WhyBtn text={`${ck.why} At the sound level, ${freq.hz} Hz (${freq.name}) is the frequency traditionally paired with this center: ${freq.desc}`}/>
        </div>
      </div>

      {/* SUGGESTED WORKING TEASER — the real thing lives in Practice; this just
          makes it visible from the page people actually open first. */}
      <div onClick={()=>onNavigate?.('practice')} className="sg" style={{padding:'14px 16px',marginBottom:16,cursor:'pointer'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
          <div className="tc" style={{color:'var(--gold)'}}>✦ Today's Suggested Working · {suggested.effortLabel} day</div>
          <span style={{color:'var(--gold)',fontSize:12}}>→</span>
        </div>
        <div className="td" style={{fontSize:16,marginBottom:2}}>{suggested.title}</div>
        <div className="tb" style={{fontSize:12,color:'var(--mut)'}}>Tap to open in Practice</div>
      </div>
    </div>
  );
}

function LifeAreaRow({domain,data,color,last}){
  const[open,setOpen]=useState(false);
  const hasMore=data.allReasons.length>1;
  return(
    <div style={{padding:'14px 0',borderBottom:last?'none':'1px solid var(--bl)'}}>
      <div onClick={()=>hasMore&&setOpen(v=>!v)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:hasMore?'pointer':'default'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:color}}/>
          <span style={{fontFamily:'Fraunces,serif',fontSize:16,color:'var(--ink)',textTransform:'capitalize'}}>{domain}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontFamily:'Inter,sans-serif',fontSize:15,color}}>{data.score}%</span>
          {hasMore&&<span style={{color:'var(--dim)',fontSize:12,transform:open?'rotate(180deg)':'none',transition:'transform .15s'}}>▾</span>}
        </div>
      </div>
      <div className="tb" style={{fontSize:12,color:'var(--mut)',marginTop:4,lineHeight:1.5}}>{data.note}</div>
      {open&&data.allReasons.length>1&&(
        <div style={{marginTop:8}}>{data.allReasons.slice(1).map((r,i)=><div key={i} className="tb" style={{fontSize:12,color:'var(--mut)',marginBottom:4}}>· {r}</div>)}</div>
      )}
      <div style={{marginTop:6}}><WhyBtn text={LIFE_AREA_WHY[domain]}/></div>
    </div>
  );
}

// ─── COMPATIBILITY ENGINE ─────────────────────────────────────────────────────
const EL_COMPAT={
  Fire:{Fire:{score:4,label:'Magnetic',desc:'Two fire signs burn bright together — passionate, inspiring, and energizing. The risk is that without someone to ground the flame, things escalate fast.'},Earth:{score:2,label:'Friction',desc:'Fire wants to move and Earth wants to hold. This pairing works when Fire respects Earth\'s pace and Earth allows Fire to stretch beyond the familiar.'},Air:{score:5,label:'Natural',desc:'Air feeds fire and fire warms air — this is one of the most natural elemental pairings. Ideas flow, energy stays high, and both feel genuinely seen.'},Water:{score:2,label:'Complex',desc:'Water can extinguish fire or create steam. This pairing holds deep creative potential but requires real work to navigate the tension between feeling and action.'}},
  Earth:{Earth:{score:4,label:'Solid',desc:'Two earth signs build real things together. Stable, reliable, and deeply productive. The risk is stagnation — someone needs to occasionally push past comfort.'},Air:{score:2,label:'Different',desc:'Earth wants tangible results; Air wants ideas. This pairing works when Earth grounds Air\'s vision and Air lifts Earth\'s perspective.'},Water:{score:5,label:'Natural',desc:'Earth and Water nourish each other — one provides structure, the other provides feeling. This is one of the most complementary pairings in elemental astrology.'},Fire:{score:2,label:'Friction',desc:'See Fire + Earth above.'}},
  Air:{Air:{score:4,label:'Electric',desc:'Two air signs understand each other\'s minds immediately. Conversation never stops. The risk is that neither one grounds the ideas into reality.'},Water:{score:2,label:'Different',desc:'Air thinks; Water feels. This pairing can be deeply complementary or deeply frustrating depending on whether both are willing to cross that bridge.'},Fire:{score:5,label:'Natural',desc:'See Fire + Air above.'},Earth:{score:2,label:'Different',desc:'See Earth + Air above.'}},
  Water:{Water:{score:4,label:'Deep',desc:'Two water signs feel everything together — profoundly empathic and deeply bonded. The risk is that without structure, emotions can overwhelm direction.'},Fire:{score:2,label:'Complex',desc:'See Fire + Water above.'},Earth:{score:5,label:'Natural',desc:'See Earth + Water above.'},Air:{score:2,label:'Different',desc:'See Air + Water above.'}},
};

// ─── REAL ASTROLOGICAL ASPECTS ──────────────────────────────────────────────────
// Traditional sign relationships, based on actual zodiacal angle — not just element
// matching. Each sign sits 30° apart on the wheel; the angle between two signs IS
// the aspect. This is the system that gives you genuine "opposite," "square" (the
// classic friction/secret-enemy axis), "trine" (same element, natural harmony), and
// "sextile" (supportive, different element) relationships — not an approximation.
const ASPECT_INFO={
  same:{label:'Conjunction · Same Sign',tier:'mirror',desc:'You share a sign. This is the deepest mirror in the zodiac — you understand each other\'s instincts immediately, strengths and shadow both doubled.',why:'Conjunction (0°) means standing in the exact same zodiacal position. In traditional astrology this is the most intense aspect — not inherently good or bad, but undeniably intensified. Same-sign relationships often feel like recognition at first and require real differentiation over time.'},
  opposite:{label:'Opposition · Polar Opposite',tier:'opposite',desc:'You sit directly across the zodiac wheel from each other — the classic "opposites attract" axis. What one of you has in abundance, the other often lacks, which can mean deep complementarity or a genuine pull-of-war depending on maturity.',why:'Opposition (180°) is one of the four major Ptolemaic aspects, traditionally considered the most polarizing — two signs facing each other across the wheel, often sharing a thematic axis (Aries/Libra is self vs. partnership, Taurus/Scorpio is value vs. transformation). Real attraction here is common because each person genuinely embodies what the other is working to develop in themselves.'},
  square:{label:'Square · Traditional Friction',tier:'square',desc:'You sit 90° apart — the aspect traditional astrology most associates with built-in tension. This is the closest thing the zodiac has to a "secret enemy" pairing: not automatically hostile, but the friction is real and structural, not incidental.',why:'The square (90°) is considered the most challenging of the four major Ptolemaic aspects — the angle most associated with internal conflict and growth-through-friction. Signs in square share a "quality" (cardinal, fixed, or mutable) but clash in element, which is why the tension feels less like simple difference and more like two people pulling in genuinely different directions on the same kind of effort. This is the aspect most folk traditions point to when naming a "difficult match."'},
  trine:{label:'Trine · Natural Harmony',tier:'trine',desc:'You sit 120° apart, sharing the same element — one of the most naturally easy aspects in the zodiac. Things tend to flow without much effort, for better and for worse — ease can also mean nothing pushes either of you to grow.',why:'The trine (120°) is the most harmonious of the four major Ptolemaic aspects — same-element signs that naturally understand each other\'s underlying language. It\'s considered traditionally lucky, though some astrologers note that trines can produce relationships so comfortable that neither person is challenged to develop further.'},
  sextile:{label:'Sextile · Supportive Effort',tier:'sextile',desc:'You sit 60° apart, in compatible but different elements — a supportive aspect that tends to require a little more conscious effort than a trine, but rewards it well.',why:'The sextile (60°) is considered a minor but genuinely beneficial aspect — compatible elements (fire-air or earth-water) that support each other without the effortless ease of a trine. Traditional astrology treats sextiles as opportunities that have to be actively taken, not automatic gifts.'},
  neutral:{label:'Semi-Sextile · Adjacent',tier:'neutral',desc:'You sit 30° apart, neighboring signs on the wheel with little natural overlap. Neither harmonious nor hostile — this pairing depends almost entirely on the rest of both charts.',why:'The semi-sextile (30°) is a minor aspect between adjacent signs, traditionally considered neither particularly easy nor particularly hard — more like strangers who happen to be standing next to each other than a meaningful relationship pattern on its own.'},
};
function getAspect(signA,signB){
  const idxA=SIGNS.indexOf(signA),idxB=SIGNS.indexOf(signB);
  if(idxA<0||idxB<0)return null;
  if(signA===signB)return'same';
  const diff=Math.abs(idxA-idxB);
  const angle=Math.min(diff,12-diff)*30; // shortest distance around the wheel, in degrees
  if(angle===180)return'opposite';
  if(angle===90)return'square';
  if(angle===120)return'trine';
  if(angle===60)return'sextile';
  return'neutral'; // 30° semi-sextile
}

const SIGN_COMPAT={
  Aries:{best:['Leo','Sagittarius','Gemini','Aquarius'],challenging:['Cancer','Capricorn'],neutral:['Libra']},
  Taurus:{best:['Virgo','Capricorn','Cancer','Pisces'],challenging:['Leo','Aquarius'],neutral:['Scorpio']},
  Gemini:{best:['Libra','Aquarius','Aries','Leo'],challenging:['Virgo','Pisces'],neutral:['Sagittarius']},
  Cancer:{best:['Scorpio','Pisces','Taurus','Virgo'],challenging:['Aries','Libra'],neutral:['Capricorn']},
  Leo:{best:['Aries','Sagittarius','Gemini','Libra'],challenging:['Taurus','Scorpio'],neutral:['Aquarius']},
  Virgo:{best:['Taurus','Capricorn','Cancer','Scorpio'],challenging:['Gemini','Sagittarius'],neutral:['Pisces']},
  Libra:{best:['Gemini','Aquarius','Leo','Sagittarius'],challenging:['Cancer','Capricorn'],neutral:['Aries']},
  Scorpio:{best:['Cancer','Pisces','Virgo','Capricorn'],challenging:['Leo','Aquarius'],neutral:['Taurus']},
  Sagittarius:{best:['Aries','Leo','Libra','Aquarius'],challenging:['Virgo','Pisces'],neutral:['Gemini']},
  Capricorn:{best:['Taurus','Virgo','Scorpio','Pisces'],challenging:['Aries','Libra'],neutral:['Cancer']},
  Aquarius:{best:['Gemini','Libra','Aries','Sagittarius'],challenging:['Taurus','Scorpio'],neutral:['Leo']},
  Pisces:{best:['Cancer','Scorpio','Taurus','Capricorn'],challenging:['Gemini','Sagittarius'],neutral:['Virgo']},
};

function getCompatScore(signA,signB){
  if(!signA||!signB)return null;
  const aspect=getAspect(signA,signB);
  const aspectData=ASPECT_INFO[aspect];
  if(signA===signB)return{score:3,label:'Mirror',desc:aspectData.desc,aspect,aspectLabel:aspectData.label,aspectWhy:aspectData.why};
  const elA=SD[signA]?.el,elB=SD[signB]?.el;
  const elScore=EL_COMPAT[elA]?.[elB];
  const sc=SIGN_COMPAT[signA];
  let signLabel='Neutral',signTier='neutral';
  if(sc?.best?.includes(signB)){signLabel='Harmonious';signTier='best';}
  else if(sc?.challenging?.includes(signB)){signLabel='Friction';signTier='challenging';}
  return{...elScore,signLabel,signTier,elA,elB,signA,signB,aspect,aspectLabel:aspectData?.label,aspectDesc:aspectData?.desc,aspectWhy:aspectData?.why,aspectTier:aspectData?.tier};}

function CompatibilitySection({chart,loc,savedRelationships,onSaveRelationship,onRemoveRelationship}){
  const[compName,setCompName]=useState('');
  const[compDob,setCompDob]=useState('');
  const[compMoon,setCompMoon]=useState('');
  const[compRising,setCompRising]=useState('');
  const[showSignEntry,setShowSignEntry]=useState(false);
  const[compResult,setCompResult]=useState(null);
  const[aiComp,setAiComp]=useState('');
  const[aiLoad,setAiLoad]=useState(false);
  const[aiCompError,setAiCompError]=useState(false);
  const[showCompare,setShowCompare]=useState(false);
  const[savedToast,setSavedToast]=useState(false);

  function saveRelationship(){
    if(!compResult||savedToast)return;
    onSaveRelationship({
      id:'rel-'+Date.now(),
      them:compResult.them,
      savedAt:new Date().toISOString(),
    });
    setSavedToast(true);
    setTimeout(()=>setSavedToast(false),2200);
  }

  // Your natural tendencies
  const sunEl=SD[chart.sun]?.el;
  const moonEl=SD[chart.moon]?.el;
  const riseEl=chart.rising?SD[chart.rising]?.el:null;
  const harm={'Fire':['Fire','Air'],'Earth':['Earth','Water'],'Air':['Air','Fire'],'Water':['Water','Earth']};
  const bestElements=harm[sunEl]||[];
  const allElements=['Fire','Earth','Air','Water'];
  const elColors={Fire:'#C05030',Earth:'#8A7040',Air:'#4070A0',Water:'#4858A0'};

  function buildAndCompare(){
    if(!compDob)return;
    const[y,m,d]=compDob.split('-').map(Number);
    const compSun=sSgn(m,d);
    const compLp=lpN(compDob);
    const compZh=chZ(y,m,d);
    let cMoon=compMoon||null,cMoonCertain=!!compMoon; // manually entered = certain
    if(!cMoon){const md=mFromD(compDob);if(md){cMoon=md.sign;cMoonCertain=md.certain;}}
    const them={name:compName||'Them',dob:compDob,sun:compSun,moon:cMoon,moonCertain:cMoonCertain,rising:compRising||null,lifePath:compLp,chinese:compZh};
    const sunComp=getCompatScore(chart.sun,compSun);
    const moonComp=(chart.moon&&cMoon)?getCompatScore(chart.moon,cMoon):null;
    const riseComp=(chart.rising&&compRising)?getCompatScore(chart.rising,compRising):null;
    const zhComp=getZhCompat(chart.chinese?.animal,compZh.animal);
    const lpHarm=[1,5,7].includes(Math.abs(chart.lifePath-compLp))||chart.lifePath===compLp;
    setCompResult({them,sunComp,moonComp,riseComp,zhComp,lpHarm});
    loadAiComp(chart,them,sunComp,moonComp,zhComp);
  }

  async function loadAiComp(me,them,sunC,moonC,zhC){
    setAiLoad(true);setAiComp('');setAiCompError(false);
    const prompt=`You are Unearthed. Write a compatibility reading between two people. Every sentence must be specific to their actual chart placements — never generic astrology.

Person 1: ${me.name} — ${me.sun} Sun · ${me.moon||'?'} Moon · ${me.rising||'?'} Rising · Life Path ${me.lifePath} · ${me.chinese?.full}
Person 2: ${them.name} — ${them.sun} Sun · ${them.moon||'?'} Moon · ${them.rising||'?'} Rising · Life Path ${them.lifePath} · ${them.chinese?.full}

Sun compatibility: ${sunC?.label} (${sunC?.elA} meets ${sunC?.elB})
Moon compatibility: ${moonC?.label||'unknown'}
Chinese Zodiac compatibility: ${zhC?.label||'unknown'} — ${zhC?.desc||''}

Write exactly 4 sentences:
1. What these two people fundamentally offer each other — based on their specific Sun signs.
2. How their emotional natures (Moon signs) interact — or what's unknown if Moon is missing.
3. The main point of friction or growth between them — honest, not alarming. You may draw from the Chinese Zodiac relationship (trine, clash, secret friend, or neutral) here if it adds something the Western signs don't already cover.
4. What makes this connection worth something specific to their charts.

Voice: warm, direct, specific. Written to ${me.name} about their connection with ${them.name}.`;
    try{
      if(!AI_ENABLED)throw new Error('AI disabled — running free/offline');
      const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:280,messages:[{role:'user',content:prompt}]})});
      if(!r.ok)throw new Error('API request failed');
      const data=await r.json();
      const text=(data.content?.map(b=>b.type==='text'?b.text:'').join('')||'').trim();
      if(!text)throw new Error('Empty response');
      setAiComp(text);
    }catch{
      setAiComp(`Your ${me.sun} energy and their ${them.sun} nature create a specific dynamic worth understanding. The ${sunC?.label?.toLowerCase()} quality between you means connection is ${sunC?.score>=4?'natural and self-reinforcing':'something you both have to consciously tend'}. The most productive thing you can do with this connection is understand what each of you is here to learn from the other.`);
      setAiCompError(true);
    }
    setAiLoad(false);
  }

  const ScoreBar=({score,label,color})=>(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <div className="tc">{label}</div>
        <div style={{fontFamily:'Inter',fontSize:9,color:score>=4?'var(--open)':score>=3?'var(--gold)':'var(--tens)'}}>{score>=4?'Harmonious':score>=3?'Workable':'Friction'}</div>
      </div>
      <div style={{height:5,borderRadius:3,background:'var(--bl)',overflow:'hidden'}}>
        <div style={{height:'100%',width:`${score*20}%`,borderRadius:3,background:score>=4?'var(--open)':score>=3?'var(--gold)':'var(--tens)',transition:'width .4s'}}/>
      </div>
    </div>
  );

  return(
    <div style={{marginBottom:12}}>
      <div className="sec"><div className="tl">Compatibility</div><div className="sl2"/></div>

      {/* PART 1 — Your natural tendencies */}
      <div className="portrait-block" style={{marginBottom:10}}>
        <div className="tl" style={{marginBottom:12}}>Your Relational Nature</div>

        {/* Element overview */}
        <div style={{marginBottom:14}}>
          <div className="tc" style={{marginBottom:8}}>Your elemental makeup</div>
          <div style={{display:'flex',gap:6}}>
            {[{label:'Sun',sign:chart.sun,el:sunEl},{label:'Moon',sign:chart.moon,el:moonEl},{label:'Rising',sign:chart.rising,el:riseEl}].map(({label,sign,el})=>(
              <div key={label} style={{flex:1,background:el?`${elColors[el]}18`:'var(--bgm)',border:`1px solid ${el?elColors[el]+'30':'var(--bl)'}`,borderRadius:10,padding:'10px 8px',textAlign:'center'}}>
                <div className="tc" style={{marginBottom:3}}>{label}</div>
                <div style={{fontFamily:'Fraunces,serif',fontSize:13,color:el?elColors[el]:'var(--dim)',fontWeight:300}}>{sign||'?'}</div>
                <div className="tc" style={{marginTop:2,color:el?elColors[el]:'var(--ghost)'}}>{el||'—'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Natural element affinities */}
        <div style={{marginBottom:14}}>
          <div className="tc" style={{marginBottom:8}}>Who you naturally harmonize with</div>
          <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:8}}>
            {SIGNS.map(s=>{const el=SD[s]?.el;const isHarm=bestElements.includes(el);const isSame=el===sunEl;return(
              <span key={s} style={{padding:'4px 10px',borderRadius:20,fontFamily:'Inter',fontSize:9,letterSpacing:'.06em',background:isSame?`${elColors[sunEl]}20`:isHarm?'var(--obg)':'var(--bgm)',border:`1px solid ${isSame?elColors[sunEl]+'40':isHarm?'var(--obdr)':'var(--bl)'}`,color:isSame?elColors[sunEl]:isHarm?'var(--open)':'var(--dim)'}}>{s}</span>
            );})}
          </div>
          <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.7}}>
            {`Your ${chart.sun} Sun (${sunEl}) naturally harmonizes with ${bestElements.join(' and ')} signs. ${chart.moon&&moonEl?`Your ${chart.moon} Moon (${moonEl}) adds ${harm[moonEl]?.join(' and ')} affinity to your relational palette.`:''} This doesn't mean other combinations don't work — it means these tend to feel easiest.`}
          </div>
          <WhyBtn text={`Elemental compatibility is one of the oldest systems in astrology. Fire and Air feed each other; Earth and Water nourish each other. Signs of the same element deeply understand each other's core nature but can also amplify each other's blind spots. Opposite elements (Fire/Water, Earth/Air) create friction that is often the source of the most transformative connections — challenging but generative. There's no "incompatible" pairing, only different levels of ease and different lessons.`}/>
        </div>

        {/* How you show up in relationships */}
        <div>
          <div className="tc" style={{marginBottom:8}}>How you show up in connection</div>
          <div className="tb" style={{fontSize:13,lineHeight:1.8,marginBottom:6}}>
            {`Your ${chart.sun} Sun brings ${SD[chart.sun]?.desc?.split('.')[0]?.toLowerCase()} to relationships — that's your core offering. ${chart.moon?`Your ${chart.moon} Moon is how you need to be loved: ${SD[chart.moon]?.el==='Earth'?'through consistency, reliability, and practical presence':SD[chart.moon]?.el==='Water'?'through emotional depth, empathy, and genuine feeling':SD[chart.moon]?.el==='Fire'?'through passion, aliveness, and being truly seen':' through intellectual connection, space to breathe, and honest communication'}.`:'Add your Moon sign to understand how you need to be loved.'} ${chart.rising?`Your ${chart.rising} Rising is the first impression — people meet ${SD[chart.rising]?.desc?.split('.')[0]?.toLowerCase()} before they meet the rest of you.`:''}`}
          </div>
          {chart.moon&&(
            <div style={{padding:'10px 12px',background:harm[sunEl]?.includes(moonEl)?'var(--obg)':'var(--tbg)',border:`1px solid ${harm[sunEl]?.includes(moonEl)?'var(--obdr)':'var(--tbdr)'}`,borderRadius:10}}>
              <div className="tc" style={{marginBottom:3,color:harm[sunEl]?.includes(moonEl)?'var(--open)':'var(--tens)'}}>
                {harm[sunEl]?.includes(moonEl)?'Your Sun and Moon harmonize':'Your Sun and Moon are in tension'}
              </div>
              <div className="tb" style={{fontSize:12,lineHeight:1.7}}>
                {harm[sunEl]?.includes(moonEl)
                  ?`Your ${chart.sun} Sun (${sunEl}) and ${chart.moon} Moon (${moonEl}) are in elemental alignment. What you consciously want and what you emotionally need tend to point in the same direction — this creates unusual consistency in how you show up for others.`
                  :`Your ${chart.sun} Sun (${sunEl}) and ${chart.moon} Moon (${moonEl}) pull in different elemental directions. You may find yourself wanting one thing consciously while feeling another emotionally. In relationship, this can show up as inconsistency that confuses people who care about you — even when you're being genuine.`}
              </div>
            </div>
          )}
        </div>

        {/* Traditional aspect map — real named relationships, not just elemental affinity */}
        <div style={{marginTop:14}}>
          <div className="tc" style={{marginBottom:8}}>Your traditional sign relationships</div>
          <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.6,marginBottom:10}}>From your {chart.sun} Sun — the real named aspects, not just shared elements.</div>
          {(()=>{
            const groups={opposite:[],square:[],trine:[],sextile:[]};
            SIGNS.forEach(s=>{if(s===chart.sun)return;const asp=getAspect(chart.sun,s);if(groups[asp])groups[asp].push(s);});
            const rows=[
              {key:'trine',label:'Trine — natural harmony',tier:'trine',col:'var(--open)',bg:'var(--obg)',bdr:'var(--obdr)'},
              {key:'sextile',label:'Sextile — supportive effort',tier:'sextile',col:'var(--gold)',bg:'var(--gbg)',bdr:'var(--gbdr)'},
              {key:'opposite',label:'Opposition — polar pull',tier:'opposite',col:'var(--lun)',bg:'var(--lbg)',bdr:'var(--lbdr)'},
              {key:'square',label:'Square — traditional friction',tier:'square',col:'var(--avoid)',bg:'var(--abg)',bdr:'var(--abdr)'},
            ];
            return rows.map(r=>(
              <div key={r.key} style={{marginBottom:8}}>
                <div className="tc" style={{marginBottom:4,color:r.col}}>{r.label}</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                  {groups[r.key].map(s=><span key={s} style={{background:r.bg,border:`1px solid ${r.bdr}`,borderRadius:20,padding:'4px 10px',color:r.col,fontFamily:'Inter',fontSize:10}}>{s}</span>)}
                </div>
              </div>
            ));
          })()}
          <WhyBtn text="Every sign relationship on the wheel falls into one of a handful of traditional aspects based on the actual angle between them. Trines (120°, same element) are the easiest — natural harmony with little friction. Sextiles (60°) are supportive but take a little effort. Oppositions (180°) sit directly across from your sign — the classic complementary-opposites axis, often deeply attractive precisely because the other person embodies what you're developing in yourself. Squares (90°) are traditionally the most challenging aspect — same quality (cardinal, fixed, or mutable) but clashing elements, which is why the friction feels structural rather than incidental. This is the closest thing astrology has to a 'difficult match' built into the wheel itself, distinct from generic personality clash."/>
        </div>
      </div>

      {/* PART 2 — Compare with someone */}
      <div className="portrait-block" style={{marginBottom:10}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <div className="tl">Compare with Someone</div>
          {compResult&&<button onClick={()=>{setCompResult(null);setAiComp('');setCompName('');setCompDob('');setCompMoon('');setCompRising('');}} style={{background:'none',border:'none',color:'var(--dim)',fontFamily:'Inter',fontSize:9,letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer'}}>Clear ✕</button>}
        </div>

        {!compResult?(
          <div>
            <div style={{marginBottom:10}}>
              <div className="tc" style={{marginBottom:6}}>Their name (optional)</div>
              <input className="fld" style={{fontSize:13,marginBottom:10}} placeholder="Name…" value={compName} onChange={e=>setCompName(e.target.value)}/>
              <div className="tc" style={{marginBottom:6}}>Their date of birth</div>
              <input className="fld" type="date" value={compDob} onChange={e=>setCompDob(e.target.value)}/>
            </div>

            {compDob&&(()=>{try{const[y,m,d]=compDob.split('-').map(Number);const s=sSgn(m,d),lp=lpN(compDob),zh=chZ(y,m,d);return(<div style={{display:'flex',gap:6,marginBottom:10}}>{[['Sun',s,'var(--gold)'],['LP',String(lp),'var(--open)'],['Chinese',zh.emoji,'var(--ink)']].map(([l,v,c])=><div key={l} className="card" style={{flex:1,padding:'10px',textAlign:'center'}}><div className="tc" style={{marginBottom:3}}>{l}</div><div className="td" style={{fontSize:l==='Chinese'?18:14,color:c}}>{v}</div></div>)}</div>);}catch{return null;}})()}

            <button onClick={()=>setShowSignEntry(v=>!v)} className="bg" style={{marginBottom:8,fontSize:10}}>{showSignEntry?'▼ Hide sign entry':'▶ I know their signs'}</button>
            {showSignEntry&&(
              <div style={{marginBottom:10}}>
                {[['Moon',compMoon,setCompMoon],['Rising',compRising,setCompRising]].map(([l,v,s])=>(
                  <div key={l} style={{marginBottom:10}}>
                    <div className="tc" style={{marginBottom:6}}>Their {l}</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:4}}>{SIGNS.map(sg=><button key={sg} className={`chip ${v===sg?'on':''}`} onClick={()=>s(v===sg?'':sg)} style={{fontSize:8,padding:'4px 10px'}}>{sg}</button>)}</div>
                  </div>
                ))}
              </div>
            )}
            <button className="bp" style={{opacity:compDob?1:.35}} disabled={!compDob} onClick={buildAndCompare}>
              Compare ✦
            </button>
          </div>
        ):(
          <div>
            {/* Header */}
            <div style={{display:'flex',gap:10,alignItems:'center',padding:'12px 14px',background:'var(--bgm)',borderRadius:12,border:'1px solid var(--bl)',marginBottom:8}}>
              <div style={{flex:1}}>
                <div className="tc" style={{marginBottom:2}}>{chart.name}</div>
                <div style={{fontFamily:'Inter',fontSize:11,color:'var(--ink)'}}>{chart.sun} · {chart.moon||'?'}{chart.moon&&chart.moonCertain===false?'*':''} · {chart.rising||'?'}{chart.rising&&chart.riseApprox?'*':''}</div>
              </div>
              <div style={{color:'var(--gold)',fontFamily:'Fraunces,serif',fontSize:18,fontWeight:300}}>✦</div>
              <div style={{flex:1,textAlign:'right'}}>
                <div className="tc" style={{marginBottom:2}}>{compResult.them.name}</div>
                <div style={{fontFamily:'Inter',fontSize:11,color:'var(--ink)'}}>{compResult.them.sun} · {compResult.them.moon||'?'}{compResult.them.moon&&compResult.them.moonCertain===false?'*':''} · {compResult.them.rising||'?'}</div>
              </div>
            </div>
            {((chart.moon&&chart.moonCertain===false)||(compResult.them.moon&&compResult.them.moonCertain===false)||!chart.rising||!compResult.them.rising)&&(
              <div style={{background:'var(--tbg)',border:'1px solid var(--tbdr)',borderRadius:10,padding:'9px 12px',marginBottom:12}}>
                <div className="tb" style={{fontSize:11,color:'var(--tens)',lineHeight:1.6}}>
                  {[
                    (chart.moon&&chart.moonCertain===false)||(compResult.them.moon&&compResult.them.moonCertain===false)?'* Moon sign is a best estimate from birth date alone — add birth time for certainty.':null,
                    !chart.rising||!compResult.them.rising?'Rising sign comparison isn\'t available without birth time + city for both people.':null,
                  ].filter(Boolean).join(' ')}
                </div>
              </div>
            )}

            {/* AI reading */}
            {(aiLoad||aiComp)&&(
              <div className="hero" style={{marginBottom:12}}>
                <div className="tc" style={{color:'#C8A84070',marginBottom:10}}>Reading · {chart.name} & {compResult.them.name}</div>
                {aiLoad?(
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span className="sp" style={{fontSize:12,color:'var(--gbr)'}}>✦</span>
                    <div style={{fontFamily:'Spectral,serif',fontSize:13,color:'#8A7050',fontStyle:'italic'}}>Reading your connection…</div>
                  </div>
                ):(
                  <div style={{fontFamily:'Spectral,serif',fontSize:14,lineHeight:1.85,color:'#EDE4CC'}}>{aiComp}</div>
                )}
                {aiCompError&&!aiLoad&&(
                  <div style={{marginTop:10,display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
                    <div style={{fontFamily:'Inter',fontSize:10,color:'#C09060'}}>Couldn't reach the full reading — showing a simpler version.</div>
                    <button onClick={()=>loadAiComp(chart,compResult.them,compResult.sunComp,compResult.moonComp,compResult.zhComp)} style={{background:'none',border:'none',color:'#C09060',fontFamily:'Inter',fontSize:9,letterSpacing:'.06em',textTransform:'uppercase',cursor:'pointer',flexShrink:0}}>Retry</button>
                  </div>
                )}
              </div>
            )}

            {/* Score breakdown */}
            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:12}}>
              {compResult.sunComp&&(
                <div style={{padding:'12px 14px',background:'var(--bgm)',borderRadius:12,border:'1px solid var(--bl)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                    <div><div className="tc" style={{marginBottom:2}}>Sun · {chart.sun} meets {compResult.them.sun}</div><div style={{fontFamily:'Inter',fontSize:11,color:compResult.sunComp.score>=4?'var(--open)':compResult.sunComp.score>=3?'var(--gold)':'var(--tens)',fontWeight:500}}>{compResult.sunComp.label}</div></div>
                    <div style={{display:'flex',gap:4}}>{[1,2,3,4,5].map(i=><div key={i} style={{width:8,height:8,borderRadius:'50%',background:i<=compResult.sunComp.score?compResult.sunComp.score>=4?'var(--open)':compResult.sunComp.score>=3?'var(--gold)':'var(--tens)':'var(--bl)'}}/>)}</div>
                  </div>
                  <div className="tb" style={{fontSize:12,lineHeight:1.7,marginBottom:compResult.sunComp.aspectLabel?8:0}}>{compResult.sunComp.desc}</div>
                  {compResult.sunComp.aspectLabel&&(
                    <div style={{background:compResult.sunComp.aspectTier==='square'?'var(--abg)':compResult.sunComp.aspectTier==='trine'?'var(--obg)':compResult.sunComp.aspectTier==='opposite'?'var(--lbg)':'var(--bgc)',border:`1px solid ${compResult.sunComp.aspectTier==='square'?'var(--abdr)':compResult.sunComp.aspectTier==='trine'?'var(--obdr)':compResult.sunComp.aspectTier==='opposite'?'var(--lbdr)':'var(--bl)'}`,borderRadius:10,padding:'9px 11px'}}>
                      <div className="tc" style={{marginBottom:3,color:compResult.sunComp.aspectTier==='square'?'var(--avoid)':compResult.sunComp.aspectTier==='trine'?'var(--open)':compResult.sunComp.aspectTier==='opposite'?'var(--lun)':'var(--mut)'}}>{compResult.sunComp.aspectLabel}</div>
                      <div className="tb" style={{fontSize:11,lineHeight:1.6,marginBottom:6}}>{compResult.sunComp.aspectDesc}</div>
                      <WhyBtn text={compResult.sunComp.aspectWhy}/>
                    </div>
                  )}
                </div>
              )}
              {compResult.moonComp&&(
                <div style={{padding:'12px 14px',background:'var(--bgm)',borderRadius:12,border:'1px solid var(--bl)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                    <div><div className="tc" style={{marginBottom:2}}>Moon · {chart.moon}{chart.moonCertain===false?'*':''} meets {compResult.them.moon}{compResult.them.moonCertain===false?'*':''}</div><div style={{fontFamily:'Inter',fontSize:11,color:compResult.moonComp.score>=4?'var(--open)':compResult.moonComp.score>=3?'var(--gold)':'var(--tens)',fontWeight:500}}>{compResult.moonComp.label}</div></div>
                    <div style={{display:'flex',gap:4}}>{[1,2,3,4,5].map(i=><div key={i} style={{width:8,height:8,borderRadius:'50%',background:i<=compResult.moonComp.score?compResult.moonComp.score>=4?'var(--open)':compResult.moonComp.score>=3?'var(--gold)':'var(--tens)':'var(--bl)'}}/>)}</div>
                  </div>
                  <div className="tb" style={{fontSize:12,lineHeight:1.7}}>{compResult.moonComp.desc}</div>
                  {(chart.moonCertain===false||compResult.them.moonCertain===false)&&<div className="tc" style={{marginTop:6,color:'var(--tens)'}}>* Estimated from birth date — add birth time for a confirmed Moon sign</div>}
                </div>
              )}
              {compResult.riseComp&&(
                <div style={{padding:'12px 14px',background:'var(--bgm)',borderRadius:12,border:'1px solid var(--bl)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                    <div><div className="tc" style={{marginBottom:2}}>Rising · {chart.rising} meets {compResult.them.rising}</div><div style={{fontFamily:'Inter',fontSize:11,color:compResult.riseComp.score>=4?'var(--open)':compResult.riseComp.score>=3?'var(--gold)':'var(--tens)',fontWeight:500}}>{compResult.riseComp.label}</div></div>
                    <div style={{display:'flex',gap:4}}>{[1,2,3,4,5].map(i=><div key={i} style={{width:8,height:8,borderRadius:'50%',background:i<=compResult.riseComp.score?compResult.riseComp.score>=4?'var(--open)':compResult.riseComp.score>=3?'var(--gold)':'var(--tens)':'var(--bl)'}}/>)}</div>
                  </div>
                  <div className="tb" style={{fontSize:12,lineHeight:1.7}}>{compResult.riseComp.desc}</div>
                </div>
              )}
              {compResult.zhComp&&(
                <div style={{padding:'12px 14px',background:'var(--bgm)',borderRadius:12,border:'1px solid var(--bl)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                    <div>
                      <div className="tc" style={{marginBottom:2}}>Chinese Zodiac · {chart.chinese?.emoji} {chart.chinese?.animal} meets {compResult.them.chinese?.emoji} {compResult.them.chinese?.animal}</div>
                      <div style={{fontFamily:'Inter',fontSize:11,fontWeight:500,color:compResult.zhComp.tier==='trine'?'var(--open)':compResult.zhComp.tier==='friend'?'var(--open)':compResult.zhComp.tier==='clash'?'var(--avoid)':compResult.zhComp.tier==='mirror'?'var(--lun)':'var(--mut)'}}>{compResult.zhComp.label}</div>
                    </div>
                    <span className={`tag ${compResult.zhComp.tier==='trine'||compResult.zhComp.tier==='friend'?'to':compResult.zhComp.tier==='clash'?'tav':'tnot'}`} style={{flexShrink:0}}>{compResult.zhComp.tier==='trine'?'Harmony':compResult.zhComp.tier==='friend'?'Friend':compResult.zhComp.tier==='clash'?'Clash':compResult.zhComp.tier==='mirror'?'Mirror':'Neutral'}</span>
                  </div>
                  <div className="tb" style={{fontSize:12,lineHeight:1.7}}>{compResult.zhComp.desc}</div>
                </div>
              )}
              <div style={{padding:'12px 14px',background:'var(--bgm)',borderRadius:12,border:'1px solid var(--bl)'}}>
                <div className="tc" style={{marginBottom:4}}>Life Path · {chart.lifePath} meets {compResult.them.lifePath}</div>
                <div className="tb" style={{fontSize:12,lineHeight:1.7}}>{compResult.lpHarm?`Life Path ${chart.lifePath} and ${compResult.them.lifePath} carry complementary energy — your larger purposes support rather than compete with each other.`:`Life Path ${chart.lifePath} and ${compResult.them.lifePath} are on different missions. This isn't incompatibility — it's two people who can broaden each other's world if they choose to.`}</div>
              </div>
            </div>

            <button className="bp" style={{opacity:savedToast?.6:1}} disabled={!!savedToast} onClick={saveRelationship}>
              {savedToast?'Saved ✓':'Save This Relationship'}
            </button>
            <div className="tc" style={{textAlign:'center',color:'var(--dim)',marginTop:8}}>{savedToast?'Find it below — it updates daily':'Or just compare another anytime'}</div>
          </div>
        )}
      </div>

      {/* PART 3 — Saved Relationships, re-derived daily */}
      {savedRelationships&&savedRelationships.length>0&&(
        <div className="portrait-block" style={{marginBottom:10}}>
          <div className="tl" style={{marginBottom:4}}>Saved Relationships</div>
          <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.6,marginBottom:14}}>Their static compatibility doesn't change — but how your two charts align TODAY does. This recalculates every day.</div>
          {savedRelationships.map(rel=>{
            const them=rel.them;
            const todayAln=them.sun?buildAlign(them,new Date(),loc):null;
            const myAln=buildAlign(chart,new Date(),loc);
            const bothOpen=myAln.tier==='open'&&todayAln?.tier==='open';
            const eitherAvoid=myAln.tier==='avoid'||todayAln?.tier==='avoid';
            const relTier=eitherAvoid?'avoid':bothOpen?'open':'tens';
            const relCol={open:'var(--open)',tens:'var(--tens)',avoid:'var(--avoid)'}[relTier];
            const relBg={open:'var(--obg)',tens:'var(--tbg)',avoid:'var(--abg)'}[relTier];
            const relBdr={open:'var(--obdr)',tens:'var(--tbdr)',avoid:'var(--abdr)'}[relTier];
            const relLabel={open:'Both open today',tens:'Mixed signals today',avoid:'One of you needs care today'}[relTier];
            return(
              <div key={rel.id} style={{background:relBg,border:`1px solid ${relBdr}`,borderRadius:12,padding:'12px 14px',marginBottom:8}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                  <div style={{fontFamily:'Inter',fontSize:12,color:'var(--ink)',fontWeight:500}}>{them.name}</div>
                  <button onClick={()=>{if(confirm(`Remove ${them.name} from saved relationships?`))onRemoveRelationship(rel.id);}} style={{background:'none',border:'none',color:'var(--dim)',fontSize:14,cursor:'pointer',padding:0}}>✕</button>
                </div>
                <div className="tc" style={{marginBottom:6}}>{them.sun} · {them.moon||'?'} · {them.rising||'?'} · {them.chinese?.full}</div>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                  <span style={{width:7,height:7,borderRadius:'50%',background:relCol,flexShrink:0}}/>
                  <div style={{fontFamily:'Inter',fontSize:11,color:relCol,fontWeight:500}}>{relLabel}</div>
                </div>
                <div className="tb" style={{fontSize:12,lineHeight:1.6}}>
                  {relTier==='open'?`You're both in an open window today — a good day to connect, start something together, or have the conversation you've been putting off.`
                    :relTier==='avoid'?`One of you is in close-the-door territory today. Not a great day to force anything important between you — give it space.`
                    :`Your energies are asking different things of you today. Not bad — just worth being aware of before you assume you're both starting from the same place.`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── BLUEPRINT PAGE ───────────────────────────────────────────────────────────
function BlueprintPage({chart,codexEntries,loc,savedRelationships,onSaveRelationship,onRemoveRelationship,onUpdate}){
  const[showEdit,setShowEdit]=useState(false);
  const[showReset,setShowReset]=useState(false);
  const[bTab,setBTab]=useState('chart');
  const[eSun,setESun]=useState(chart.sun||'');
  const[eMoon,setEMoon]=useState(chart.moon||'');
  const[eRise,setERise]=useState(chart.rising||'');
  const[narrLoad,setNarrLoad]=useState(false);
  const[narrError,setNarrError]=useState(false);
  const today=new Date();
  const py=pY(chart.dob,today.getFullYear()),pm=pM(py,today.getMonth()+1),pd=pD(pm,today.getDate());
  const bdn=bdN(chart.dob);
  const hdT=useMemo(()=>deriveHD(chart),[chart]),hdD=HDT[hdT];
  const hdAuth=useMemo(()=>deriveHDAuthority(chart,hdT),[chart,hdT]),hdAuthD=hdAuth?HD_AUTHORITY[hdAuth]:null;
  const seph=useMemo(()=>gSeph(chart),[chart]);
  const[y,m,d]=chart.dob.split('-').map(Number);
  const zh=chart.chinese||chZ(y,m,d);
  const sunD=SD[chart.sun],moonD=SD[chart.moon],riseD=SD[chart.rising];
  const completeness=useMemo(()=>chartCompleteness(chart),[chart]);
  function saveEdits(){const u={};if(eSun&&eSun!==chart.sun)u.sun=eSun;if(eMoon!==chart.moon)u.moon=eMoon||null;if(eRise!==chart.rising)u.rising=eRise||null;if(Object.keys(u).length)onUpdate(u);setShowEdit(false);}

  // The natal narrative is generated once and cached on the chart object itself —
  // a real multi-paragraph horoscope-style portrait, not a daily reading. Only
  // regenerates if missing or the user explicitly requests a refresh.
  async function generateNarrative(){
    setNarrLoad(true);setNarrError(false);
    const moonLine=completeness.hasMoon?`${chart.moon} Moon${completeness.moonConfirmed?'':' (estimated from birth date)'}`:'Moon sign unknown';
    const risingLine=completeness.hasRising?`${chart.rising} Rising`:'Rising sign unknown';
    const completenessNote=completeness.isFullChart?'':`This person hasn't provided ${completeness.missingParts.join(' and ')}. Do not invent or imply certainty about any placement marked unknown — write a rich portrait using only what is genuinely known.`;
    const prompt=`You are Unearthed, writing a genuine natal portrait — the kind of multi-paragraph personalized horoscope description a skilled astrologer would write for a real client, not a daily reading. This is written once, to be read and re-read, not regenerated daily.

Their full blueprint:
Sun: ${chart.sun} (${sunD?.el}) — ${sunD?.desc}
Moon: ${moonLine}${moonD?` (${moonD.el}) — ${moonD.desc}`:''}
Rising: ${risingLine}${riseD?` (${riseD.el}) — ${riseD.desc}`:''}
Life Path ${chart.lifePath} · Chinese Zodiac: ${zh.full} · Human Design: ${hdT} (strategy: ${hdD?.strategy}, authority: ${hdAuth||'unknown'})
Tree of Life: ${seph.primary?.name} (from Life Path), ${seph.secondary?.name} (from Sun)
${completenessNote}

Write a genuine character portrait in 4 short paragraphs (roughly 220 words total):
1. Who this person fundamentally is — synthesize Sun, Moon (if known), and Rising (if known) into one coherent picture, not three separate facts. Show how these placements interact, not just list them.
2. Their core gift — the thing they do better than almost anyone, drawing on Life Path, Human Design, and their chart together.
3. Their honest growth edge — the shadow side, named with compassion, not alarm. What pattern do they need to watch for?
4. A closing line that captures their essence in a way that feels genuinely earned from everything above — not generic encouragement.

Voice: warm, perceptive, like a gifted astrologer who has actually studied this person's chart, not a horoscope column. Never say "as a [sign]" — always "your [sign] Sun/Moon/Rising means."`;
    try{
      if(!AI_ENABLED)throw new Error('AI disabled — running free/offline');
      const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:500,messages:[{role:'user',content:prompt}]})});
      if(!r.ok)throw new Error('API request failed');
      const data=await r.json();
      const text=(data.content?.map(b=>b.type==='text'?b.text:'').join('')||'').trim();
      if(!text)throw new Error('Empty response');
      onUpdate({natalNarrative:text});
    }catch{
      setNarrError(true);
      onUpdate({natalNarrative:`Your ${chart.sun} Sun${moonD?` and ${chart.moon} Moon`:''} create a foundation built on ${sunD?.desc?.split('.')[0]?.toLowerCase()}. Life Path ${chart.lifePath} adds a deeper current — the sense that you're here to do something specific, not just pass through. Your gift shows up most clearly when you stop second-guessing what already comes naturally to you. The growth edge is learning that the same trait that makes you effective can, unchecked, become the thing that holds you back. You are, in the end, someone who is still becoming — and that's not a flaw in the design, it's the whole point of it.`});
    }
    setNarrLoad(false);
  }

  useEffect(()=>{if(!chart.natalNarrative&&!narrLoad)generateNarrative();},[]);

  const LP_THEME=[,'The Originator','The Bridge','The Creator','The Architect','The Liberator','The Keeper','The Seeker','The Manifestor','The Sage','','The Illuminator','','','','','','','','','','','The Master Builder'];

  return(
    <div className="scr ent" style={{padding:'20px 16px 0'}}>

      {/* PORTRAIT HEADER */}
      <div style={{marginBottom:20}}>
        <div className="tc" style={{marginBottom:4}}>{chart.name} · Your Blueprint</div>
        <div className="td" style={{fontSize:24,marginBottom:6}}>{chart.sun} · {chart.moon||'?'}{chart.moon&&chart.moonCertain===false?'*':''} · {chart.rising||'?'}{chart.rising&&chart.riseApprox?'*':''}</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
          <span className="tag tg">LP {chart.lifePath}</span>
          <span className="tag" style={{background:'var(--bgm)',color:'var(--mut)',border:'1px solid var(--bl)'}}>{zh.full}</span>
          <span className="tag tlu">{hdT}</span>
        </div>
        <div className="tc">{chart.dob}{chart.birthPlace?` · ${chart.birthPlace}`:''}</div>
      </div>

      {/* NATAL NARRATIVE — a genuine horoscope-style portrait, written once, not re-rolled daily */}
      <div className="hero" style={{marginBottom:16}}>
        <div className="tc" style={{color:'#C8A84070',marginBottom:12}}>Your portrait · {chart.name}</div>
        {narrLoad?(
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0'}}>
            <span className="sp" style={{fontSize:14,color:'var(--gbr)'}}>✦</span>
            <div style={{fontFamily:'Spectral,serif',fontSize:13,color:'#8A7050',fontStyle:'italic'}}>Writing your portrait…</div>
          </div>
        ):(
          <div style={{fontFamily:'Spectral,serif',fontSize:14,lineHeight:1.95,color:'#EDE4CC',whiteSpace:'pre-line'}}>{chart.natalNarrative}</div>
        )}
        {narrError&&!narrLoad&&<div style={{marginTop:10,fontFamily:'Inter',fontSize:10,color:'#C09060'}}>Couldn't reach your full portrait — showing a simpler version.</div>}
        {!narrLoad&&<button onClick={generateNarrative} style={{marginTop:14,background:'none',border:'none',color:'#6E5A30',fontFamily:'Inter',fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',cursor:'pointer',padding:0}}>Rewrite ↺</button>}
      </div>

      {/* WHAT WE'RE LEARNING — real correlation from actual Practice/Codex use,
          not the static chart. This is what makes the app get more accurate
          over time instead of staying frozen at onboarding. */}
      {(()=>{
        const learning=buildCodexInsights(codexEntries);
        if(learning.sampleSize===0)return null; // no Codex activity yet — don't show an empty promise
        return(
          <div className="sl" style={{padding:'16px',marginBottom:12}}>
            <div className="tl" style={{color:'var(--lun)',marginBottom:4}}>What We're Learning About You</div>
            <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.6,marginBottom:12}}>This isn't your chart — it's what's actually happened when you've used Practice. It gets more accurate the more you log.</div>
            {learning.ready&&learning.insights.length>0?(
              learning.insights.map((ins,i)=>(
                <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',marginBottom:i<learning.insights.length-1?10:0}}>
                  <span style={{color:'var(--lun)',fontSize:12,marginTop:1}}>✦</span>
                  <div style={{flex:1}}>
                    <div className="tb" style={{fontSize:13,lineHeight:1.65}}>{ins.text}</div>
                    <div className="tc" style={{marginTop:2,color:ins.confidence==='strong'?'var(--open)':'var(--tens)'}}>{ins.confidence==='strong'?'Strong signal':'Early signal — keep logging to confirm'}</div>
                  </div>
                </div>
              ))
            ):(
              <div className="tb" style={{fontSize:12,color:'var(--dim)'}}>{PATTERN_MIN_SAMPLES-learning.sampleSize>0?`${PATTERN_MIN_SAMPLES-learning.sampleSize} more logged ${PATTERN_MIN_SAMPLES-learning.sampleSize===1?'entry':'entries'} before real patterns can emerge.`:'No strong pattern yet — your results so far look close to your overall average across conditions.'}</div>
            )}
          </div>
        );
      })()}

      <div style={{display:'flex',gap:5,marginBottom:16,overflowX:'auto',paddingBottom:2}}>
        {[['chart','Chart'],['numbers','Numbers'],['design','Design'],['zodiac','Zodiac'],['tree','Tree'],['compat','Compat']].map(([k,l])=>(
          <button key={k} className={`chip ${bTab===k?'on':''}`} style={{fontSize:9,whiteSpace:'nowrap'}} onClick={()=>setBTab(k)}>{l}</button>
        ))}
      </div>

      {/* WHO YOU ARE — coherent portrait */}
      {bTab==='chart'&&(<>
      <div className="portrait-block" style={{marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div className="tl">Who You Are</div>
          <button onClick={()=>{setESun(chart.sun);setEMoon(chart.moon||'');setERise(chart.rising||'');setShowEdit(true);}} style={{background:'var(--bgm)',border:'1px solid var(--bm)',borderRadius:8,color:'var(--mut)',fontFamily:'Inter',fontSize:9,letterSpacing:'.08em',textTransform:'uppercase',padding:'6px 12px',cursor:'pointer'}}>Edit Signs</button>
        </div>

        {/* Sun */}
        <div className="portrait-row">
          <div style={{minWidth:48}}>
            <div className="tc" style={{marginBottom:2}}>Sun</div>
            <div style={{fontFamily:'Fraunces,serif',fontSize:15,color:'var(--gold)',fontWeight:300}}>{chart.sun}</div>
            <div className="tc" style={{marginTop:2}}>{sunD?.el}</div>
          </div>
          <div style={{flex:1,paddingLeft:12}}>
            <div className="tb" style={{fontSize:14,lineHeight:1.7,marginBottom:4}}>{sunD?.desc}</div>
            <div className="tb" style={{fontSize:12,color:'var(--dim)',fontStyle:'italic',marginBottom:6}}>Shadow: {sunD?.shadow}</div>
            <WhyBtn text={sunD?.why}/>
          </div>
        </div>

        {/* Moon */}
        <div className="portrait-row">
          <div style={{minWidth:48}}>
            <div className="tc" style={{marginBottom:2}}>Moon</div>
            <div style={{fontFamily:'Fraunces,serif',fontSize:15,color:'var(--lun)',fontWeight:300}}>{chart.moon||'?'}</div>
            <div className="tc" style={{marginTop:2}}>{moonD?.el||'—'}</div>
          </div>
          <div style={{flex:1,paddingLeft:12}}>
            {moonD?(
              <>
                {!chart.moonCertain&&!chart.moonOk&&(
                  <div style={{background:'var(--tbg)',border:'1px solid var(--tbdr)',borderRadius:8,padding:'6px 10px',marginBottom:8}}>
                    <div className="tc" style={{color:'var(--tens)'}}>Likely — moon was in {chart.moon} for most of your birth date. Add birth time to confirm.</div>
                  </div>
                )}
                <div className="tb" style={{fontSize:14,lineHeight:1.7,marginBottom:4}}>Your emotional body. {moonD.desc}</div>
                <div className="tb" style={{fontSize:12,color:'var(--dim)',fontStyle:'italic',marginBottom:6}}>Shadow: {moonD.shadow}</div>
                <WhyBtn text={`The Moon governs your emotional life, your instincts, and your inner landscape — the parts of you that existed before you had words for them. Your ${chart.moon} Moon is how you feel, how you need to be nurtured, and what makes you feel safe. ${moonD.why}`}/>
              </>
            ):(
              <div className="tb" style={{fontSize:13,color:'var(--ghost)'}}>Your birth date gives a best estimate — add birth time to confirm your Moon sign precisely.</div>
            )}
          </div>
        </div>

        {/* Rising */}
        <div className="portrait-row">
          <div style={{minWidth:48}}>
            <div className="tc" style={{marginBottom:2}}>Rising</div>
            <div style={{fontFamily:'Fraunces,serif',fontSize:15,color:'var(--om)',fontWeight:300}}>{chart.rising||'?'}</div>
            <div className="tc" style={{marginTop:2}}>{riseD?.el||'—'}</div>
          </div>
          <div style={{flex:1,paddingLeft:12}}>
            {riseD?(
              <>
                {chart.riseApprox&&(
                  <div style={{background:'var(--tbg)',border:'1px solid var(--tbdr)',borderRadius:8,padding:'6px 10px',marginBottom:8}}>
                    <div className="tc" style={{color:'var(--tens)'}}>Estimated — your birth city wasn't confirmed, so this uses an approximate location. Re-enter your city precisely for an exact Rising sign.</div>
                  </div>
                )}
                <div className="tb" style={{fontSize:14,lineHeight:1.7,marginBottom:4}}>Your outer presence. {riseD.desc}</div>
                <div className="tb" style={{fontSize:12,color:'var(--dim)',fontStyle:'italic',marginBottom:6}}>Shadow: {riseD.shadow}</div>
                <WhyBtn text={`The Rising sign (Ascendant) is the sign that was rising on the eastern horizon at the exact moment of your birth. It governs how you enter rooms, how others first read you, and the mask you wear before people know you well. Your ${chart.rising} Rising shapes your first impression and your instinctive approach to new situations. ${riseD.why}`}/>
              </>
            ):(
              <div className="tb" style={{fontSize:13,color:'var(--ghost)'}}>Add your birth time and city to calculate your Rising sign — it changes every 2 hours.</div>
            )}
          </div>
        </div>
      </div>

      {/* The combination — truly personalized */}
      {chart.moon&&(
        <div className="sg" style={{padding:'14px 16px',marginBottom:12}}>
          <div className="tl" style={{color:'var(--gold)',marginBottom:6}}>How Your Three Work Together</div>
          <div className="tb" style={{fontSize:13,lineHeight:1.85}}>
            {(()=>{
              const sun=chart.sun,moon=chart.moon,rise=chart.rising;
              const sunEl=SD[sun]?.el,moonEl=SD[moon]?.el,riseEl=rise?SD[rise]?.el:null;
              const sunRuler=SD[sun]?.ruler,moonRuler=SD[moon]?.ruler;
              // Element harmony analysis
              const harm={'Fire':['Fire','Air'],'Earth':['Earth','Water'],'Air':['Air','Fire'],'Water':['Water','Earth']};
              const sunMoonHarm=harm[sunEl]?.includes(moonEl);
              const sunRiseHarm=riseEl?harm[sunEl]?.includes(riseEl):null;
              // Build personalized combination text
              let combo=`Your ${sun} Sun operates through ${SD[sun]?.el} energy — ${sunEl==='Earth'?'practical, patient, building toward what lasts':sunEl==='Fire'?'direct, initiating, reaching toward what is possible':sunEl==='Air'?'conceptual, connecting, moving between ideas':' feeling, absorbing, sensing beneath the surface'}. `;
              combo+=`Your ${moon} Moon processes experience through ${SD[moon]?.el} — which means your emotional reality ${sunMoonHarm?`aligns naturally with how your ${sun} Sun operates. You tend to feel what you think, and think what you feel — there\'s unusual coherence between your inner and outer life when you\'re at your best.`:`moves in a different rhythm than your ${sun} drive. This creates productive internal tension — your head and your heart often want different things. That gap isn\'t a flaw. It\'s what makes you more nuanced than someone whose Sun and Moon simply agree.`} `;
              if(rise&&riseEl){
                combo+=`Your ${rise} Rising — the face you show before people know you — adds ${SD[rise]?.el} to the mix. ${sunRiseHarm?`This harmonizes with your ${sun} core, meaning how you appear tends to be genuine rather than at odds with who you actually are.`:`This creates a difference between first impression and actual nature — people may need time to understand who you really are once they get past the ${rise} front door.`}`;
              } else {
                combo+=`Add your birth time to complete this picture with your Rising sign — it\'s the bridge between your inner world and how others first experience you.`;
              }
              return combo;
            })()}
          </div>
          {chart.rising&&(
            <div style={{marginTop:10,paddingTop:10,borderTop:'1px solid var(--gbdr)'}}>
              <div className="tc" style={{color:'var(--gold)',marginBottom:4}}>In practice</div>
              <div className="tb" style={{fontSize:12,lineHeight:1.75,color:'var(--mut)'}}>
                {`You think like a ${chart.sun}, feel like a ${chart.moon}, and first appear as a ${chart.rising}. These three are rarely in perfect alignment — the interesting life happens in the navigation between them. When they're all working together, you are genuinely yourself in every context. When they're in conflict, you'll notice it as a feeling that something is off even when nothing looks wrong.`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* WIDER CHART — Mercury through Saturn. Only needs DOB, so it's always
          available even without birth time/place. Interpretation is genuinely
          generated per planet+sign combination from existing sign content,
          not a fixed lookup table. */}
      {(()=>{
        const planets=derivePlanetSigns(chart.dob);
        if(!planets)return null;
        return(
          <div className="portrait-block" style={{marginBottom:12}}>
            <div className="tl" style={{marginBottom:4}}>Your Wider Chart</div>
            <div className="tc" style={{marginBottom:12}}>Mercury through Saturn — from your birth date</div>
            {Object.entries(planets).map(([planet,sign],idx)=>{
              const dom=PLANET_DOMAIN[planet],sd=SD[sign];
              if(!sd)return null;
              return(
                <div key={planet} className="portrait-row" style={idx===0?{paddingTop:0}:{}}>
                  <div style={{minWidth:48}}>
                    <div className="tc" style={{marginBottom:2}}>{planet}</div>
                    <div style={{fontFamily:'Fraunces,serif',fontSize:15,color:dom.col,fontWeight:300}}>{sign}</div>
                    <div className="tc" style={{marginTop:2}}>{sd.el}</div>
                  </div>
                  <div style={{flex:1,paddingLeft:12}}>
                    <div className="tb" style={{fontSize:13,lineHeight:1.7,marginBottom:4}}>
                      {`${dom.label.charAt(0).toUpperCase()+dom.label.slice(1)}: ${sd.desc}`}
                    </div>
                    <WhyBtn text={`${planet} governs ${dom.label}. Its position by sign at your birth shows the specific style you bring to that part of life — separate from your Sun, Moon, or Rising. Your ${planet} in ${sign} channels this through ${sign}'s ${sd.el} nature: ${sd.why}`}/>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* CHAKRA PROFILE — moved here from Tree tab; it's derived from Sun/Moon/Rising,
          same as everything else in this tab, so it belongs alongside them rather
          than buried inside the Kabbalah-specific Tree of Life tab. */}
      <div className="portrait-block" style={{marginBottom:12}}>
        <div className="tl" style={{marginBottom:4}}>Chakra Profile</div>
        <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.6,marginBottom:14}}>Your Sun, Moon, and Rising elements naturally emphasize certain centers. This isn't a fixed ranking — it's where your energy tends to gather, and where it may need more conscious attention.</div>
        {(()=>{
          const elTags=[{label:'Sun',sign:chart.sun,el:SD[chart.sun]?.el},{label:'Moon',sign:chart.moon,el:chart.moon?SD[chart.moon]?.el:null},{label:'Rising',sign:chart.rising,el:chart.rising?SD[chart.rising]?.el:null}].filter(t=>t.el);
          const elCounts={};
          elTags.forEach(t=>{elCounts[t.el]=(elCounts[t.el]||0)+1;});
          const chakraScore=(c)=>{
            const matchEl=Object.keys(EL_TO_CHAKRA).find(el=>EL_TO_CHAKRA[el].includes(c.name));
            return elCounts[matchEl]||0;
          };
          const sorted=[...CK].map(c=>({...c,score:chakraScore(c)})).sort((a,b)=>b.score-a.score);
          return sorted.map((c,i)=>{
            const matchedPlacements=elTags.filter(t=>EL_TO_CHAKRA[t.el]?.includes(c.name));
            const isEmphasized=c.score>0;
            return(
              <div key={i} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'10px 0',borderBottom:i<sorted.length-1?'1px solid var(--bl)':'none',opacity:isEmphasized?1:.7}}>
                <div style={{width:14,height:14,borderRadius:'50%',background:c.col,flexShrink:0,marginTop:4}}/>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:2}}>
                    <div style={{fontFamily:'Inter',fontSize:10,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--mut)'}}>{c.name} · {c.el}</div>
                    {isEmphasized&&<span className="tag tg" style={{fontSize:8}}>{matchedPlacements.map(p=>p.label).join(' + ')}</span>}
                  </div>
                  <div className="tb" style={{fontSize:12,lineHeight:1.6,marginBottom:4}}>{c.desc}</div>
                  {isEmphasized?(
                    <div className="tb" style={{fontSize:11,color:'var(--gold)',fontStyle:'italic',marginBottom:4}}>Naturally emphasized in your chart — {matchedPlacements.map(p=>`your ${p.sign} ${p.label}`).join(' and ')} run through this center.</div>
                  ):(
                    <div className="tb" style={{fontSize:11,color:'var(--dim)',fontStyle:'italic',marginBottom:4}}>Not a dominant element in your chart — may need more conscious tending than your natural strengths.</div>
                  )}
                  <WhyBtn text={c.why}/>
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* CORRESPONDENCES — moved here from Tree tab for the same reason as Chakra Profile above. */}
      <div className="portrait-block" style={{marginBottom:12}}>
        <div className="tl" style={{marginBottom:10}}>Your Correspondences</div>
        <div style={{marginBottom:10}}>
          <div className="tc" style={{marginBottom:6}}>Stones</div>
          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
            {[...new Set([...(sunD?.stones||[]),...(moonD?.stones||[]),...(riseD?.stones||[])])].map(s=>(
              <span key={s} style={{background:'var(--lbg)',border:'1px solid var(--lbdr)',borderRadius:8,padding:'4px 10px',color:'var(--lun)',fontFamily:'Inter',fontSize:11}}>{s}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="tc" style={{marginBottom:6}}>Herbs & Plants</div>
          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
            {[...new Set([...(sunD?.herbs||[]),...(moonD?.herbs||[]),...(riseD?.herbs||[])])].map(h=>(
              <span key={h} style={{background:'var(--obg)',border:'1px solid var(--obdr)',borderRadius:8,padding:'4px 10px',color:'var(--open)',fontFamily:'Inter',fontSize:11}}>{h}</span>
            ))}
          </div>
        </div>
        <div style={{marginTop:10}}>
          <WhyBtn text="Correspondences are the material world's resonances with specific energies. Each sign, planet, and element has physical substances that vibrate at a similar frequency — stones, plants, colors, metals. These aren't arbitrary — they come from thousands of years of observation across multiple traditions. Working with your personal correspondences means working with materials that are already in conversation with your chart. They don't do the work for you — they amplify what you're already doing."/>
        </div>
      </div>

      {/* NATAL HOUSES */}
      {chart.rising&&(
        <div className="portrait-block" style={{marginBottom:12}}>
          <div className="tl" style={{marginBottom:4}}>Natal Houses</div>
          <div className="tc" style={{marginBottom:12}}>Where each sign falls in your chart</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>{
              const s=SIGNS[((SIGNS.indexOf(chart.rising)+n-1)%12+12)%12];
              const names=['Self & Identity','Resources & Values','Mind & Communication','Home & Roots','Creativity & Joy','Health & Service','Partnership','Transformation','Expansion & Beliefs','Career & Legacy','Community & Vision','Unconscious & Dreams'];
              return(
                <div key={n} style={{background:'var(--bgm)',borderRadius:10,padding:'10px 12px',border:'1px solid var(--bl)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                    <div className="tc">House {n}</div>
                    <div style={{fontFamily:'Inter',fontSize:9,color:'var(--lun)',letterSpacing:'.07em'}}>{s}</div>
                  </div>
                  <div className="tb" style={{fontSize:11,color:'var(--ink)',lineHeight:1.4}}>{names[n-1]}</div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:10}}>
            <WhyBtn text="The natal houses divide your chart into 12 sections, each governing a different area of life. The sign on the cusp of each house shows HOW you approach that life area — your style, your instincts, your gifts and challenges there. Having Scorpio on your 2nd house isn't the same as Scorpio on someone else's 2nd house — because your whole chart shapes how that plays out."/>
          </div>
        </div>
      )}

      </>)}

      {/* LIFE PATH */}
      {bTab==='numbers'&&(<>
      <div className="portrait-block" style={{marginBottom:12}}>
        <div className="tl" style={{marginBottom:4}}>Life Path {chart.lifePath}</div>
        <div className="td" style={{fontSize:18,marginBottom:8,color:'var(--gold)'}}>{LP_THEME[chart.lifePath]||'The Navigator'}</div>
        <div className="tb" style={{fontSize:14,lineHeight:1.85,marginBottom:8}}>{PYM[chart.lifePath]?.desc||`Your Life Path ${chart.lifePath} is the core theme of what you are here to do and learn.`}</div>
        <WhyBtn text={`The Life Path number is calculated by reducing your full birth date to a single digit (or master number). It represents the main current of your life — not your personality, but your purpose and the lessons you keep encountering. Unlike your sun sign, which shows how you express yourself, the Life Path shows why you're here. A ${chart.sun} Sun with Life Path ${chart.lifePath} is very different from a ${chart.sun} Sun with a different Life Path — the same personality energy, in service of a completely different larger mission.`}/>

        <div style={{height:1,background:'var(--bl)',margin:'14px 0'}}/>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:10}}>
          {[{l:'Personal\nYear',v:py,why:PYM[py]?.why},{l:'Personal\nMonth',v:pm,why:PMM[pm]?.why},{l:'Personal\nDay',v:pd,why:PDM[pd]?.why}].map(({l,v,why})=>(
            <div key={l} style={{background:'var(--bgm)',borderRadius:12,padding:'12px',textAlign:'center',border:'1px solid var(--bl)'}}>
              <div className="tc" style={{marginBottom:4,whiteSpace:'pre-line'}}>{l}</div>
              <div className="td" style={{fontSize:30,color:'var(--gold)'}}>{v}</div>
            </div>
          ))}
        </div>
        <div className="ins" style={{padding:'12px 14px',marginBottom:8}}>
          <div className="tc" style={{marginBottom:3}}>Personal Year {py} — {PYM[py]?.theme}</div>
          <div className="tb" style={{fontSize:13,lineHeight:1.7,marginBottom:4}}>{PYM[py]?.desc}</div>
          <WhyBtn text={PYM[py]?.why}/>
        </div>
        <div style={{display:'flex',gap:3,marginBottom:4}}>{[1,2,3,4,5,6,7,8,9].map(n=><div key={n} style={{flex:1,height:5,borderRadius:3,background:n===py?'var(--gold)':n<py?'var(--bm)':'var(--bl)'}}/>)}</div>
        <div className="tc" style={{textAlign:'right',marginBottom:8}}>Year {py} of 9</div>
        {bdn.raw>9&&<div className="tc">Birth Day: {bdn.raw} / {bdn.red} — secondary influence on natural expression</div>}
      </div>

      </>)}

      {/* HUMAN DESIGN */}
      {bTab==='design'&&(<>
      <div className="portrait-block" style={{marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
          <div>
            <div className="tl" style={{marginBottom:2}}>Human Design</div>
            <div className="td" style={{fontSize:18}}>{hdT}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div className="tc" style={{marginBottom:2}}>Strategy</div>
            <div style={{fontFamily:'Inter',fontSize:11,color:'var(--gold)'}}>{hdD?.strategy}</div>
          </div>
        </div>
        <div className="tb" style={{fontSize:13,lineHeight:1.8,marginBottom:10}}>{hdD?.desc}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:10}}>
          {[{l:'Signature',v:hdD?.sig},{l:'Not-Self',v:hdD?.not_self}].map(({l,v})=>(
            <div key={l} style={{background:'var(--bgm)',borderRadius:10,padding:'10px',border:'1px solid var(--bl)'}}>
              <div className="tc" style={{marginBottom:3}}>{l}</div>
              <div className="tb" style={{fontSize:12,color:'var(--ink)'}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{padding:'9px 12px',background:'var(--tbg)',border:'1px solid var(--tbdr)',borderRadius:10,marginBottom:10}}>
          <div className="tc" style={{marginBottom:3,color:'var(--tens)'}}>Watch for</div>
          <div className="tb" style={{fontSize:12,color:'var(--tens)'}}>{hdD?.not_self} is the signal you are off your path. It is not a character flaw — it is useful navigation data.</div>
        </div>
        <WhyBtn text={hdD?.why}/>

        {/* AUTHORITY — how to know if a decision is right, distinct from Strategy (when to act) */}
        {hdAuthD&&(
          <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid var(--bl)'}}>
            <div className="tl" style={{marginBottom:6}}>Your Authority</div>
            <div className="td" style={{fontSize:16,color:'var(--lun)',marginBottom:8}}>{hdAuth}</div>
            <div className="tb" style={{fontSize:13,lineHeight:1.8,marginBottom:8}}>{hdAuthD.desc}</div>
            <div className="tb" style={{fontSize:11,color:'var(--mut)',fontStyle:'italic',marginBottom:8}}>Strategy tells you when to engage. Authority tells you how to know if it's actually right once it's in motion — they work together, not in place of each other.</div>
            <WhyBtn text={hdAuthD.why}/>
          </div>
        )}

        {/* HONEST DISCLOSURE — this app does not calculate a real bodygraph */}
        <div style={{marginTop:14,paddingTop:12,borderTop:'1px solid var(--bl)',background:'var(--bgm)',borderRadius:10,padding:'10px 12px'}}>
          <div className="tc" style={{marginBottom:4,color:'var(--mut)'}}>About this reading</div>
          <div className="tb" style={{fontSize:11,color:'var(--mut)',lineHeight:1.6}}>A genuine Human Design chart requires calculating your full bodygraph — which of your nine energy centers are defined — from the exact positions of every planet at your birth moment, plus the planetary positions 88 days prior. This app doesn't compute that. Your Type and Authority above are a simplified estimate drawn from your Sun, Moon, Rising, and Life Path — useful as a starting reflection, not a substitute for a calculated chart from a dedicated Human Design tool.</div>
        </div>
      </div>

      </>)}

      {/* CHINESE ZODIAC — full tradition, matching Western sign depth */}
      {bTab==='zodiac'&&(<>
      <div className="portrait-block" style={{marginBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
          <div style={{fontSize:36}}>{zh.emoji}</div>
          <div>
            <div className="tl" style={{marginBottom:2}}>Chinese Zodiac</div>
            <div className="td" style={{fontSize:18}}>{zh.full}</div>
          </div>
        </div>

        {/* Animal personality */}
        {ZH_ANIMALS[zh.animal]&&(
          <div style={{marginBottom:12,paddingBottom:12,borderBottom:'1px solid var(--bl)'}}>
            <div className="tc" style={{marginBottom:6}}>Your {zh.animal} nature</div>
            <div className="tb" style={{fontSize:13,lineHeight:1.75,marginBottom:6}}>{ZH_ANIMALS[zh.animal].strength}</div>
            <div className="tb" style={{fontSize:12,color:'var(--dim)',fontStyle:'italic',marginBottom:6}}>Shadow: {ZH_ANIMALS[zh.animal].shadow}</div>
            <div className="tb" style={{fontSize:12,color:'var(--mut)'}}>What you need: {ZH_ANIMALS[zh.animal].needs}</div>
            <WhyBtn text={ZH_ANIMALS[zh.animal].why}/>
          </div>
        )}

        {/* Traditional animal relationships — best matches, secret friend, and clashes */}
        <div style={{marginBottom:12,paddingBottom:12,borderBottom:'1px solid var(--bl)'}}>
          <div className="tc" style={{marginBottom:8}}>Your traditional animal relationships</div>
          {(()=>{
            const trine=ZH_TRINES.find(t=>t.includes(zh.animal))?.filter(a=>a!==zh.animal)||[];
            const friend=ZH_SECRET_FRIENDS.find(p=>p.includes(zh.animal))?.find(a=>a!==zh.animal);
            const clash=ZH_CLASHES.find(p=>p.includes(zh.animal))?.find(a=>a!==zh.animal);
            const ANIMAL_EMOJI={Rat:'🐀',Ox:'🐂',Tiger:'🐅',Rabbit:'🐇',Dragon:'🐉',Snake:'🐍',Horse:'🐎',Goat:'🐐',Monkey:'🐒',Rooster:'🐓',Dog:'🐕',Pig:'🐖'};
            return(
              <div>
                {trine.length>0&&(
                  <div style={{marginBottom:8}}>
                    <div className="tc" style={{marginBottom:4,color:'var(--open)'}}>Trine of Harmony — your natural allies</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:4}}>
                      {trine.map(a=><span key={a} style={{background:'var(--obg)',border:'1px solid var(--obdr)',borderRadius:20,padding:'4px 10px',color:'var(--open)',fontFamily:'Inter',fontSize:10}}>{ANIMAL_EMOJI[a]} {a}</span>)}
                    </div>
                    <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.6}}>{zh.animal}, {trine.join(', ')} form one of the four traditional Trines of Harmony — temperaments that reinforce rather than compete with each other.</div>
                  </div>
                )}
                {friend&&(
                  <div style={{marginBottom:8}}>
                    <div className="tc" style={{marginBottom:4,color:'var(--open)'}}>Secret Friend — quiet, steady support</div>
                    <span style={{background:'var(--obg)',border:'1px solid var(--obdr)',borderRadius:20,padding:'4px 10px',color:'var(--open)',fontFamily:'Inter',fontSize:10}}>{ANIMAL_EMOJI[friend]} {friend}</span>
                    <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.6,marginTop:4}}>Less showy than a Trine match, but {friend} is your traditional one-on-one Secret Friend — a steady, loyal bond outside the main trines.</div>
                  </div>
                )}
                {clash&&(
                  <div>
                    <div className="tc" style={{marginBottom:4,color:'var(--avoid)'}}>Direct Clash — real friction, named honestly</div>
                    <span style={{background:'var(--abg)',border:'1px solid var(--abdr)',borderRadius:20,padding:'4px 10px',color:'var(--avoid)',fontFamily:'Inter',fontSize:10}}>{ANIMAL_EMOJI[clash]} {clash}</span>
                    <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.6,marginTop:4}}>{zh.animal} and {clash} sit directly opposite each other on the 12-year wheel — the traditional clash pairing. Not automatically hostile, but the friction here is structural, not incidental.</div>
                  </div>
                )}
                <div style={{marginTop:8}}>
                  <WhyBtn text="Chinese zodiac compatibility runs on three traditional structures, distinct from Western elemental matching. The four Trines of Harmony group three animals each whose temperaments naturally reinforce one another — considered the most supportive pairings in the system. The six Secret Friend pairs are quieter, one-on-one bonds outside the trines — steady rather than dramatic. The six Clashes sit directly opposite each other on the 12-animal wheel and are the traditional 'difficult match' pairing — not a curse, but a real, named friction point worth approaching with awareness rather than surprise."/>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Five element cycle, explained for their specific element */}
        <div>
          <div className="tc" style={{marginBottom:6}}>Your {zh.element} element</div>
          <div className="tb" style={{fontSize:13,lineHeight:1.75,marginBottom:8}}>{FIVE_EL_DESC[zh.element]}</div>
          {FIVE_EL_CYCLE[zh.element]&&(
            <div style={{display:'flex',gap:6,marginBottom:8}}>
              <div style={{flex:1,background:'var(--obg)',border:'1px solid var(--obdr)',borderRadius:10,padding:'9px 10px'}}>
                <div className="tc" style={{color:'var(--open)',marginBottom:2}}>You feed</div>
                <div style={{fontFamily:'Inter',fontSize:11,color:'var(--open)'}}>{FIVE_EL_CYCLE[zh.element].feeds}</div>
              </div>
              <div style={{flex:1,background:'var(--bgm)',border:'1px solid var(--bl)',borderRadius:10,padding:'9px 10px'}}>
                <div className="tc" style={{marginBottom:2}}>You control</div>
                <div style={{fontFamily:'Inter',fontSize:11,color:'var(--mut)'}}>{FIVE_EL_CYCLE[zh.element].controls}</div>
              </div>
              <div style={{flex:1,background:'var(--tbg)',border:'1px solid var(--tbdr)',borderRadius:10,padding:'9px 10px'}}>
                <div className="tc" style={{color:'var(--tens)',marginBottom:2}}>Controlled by</div>
                <div style={{fontFamily:'Inter',fontSize:11,color:'var(--tens)'}}>{FIVE_EL_CYCLE[zh.element].controlledBy}</div>
              </div>
            </div>
          )}
          <WhyBtn text={`The Five Elements (Wu Xing) move in a generating cycle: Wood feeds Fire, Fire's ash becomes Earth, Earth compacts into Metal, Metal collects and channels Water, Water nourishes Wood — and the cycle repeats. There's also a controlling cycle running alongside it: Wood parts Earth (roots through soil), Earth absorbs Water (riverbanks), Water extinguishes Fire, Fire melts Metal, Metal cuts Wood. Your ${zh.element} sits in both cycles — it's not isolated, it's one link in a larger system. Combined with your ${zh.animal} animal sign and the 10-year stem cycle, this creates the full 60-year Chinese zodiac cycle (12 animals × 5 elements).`}/>
        </div>
      </div>

      </>)}

      {/* TREE OF LIFE — the full ten spheres, with your active points genuinely derived from
          Life Path, Sun, Moon, and Rising — not just two disconnected lookups */}
      {bTab==='tree'&&(<>
      <div className="portrait-block" style={{marginBottom:12}}>
        <div className="tl" style={{marginBottom:4}}>Tree of Life</div>
        <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.6,marginBottom:14}}>Ten spheres, twenty-two connecting paths. Your chart activates specific points — here's where you sit on the whole structure.</div>

        {/* Full tree — all 10 spheres, yours highlighted */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:14}}>
          {SEPH.map(s=>{
            const isActive=seph.activeNumbers.includes(s.n);
            return(
              <div key={s.n} style={{background:isActive?s.col+'22':'var(--bgm)',border:`1px solid ${isActive?s.col+'60':'var(--bl)'}`,borderRadius:10,padding:'8px 10px',opacity:isActive?1:.55}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                  <div style={{width:9,height:9,borderRadius:'50%',background:s.col,flexShrink:0}}/>
                  <div style={{fontFamily:'Inter',fontSize:9,color:'var(--dim)'}}>{s.n}</div>
                  <div style={{fontFamily:'Fraunces,serif',fontSize:12,color:isActive?'var(--ink)':'var(--mut)',fontWeight:300}}>{s.name}</div>
                </div>
                <div className="tc">{s.title}</div>
              </div>
            );
          })}
        </div>

        {/* Your active points, each genuinely sourced */}
        {[{l:`Life Path ${chart.lifePath}`,s:seph.primary},{l:`${chart.sun} Sun`,s:seph.secondary},{l:chart.moon?`${chart.moon} Moon`:null,s:seph.tertiary},{l:chart.rising?`${chart.rising} Rising`:null,s:seph.riseSeph}].filter(p=>p.l&&p.s).map(({l,s})=>(
          <div key={l} style={{marginBottom:12,paddingBottom:12,borderBottom:'1px solid var(--bl)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
              <div style={{width:16,height:16,borderRadius:'50%',background:s?.col,flexShrink:0}}/>
              <div><div className="tc">{l}</div><div className="td" style={{fontSize:15}}>{s?.name} — {s?.title}</div></div>
              <div style={{marginLeft:'auto',fontFamily:'Inter',fontSize:9,color:'var(--dim)'}}>{s?.planet}</div>
            </div>
            <div className="tb" style={{fontSize:13,lineHeight:1.7,marginBottom:2}}>{s?.desc}</div>
            <div className="tb" style={{fontSize:12,color:'var(--mut)',fontStyle:'italic',marginBottom:6}}>Best for: {s?.work}</div>
            <WhyBtn text={s?.why}/>
          </div>
        ))}

        {/* How your points genuinely relate on the Tree */}
        {seph.connections.length>0&&(
          <div style={{marginBottom:8}}>
            <div className="tl" style={{marginBottom:8}}>How your points connect</div>
            {seph.connections.map((c,i)=>(
              <div key={i} style={{background:c.connected?'var(--obg)':'var(--bgm)',border:`1px solid ${c.connected?'var(--obdr)':'var(--bl)'}`,borderRadius:10,padding:'10px 12px',marginBottom:6}}>
                <div className="tb" style={{fontSize:12,lineHeight:1.6}}>
                  Your <strong>{c.a.label}</strong> ({c.a.s.name}) and <strong>{c.b.label}</strong> ({c.b.s.name}) {c.connected?'sit on a direct path on the Tree — these two parts of you naturally reinforce and flow into each other.':'are not directly connected — energy between these two parts of you has to travel through other spheres first, which is why they can feel like separate, even competing, drives.'}
                </div>
              </div>
            ))}
          </div>
        )}

        <WhyBtn text="The Tree of Life (Etz Chaim) is the central diagram of Kabbalah — 10 spheres (sephiroth) connected by 22 paths, representing the structure of consciousness and creation. Each sephirah corresponds to a planet, a quality, and a way of working with energy. Your Life Path and Sun sign give your two strongest points; your Moon and Rising (when known) add two more, each derived from its own ruling planet. The paths between them are real, fixed lines on the Tree — whether your specific points are directly connected or not tells you something true about how those parts of yourself relate."/>
      </div>

      </>)}

      {/* ── COMPATIBILITY ── */}
      {bTab==='compat'&&(
      <CompatibilitySection chart={chart} loc={loc} savedRelationships={savedRelationships} onSaveRelationship={onSaveRelationship} onRemoveRelationship={onRemoveRelationship}/>
      )}

      <button className="bg" style={{marginBottom:16,color:'var(--avoid)',borderColor:'var(--abdr)'}} onClick={()=>setShowReset(true)}>Reset Blueprint</button>

      {showEdit&&(
        <div className="ov" onClick={()=>setShowEdit(false)}>
          <div className="sh" onClick={e=>e.stopPropagation()}>
            <div className="hd"/>
            <div className="td" style={{fontSize:20,marginBottom:16}}>Edit Your Signs</div>
            {[['Sun',eSun,setESun],['Moon',eMoon,setEMoon],['Rising',eRise,setERise]].map(([l,v,s])=>(
              <div key={l} style={{marginBottom:14}}>
                <div className="tl" style={{marginBottom:8}}>{l} Sign</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>{SIGNS.map(sg=><button key={sg} className={`chip ${v===sg?'on':''}`} onClick={()=>s(v===sg?'':sg)} style={{fontSize:9}}>{sg}</button>)}</div>
              </div>
            ))}
            <button className="bp" style={{marginTop:8,marginBottom:8}} onClick={saveEdits}>Save</button>
            <button className="bg" onClick={()=>setShowEdit(false)}>Cancel</button>
          </div>
        </div>
      )}
      {showReset&&(
        <div className="ov" onClick={()=>setShowReset(false)}>
          <div className="sh" onClick={e=>e.stopPropagation()}>
            <div className="hd"/>
            <div className="td" style={{fontSize:20,marginBottom:10}}>Reset Blueprint?</div>
            <div className="tb" style={{fontSize:14,marginBottom:20}}>This clears all your birth data. Your Codex entries are kept.</div>
            <button className="bp" style={{marginBottom:8,background:'#7A2828'}} onClick={()=>{onUpdate(null);setShowReset(false);}}>Yes, Reset</button>
            <button className="bg" onClick={()=>setShowReset(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PRACTICE PAGE ────────────────────────────────────────────────────────────
// ─── MATERIALS ────────────────────────────────────────────────────────────────
function detectIntent(text){
  const t=(text||'').toLowerCase();
  if(/\b(love|romance|partner|relationship|attract|heart|soulmate|dating|crush|ex|intimacy|lonely)\b/.test(t))return'love';
  if(/\b(money|abundance|wealth|financial|career|job|prosper|success|business|income|clients|manifest)\b/.test(t))return'abundance';
  if(/\b(protect|ward|shield|guard|safe|banish|repel|block|boundary|toxic|negative|drain)\b/.test(t))return'protection';
  if(/\b(release|let go|cut|cord|break|end|remove|detach|clear|move on|forgive|grief|habit)\b/.test(t))return'release';
  if(/\b(heal|health|recover|restore|cleanse|balance|pain|body|trauma|anxiety)\b/.test(t))return'healing';
  if(/\b(clarity|guidance|decision|sign|vision|dream|intuition|divination|confused|lost|purpose)\b/.test(t))return'divination';
  if(/\b(peace|calm|harmony|stress|anger|conflict|overwhelm|chaos|ground|center)\b/.test(t))return'peace';
  if(/\b(confidence|courage|strength|power|voice|speak|worth|bold|visible)\b/.test(t))return'confidence';
  if(/\b(creative|create|art|write|music|inspiration|stuck|idea|project|express)\b/.test(t))return'creativity';
  return'general';
}
const MAT={
  love:{stones:['Rose Quartz','Rhodonite','Garnet'],herbs:['Rose','Jasmine','Lavender'],candle:'pink or red',tip:'Friday amplifies love workings.'},
  abundance:{stones:['Citrine','Pyrite','Green Aventurine'],herbs:['Cinnamon','Bay Leaf','Basil'],candle:'green or gold',tip:'Thursday is your strongest window for abundance.'},
  protection:{stones:['Black Tourmaline','Obsidian','Hematite'],herbs:['Sage','Rosemary','Rue'],candle:'black or white',tip:'Tuesday and Saturday both favor protection work.'},
  release:{stones:['Obsidian','Smoky Quartz','Apache Tear'],herbs:['Wormwood','Mugwort','Sage'],candle:'black',tip:'Saturday during a waning moon is your peak release window.'},
  healing:{stones:['Amethyst','Clear Quartz','Selenite'],herbs:['Lavender','Chamomile','Calendula'],candle:'blue or white',tip:'Monday for emotional healing, Sunday for physical vitality.'},
  divination:{stones:['Amethyst','Labradorite','Moonstone'],herbs:['Mugwort','Bay Leaf','Eyebright'],candle:'purple or silver',tip:'Monday and Wednesday both open psychic channels.'},
  peace:{stones:['Blue Lace Agate','Aquamarine','Lepidolite'],herbs:['Lavender','Chamomile','Valerian'],candle:'blue or white',tip:'Friday and Monday are both aligned for peace.'},
  confidence:{stones:["Tiger's Eye",'Carnelian','Pyrite'],herbs:['Cinnamon','Ginger','Rosemary'],candle:'orange or gold',tip:'Sunday and Tuesday amplify confidence.'},
  creativity:{stones:['Carnelian','Orange Calcite','Citrine'],herbs:['Rosemary','Mint','Orange Peel'],candle:'orange or yellow',tip:'Wednesday opens creative channels.'},
  general:{stones:['Clear Quartz','Amethyst','Selenite'],herbs:['Sage','Lavender'],candle:'white',tip:'White candles serve any intention.'},
};
const SUBS={'Rose Quartz':'any pink or red stone, or your hand over your heart','Black Tourmaline':'obsidian, hematite, or any dark stone','Obsidian':'black tourmaline, hematite, or a mirror face-down','Citrine':"pyrite, yellow calcite, or a coin in sunlight",'Amethyst':'clear quartz, labradorite, or any purple object','Clear Quartz':'any stone you feel drawn to — quartz amplifies intention','Selenite':'clear quartz, white calcite, or moonlight on white cloth','Labradorite':'moonstone, amethyst, or obsidian','Moonstone':'selenite, pearl, or clear quartz charged under moonlight','Smoky Quartz':'obsidian, hematite, or clear quartz on dark cloth',"Tiger's Eye":'carnelian, pyrite, or amber','Carnelian':"tiger's eye, red jasper, or sunstone",'Green Aventurine':'jade, malachite, or any green stone','Rhodonite':'rose quartz or garnet','Garnet':'carnelian or red jasper','Apache Tear':'obsidian or smoky quartz','Lepidolite':'amethyst or blue lace agate','Aquamarine':'blue lace agate or celestite','Blue Lace Agate':'aquamarine or selenite','Orange Calcite':'carnelian or citrine','Pyrite':"citrine or tiger's eye",'Sage':'rosemary, lavender, cedar, or simply opening a window with intention','Lavender':'chamomile, rose petals, or a calming tea','Rose':'lavender, hibiscus, or a pink candle','Cinnamon':'bay leaf, clove, or ginger','Bay Leaf':'cinnamon stick or rosemary sprig','Mugwort':'lavender, chamomile, or wormwood','Rosemary':'sage or mint','Basil':'mint or bay leaf','Jasmine':'rose or lavender','Chamomile':'lavender or valerian','Valerian':'chamomile or lavender','Wormwood':'mugwort or sage','Eyebright':'mugwort or bay leaf','Ginger':'cinnamon or clove','Rue':'sage or rosemary','Mint':'rosemary or basil','Orange Peel':'citrine or carnelian','Calendula':'chamomile or lavender'};

function PracticePage({chart,loc,codexEntries,onSave}){


  const[intention,setIntention]=useState('');
  const[reflection,setReflection]=useState('');
  const[loading,setLoading]=useState(false);
  const[saved,setSaved]=useState(false);
  const today=new Date();
  const aln=useMemo(()=>buildAlign(chart,today,loc),[chart,today,loc]);
  const TC={open:'var(--open)',tens:'var(--tens)',avoid:'var(--avoid)'};
  const TL={open:'Open window',tens:'Navigate',avoid:'Close the door'};
  const[error,setError]=useState(false);
  const completeness=useMemo(()=>chartCompleteness(chart),[chart]);
  const hdType=useMemo(()=>deriveHD(chart),[chart]);
  const hdAuthority=useMemo(()=>deriveHDAuthority(chart,hdType),[chart,hdType]);
  const seph=useMemo(()=>gSeph(chart),[chart]);
  const effort=useMemo(()=>getEffortLevel(aln),[aln]);
  const suggested=useMemo(()=>getSuggestedWorking(aln,effort,chart),[aln,effort,chart]);

  function buildFallbackReflection(){
    const sunData=SD[chart.sun]||{};
    const moonData=chart.moon?SD[chart.moon]:null;
    const sunTrait=sunData.desc?sunData.desc.split('.')[0].toLowerCase():'a particular way of seeing things';
    const moonLine=moonData?`Your ${chart.moon} Moon means you likely feel this before you can fully explain it — that's not confusion, that's information arriving early.`:'';
    return `There's a real desire underneath this — your ${chart.sun} Sun (${sunTrait}) doesn't reach for things lightly. ${moonLine} Your Life Path ${chart.lifePath} suggests this isn't a passing want; it connects to something larger you're working toward. What would change in your day-to-day if you already trusted this was coming?`;
  }

  async function getReflection(){
    if(!intention.trim())return;
    setLoading(true);setReflection('');setError(false);
    const moonLine=completeness.hasMoon?`${chart.moon} Moon${completeness.moonConfirmed?'':' (best estimate)'}`:'Moon unknown';
    const risingLine=completeness.hasRising?`${chart.rising} Rising`:'Rising unknown';
    const depthLine=`Human Design: ${hdType}, ${hdAuthority||'?'} Authority${!completeness.isFullChart?' (estimated)':''} · Core Tree of Life point: ${seph.primary?.name}`;
    const completenessNote=completeness.isFullChart?'':`Note: this person hasn't shared their birth time/place, so Moon and/or Rising may be unknown or estimated — do not invent specifics about a placement marked unknown. Use what's genuinely known (Sun, Life Path, Human Design, Tree of Life) to keep the reflection rich and specific.`;
    const prompt=`You are Unearthed. This person has written an intention or question. Your job is to reflect it back in a way that deepens their understanding of themselves — not to advise them what to do. Every sentence must be specific to their chart, not generic.

Blueprint: ${chart.sun} Sun · ${moonLine} · ${risingLine} · Life Path ${chart.lifePath} · ${chart.chinese?.full}
${depthLine}
Today: ${aln.moon.name} in ${aln.moonSgn} · Personal Day ${aln.pd} · ${aln.tier}
${completenessNote}
Their intention: "${intention}"

Write 3 short paragraphs, 120 words maximum total:
1. The core desire beneath their words — what are they actually reaching for? Be specific.
2. One placement in their chart (name it) that directly relates to this intention — draw from Sun, Human Design, or Tree of Life, not only Moon/Rising if those are unknown.
3. One honest question for them to sit with. Not a suggestion — a question that opens something.

Voice: warm, direct. Same voice as their daily reading. No jargon.`;
    try{
      if(!AI_ENABLED)throw new Error('AI disabled — running free/offline');
      const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:280,messages:[{role:'user',content:prompt}]})});
      if(!r.ok)throw new Error('API request failed');
      const data=await r.json();
      const text=(data.content?.map(b=>b.type==='text'?b.text:'').join('')||'').trim();
      if(!text)throw new Error('Empty response');
      setReflection(text);
    }catch{
      setReflection(buildFallbackReflection());
      setError(true);
    }
    setLoading(false);
  }

  function saveToCodex(){
    if(!intention.trim())return;
    const ck=dCK(chart,today);
    onSave({
      title:intention.trim(),type:'intention',status:'seed',notes:reflection,date:new Date().toISOString(),
      moonPhase:aln.moon.name,personalDay:aln.pd,personalYear:aln.py,
      planetaryHour:aln.currHr?.ruler||null,
      tier:aln.tier,
      chakra:ck.name,
      weekday:aln.wd.name,
    });
    setSaved(true);setIntention('');setReflection('');
    setTimeout(()=>setSaved(false),2500);
  }

  return(
    <div className="scr ent" style={{padding:'20px 16px 0'}}>
      <div style={{marginBottom:16}}>
        <div className="td" style={{fontSize:26,marginBottom:4}}>Practice</div>
        <div className="tb" style={{fontSize:13,color:'var(--mut)'}}>Set an intention. Receive a reflection built from your blueprint. Save what matters.</div>
      </div>
      <div style={{padding:'12px 14px',background:'var(--bgc)',borderRadius:12,border:'1px solid var(--bl)',marginBottom:14,display:'flex',gap:10,alignItems:'center'}}>
        <span style={{fontSize:18}}>{aln.moon.emoji}</span>
        <div style={{flex:1}}>
          <div className="tc" style={{marginBottom:1}}>Today's energy</div>
          <div className="tb" style={{fontSize:13}}>{aln.moon.name} · PD {aln.pd} · <span style={{color:TC[aln.tier]}}>{TL[aln.tier]}</span></div>
        </div>
      </div>

      <WorkingsGuide aln={aln} compact chart={chart}/>

      <div className="sg" style={{padding:'16px 18px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:8}}>
          <span style={{fontSize:13}}>✦</span>
          <span className="tc" style={{color:'var(--gold)'}}>Today's Suggested Working · {suggested.effortLabel} day</span>
        </div>
        <div className="td" style={{fontSize:18,marginBottom:6}}>{suggested.title}</div>
        <div className="tb" style={{fontSize:13,lineHeight:1.7}}>{suggested.instruction}</div>
        <div style={{marginTop:8}}><WhyBtn text={`This is drawn from what's most aligned right now (${suggested.source}), scaled to today's effort level. On a Push day the suggestion asks more of you; on a Rest day it's intentionally small — the working type stays the same, only its size changes.`}/></div>
      </div>

      <div style={{marginBottom:12}}>
        <div className="tl" style={{marginBottom:8}}>What's on your mind?</div>
        <textarea className="fld" rows={4} placeholder="Write an intention, a question, something you're working toward, or something you want to release…" value={intention} onChange={e=>setIntention(e.target.value)} style={{fontSize:14,lineHeight:1.7}}/>
      </div>
      {intention.trim()&&(()=>{const it=detectIntent(intention);const m=MAT[it];return(
        <div className="ins" style={{padding:'13px 14px',marginBottom:16}}>
          <div className="tc" style={{marginBottom:8}}>Materials · {it}</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:8}}>
            {[...m.stones,...m.herbs].map(item=><span key={item} title={SUBS[item]?`No ${item}? Try: ${SUBS[item]}`:''} style={{background:'var(--bgm)',border:'1px solid var(--bl)',borderRadius:20,padding:'4px 10px',fontFamily:'Inter',fontSize:10,color:'var(--body)'}}>{item}</span>)}
          </div>
          <div className="tb" style={{fontSize:12,color:'var(--mut)',marginBottom:m.stones.concat(m.herbs).some(i=>SUBS[i])?6:0}}>Candle: {m.candle}. {m.tip}</div>
          <div className="tb" style={{fontSize:11,color:'var(--dim)',lineHeight:1.6}}>Don't have something on hand? {[...m.stones,...m.herbs].filter(i=>SUBS[i]).slice(0,2).map(i=>`${i} → ${SUBS[i]}`).join(' · ')}</div>
        </div>
      );})()}
      <button className="bp" style={{marginBottom:16,opacity:intention.trim()&&!loading?1:.35}} disabled={!intention.trim()||loading} onClick={getReflection}>{loading?'Reflecting…':'Get a Reflection'}</button>
      {reflection&&(
        <div>
          {error&&(
            <div style={{background:'var(--tbg)',border:'1px solid var(--tbdr)',borderRadius:10,padding:'10px 12px',marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
              <div className="tb" style={{fontSize:12,color:'var(--tens)'}}>Couldn't reach your full reading — showing a simpler reflection.</div>
              <button onClick={getReflection} style={{background:'none',border:'none',color:'var(--tens)',fontFamily:'Inter',fontSize:10,letterSpacing:'.06em',textTransform:'uppercase',cursor:'pointer',flexShrink:0}}>Retry</button>
            </div>
          )}
          <div className="hero" style={{marginBottom:12}}>
            <div className="tc" style={{color:'#C8A84070',marginBottom:12}}>Reflection · {chart.name}</div>
            <div style={{fontFamily:'Spectral,serif',fontSize:14,lineHeight:1.9,color:'#EDE4CC'}}>{reflection}</div>
          </div>
          <div style={{display:'flex',gap:8,marginBottom:16}}>
            <button className="bs" style={{flex:1}} onClick={saveToCodex} disabled={saved}>{saved?'Saved ✦':'Save to Codex'}</button>
            <button className="bg" style={{flex:1}} onClick={()=>setReflection('')}>Discard</button>
          </div>
        </div>
      )}
      {codexEntries.filter(e=>e.type==='intention').length>0&&(
        <div>
          <div className="sec"><div className="tl">Recent Intentions</div><div className="sl2"/></div>
          {codexEntries.filter(e=>e.type==='intention').slice(0,3).map((e,i)=>(
            <div key={i} style={{padding:'12px 14px',background:'var(--bgc)',borderRadius:12,border:'1px solid var(--bl)',marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <div className="tb" style={{fontSize:13,color:'var(--ink)'}}>{e.title}</div>
                <span className={`tag ${e.status==='done'?'tdn':e.status==='seed'?'tlu':'tnot'}`} style={{background:'var(--bgm)',color:'var(--mut)',border:'1px solid var(--bl)'}}>{e.status||'seed'}</span>
              </div>
              <div className="tc">{e.moonPhase}{e.personalDay?` · PD ${e.personalDay}`:''} · {new Date(e.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CODEX PAGE ───────────────────────────────────────────────────────────────
// ─── CALENDAR PAGE ────────────────────────────────────────────────────────────
// ─── HOLIDAYS & OBSERVANCES ───────────────────────────────────────────────────
// Presented factually, across traditions, without asserting any one as more true
// than another. Fixed-date entries compute for any year; moveable lunar/lunisolar
// dates (Islamic, Jewish, Hindu, Lunar New Year, Easter) are hardcoded per year —
// Islamic dates specifically are inherently approximate ahead of moon sighting,
// same honesty standard the rest of this app applies to any estimated data.
const HOLIDAYS_FIXED=[
  {m:1,d:1,name:"New Year's Day",trad:'Secular'},
  {m:2,d:1,name:'Imbolc',trad:'Wheel of the Year',note:'Midpoint between winter solstice and spring equinox — associated with Brigid and the first stirrings of spring.'},
  {m:2,d:2,name:'Candlemas',trad:'Christian',note:'Presentation of Jesus at the Temple; folk traditions overlap it with Imbolc.'},
  {m:2,d:14,name:"Valentine's Day",trad:'Secular'},
  {m:3,d:17,name:"St. Patrick's Day",trad:'Christian / Secular'},
  {m:5,d:1,name:'Beltane',trad:'Wheel of the Year',note:'Midpoint between spring equinox and summer solstice — fire festival marking the start of summer.'},
  {m:8,d:1,name:'Lughnasadh / Lammas',trad:'Wheel of the Year',note:'First harvest festival, midpoint between summer solstice and autumn equinox.'},
  {m:10,d:31,name:'Samhain',trad:'Wheel of the Year',note:'The old new year — the veil between worlds is said to be thinnest. Root of modern Halloween.'},
  {m:10,d:31,name:'Halloween',trad:'Secular'},
  {m:11,d:1,name:"All Saints' Day",trad:'Christian'},
  {m:11,d:2,name:'Día de los Muertos',trad:'Mexican / Catholic',note:'Day of the Dead — honoring deceased loved ones, celebrated Nov 1–2.'},
  {m:12,d:25,name:'Christmas',trad:'Christian'},
  {m:12,d:26,name:'Kwanzaa begins',trad:'Cultural',note:'Week-long celebration of African-American heritage and culture, through Jan 1.'},
];
const HOLIDAYS_MOVEABLE={
  2025:[
    {m:1,d:29,name:'Lunar New Year',trad:'Lunar',note:'Year of the Snake begins.'},
    {m:3,d:1,name:'Ramadan begins',trad:'Islamic',note:'Approximate — official start depends on moon sighting.'},
    {m:3,d:14,name:'Holi',trad:'Hindu',note:'Festival of Colors.'},
    {m:3,d:20,name:'Ostara / Spring Equinox',trad:'Wheel of the Year'},
    {m:3,d:30,name:'Eid al-Fitr',trad:'Islamic',note:'End of Ramadan — approximate.'},
    {m:4,d:20,name:'Easter Sunday',trad:'Christian'},
    {m:6,d:6,name:'Eid al-Adha',trad:'Islamic',note:'Approximate.'},
    {m:6,d:20,name:'Litha / Summer Solstice',trad:'Wheel of the Year'},
    {m:9,d:22,name:'Rosh Hashanah begins',trad:'Jewish'},
    {m:9,d:22,name:'Mabon / Autumn Equinox',trad:'Wheel of the Year'},
    {m:10,d:1,name:'Yom Kippur',trad:'Jewish'},
    {m:10,d:20,name:'Diwali',trad:'Hindu / Sikh / Jain',note:'Festival of Lights.'},
    {m:12,d:14,name:'Hanukkah begins',trad:'Jewish'},
    {m:12,d:21,name:'Yule / Winter Solstice',trad:'Wheel of the Year'},
  ],
  2026:[
    {m:2,d:17,name:'Lunar New Year',trad:'Lunar',note:'Year of the Horse begins.'},
    {m:2,d:19,name:'Ramadan begins',trad:'Islamic',note:'Approximate — official start depends on moon sighting.'},
    {m:3,d:4,name:'Holi',trad:'Hindu',note:'Festival of Colors.'},
    {m:3,d:21,name:'Eid al-Fitr',trad:'Islamic',note:'End of Ramadan — approximate.'},
    {m:3,d:20,name:'Ostara / Spring Equinox',trad:'Wheel of the Year'},
    {m:4,d:5,name:'Easter Sunday',trad:'Christian'},
    {m:5,d:27,name:'Eid al-Adha',trad:'Islamic',note:'Approximate.'},
    {m:6,d:21,name:'Litha / Summer Solstice',trad:'Wheel of the Year'},
    {m:9,d:11,name:'Rosh Hashanah begins',trad:'Jewish'},
    {m:9,d:20,name:'Yom Kippur',trad:'Jewish'},
    {m:9,d:23,name:'Mabon / Autumn Equinox',trad:'Wheel of the Year'},
    {m:11,d:8,name:'Diwali',trad:'Hindu / Sikh / Jain',note:'Festival of Lights.'},
    {m:12,d:4,name:'Hanukkah begins',trad:'Jewish'},
    {m:12,d:21,name:'Yule / Winter Solstice',trad:'Wheel of the Year'},
  ],
  2027:[
    {m:2,d:6,name:'Lunar New Year',trad:'Lunar',note:'Year of the Goat begins.'},
    {m:2,d:8,name:'Ramadan begins',trad:'Islamic',note:'Approximate.'},
    {m:3,d:9,name:'Eid al-Fitr',trad:'Islamic',note:'Approximate.'},
    {m:3,d:20,name:'Ostara / Spring Equinox',trad:'Wheel of the Year'},
    {m:3,d:22,name:'Holi',trad:'Hindu',note:'Festival of Colors.'},
    {m:3,d:28,name:'Easter Sunday',trad:'Christian'},
    {m:5,d:16,name:'Eid al-Adha',trad:'Islamic',note:'Approximate.'},
    {m:6,d:21,name:'Litha / Summer Solstice',trad:'Wheel of the Year'},
    {m:9,d:23,name:'Mabon / Autumn Equinox',trad:'Wheel of the Year'},
    {m:10,d:2,name:'Rosh Hashanah begins',trad:'Jewish'},
    {m:10,d:11,name:'Yom Kippur',trad:'Jewish'},
    {m:10,d:29,name:'Diwali',trad:'Hindu / Sikh / Jain',note:'Festival of Lights.'},
    {m:12,d:21,name:'Yule / Winter Solstice',trad:'Wheel of the Year'},
    {m:12,d:25,name:'Hanukkah begins',trad:'Jewish'},
  ],
};
function getHolidays(date){
  const y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();
  const fixed=HOLIDAYS_FIXED.filter(h=>h.m===m&&h.d===d);
  const moveable=(HOLIDAYS_MOVEABLE[y]||[]).filter(h=>h.m===m&&h.d===d);
  return[...fixed,...moveable];
}
const TRAD_COL={'Wheel of the Year':'#5A7850','Christian':'#7A5040','Jewish':'#4A6890','Islamic':'#508070','Hindu / Sikh / Jain':'#B0722A','Hindu':'#B0722A','Lunar':'#8C3050','Secular':'var(--mut)','Christian / Secular':'#7A5040','Cultural':'#7A5A90','Mexican / Catholic':'#A05038'};

function CalendarPage({chart,loc,codexEntries,onSetLoc}){
  const today=new Date();
  const[vm,setVm]=useState(today.getMonth());
  const[vy,setVy]=useState(today.getFullYear());
  const[sel,setSel]=useState(today);
  const[dTab,setDTab]=useState('overview');
  const[showLocEdit,setShowLocEdit]=useState(false);
  const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const TC={open:'var(--open)',tens:'var(--tens)',avoid:'var(--avoid)'};
  const TL={open:'Open window',tens:'Navigate',avoid:'Close the door'};
  const selAln=useMemo(()=>buildAlign(chart,sel,loc),[chart,sel,loc]);
  const firstDay=new Date(vy,vm,1).getDay();
  const daysInMonth=new Date(vy,vm+1,0).getDate();
  const daysInPrev=new Date(vy,vm,0).getDate();
  const days=[];
  for(let i=firstDay-1;i>=0;i--)days.push({day:daysInPrev-i,other:true,date:new Date(vy,vm-1,daysInPrev-i)});
  let prevPhaseName=getMoon(new Date(vy,vm,0)).name;
  for(let i=1;i<=daysInMonth;i++){
    const d=new Date(vy,vm,i);
    const moon=getMoon(d);
    const moonChange=moon.name!==prevPhaseName; // true only on the day the phase actually turns
    prevPhaseName=moon.name;
    const isToday=d.toDateString()===today.toDateString();
    const isSel=d.toDateString()===sel.toDateString();
    const logged=(codexEntries||[]).some(e=>e.date&&new Date(e.date).toDateString()===d.toDateString());
    const holidays=getHolidays(d);
    const holidayCol=holidays.length>0?(TRAD_COL[holidays.find(h=>h.trad!=='Secular')?.trad]||TRAD_COL[holidays[0].trad]||'#7A5A90'):null;
    days.push({day:i,other:false,date:d,moon,moonChange,isToday,isSel,logged,holidays,holidayCol});
  }
  const needed=Math.ceil(days.length/7)*7;
  for(let i=1;days.length<needed;i++)days.push({day:i,other:true,date:new Date(vy,vm+1,i)});
  const selMoon=getMoon(sel);
  const selWorkings=(codexEntries||[]).filter(e=>e.date&&new Date(e.date).toDateString()===sel.toDateString());

  return(
    <div className="scr ent" style={{padding:'20px 16px 0'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <button onClick={()=>{const d=new Date(vy,vm-1,1);setVm(d.getMonth());setVy(d.getFullYear());}} style={{background:'var(--bgm)',border:'none',borderRadius:8,color:'var(--mut)',padding:'8px 14px',cursor:'pointer',fontFamily:'Inter',fontSize:14}}>‹</button>
        <div className="td" style={{fontSize:20}}>{MN[vm]} {vy}</div>
        <button onClick={()=>{const d=new Date(vy,vm+1,1);setVm(d.getMonth());setVy(d.getFullYear());}} style={{background:'var(--bgm)',border:'none',borderRadius:8,color:'var(--mut)',padding:'8px 14px',cursor:'pointer',fontFamily:'Inter',fontSize:14}}>›</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:4}}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=><div key={d} className="tc" style={{textAlign:'center',padding:'4px 0'}}>{d}</div>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:20}}>
        {days.map((d,i)=>(
          <div key={i} onClick={()=>!d.other&&setSel(d.date)} style={{aspectRatio:'1',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter',fontSize:12,color:d.other?'var(--ghost)':d.isToday?'var(--gold)':'var(--body)',fontWeight:d.isToday?500:400,borderRadius:8,cursor:d.other?'default':'pointer',background:d.isSel?'var(--bgm)':'transparent',border:d.isSel?'1px solid var(--bm)':'1px solid transparent',position:'relative'}}>
            {!d.other&&d.moonChange&&<span style={{position:'absolute',top:1,fontSize:9,lineHeight:1}}>{d.moon.emoji}</span>}
            <span>{d.day}</span>
            {!d.other&&<div style={{display:'flex',gap:2,marginTop:2}}>
              <div style={{width:4,height:4,borderRadius:'50%',background:TC[d.moon.tier]}}/>
              {d.logged&&<div style={{width:4,height:4,borderRadius:'50%',background:'var(--gold)'}}/>}
              {d.holidayCol&&<div style={{width:4,height:4,borderRadius:'50%',background:d.holidayCol}}/>}
            </div>}
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:12,marginBottom:18,flexWrap:'wrap'}}>
        {[['var(--open)','Open'],['var(--tens)','Navigate'],['var(--avoid)','Close'],['var(--gold)','Logged'],['#5A7850','Wheel of Year'],['#8C3050','Lunar/Chinese']].map(([c,l])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:6,height:6,borderRadius:'50%',background:c}}/><span className="tb" style={{fontSize:11,color:'var(--mut)'}}>{l}</span></div>
        ))}
      </div>

      <div style={{marginBottom:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div className="td" style={{fontSize:18}}>{sel.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
          <span style={{fontFamily:'Inter',fontSize:9,letterSpacing:'.08em',textTransform:'uppercase',color:TC[selAln.tier]}}>{TL[selAln.tier]}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <div style={{flex:1,height:6,borderRadius:3,background:'var(--bl)',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${selAln.score}%`,borderRadius:3,background:TC[selAln.tier]}}/>
          </div>
          <span style={{fontFamily:'Inter',fontSize:12,color:'var(--mut)',flexShrink:0}}>{selAln.score}/100</span>
        </div>

        <div style={{display:'flex',gap:5,marginBottom:12,overflowX:'auto',paddingBottom:2}}>
          {[['overview','Day'],['hours','Now'],['week','Week'],['season','Season & Year'],['divine','Divine Timings']].map(([k,l])=>(
            <button key={k} className={`chip ${dTab===k?'on':''}`} style={{fontSize:9,whiteSpace:'nowrap'}} onClick={()=>setDTab(k)}>{l}</button>
          ))}
        </div>

        {dTab==='overview'&&(
          <div>
            {getHolidays(sel).length>0&&(
              <div className="card" style={{padding:'14px',marginBottom:10}}>
                <div className="tc" style={{marginBottom:8}}>Today's Observances</div>
                {getHolidays(sel).map((h,i)=>(
                  <div key={i} style={{marginBottom:i<getHolidays(sel).length-1?10:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                      <span style={{fontFamily:'Fraunces,serif',fontSize:15,color:'var(--ink)'}}>{h.name}</span>
                      <span style={{fontFamily:'Inter',fontSize:8,letterSpacing:'.06em',textTransform:'uppercase',color:TRAD_COL[h.trad]||'var(--mut)',background:'var(--bgm)',padding:'2px 8px',borderRadius:20}}>{h.trad}</span>
                    </div>
                    {h.note&&<div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.5}}>{h.note}</div>}
                  </div>
                ))}
              </div>
            )}
            <div className="card" style={{padding:'14px',marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <div style={{display:'flex',gap:8,alignItems:'center'}}><span style={{fontSize:16}}>{selMoon.emoji}</span><span className="tb" style={{fontSize:13}}>{selMoon.name}</span></div>
                <span className="tc">{selAln.wd.name}</span>
              </div>
              <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.6,marginBottom:selAln.retro.length>0?6:0}}>{selMoon.energy}</div>
              {selAln.retro.length>0&&<div className="tb" style={{fontSize:11,color:'var(--tens)'}}>⚠ {selAln.retro.map(r=>`${r.planet} retrograde (ends ${r.endLabel})`).join(' · ')}</div>}
            </div>
            {selWorkings.length>0&&(
              <div className="card" style={{padding:'14px',marginBottom:10}}>
                <div className="tc" style={{marginBottom:8}}>Logged this day</div>
                {selWorkings.map((w,i)=><div key={i} className="tb" style={{fontSize:13,marginBottom:i<selWorkings.length-1?6:0}}>{w.title}</div>)}
              </div>
            )}
            {(selAln.opens.length>0||selAln.tens.length>0||selAln.avoids.length>0)&&(
              <div className="card" style={{padding:'14px',marginBottom:10}}>
                {selAln.opens.map((o,i)=><div key={'o'+i} className="tb" style={{fontSize:12,color:'var(--open)',marginBottom:4}}>✦ {o.text}</div>)}
                {selAln.tens.map((t,i)=><div key={'t'+i} className="tb" style={{fontSize:12,color:'var(--tens)',marginBottom:4}}>· {t.text}</div>)}
                {selAln.avoids.map((a,i)=><div key={'a'+i} className="tb" style={{fontSize:12,color:'var(--avoid)',marginBottom:4}}>— {a.text}</div>)}
              </div>
            )}
            {selAln.hi.map((h,i)=>(
              <div key={i} className="sg" style={{padding:'11px 14px',marginBottom:6}}>
                <div className="tc" style={{marginBottom:2,color:'var(--gold)'}}>{h.src}</div>
                <div className="tb" style={{fontSize:13,lineHeight:1.6}}>{h.text}</div>
              </div>
            ))}
            {(()=>{const ck2=dCK(chart,sel);return(
              <div style={{background:ck2.col+'18',border:`1px solid ${ck2.col}32`,borderRadius:14,padding:'13px 15px',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}>
                  <div style={{width:18,height:18,borderRadius:'50%',background:ck2.col,opacity:.85,flexShrink:0}}/>
                  <div className="tl" style={{marginBottom:0}}>{ck2.name} Chakra</div>
                </div>
                <div className="tb" style={{fontSize:12,lineHeight:1.6,marginBottom:6}}>{ck2.reason}</div>
                <WhyBtn text={ck2.why}/>
              </div>
            );})()}
            {(()=>{const ck3=dCK(chart,sel);const freq=getActiveFrequency(ck3.name);return(
              <div style={{background:'var(--lbg)',border:'1px solid var(--lbdr)',borderRadius:14,padding:'13px 15px',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}>
                  <div style={{width:18,height:18,borderRadius:'50%',background:'var(--lun)',opacity:.85,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <span style={{fontSize:9,color:'#fff'}}>♪</span>
                  </div>
                  <div className="tl" style={{marginBottom:0,color:'var(--lun)'}}>{freq.hz} Hz · {freq.name}</div>
                </div>
                <div className="tb" style={{fontSize:12,lineHeight:1.6,marginBottom:4}}>{freq.desc}</div>
                <div className="tc" style={{marginBottom:6}}>Paired with your {ck3.name} chakra today</div>
                <WhyBtn text={freq.why}/>
              </div>
            );})()}
            <WorkingsGuide aln={selAln} compact chart={chart}/>
          </div>
        )}

        {dTab==='hours'&&(
          <div>
            {!loc?(
              <div className="card" style={{padding:'16px',marginBottom:10}}>
                <div className="tb" style={{fontSize:13,color:'var(--mut)',marginBottom:10}}>Add your city to unlock the hour-by-hour planetary timeline.</div>
                {showLocEdit?(
                  <LocationPrompt onSet={l=>{onSetLoc(l);setShowLocEdit(false);}}/>
                ):<button className="bp" onClick={()=>setShowLocEdit(true)}>Add My City</button>}
                <WhyBtn text="Planetary hours divide each day into 24 segments governed by the seven classical planets. The hour shapes the quality of what you do in it — different planetary energies support different kinds of work."/>
              </div>
            ):selAln.allHrs&&(()=>{
              const hours=selAln.allHrs.hours;
              const isSelToday=sel.toDateString()===today.toDateString();
              const morning=hours.filter(h=>h.isDay).slice(0,6);
              const afternoon=hours.filter(h=>h.isDay).slice(6,12);
              const evening=hours.filter(h=>!h.isDay).slice(0,6);
              const night=hours.filter(h=>!h.isDay).slice(6,12);
              const HourBlock=({h})=>{
                const[open2,setOpen2]=useState(false);
                const col=h.pl.tier==='avoid'?'var(--avoid)':h.pl.tier==='tens'?'var(--tens)':'var(--open)';
                const bg=h.pl.tier==='avoid'?'var(--abg)':h.pl.tier==='tens'?'var(--tbg)':'var(--obg)';
                const bdr=h.pl.tier==='avoid'?'var(--abdr)':h.pl.tier==='tens'?'var(--tbdr)':'var(--obdr)';
                const showCurr=isSelToday&&h.isCurr,showPast=isSelToday&&h.isPast;
                return(
                  <div style={{marginBottom:3}}>
                    <div onClick={()=>!showPast&&setOpen2(v=>!v)} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',background:showCurr?'var(--gbg)':showPast?'transparent':'var(--bgc)',borderRadius:10,border:`1px solid ${showCurr?'var(--gbdr)':'var(--bl)'}`,opacity:showPast?.4:1,cursor:showPast?'default':'pointer'}}>
                      <span style={{color:showCurr?'var(--gold)':showPast?'var(--dim)':h.pl.col,fontSize:13,width:16,textAlign:'center',flexShrink:0}}>{h.pl.sym}</span>
                      <span className="tb" style={{fontSize:11,color:showCurr?'var(--ink)':showPast?'var(--dim)':'var(--mut)',width:62,flexShrink:0}}>{h.label}</span>
                      <span style={{width:60,fontFamily:'Inter',fontSize:9,letterSpacing:'.06em',textTransform:'uppercase',color:showCurr?'var(--gold)':showPast?'var(--dim)':col,flexShrink:0}}>{h.ruler}{showCurr?' ◉':''}</span>
                      <div style={{flex:1,display:'flex',gap:4,flexWrap:'wrap',justifyContent:'flex-end',opacity:showPast?.6:1}}>
                        {h.pl.best.slice(0,2).map(b=><span key={b} style={{background:showPast?'transparent':'var(--bgc)',border:`1px solid ${showPast?'var(--bl)':bdr}`,borderRadius:20,padding:'1px 8px',color:showPast?'var(--dim)':col,fontFamily:'Inter',fontSize:8,whiteSpace:'nowrap'}}>{b}</span>)}
                      </div>
                    </div>
                    {open2&&!showPast&&(
                      <div style={{background:bg,border:`1px solid ${bdr}`,borderRadius:10,padding:'12px 14px',marginTop:3,marginBottom:3}}>
                        <div className="tb" style={{fontSize:13,lineHeight:1.7,marginBottom:8}}>{h.pl.why.split('.')[0]}.</div>
                        <div style={{marginBottom:6}}>
                          <div className="tc" style={{marginBottom:4,color:col}}>Best for</div>
                          <div style={{display:'flex',flexWrap:'wrap',gap:4}}>{h.pl.best.map(b=><span key={b} style={{background:'var(--bgc)',border:`1px solid ${bdr}`,borderRadius:20,padding:'2px 9px',color:col,fontFamily:'Inter',fontSize:9}}>{b}</span>)}</div>
                        </div>
                        {h.pl.avoid.length>0&&<div><div className="tc" style={{marginBottom:4,color:'var(--avoid)'}}>Avoid</div><div className="tb" style={{fontSize:12,color:'var(--avoid)'}}>{h.pl.avoid.join(', ')}</div></div>}
                        {showCurr&&<div className="tc" style={{marginTop:6,color:'var(--gold)'}}>{h.minLeft}m remaining</div>}
                      </div>
                    )}
                  </div>
                );
              };
              const Section=({label,hrs,emoji})=>(
                <div style={{marginBottom:14}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                    <span style={{fontSize:12}}>{emoji}</span><div className="tc">{label}</div>
                    <div style={{display:'flex',gap:2,marginLeft:4}}>{hrs.map((h,i)=><div key={i} style={{width:8,height:6,borderRadius:2,background:isSelToday&&h.isPast?'var(--bl)':h.pl.tier==='open'?'var(--open)':h.pl.tier==='avoid'?'var(--avoid)':'var(--tens)',opacity:isSelToday&&h.isPast?.3:1}}/>)}</div>
                  </div>
                  {hrs.map((h,i)=><HourBlock key={i} h={h}/>)}
                </div>
              );
              return(
                <div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                    <div className="tc">📍 {loc.city}</div>
                    <button onClick={()=>setShowLocEdit(true)} style={{background:'none',border:'none',color:'var(--dim)',fontFamily:'Inter',fontSize:9,letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer'}}>Change</button>
                  </div>
                  {showLocEdit&&<div style={{marginBottom:10}}><LocationPrompt current={loc} onSet={l=>{onSetLoc(l);setShowLocEdit(false);}} inline/></div>}
                  <div style={{display:'flex',gap:12,marginBottom:12,padding:'8px 12px',background:'var(--bgm)',borderRadius:10}}>
                    {[['var(--open)','Open'],['var(--tens)','Navigate'],['var(--avoid)','Close door']].map(([c,l])=>(<div key={l} style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:10,height:10,borderRadius:2,background:c}}/><div className="tc">{l}</div></div>))}
                  </div>
                  <Section label="Morning" hrs={morning} emoji="🌅"/>
                  <Section label="Afternoon" hrs={afternoon} emoji="☀️"/>
                  <Section label="Evening" hrs={evening} emoji="🌆"/>
                  <Section label="Night" hrs={night} emoji="🌙"/>
                </div>
              );
            })()}
          </div>
        )}

        {dTab==='week'&&(
          <div>
            <div className="ins" style={{padding:'12px 14px',marginBottom:10}}>
              <div className="tl" style={{marginBottom:2}}>This Week</div>
              <div className="tc">Personal Month {selAln.pm} · Personal Year {selAln.py}</div>
            </div>
            {Array.from({length:7},(_,i)=>{
              const d=new Date(sel);d.setDate(sel.getDate()-sel.getDay()+i);
              const wpy=pY(chart.dob,d.getFullYear()),wpm=pM(wpy,d.getMonth()+1),wpd=pD(wpm,d.getDate());
              const wd=WK[d.getDay()],pdM=PDM[wpd],isT=d.toDateString()===today.toDateString();
              const tier=wd.tier==='avoid'?'avoid':pdM?.tier==='tens'&&wd.tier!=='open'?'tens':pdM?.tier==='open'&&wd.tier==='open'?'open':'tens';
              return(
                <div key={i} onClick={()=>setSel(d)} style={{display:'flex',gap:12,alignItems:'center',padding:'10px 12px',background:isT?'var(--bgd)':'var(--bgc)',borderRadius:12,border:`1px solid ${isT?'transparent':'var(--bl)'}`,marginBottom:5,cursor:'pointer'}}>
                  <div style={{minWidth:40,textAlign:'center'}}>
                    <div className="tc" style={{color:isT?'#C8A84060':'var(--dim)'}}>{d.toLocaleDateString('en-US',{weekday:'short'})}</div>
                    <div className="td" style={{fontSize:20,color:isT?'var(--gbr)':'var(--ink)'}}>{d.getDate()}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:2}}>
                      <span style={{color:PL[wd.planet]?.col||'var(--mut)',fontSize:12}}>{PL[wd.planet]?.sym}</span>
                      <span style={{fontFamily:'Inter',fontSize:10,letterSpacing:'.06em',textTransform:'uppercase',color:isT?'#EDE4CC':'var(--body)'}}>PD {wpd} · {pdM?.theme||'Steady'}</span>
                    </div>
                    <div className="tb" style={{fontSize:12,color:isT?'#B0A070':'var(--mut)',lineHeight:1.5}}>{wd.planet} day{pdM?` · ${pdM.desc.split('.')[0]}`:''}</div>
                  </div>
                  <span className={`tag ${tier==='open'?'to':tier==='avoid'?'tav':'tt'}`} style={{fontSize:8,flexShrink:0}}>{tier==='open'?'Open':tier==='avoid'?'Close door':'Navigate'}</span>
                </div>
              );
            })}
          </div>
        )}

        {dTab==='season'&&(
          <div>
            {(()=>{const zhYear=chZ(sel.getFullYear(),sel.getMonth()+1,sel.getDate());return(
              <div className="ins" style={{padding:'14px 16px',marginBottom:12,display:'flex',alignItems:'center',gap:12}}>
                <div style={{fontSize:30}}>{zhYear.emoji}</div>
                <div><div className="tl" style={{marginBottom:2}}>Year of the {zhYear.full}</div><div className="tc">Chinese zodiac year — {sel.getFullYear()}</div></div>
              </div>
            );})()}
            <div style={{background:selAln.season.tier==='open'?'var(--obg)':'var(--tbg)',border:`1px solid ${selAln.season.tier==='open'?'var(--obdr)':'var(--tbdr)'}`,borderRadius:16,padding:'18px',marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
                <div style={{fontSize:32}}>{selAln.season.emoji}</div>
                <div><div className="tl" style={{marginBottom:3}}>{selAln.season.name} · {selAln.season.el}</div><span className={`tag ${selAln.season.tier==='open'?'to':'tt'}`}>{selAln.season.tier==='open'?'Open Window':'Navigate'}</span></div>
              </div>
              <div className="tb" style={{fontSize:14,lineHeight:1.8,marginBottom:8}}>{selAln.season.energy}</div>
              <div className="tb" style={{fontSize:13,lineHeight:1.7,color:'var(--mut)'}}>{selAln.season.best||selAln.season.nav}</div>
            </div>
            <div className="card" style={{padding:'18px',marginBottom:12}}>
              <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:10}}>
                <div className="td" style={{fontSize:48,color:'var(--gold)'}}>{selAln.py}</div>
                <div><div className="tl">Personal Year</div><div className="tc">{PYM[selAln.py]?.theme}</div></div>
                <div style={{marginLeft:'auto'}}><span className={`tag ${PYM[selAln.py]?.tier==='open'?'to':'tt'}`}>{PYM[selAln.py]?.tier==='open'?'Open':'Navigate'}</span></div>
              </div>
              <div className="tb" style={{fontSize:14,lineHeight:1.8,marginBottom:12}}>{PYM[selAln.py]?.desc}</div>
              <div style={{display:'flex',gap:3,marginBottom:6}}>{[1,2,3,4,5,6,7,8,9].map(n=><div key={n} style={{flex:1,height:6,borderRadius:3,background:n===selAln.py?'var(--gold)':n<selAln.py?'var(--bm)':'var(--bl)'}}/>)}</div>
              <div className="tc" style={{textAlign:'right'}}>Year {selAln.py} of 9</div>
            </div>
            {getUpcoming(chart,sel).slice(0,4).map((ev,i)=>(
              <div key={i} style={{padding:'14px',background:'var(--bgc)',borderRadius:12,border:'1px solid var(--bl)',marginBottom:8}}>
                <div style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:8}}>
                  <div style={{fontSize:20,lineHeight:1,marginTop:2}}>{ev.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><div className="tl">{ev.label}</div><div className="tc">in {ev.daysAway}d</div></div>
                    <div className="tb" style={{fontSize:12,lineHeight:1.6}}>{ev.energy}</div>
                    {ev.personal&&<div className="tb" style={{fontSize:12,color:'var(--mut)',fontStyle:'italic',marginTop:2}}>{ev.personal}</div>}
                  </div>
                </div>
              </div>
            ))}
            {loc&&(
              <div className="sl" style={{padding:'14px 16px'}}>
                <div className="tl" style={{color:'var(--lun)',marginBottom:6}}>Your Location · 📍 {loc.city}</div>
                <div className="tb" style={{fontSize:13,lineHeight:1.7}}>{Math.abs(loc.lat).toFixed(1)}° {loc.lat>0?'N':'S'} — {Math.abs(loc.lat)<=23.5?'Tropical zone: seasonal shifts are subtle, moon cycles and numerology carry more weight in your timing than season does.':Math.abs(loc.lat)<=66.5?'Temperate zone: the seasonal cycle maps closely onto the 9-year numerological cycle.':'Polar zone: extreme light and dark create powerful liminal energy — especially around solstices.'}</div>
              </div>
            )}
          </div>
        )}
        {dTab==='divine'&&(
          <div>
            <div className="tc" style={{marginBottom:12}}>Moon phases, sacred days, and retrogrades — next 6 weeks</div>
            {getDivineTimings(sel).slice(0,10).map((ev,i)=>(
              <div key={i} style={{padding:'14px',background:ev.active?'var(--tbg)':'var(--bgc)',border:`1px solid ${ev.active?'var(--tbdr)':'var(--bl)'}`,borderRadius:12,marginBottom:8}}>
                <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                  <div style={{fontSize:18,lineHeight:1,marginTop:2,color:ev.col}}>{ev.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3,gap:8}}>
                      <div className="tl" style={{color:ev.col}}>{ev.label}</div>
                      <div className="tc" style={{flexShrink:0}}>{ev.active?'now':ev.daysAway===0?'today':`in ${ev.daysAway}d`}</div>
                    </div>
                    {ev.trad&&<div className="tc" style={{marginBottom:3}}>{ev.trad}</div>}
                    <div className="tb" style={{fontSize:12,lineHeight:1.6}}>{ev.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CodexPage({entries,chart,loc,onUpdate,onDelete,onAdd}){
  const[filter,setFilter]=useState('all');
  const[search,setSearch]=useState('');
  const[sel,setSel]=useState(null);
  const[showAdd,setShowAdd]=useState(false);
  const[addT,setAddT]=useState('');
  const[addTy,setAddTy]=useState('note');
  const[addSt,setAddSt]=useState('seed');
  const[addN,setAddN]=useState('');
  const[outcome,setOutcome]=useState('');
  const ICO={done:'✦',planned:'◈',seed:'◌',note:'—',reference:'⊕'};

  const filtered=(entries||[]).filter(e=>{
    if(filter!=='all'&&(e.status||'note')!==filter)return false;
    if(search&&!(e.title||'').toLowerCase().includes(search.toLowerCase())&&!(e.notes||'').toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });

  const codexInsights=useMemo(()=>buildCodexInsights(entries),[entries]);
  const patterns=useMemo(()=>{
    const ps=[...codexInsights.insights.map(i=>i.text)];
    const seeds=(entries||[]).filter(e=>e.status==='seed');
    if(seeds.length>=3)ps.push(`${seeds.length} seeds are waiting. Which one is ready to move forward?`);
    return ps;
  },[entries,codexInsights]);

  const todayAln=useMemo(()=>chart?buildAlign(chart,new Date(),loc):null,[chart,loc]);

  if(sel!==null&&entries[sel]){
    const e=entries[sel];
    const statusFlow={seed:['planned','done'],planned:['done','seed'],done:['planned','seed'],note:['seed','planned']};
    const nextStatuses=statusFlow[e.status||'note']||['seed','planned','done'];
    const isUnfinished=e.status!=='done';
    return(
      <div className="scr ent" style={{padding:'20px 16px 0'}}>
        <button onClick={()=>setSel(null)} style={{background:'none',border:'none',color:'var(--mut)',fontFamily:'Inter',fontSize:11,letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer',padding:'0 0 16px',display:'block'}}>← Back</button>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
          <div className="td" style={{fontSize:22,flex:1,marginRight:12,lineHeight:1.3}}>{e.title||'Untitled'}</div>
          <span style={{background:'var(--bgm)',color:'var(--mut)',border:'1px solid var(--bl)',padding:'3px 10px',borderRadius:20,fontFamily:'Inter',fontSize:9,flexShrink:0}}>{ICO[e.status||'note']} {e.status||'note'}</span>
        </div>
        <div className="tc" style={{marginBottom:14}}>{e.type&&`${e.type} · `}{e.moonPhase&&`${e.moonPhase} · `}{e.date&&new Date(e.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
        {e.notes&&<div className="card" style={{padding:'16px',marginBottom:12}}><div className="tb" style={{fontSize:14,lineHeight:1.85,whiteSpace:'pre-wrap'}}>{e.notes}</div></div>}
        {e.outcome&&<div className="so" style={{padding:'14px',marginBottom:12}}><div className="tl" style={{color:'var(--open)',marginBottom:5}}>Outcome</div><div className="tb" style={{fontSize:13,lineHeight:1.7}}>{e.outcome}</div></div>}

        {isUnfinished&&todayAln&&(
          <div style={{marginBottom:12}}>
            <div className="tl" style={{marginBottom:8}}>If you act on this now</div>
            <WorkingsGuide aln={todayAln} compact chart={chart}/>
          </div>
        )}

        {e.status!=='done'&&(
          <div style={{marginBottom:12}}>
            <div className="tl" style={{marginBottom:8}}>Record what happened</div>
            <textarea className="fld" rows={3} placeholder="What unfolded? Any shifts, signs, or results…" value={outcome} onChange={ev=>setOutcome(ev.target.value)} style={{fontSize:13,marginBottom:8}}/>
            <button className="bs" style={{opacity:outcome.trim()?1:.4}} disabled={!outcome.trim()} onClick={()=>{onUpdate(sel,{...e,outcome,status:'done'});setOutcome('');setSel(null);}}>Save & Mark Done</button>
          </div>
        )}
        <div className="tl" style={{marginBottom:8}}>Move this entry</div>
        <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}}>
          {nextStatuses.map(s=>(
            <button key={s} className="bg" style={{fontSize:10,flex:'1 1 auto',minWidth:90}} onClick={()=>{onUpdate(sel,{...e,status:s});setSel(null);}}>{ICO[s]} Mark {s}</button>
          ))}
        </div>
        <button className="bg" style={{color:'var(--avoid)',borderColor:'var(--abdr)',fontSize:10}} onClick={()=>{if(confirm('Delete this entry? This cannot be undone.')){onDelete(sel);setSel(null);}}}>Delete Entry</button>
      </div>
    );
  }

  return(
    <div className="scr ent" style={{padding:'20px 16px 0'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div>
          <div className="td" style={{fontSize:26}}>Codex</div>
          <div className="tc" style={{marginTop:2}}>{(entries||[]).length} {(entries||[]).length===1?'entry':'entries'}</div>
        </div>
        <button onClick={()=>setShowAdd(true)} style={{background:'var(--gbg)',color:'var(--gold)',border:'1px solid var(--gbdr)',borderRadius:10,padding:'9px 16px',fontFamily:'Inter',fontSize:11,letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer'}}>+ New</button>
      </div>
      <input className="fld" style={{fontSize:13,marginBottom:10}} placeholder="Search your codex…" value={search} onChange={e=>setSearch(e.target.value)}/>
      <div style={{display:'flex',gap:5,marginBottom:14,overflowX:'auto',paddingBottom:4}}>
        {[['all','All'],['seed','Seeds'],['planned','Active'],['done','Done'],['note','Notes']].map(([k,l])=>(
          <button key={k} className={`chip ${filter===k?'on':''}`} onClick={()=>setFilter(k)} style={{fontSize:9,whiteSpace:'nowrap'}}>{l}</button>
        ))}
      </div>
      {patterns.length>0&&filter==='all'&&!search&&(
        <div style={{marginBottom:12}}>
          <div className="sec"><div className="tl">Patterns</div><div className="sl2"/></div>
          {patterns.map((p,i)=>(
            <div key={i} className="sg" style={{padding:'11px 14px',marginBottom:6}}>
              <div className="tb" style={{fontSize:13,color:'var(--gold)',lineHeight:1.6}}>✦ {p}</div>
            </div>
          ))}
        </div>
      )}
      {!codexInsights.ready&&codexInsights.sampleSize>0&&filter==='all'&&!search&&(
        <div className="ins" style={{padding:'12px 14px',marginBottom:12}}>
          <div className="tc" style={{marginBottom:3}}>Learning your patterns</div>
          <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.6}}>{PATTERN_MIN_SAMPLES-codexInsights.sampleSize} more {PATTERN_MIN_SAMPLES-codexInsights.sampleSize===1?'entry':'entries'} before real patterns can emerge — not enough data yet to say anything meaningful.</div>
        </div>
      )}
      {filtered.length===0?(
        <div style={{textAlign:'center',padding:'48px 20px'}}>
          <div style={{fontFamily:'Fraunces,serif',fontStyle:'italic',fontSize:17,color:'var(--dim)',marginBottom:8,fontWeight:300}}>{(entries||[]).length===0?'Your Codex is empty':'Nothing matches'}</div>
          {(entries||[]).length===0&&<div className="tb" style={{fontSize:13,color:'var(--dim)',lineHeight:1.7}}>Set an intention in Practice to begin. Your Codex grows as you do — every entry is part of the record of who you are becoming.</div>}
        </div>
      ):filtered.map((e,i)=>{
        const ri=(entries||[]).indexOf(e);
        return(
          <div key={i} className={`cxc ${e.status||'note'}`} onClick={()=>setSel(ri)}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
              <div className="tb" style={{fontSize:14,color:'var(--ink)',lineHeight:1.4,flex:1,marginRight:8}}>{e.title||'Untitled'}</div>
              <span style={{background:'var(--bgm)',color:'var(--mut)',border:'1px solid var(--bl)',padding:'3px 10px',borderRadius:20,fontFamily:'Inter',fontSize:9,flexShrink:0}}>{ICO[e.status||'note']} {e.status||'note'}</span>
            </div>
            <div style={{display:'flex',gap:8}}>
              {e.type&&<div className="tc">{e.type}</div>}
              {e.moonPhase&&<div className="tc">· {e.moonPhase}</div>}
              {e.date&&<div className="tc" style={{marginLeft:'auto'}}>{new Date(e.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>}
            </div>
            {e.outcome&&<div className="tc" style={{marginTop:5,color:'var(--open)'}}>✦ Outcome recorded</div>}
          </div>
        );
      })}
      {showAdd&&(
        <div className="ov" onClick={()=>setShowAdd(false)}>
          <div className="sh" onClick={e=>e.stopPropagation()}>
            <div className="hd"/>
            <div className="td" style={{fontSize:20,marginBottom:16}}>New Entry</div>
            <div style={{marginBottom:12}}><div className="tl" style={{marginBottom:6}}>Title</div><input className="fld" placeholder="Name this entry…" value={addT} onChange={e=>setAddT(e.target.value)} style={{fontSize:14}}/></div>
            <div style={{marginBottom:12}}><div className="tl" style={{marginBottom:6}}>Type</div><div style={{display:'flex',flexWrap:'wrap',gap:5}}>{['intention','working','dream','note','observation'].map(t=><button key={t} className={`chip ${addTy===t?'on':''}`} onClick={()=>setAddTy(t)} style={{fontSize:9}}>{t}</button>)}</div></div>
            <div style={{marginBottom:12}}><div className="tl" style={{marginBottom:6}}>Status</div><div style={{display:'flex',flexWrap:'wrap',gap:5}}>{['seed','planned','done','note'].map(s=><button key={s} className={`chip ${addSt===s?'on':''}`} onClick={()=>setAddSt(s)} style={{fontSize:9}}>{ICO[s]} {s}</button>)}</div></div>
            <div style={{marginBottom:16}}><div className="tl" style={{marginBottom:6}}>Notes</div><textarea className="fld" rows={4} placeholder="Context, thoughts, anything worth keeping…" value={addN} onChange={e=>setAddN(e.target.value)}/></div>
            <button className="bp" style={{marginBottom:8,opacity:addT.trim()?1:.35}} disabled={!addT.trim()} onClick={()=>{onAdd({title:addT.trim(),type:addTy,status:addSt,notes:addN.trim(),date:new Date().toISOString()});setAddT('');setAddN('');setAddTy('note');setAddSt('seed');setShowAdd(false);}}>Add Entry</button>
            <button className="bg" onClick={()=>setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
const DEFAULT_NOTIF_PREFS={
  dailyReadingEnabled:true,
  dailyReadingTime:'08:00',
  hourAlerts:'big', // 'off' | 'big' | 'all'
  browserPushEnabled:false,
};

function buildNotificationFeed(chart,loc,prefs){
  const items=[];
  const now=new Date();
  const aln=buildAlign(chart,now,loc);

  // Daily reading anchor
  if(prefs.dailyReadingEnabled){
    items.push({
      id:'daily-'+now.toDateString(),
      type:'daily',
      icon:'✦',
      title:'Your reading is in',
      body:`${aln.moon.name} in ${aln.moonSgn} — today is ${aln.tier==='open'?'an open window':aln.tier==='avoid'?'a day to close some doors':'one to navigate with care'}.`,
      time:now,
      tier:aln.tier,
    });
  }

  // Current hour — if it's a "big" moment (Saturn avoid, or current is open and prefs allow)
  if(prefs.hourAlerts!=='off'&&aln.currHr){
    const p=aln.currHr.pl;
    const isBig=p.tier==='avoid'||p.tier==='open';
    if(prefs.hourAlerts==='all'||(prefs.hourAlerts==='big'&&isBig)){
      items.push({
        id:'hour-'+aln.currHr.ruler+'-'+aln.currHr.start.toFixed(2),
        type:'hour',
        icon:p.sym,
        title:`${aln.currHr.ruler} Hour is active`,
        body:p.tier==='avoid'?`Close the door on new starts. Best for ${p.best[0]}.`:`Open window — good for ${p.best.slice(0,2).join(', ')}.`,
        time:now,
        tier:p.tier,
      });
    }
  }

  // Moon phase moments — New Moon / Full Moon today
  if(aln.moon.name==='New Moon'||aln.moon.name==='Full Moon'){
    items.push({
      id:'moon-'+aln.moon.name+'-'+now.toDateString(),
      type:'moon',
      icon:aln.moon.emoji,
      title:aln.moon.name+' today',
      body:aln.moon.energy,
      time:now,
      tier:'open',
    });
  }

  // Upcoming moon events (next 3 days)
  const upcoming=getUpcoming(chart,now);
  upcoming.filter(e=>e.daysAway<=3).forEach(e=>{
    items.push({
      id:'upcoming-'+e.label+'-'+e.daysAway,
      type:'upcoming',
      icon:e.emoji,
      title:`${e.label} in ${e.daysAway===1?'1 day':e.daysAway+' days'}`,
      body:e.personal,
      time:new Date(now.getTime()+e.daysAway*86400000),
      tier:'open',
      future:true,
    });
  });

  return items.sort((a,b)=>(a.future?1:0)-(b.future?1:0));
}

function NotificationBell({chart,loc,prefs,onOpenSettings}){
  const[open,setOpen]=useState(false);
  const feed=useMemo(()=>buildNotificationFeed(chart,loc,prefs),[chart,loc,prefs]);
  const unreadCount=feed.filter(f=>!f.future).length;
  const TC={open:'var(--open)',tens:'var(--tens)',avoid:'var(--avoid)'};

  return(
    <div style={{position:'relative'}}>
      <button onClick={()=>setOpen(v=>!v)} style={{background:'none',border:'none',cursor:'pointer',position:'relative',padding:6}}>
        <span style={{fontSize:18,color:'var(--mut)'}}>🔔</span>
        {unreadCount>0&&<div style={{position:'absolute',top:2,right:2,width:8,height:8,borderRadius:'50%',background:'var(--gold)'}}/>}
      </button>
      {open&&(
        <div className="ov" onClick={()=>setOpen(false)} style={{alignItems:'flex-start',justifyContent:'flex-end',paddingTop:60}}>
          <div className="sh" onClick={e=>e.stopPropagation()} style={{borderRadius:'16px',maxWidth:340,marginRight:16,maxHeight:'70dvh'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <div className="td" style={{fontSize:18}}>Notifications</div>
              <button onClick={()=>{setOpen(false);onOpenSettings();}} style={{background:'none',border:'none',color:'var(--dim)',fontFamily:'Inter',fontSize:9,letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer'}}>Settings</button>
            </div>
            {feed.length===0?(
              <div className="tb" style={{fontSize:13,color:'var(--dim)',textAlign:'center',padding:'20px 0'}}>Nothing right now. Check back later.</div>
            ):feed.map((item,i)=>(
              <div key={item.id} style={{display:'flex',gap:10,padding:'10px 0',borderBottom:i<feed.length-1?'1px solid var(--bl)':'none',opacity:item.future?.6:1}}>
                <div style={{fontSize:18,flexShrink:0,marginTop:2}}>{item.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',gap:8,marginBottom:2}}>
                    <div className="tb" style={{fontSize:13,color:'var(--ink)',fontWeight:500}}>{item.title}</div>
                    <span style={{fontSize:8,color:TC[item.tier],flexShrink:0,marginTop:3}}>●</span>
                  </div>
                  <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.5}}>{item.body}</div>
                  {item.future&&<div className="tc" style={{marginTop:2}}>Upcoming</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationSettings({prefs,onSave,onClose}){
  const[local,setLocal]=useState(prefs);
  const[permStatus,setPermStatus]=useState(typeof Notification!=='undefined'?Notification.permission:'unsupported');

  async function requestPermission(){
    if(typeof Notification==='undefined'){setPermStatus('unsupported');return;}
    try{
      const result=await Notification.requestPermission();
      setPermStatus(result);
      setLocal(p=>({...p,browserPushEnabled:result==='granted'}));
    }catch{setPermStatus('denied');}
  }

  return(
    <div className="ov" onClick={onClose}>
      <div className="sh" onClick={e=>e.stopPropagation()}>
        <div className="hd"/>
        <div className="td" style={{fontSize:20,marginBottom:6}}>Notifications</div>
        <div className="tb" style={{fontSize:13,color:'var(--mut)',marginBottom:20,lineHeight:1.7}}>Choose how often Unearthed reaches out. You're always in control of the volume.</div>

        {/* Daily reading */}
        <div className="card" style={{padding:'16px',marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:local.dailyReadingEnabled?12:0}}>
            <div className="tl">Daily Reading</div>
            <button onClick={()=>setLocal(p=>({...p,dailyReadingEnabled:!p.dailyReadingEnabled}))} style={{width:44,height:24,borderRadius:12,background:local.dailyReadingEnabled?'var(--gold)':'var(--bm)',border:'none',cursor:'pointer',position:'relative',transition:'background .2s'}}>
              <div style={{width:18,height:18,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:local.dailyReadingEnabled?23:3,transition:'left .2s'}}/>
            </button>
          </div>
          {local.dailyReadingEnabled&&(
            <div>
              <div className="tc" style={{marginBottom:6}}>Notify me at</div>
              <input className="fld" type="time" value={local.dailyReadingTime} onChange={e=>setLocal(p=>({...p,dailyReadingTime:e.target.value}))} style={{fontSize:14}}/>
            </div>
          )}
        </div>

        {/* Hour alerts */}
        <div className="card" style={{padding:'16px',marginBottom:12}}>
          <div className="tl" style={{marginBottom:10}}>Planetary Hour Alerts</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {[['off','Off','No hour-by-hour alerts'],['big','Big moments only','Saturn hours and your best open windows'],['all','Every hour change','Notified each time the ruling planet shifts']].map(([val,label,desc])=>(
              <button key={val} onClick={()=>setLocal(p=>({...p,hourAlerts:val}))} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 12px',background:local.hourAlerts===val?'var(--gbg)':'var(--bgm)',border:`1px solid ${local.hourAlerts===val?'var(--gbdr)':'var(--bl)'}`,borderRadius:10,cursor:'pointer',textAlign:'left'}}>
                <div style={{width:14,height:14,borderRadius:'50%',border:`2px solid ${local.hourAlerts===val?'var(--gold)':'var(--bm)'}`,flexShrink:0,marginTop:2,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {local.hourAlerts===val&&<div style={{width:6,height:6,borderRadius:'50%',background:'var(--gold)'}}/>}
                </div>
                <div>
                  <div style={{fontFamily:'Inter',fontSize:12,color:'var(--ink)',marginBottom:1}}>{label}</div>
                  <div className="tc">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Browser push */}
        <div className="card" style={{padding:'16px',marginBottom:16}}>
          <div className="tl" style={{marginBottom:6}}>Browser Notifications</div>
          <div className="tb" style={{fontSize:12,color:'var(--mut)',lineHeight:1.6,marginBottom:10}}>
            {permStatus==='granted'?'Enabled — you\'ll get real alerts while this tab is open.':permStatus==='denied'?'Blocked in your browser settings. You can still use the in-app notification bell.':permStatus==='unsupported'?'Not available in this environment — the in-app bell will still work.':'Get real alerts while Unearthed is open in a tab. This is best-effort — for full background alerts, a future mobile app version will support true push.'}
          </div>
          {permStatus!=='granted'&&permStatus!=='unsupported'&&(
            <button className="bs" onClick={requestPermission}>Enable Browser Alerts</button>
          )}
        </div>

        <button className="bp" style={{marginBottom:8}} onClick={()=>{onSave(local);onClose();}}>Save</button>
        <button className="bg" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function Unearthed(){
  const[chart,setChart]=useState(null);
  const[tab,setTab]=useState('today');
  const[codex,setCodex]=useState([]);
  const[loc,setLoc]=useState(null);
  const[ready,setReady]=useState(false);
  const[notifPrefs,setNotifPrefs]=useState(DEFAULT_NOTIF_PREFS);
  const[showNotifSettings,setShowNotifSettings]=useState(false);
  const[savedRelationships,setSavedRelationships]=useState([]);

  useEffect(()=>{
    sGet('unearthed-chart').then(c=>{if(c)setChart(c);return sGet('unearthed-codex');})
    .then(c=>{if(c)setCodex(c);return sGet('unearthed-location');})
    .then(l=>{if(l)setLoc(l);return sGet('unearthed-notif-prefs');})
    .then(p=>{if(p)setNotifPrefs({...DEFAULT_NOTIF_PREFS,...p});return sGet('unearthed-relationships');})
    .then(r=>{if(r)setSavedRelationships(r);setReady(true);});
  },[]);

  useEffect(()=>{if(ready&&chart)sSet('unearthed-chart',chart);},[chart,ready]);
  useEffect(()=>{if(ready)sSet('unearthed-codex',codex);},[codex,ready]);
  useEffect(()=>{if(ready&&loc)sSet('unearthed-location',loc);},[loc,ready]);
  useEffect(()=>{if(ready)sSet('unearthed-notif-prefs',notifPrefs);},[notifPrefs,ready]);
  useEffect(()=>{if(ready)sSet('unearthed-relationships',savedRelationships);},[savedRelationships,ready]);

  const handleSetLoc=useCallback((l)=>{setLoc(l);},[]);
  function updateChart(u){if(!u){sSet('unearthed-chart',null);setChart(null);return;}setChart(p=>({...p,...u}));}
  function saveRelationship(rel){setSavedRelationships(p=>[rel,...p.filter(r=>r.them.name!==rel.them.name||r.them.dob!==rel.them.dob)]);}
  function removeRelationship(id){setSavedRelationships(p=>p.filter(r=>r.id!==id));}

  // ─── REAL NOTIFICATION SCHEDULER ──────────────────────────────────────────
  // Fires actual browser Notification objects, not just in-app bell items.
  // Honest limitation: this only works while the tab/app is open — a true
  // background push requires native mobile wrapping, which is out of scope
  // for this environment. We check every minute for trigger conditions
  // rather than relying on a single setTimeout, since the daily-reading
  // time depends on live local time and the hour-alert depends on the
  // currently active planetary hour, both of which we already compute.
  //
  // notifFireState lives in a useRef on purpose: this effect's dependency
  // array includes notifPrefs and loc, both of which change whenever the
  // user edits a setting or their city. If the "already fired" tracking
  // lived as plain variables inside the effect, every settings save would
  // reset them and could cause an immediate duplicate notification to fire
  // right when the user changes an unrelated preference. A ref persists
  // across re-runs of the effect within the same component lifetime, so a
  // real day/hour boundary is the only thing that changes these values.
  const notifFireState=useRef({daily:null,hour:null});
  useEffect(()=>{
    if(!chart||!ready)return;
    if(typeof Notification==='undefined')return;
    if(Notification.permission!=='granted')return;
    if(!notifPrefs.browserPushEnabled)return;

    function checkAndFire(){
      const now=new Date();
      const aln=buildAlign(chart,now,loc);

      // Daily reading notification — fires once per day at the configured time
      if(notifPrefs.dailyReadingEnabled){
        const[hh,mm]=(notifPrefs.dailyReadingTime||'08:00').split(':').map(Number);
        const todayKey=now.toDateString();
        const isAtOrPastTime=now.getHours()>hh||(now.getHours()===hh&&now.getMinutes()>=mm);
        if(isAtOrPastTime&&notifFireState.current.daily!==todayKey){
          notifFireState.current.daily=todayKey;
          try{
            new Notification('Your reading is in ✦',{
              body:`${aln.moon.name} in ${aln.moonSgn} — today is ${aln.tier==='open'?'an open window':aln.tier==='avoid'?'a day to close some doors':'one to navigate with care'}.`,
              icon:undefined,
              tag:'unearthed-daily-'+todayKey,
            });
          }catch{}
        }
      }

      // Hour alerts — fires when the ruling planet changes, gated by preference
      if(notifPrefs.hourAlerts!=='off'&&aln.currHr){
        const hourKey=aln.currHr.ruler+'-'+aln.currHr.start.toFixed(2)+'-'+now.toDateString();
        const p=PL[aln.currHr.ruler];
        const isBig=p.tier==='avoid'||p.tier==='open';
        const shouldFire=notifPrefs.hourAlerts==='all'||(notifPrefs.hourAlerts==='big'&&isBig);
        if(shouldFire&&notifFireState.current.hour!==hourKey){
          notifFireState.current.hour=hourKey;
          try{
            new Notification(`${aln.currHr.ruler} Hour is active`,{
              body:p.tier==='avoid'?`Close the door on new starts. Best for ${p.best[0]}.`:`Open window — good for ${p.best.slice(0,2).join(', ')}.`,
              icon:undefined,
              tag:'unearthed-hour-'+hourKey,
            });
          }catch{}
        }
      }
    }

    const id=setInterval(checkAndFire,60000); // re-check every minute
    return ()=>clearInterval(id);
  },[chart,loc,notifPrefs,ready]);

  if(!ready)return(
    <div style={{height:'100dvh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <Styles/>
      <div style={{fontFamily:'Fraunces,serif',fontSize:32,color:'var(--gold)',fontWeight:300,animation:'pulse 1.4s ease-in-out infinite'}}>✦</div>
    </div>
  );

  if(!chart)return(
    <div className="shell">
      <Styles/>
      <Onboarding onComplete={c=>{setChart(c);setTab('today');}}/>
    </div>
  );

  const NAV=[{id:'today',icon:'◈',label:'Signal'},{id:'blueprint',icon:'◉',label:'Blueprint'},{id:'calendar',icon:'▦',label:'Timing'},{id:'practice',icon:'✦',label:'Practice'},{id:'codex',icon:'◎',label:'Codex'}];

  return(
    <div className="shell">
      <Styles/>
      <div style={{position:'absolute',top:14,right:14,zIndex:50}}>
        <NotificationBell chart={chart} loc={loc} prefs={notifPrefs} onOpenSettings={()=>setShowNotifSettings(true)}/>
      </div>
      {tab==='today'&&<TodayPage chart={chart} loc={loc} onSetLoc={handleSetLoc} codexEntries={codex} onNavigate={setTab}/>}
      {tab==='blueprint'&&<BlueprintPage chart={chart} codexEntries={codex} loc={loc} savedRelationships={savedRelationships} onSaveRelationship={saveRelationship} onRemoveRelationship={removeRelationship} onUpdate={updateChart}/>}
      {tab==='calendar'&&<CalendarPage chart={chart} loc={loc} codexEntries={codex} onSetLoc={handleSetLoc}/>}
      {tab==='practice'&&<PracticePage chart={chart} loc={loc} codexEntries={codex} onSave={e=>{setCodex(p=>[e,...p]);}}/>}
      {tab==='codex'&&<CodexPage entries={codex} chart={chart} loc={loc} onUpdate={(i,e)=>{setCodex(p=>{const n=[...p];n[i]=e;return n;});}} onDelete={i=>{setCodex(p=>p.filter((_,j)=>j!==i));}} onAdd={e=>{setCodex(p=>[e,...p]);}}/>}
      <nav className="bnav">
        {NAV.map(n=>(<button key={n.id} className={`nb ${tab===n.id?'on':''}`} onClick={()=>setTab(n.id)}><span className="ni">{n.icon}</span><span className="nl">{n.label}</span></button>))}
      </nav>
      {showNotifSettings&&<NotificationSettings prefs={notifPrefs} onSave={setNotifPrefs} onClose={()=>setShowNotifSettings(false)}/>}
    </div>
  );
}
