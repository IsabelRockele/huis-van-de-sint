(function(){
'use strict';
const canvas=document.getElementById('scene'),ctx=canvas.getContext('2d'),status=document.getElementById('scene-status'),base=window.SINT_ASSET_BASE||'./assets-local/';
const images=new Map();let room=null,count=0,active=false,reduced=false,clock=0,last=0,elapsed=0,busy=false,callback=null,token=0,awardValue='',question={},history=[],storyPage=0,partyView=true;
function asset(name){if(name==='bakpiet-spelatlas.png')name='bakpiet-spelatlas-v2.png';if(!images.has(name)){const im=new Image();im.src=base+name;im.onerror=()=>{document.getElementById('asset-error').hidden=false;};images.set(name,im);}return images.get(name);}
function drawImage(im,...args){if(im.complete&&im.naturalWidth)ctx.drawImage(im,...args);}
function finish(){busy=false;history[count]=question;count=Math.min(8,count+1);status.textContent=count===8?'Acht opdrachten klaar. Wat heb jij goed geholpen!':'Goed geholpen! Kies de volgende opdracht.';const cb=callback;callback=null;if(cb)cb();}
function cancel(){token++;busy=false;callback=null;elapsed=0;}
window.SintScene={
 enter(next,n,questions=[]){cancel();storyPage=0;partyView=true;room=next;if(next.id==='bibliotheek'){asset('bibliotheek-feest.png');asset('verhaalprenten-feest.png');}count=n;history=questions.slice(0,n);question=questions[n]||{};active=true;asset(next.image);asset(next.hero+'-spelatlas.png');if(next.id==='pakjes'){asset('pakjespiet-neerzetten.png');asset('pakjespiet-werkvolgorde.png');asset('pakjespiet-inpakstappen.png');}if(['pakjes','keuken','postkamer'].includes(next.id))asset('werktafel-en-zak.png');if(next.id==='keuken')asset('bakpiet-tafelwerk.png');if(next.id==='magazijn')asset('magazijnpiet-hendelbeweging.png');if(actions[next.id])asset(actions[next.id]);status.textContent=next.mission;document.getElementById('asset-error').hidden=true;},
 leave(){cancel();active=false;},
 reduced(v){reduced=v;if(v&&busy)finish();},
 celebrate(value,cb,q={}){if(busy)return;question=q;awardValue=String(value);callback=cb;elapsed=0;busy=true;status.textContent=room.id==='keuken'?'Eerst roert Bakpiet het deeg mooi glad.':'Wat goed! Kijk wat er in de kamer gebeurt…';if(reduced)finish();},
 sync(n){cancel();count=n;if(n===0)history=[];if(room)status.textContent=n===8?room.win:room.mission;},
 poem(){return bookLines.join("\n");},
 reading(q){if(room?.id==='bibliotheek')question=q;},
 story(){return storyLines.join("\n");},
 toggleParty(){partyView=!partyView;return partyView;},
 turnStory(delta){partyView=false;storyPage=(storyPage+delta+4)%4;},
 inspect(){return {room:room?.id,count,busy,active};}
};
const actions={keuken:'bakpiet-tafelwerk.png',pakjes:'pakjespiet-inpakstappen.png',schrijfkamer:'schrijfpiet-spelatlas.png',bibliotheek:'leespiet-spelatlas.png'};
const duration=()=>({keuken:count===7?12:3.2,pakjes:count===7?6.5:2.4,schrijfkamer:5.5,magazijn:6.8,postkamer:4.5,bibliotheek:count===7?9:3.5,atelier:count===7?5:3}[room?.id]||2.8);
const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
function round(x,y,w,h,r,fill,stroke){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
function star(x,y,r,colour='#ffdb67'){ctx.save();ctx.translate(x,y);ctx.fillStyle=colour;ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.43:r;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.restore();}
function gift(x,y,s=1,label=''){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.shadowColor='#71432d44';ctx.shadowBlur=8;ctx.shadowOffsetY=5;const g=ctx.createLinearGradient(-35,-55,35,0);g.addColorStop(0,'#ff9879');g.addColorStop(1,'#dc4968');round(-36,-54,72,54,8,g,'#bd4059');round(-40,-61,80,15,6,'#ffad90');ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.fillStyle='#ffdc6b';ctx.fillRect(-5,-61,10,61);ctx.strokeStyle='#ffdc6b';ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(-11,-67,14,8,-.5,0,Math.PI*2);ctx.ellipse(11,-67,14,8,.5,0,Math.PI*2);ctx.stroke();if(label){round(-22,-43,44,29,6,'#fff7de');ctx.fillStyle='#774c3a';ctx.font='bold 21px Trebuchet MS';ctx.textAlign='center';ctx.fillText(label,0,-21);}ctx.restore();}
function envelope(x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);round(-42,-28,84,56,7,'#fff3d6','#c69455');ctx.strokeStyle='#d8b178';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-40,-25);ctx.lineTo(0,7);ctx.lineTo(40,-25);ctx.stroke();star(0,8,9,'#dd5974');ctx.restore();}
function book(x,y,s=1,index=0){ctx.save();ctx.translate(x,y);ctx.scale(s,s);round(-26,-40,52,75,6,['#28a8a0','#e4647c','#ecaf38','#9676c1'][index%4],'#bc863d');ctx.fillStyle='#ffe9ba';ctx.fillRect(-19,-32,4,58);star(5,-5,13);ctx.restore();}
function cookie(x,y,r=12,baked=1){const g=ctx.createRadialGradient(x-3,y-4,1,x,y,r);g.addColorStop(0,baked?'#f2c17b':'#ffe4ac');g.addColorStop(1,baked?'#995129':'#d0aa70');ctx.fillStyle=g;ctx.strokeStyle='#a76939';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,r,r*.8,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#955b30';ctx.beginPath();ctx.arc(x-3,y-2,1.4,0,7);ctx.arc(x+4,y+2,1.4,0,7);ctx.fill();}
function tray(x,y,s=1,baked=false,amount=8){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const g=ctx.createLinearGradient(0,-20,0,22);g.addColorStop(0,'#dce4e5');g.addColorStop(1,'#8b999f');round(-75,-24,150,48,8,g,'#f8f5dc');for(let i=0;i<amount;i++)cookie(-49+(i%4)*33,-9+Math.floor(i/4)*18,10,baked);ctx.restore();}
function atlas(frame,x,y,h=400,alpha=1){const im=asset(room.hero+'-spelatlas.png');if(!im.complete||!im.naturalWidth)return;ctx.save();ctx.globalAlpha=alpha;const cols=room.id==='magazijn'?2:4,sw=im.naturalWidth/cols,sh=im.naturalHeight/2;if(cols===2)frame=Math.max(0,frame-4);ctx.drawImage(im,(frame%cols)*sw,Math.floor(frame/cols)*sh,sw,sh,x,y,h,h);ctx.restore();}
function work(frame,x=240,y=175,h=400){
 const im=asset(actions[room.id]||'schrijfpiet-schrijven.png');if(!im.complete||!im.naturalWidth){atlas(4,x,y,h);return;}
 const w=im.naturalWidth/2,hc=im.naturalHeight/2;
 ctx.drawImage(im,(frame%2)*w,Math.floor(frame/2)*hc,w,hc,x,y,h,h);
}
function sparkle(cx,cy,f){for(let i=0;i<12;i++){const a=i*Math.PI/6,r=25+f*90;ctx.globalAlpha=Math.max(0,1-f);star(cx+Math.cos(a)*r,cy+Math.sin(a)*r,8+3*Math.sin(i),'#ffdf6c');}ctx.globalAlpha=1;}
function collection(){
 if(room.id==='keuken'){
  drawImage(asset('bakmand.png'),777,438,300,157);
  for(let i=count*8-1;i>=0;i--){const row=Math.floor(i/8);cookie(826+(i%8)*(26-row*1.1)+row*3.85,502-row*11,16,true);}
  return;
 }
 if(room.id==='pakjes'){
  for(let i=0;i<count;i++)gift(420+i*90,555,1);
 }else if(room.id==='magazijn'){
  round(772,558,325,17,8,'#b97f3e','#edc785');for(let i=0;i<count;i++)gift(814+(i%4)*77,552-Math.floor(i/4)*77,.85,room.id==='magazijn'?String(i+1):'');
 }else if(room.id==='bibliotheek'){
  round(762,555,328,15,7,'#b97f3e','#edc785');for(let i=0;i<count;i++)book(785+i*40,518,.77,i);
 }else if(room.id==='postkamer'){
  for(let i=0;i<count;i++){envelope(810+(i%4)*77,510-Math.floor(i/4)*62,.77);star(810+(i%4)*77,510-Math.floor(i/4)*62,8);}
 }else if(room.id==='schrijfkamer'){
  writingBook();
 }else{
  for(let i=0;i<count;i++){const x=793+(i%4)*77,y=536-Math.floor(i/4)*70;round(x-30,y-48,60,48,8,['#31aaa1','#ed7a85','#eebc46','#a28bd2'][i%4],'#a87436');star(x,y-24,14);if(i<4){ctx.fillStyle='#835d40';ctx.beginPath();ctx.arc(x-18,y+3,9,0,7);ctx.arc(x+18,y+3,9,0,7);ctx.fill();}}
 }
}
// Use the one illustrated tray from the work atlas. Never cover it with a second tray.
function tableTray(){const im=asset('bakpiet-tafelwerk.png');if(!im.complete||!im.naturalWidth)return;const w=im.naturalWidth/4,h=im.naturalHeight/2;ctx.drawImage(im,w*.61,h*.61,w*.34,h*.12,424,419,136,48);}
function kitchenWorker(frame){
 // The last pose includes a painted cookie. Exclude that tray area and reuse
 // the empty tray from pose zero, so the exercise count is the sole cookie source.
 ctx.save();ctx.beginPath();ctx.rect(0,0,1200,675);ctx.rect(424,419,136,48);ctx.clip('evenodd');sheet('bakpiet-tafelwerk.png',frame,180,175);ctx.restore();tableTray();
}
function doughCookies(n,baked=false){for(let i=0;i<n;i++)cookie(456+(i%4)*23,438+Math.floor(i/4)*10,7,baked);}
function bakingTable(){prop(0,320,393,270,220);}
function kitchenScene(){
 const e=elapsed,finalBatch=busy&&count===7&&e>=3.2;
 bakingTable();
 if(!finalBatch){
 const frame=!busy?(count===8?3:0):e<.6?Math.floor(e*6)%4:e<1.1?4:e<1.8?5:e<2.5?6:7;
 if(count===8&&!busy){atlas(7,180,175);tableTray();}else kitchenWorker(frame);
 doughCookies(count+(busy&&e>=2.7?1:0),count===8);
 if(busy){status.textContent=e<.6?'Bakpiet roert het deeg op de tafel.':e<1.8?'Hij neemt een stukje deeg en rolt één bolletje.':'Eén koekje erbij op de bakplaat: '+(count+1)+' van 8.';}
 // The bowl and work stay on the table between exercises.
 }else{
 const t=e-3.2;
 // A small bowl remains on the workbench while the tray is away.
 ctx.fillStyle='#1b9d99';ctx.beginPath();ctx.ellipse(375,459,39,21,0,0,Math.PI);ctx.fill();ctx.fillStyle='#ffe2a1';ctx.beginPath();ctx.ellipse(375,459,39,9,0,0,7);ctx.fill();
 if(t<2){const f=ease(t/2),x=180+480*f,y=175-40*f;atlas(Math.floor(t*9)%4,x,y);for(let i=0;i<8;i++)cookie(x+218+(i%4)*24,y+228+Math.floor(i/4)*13,8,false);status.textContent='Acht koekjes! Nu gaat de volle plaat naar de oven.';}
 else if(t<2.7){const f=ease((t-2)/.7);atlas(6,660,135);tray(928+25*f,363-38*f,1-.15*f,false);status.textContent='Bakpiet schuift de volle bakplaat in de oven.';}
 else if(t<5){atlas(6,620,135);ctx.fillStyle='#ffb43835';ctx.fillRect(870,255,205,125);ctx.strokeStyle='#a19c8b';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(880,349);ctx.lineTo(1065,349);ctx.stroke();tray(953,325,.85,t>4);status.textContent='Alle acht koekjes bakken samen goudbruin.';}
 else if(t<5.7){const f=ease((t-5)/.7);atlas(6,620+40*f,135);tray(953-25*f,325+38*f,.85+.15*f,true);status.textContent='De koekjes zijn klaar. Bakpiet haalt de plaat eruit.';}
 else if(t<8.2){const f=ease((t-5.7)/2.5),x=660+(180-660)*f,y=135+40*f;atlas(Math.floor(t*9)%4,x,y);for(let i=0;i<8;i++)cookie(x+218+(i%4)*24,y+228+Math.floor(i/4)*13,8,true);status.textContent='De warme bakplaat komt terug op tafel om af te koelen.';}
 else{atlas(7,180,175);tableTray();doughCookies(8,true);sparkle(490,430,(t-8.2)/.6);}
 }
 round(362,581,180,34,12,'#fff4d1','#cca05f');label(Math.min(8,count+(busy&&e>=2.7?1:0))+' / 8 koekjes',452,605,165,20);
}

const bookLines=['Piet schrijft een brief aan Sinterklaas.','Zijn pen ruikt plots naar speculaas.','Een pepernoot rolt op het blad.','De Sint roept lachend: “Wat is dat?”','Piet niest: “Hatsjoe!” Zijn muts vliegt mee.','Ze ploft precies in Sints kop thee!','De Sint zegt: “Piet, wat een verhaal!”','“Een muts met thee? Dat smaakt speciaal!”'];
function writtenLine(q,i){return bookLines[i]||'';}
function writingBook(progress=0){
 ctx.save();ctx.shadowColor='#663b3544';ctx.shadowBlur=16;ctx.shadowOffsetY=9;
 round(660,354,480,245,18,'#c94d68','#a43d56');ctx.shadowBlur=0;ctx.shadowOffsetY=0;
 round(670,360,460,222,13,'#fff5d9','#e0b66b');
 ctx.strokeStyle='#d8b276';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(900,365);ctx.lineTo(900,578);ctx.stroke();
 ctx.font='bold 17px Trebuchet MS';ctx.textAlign='left';ctx.fillStyle='#9c6b43';ctx.fillText('Het boek van de Sint',696,388);
 for(let i=0;i<8;i++){
 const x=i<4?690:920,y=421+(i%4)*43;
 ctx.strokeStyle='#ead7ad';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y+8);ctx.lineTo(x+190,y+8);ctx.stroke();
 const f=i<count?1:i===count?progress:0;if(f<=0)continue;
 ctx.save();ctx.beginPath();ctx.rect(x-3,y-23,196*f,40);ctx.clip();ctx.fillStyle='#77513f';ctx.font='15px Trebuchet MS';const line=writtenLine(i===count?question:history[i],i);ctx.font=(line.length>25?11:15)+"px Trebuchet MS";ctx.fillText(line,x,y);ctx.restore();
 if(i<count){star(x+180,y-18,8,'#e2ab32');}
 }
 ctx.restore();
}
function writingScene(){
 if(count===8&&!busy){
 round(65,135,1070,450,25,'#b83f65','#f1c461');round(80,145,1040,425,20,'#fff7dc','#e3bc76');
 ctx.strokeStyle='#d6b074';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(600,150);ctx.lineTo(600,560);ctx.stroke();
 label('Een muts met thee',600,194,800,35,'#a33d60');
 for(let i=0;i<8;i++){const x=i<4?340:860,y=265+(i%4)*78;label(bookLines[i],x,y,460,25);}
 star(110,185,21);star(1090,185,21);return;
 }
 const e=elapsed;
 work(reduced?0:Math.floor((busy?e:clock)*5)%4,225,160,430);
 writingBook(busy?ease(e/2.7):0);
 if(!busy)return;
 const x=count<4?690:920,y=421+(count%4)*43;
 if(e<2.7){status.textContent='Piet schrijft: '+writtenLine(question,count);}
 else if(e<3.8){
 status.textContent='Een gouden stempel erbij. Deze regel is klaar!';
 const f=ease((e-2.7)/.55),lift=ease((e-3.35)/.45),sy=y-65+45*f-45*lift;
 round(x+165,sy-20,30,26,7,'#c74766','#92314a');round(x+156,sy+3,48,13,5,'#e2ad47','#98692d');
 if(e>3.15)star(x+180,y-18,9,'#e2ab32');
 }else{star(x+180,y-18,9,'#e2ab32');sparkle(x+180,y-18,(e-3.8)/1.7);status.textContent='Kijk, jouw hulp maakt het boek steeds voller!';}
}
function deliveryPose(frame,x,y=175,flip=false){
 const im=asset('pakjespiet-neerzetten.png');if(!im.complete||!im.naturalWidth)return;
 const w=im.naturalWidth/4,h=im.naturalHeight/2;
 ctx.save();if(flip){ctx.translate(x+400,y);ctx.scale(-1,1);}else ctx.translate(x,y);
 ctx.drawImage(im,(frame%4)*w,Math.floor(frame/4)*h,w,h,0,0,400,400);ctx.restore();
}
function sheet(name,frame,x,y,h=400,cols=4,rows=2){const im=asset(name);if(!im.complete||!im.naturalWidth)return;const w=im.naturalWidth/cols,hh=im.naturalHeight/rows;ctx.drawImage(im,(frame%cols)*w,Math.floor(frame/cols)*hh,w,hh,x,y,h,h);}
function prop(frame,x,y,w,h,front=false){const im=asset('werktafel-en-zak.png');if(!im.complete||!im.naturalWidth)return;const cw=im.naturalWidth/2,ch=im.naturalHeight/2;ctx.save();if(front){ctx.beginPath();ctx.rect(x,y+h*.33,w,h*.67);ctx.clip();}ctx.drawImage(im,(frame%2)*cw,Math.floor(frame/2)*ch,cw,ch,x,y,w,h);ctx.restore();}
function giftSack(filled=false,front=false){prop(1,865,340,310,270,front);if(front){round(968,531,104,35,13,'#fff1c6','#bf8c45');label(filled?'1 pakje':'nog leeg',1020,555,94,21);}}
function tableStage(frame){sheet('pakjespiet-inpakstappen.png',frame,250,175,400,3,2);}
function packingScene(){
 const e=elapsed,atTable=250,atSack=720,stage=busy?count+1:count,filled=count===8||(busy&&stage===8&&e>=3.6);
 prop(2,70,410,230,180);prop(0,435,385,285,250);giftSack(filled);
 if(!busy){
 if(count===0)atlas(4,40,175);
 else if(count===1)sheet('pakjespiet-werkvolgorde.png',1,40,175);
 else if(count===2)sheet('pakjespiet-werkvolgorde.png',1,atTable,175);
 else if(count<8)tableStage(({3:0,4:1,5:3,6:4,7:5})[count]);
 else{atlas(7,40,175);gift(1015,455,1.1);}
 }else if(stage===1){sheet('pakjespiet-werkvolgorde.png',e<1.3?4:1,40,175);status.textContent='Stap 1: Piet haalt één doos uit de voorraad.';}
 else if(stage===2){sheet('pakjespiet-werkvolgorde.png',Math.floor(e*9)%4,40+(atTable-40)*ease(e/2.4),175);status.textContent='Stap 2: hij brengt de doos naar de tafel.';}
 else if(stage===3){if(e<1.2)sheet('pakjespiet-werkvolgorde.png',5,atTable,175);else tableStage(0);status.textContent='Stap 3: de doos staat op de inpaktafel.';}
 else if(stage===4){tableStage(e<.8?0:1);status.textContent='Stap 4: het eerste stuk papier gaat om de doos.';}
 else if(stage===5){tableStage(e<1.2?2:3);status.textContent='Stap 5: de andere kant dichtvouwen en gladstrijken.';}
 else if(stage===6){tableStage(4);status.textContent='Stap 6: Piet doet het gouden lint om het pakje.';}
 else if(stage===7){tableStage(5);status.textContent='Stap 7: hij knoopt een mooie strik. Bijna klaar!';}
 else if(e<2.4){atlas(Math.floor(e*9)%4,atTable+(atSack-atTable)*ease(e/2.4),175);status.textContent='Stap 8: jouw afgewerkte pakje gaat naar de grote zak.';}
 else if(e<3.6){atlas(6,atSack,175);gift(1015,405+50*ease((e-2.4)/1.2),1.1);status.textContent='Piet stopt jullie pakje in de zak van de Sint.';}
 else if(e<6){deliveryPose(4+Math.floor(e*9)%4,atSack+(40-atSack)*ease((e-3.6)/2.4),175,true);gift(1015,455,1.1);status.textContent='Klaar! Acht oefeningen, één mooi ingepakt cadeau.';}
 else{atlas(7,40,175);gift(1015,455,1.1);sparkle(1015,380,(e-6)/.5);}
 prop(0,435,385,285,250,true);giftSack(filled,true);
 round(436,611,271,34,12,'#fff4d4','#ceaa68');label('Stap '+Math.min(8,stage)+' / 8',572,635,250,23);
}

// Each scene shows the actual solved answer and a distinct physical process.
function label(text,x,y,w=220,size=22,colour='#674238'){
 ctx.fillStyle=colour;ctx.textAlign='center';ctx.font='bold '+size+'px Trebuchet MS';
 const words=String(text||'').split(' ');let line='',row=0;
 for(const word of words){const next=line?line+' '+word:word;if(ctx.measureText(next).width>w&&line){ctx.fillText(line,x,y+row*size*1.2);row++;line=word;}else line=next;}
 ctx.fillText(line,x,y+row*size*1.2);
}
function gear(x,y,r,t){ctx.save();ctx.translate(x,y);ctx.rotate(t);ctx.strokeStyle='#e6b14a';ctx.lineWidth=8;for(let i=0;i<10;i++){ctx.rotate(Math.PI/5);ctx.beginPath();ctx.moveTo(r-5,0);ctx.lineTo(r+5,0);ctx.stroke();}ctx.fillStyle='#e6b14a';ctx.beginPath();ctx.arc(0,0,r-4,0,7);ctx.fill();ctx.fillStyle='#4e9b96';ctx.beginPath();ctx.arc(0,0,8,0,7);ctx.fill();ctx.restore();}
function crate(x,y,text,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);round(-49,-70,98,70,9,'#e6b16b','#a36b38');round(-43,-59,86,47,5,'#fff5d5');label(text,0,-29,80,String(text).length>9?12:25);ctx.restore();}
function warehouseScene(){
 const e=elapsed,n=busy?count+1:count;
 // Aligned poses keep the operator and lever together throughout the action.
 const operatorFrame=!busy||reduced?0:e<1.2?Math.min(4,Math.floor(e/1.2*5)):e<5.5?4:Math.min(7,5+Math.floor((e-5.5)/1.3*3));
 sheet('magazijnpiet-hendelbeweging.png',operatorFrame,35,185,360);
 round(390,420,390,145,22,'#208f8b','#f4c65a');round(420,392,320,50,16,'#71574e','#edbf72');
 for(let i=0;i<10;i++){const x=430+((i*31+(busy?e*80:0))%300);ctx.fillStyle='#e3b874';ctx.beginPath();ctx.arc(x,416,9,0,7);ctx.fill();}
 gear(445,502,27,busy?clock*2:0);gear(505,502,19,busy?-clock*3:0);
 round(570,462,180,75,10,'#fff4d2');label(busy?awardValue:'Sorteer mee!',660,490,165,19);
 // Storage slots retain the labels from the children's own completed questions.
 round(810,277,344,300,15,'#b6783d','#efc66c');
 for(let i=0;i<8;i++){const x=860+(i%4)*80,y=414+Math.floor(i/4)*132;round(x-38,y-90,76,94,5,'#ffe7b5');if(i<count)crate(x,y,history[i]?.answer||'✓',.67);}
 label(n+' / 8',1085,604,100,23);
 // The rail and grabber are permanent machine parts, even between exercises.
 round(610,232,570,28,9,'#176f74','#ffe2a0');
 round(620,237,550,7,3,'#69d4c5');
 const tx=860+(count%4)*80,ty=414+Math.floor(count/4)*132;
 let gx=690,gy=300;
 if(busy&&e>=3.4&&e<5.5){const f=ease((e-3.4)/2.1);gx=690+(tx-690)*f;gy=395+(ty-395)*f-Math.sin(Math.PI*f)*95-68;}
 else if(busy&&e>=5.5){const f=ease((e-5.5)/1.3);gx=tx+(690-tx)*f;gy=ty-68+(300-(ty-68))*f;}
 else if(busy&&e>=2){gy=300+27*ease((e-2)/1.4);}
 // Bold housing, telescopic arm and two visible jaws contrast with the scenery.
 round(gx-31,228,62,38,9,'#f3bd44','#704b30');
 round(gx-12,257,24,Math.max(18,gy-253),5,'#496d7d','#fff0b7');
 round(gx-7,260,5,Math.max(12,gy-260),2,'#accbd0');
 const gripping=busy&&e>=3.4&&e<5.5,spread=gripping?36:53;
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
 for(const side of [-1,1]){
  ctx.beginPath();ctx.moveTo(gx+side*26,gy+5);ctx.lineTo(gx+side*spread,gy+23);ctx.lineTo(gx+side*spread,gy+43);ctx.lineTo(gx+side*(spread-15),gy+43);
  ctx.strokeStyle='#674b36';ctx.lineWidth=17;ctx.stroke();ctx.strokeStyle='#f5bf43';ctx.lineWidth=11;ctx.stroke();
 }
 round(gx-44,gy-9,88,24,9,'#f5bf43','#674b36');
 ctx.fillStyle='#fff2be';ctx.beginPath();ctx.arc(gx,gy+3,9,0,7);ctx.fill();ctx.restore();

 if(!busy)return;
 if(e<2){crate(430+ease(e/2)*260,395,awardValue,.8);status.textContent='De band brengt jouw getaldoos naar de sorteermachine.';}
 else if(e<3.4){crate(690,395,awardValue,.8);ctx.fillStyle='#ffda5966';ctx.fillRect(643,300+Math.sin((e-2)*5)*15,94,7);status.textContent='De machine leest: '+awardValue+'. Dat klopt!';}
 else if(e<5.5){const f=ease((e-3.4)/2.1);crate(gx,gy+68,awardValue,.8-.13*f);status.textContent='De grijper zet de getaldoos in het rek.';}
 else{crate(tx,ty,awardValue,.67);status.textContent='De doos staat op haar plek. De grijper keert terug voor de volgende doos.';sparkle(tx,ty-40,(e-5.5)/1.3);}
}
function mailScene(){
 const e=elapsed;atlas(busy?(e<1.3?6:e<2.1?5:7):4,95,185,380);
 // Incoming sack stays at the left; read children's letters collect on ribbons.
 prop(1,30,420,185,190);label('VOOR SINT',122,574,155,17);
 round(650,245,505,330,20,'#fff0c8','#c59453');label('Gelezen kinderpost',905,278,460,27,'#a43b5c');
 for(let row=0;row<2;row++){ctx.strokeStyle='#d35b76';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(672,319+row*140);ctx.lineTo(1135,319+row*140);ctx.stroke();}
 for(let i=0;i<count;i++){const x=714+(i%4)*126,y=365+Math.floor(i/4)*140;envelope(x,y,1.15);label(history[i]?.sender||'Een kind',x,y+49,114,16);star(x,y-34,9,'#eab341');}
 if(!busy){label('Brieven van kinderen aan de Sint',405,596,490,22);return;}
 const from=question.sender||'Een kind',tx=714+(count%4)*126,ty=365+Math.floor(count/4)*140;
 if(e<.8){const f=ease(e/.8);envelope(150+300*f,480-80*f,1+f*.4);status.textContent='Een brief van '+from+' voor de Sint!';}
 else if(e<2){round(370,300,210,140,9,'#fff9e2','#c8a56d');label('Beste Sint,',475,332,190,20);label('Groetjes, '+from,475,414,190,19);ctx.strokeStyle='#c8ab78';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(390,354+i*14);ctx.lineTo(560,354+i*14);ctx.stroke();}status.textContent='Postpiet opent en leest wat '+from+' schrijft.';}
 else{const f=ease((e-2)/1.4);envelope(475+(tx-475)*f,385+(ty-385)*f,1.4-.25*f);status.textContent='Goed gelezen! De brief van '+from+' krijgt een plek bij de kinderpost.';if(e>3.4)sparkle(tx,ty,(e-3.4)/1.1);}
}
const storyLines=window.SintData.storyParts.map(part=>part.text);
function storyIllustration(i,x,y,s=1){
 const im=asset('verhaalprenten-feest.png'),size=155*s;
 if(!im.complete||!im.naturalWidth)return;
 const w=im.naturalWidth/4,h=im.naturalHeight/2;
 ctx.save();ctx.beginPath();ctx.roundRect(x-size/2,y-size/2,size,size,12);ctx.clip();
 ctx.drawImage(im,(i%4)*w,Math.floor(i/4)*h,w,h,x-size/2,y-size/2,size,size);ctx.restore();
}

