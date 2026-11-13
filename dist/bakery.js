'use strict';
// Reuse pastry illustrations from the concept image as a sprite atlas.
const bakeryArt=new Image();
const pastryCrops=[[32,707,107,70],[165,709,89,66],[283,709,99,65],[415,707,87,73]];
tile=function(c,x,y,size,context=ctx,ghost=false){
  if(!c)return;context.save();context.globalAlpha=ghost?.25:1;
  const shade=context.createLinearGradient(x,y,x+size,y+size);
  const sage=['#a4b49a','#8eaeb0','#b4a4bc'].includes(c.color);
  shade.addColorStop(0,sage?'#bcc58d':'#ffe39b');shade.addColorStop(.55,sage?'#a8b675':'#f4cb6b');shade.addColorStop(1,sage?'#889a5c':'#dca644');
  context.fillStyle=shade;context.beginPath();context.roundRect(x+1,y+1,size-2,size-2,4);context.fill();
  context.lineWidth=1;context.strokeStyle=sage?'#7f9157':'#c89b42';context.stroke();
  context.strokeStyle='#fff8d999';context.beginPath();context.roundRect(x+3,y+3,size-6,size-6,3);context.stroke();
  if(c.dessert>=0&&!ghost){
    if(bakeryArt.complete&&bakeryArt.naturalWidth){const [sx,sy,sw,sh]=pastryCrops[c.dessert];context.globalCompositeOperation='multiply';context.drawImage(bakeryArt,sx,sy,sw,sh,x+3,y+5,size-6,size-10)}
    else{context.font=`${size*.6}px sans-serif`;context.textAlign='center';context.textBaseline='middle';context.fillStyle='#754023';context.fillText(D[c.dessert].icon,x+size/2,y+size/2)}
  }context.restore();
};
renderOrder=function(){
  $('orderTitle').textContent=`${completed+1}번째 손님`;
  $('orders').innerHTML=order.map(o=>`<div class="order-row"><span><i class="pastry pastry-${o.id}" aria-hidden="true"></i>${D[o.id].name}</span><b>${o.got} / ${o.need}</b></div><div class="progress"><i style="width:${o.got/o.need*100}%"></i></div>`).join('');
  $('reward').textContent='+'+(1000+completed*500).toLocaleString();$('completed').textContent=`완료한 주문 ${completed}건`;
};
bakeryArt.onload=()=>draw();bakeryArt.src='bakery-art.png';renderOrder();draw();
