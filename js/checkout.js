var esc=function(s){return String(s).replace(/[<>&"]/g,'')};
function draw(){
  var bag=getBag(),items=$('items'),sub=0,disc=0;
  if(!bag.length){
    $('page').innerHTML='<h1>Checkout</h1><div class="empty"><p>Your bag is empty.</p><a class="btn" href="index.html">Browse looks</a></div>';return;
  }
  items.textContent='';
  bag.forEach(function(x,n){
    var p=L[x.l].i[x.i],r=document.createElement('div');r.className='r';
    var th=document.createElement('div');th.className='th';th.appendChild(pieceImg(x.l,x.i,false));
    var t=document.createElement('div');t.innerHTML='<b></b><div style="opacity:.65;margin:3px 0"></div>'+money(p[1]);
    t.firstChild.textContent=p[0];t.children[1].textContent='Size '+x.s+' · '+L[x.l].n;
    var rm=document.createElement('button');rm.type='button';rm.setAttribute('aria-label','Remove '+p[0]);rm.textContent='×';
    rm.onclick=function(){bag.splice(n,1);setBag(bag);draw()};
    r.appendChild(th);r.appendChild(t);r.appendChild(rm);items.appendChild(r);
    sub+=p[1];if(x.b)disc+=p[1]*.1;
  });
  $('tots').innerHTML='<dl><dt>Subtotal</dt><dd>'+money(sub)+'</dd></dl>'+(disc?'<dl><dt>Look bundle −10%</dt><dd>−'+money(disc)+'</dd></dl>':'')+'<dl><dt>Shipping</dt><dd>Free</dd></dl><dl class="t"><dt>Total</dt><dd>'+money(sub-disc)+'</dd></dl>';
  draw.total=sub-disc;
}
draw();
var fm=$('form');
if(fm)fm.addEventListener('submit',function(e){
  e.preventDefault();
  var bag=getBag(),o={items:bag,total:draw.total,date:new Date().toISOString()};
  new FormData(fm).forEach(function(v,k){o[k]=v});
  try{localStorage.setItem('test_last_order',JSON.stringify(o))}catch(x){}
  var no='TEST-'+Math.floor(100000+Math.random()*900000);
  setBag([]);
  $('page').innerHTML='<div class="ok"><h1>Thank you, '+esc(o.name)+'</h1><p>Order <b>'+no+'</b> is confirmed — '+money(o.total)+'.<br>We will contact you on '+esc(o.phone)+' to arrange delivery.</p><a class="btn" href="index.html">Continue shopping</a></div>';
  scrollTo(0,0);
});
