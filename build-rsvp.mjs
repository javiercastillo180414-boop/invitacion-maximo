import fs from 'node:fs';

const indexFile = 'index.html';
let index = fs.readFileSync(indexFile, 'utf8');

if (!index.includes('data-companion-ui="v3"')) {
  const css = [
    '<style data-companion-ui="v3">',
    '.companion-manager{margin-top:8px;padding:15px;border:1px solid #eadfc9;border-radius:18px;background:rgba(255,250,240,.78)}',
    '.companion-manager-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}',
    '.companion-manager-title{font:700 .68rem Montserrat,Arial,sans-serif;letter-spacing:.08em;color:#315889}',
    '.companion-manager-help{display:block;font:400 .58rem/1.4 Montserrat,Arial,sans-serif;color:#718095;margin-top:3px}',
    '.companion-add{border:0;border-radius:999px;padding:9px 12px;background:#315889;color:#fff;font:700 .58rem Montserrat,Arial,sans-serif;cursor:pointer;white-space:nowrap}',
    '.companion-list{display:grid;gap:8px}.companion-item{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:6px;align-items:center}',
    '.companion-item input{width:100%;margin:0!important}.companion-kind{display:flex;gap:4px}',
    '.companion-kind button{border:1px solid #d9e3ec;border-radius:10px;background:#fff;color:#315889;padding:9px 8px;font:600 .56rem Montserrat,Arial,sans-serif;cursor:pointer}',
    '.companion-kind button.active{background:#eaf5fc;border-color:#9fc2dd}',
    '.companion-remove{width:34px;height:34px;border:0;border-radius:50%;background:#f7e6df;color:#ef7950;font-size:18px;cursor:pointer}',
    '.companion-total{text-align:right;margin-top:9px;font:600 .6rem Montserrat,Arial,sans-serif;color:#718095}',
    '@media(max-width:600px){.companion-manager-head{align-items:flex-start;flex-direction:column}.companion-add{width:100%}.companion-item{grid-template-columns:minmax(0,1fr) auto}.companion-kind{grid-column:1}.companion-remove{grid-column:2;grid-row:1/3;align-self:center}}',
    '</style>'
  ].join('');

  const js = [
    '<script data-companion-ui="v3">',
    '(()=>{',
    'const f=document.getElementById("rsvpForm");if(!f)return;',
    'const n=f.querySelector("textarea[name=acompanantes]"),m=f.querySelector("input[name=menores_18]");if(!n||!m)return;',
    'const nl=n.closest("label"),ml=m.closest("label");if(nl)nl.style.display="none";if(ml)ml.style.display="none";',
    'const b=document.createElement("div");b.className="companion-manager";',
    'b.innerHTML="<div class=\"companion-manager-head\"><div><div class=\"companion-manager-title\">ACOMPAÑANTES</div><span class=\"companion-manager-help\">Agrega a cada persona por separado.</span></div><button type=\"button\" class=\"companion-add\">+ AGREGAR ACOMPAÑANTE</button></div><div class=\"companion-list\"></div><div class=\"companion-total\">0 acompañantes · 0 adultos · 0 menores</div>";',
    'nl.before(b);',
    'const list=b.querySelector(".companion-list"),add=b.querySelector(".companion-add"),tot=b.querySelector(".companion-total");let p=[];',
    'function update(){const mi=p.filter(x=>x.es_menor).length,ad=p.length-mi;tot.textContent=`${p.length} acompañante${p.length===1?"":"s"} · ${ad} adulto${ad===1?"":"s"} · ${mi} menor${mi===1?"":"es"}`}',
    'function render(){list.innerHTML="";p.forEach((x,i)=>{const r=document.createElement("div");r.className="companion-item";r.innerHTML="<input type=\"text\" maxlength=\"120\" placeholder=\"Nombre del acompañante\"><div class=\"companion-kind\"><button type=\"button\">Adulto</button><button type=\"button\">Menor</button></div><button type=\"button\" class=\"companion-remove\">×</button>";const inp=r.querySelector("input"),bs=r.querySelectorAll(".companion-kind button");inp.value=x.nombre;bs[0].classList.toggle("active",!x.es_menor);bs[1].classList.toggle("active",x.es_menor);inp.oninput=()=>{p[i].nombre=inp.value;update()};bs[0].onclick=()=>{p[i].es_menor=false;render()};bs[1].onclick=()=>{p[i].es_menor=true;render()};r.querySelector(".companion-remove").onclick=()=>{p.splice(i,1);render()};list.appendChild(r)});update()}',
    'add.onclick=()=>{if(p.length<20){p.push({nombre:"",es_menor:false});render();list.lastElementChild?.querySelector("input")?.focus()}};',
    'f.addEventListener("submit",()=>{p=p.filter(x=>x.nombre.trim());n.value=JSON.stringify(p);m.value=String(p.filter(x=>x.es_menor).length)},{capture:true});',
    'render();})();',
    '</script>'
  ].join('');

  index = index.replace('</style>', css + '</style>');
  index = index.replace('</body>', js + '</body>');
  fs.writeFileSync(indexFile, index, 'utf8');
}

const invitationFile = 'invitation.html';
let invitation = fs.readFileSync(invitationFile, 'utf8');
invitation = invitation.replaceAll('A PARTIR DE LAS 2:00 P.M.', 'A PARTIR DE LAS 3:00 P.M.');
invitation = invitation.replaceAll('2:00 P.M.', '3:00 P.M.');
invitation = invitation.replace('XIOMARA Y CARLOS', 'XIOMARA SANTOS Y CARLOS ZUÑIGA');
invitation = invitation.replace('MARTHA Y FERNANDO', 'MARTHA ACOSTA Y FERNANDO AGUILAR');
fs.writeFileSync(invitationFile, invitation, 'utf8');
