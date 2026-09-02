import fs from 'node:fs';

let invitation = fs.readFileSync('invitation.html', 'utf8');

invitation = invitation.replaceAll('/index.html', '/rsvp.html');
invitation = invitation.replaceAll('index.html', 'rsvp.html');
invitation = invitation.replaceAll('XIOMARA Y CARLOS', 'XIOMARA SANTOS Y CARLOS ZUÑIGA');
invitation = invitation.replaceAll('MARTHA Y FERNANDO', 'MARTHA ACOSTA Y FERNANDO AGUILAR');
invitation = invitation.replaceAll('A PARTIR DE LAS 2:00 P.M.', 'A PARTIR DE LAS 3:00 P.M.');
invitation = invitation.replaceAll('2:00 P.M.', '3:00 P.M.');

// Remove generated artifacts so every build starts clean.
invitation = invitation.replace(/<style data-party-time="[^"]*">[\s\S]*?<\/style>/g, '');
invitation = invitation.replace(/<div[^>]*class="[^"]*party-time-poster[^"]*"[^>]*>[\s\S]*?(?=<video class="party-video")/g, '');

const partyCss = `
.party-time-poster{position:relative;width:min(100%,560px);margin:30px auto 32px;padding:0 18px 22px;text-align:center;background:linear-gradient(180deg,#ffffff 0%,#f8fcff 100%);border:1px solid rgba(49,88,137,.12);border-radius:28px;box-shadow:0 16px 38px rgba(49,88,137,.12);overflow:hidden}
.party-time-poster:before{content:'';display:block;height:9px;background:linear-gradient(90deg,#315889 0 20%,#ef7950 20% 40%,#78b85b 40% 60%,#8a79bd 60% 80%,#f5c84b 80% 100%)}
.party-time-poster:after{content:'✦   ✦   ✦';position:absolute;left:0;right:0;bottom:8px;color:#b49a72;font-size:.62rem;letter-spacing:.25em}
.party-time-poster .poster-bunting{display:flex;justify-content:center;gap:4px;margin:16px auto 15px}
.party-time-poster .poster-bunting i{display:block;width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-top:22px solid #315889}
.party-time-poster .poster-bunting i:nth-child(2n){border-top-color:#ef7950}
.party-time-poster .poster-bunting i:nth-child(3n){border-top-color:#78b85b}
.party-time-poster .poster-bunting i:nth-child(4n){border-top-color:#8a79bd}
.party-time-poster .poster-bunting i:nth-child(5n){border-top-color:#f5c84b}
.party-time-poster .poster-kicker{display:block;color:#ef7950;font:800 .7rem Montserrat,Arial,sans-serif;letter-spacing:.28em;margin:0 0 8px}
.party-time-poster .poster-rule{display:flex;align-items:center;gap:10px;width:min(100%,280px);margin:0 auto 13px;color:#b49a72}
.party-time-poster .poster-rule:before,.party-time-poster .poster-rule:after{content:'';height:1px;background:#b49a72;flex:1}
.party-time-poster .poster-rule span{font-size:.65rem}
.party-time-poster .poster-time{display:block;color:#315889;font:800 clamp(3rem,12vw,4.6rem) Montserrat,Arial,sans-serif;line-height:.95;margin:0}
.party-time-poster .poster-note{display:block;margin:10px 0 4px;color:#718095;font:600 .92rem/1.45 'Cormorant Garamond',Georgia,serif;letter-spacing:.04em}

/* Video resilience: keep the existing visual treatment, add a poster and a clear error state. */
.party-video-shell{position:relative;width:min(100%,520px);margin:27px auto}
.party-video-shell .party-video{display:block;width:100%;aspect-ratio:9/16;object-fit:contain;background:#fff;border-radius:24px;margin:0;box-shadow:0 16px 40px rgba(49,88,137,.12)}
.party-video-error{display:none;margin-top:10px;padding:12px 15px;border-radius:14px;background:#fff;border:1px solid rgba(49,88,137,.12);color:#718095;font:600 .72rem/1.5 Montserrat,Arial,sans-serif;text-align:center}
.party-video-error a{display:inline-block;margin-top:7px;color:#315889;font-weight:800;text-decoration:underline}
.party-video-shell.video-error .party-video{background:#f5f8fb}
.party-video-shell.video-error .party-video-error{display:block}
@media(max-width:600px){
  .party-time-poster{width:min(100%,370px);margin:25px auto 29px;padding:0 12px 21px;border-radius:24px}
  .party-time-poster .poster-bunting{margin-top:14px}
  .party-time-poster .poster-bunting i{border-left-width:11px;border-right-width:11px;border-top-width:19px}
  .party-time-poster .poster-time{font-size:3rem}
  .party-time-poster .poster-kicker{font-size:.62rem;letter-spacing:.2em}
  .party-video-shell{width:min(88vw,390px);margin:25px auto}
}
`;
invitation = invitation.replace('</style>', partyCss + '</style>');

