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

// Remove every previous generated party-time block before inserting one.
// The poster is always located immediately before the existing party video,
// so this removes the entire generated block even when it contains nested HTML.
invitation = invitation.replace(/<style data-party-time="[^"]*">[\s\S]*?<\/style>/g, '');
invitation = invitation.replace(/<div[^>]*class="[^"]*party-time-poster[^"]*"[^>]*>[\s\S]*?(?=<video class="party-video")/g, '');
invitation = invitation.replace(/<div[^>]*class="[^"]*party-time-card[^"]*"[^>]*>[\s\S]*?(?=<video class="party-video")/g, '');
invitation = invitation.replace(/<div[^>]*class="[^"]*party-time-text[^"]*"[^>]*>[\s\S]*?(?=<video class="party-video")/g, '');

// One standalone party-time poster. The existing birthday heading remains
// untouched; this block communicates only the party start time.
const partyCss = `<style data-party-time="time-poster-v3">
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
@media(max-width:600px){.party-time-poster{width:min(100%,370px);margin:25px auto 29px;padding:0 12px 21px;border-radius:24px}.party-time-poster .poster-bunting{margin-top:14px}.party-time-poster .poster-bunting i{border-left-width:11px;border-right-width:11px;border-top-width:19px}.party-time-poster .poster-time{font-size:3rem}.party-time-poster .poster-kicker{font-size:.62rem;letter-spacing:.2em}}
</style>`;

invitation = invitation.replace('</style>', partyCss + '</style>');

// Keep the existing confirmation routing unchanged.
const rsvpScript = `<script data-rsvp-route="v2">(()=>{const wire=()=>{document.querySelectorAll('.confirm button').forEach(btn=>{if(btn.dataset.rsvpRoute)return;btn.dataset.rsvpRoute='1';btn.type='button';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();window.location.href='/rsvp.html'},true)})};wire();new MutationObserver(wire).observe(document.body,{childList:true,subtree:true})})();</script>`;
if (!invitation.includes('data-rsvp-route="v2"')) {
  invitation = invitation.replace('</body>', rsvpScript + '</body>');
}

// Add exactly one time poster before the existing party video.
const banner = '<div class="party-time-poster" data-party-time="time-poster-v3"><div class="poster-bunting" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="poster-kicker">FIESTA</span><div class="poster-rule"><span>✦</span></div><span class="poster-time">3:00 P.M.</span><span class="poster-note">A partir de las 3 de la tarde</span></div>';
const marker = '<video class="party-video"';
const pos = invitation.indexOf(marker);
if (pos >= 0) {
  invitation = invitation.slice(0, pos) + banner + invitation.slice(pos);
}

fs.writeFileSync('invitation.html', invitation, 'utf8');
