var trk=$('trk'),N=L.length,START=Math.floor(N/2),pos=START,vel=0,snapTo=null,raf=0,mode='idle',active=-1;
var W=0,pitch=0,gl=1,moved=0,drag=null,t0=0,imgs=[];
var DUR=2000,D=N*1.5;                       /* intro: length (ms) and distance (items) */
var meta=document.querySelector('.meta'),ctrl=document.querySelector('.ctrl');
var wrap=function(x){x=((x%N)+N)%N;return x>N/2?x-N:x};
var els=L.map(function(l,i){
  var d=document.createElement('div');d.className='it';d.setAttribute('role','button');d.setAttribute('aria-label',l.n);
  var im=lookImg(i,true,i===START?setAR:null);imgs.push(im);d.appendChild(im);
  d.addEventListener('click',function(){
    if(moved>6||mode==='intro')return;
    var r=Math.round(pos),k=wrap(i-r);
    if(k===0)location.href='look.html?id='+i;else glide(r+k);
  });
  trk.appendChild(d);return d;
});
function measure(){W=els[0].offsetWidth;pitch=W*.95}
/* بيضبط نسبة الصور من الصورة الحقيقية، فالكروت بتاخد أكبر مساحة ممكنة من غير ما الصورة تتصغّر */
function setAR(r){
  if(!(r>.2&&r<3))return;
  document.querySelector('main.c').style.setProperty('--ar',r.toFixed(4));
  measure();if(mode!=='intro')render();
}
/* sharp in the middle, soft + smaller on the sides; endless (wraps around) */
function render(){
  for(var i=0;i<N;i++){
    var e=els[i],d=wrap(i-pos),a=Math.abs(d),c=Math.min(a,2);
    var sc=1-.14*Math.min(c,1)-.04*(c>1?c-1:0);
    var o=(1-.28*Math.min(c,1.6)/1.6)*Math.min(1,Math.max(0,(N/2-a)/.7))*gl;
    e.style.transform='translate3d(calc(-50% + '+(d*pitch).toFixed(1)+'px),0,0) scale('+sc.toFixed(3)+')';
    e.style.opacity=o.toFixed(2);
    e.style.visibility=o<.01?'hidden':'visible';
    e.style.filter=a<.15?'none':'blur('+Math.min(a*1.6,3).toFixed(1)+'px)';
    e.style.zIndex=Math.round(100-a*20);
  }
  var r=((Math.round(pos)%N)+N)%N;
  if(r!==active&&mode!=='intro'){active=r;ui()}
}
function ui(){
  var l=L[active];
  $('lk').textContent='Look 0'+(active+1)+' · 3 pieces';
  $('name').textContent=l.n;$('price').textContent=money(lookTotal(active));
  $('cur').textContent='0'+(active+1);$('tot').textContent='0'+N;
  $('thumb').style.left=(active/N*100)+'%';$('thumb').style.width=(100/N)+'%';
}
function kick(){if(!raf)raf=requestAnimationFrame(loop)}
var last=0;
function loop(now){
  var dt=Math.min(Math.max((now-last)/1000,0),.05);last=now;
  if(mode==='intro'){
    var t=Math.min((now-t0)/DUR,1);
    pos=START+D*Math.pow(1-t,4);                 /* fast, then slows smoothly to a stop */
    gl=Math.min(1,(now-t0)/300);
    if(t<1){render();raf=requestAnimationFrame(loop);return}
    mode='idle';pos=START;gl=1;raf=0;render();showUI();return;
  }
  var more=true;
  if(drag){/* pointer drives pos */}
  else if(snapTo===null&&Math.abs(vel)>1.5){pos+=vel*dt;vel*=Math.exp(-3.2*dt)}
  else{
    var tg=snapTo===null?Math.round(pos):snapTo,df=tg-pos;
    pos+=df*(1-Math.exp(-9*dt));vel=0;
    if(Math.abs(df)<.0008){pos=tg;snapTo=null;more=false}
  }
  render();
  raf=more?requestAnimationFrame(loop):0;
}
function glide(t){if(mode==='intro')return;snapTo=t;vel=0;last=performance.now();kick()}
function step(n){glide((snapTo!==null?snapTo:Math.round(pos))+n)}
$('next').onclick=function(){step(1)};$('prev').onclick=function(){step(-1)};
document.addEventListener('keydown',function(e){
  if(e.key==='ArrowRight')step(1);else if(e.key==='ArrowLeft')step(-1);
  else if(e.key==='Enter'&&document.activeElement===trk&&mode!=='intro')location.href='look.html?id='+active;
});
/* wheel / trackpad: momentum, then snaps to nearest look */
document.querySelector('main.c').addEventListener('wheel',function(e){
  e.preventDefault();if(mode==='intro')return;
  var d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(e.deltaMode===1)d*=33;
  snapTo=null;vel=Math.max(-14,Math.min(14,vel+d*.03));last=performance.now();kick();
},{passive:false});
/* drag / swipe with momentum */
trk.addEventListener('pointerdown',function(e){
  if(mode==='intro'||e.button>0)return;
  drag={x:e.clientX,p:pos,lx:e.clientX,lt:e.timeStamp,v:0};moved=0;snapTo=null;vel=0;
  trk.classList.add('drag');last=performance.now();kick();
});
addEventListener('pointermove',function(e){
  if(!drag)return;
  var dx=e.clientX-drag.x;moved=Math.max(moved,Math.abs(dx));pos=drag.p-dx/pitch;
  var dt=(e.timeStamp-drag.lt)/1000;
  if(dt>0){drag.v=drag.v*.6+(-(e.clientX-drag.lx)/pitch/dt)*.4;drag.lx=e.clientX;drag.lt=e.timeStamp}
});
function endDrag(e){
  if(!drag)return;
  vel=(e.timeStamp-drag.lt>80)?0:Math.max(-14,Math.min(14,drag.v));
  drag=null;trk.classList.remove('drag');last=performance.now();kick();
}
addEventListener('pointerup',endDrag);addEventListener('pointercancel',endDrag);
function showUI(){meta.style.opacity=ctrl.style.opacity=1;active=-1;render()}
if(window.ResizeObserver)new ResizeObserver(function(){measure();if(mode!=='intro')render()}).observe(trk);
else addEventListener('resize',function(){measure();if(mode!=='intro')render()});
measure();
if(matchMedia('(prefers-reduced-motion:reduce)').matches){render();showUI()}
else{
  meta.style.opacity=ctrl.style.opacity=0;
  var ready=Promise.all(imgs.map(function(im){return im.decode?im.decode().catch(function(){}):0}));
  Promise.race([ready,new Promise(function(r){setTimeout(r,900)})]).then(function(){
    mode='intro';pos=START+D;gl=0;t0=performance.now();last=t0;raf=requestAnimationFrame(loop);
  });
}