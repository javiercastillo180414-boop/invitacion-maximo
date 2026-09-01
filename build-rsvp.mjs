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

// The requested party time is plain text: no card, border, box or background.
const partyCss = `<style data-party-time="plain">
.party-time-text{max-width:560px;margin:27px auto 30px;text-align:center}
.party-time-text .time-kicker{display:block;color:#ef7950;font:800 .65rem Montserrat,Arial,sans-serif;letter-spacing:.2em}
.party-time-text .time-value{display:block;margin:9px 0 5px;color:#315889;font:800 clamp(2rem,8vw,3rem) Montserrat,Arial,sans-serif}
.party-time-text .time-note{display:block;color:#718095;font:600 .72rem/1.5 'Cormorant Garamond',Georgia,serif}
@media(max-width:600px){.party-time-text{margin:22px 8px 26px}.party-time-text .time-value{font-size:1.8rem}}
</style>`;

invitation = invitation.replace('</style>', partyCss + '</style>');

// Keep the existing confirmation routing unchanged.
const rsvpScript = `<script data-rsvp-route="v2">(()=>{const wire=()=>{document.querySelectorAll('.confirm button').forEach(btn=>{if(btn.dataset.rsvpRoute)return;btn.dataset.rsvpRoute='1';btn.type='button';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();window.location.href='/rsvp.html'},true)})};wire();new MutationObserver(wire).observe(document.body,{childList:true,subtree:true})})();</script>`;
if (!invitation.includes('data-rsvp-route="v2"')) {
  invitation = invitation.replace('</body>', rsvpScript + '</body>');
}

const banner = '<div class="party-time-text" data-party-time="plain"><span class="time-kicker">FIESTA</span><span class="time-value">3:00 P.M.</span><span class="time-note">A partir de las 3 de la tarde</span></div>';
const marker = '<video class="party-video"';
const pos = invitation.indexOf(marker);
if (pos >= 0) {
  invitation = invitation.slice(0, pos) + banner + invitation.slice(pos);
}

fs.writeFileSync('invitation.html', invitation, 'utf8');
