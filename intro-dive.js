/* Menu-only water entrance. The playfield takes no input until this clock ends. */
((root)=>{
  const total=710, cover=.48, coverAt=total*cover, maxArtHold=540;
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const ease=x=>x*x*(3-2*x);
  const fmt=new Intl.NumberFormat('tr-TR');
  function bestPoints(score){
    const n=Number(score);
    return fmt.format(Number.isFinite(n)?Math.max(0,Math.trunc(n)):0);
  }
  function renderSample(progress){
    const phase=clamp(progress),rise=ease(clamp(phase/cover)),reveal=ease(clamp((phase-cover)/(1-cover)));
    return {wave:114-136*rise,water:1-reveal,bubbles:74-142*phase,air:Math.sin(phase*Math.PI)*.92};
  }
  function warmArtwork(sources,ImageType=root.Image){
    const files=[...new Set(sources.filter(Boolean))];
    if(!ImageType||!files.length)return ()=>true;
    let pending=files.length;
    files.forEach(src=>{
      const image=new ImageType();let finished=false,loading=false;
      const done=()=>{if(finished)return;finished=true;image.onload=null;image.onerror=null;pending--;};
      const loaded=()=>{
        if(finished||loading)return;
        loading=true;
        if(typeof image.decode==='function')Promise.resolve().then(()=>image.decode()).then(done,done);
        else done();
      };
      image.onload=loaded;image.onerror=done;image.src=src;
      if(image.complete&&image.naturalWidth>0)loaded();
    });
    return ()=>pending===0;
  }
  function createDive({overlay,menu,blocked=()=>false,reduce=()=>false,ready=()=>true,audio=()=>{},prepare,enter,
                       request=fn=>root.requestAnimationFrame(fn),cancel=id=>root.cancelAnimationFrame(id)}){
    let active=false,covered=false,frame=null,previous=null,time=0,held=0;
    function paint(value){
      const f=renderSample(value);
      overlay.style.setProperty('--dive-wave',`${f.wave}%`);
      overlay.style.setProperty('--dive-water',f.water);
      overlay.style.setProperty('--dive-bubble-rise',`${f.bubbles}%`);
      overlay.style.setProperty('--dive-air',f.air);
    }
    function coverOnce(){if(covered)return;covered=true;prepare();}
    function finish(){
      if(frame!==null)cancel(frame);
      frame=null;coverOnce();overlay.hidden=true;
      menu.inert=false;menu.removeAttribute('aria-busy');active=false;
      enter();
    }
    function tick(t){
      frame=null;if(!active)return;
      if(blocked()){previous=null;frame=request(tick);return;}
      if(reduce()){finish();return;}
      // A suspended/tab-hidden browser cannot skip an entire visible phase.
      const delta=previous===null?0:clamp(t-previous,0,48);
      previous=t;
      if(!covered&&time+delta>=coverAt){
        // Snap to the opaque frame: changing the scene and lowering the
        // curtain opacity in the same RAF could reveal a composited ghost.
        time=coverAt;paint(cover);coverOnce();frame=request(tick);return;
      }
      if(covered&&!ready()&&held<maxArtHold){
        held+=delta;frame=request(tick);return;
      }
      time+=delta;
      const progress=clamp(time/total);paint(progress);
      if(progress>=1){finish();return;}
      frame=request(tick);
    }
    return {
      start(){
        if(active||blocked())return false;
        active=true;covered=false;time=0;held=0;previous=null;
        // Invoked directly in Oyna's click activation, not after an await.
        try{audio();}catch{/* An unavailable audio device must not block play. */}
        if(reduce()){finish();return true;}
        menu.inert=true;menu.setAttribute('aria-busy','true');paint(0);overlay.hidden=false;
        frame=request(tick);return true;
      },
      get active(){return active;}
    };
  }
  const api=Object.freeze({createDive,renderSample,bestPoints,warmArtwork});
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PirpirMenuDive=api;
})(globalThis);