function partyScene(reveal=1){
 ctx.save();ctx.globalAlpha=reveal;drawImage(asset('bibliotheek-feest.png'),0,0,1200,675);ctx.restore();
 if(reveal<1){status.textContent='Kom mee! Leespiet gaat naar het verrassingsfeest in de keuken.';return;}
 // Falling paper stays above the guests, leaving their faces unobscured.
 for(let i=0;i<35;i++){const t=reduced?.45:(clock*.22+i*.137)%1,x=(i*173)%1200,y=t*150;ctx.save();ctx.translate(x,y);ctx.rotate(i+t*4);ctx.fillStyle=['#f6ca52','#e85d87','#53c9be'][i%3];ctx.fillRect(-4,-3,8,6);ctx.restore();}
 status.textContent='Leespiet is op het feest! De Sint lacht om de berenmuts. Iedereen krijgt pepernoten.';
}
function libraryScene(){
 const e=elapsed;if((count===8&&!busy&&partyView)||(busy&&count===7&&e>=3)){partyScene(busy?ease((e-3)/2):1);return;}if(count===8&&!busy){round(55,120,1090,465,24,'#248d80','#e6b852');round(70,133,1060,437,20,'#fff7dc');ctx.strokeStyle='#d6b174';ctx.beginPath();ctx.moveTo(600,140);ctx.lineTo(600,560);ctx.stroke();label('Het verrassingsfeest — '+(storyPage+1)+' / 4',600,180,900,30);for(let j=0;j<2;j++){const i=storyPage*2+j,x=j?860:340;storyIllustration(i,x,330,1.7);label(storyLines[i],x,477,455,23);}return;}
 work(reduced?0:Math.floor(clock*3)%4,20,240,350);
 round(385,145,740,450,20,'#248d80','#e6b852');round(398,157,714,425,14,'#fff7dc');
 const page=Math.min(7,question.storyIndex??count);
 label('Het verrassingsfeest • '+(page+1)+' / 8',750,195,660,29);
 storyIllustration(page,750,389,2.3);
 for(let i=0;i<8;i++)round(510+i*62,610,48,12,5,i<count+(busy&&e>1?1:0)?'#eab743':'#e4d4b1');
 if(busy){status.textContent='Goed gelezen! Bladzijde '+(page+1)+' komt in jullie boek.';sparkle(750,389,Math.min(1,e/3.5));}
 else status.textContent='Bekijk de prent en lees stukje '+(page+1)+'. De vraag gaat over dit stukje.';

}
function shapePiece(kind,x,y,s=1,colour='#f1ba43'){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=colour;ctx.strokeStyle='#a4713d';ctx.lineWidth=3;ctx.beginPath();if(kind==='cirkel')ctx.arc(0,0,27,0,7);else if(kind==='driehoek'){ctx.moveTo(0,-29);ctx.lineTo(32,27);ctx.lineTo(-32,27);ctx.closePath();}else ctx.rect(kind==='rechthoek'?-39:-27,-27,kind==='rechthoek'?78:54,54);ctx.fill();ctx.stroke();ctx.restore();
}
function wagon(x,y,index,q,scale=1){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);round(-43,-35,86,42,8,['#39b5aa','#eb7e8d','#f0be4e','#a992d5'][index%4],'#a07142');for(const dx of [-27,27]){ctx.fillStyle='#614f47';ctx.beginPath();ctx.arc(dx,12,13,0,7);ctx.fill();ctx.fillStyle='#efca7f';ctx.beginPath();ctx.arc(dx,12,5,0,7);ctx.fill();}if(q?.shape)shapePiece(q.shape,0,-15,.55);else label((q?.equation||q?.answer||'★').replace('…',q?.answer||''),0,-8,75,15);ctx.restore();}
function trainPart(index,x,y){
 ctx.save();ctx.translate(x,y);
 const enamel=(a,b)=>{const g=ctx.createLinearGradient(0,-110,0,30);g.addColorStop(0,a);g.addColorStop(.5,b);g.addColorStop(1,a);return g;};
 if(index===0)round(-125,0,250,30,10,'#dfae61','#9b6a36');
 else if(index===1||index===2){const xx=index===1?-83:83;ctx.fillStyle='#565069';ctx.beginPath();ctx.arc(xx,37,32,0,7);ctx.fill();ctx.fillStyle='#efc75f';ctx.beginPath();ctx.arc(xx,37,19,0,7);ctx.fill();}
 else if(index===3){round(-110,-100,83,100,8,enamel('#69e2d1','#168e89'),'#997341');round(-96,-83,50,44,5,'#fff3bd');}
 else if(index===4)round(-123,-120,111,22,9,enamel('#ffb9bc','#bb3058'),'#a3455a');
 else if(index===5)round(-24,-64,134,64,22,enamel('#ffadad','#d73562'),'#a5465b');
 else if(index===6){round(48,-108,30,49,6,'#efbc46','#a57a3d');round(39,-115,48,14,5,'#ca8b36');}
 else{ctx.fillStyle='#ffe7a1';ctx.beginPath();ctx.arc(113,-30,15,0,7);ctx.fill();star(38,-29,17);}
 ctx.restore();
}
function atelierScene(){
 const e=elapsed,n=Math.min(8,count+(busy&&e>1.8?1:0)),done=count===8||(busy&&count===7&&e>2);
 // Quiet ivory display behind the toy makes every construction step readable.
 round(420,145,730,439,28,'#fff3d7','#d6a24c');
 label('De trein die jij bouwt',785,191,630,30);
 atlas(busy?(e<1.8?6:5):count===8?7:4,45,180,420);
 round(405,535,755,65,15,'#237f7b','#d4a94e');round(390,526,785,18,9,'#e6bd77','#a77a42');
 for(let i=0;i<19;i++)round(438+i*37,516,22,12,3,'#a7794f');
 round(430,512,705,5,2,'#667584');
 const drive=busy&&count===7&&e>2?ease((e-2)/3):count===8?1:0;
 const x=775+75*drive,y=405;
 ctx.save();ctx.translate(x,y);ctx.scale(1.65,1.65);
 ctx.shadowColor='#6d482c40';ctx.shadowBlur=9;ctx.shadowOffsetY=5;
 for(let i=0;i<count;i++)trainPart(i,0,0);
 if(busy&&e<1.8){const f=ease(e/1.8);trainPart(count,-25*(1-f),-65*(1-f));}else if(busy)trainPart(count,0,0);
 ctx.restore();
 if(done){for(let i=0;i<4;i++){const t=reduced?.5:(clock*.4+i*.27)%1;ctx.globalAlpha=(1-t)*.55;ctx.fillStyle='#c8cbd1';ctx.beginPath();ctx.arc(x+104+t*32,y-200-t*65,8+t*16,0,7);ctx.fill();}ctx.globalAlpha=1;}
 label('Onze speelgoedtrein • '+n+' / 8',785,576,650,26,'#fff5d2');
 const parts=['de houten basis','het eerste wiel','het tweede wiel','de stuurcabine','het dak','de ketel','de schoorsteen','de koplamp'];if(busy)status.textContent=done?'Toet toet! Je trein rijdt over zijn eigen spoor!':'Piet monteert '+parts[count]+'.';
}

