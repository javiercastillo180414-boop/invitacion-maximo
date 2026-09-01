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

// Remove any previously generated party-time block, including nested markup.
invitation = invitation.replace(/<style data-party-time="[^"]*">[\s\S]*?<\/style>/g, '');
invitation = invitation.replace(/<div class="party-time-poster"[^>]*>[\s\S]*?<\/div>\s*(?=<video class="party-video")/g, '');
invitation = invitation.replace(/<div class="party-time-card"[^>]*>[\s\S]*?<\/div>\s*(?=<video class="party-video")/g, '');
invitation = invitation.replace(/<div class="party-time-text"[^>]*>[\s\S]*?<\/div>\s*(?=<video class="party-video")/g, '');

// Single decorative time poster. The birthday title remains in the party section;
// this block only communicates the party start time.
const partyCss = `<style data-party-time="time-poster-v2">
.party-time-poster{width:min(100%,560px);margin:28px auto 30px;padding:25px 22px 27px;text-align:center;background:rgba(255,255,255,.78);border:1px solid rgba(180,154,114,.28);border-radius:24px;box-shadow:0 12px 32px rgba(49,88,137,.08)}
.party-time-poster .poster-kicker{display:block;color:#ef7950;font:800 .68rem Montserrat,Arial,sans-serif;letter-spacing:.25em;margin-bottom:8px}
.party-time-poster .poster-rule{display:flex;align-items:center;gap:10px;width:min(100%,300px);margin:0 auto 12px;color:#b49a72}
.party-time-poster .poster-rule:before,.party-time-poster .poster-rule:after{content:'';height:1px;background:#b49a72;flex:1}
.party-time-poster .poster-rule span{font-size:.65rem}
.party-time-poster .poster-time{display:block;color:#315889;font:800 clamp(3rem,12vw,4.8rem) Montserrat,Arial,sans-serif;line-height:.95;margin:0}
.party-time-poster .poster-note{display:block;margin-top:10px;color:#718095;font:600 .9rem/1.45 'Cormorant Garamond',Georgia,serif;letter-spacing:.04em}
@media(max-width:600px){.party-time-poster{margin:24px auto 27px;padding:23px 14px 25px;border-radius:21px}.party-time-poster .poster-time{font-size:3rem}}
</style>`;

invitation = invitation.replace('</style>', partyCss + '</style>');

// Keep the existing confirmation routing unchanged.
const rsvpScript = `<script data-rsvp-route="v2">(()=>{const wire=()=>{document.querySelectorAll('.confirm button').forEach(btn=>{if(btn.dataset.rsvpRoute)return;btn.dataset.rsvpRoute='1';btn.type='button';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();window.location.href='/rsvp.html'},true)})};wire();new MutationObserver(wire).observe(document.body,{childList:true,subtree:true})})();</script>`;
if (!invitation.includes('data-rsvp-route="v2"')) {
  invitation = invitation.replace('</body>', rsvpScript + '</body>');
}

// Add exactly one time poster before the existing party video.
const banner = '<div class="party-time-poster" data-party-time="time-poster-v2"><span class="poster-kicker">FIESTA</span><div class="poster-rule"><span>✦</span></div><span class="poster-time">3:00 P.M.</span><span class="poster-note">A partir de las 3 de la tarde</span></div>';
const marker = '<video class="party-video"';
const pos = invitation.indexOf(marker);
if (pos >= 0) {
  invitation = invitation.slice(0, pos) + banner + invitation.slice(pos);
}

fs.writeFileSync('invitation.html', invitation, 'utf8');
