var id=parseInt(new URLSearchParams(location.search).get('id'),10);
if(!(id>=0&&id<L.length))id=0;
var look=L[id],hs=look.h||H,sel={},rows=[],dots=[];
document.title=look.n+' — TEST';
$('lk').textContent='Look 0'+(id+1);$('ln').textContent=look.n;
/* الـ box بياخد نسبة الصورة الحقيقية، فنسب مكان الأرقام (%) بتطابق الصورة بالظبط */
var bx=$('box');
bx.appendChild(lookImg(id,true,function(r){bx.style.setProperty('--ar',r.toFixed(4));bx.classList.add('rdy')}));
var tot=lookTotal(id);$('old').textContent=money(tot);$('new').textContent=money(tot*.9);

look.i.forEach(function(p,k){
  sel[k]=defSize(p[2]);
  /* hotspot */
  var b=document.createElement('button');b.className='dot';b.type='button';b.setAttribute('aria-pressed','false');
  b.setAttribute('aria-label',p[0]);b.style.left=hs[k][0]+'%';b.style.top=hs[k][1]+'%';b.innerHTML='<span>'+(k+1)+'</span>';
  b.addEventListener('click',function(){open(k,true)});
  $('box').appendChild(b);dots.push(b);
  /* row */
  var li=document.createElement('li'),th=document.createElement('div');th.className='th';
  th.appendChild(pieceImg(id,k,false));th.insertAdjacentHTML('beforeend','<em>'+(k+1)+'</em>');
  li.innerHTML='<div class="row"><div class="inf"><small>TEST · '+p[2].toUpperCase()+'</small><b>'+p[0]+'</b>'+money(p[1])+'</div><button class="plus" type="button" aria-expanded="false" aria-label="Choose size for '+p[0]+'">+</button></div><div class="opt" hidden><div class="sz"></div><button class="add" type="button">Add to bag</button></div>';
  li.firstChild.insertBefore(th,li.firstChild.firstChild);
  var box=li.querySelector('.sz');
  sizesOf(p[2]).forEach(function(s){
    var sb=document.createElement('button');sb.type='button';sb.textContent=s;sb.setAttribute('aria-pressed',s===sel[k]);
    sb.addEventListener('click',function(){sel[k]=s;Array.prototype.forEach.call(box.children,function(x){x.setAttribute('aria-pressed',x===sb)})});
    box.appendChild(sb);
  });
  li.querySelector('.plus').addEventListener('click',function(){open(k,false)});
  li.querySelector('.add').addEventListener('click',function(){
    var bag=getBag().filter(function(x){return !(x.l===id&&x.i===k)});
    bag.push({l:id,i:k,s:sel[k],b:0});setBag(bag);
    toast('',p[0]+' ('+sel[k]+') added <a href="checkout.html">Checkout →</a>');
  });
  $('pl').appendChild(li);rows.push(li);
});
function open(k,scroll){
  rows.forEach(function(li,j){
    var on=j===k&&(scroll||li.querySelector('.opt').hidden);
    li.querySelector('.opt').hidden=!on;li.classList.toggle('hl',j===k);
    li.querySelector('.plus').setAttribute('aria-expanded',on);li.querySelector('.plus').textContent=on?'−':'+';
    dots[j].setAttribute('aria-pressed',j===k);
  });
  if(scroll)rows[k].scrollIntoView({block:'nearest',behavior:'smooth'});
}
$('full').addEventListener('click',function(){
  var bag=getBag().filter(function(x){return x.l!==id});
  look.i.forEach(function(p,k){bag.push({l:id,i:k,s:defSize(p[2]),b:1})});
  setBag(bag);location.href='checkout.html';
});

/* وضع الضبط: افتح look.html?id=0&edit=1 واضغط على الصورة مكان كل رقم، وانسخ السطر اللي بيظهر تحت */
if(/[?&]edit(=|&|$)/.test(location.search)){
  var cur=0,pts=hs.map(function(p){return p.slice()}),bar=document.createElement('div');
  bar.className='edit';bx.classList.add('editing');document.body.appendChild(bar);
  var say=function(){
    bar.innerHTML='<b>Edit</b><span>Click the photo to place point <b>'+(cur+1)+'</b> · '+look.i[cur][0]+'</span><input readonly aria-label="Copy into common.js" value="h:'+JSON.stringify(pts).replace(/\s/g,'')+',">';
    var i=bar.querySelector('input');i.addEventListener('click',function(){i.select()});
  };
  say();
  bx.addEventListener('click',function(e){
    var r=bx.getBoundingClientRect();
    pts[cur]=[+((e.clientX-r.left)/r.width*100).toFixed(1),+((e.clientY-r.top)/r.height*100).toFixed(1)];
    dots[cur].style.left=pts[cur][0]+'%';dots[cur].style.top=pts[cur][1]+'%';
    cur=(cur+1)%pts.length;say();
  });
}