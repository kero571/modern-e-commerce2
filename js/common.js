/* Shared data + helpers (brand: TEST). Edit L to change looks/pieces/prices. */
var L=[
{n:'Everyday Layer',c:['#6b6f76','#5f84a8','#d9d9d9'],i:[['Crew Sweater',95,'Top'],['Baggy Denim',120,'Bottom'],['Trail Runner',140,'Shoes']]},
{n:'Off Duty',c:['#f4f4f2','#8f9b86','#e8e8e8'],i:[['Heavy Tee',65,'Top'],['Washed Wide Jeans',130,'Bottom'],['Court Sneaker',135,'Shoes']]},
{n:'Forest Walk',c:['#5a6347','#6b4a33','#a0714f'],i:[['Knit Crewneck',110,'Top'],['Brown Cord Pants',115,'Bottom'],['Suede Loafer',150,'Shoes']]},
{n:'Studio Day',c:['#1c1c1e','#a9c1de','#f2f2f2'],i:[['Boxy Black Tee',70,'Top'],['Light Wash Baggy',125,'Bottom'],['Low Court',140,'Shoes']]},
{n:'Night Shift',c:['#2a2d36','#3a3f4a','#555'],i:[['Heavy Hoodie',130,'Top'],['Raw Black Jeans',120,'Bottom'],['High Runner',160,'Shoes']]},
{n:'Sand Series',c:['#cdb998','#7a6a55','#e3ddd0'],i:[['Fleece Hoodie',110,'Top'],['Utility Pants',105,'Bottom'],['Canvas Low',95,'Shoes']]}];
/* hotspot position (% of figure box) for top / bottom / shoes. Override per look with L[x].h */
var H=[[50,34],[40,60],[34,93]];
var $=function(i){return document.getElementById(i)};
var money=function(v){return '$'+v.toFixed(2)};
var sizesOf=function(k){return k==='Shoes'?['40','41','42','43','44','45']:['S','M','L','XL']};
var defSize=function(k){return k==='Shoes'?'42':'M'};
var lookTotal=function(l){return L[l].i.reduce(function(a,x){return a+x[1]},0)};

function figure(c){
  return '<svg viewBox="0 0 180 320" role="img"><ellipse cx="90" cy="306" rx="70" ry="9" fill="#0002"/>'+
  '<circle cx="90" cy="30" r="16" fill="#8a6a52"/><rect x="80" y="44" width="20" height="10" fill="#8a6a52"/>'+
  '<path d="M52 54 H128 L156 104 L140 112 L128 92 V150 H52 V92 L40 112 L24 104 Z" fill="'+c[0]+'"/>'+
  '<path d="M54 148 H126 L140 292 H96 L90 192 L84 292 H40 Z" fill="'+c[1]+'"/>'+
  '<ellipse cx="62" cy="298" rx="22" ry="8" fill="'+c[2]+'" stroke="#9998"/><ellipse cx="118" cy="298" rx="22" ry="8" fill="'+c[2]+'" stroke="#9998"/></svg>';
}
function swatch(k,col){
  var s=k==='Top'?'<path d="M60 40 H140 L176 90 L156 104 L140 88 V170 H60 V88 L44 104 L24 90 Z" fill="'+col+'"/>':
  k==='Bottom'?'<path d="M60 20 H140 L150 180 H106 L100 70 L94 180 H50 Z" fill="'+col+'"/>':
  '<path d="M20 120 Q20 90 60 100 L110 112 Q170 120 180 140 V158 H20 Z" fill="'+col+'" stroke="#9998"/>';
  return '<svg viewBox="0 0 200 200" role="img">'+s+'</svg>';
}
/* Images: put files in /images. Extensions are tried in this order (first one that exists wins).
   Missing file -> SVG placeholder. Names:
   images/look1.png ... look6.png        full-body look photo (look N)
   images/look1-p1.png (top), -p2 (bottom), -p3 (shoes)   piece photos for look 1 (same for the others) */
var IMG_DIR='images/',IMG_EXT=['png','webp','jpg','jpeg'];
function mk(base,alt,w,h,eager,fb,done){
  var im=new Image(),n=0;im.width=w;im.height=h;im.alt=alt;im.draggable=false;im.decoding='async';
  if(eager)im.fetchPriority='high';else im.loading='lazy';
  /* done(ratio): بيرجع نسبة عرض/ارتفاع الصورة الحقيقية (أو 9/16 لو الصورة مش موجودة) */
  im.addEventListener('load',function(){if(done&&im.naturalHeight)done(im.naturalWidth/im.naturalHeight)});
  im.addEventListener('error',function(){
    if(++n<IMG_EXT.length){im.src=IMG_DIR+base+'.'+IMG_EXT[n];return}
    var d=document.createElement('div');d.className='fb';d.innerHTML=fb();
    if(im.parentNode)im.parentNode.replaceChild(d,im);
    if(done)done(9/16);
  });
  im.src=IMG_DIR+base+'.'+IMG_EXT[0];return im;
}
var lookImg=function(l,eager,done){return mk('look'+(l+1),L[l].n,360,640,eager,function(){return figure(L[l].c)},done)};
var pieceImg=function(l,i,eager){return mk('look'+(l+1)+'-p'+(i+1),L[l].i[i][0],200,200,eager,function(){return swatch(L[l].i[i][2],L[l].c[i])})};

/* bag: [{l:look,i:piece,s:size,b:1 if added with full look}] */
function getBag(){try{return JSON.parse(localStorage.getItem('test_bag'))||[]}catch(e){return[]}}
function setBag(b){try{localStorage.setItem('test_bag',JSON.stringify(b))}catch(e){}bagUI()}
function bagUI(){var n=getBag().length,e=$('bagc');if(e){e.textContent=n||'';e.hidden=!n}}
function toast(msg,html){
  var t=$('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}
  t.innerHTML=html||'';if(!html)t.textContent=msg;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(function(){t.hidden=true},2600);
}
(function(){
  var b=$('menu'),n=$('nav');
  if(b)b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)},{passive:true});
  bagUI();
})();