import fs from 'node:fs';

let invitation = fs.readFileSync('invitation.html', 'utf8');

// The RSVP is now a standalone page. The invitation only needs to point its
// existing confirmation modal/iframe to that page.
invitation = invitation.replaceAll('/index.html', '/rsvp.html');
invitation = invitation.replaceAll('index.html', 'rsvp.html');

// Requested family names and party time.
invitation = invitation.replaceAll('XIOMARA Y CARLOS', 'XIOMARA SANTOS Y CARLOS ZUÑIGA');
invitation = invitation.replaceAll('MARTHA Y FERNANDO', 'MARTHA ACOSTA Y FERNANDO AGUILAR');
invitation = invitation.replaceAll('A PARTIR DE LAS 2:00 P.M.', 'A PARTIR DE LAS 3:00 P.M.');
invitation = invitation.replaceAll('2:00 P.M.', '3:00 P.M.');

// Remove any previous generated party banner and its stylesheet.
invitation = invitation.replace(/<style data-party-time="[^"]*">[\s\S]*?<\/style>/g, '');
invitation = invitation.replace(/<div class="party-time-card"[^>]*>[\s\S]*?<\/div>/g, '');

const partyCss = `<style data-party-time="v10">
.party-time-card{max-width:560px;margin:28px auto 30px;padding:24px 20px;text-align:center;border:2px solid #b49a72;border-radius:24px;background:#fffdf5;box-shadow:0 12px 30px rgba(49,88,137,.08)}
.party-time-card .time-kicker{display:block;color:#ef7950;font:800 .65rem Montserrat,Arial,sans-serif;letter-spacing:.2em}
.party-time-card .time-value{display:block;margin:9px 0 5px;color:#315889;font:800 clamp(2rem,8vw,3rem) Montserrat,Arial,sans-serif}
.party-time-card .time-note{display:block;color:#718095;font:600 .72rem/1.5 'Cormorant Garamond',Georgia,serif}
@media(max-width:600px){.party-time-card{margin:22px 8px 26px;padding:21px 14px}.party-time-card .time-value{font-size:1.8rem}}
</style>`;

invitation = invitation.replace('</style>', partyCss + '</style>');

const banner = '<div class="party-time-card" data-party-time="v10"><span class="time-kicker">FIESTA</span><span class="time-value">3:00 P.M.</span><span class="time-note">A partir de las 3 de la tarde</span></div>';
const marker = '<video class="party-video"';
const pos = invitation.indexOf(marker);
if (pos >= 0) {
  invitation = invitation.slice(0, pos) + banner + invitation.slice(pos);
}

fs.writeFileSync('invitation.html', invitation, 'utf8');
