/* Preserve normalized positions when toolbars, orientation or split view resize. */
(()=>{
 const field=document.getElementById('sahne');
 let previous=PirpirViewport.nextPlayingSize(null,field.offsetWidth,field.offsetHeight,ekran.bekliyor);
 new ResizeObserver(()=>{
  const w=field.offsetWidth,h=field.offsetHeight;
  const next=PirpirViewport.nextPlayingSize(previous,w,h,ekran.bekliyor);
  if(next&&previous&&next!==previous&&(w!==previous.w||h!==previous.h)){
   const sx=w/previous.w,sy=h/previous.h;
   if(O.pyHazir){O.py*=sy;O.vy*=sy;}
   if(O.ekran==="nefes"){
    NB.r*=Math.min(w,h)/Math.min(previous.w,previous.h);
    nefesKur();
    if(NB.var)nefesCiz();
   }
   const scale=Math.min(w,h)/Math.min(previous.w,previous.h);
   for(const item of objeler){
    item.x*=sx;item.y*=sy;item.hizX*=sx;item.r*=scale;item.salGen*=sy;
    for(const key of ['width','height']){
     if(item.el.style[key].endsWith('px'))item.el.style[key]=(parseFloat(item.el.style[key])*scale)+'px';
    }
   }
  }
  previous=next;
 }).observe(field);
 /* Original instrumental loop: marimba melody, warm bass and soft percussion. */
 let bus=null,next=0,step=0;
 const tune=[72,0,76,79,81,79,76,0,74,0,77,81,79,77,74,0,76,79,84,0,83,79,76,0,74,77,81,79,76,74,72,0];
 const roots=[48,53,45,55];
 const hz=n=>440*Math.pow(2,(n-69)/12);
 function tone(n,t,d,level,type='sine'){
  const c=Ses.ctx,o=c.createOscillator(),g=c.createGain();
  o.type=type;o.frequency.value=hz(n);g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(level,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(bus);o.start(t);o.stop(t+d+.02);
 }
 function tick(){
  if(!Ses.ctx)return;
  const c=Ses.ctx;
  if(!bus){bus=c.createGain();bus.gain.value=0;bus.connect(c.destination);}
  const active=O.girisYapildi&&!O.bitis&&!document.hidden&&!ekran.bekliyor&&!O.duraklat;
  bus.gain.setTargetAtTime(active&&Ses.acikMi?(O.ekran==='nefes'?.025:.10):0,c.currentTime,.04);
  if(!active||!Ses.acikMi||c.state!=='running'){next=0;return;}
  if(!next)next=c.currentTime+.04;
  while(next<c.currentTime+.15){
   const n=tune[step%32],root=roots[Math.floor(step/8)%4];
   if(n){tone(n,next,.22,.5,'triangle');tone(n+12,next,.12,.08);}
   if(step%2===0)tone(root,next,.35,.65,'triangle');
   if(step%4===2)tone(84,next,.035,.12);
   next+=60/112/2;step++;
  }
 }
 setInterval(tick,50);
 document.getElementById('sesDugme').addEventListener('click',tick);
 document.addEventListener('visibilitychange',tick);
})();
