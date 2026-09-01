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

// Remove every previously generated party-time block before inserting one.
// The poster is always located immediately before the existing party video.
invitation = invitation.replace(/<style data-party-time="[^"]*">[\s\S]*?<\/style>/g, '');
invitation = invitation.replace(/<div[^>]*class="[^"]*party-time-poster[^"]*"[^>]*>[\s\S]*?(?=<video class="party-video")/g, '');
invitation = invitation.replace(/<div[^>]*class="[^"]*party-time-card[^"]*"[^>]*>[\s\S]*?(?=<video class="party-video")/g, '');
invitation = invitation.replace(/<div[^>]*class="[^"]*party-time-text[^"]*"[^>]*>[\s\S]*?(?=<video class="party-video")/g, '');

// IMPORTANT: this is CSS only. It is inserted inside the invitation's
// existing <style> element, so do not wrap it in another <style> tag.
const partyCss = `
.party-time-poster{position:relative;width:min(100%,560px);margin:34px auto 34px;padding:0 24px 27px;text-align:center;background:linear-gradient(180deg,#fff 0%,#f7fbff 100%);border:2px solid rgba(49,88,137,.16);border-radius:28px;box-shadow:0 16px 38px rgba(49,88,137,.14);overflow:hidden}
.party-time-poster:before{content:'';display:block;height:11px;background:linear-gradient(90deg,#315889 0 20%,#ef7950 20% 40%,#78b85b 40% 60%,#8a79bd 60% 80%,#f5c84b 80% 100%)}
.party-time-poster:after{content:'✦';position:absolute;right:24px;bottom:18px;color:#b49a72;font-size:1.15rem}
.party-time-poster .poster-kicker{display:block;margin:22px 0 8px;color:#ef7950;font:800 .72rem Montserrat,Arial,sans-serif;letter-spacing:.28em}
.party-time-poster .poster-rule{display:flex;align-items:center;gap:10px;width:min(100%,290px);margin:0 auto 14px;color:#b49a72}
.party-time-poster .poster-rule:before,.party-time-poster .poster-rule:after{content:'';height:1px;background:#b49a72;flex:1}
.party-time-poster .poster-rule span{font-size:.72rem}
.party-time-poster .poster-time{display:block;color:#315889;font:800 clamp(3.1rem,12vw,4.7rem) Montserrat,Arial,sans-serif;line-height:.95;margin:0}
.party-time-poster .poster-note{display:block;margin:11px 0 0;color:#718095;font:600 .95rem/1.45 'Cormorant Garamond',Georgia,serif;letter-spacing:.04em}
@media(max-width:600px){.party-time-poster{width:min(100%,370px);margin:28px auto 30px;padding:0 15px 25px;border-radius:23px}.party-time-poster:before{height:8px}.party-time-poster .poster-kicker{margin-top:19px;font-size:.62rem;letter-spacing:.22em}.party-time-poster .poster-time{font-size:3rem}.party-time-poster .poster-note{font-size:.88rem}}
`;

// Insert the CSS into the existing stylesheet, not as a nested <style> tag.
invitation = invitation.replace('</style>', partyCss + '</style>');

// Keep the existing confirmation routing unchanged.
const rsvpScript = `<script data-rsvp-route="v2">(()=>{const wire=()=>{document.querySelectorAll('.confirm button').forEach(btn=>{if(btn.dataset.rsvpRoute)return;btn.dataset.rsvpRoute='1';btn.type='button';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();window.location.href='/rsvp.html'},true)})};wire();new MutationObserver(wire).observe(document.body,{childList:true,subtree:true})})();</script>`;
if (!invitation.includes('data-rsvp-route="v2"')) {
  invitation = invitation.replace('</body>', rsvpScript + '</body>');
}

// Add exactly one time poster before the existing party video.
const banner = '<div class="party-time-poster" data-party-time="time-poster-v4"><span class="poster-kicker">FIESTA</span><div class="poster-rule"><span>✦</span></div><span class="poster-time">3:00 P.M.</span><span class="poster-note">A partir de las 3 de la tarde</span></div>';
const marker = '<video class="party-video"';
const pos = invitation.indexOf(marker);
if (pos >= 0) {
  invitation = invitation.slice(0, pos) + banner + invitation.slice(pos);
}

fs.writeFileSync('invitation.html', invitation, 'utf8');