function rewardScene(){
 atlas(busy&&elapsed>1.5?7:4,240,175,400);collection();if(!busy)return;
 const f=ease(elapsed/1.8),x=565+(930-565)*f,y=400+(485-400)*f-Math.sin(Math.PI*f)*100;
 if(room.id==='magazijn'){gift(x,y,.95,awardValue.length<4?awardValue:String(count+1));status.textContent='Goed gesorteerd! De getaldoos krijgt zijn plek.';}
 if(room.id==='postkamer'){const fly=ease(elapsed/1.5);envelope(540+500*fly,410-100*fly,1-.65*fly);status.textContent='De brief glijdt in de brievenbus. Post bezorgd!';}
 if(room.id==='bibliotheek'){book(x,y,1, count);status.textContent='Een nieuw boek op de plank en een leesster voor jou!';}
 if(room.id==='atelier'){gift(x,y,.8);ctx.save();ctx.translate(930,485);ctx.rotate(elapsed*4);star(0,0,24);ctx.restore();status.textContent='Een nieuw speelgoedstuk is klaar. Het treintje groeit!';}
 if(elapsed>1.6)sparkle(930,480,(elapsed-1.6)/1.2);
}
function draw(){
 ctx.clearRect(0,0,1200,675);if(!room)return;drawImage(asset(room.image),0,0,1200,675);
 if(room.id==='keuken')kitchenScene();else if(room.id==='pakjes')packingScene();else if(room.id==='schrijfkamer')writingScene();else if(room.id==='magazijn')warehouseScene();else if(room.id==='postkamer')mailScene();else if(room.id==='bibliotheek')libraryScene();else if(room.id==='atelier')atelierScene();else rewardScene();
}
function tick(stamp){requestAnimationFrame(tick);const dt=Math.min(.05,(stamp-last)/1000||0);last=stamp;if(!active||document.hidden)return;if(!reduced)clock+=dt;if(busy){elapsed+=dt;if(elapsed>=duration())finish();}draw();}
requestAnimationFrame(tick);
})();



