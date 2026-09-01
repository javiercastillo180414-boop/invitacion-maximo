import fs from 'node:fs';

let invitation = fs.readFileSync('invitation.html', 'utf8');

// RSVP is a standalone page. Keep the invitation stable and make the
// confirmation action explicitly open the standalone RSVP page.
invitation = invitation.replaceAll('/index.html', '/rsvp.html');
invitation = invitation.replaceAll('index.html', 'rsvp.html');

// Requested family names and party time.
invitation = invitation.replaceAll('XIOMARA Y CARLOS', 'XIOMARA SANTOS Y CARLOS ZUÑIGA');
invitation = invitation.replaceAll('MARTHA Y FERNANDO', 'MARTHA ACOSTA Y FERNANDO AGUILAR');
invitation = invitation.replaceAll('A PARTIR DE LAS 2:00 P.M.', 'A PARTIR DE LAS 3:00 P.M.');
invitation = invitation.replaceAll('2:00 P.M.', '3:00 P.M.');

// Remove any previously generated party-time block.
invitation = invitation.replace(/<style data-party-time="[^"]*">[\s\S]*?<\/style>/g, '');
invitation = invitation.replace(/<div class="party-time-card"[^>]*>[\s\S]*?<\/div>/g, '');
invitation = invitation.replace(/<div class="party-time-text"[^>]*>[\s\S]*?<\/div>/g, '');

// Decorative poster integrated with the invitation's birthday section.
const partyCss = `<style data-party-time="poster-v1">
.party-time-poster{position:relative;width:min(100%,650px);margin:34px auto 34px;padding:30px 24px 28px;text-align:center;background:#fff;border:1px solid rgba(49,88,137,.12);border-radius:30px;box-shadow:0 18px 45px rgba(49,88,137,.14);overflow:hidden}
.party-time-poster:before{content:'';position:absolute;left:0;right:0;top:0;height:8px;background:#f5c84b}
.party-time-poster:after{content:'✦     ✦     ✦';position:absolute;left:0;right:0;bottom:10px;color:#b49a72;font-size:.62rem;letter-spacing:.18em}
.party-bunting{display:flex;justify-content:center;gap:7px;margin:8px auto 21px}
.party-bunting i{display:block;width:0;height:0;border-left:20px solid transparent;border-right:20px solid transparent;border-top:34px solid #315889}
.party-bunting i:nth-child(2n){border-top-color:#ef7950}
.party-bunting i:nth-child(3n){border-top-color:#78b85b}
.party-bunting i:nth-child(4n){border-top-color:#8a79bd}
.party-bunting i:nth-child(5n){border-top-color:#f5c84b}
.party-time-poster .poster-kicker{display:block;color:#ef7950;font:800 .67rem Montserrat,Arial,sans-serif;letter-spacing:.24em;margin-bottom:8px}
.party-time-poster .poster-title{display:block;color:#315889;font:800 clamp(2.2rem,8vw,3.7rem) Montserrat,Arial,sans-serif;line-height:1;margin:0}
.party-time-poster .poster-rule{display:flex;align-items:center;gap:10px;max-width:260px;margin:16px auto 12px;color:#b49a72}
.party-time-poster .poster-rule:before,.party-time-poster .poster-rule:after{content:'';height:1px;background:#b49a72;flex:1}
.party-time-poster .poster-time{display:block;color:#315889;font:800 clamp(2.8rem,11vw,4.7rem) Montserrat,Arial,sans-serif;line-height:1;margin:0}
.party-time-poster .poster-note{display:block;margin-top:9px;color:#718095;font:600 .85rem/1.5 'Cormorant Garamond',Georgia,serif;letter-spacing:.04em}
@media(max-width:600px){.party-time-poster{margin:26px auto 30px;padding:27px 14px 28px;border-radius:25px}.party-bunting{gap:4px;margin-bottom:18px}.party-bunting i{border-left-width:15px;border-right-width:15px;border-top-width:27px}.party-time-poster .poster-title{font-size:2rem}.party-time-poster .poster-time{font-size:3rem}}
</style>`;

invitation = invitation.replace('</style>', partyCss + '</style>');

// Keep the existing confirmation routing unchanged.
const rsvpScript = `<script data-rsvp-route="v2">(()=>{const wire=()=>{document.querySelectorAll('.confirm button').forEach(btn=>{if(btn.dataset.rsvpRoute)return;btn.dataset.rsvpRoute='1';btn.type='button';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();window.location.href='/rsvp.html'},true)})};wire();new MutationObserver(wire).observe(document.body,{childList:true,subtree:true})})();</script>`;
if (!invitation.includes('data-rsvp-route="v2"')) {
  invitation = invitation.replace('</body>', rsvpScript + '</body>');
}

const banner = '<div class="party-time-poster" data-party-time="poster-v1"><div class="party-bunting" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="poster-kicker">AHORA SÍ... ¡A FESTEJAR!</span><span class="poster-title">¡CUMPLEAÑOS!</span><div class="poster-rule"><span>✦</span></div><span class="poster-time">3:00 P.M.</span><span class="poster-note">A partir de las 3 de la tarde</span></div>';
const marker = '<video class="party-video"';
const pos = invitation.indexOf(marker);
if (pos >= 0) {
  invitation = invitation.slice(0, pos) + banner + invitation.slice(pos);
}

fs.writeFileSync('invitation.html', invitation, 'utf8');
