(function(root){
'use strict';
const rooms=[
{id:'pakjes',name:'De pakjeskamer',short:'Pakjes',skill:'Tafels van 2 en 10',image:'pakjeskamer-cartoon.png',hero:'cadeautjespiet',reward:'pakjes',modes:[['mix','Alles door elkaar'],['maal2','Maaltafel van 2'],['deel2','Deeltafel van 2'],['maal10','Maaltafel van 10'],['deel10','Deeltafel van 10']],mission:'Maak samen één cadeau klaar: elke juiste oefening helpt bij de volgende stap.',win:'Jouw cadeau zit in de zak van de Sint!',x:5,y:19,w:30,h:19},
{id:'keuken',name:'De pepernotenkeuken',short:'Keuken',skill:'Optellen en aftrekken tot 100',image:'pepernotenkeuken-cartoon.png',hero:'bakpiet',reward:'pepernoten',modes:[['mix','Optellen en aftrekken'],['plus','Optellen zonder brug'],['min','Aftrekken zonder brug']],mission:'Maak bij elke juiste som één koekje. Na acht sommen gaan ze samen de oven in.',win:'Jouw acht pepernoten zijn gebakken!',x:36,y:19,w:29,h:19},
{id:'magazijn',name:'Het getallenmagazijn',short:'Getallen',skill:'Getalinzicht tot 100',image:'magazijn-cartoon.png',hero:'magazijnpiet',reward:'getaldozen',modes:[['mix','Alle getalopdrachten'],['splits','Tientallen en eenheden ↔ getal'],['voor','Het getal net vóór'],['na','Het getal net na'],['volgorde','Volgorde en vergelijken'],['even','Even en oneven tot 20']],mission:'Zet de getaldozen op de juiste plek.',win:'Alle getaldozen staan op hun plek!',x:66,y:19,w:29,h:19},
{id:'schrijfkamer',name:'De schrijfkamer',short:'Taal',skill:'Zinnen, leestekens en lidwoorden',image:'schrijfkamer-cartoon.png',hero:'schrijfpiet',reward:'gouden regels',modes:[['mix','Alle taalopdrachten'],['leestekens','Leestekens'],['lidwoorden','Lidwoorden'],['zinnen','Mededelende zinnen'],['vraagwoorden','Wie, wat, waar en hoe']],mission:'Schrijf samen een grappig versje: één nieuwe regel per juiste oefening.',win:'Jouw grappige Sintversje is klaar!',x:5,y:40,w:30,h:23},
{id:'postkamer',name:'De postkamer',short:'Post',skill:'Brieven lezen en beantwoorden',image:'postkamer-cartoon.png',hero:'postpiet',reward:'brieven',modes:[['mix','Alle briefvragen door elkaar'],['zender','Wie schrijft de brief?'],['ontvanger','Voor wie is de brief?'],['begrijpen','Wat vertelt de brief?'],['antwoord','Een passend antwoord'],['volgorde','Post openen en lezen']],mission:'Help Postpiet de brieven van de kinderen aan de Sint te lezen.',win:'Acht kinderbrieven gelezen!',x:65,y:40,w:30,h:23},
{id:'bibliotheek',name:'De bibliotheek',short:'Lezen',skill:'Begrijpend lezen',image:'bibliotheek-cartoon.png',hero:'leespiet',reward:'boeken',modes:[['mix','Het verrassingsfeest']],mission:'Lees Het verrassingsfeest: bekijk de prent en beantwoord één vraag bij elk stukje.',win:'Jouw prentenverhaal is compleet!',x:5,y:66,w:31,h:24},
{id:'atelier',name:'Het speelgoedatelier',short:'Atelier',skill:'Meetkunde of spelling',image:'atelier-cartoon.png',hero:'speelgoedpiet',reward:'speelgoedstukken',modes:[['vormen','Bouwen met meetkunde'],['spelling','Bouwen met spelling: alle woordvragen'],['klanken','Spelling: aai, ooi, oei, eeuw, ieuw'],['medeklinkers','Spelling: twee en drie medeklinkers']],mission:'Bouw samen één speelgoedtrein: na elke oefening komt er een onderdeel bij.',win:'Jullie speelgoedtrein is af!',x:64,y:66,w:31,h:24}
];
const rnd=n=>Math.floor(Math.random()*n),pick=a=>a[rnd(a.length)],shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
function q(text,answer,wrong,hint,extra={}){answer=String(answer);return {text,answer,options:shuffle([...new Set([answer,...wrong.map(String)])]).slice(0,4),hint,...extra};}
function numeric(text,n,hint,extra={}){const wrong=shuffle([n-10,n+10,n-1,n+1,n+2,n-2,n+20,n-20].filter(x=>x>=0&&x<=100&&x!==n)).slice(0,3);return q(text,n,wrong,hint,extra);}
function pakjes(mode){
 const table=mode.includes('10')?10:mode.includes('2')?2:pick([2,10]),factor=1+rnd(10),divide=mode.startsWith('deel')||mode==='mix'&&rnd(2)===0;
 return divide?numeric('Verdeel '+table*factor+' pakjes eerlijk over '+table+' zakken. Hoeveel gaan er in elke zak?',factor,'Gebruik de maaltafel: '+table+' × ? = '+table*factor+'.',{equation:table*factor+' : '+table+' = ?',a:table*factor,b:table,op:':'}):
 numeric('Er zijn '+factor+' zakken. In elke zak gaan '+table+' pakjes. Hoeveel pakjes zijn dat samen?',factor*table,'Tel gelijke groepjes op: '+factor+' × '+table+' = '+Array(factor).fill(table).join(' + ')+'.',{equation:factor+' × '+table+' = ?',a:factor,b:table,op:'×'});
}
function keuken(mode){
 const op=mode==='plus'?'+':mode==='min'?'−':pick(['+','−']);let a,b;
 do{a=10+rnd(91);b=1+rnd(89);}while(op==='+'?(a+b>100||a%10+b%10>=10):(b>a||a%10<b%10));
 const n=op==='+'?a+b:a-b,tens=Math.floor(b/10)*10,units=b%10,inter=op==='+'?a+tens:a-tens;
 const hint=tens&&units?'Reken eerst '+a+' '+op+' '+tens+' = '+inter+'. Daarna '+inter+' '+op+' '+units+' = ?':tens?'Denk aan de tientallen. De eenheden blijven gelijk.':'Reken met de eenheden. Je hoeft niet over een tiental.';
 return numeric(op==='+'?'Piet heeft '+a+' pepernoten en bakt er '+b+' bij. Hoeveel zijn er nu?':'Piet heeft '+a+' pepernoten en geeft er '+b+' weg. Hoeveel blijven er over?',n,hint,{equation:a+' '+op+' '+b+' = ?',a,b,op});
}
function magazijn(mode){
 const type=mode==='mix'?pick(['splits','volgorde','even']):mode;
 if(type==='even'){const n=rnd(21);return q('Is '+n+' even of oneven?',n%2?'oneven':'even',[n%2?'even':'oneven'],'Een even getal kun je in twee gelijke groepjes verdelen. Kijk naar het laatste cijfer.',{equation:String(n),mathKind:'parity'});}
 if(['splits','decompose','compose_te','compose_et'].includes(type)){
 const n=rnd(101),t=Math.floor(n/10),e=n%10,kind=type==='splits'?pick(['decompose','compose_te','compose_et']):type;
 const hint='Een staafje is 1 tiental: 10 blokjes. Een los blokje is 1 eenheid. Tel de tientallen en daarna de losse blokjes.';
 const extra={mab:{tens:t,units:e},mathKind:kind};
 if(kind==='decompose')return q('Hoeveel tientallen en eenheden heeft '+n+'?',t+' T en '+e+' E',[(t===0?2:t-1)+' T en '+e+' E',t+' T en '+((e+1)%10)+' E',(t+1)+' T en '+e+' E'],hint,{...extra,equation:String(n)});
 const parts=kind==='compose_et'?e+' E en '+t+' T':t+' T en '+e+' E';
 return numeric('Welk getal is '+parts+'?',n,hint,{...extra,equation:parts});
 }
 const task=type==='voor'||type==='before'?0:type==='na'||type==='after'?1:type==='compare'?2:rnd(3);
 if(task===0){const n=1+rnd(100);return numeric('Welk getal komt net vóór '+n+'?',n-1,'Tel één stap terug.',{equation:'? → '+n,mathKind:'before',number:n});}
 if(task===1){const n=rnd(100);return numeric('Welk getal komt net na '+n+'?',n+1,'Tel één stap verder.',{equation:n+' → ?',mathKind:'after',number:n});}
 const n=1+rnd(99),choices=shuffle([n,Math.max(0,n-9),Math.min(100,n+1),Math.min(100,n+10)]),highest=rnd(2)===0;
 return q('Welk getal is het '+(highest?'grootst':'kleinst')+'?',highest?Math.max(...choices):Math.min(...choices),choices.filter(x=>x!==(highest?Math.max(...choices):Math.min(...choices))),'Vergelijk eerst de tientallen. Zijn die gelijk? Kijk dan naar de eenheden.',{mathKind:'compare'});
}
const punctuation=[
['Waar ligt mijn muts','?','Dit is een vraag.'],['De Sint leest een brief','.','Deze zin vertelt iets.'],['Hoe heet jouw paard','?','De schrijver wil iets weten.'],['Piet bakt koekjes','.','Deze zin vertelt wat Piet doet.'],['Hoera, de Sint is er','!','Dit is een vrolijke uitroep.'],['Wie heeft de sleutel','?','Deze zin stelt een vraag.'],['De pakjes staan klaar','.','Dit is een mededeling.'],['Pas op','!','Iemand roept een waarschuwing.']
];
const nouns=[['huis','het'],['pakje','het'],['boek','het'],['paard','het'],['kind','het'],['raam','het'],['brief','de'],['muts','de'],['zak','de'],['keuken','de'],['tafel','de'],['deur','de']];
const statements=['Piet draagt een pakje.','De Sint leest zijn boek.','Het paard staat in de stal.','De brief ligt op tafel.','De keuken ruikt lekker.','De kinderen zingen een lied.','De muts is rood.','Er liggen drie boeken op de plank.'];
const questions=[
['… bakt de pepernoten?','wie','Bakpiet bakt de pepernoten.','Je vraagt naar een persoon.'],
['… zit er in de zak?','wat','Er zit speelgoed in de zak.','Je vraagt naar een ding.'],
['… staat het paard?','waar','Het paard staat in de stal.','Je vraagt naar een plaats.'],
['… komt Piet boven?','hoe','Piet klimt met een ladder naar boven.','Je vraagt op welke manier iets gebeurt.'],
['… schrijft deze brief?','wie','Lina schrijft deze brief.','Je vraagt naar een persoon.'],
['… ligt het boek?','waar','Het boek ligt op het bureau.','Je vraagt naar een plaats.'],
['… maakt Piet de strik vast?','hoe','Piet knoopt het lint vast.','Je vraagt op welke manier.'],
['… krijgt Noor?','wat','Noor krijgt een bal.','Je vraagt naar een ding.']
];
function schrijfkamer(mode){
 const type=mode==='mix'?pick(['leestekens','lidwoorden','zinnen','vraagwoorden']):mode;
 if(type==='leestekens'){const [line,a,h]=pick(punctuation);return q('Welk leesteken hoort op het einde?',a,['.','?','!'].filter(v=>v!==a),h,{passage:line+' …'});}
 if(type==='lidwoorden'){const [word,a]=pick(nouns);return q('Kies het juiste bepaalde lidwoord bij dit woord.',a,[a==='de'?'het':'de'],'Spreek het woord zacht uit met de en daarna met het.',{equation:'… '+word});}
 if(type==='zinnen'){const a=pick(statements);return q('Welke zin is een mededelende zin?',a,['Waar is de Sint?','Leg de brief op tafel!','Wie heeft mijn muts?'],'Een mededelende zin vertelt iets. Hij stelt geen vraag en geeft geen opdracht.');}
 const [line,a,response,hint]=pick(questions);return q('Welk vraagwoord past bij het antwoord?',a,['wie','wat','waar','hoe'].filter(v=>v!==a),hint,{passage:line+'\nAntwoord: '+response});
}
const letters=[
['Noor','de Sint','Ik lees graag over dieren. Mag ik een dierenboek krijgen?','Wat wil Noor graag krijgen?','een dierenboek',['een bal','een muts','een fiets'],'Waarom schrijft Noor?','Ze vraagt om een cadeau.',['Ze zoekt haar muts.','Ze nodigt Piet uit.','Ze vertelt over regen.'],'Ik zoek een mooi dierenboek voor jou.'],
['Sam','de Sint','Ik heb een wortel voor je paard. Die ligt in mijn schoen bij de deur.','Waar ligt de wortel?','in de schoen',['op de tafel','in de tuin','in de keuken'],'Voor wie is de wortel?','voor het paard',['voor Bakpiet','voor Sam','voor Postpiet'],'Dank je! Mijn paard lust graag wortels.'],
['Mila','de Sint','Ik heb een tekening van jou gemaakt. Je draagt een rode mijter met een S. Ik stuur de tekening mee.','Wat stuurt Mila mee?','een tekening',['een muts','een koekje','een boek'],'Welke letter staat op de mijter?','S',['P','M','N'],'Wat een mooie tekening van mij! Dank je.'],
['Sem','de Sint','De pepernoten van Bakpiet zijn lekker. Wil je hem vragen hoe hij ze maakt? Ik wil ze met papa bakken.','Met wie wil Sem bakken?','met papa',['met oma','met Noor','met zijn juf'],'Wat wil Sem leren?','Hoe je pepernoten maakt.',['Hoe je een fiets herstelt.','Hoe je een muts breit.','Hoe je een boek leest.'],'Ik vraag Bakpiet om zijn recept voor jou.'],
['Lina','de Sint','Mijn rode muts is weg. Heb je die gezien? Ik droeg ze toen ik bij jou op bezoek was.','Welke kleur heeft de muts?','rood',['blauw','groen','geel'],'Waarom schrijft Lina?','Ze zoekt haar muts.',['Ze wil een bal.','Ze bedankt Bakpiet.','Ze geeft een feest.'],'Ik zal kijken of jouw rode muts hier ligt.'],
['Finn','de Sint','Dank je voor mijn speelgoedtrein! Ik bouw een spoor onder de tafel. Mijn zus speelt mee.','Waar bouwt Finn het spoor?','onder de tafel',['in de boom','op het dak','in de oven'],'Waarom schrijft Finn?','Hij wil de Sint bedanken.',['Hij zoekt een muts.','Hij vraagt een recept.','Hij vertelt over regen.'],'Veel plezier met de trein, samen met je zus!'],
['Aya','de Sint','Ik ben zaterdag jarig. Wil je dan naar mijn feestje komen? We eten appelcake.','Wanneer is Aya jarig?','zaterdag',['maandag','woensdag','vrijdag'],'Wat eten ze op het feestje?','appelcake',['soep','peperkoek','pannenkoeken'],'Proficiat met je verjaardag, Aya!'],
['Tuur','de Sint','Het regent hard bij ons. Ik heb een handdoek bij de deur gelegd. Dan kan Piet zijn natte muts drogen.','Wat ligt bij de deur?','een handdoek',['een boek','een bal','een wortel'],'Waarom legt Tuur een handdoek klaar?','Om Piets muts te drogen.',['Om de trein te maken.','Om een brief te schrijven.','Om koekjes te bakken.'],'Wat lief dat je een handdoek voor Piet klaarlegt!']
];
const mailOrder=[
['De brief zit nog in een dichte envelop. Wat doet Postpiet eerst?','De envelop voorzichtig openen.',['De brief weggooien.','De lege envelop voorlezen.','De naam uitgommen.']],
['Postpiet heeft de brief uit de envelop gehaald. Wat doet hij nu?','De brief lezen.',['De brief bakken.','De brief dichtplakken.','De postzegel tekenen.']],
['Waar kijkt Postpiet om te zien wie de brief schreef?','Naar de naam onderaan.',['Naar de kleur van de tafel.','Naar de muts van de Sint.','Naar de achterkant van de stoel.']],
['Postpiet leest een moeilijk stukje. Wat helpt?','Het stukje nog eens rustig lezen.',['Meteen iets gokken.','De brief verstoppen.','De naam wissen.']],
['Wat doet Postpiet vóór hij een antwoord kiest?','Lezen wat het kind vraagt.',['Een willekeurig cadeau pakken.','De brief dichtplakken.','Alle letters tellen.']],
['De brief is gelezen. Waar hoort hij nu?','Bij de gelezen kinderpost.',['Bij de ongeopende post.','In de oven.','Tussen het vuile papier.']],
['De Sint wil weten wat het kind wenst. Wat vertelt Postpiet?','Wat er in de brief staat.',['Wat hij zelf zou willen.','Wat de buurman eet.','Hoe zwaar de tafel is.']],
['Postpiet wil de brief nog eens terugvinden. Wat helpt?','De naam van het kind bij de brief bewaren.',['De naam uitgommen.','Alle brieven door elkaar gooien.','De brief onder de mat leggen.']]
];
function postkamer(mode){
 const type=mode==='mix'?pick(['zender','ontvanger','begrijpen','antwoord','volgorde']):mode;
 if(type==='volgorde'){const [text,a,wrong]=pick(mailOrder),[from,to,message]=pick(letters);return q(text,a,wrong,'Denk aan wat Postpiet doet: openen, lezen, begrijpen en bij de gelezen post leggen.',{mailType:type,sender:from,recipient:to,passage:'Beste Sint,\n\n'+message+'\n\nGroetjes,\n'+from});}
 const l=pick(letters),[from,to,message]=l,extra={mailType:type,sender:from,recipient:to,passage:'Beste '+(to==='de Sint'?'Sint':to)+',\n\n'+message+'\n\nGroetjes,\n'+from};
 if(type==='antwoord'){const a=l[9],wrong=shuffle(letters.filter(x=>x!==l).map(x=>x[9])).slice(0,3);return q('Welk antwoord past het best bij deze brief?',a,wrong,'Lees wat de schrijver vraagt of vertelt. Kies een antwoord dat daarop reageert.',extra);}
 if(type==='begrijpen'){const offset=pick([3,6]);return q(l[offset],l[offset+1],l[offset+2],'Zoek het antwoord in het briefje. Lees zo nodig nog een keer.',extra);}
 const sender=type==='zender',answer=sender?from:to;
 return q(sender?'Wie is de zender van dit briefje?':'Wie is de ontvanger van dit briefje?',answer,shuffle([...new Set([sender?to:from,'Lina','de Sint','Postpiet','Noor'])].filter(x=>x!==answer)).slice(0,3),sender?'De zender schrijft de brief. Kijk wie onderaan zijn naam zet.':'De ontvanger krijgt de brief. Kijk naar de naam bovenaan.',extra);
}
const stories=[
{title:'De verdwenen muts',text:'Piet zoekt zijn paarse muts. Hij kijkt onder de tafel, maar daar ligt alleen een lint. Dan ziet hij de muts op de stoel. Het paard heeft er een wortel naast gelegd.',qs:[['Welke kleur heeft de muts?','paars',['rood','groen','blauw'],'Lees de eerste zin.'],['Waar vindt Piet zijn muts?','op de stoel',['onder de tafel','in de oven','in de zak'],'Kijk waar Piet de muts uiteindelijk ziet.'],['Wat ligt onder de tafel?','een lint',['een muts','een wortel','een boek'],'Lees wat Piet bij zijn eerste zoekplek vindt.'],['Wat ligt naast de muts?','een wortel',['een brief','een bal','een bel'],'Lees de laatste zin.']]},
{title:'Een pakje voor Noor',text:'Noor legt een tekening in haar schoen. Ze tekent het paard van de Sint. De volgende ochtend ligt er een boek in haar schoen. Noor leest meteen de eerste bladzijde.',qs:[['Wat legt Noor in haar schoen?','een tekening',['een boek','een wortel','een bal'],'Wat doet Noor aan het begin?'],['Wie staat op de tekening?','het paard',['Bakpiet','Noor','Postpiet'],'Lees wat Noor tekent.'],['Wat krijgt Noor?','een boek',['een fiets','een muts','een trommel'],'Kijk wat er de volgende ochtend ligt.'],['Wat doet Noor met haar cadeau?','Ze begint te lezen.',['Ze bakt koekjes.','Ze gaat slapen.','Ze trekt het aan.'],'Lees de laatste zin.']]},
{title:'Samen bakken',text:'Bakpiet wil pepernoten maken. De kom staat klaar, maar de lepel is weg. Postpiet brengt een schone lepel uit de kast. Nu kunnen ze samen het deeg roeren. Na het bakken delen ze de pepernoten.',qs:[['Wat wil Bakpiet maken?','pepernoten',['soep','brood','taart'],'Lees de eerste zin.'],['Wat ontbreekt eerst?','de lepel',['de kom','de kast','de oven'],'Welk voorwerp is weg?'],['Wie helpt Bakpiet?','Postpiet',['Noor','het paard','de Sint'],'Wie brengt iets?'],['Waarom kan Bakpiet weer roeren?','Hij krijgt een lepel.',['De oven is warm.','Het is avond.','De kom is leeg.'],'Wat heeft hij nodig om te roeren?']]},
{title:'De natte brief',text:'Het regent als Lina naar de brievenbus loopt. Ze stopt haar brief in een zakje, zodat hij droog blijft. Bij de brievenbus haalt ze de brief uit het zakje. Daarna glijdt de brief door de gleuf.',qs:[['Hoe is het weer?','regenachtig',['zonnig','sneeuwerig','mistig'],'Lees de eerste zin.'],['Waarom gebruikt Lina een zakje?','Om de brief droog te houden.',['Om koekjes te bewaren.','Om haar muts te dragen.','Om te tekenen.'],'Lees het stukje met zodat.'],['Waar gaat Lina naartoe?','naar de brievenbus',['naar de keuken','naar de stal','naar school'],'Lees waar Lina naartoe loopt.'],['Wat doet Lina vlak vóór het posten?','Ze haalt de brief uit het zakje.',['Ze schrijft een boek.','Ze bakt pepernoten.','Ze trekt haar jas uit.'],'Lees de derde zin.']]}
];
const storyParts=[
 {text:'Leespiet vindt een gouden brief op tafel. Nieuwsgierig pakt ze hem op.',question:'Wat vindt Leespiet op tafel?',answer:'een gouden brief',wrong:['een rode muts','een groen boek','een blauwe beker'],hint:'Lees de eerste zin. Wat ligt er op tafel?'},
 {text:'Leespiet opent de brief. Er staat: kom naar de keuken! Ze wijst naar de deur.',question:'Waar moet Leespiet naartoe?',answer:'naar de keuken',wrong:['naar de tuin','naar de slaapkamer','naar de stal'],hint:'Wat staat er in de brief?'},
 {text:'In de keuken bakt Bakpiet acht pepernoten. Hij schuift de bakplaat in de oven.',question:'Waarom schuift Bakpiet de plaat in de oven?',answer:'Om de pepernoten te bakken.',wrong:['Om de brief te lezen.','Om een pakje te verstoppen.','Om de plaat af te wassen.'],hint:'Lees wat Bakpiet aan het maken is.'},
 {text:'Een speelgoedtreintje rijdt de keuken in. Op de wagon staat een rood pakje.',question:'Hoe komt het rode pakje naar de keuken?',answer:'met een speelgoedtreintje',wrong:['met een fiets','met een boot','met een vliegtuig'],hint:'Kijk waarop het pakje staat.'},
 {text:'Postpiet neemt het rode pakje. Ze strikt er een gouden lint om. Wat een mooi cadeau!',question:'Wat doet Postpiet met het lint?',answer:'Ze strikt het om het pakje.',wrong:['Ze legt het in de oven.','Ze stopt het in een boek.','Ze knipt het in stukjes.'],hint:'Lees de tweede zin. Wat doet Postpiet?'},
 {text:'De Sint maakt het pakje open. Hij tilt het deksel op en kijkt in de doos. Zijn beer zit erbij.',question:'Wat doet de Sint om in de doos te kijken?',answer:'Hij tilt het deksel op.',wrong:['Hij strikt het lint vast.','Hij zet de doos in de kast.','Hij draait de doos om.'],hint:'Lees wat de Sint met het deksel doet.'},
 {text:'De Sint haalt een kleine rode muts uit de doos. De muts is voor zijn beer!',question:'Voor wie is de kleine muts?',answer:'voor de beer',wrong:['voor Leespiet','voor Bakpiet','voor Postpiet'],hint:'De laatste zin vertelt voor wie de muts is.'},
 {text:'De beer draagt zijn nieuwe muts. Iedereen lacht en eet pepernoten. Samen vieren ze feest!',question:'Wat doen ze op het feest?',answer:'Ze lachen en eten pepernoten.',wrong:['Ze slapen in de bibliotheek.','Ze gaan naar school.','Ze ruimen de stal op.'],hint:'Lees de tweede zin van dit stukje.'}
];
function libraryRound(){return storyParts.map((part,i)=>q(part.question,part.answer,part.wrong,part.hint,{passage:part.text,passageTitle:'Het verrassingsfeest · '+(i+1)+' / 8',storyIndex:i,variant:i}));}

const sounds=[
['dr…','aai','Draai het lint om het pakje.'],['h…','aai','De haai zwemt in de zee.'],['kr…','aai','De kraai zit op het dak.'],['m…','ooi','Wat een mooi cadeau!'],['h…','ooi','Het paard eet hooi.'],['k…','ooi','De vogel zit in een kooi.'],['r…','oei','Ik roei met de boot.'],['gr…','oei','Ik groei elk jaar een beetje.'],['st…','oei','Ik stoei met mijn broer.'],['l…','eeuw','De leeuw brult.'],['sn…','eeuw','Er ligt sneeuw op het dak.'],['m…','eeuw','De meeuw vliegt boven het strand.'],['n…','ieuw','Mijn boek is nieuw.'],['k…','ieuw','Een vis ademt met een kieuw.']
];
const clusters=[['begint','twee','brood',['maan','aap','straat']],['begint','twee','klok',['uur','sproet','bal']],['begint','drie','straat',['stoel','maan','tak']],['begint','drie','strik',['brief','rood','vis']],['begint','drie','sproet',['speel','kat','uur']],['eindigt','twee','kast',['raam','worst','zee']],['eindigt','twee','fiets',['boom','kunst','koe']],['eindigt','drie','worst',['kast','tafel','zee']],['eindigt','drie','kunst',['fiets','maan','raam']],['eindigt','drie','helpt',['boek','kast','koe']]];
const clusterGaps=[
 ['str','…aat','De huizen staan in deze straat.',['st','spr','sch']],
 ['spr','…oet','Op mijn neus zit een sproet.',['sp','str','sch']],
 ['br','…ood','Ik eet een sneetje brood.',['bl','gr','dr']],
 ['kl','…ok','De klok wijst het uur aan.',['kr','pl','gl']],
 ['st','ka…','Mijn jas hangt in de kast.',['ts','rst','sp']],
 ['ts','fie…','Ik rijd op mijn fiets.',['st','rst','ps']],
 ['rst','wo…','Er ligt een worst op mijn bord.',['st','ts','rts']],
 ['lpt','he…','Piet helpt de Sint.',['lt','pt','tpl']]
];
function clusterQuestion(where,num){
 const [w,n,a,wrong]=pick(clusters.filter(c=>c[0]===where&&c[1]===num));
 return q('Welk woord '+w+' met '+n+' medeklinkers?',a,wrong,'Klinkers zijn a, e, i, o en u. Kijk naar de letters '+(w==='begint'?'vooraan':'achteraan')+' in het woord.',{spellingType:'recognize',clusterPosition:w,clusterCount:n});
}
function clusterGapQuestion(item){
 const [a,word,sentence,wrong]=item;
 return q('Maak het woord compleet. Welke letters ontbreken?',a,wrong,'Lees de zin. Zeg het hele woord langzaam en luister naar de medeklinkers.',{equation:word,passage:sentence.replace(new RegExp(word.replace('…',a),'i'),'…'),spellingType:'cluster-gap'});
}
function spellingRound(mode){
 const recognize=mode==='medeklinkers'?[clusterQuestion('begint','twee'),clusterQuestion('eindigt','twee'),clusterQuestion('begint','drie'),clusterQuestion('eindigt','drie')]:[clusterQuestion('begint','drie'),clusterQuestion('eindigt','drie')];
 const result=[...recognize,...shuffle(clusterGaps).slice(0,mode==='medeklinkers'?4:2).map(clusterGapQuestion)];
 if(mode==='spelling'){
  // Four different sound groups; avoid repeating one word or one sound throughout a round.
  for(const sound of shuffle(['aai','ooi','oei','eeuw','ieuw']).slice(0,4)){
   const [word,a,sentence]=pick(sounds.filter(s=>s[1]===sound));
   result.push(q('Welke letters ontbreken?',a,shuffle(['aai','ooi','oei','eeuw','ieuw'].filter(v=>v!==a)).slice(0,3),'Lees de zin en spreek het ontbrekende woord uit.',{equation:word,passage:sentence.replace(new RegExp(word.replace('…',a),'i'),'…'),spellingType:'sound-gap'}));
  }
 }
 return shuffle(result).map((item,i)=>({...item,variant:i}));
}
const shapes=['cirkel','vierkant','rechthoek','driehoek'];
const shapeClues={
 cirkel:'Ik heb geen hoeken en ik ben rond.',
 vierkant:'Ik heb 4 hoeken en 4 gelijke zijden.',
 driehoek:'Ik heb 3 hoeken.',
 rechthoek:'Ik heb 4 hoeken, 2 lange zijden en 2 korte zijden.'
};
function shapeQuestion(shape,description=false){
 return q(description?shapeClues[shape]+' Welke vorm ben ik?':'Welke vorm zie je?',shape,shapes.filter(s=>s!==shape),description?'Denk aan de hoeken en de zijden van elke vorm. Welke vorm past bij alle kenmerken?':shapeClues[shape],{shape,shapeDescription:description});
}
function atelier(mode){
 const type=mode==='spelling'?pick(['klanken','medeklinkers']):mode==='mix'?'vormen':mode;
 if(type==='vormen')return shapeQuestion(pick(shapes),Math.random()<.5);
 if(type==='medeklinkers'){const [where,num,a,wrong]=pick(clusters);return q('Welk woord '+where+' met '+num+' medeklinkers?',a,wrong,'Klinkers zijn a, e, i, o en u. Kijk alleen naar de letters '+(where==='begint'?'vooraan':'achteraan')+' in het woord.');}
 const [word,a,sentence]=pick(sounds),options=a==='eeuw'||a==='ieuw'?['eeuw','ieuw','oei','ooi']:['aai','ooi','oei','eeuw'];
 return q('Welke letters ontbreken?',a,options.filter(v=>v!==a),'Lees de zin en spreek het ontbrekende woord uit.',{equation:word,passage:sentence.replace(new RegExp(word.replace('…',a),'i'),'…')});
}
const generators={pakjes,keuken,magazijn,schrijfkamer,postkamer,atelier};
function round(id,mode='mix'){
 if(id==='atelier'&&['spelling','medeklinkers'].includes(mode))return spellingRound(mode);
 if(id==='atelier'&&(mode==='mix'||mode==='vormen')){
 const pictures=shuffle(shapes),riddles=shuffle(shapes),result=[];
 for(let i=0;i<4;i++){result.push(shapeQuestion(pictures[i]));result.push(shapeQuestion(riddles[i],true));}
 return result.map((item,i)=>({...item,variant:i}));
 }
 if(id==='bibliotheek')return libraryRound();
 if(id==='magazijn'&&(mode==='mix'||mode==='splits')){
 const kinds=shuffle(mode==='mix'?['decompose','compose_te','compose_et','before','after','compare','even','even']:['decompose','decompose','decompose','compose_te','compose_te','compose_te','compose_et','compose_et']),seen=new Set();
 return kinds.map((kind,i)=>{let item,key;do{item=magazijn(kind);key=item.text+item.equation;}while(seen.has(key));seen.add(key);item.variant=i;return item;});
 }

 if(id==='postkamer'&&mode==='mix'){const types=shuffle(['zender','ontvanger','begrijpen','begrijpen','begrijpen','antwoord','antwoord','volgorde']),seen=new Set();return types.map((type,i)=>{let item,k;do{item=postkamer(type);k=item.text+item.passage;}while(seen.has(k));seen.add(k);item.variant=i;return item;});}
 const result=[],seen=new Set();let tries=0;
 while(result.length<8&&tries++<600){
  const item=generators[id](mode),key=JSON.stringify([item.text,item.equation,item.passage,item.answer,item.shape]);
  if(seen.has(key))continue;
  seen.add(key);item.variant=result.length;result.push(item);
 }
 return result;
}
const api={rooms,round,generators,stories,storyParts,shapes};if(typeof module!=='undefined')module.exports=api;root.SintData=api;
})(typeof window==='undefined'?globalThis:window);


