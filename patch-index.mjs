import fs from 'node:fs';

const path = 'index.html';
let html = fs.readFileSync(path, 'utf8');

// Android Chrome is stricter about transient user activation than iOS Safari.
// Start the music from a real click/touch gesture and explicitly load the MP3 first.
html = html.replace(
  '<audio id="music" preload="auto" loop>',
  '<audio id="music" preload="auto" loop playsinline>'
);

const oldStart = `async function start(){stopInvitationMusic();try{await music.play()}catch(e){}welcome.classList.add('hide');setTimeout(()=>welcome.remove(),800);setTimeout(bindRsvp,100)}welcome.addEventListener('pointerdown',start,{once:true});`;

const newStart = `let musicStarted=false;async function start(e){if(e){e.preventDefault();e.stopPropagation()}if(musicStarted)return;musicStarted=true;stopInvitationMusic();try{music.load();const p=music.play();if(p&&typeof p.catch==='function')await p}catch(e){musicStarted=false;return}welcome.classList.add('hide');setTimeout(()=>welcome.remove(),800);setTimeout(bindRsvp,100)}welcome.addEventListener('click',start,{once:false});welcome.addEventListener('touchend',start,{once:false,passive:false});welcome.addEventListener('pointerup',start,{once:false});`;

if (html.includes(oldStart)) {
  html = html.replace(oldStart, newStart);
} else if (!html.includes('let musicStarted=false')) {
  throw new Error('Expected music start block was not found; refusing to modify index.html');
}

fs.writeFileSync(path, html, 'utf8');
console.log('Android music patch applied');