// The top-level index.html owns background music. The invitation is inside an iframe,
// so its own audio element must not exist; otherwise the first interaction can start a second track.
invitation = invitation.replace(/<audio id="bgMusic"[\s\S]*?<\/audio>/g, '');

const musicBridge = `<script data-music-bridge="v2">(()=>{const control=document.getElementById('musicControl');if(!control)return;const sync=playing=>{control.classList.toggle('playing',!!playing);control.textContent=playing?'❚❚':'♫';control.setAttribute('aria-label',playing?'Pausar música':'Reproducir música');control.title=playing?'Pausar música':'Reproducir música'};control.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.parent.postMessage({type:'maximo-music-toggle'},'*')});window.addEventListener('message',e=>{if(e.data?.type==='maximo-music-state')sync(e.data.playing)});window.parent.postMessage({type:'maximo-music-request-state'},'*')})();</script>`;

// Replace the original invitation music controller script, leaving all other page behavior intact.
invitation = invitation.replace(/<script>const modal=document\.getElementById\('modal'\);[\s\S]*?<\/script>/, musicBridge);

const rsvpScript = `<script data-rsvp-route="v2">(()=>{const wire=()=>{document.querySelectorAll('.confirm button').forEach(btn=>{if(btn.dataset.rsvpRoute)return;btn.dataset.rsvpRoute='1';btn.type='button';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();window.location.href='/rsvp.html'},true)})};wire();new MutationObserver(wire).observe(document.body,{childList:true,subtree:true})})();</script>`;
if (!invitation.includes('data-rsvp-route="v2"')) invitation = invitation.replace('</body>', rsvpScript + '</body>');

// Force the party video to be permanently silent on every build.
invitation = invitation.replace(/<video([^>]*class="party-video"[^>]*)>/gi, (_, attrs) => {
  const clean = attrs.replace(/\s+(?:muted|defaultmuted|volume\s*=\s*[^\s>]+)/gi, '');
  return `<video${clean} muted playsinline>`;
});

// Harden the video element for real-world mobile browsers.
// Use an absolute asset URL from the site root (the invitation is rendered in an iframe),
// add a poster so a failed/slow load is never just a black rectangle, and expose an error fallback.
invitation = invitation.replace(/<video([^>]*class="party-video"[^>]*)>[\s\S]*?<source[^>]*>[\s\S]*?<\/video>/i, (_, attrs) => {
  const clean = attrs
    .replace(/\s+poster\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s+preload\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s+src\s*=\s*["'][^"']*["']/gi, '');
  return `<div class="party-video-shell"><video${clean} poster="/assets/whatsapp-preview-final.jpg" preload="metadata" muted playsinline controls><source src="/assets/invitacion-cumpleanos.mp4?v=2" type="video/mp4">Tu navegador no puede reproducir este video.</video><div class="party-video-error">No se pudo cargar el video en este dispositivo.<br><a href="/assets/invitacion-cumpleanos.mp4?v=2" target="_blank" rel="noopener">Abrir el video directamente</a></div></div>`;
});

const videoAudioGuard = `<script data-video-audio-guard="v2">(()=>{const silence=()=>{document.querySelectorAll('video').forEach(v=>{v.defaultMuted=true;v.muted=true;v.volume=0;v.addEventListener('volumechange',()=>{if(!v.muted||v.volume!==0){v.muted=true;v.defaultMuted=true;v.volume=0}},false);if(!v.dataset.videoBound){v.dataset.videoBound='1';v.addEventListener('error',()=>{v.closest('.party-video-shell')?.classList.add('video-error')});v.addEventListener('loadedmetadata',()=>{v.closest('.party-video-shell')?.classList.remove('video-error')})}})};silence();new MutationObserver(silence).observe(document.documentElement,{childList:true,subtree:true})})();</script>`;
invitation = invitation.replace('</body>', videoAudioGuard + '</body>');

const banner = '<div class="party-time-poster" data-party-time="time-poster-v4"><div class="poster-bunting" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="poster-kicker">FIESTA</span><div class="poster-rule"><span>✦</span></div><span class="poster-time">3:00 P.M.</span><span class="poster-note">A partir de las 3 de la tarde</span></div>';
const marker = '<div class="party-video-shell"><video class="party-video"';
const videoPos = invitation.indexOf(marker);
if (videoPos >= 0) {
  const videoEnd = invitation.indexOf('</div>', invitation.indexOf('</video>', videoPos));
  const shellEnd = invitation.indexOf('</div>', videoEnd + 6);
  const insertAt = shellEnd >= 0 ? shellEnd + '</div>'.length : videoEnd + '</div>'.length;
  invitation = invitation.slice(0, insertAt) + banner + invitation.slice(insertAt);
}

fs.writeFileSync('invitation.html', invitation, 'utf8');
