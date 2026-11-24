/* All languages use the same game logic; only display strings are translated. */
(function (host) {
"use strict";
const KEY="pirpir-language-v1";
const languages=Object.freeze([
  {code:"tr",tag:"tr-TR",flag:"🇹🇷",name:"Türkçe"},
  {code:"en",tag:"en-GB",flag:"🇬🇧",name:"English"},
  {code:"es",tag:"es-ES",flag:"🇪🇸",name:"Español"},
  {code:"ru",tag:"ru-RU",flag:"🇷🇺",name:"Русский"},
  {code:"zh",tag:"zh-CN",flag:"🇨🇳",name:"简体中文"}
]);
const i=code=>languages.findIndex(l=>l.code===code);
let active=0;
try{const selected=i(host.localStorage.getItem(KEY));if(selected!==-1)active=selected;}catch{}
const cache=languages.map(({tag})=>new Intl.NumberFormat(tag,{maximumFractionDigits:0}));
const WORDS={
  game:["Oyun","Game","Juego","Игра","游戏"],
  title:["Pırpır Sakinleşiyor","Pırpır Calms Down","Pırpır se calma","Пырпыр успокаивается","皮尔皮尔平静下来"],
  name:["Pırpır","Pırpır","Pırpır","Пырпыр","皮尔皮尔"],
  subtitle:["Sakinleşiyor","Calms Down","Se calma","Успокаивается","平静下来"],
  pop:["Pırpır Sakinleşiyor: baloncuk çıkar","Pırpır Calms Down: make a bubble","Pırpır se calma: haz una burbuja","Пырпыр успокаивается: пусти пузырёк","皮尔皮尔平静下来：吹个泡泡"],
  language:["Oyun dili","Game language","Idioma del juego","Язык игры","游戏语言"],
  play:["Oyna","Play","Jugar","Играть","开始"],
  help:["Nasıl oynanır?","How to play?","¿Cómo jugar?","Как играть?","怎么玩？"],
  helpTitle:["Nehirde nasıl yüzülür?","How do you swim in the river?","¿Cómo se nada en el río?","Как плыть по реке?","怎样在河里游？"],
  help1:["Basılı tutunca yüksel, bırakınca alçal. Dikenli kestanelerin arasından geç!","Hold to swim up and release to swim down. Slip between the spiky urchins!","Mantén pulsado para subir y suelta para bajar. ¡Pasa entre los erizos!","Удерживай, чтобы плыть вверх; отпускай, чтобы опуститься. Проплывай между колючими ежами!","按住向上游，松开向下游。小心从带刺的海胆之间穿过去！"],
  help2:["Her 5 metre ve her baloncuk 1 puan. Beşli seride +2, onlu seride +5 kazan. Altın baloncuk sakinleştirir, yosun köftesi 8 saniyelik hız kalkanı verir.","Every 5 metres and every bubble earns 1 point. Get +2 for five bubbles in a row and +5 for ten. A gold bubble calms Pırpır. An algae bite gives a speed shield for 8 seconds.","Cada 5 metros y cada burbuja dan 1 punto. Consigue +2 con una racha de cinco y +5 con diez. La burbuja dorada calma a Pırpır. El bocadito de algas da un escudo veloz de 8 segundos.","За каждые 5 метров и каждый пузырёк получаешь 1 очко. Серия из пяти даёт +2, а из десяти — +5. Золотой пузырёк успокаивает Пырпыра. Водорослевая котлетка даёт скоростной щит на 8 секунд.","每游 5 米或收集一个泡泡得 1 分。连收 5 个加 2 分，连收 10 个加 5 分。金色泡泡让皮尔皮尔平静下来；海藻丸子提供 8 秒的加速护盾。"],
  help3:["Tospik soldan gelip kestaneleri kırar. Açtığı yoldaki iki baloncuğu toplayınca +8 kazanırsın. Tatlı su kerevitinin açtığı aralıktan geçmek +8, kaçırmak −50 puan.","Tospik swims in from the left and clears the urchins. Collect both bubbles in his path for +8. Swim through the opening made by the crayfish for +8. Missing it costs 50 points.","Tospik llega por la izquierda y aparta los erizos. Recoge las dos burbujas de su camino para ganar +8. Pasa por la abertura que hace el cangrejo de río para ganar +8. Si no pasas, pierdes 50 puntos.","Тоспик приплывает слева и убирает морских ежей. Собери два пузырька на его пути и получи +8. За проход, который прорезал рак, получишь +8. Если пропустить его, потеряешь 50 очков.","托斯皮克从左边游来，帮你清掉海胆。收集他路上的两个泡泡可加 8 分。穿过小龙虾打开的缺口加 8 分，错过则扣 50 分。"],
  gotIt:["Anladım","Got it","Entendido","Понятно","明白了"],
  about:["Kitap hakkında","About the book","Sobre el libro","О книге","关于这本书"],
  aboutHeading:["Maceramız bu kitapta!","Our adventure is in this book!","¡Nuestra aventura está en este libro!","Наше приключение — в этой книге!","我们的冒险就在这本书里！"],
  backCoverHeading:["Arka kapaktan kısa özet","Back-cover summary","Resumen de la contraportada","Кратко по аннотации","封底简介"],
  backCoverCopy:[
    "Pırpır çabucak öfkelenen küçük bir pirana. Onun hikâyesi, öfkeyi tanımayı ve sakinleşmeyi anlatıyor. Paylaşmanın, sabrın ve emek vermenin değerini; birbirimizi anlamanın da nasıl iyi geldiğini gösteriyor.",
    "Pırpır is a little piranha who is quick to get angry. His story is about recognising anger and learning to calm down. It also shows why sharing, being patient, making an effort and understanding one another matter.",
    "Pırpır es una pequeña piraña que se enfada con facilidad. Su historia nos ayuda a reconocer el enfado y a calmarnos. También nos enseña por qué importa compartir, tener paciencia, esforzarse y comprender a los demás.",
    "Пырпыр — маленькая пиранья, которая легко сердится. Его история помогает понять свой гнев и научиться успокаиваться. Она также показывает, как важны умение делиться, терпение, старание и понимание друг друга.",
    "皮尔皮尔是一条很容易生气的小食人鱼。他的故事讲的是怎样认识愤怒、学会让自己平静下来，也让我们看到分享、耐心、努力和相互理解为什么重要。"
  ],
  bookCover:["Pırpır Sakinleşiyor kitabının kapağı","Cover of Pırpır Sakinleşiyor","Portada de Pırpır Sakinleşiyor","Обложка книги «Pırpır Sakinleşiyor»","《Pırpır Sakinleşiyor》的封面"],
  author:["Yazan ve resimleyen","Written and illustrated by","Texto e ilustraciones","Автор и художник","文字与插画"],
  gamified:["Oyunlaştıran","Game adaptation by","Adaptación al juego","Адаптация в игру","游戏改编"],
  publisher:["Yayınevi","Publisher","Editorial","Издательство","出版社"],
  backRiver:["Nehre dön","Back to the river","Volver al río","Назад к реке","回到河里"],
  rotate:["Lütfen cihazı yan çevir","Turn your device sideways","Gira el dispositivo de lado","Поверни устройство набок","请横过设备"],
  installIOS:["Daha iyi deneyim için: Paylaş → Ana Ekrana Ekle","For a better experience: Share → Add to Home Screen","Para jugar mejor: Compartir → Añadir a pantalla de inicio","Для удобства: «Поделиться» → «На экран Домой»","想玩得更顺畅：分享 → 添加到主屏幕"],
  installOther:["Daha iyi deneyim için: Menü ⋮ → Ana ekrana ekle","For a better experience: Menu ⋮ → Add to Home Screen","Para jugar mejor: Menú ⋮ → Añadir a pantalla de inicio","Для удобства: меню ⋮ → «Добавить на главный экран»","想玩得更顺畅：菜单 ⋮ → 添加到主屏幕"],
  popupRotate:["Yönü değiştir","Change orientation","Cambiar orientación","Изменить ориентацию","更改方向"],
  popupBrowser:["Tarayıcıda aç","Open in browser","Abrir en el navegador","Открыть в браузере","在浏览器中打开"],
  popupAndroid:["Açılmadıysa: sağ üstteki ⋮ → “Tarayıcıda aç”","Didn’t open? Tap ⋮ at the top right → “Open in browser”","¿No se abrió? Toca ⋮ arriba a la derecha → «Abrir en el navegador»","Не открылось? Нажми ⋮ справа сверху → «Открыть в браузере»","没打开？点右上角 ⋮ →「在浏览器中打开」"],
  popupIOS:["Açılmadıysa: sağ alttaki ⋯ → “Tarayıcıda aç”","Didn’t open? Tap ⋯ at the bottom right → “Open in browser”","¿No se abrió? Toca ⋯ abajo a la derecha → «Abrir en el navegador»","Не открылось? Нажми ⋯ справа снизу → «Открыть в браузере»","没打开？点右下角 ⋯ →「在浏览器中打开」"],
  popupTurn:["Telefonu yan çevirip oyna 🔄","Turn your phone sideways to play 🔄","Gira el móvil de lado para jugar 🔄","Поверни телефон набок, чтобы играть 🔄","横过手机开始游戏 🔄"],
  points:["PUAN","POINTS","PUNTOS","ОЧКИ","分"],
  lives:["{n} can","Lives: {n}","Vidas: {n}","Жизни: {n}","生命：{n}"],
  anger:["Öfke","Anger","Enfado","Злость","生气值"],
  fullscreen:["Tam ekran","Full screen","Pantalla completa","На весь экран","全屏"],
  leaveFullscreen:["Tam ekrandan çık","Exit full screen","Salir de pantalla completa","Выйти из полноэкранного режима","退出全屏"],
  mute:["Sesi kapat","Mute sound","Silenciar","Выключить звук","关闭声音"],
  unmute:["Sesi aç","Unmute sound","Activar el sonido","Включить звук","打开声音"],
  friendMeter:["Birlikte yüzme","Swimming together","Nadar juntos","Плывём вместе","一起游泳"],
  breath:["NEFES!","BREATHE!","¡RESPIRA!","ВДОХНИ!","深呼吸！"],
  round:["Tur skoru","Round score","Puntos de la partida","Очки за игру","本局得分"],
  diary:["Nehir günlüğün","Your river diary","Tu diario del río","Твой речной дневник","你的河流日记"],
  distanceResult:["{n} metre yüzdün","You swam {n} m","Nadaste {n} m","Ты проплыл {n} м","你游了 {n} 米"],
  best:["Kişisel rekor","Personal best","Mejor marca","Личный рекорд","个人纪录"],
  bestShort:["Rekor","Best","Récord","Рекорд","纪录"],
  bestAria:["Kişisel rekor: {n} puan","Personal best: {n} points","Mejor marca: {n} puntos","Личный рекорд: {n} очков","个人纪录：{n} 分"],
  record:["Rekor: {n}","Best: {n}","Récord: {n}","Рекорд: {n}","纪录：{n}"],
  newRecord:["Yeni rekor!","New record!","¡Nuevo récord!","Новый рекорд!","新纪录！"],
  replay:["Tekrar oyna","Play again","Jugar de nuevo","Играть снова","再玩一次"],
  menu:["Ana menü","Main menu","Menú principal","Главное меню","主菜单"],
  back:["Geri dön","Go back","Volver","Назад","返回"],
  angerGate:["Pırpır çok kızdı!","Pırpır is upset!","¡Pırpır se ha enfadado!","Пырпыр рассердился!","皮尔皮尔生气了！"],
  breathingCorner:["Nefes Köşesi","Breathing Corner","Rincón para respirar","Уголок дыхания","呼吸角"],
  breathingHelp:["Basılı tut, baloncuk halkaya ulaşınca bırak.","Hold and release when the bubble reaches the ring.","Mantén pulsado y suelta cuando la burbuja llegue al aro.","Удерживай и отпусти, когда пузырёк коснётся кольца.","按住，泡泡碰到圆环时松开。"],
  sunny:["Güneşli koy","Sunny cove","Cala soleada","Солнечная бухта","阳光湾"],
  roots:["Kök geçidi","Root passage","Paso de raíces","Проход среди корней","树根通道"],
  cave:["Işıltılı mağara","Glowing cave","Cueva brillante","Сияющая пещера","闪光洞穴"],
  metres:["{n} m","{n} m","{n} m","{n} м","{n} 米"],
  distanceCheer:["{n} metre","{n} m","{n} m","{n} м","{n} 米"],
  milestone:["{n} puan!","{n} points!","¡{n} puntos!","Очки: {n}!","{n} 分！"],
  bubbleParty:["Baloncuk şenliği","Bubble party","Fiesta de burbujas","Праздник пузырьков","泡泡派对"],
  swim:["Basılı tut, yüksel. Bırak, alçal.","Hold to rise. Release to sink.","Mantén pulsado para subir. Suelta para bajar.","Удерживай — вверх. Отпусти — вниз.","按住向上游，松开向下游。"],
  turtle:["Tospik yolu açıyor. İzindeki baloncukları topla!","Tospik clears the way. Collect the bubbles in his trail!","Tospik abre paso. ¡Recoge las burbujas que deja!","Тоспик расчищает путь. Собирай пузырьки за ним!","托斯皮克清开了路。快收集他身后的泡泡！"],
  crayfish:["Kerevit ipi kesiyor. Aralıktan geç! Kaçırırsan −50.","The crayfish cuts the rope. Go through the gap! Miss it and lose 50 points.","El cangrejo de río corta la cuerda. ¡Pasa por el hueco! Si no, pierdes 50 puntos.","Рак перерезает верёвку. Проплыви в проём! Не успеешь — потеряешь 50 очков.","小龙虾剪断了绳子。快穿过缺口！错过扣 50 分。"],
  turtleLow:["Tospik alttan geliyor. İzindeki baloncukları topla!","Tospik is coming along the bottom. Collect his bubbles!","Tospik viene por abajo. ¡Recoge sus burbujas!","Тоспик плывёт снизу. Собери его пузырьки!","托斯皮克从下面游过来。快收集他的泡泡！"],
  turtleHigh:["Tospik üstten geliyor. İzindeki baloncukları topla!","Tospik is coming along the top. Collect his bubbles!","Tospik viene por arriba. ¡Recoge sus burbujas!","Тоспик плывёт сверху. Собери его пузырьки!","托斯皮克从上面游过来。快收集他的泡泡！"],
  gapFound:["Geçidi buldun! +8","You found the gap! +8","¡Encontraste el hueco! +8","Ты нашёл проход! +8","找到缺口了！+8"],
  gapMiss:["Geçidi kaçırdın. −50 puan","You missed the gap. −50 points","No pasaste por el hueco. −50 puntos","Проход пропущен. −50 очков","错过缺口。−50 分"],
  twoBubbles:["İki baloncuk! Tospik’le +8","Two bubbles! +8 with Tospik","¡Dos burbujas! +8 con Tospik","Два пузырька! +8 с Тоспиком","两个泡泡！托斯皮克帮你加 8 分"],
  pearls:["İnci yağmuru!","Pearl shower!","¡Lluvia de perlas!","Жемчужный дождь!","珍珠雨！"],
  sparkle:["Işıl ışıl!","All sparkles!","¡Qué brillo!","Вот это блеск!","闪闪发光！"],
  shield:["HIZ KALKANI!","SPEED SHIELD!","¡ESCUDO VELOZ!","СКОРОСТНОЙ ЩИТ!","加速护盾！"]
};
function number(value){return cache[active].format(Number(value));}
function t(key,params){const text=WORDS[key]?.[active]??WORDS[key]?.[0]??key;
 return params?text.replace(/\{(\w+)\}/g,(whole,name)=>Object.hasOwn(params,name)?(typeof params[name]==="number"?number(params[name]):String(params[name])):whole):text;}
function locale(){return languages[active].code;}
const visible={
 "#play":"play","#guide":"help","#instructions-heading":"helpTitle",
 "#instructions>p:nth-of-type(1)":"help1","#instructions>p:nth-of-type(2)":"help2","#instructions>p:nth-of-type(3)":"help3",
 "#closeGuide":"gotIt","#about-heading":"aboutHeading","#about-writer":"author","#about-maker":"gamified",
 "#about-publisher":"publisher","#about-close":"backRiver","#cevirUyari .yaz":"rotate",
 "#about-blurb-heading":"backCoverHeading","#about-blurb-copy":"backCoverCopy",
 "#ustSol .skorKutu small":"points","#nefesBuyuk":"breath","#sonKat .etiket":"points",
 "#tekrarDugme":"replay","#menu":"menu","#best .full-label":"best","#best .compact-label":"bestShort",
 "#girisBaslik .intro-name":"name","#girisBaslik .intro-subtitle":"subtitle"
};
const accessible={
 "#girisBaslik":["aria-label","title"],"#intro-title-touch":["aria-label","pop"],
 "#about-open":["aria-label","about"],"#about-dialog .about-inside img":["alt","bookCover"],
 "#ofkeSarj":["aria-label","anger"],"#friendMeter":["aria-label","friendMeter"],
 "#nefesGeri":["aria-label","back"],"#nefesPirpir":["alt","name"]
};
let mounted=null;
function applyStatic(doc){
 doc.documentElement.lang=languages[active].tag;
 doc.title=t("title")+" — "+t("game");
 for(const [selector,key] of Object.entries(visible)){const el=doc.querySelector(selector);if(el)el.textContent=t(key);}
 for(const [selector,[name,key]] of Object.entries(accessible)){const el=doc.querySelector(selector);if(el)el.setAttribute(name,t(key));}
 // The story and its byline stay in their original language; the panel copy changes.
 const book=doc.querySelector("#book-title");
 if(book)book.lang="tr";
 const about=doc.querySelector("#about-open");
 if(about)about.title=t("about");
}
function select(code){
 const index=i(code);if(index<0||index===active)return false;
 active=index;try{host.localStorage.setItem(KEY,code);}catch{}
 if(mounted){
  applyStatic(mounted.doc);mounted.render();mounted.onChange?.(code);
  host.dispatchEvent(new host.CustomEvent("pirpir:locale",{detail:{locale:code}}));
 }
 return true;
}
function mount({onChange,doc=host.document}={}){
 if(mounted)return;
 const menu=doc?.querySelector("#girisKutu");if(!menu)return;
 const picker=doc.createElement("details");picker.id="pirpir-language";
 const summary=doc.createElement("summary");summary.className="pirpir-language-button";
 const selectedFlag=doc.createElement("span");selectedFlag.className="pirpir-language-flag";
 selectedFlag.setAttribute("aria-hidden","true");
 summary.append(selectedFlag);
 const list=doc.createElement("div");list.className="pirpir-language-list";list.setAttribute("role","group");
 const buttons=languages.map(({code,tag,flag,name})=>{
  const button=doc.createElement("button");button.type="button";button.lang=tag;button.dataset.locale=code;
  const icon=doc.createElement("span");icon.className="pirpir-language-flag";icon.setAttribute("aria-hidden","true");icon.textContent=flag;
  const text=doc.createElement("span");text.textContent=name;button.append(icon,text);
  button.addEventListener("click",()=>{select(code);picker.open=false;summary.focus();});
  list.append(button);return button;
 });
 picker.append(summary,list);menu.append(picker);
 const render=()=>{
  const l=languages[active],title=t("language")+" · "+l.name;
  selectedFlag.textContent=l.flag;summary.setAttribute("aria-label",title);summary.title=title;
  list.setAttribute("aria-label",t("language"));
  buttons.forEach((b,n)=>b.setAttribute("aria-pressed",String(n===active)));
 };
 mounted={doc,render,onChange};
 doc.addEventListener("pointerdown",e=>{if(picker.open&&!picker.contains(e.target))picker.open=false;},{capture:true,passive:true});
 doc.addEventListener("keydown",e=>{if(e.key==="Escape"&&picker.open){e.preventDefault();picker.open=false;summary.focus();}});
 applyStatic(doc);render();onChange?.(locale());
}
host.PirpirI18n=Object.freeze({t,number,locale,select,mount,languages});
})(globalThis);
