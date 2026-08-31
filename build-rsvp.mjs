import fs from 'node:fs';

const companionCss = `<style data-companion-ui="v7">
.companion-manager{margin-top:8px;padding:15px;border:1px solid #eadfc9;border-radius:18px;background:rgba(255,250,240,.78)}
.companion-manager-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}.companion-manager-title{font:700 .68rem Montserrat,Arial,sans-serif;letter-spacing:.08em;color:#315889}.companion-manager-help{display:block;font:400 .58rem/1.4 Montserrat,Arial,sans-serif;color:#718095;margin-top:3px}.companion-add{border:0;border-radius:999px;padding:9px 12px;background:#315889;color:#fff;font:700 .58rem Montserrat,Arial,sans-serif;cursor:pointer;white-space:nowrap}.companion-list{display:grid;gap:8px}.companion-item{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:6px;align-items:center}.companion-item input{width:100%;margin:0!important}.companion-kind{display:flex;gap:4px}.companion-kind button{border:1px solid #d9e3ec;border-radius:10px;background:#fff;color:#315889;padding:9px 8px;font:600 .56rem Montserrat,Arial,sans-serif;cursor:pointer}.companion-kind button.active{background:#eaf5fc;border-color:#9fc2dd}.companion-remove{width:34px;height:34px;border:0;border-radius:50%;background:#f7e6df;color:#ef7950;font-size:18px;cursor:pointer}.companion-total{text-align:right;margin-top:9px;font:600 .6rem Montserrat,Arial,sans-serif;color:#718095}@media(max-width:600px){.companion-manager-head{align-items:flex-start;flex-direction:column}.companion-add{width:100%}.companion-item{grid-template-columns:minmax(0,1fr) auto}.companion-kind{grid-column:1}.companion-remove{grid-column:2;grid-row:1/3;align-self:center}}
</style>`;

const companionJs = `<script data-companion-ui="v7">(()=>{const f=document.getElementById('rsvpForm');if(!f||f.dataset.companionReady)return;const n=f.querySelector('textarea[name="acompanantes"]'),m=f.querySelector('input[name="menores_18"]');if(!n||!m)return;f.dataset.companionReady='1';const nl=n.closest('label'),ml=m.closest('label');if(nl)nl.style.display='none';if(ml)ml.style.display='none';const b=document.createElement('div');b.className='companion-manager';b.innerHTML='<div class="companion-manager-head"><div><div class="companion-manager-title">ACOMPAÑANTES</div><span class="companion-manager-help">Agrega a cada persona por separado.</span></div><button type="button" class="companion-add">+ AGREGAR ACOMPAÑANTE</button></div><div class="companion-list"></div><div class="companion-total">0 acompañantes · 0 adultos · 0 menores</div>';nl.before(b);const list=b.querySelector('.companion-list'),add=b.querySelector('.companion-add'),tot=b.querySelector('.companion-total');let p=[];function update(){const mi=p.filter(x=>x.es_menor).length,ad=p.length-mi;tot.textContent=p.length+' acompañante'+(p.length===1?'':'s')+' · '+ad+' adulto'+(ad===1?'':'s')+' · '+mi+' menor'+(mi===1?'':'es')}function render(){list.innerHTML='';p.forEach((x,i)=>{const r=document.createElement('div');r.className='companion-item';r.innerHTML='<input type="text" maxlength="120" placeholder="Nombre del acompañante"><div class="companion-kind"><button type="button">Adulto</button><button type="button">Menor</button></div><button type="button" class="companion-remove" aria-label="Eliminar acompañante">×</button>';const inp=r.querySelector('input'),bs=r.querySelectorAll('.companion-kind button');inp.value=x.nombre;bs[0].classList.toggle('active',!x.es_menor);bs[1].classList.toggle('active',x.es_menor);inp.oninput=()=>{p[i].nombre=inp.value;update()};bs[0].onclick=()=>{p[i].es_menor=false;render()};bs[1].onclick=()=>{p[i].es_menor=true;render()};r.querySelector('.companion-remove').onclick=()=>{p.splice(i,1);render()};list.appendChild(r)});update()}add.onclick=()=>{if(p.length<20){p.push({nombre:'',es_menor:false});render();list.lastElementChild?.querySelector('input')?.focus()}};f.addEventListener('submit',()=>{p=p.filter(x=>x.nombre.trim());n.value=JSON.stringify(p);m.value=String(p.filter(x=>x.es_menor).length)},{capture:true});render()})();</script>`;

