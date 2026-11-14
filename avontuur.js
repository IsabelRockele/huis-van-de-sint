(function(){
'use strict';
const $=id=>document.getElementById(id),{rooms,round}=SintData,base=window.SINT_ASSET_BASE||'./assets-local/',key='sint-huis-v8';
let current=null,store={},run=0,busy=false,muted=true,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,audio;
try{store=JSON.parse(localStorage.getItem(key)||'{}');if(!store||typeof store!=='object'||Array.isArray(store))store={};const m=localStorage.getItem('sint-motion');if(m!==null)reduced=m==='off';}catch{store={};}
// Only earned stars survive a new visit. A room is always a fresh activity.
function freshRoom(id){const done=!!store[id]?.completed;store[id]={mode:rooms.find(r=>r.id===id).modes.some(m=>m[0]===store[id]?.mode)?store[id].mode:rooms.find(r=>r.id===id).modes[0][0],round:null,step:0,solved:false,wrong:[],completed:done};}
for(const r of rooms)if(store[r.id])freshRoom(r.id);
function save(){try{localStorage.setItem(key,JSON.stringify(store));}catch{}}
function state(){return current?store[current.id]:null;}
function tone(){if(muted)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();[523,659,784].forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.09;o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.055,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.24);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.25);});}catch{}}
function stars(){return rooms.filter(r=>store[r.id]?.completed).length;}
function prepareRoomLink(link,r){for(const event of ['pointerenter','focus','pointerdown'])link.addEventListener(event,()=>SintScene.preload(r),{once:true});}
function fillHome(){
 $('doors').replaceChildren();$('room-list').replaceChildren();$('room-nav').replaceChildren();
 for(const r of rooms){
  const s=store[r.id],n=s?Math.min(8,s.step+(s.solved?1:0)):0,done=!!s?.completed;
  const a=document.createElement('a');a.className='door';a.href='#'+r.id;a.style.cssText='left:'+r.x+'%;top:'+r.y+'%;width:'+r.w+'%;height:'+r.h+'%';a.textContent=r.name;a.setAttribute('aria-label',r.name+', '+r.skill);
  if(done){const star=document.createElement('b');star.className='star';star.textContent='★';a.append(star);}prepareRoomLink(a,r);$('doors').append(a);
  const card=document.createElement('a');card.className='room-card';card.href='#'+r.id;const line=document.createElement('span'),strong=document.createElement('strong'),small=document.createElement('small'),badge=document.createElement('b');strong.textContent=r.name;small.textContent=r.skill;badge.textContent=done?'★':n?n+'/8':'→';line.append(strong,small);card.append(line,badge);prepareRoomLink(card,r);$('room-list').append(card);
  const nav=document.createElement('a');nav.href='#'+r.id;nav.textContent=r.short;if(current?.id===r.id)nav.setAttribute('aria-current','page');prepareRoomLink(nav,r);$('room-nav').append(nav);
 }
 $('home-progress').textContent=stars()===7?'★ Alle kamers geholpen! Je bent een echte Sinthelper.':stars()+' van de 7 kamersterren verdiend';
}
function screen(which){for(const id of ['setup','game','finish'])$(id).hidden=id!==which;}
function route(){
 if(current&&current.id!==location.hash.slice(1)){freshRoom(current.id);save();}
 run++;busy=false;if('speechSynthesis'in window)speechSynthesis.cancel();
 const id=location.hash.slice(1),r=rooms.find(r=>r.id===id);current=r||null;fillHome();
 $('home').hidden=!!r;$('room').hidden=!r;if(!r){SintScene.leave();document.title='Het Huis van de Sint · Zeven avonturen';return;}
 $('room-title').textContent=r.name;$('room-skill').textContent=r.skill;$('setup-title').textContent='Welkom!';$('mission').textContent=r.mission;document.title=r.name+' · Het Huis van de Sint';
 $('mode').replaceChildren();for(const [v,label]of r.modes){const o=document.createElement('option');o.value=v;o.textContent=label;$('mode').append(o);}
 const s=state();if(s)$('mode').value=s.mode;
 SintScene.enter(r,s?Math.min(8,s.step+(s.solved?1:0)):0,s?.round||[]);SintScene.reduced(reduced);
 if(s&&s.step>=8)finish();else if(s&&s.round)render();else setup();
}
function setup(){screen('setup');$('resume').hidden=!state()?.round||state().step>=8;$('start').textContent=state()?'Nieuwe ronde starten →':'Ik help mee! →';}
function start(){run++;busy=false;const old=state();store[current.id]={mode:$('mode').value,round:round(current.id,$('mode').value),step:0,solved:false,wrong:[],completed:!!old?.completed};save();SintScene.sync(0);render();}
function render(){
 const s=state();if(s.step>=8){finish();return;}const q=s.round[s.step];screen('game');if(current.id==='bibliotheek')SintScene.reading(q);
 $('counter').textContent='Opdracht '+(s.step+1)+' van 8';$('progress').replaceChildren();for(let i=0;i<8;i++){const p=document.createElement('span');p.className=i<s.step+(s.solved?1:0)?'done':'';$('progress').append(p);}$('progress').setAttribute('aria-label',(s.step+(s.solved?1:0))+' van 8 klaar');
 $('question').textContent=q.text;$('equation').textContent=q.equation||'';$('equation').hidden=!q.equation;
 $('passage-box').hidden=!q.passage;$('passage').textContent=(q.passage||'').replaceAll('\\n','\n');$('passage-title').textContent=q.passageTitle||'';$('passage-title').hidden=!q.passageTitle;
 $('visual').replaceChildren();$('visual').hidden=!q.shape||q.shapeDescription;
 if(q.shape&&!q.shapeDescription){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 180 100');svg.setAttribute('role','img');svg.setAttribute('aria-label','Een vorm om te herkennen');
  const type=q.shape==='cirkel'?'circle':q.shape==='driehoek'?'polygon':'rect',shape=document.createElementNS(svg.namespaceURI,type);
  const attrs=q.shape==='cirkel'?{cx:90,cy:50,r:40}:q.shape==='driehoek'?{points:'90,7 165,90 15,90'}:q.shape==='vierkant'?{x:50,y:10,width:80,height:80}:{x:20,y:20,width:140,height:60};
  for(const [k,v]of Object.entries({...attrs,fill:q.variant%2?'#d66b88':'#30a99f',stroke:'#a67836','stroke-width':3}))shape.setAttribute(k,v);
  svg.append(shape);$('visual').append(svg);
 }
 $('answers').replaceChildren();
 for(const option of q.options){const b=document.createElement('button');b.textContent=option;if(option.length>12)b.classList.add('long');if(s.solved){b.disabled=true;if(option===q.answer)b.classList.add('correct');}else if(s.wrong?.includes(option)){b.disabled=true;b.classList.add('retry');}b.onclick=()=>answer(option);$('answers').append(b);}
 $('hint').textContent=q.hint;if(q.mab)drawMabHint(q.mab);$('hint').hidden=!s.wrong?.length;$('hint-button').hidden=s.solved;$('next').hidden=!s.solved||busy;$('next').textContent=s.step===7?'Mijn kamerster ★':'Volgende →';
 $('feedback').textContent=s.solved?'Goed geholpen!':s.wrong?.length?'Nog niet. Kijk naar de tip en probeer opnieuw.':'';
 $('question').focus({preventScroll:true});
}
function drawMabHint({tens,units}){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 360 124');svg.setAttribute('class','mab');svg.setAttribute('role','img');svg.setAttribute('aria-label',tens+' tientalstaafjes en '+units+' losse eenheidsblokjes.');
 function part(tag,attrs,text){const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;svg.append(el);}
 part('text',{x:93,y:15,'text-anchor':'middle',fill:'#276f78','font-size':14,'font-weight':'bold'},'Tientallen');
 part('text',{x:279,y:15,'text-anchor':'middle',fill:'#a45132','font-size':14,'font-weight':'bold'},'Eenheden');
 for(let t=0;t<tens;t++)for(let u=0;u<10;u++)part('rect',{x:8+t*18,y:24+u*9,width:9,height:9,fill:'#69c8c1',stroke:'#276f78','stroke-width':.8});
 for(let u=0;u<units;u++)part('rect',{x:227+(u%5)*22,y:29+Math.floor(u/5)*22,width:9,height:9,fill:'#ffc76f',stroke:'#a45132','stroke-width':.8});
 if(!tens)part('text',{x:93,y:66,'text-anchor':'middle',fill:'#657d7e','font-size':13},'geen staafjes');
 if(!units)part('text',{x:279,y:66,'text-anchor':'middle',fill:'#9b715a','font-size':13},'geen losse blokjes');
 $('hint').append(svg);
}
function answer(value){
 const s=state();if(busy||s.solved)return;const q=s.round[s.step];
 if(value!==q.answer){s.wrong??=[];s.wrong.push(value);save();render();return;}
 s.solved=true;s.wrong=[];save();busy=true;const mine=++run;render();$('feedback').textContent='Goed! Kijk wat er in de kamer gebeurt.';tone();
 SintScene.celebrate(q.answer,()=>{if(mine!==run)return;busy=false;render();$('next').focus({preventScroll:true});},q);
}
function finish(){screen('finish');$('story-party').textContent='📖 Bekijk ons boek';$('poem-read').hidden=current.id!=='schrijfkamer';$('story-controls').hidden=current.id!=='bibliotheek';$('finish-title').textContent=current.win;$('all-stars').textContent=stars()===7?'Alle zeven kamersterren zijn van jou!':'Je hebt '+stars()+' van de 7 kamersterren.';SintScene.sync(8);$('finish-title').focus({preventScroll:true});}
$('next').onclick=()=>{const s=state();if(!s?.solved||busy)return;s.step++;s.solved=false;s.wrong=[];if(s.step===8)s.completed=true;save();fillHome();render();};
$('change').onclick=()=>{run++;busy=false;SintScene.sync(Math.min(8,state().step+(state().solved?1:0)));setup();};
$('start').onclick=start;$('resume').onclick=render;$('again').onclick=setup;
$('hint-button').onclick=()=>{$('hint').hidden=!$('hint').hidden;};
$('sound').onclick=()=>{muted=!muted;$('sound').textContent=muted?'♫ Uit':'♫ Aan';$('sound').setAttribute('aria-pressed',String(!muted));tone();};
function motion(){document.body.classList.toggle('no-motion',reduced);$('motion').textContent='Beweging: '+(reduced?'uit':'aan');$('motion').setAttribute('aria-pressed',String(reduced));SintScene.reduced(reduced);}
$('motion').onclick=()=>{reduced=!reduced;motion();try{localStorage.setItem('sint-motion',reduced?'off':'on');}catch{}};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('toast').textContent='Volledig scherm is hier niet beschikbaar. Op iPad kun je deze pagina aan het beginscherm toevoegen.';$('toast').hidden=false;setTimeout(()=>$('toast').hidden=true,5000);}};
$('read').onclick=()=>{if(!('speechSynthesis'in window)){ $('feedback').textContent='Voorlezen is in deze browser niet beschikbaar.';return;}speechSynthesis.cancel();const q=state().round[state().step],utter=new SpeechSynthesisUtterance((q.passage||'').replaceAll('\\n',' ')+'. '+q.text+' '+(q.equation||'').replace('×','maal').replace('−','min').replace(':','gedeeld door'));utter.lang='nl-BE';utter.rate=.85;speechSynthesis.speak(utter);};
$('story-party').onclick=()=>{const showing=SintScene.toggleParty();$('story-party').textContent=showing?'📖 Bekijk ons boek':'🎉 Terug naar het feest';};
$('story-prev').onclick=()=>{SintScene.turnStory(-1);$('story-party').textContent='🎉 Terug naar het feest';};$('story-next').onclick=()=>{SintScene.turnStory(1);$('story-party').textContent='🎉 Terug naar het feest';};$('story-read').onclick=()=>{if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const utter=new SpeechSynthesisUtterance(SintScene.story());utter.lang='nl-BE';utter.rate=.8;speechSynthesis.speak(utter);};
$('poem-read').onclick=()=>{if(!('speechSynthesis'in window)){ $('all-stars').textContent='Voorlezen is niet beschikbaar in deze browser.';return;}speechSynthesis.cancel();const utter=new SpeechSynthesisUtterance(SintScene.poem());utter.lang='nl-BE';utter.rate=.8;speechSynthesis.speak(utter);};
$('house').src=base+'huis-cartoon.png';$('house').onerror=()=>{$('home-progress').textContent='Het huis kon niet laden. De kamerknoppen werken wel.';};
window.addEventListener('pageshow',e=>{if(e.persisted)route();});window.addEventListener('hashchange',route);window.addEventListener('pagehide',()=>{save();SintScene.leave();});
motion();route();
})();

