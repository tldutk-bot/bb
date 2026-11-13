'use strict';
// Buttons respond on touch-down. Movement repeats only while held.
let holdDelay=null,holdRepeat=null;
function stopHold(){clearTimeout(holdDelay);clearInterval(holdRepeat);holdDelay=holdRepeat=null}
document.querySelectorAll('[data-action]').forEach(button=>{
  button.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    e.preventDefault();stopHold();button.setPointerCapture(e.pointerId);
    const action=button.dataset.action;act(action);
    if(['left','right','down'].includes(action))holdDelay=setTimeout(()=>{holdRepeat=setInterval(()=>act(action),85)},260);
  });
  ['pointerup','pointercancel','lostpointercapture'].forEach(event=>button.addEventListener(event,stopHold));
  // Keep keyboard and assistive technology activation available without double firing touch.
  button.addEventListener('click',e=>{if(e.detail===0)act(button.dataset.action)});
});
document.addEventListener('visibilitychange',stopHold);
window.addEventListener('blur',stopHold);

const touchBoard=document.getElementById('board');
let gesture=null;
touchBoard.addEventListener('pointerdown',e=>{
  if(!playing||paused)return;
  e.preventDefault();touchBoard.setPointerCapture(e.pointerId);
  gesture={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false,piece:active};
});
touchBoard.addEventListener('pointermove',e=>{
  if(!gesture||gesture.id!==e.pointerId)return;
  if(!playing||paused||active!==gesture.piece){gesture=null;return}
  const cell=touchBoard.getBoundingClientRect().width/10;
  const dx=e.clientX-gesture.x,dy=e.clientY-gesture.startY;
  if(Math.abs(dx)>=cell&&Math.abs(e.clientX-gesture.startX)>Math.abs(dy)){
    let steps=Math.floor(Math.abs(dx)/cell);
    for(let i=0;i<steps;i++)act(dx>0?'right':'left');
    gesture.x+=Math.sign(dx)*steps*cell;gesture.moved=true;
  }
});
touchBoard.addEventListener('pointerup',e=>{
  if(!gesture||gesture.id!==e.pointerId)return;
  const g=gesture;gesture=null;
  if(!playing||paused||active!==g.piece)return;
  const dx=e.clientX-g.startX,dy=e.clientY-g.startY;
  if(!g.moved&&dy>24&&dy>Math.abs(dx)){act(dy>=75?'drop':'down')}
  else if(!g.moved&&Math.abs(dx)<14&&Math.abs(dy)<14)act('rotate');
});
touchBoard.addEventListener('pointercancel',()=>{gesture=null});
