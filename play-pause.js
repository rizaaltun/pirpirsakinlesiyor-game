(function(host){
"use strict";
function clock(){
 const queue=new Map();
 let now=0,seq=0;
 return {
  after(fn,delay){const id=++seq;queue.set(id,{fn,due:now+delay});return id;},
  tick(ms){
   now+=ms;
   for(const [id,job] of [...queue].sort((a,b)=>a[1].due-b[1].due)){
    if(job.due<=now&&queue.delete(id))job.fn();
   }
  },
  reset(){queue.clear();now=0;}
 };
}
function controls({button,panel,resume,home,background,canOpen,blocked,change,exit,focusHome}){
 let active=false,animations=[],inerted=[];
 const focus=element=>element.focus({preventScroll:true});
 function sync(){
  button.hidden=!active&&!canOpen();
  if(active&&!blocked()&&!panel.contains(panel.ownerDocument.activeElement))focus(resume);
 }
 function open(){
  if(active||blocked()||!canOpen())return;
  active=true;
  inerted=[...panel.parentElement.children].filter(el=>el!==panel&&!el.inert && el.tagName!=="SCRIPT");
  for(const el of inerted)el.inert=true;
  animations=background.flatMap(el=>el.getAnimations?.({subtree:true})??[])
   .filter(a=>a.playState==="running"&&!a.animationName);
  for(const a of animations)a.pause();
  change(true);
  panel.hidden=false;
  button.setAttribute("aria-expanded","true");
  focus(resume);
 }
 function close(toMenu=false){
  if(!active||blocked())return;
  active=false;
  if(toMenu)exit();
  panel.hidden=true;
  button.setAttribute("aria-expanded","false");
  for(const el of inerted)el.inert=false;
  inerted=[];
  for(const a of animations){
   if(!toMenu&&a.playState==="paused")a.play();
   else if(toMenu&&a.playState==="paused")a.cancel();
  }
  animations=[];
  change(false,toMenu);
  sync();
  if(toMenu)focusHome();else focus(button);
 }
 button.addEventListener("click",open);
 resume.addEventListener("click",()=>close());
 home.addEventListener("click",()=>close(true));
 panel.addEventListener("keydown",e=>{
  if(blocked())return;
  if(e.key==="Escape"){e.preventDefault();e.stopPropagation();close();}
  else if(e.key==="Tab"){e.preventDefault();focus(e.target===home?resume:home);}
 });
 return {sync,open,active:()=>active};
}
host.PirpirPause=Object.freeze({controls,clock});
})(globalThis);