function injectCompanions(file){
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('data-companion-ui="v7"')){
    html=html.replace('</style>',companionCss+'</style>');
    html=html.replace('</body>',companionJs+'</body>');
    fs.writeFileSync(file,html,'utf8');
  }
}

// El formulario RSVP vive directamente en index.html.
// No modificar welcome.html: contiene la pantalla de bienvenida y la capa del RSVP.
injectCompanions('index.html');

const invitationFile='invitation.html';
let invitation=fs.readFileSync(invitationFile,'utf8');
invitation=invitation.replaceAll('A PARTIR DE LAS 2:00 P.M.','A PARTIR DE LAS 3:00 P.M.');
invitation=invitation.replaceAll('2:00 P.M.','3:00 P.M.');
invitation=invitation.replaceAll('XIOMARA Y CARLOS','XIOMARA SANTOS Y CARLOS ZUÑIGA');
invitation=invitation.replaceAll('MARTHA Y FERNANDO','MARTHA ACOSTA Y FERNANDO AGUILAR');

const oldBannerStart='<div class="party-time-card"';
while(true){
  const start=invitation.indexOf(oldBannerStart);
  if(start===-1) break;
  const end=invitation.indexOf('</div>',start);
  if(end===-1) break;
  invitation=invitation.slice(0,start)+invitation.slice(end+6);
}

const oldStyleStart='<style data-party-time="';
while(true){
  const start=invitation.indexOf(oldStyleStart);
  if(start===-1) break;
  const end=invitation.indexOf('</style>',start);
  if(end===-1) break;
  invitation=invitation.slice(0,start)+invitation.slice(end+8);
}

const partyCss='<style data-party-time="v8">.party-time-card{position:relative;max-width:560px;margin:28px auto 30px;padding:26px 24px 24px;text-align:center;border:3px solid #78a39a;border-radius:34px;background:linear-gradient(180deg,#fffdf5 0%,#fff8e9 100%);box-shadow:0 14px 32px rgba(49,88,137,.10);overflow:hidden}.party-time-card:before{content:"";position:absolute;inset:9px;border:2px dashed #b49a72;border-radius:26px;pointer-events:none}.party-time-card:after{content:"✦   ✦   ✦";position:absolute;top:12px;left:0;right:0;color:#b49a72;font-size:.7rem;letter-spacing:.45em}.party-time-card .time-kicker{position:relative;z-index:1;display:block;margin-top:5px;color:#ef7950;font:800 .68rem Montserrat,Arial,sans-serif;letter-spacing:.28em}.party-time-card .time-value{position:relative;z-index:1;display:block;margin:13px 0 7px;color:#315889;font:800 clamp(2.1rem,8vw,3.2rem) Montserrat,Arial,sans-serif;letter-spacing:.03em}.party-time-card .time-note{position:relative;z-index:1;display:block;color:#526f66;font:600 .78rem/1.5 'Cormorant Garamond',Georgia,serif;letter-spacing:.04em}.party-time-card .time-note:before,.party-time-card .time-note:after{content:"♥";color:#ef7950;font-size:.62rem;margin:0 9px}@media(max-width:600px){.party-time-card{margin:22px 8px 26px;padding:23px 16px 22px;border-width:2px;border-radius:28px}.party-time-card:before{inset:7px;border-width:1.5px;border-radius:21px}.party-time-card:after{top:9px;font-size:.58rem}.party-time-card .time-kicker{font-size:.58rem}.party-time-card .time-value{font-size:1.9rem;margin-top:12px}.party-time-card .time-note{font-size:.7rem}.party-time-card .time-note:before,.party-time-card .time-note:after{margin:0 5px}}</style>';
invitation=invitation.replace('</style>',partyCss+'</style>');

const partyBanner='<div class="party-time-card" data-party-time="v8"><span class="time-kicker">FIESTA</span><span class="time-value">3:00 P.M.</span><span class="time-note">A partir de las 3 de la tarde</span></div>';
const videoToken='<video class="party-video"';
const videoPos=invitation.indexOf(videoToken);
if(videoPos!==-1){
  invitation=invitation.slice(0,videoPos)+partyBanner+invitation.slice(videoPos);
}else{
  invitation=invitation.replace('</section></main>',partyBanner+'</section></main>');
}

fs.writeFileSync(invitationFile,invitation,'utf8');
