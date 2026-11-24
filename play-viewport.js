/* One logical CSS-pixel game viewport, independent of safe-area overdraw. */
((root)=>{
  const finitePositive=v=>Number.isFinite(v)&&v>0?v:0;
  const origin=v=>Number.isFinite(v)?Math.max(0,v):0;
  function measure({dynamic,layout,visual,rotation=0}){
    // With viewport-fit=cover, the dynamic viewport represents the entire
    // paintable sheet. Some iOS browsers report an inset, stale visual view
    // at scale 1 after rotating or pulling the chrome into/out of view.
    const fullW=finitePositive(dynamic?.width)||finitePositive(layout?.width)||finitePositive(visual?.width);
    const fullH=finitePositive(dynamic?.height)||finitePositive(layout?.height)||finitePositive(visual?.height);
    if(!fullW||!fullH)return null;
    const scale=finitePositive(visual?.scale)||1;
    const zoomed=Math.abs(scale-1)>.025&&!!finitePositive(visual?.width)&&!!finitePositive(visual?.height);
    const width=zoomed?finitePositive(visual.width):fullW,height=zoomed?finitePositive(visual.height):fullH;
    const left=zoomed?origin(visual.offsetLeft):0,top=zoomed?origin(visual.offsetTop):0;
    const dikey=fullH>fullW,donuk=dikey&&(rotation===90||rotation===-90),bekliyor=dikey&&!donuk;
    return {width,height,left,top,bekliyor,donuk,aci:rotation,gameWidth:donuk?height:width,gameHeight:donuk?width:height};
  }
  function nextPlayingSize(previous,width,height,blocked){
    if(blocked||!finitePositive(width)||!finitePositive(height))return previous;
    return {w:width,h:height};
  }
  const api=Object.freeze({measure,nextPlayingSize});
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.PirpirViewport=api;
})(globalThis);
