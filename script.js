const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const menu=$('.menu-btn'),nav=$('.mainnav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
const path=location.pathname.split('/').pop()||'index.html';
$$('[data-page]').forEach(a=>{if(a.getAttribute('href')===path)a.classList.add('active')});
const cursor=$('.cursor-glow');window.addEventListener('pointermove',e=>{if(cursor){cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'}});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(el=>io.observe(el));
const topBtn=$('.back-top');window.addEventListener('scroll',()=>topBtn?.classList.toggle('show',scrollY>400));topBtn?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
const searchBtn=$('[data-search-button]');searchBtn?.addEventListener('click',()=>{const input=$('[data-search-input]');const q=(input?.value||'').trim().toLowerCase();if(!q){input?.focus();return}const matches=$$('article, .content-block, .source-list a').filter(el=>el.innerText.toLowerCase().includes(q));if(matches.length){matches[0].scrollIntoView({behavior:'smooth',block:'center'});matches[0].classList.add('search-hit');setTimeout(()=>matches[0].classList.remove('search-hit'),1400)}else toast('No se han encontrado resultados en esta página.')});
function toast(msg){let el=$('.toast');if(!el){el=document.createElement('div');el.className='toast';document.body.append(el)}el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2300)}
$$('[data-demo]').forEach(b=>b.addEventListener('click',()=>toast(b.dataset.demo)));
$$('[data-quiz]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const selected=$('input[name="answer"]:checked',form);const result=$('[data-quiz-result]',form);if(!selected){result.textContent='Selecciona una respuesta primero.';return}result.textContent=selected.value==='mfa'?'¡Correcto! El segundo factor dificulta que una contraseña robada sea suficiente.':'No exactamente. La mejor opción es añadir autenticación multifactor.';result.style.color=selected.value==='mfa'?'#00f5ff':'#ff6adf'}));

// Microinteracciones: inclinación suave en escritorio y respuesta visual al cursor.
if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
  $$('.card, .feature-news, .news-row').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
      el.style.setProperty('--mx', `${x*100}%`); el.style.setProperty('--my', `${y*100}%`);
      if(el.classList.contains('card')) el.style.transform=`translateY(-4px) perspective(700px) rotateX(${(0.5-y)*1.8}deg) rotateY(${(x-0.5)*1.8}deg)`;
    });
    el.addEventListener('pointerleave',()=>{el.style.transform='';});
  });
}


// Global search: useful from every page, with direct links to articles and learning sections.
const searchIndex = [
 {title:'KillSec: Europol toma el control de su sitio de filtraciones',desc:'Ransomware, robo de datos y operación internacional',href:'articulo-amenazas.html',img:'assets/europol-killsec.png',tag:'EUROPOL · 1 OCT 2026',keys:'killsec ransomware europol extorsión filtración robo datos amenazas'},
 {title:'ENISA 2026: las dependencias digitales amplían el riesgo',desc:'Panorama europeo de amenazas, ransomware y cadena de suministro',href:'articulo-nube.html',img:'assets/news-enisa-2026.jpg',tag:'ENISA · 22 SEP 2026',keys:'enisa europa nube cloud dependencias ransomware cadena suministro'},
 {title:'Contenidos de seguridad y alta disponibilidad',desc:'Conceptos, riesgos y medidas técnicas',href:'contenidos.html',img:'assets/news-cloud-detail.jpg',tag:'CONTENIDOS',keys:'contenidos redes seguridad alta disponibilidad riesgos'},
 {title:'Reflexión personal del proyecto',desc:'Qué he aprendido y cómo aplicaría las medidas',href:'reflexion.html',img:'assets/hero-cyber.jpg',tag:'REFLEXIÓN',keys:'reflexion personal aprendizaje opinión proyecto'},
 {title:'Defensa: medidas y reto interactivo',desc:'Contraseñas, phishing, MFA y prevención',href:'defensa.html',img:'assets/challenge-phishing.jpg',tag:'DEFENSA',keys:'defensa phishing contraseña mfa autenticación protección'}
];
const searchLayer=document.querySelector('[data-global-search]');
const searchToggle=document.querySelector('[data-global-search-toggle]');
const searchClose=document.querySelector('[data-global-search-close]');
const searchInput=document.querySelector('[data-global-search-input]');
const searchResults=document.querySelector('[data-global-search-results]');
function renderGlobalSearch(query=''){
 if(!searchResults)return;
 const normalizeSearch = value => value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const q=normalizeSearch(query.trim());
 if(!q){searchResults.innerHTML='<p class="search-hint">Busca por tema o palabra clave: <b>ransomware</b>, <b>Renfe</b>, <b>IA</b>, <b>nube</b> o <b>phishing</b>. Puedes combinar términos.</p>';return;}
 const terms=q.split(/\s+/).filter(Boolean);
 const matches=searchIndex.filter(item=>{const haystack=normalizeSearch(item.title+' '+item.desc+' '+item.tag+' '+item.keys);return terms.every(term=>haystack.includes(term));});
 searchResults.innerHTML=matches.length?matches.map(item=>`<a class="search-result" href="${item.href}"><img src="${item.img}" alt=""><span><strong>${item.title}</strong><small>${item.tag} · ${item.desc}</small></span><span class="result-arrow">↗</span></a>`).join(''):'<div class="search-empty">No encuentro resultados. Prueba otra palabra o busca “phishing”, “IA” o “nube”.</div>';
}
function openGlobalSearch(){if(!searchLayer)return;searchLayer.classList.add('open');searchLayer.setAttribute('aria-hidden','false');searchToggle?.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';setTimeout(()=>searchInput?.focus(),80);renderGlobalSearch(searchInput?.value||'');}
function closeGlobalSearch(){if(!searchLayer)return;searchLayer.classList.remove('open');searchLayer.setAttribute('aria-hidden','true');searchToggle?.setAttribute('aria-expanded','false');document.body.style.overflow='';searchToggle?.focus();}
searchToggle?.addEventListener('click',openGlobalSearch);searchClose?.addEventListener('click',closeGlobalSearch);searchInput?.addEventListener('input',e=>renderGlobalSearch(e.target.value));
searchLayer?.addEventListener('click',e=>{if(e.target===searchLayer)closeGlobalSearch()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&searchLayer?.classList.contains('open'))closeGlobalSearch();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openGlobalSearch();}});


// Five-scenario security defense simulator with real score, progress and tailored feedback.
(function initDefenseGame(){
 const root=document.querySelector('[data-defense-game]');
 if(!root)return;
 const cases=[
  {kind:'PHISHING · CORREO URGENTE',title:'Tu banco amenaza con bloquear la cuenta',subtitle:'Llega un correo con un botón azul que exige verificar tu identidad en 10 minutos.',image:'assets/challenge-phishing.jpg',alt:'Persona revisando un correo sospechoso en su portátil',scene:'NO CONFÍES EN LA PRISA',detail:'Los mensajes de urgencia tratan de evitar que compruebes el remitente y el dominio.',options:[
    {label:'Abro el enlace: parece la web del banco.',ok:false,feedback:'El diseño se puede copiar. Un enlace falso puede llevarte a una página de robo de credenciales.'},
    {label:'Entro en la app oficial y reviso los avisos.',ok:true,feedback:'Correcto. Llegas al servicio por una ruta conocida, sin depender del enlace recibido.'},
    {label:'Respondo al correo para comprobar si es real.',ok:false,feedback:'No respondas al contacto sospechoso. Podrías confirmar que tu dirección está activa o compartir información.'}
  ],lesson:'Regla: verifica por una vía independiente, revisa el dominio y nunca compartas códigos.'},
  {kind:'SUPLANTACIÓN · MENSAJE DEL JEFE',title:'“Compra tarjetas regalo y mándame los códigos ya”',subtitle:'Un supuesto responsable te escribe desde un número nuevo y dice que está en una reunión.',image:'assets/news-ai-detail.jpg',alt:'Operador revisando una alerta de identidad y privacidad',scene:'VERIFICA LA IDENTIDAD',detail:'La urgencia y el cambio de canal encajan con un fraude de suplantación o compromiso del correo empresarial.',options:[
    {label:'Compro las tarjetas para demostrar rapidez.',ok:false,feedback:'El dinero y los códigos pueden perderse en segundos y ser difíciles de recuperar.'},
    {label:'Pido el nombre completo y continúo por ese chat.',ok:false,feedback:'Los datos de contexto pueden haberse obtenido de redes sociales. No prueban la identidad.'},
    {label:'Llamo al número que ya tenía guardado y confirmo.',ok:true,feedback:'Correcto. Usa un contacto que ya sabes que es auténtico, no el canal proporcionado en el mensaje.'}
  ],lesson:'Regla: ante pagos o datos sensibles, confirma la petición por un canal conocido.'},
  {kind:'SEGURIDAD FÍSICA · USB DESCONOCIDO',title:'Encuentras una memoria USB en el aula',subtitle:'Tiene una etiqueta “Notas examen”. Te pica la curiosidad y hay un ordenador disponible.',image:'assets/news-europol.jpg',alt:'Investigación forense de dispositivos y medios de almacenamiento',scene:'NO CONECTES LO DESCONOCIDO',detail:'Los dispositivos abandonados pueden contener malware o activar acciones automáticas al conectarse.',options:[
    {label:'La conecto al PC para averiguar de quién es.',ok:false,feedback:'El equipo puede quedar expuesto sin que aparezca una señal evidente.'},
    {label:'La entrego al responsable TIC sin conectarla.',ok:true,feedback:'Correcto. El personal responsable puede gestionarla en un entorno controlado.'},
    {label:'La pruebo en mi portátil personal, no en el del centro.',ok:false,feedback:'También arriesgas tus cuentas, documentos y dispositivos personales.'}
  ],lesson:'Regla: no conectes dispositivos desconocidos; entrégalos a la persona responsable.'},
  {kind:'INCIDENTE · POSIBLE RANSOMWARE',title:'Tus archivos cambian de nombre y aparece un aviso',subtitle:'El equipo va muy lento y una ventana pide dinero para recuperar los documentos.',image:'assets/news-backup.jpg',alt:'Centro de operaciones monitorizando alertas de seguridad',scene:'CONTÉN EL INCIDENTE',detail:'Seguir usando el equipo o conectar unidades externas puede ampliar el daño a otros sistemas.',options:[
    {label:'Desconecto la red si es seguro y aviso al responsable TIC.',ok:true,feedback:'Correcto. Limitar la conectividad puede ayudar a frenar la propagación. Sigue el procedimiento del centro.'},
    {label:'Pago para recuperar los archivos cuanto antes.',ok:false,feedback:'Pagar no garantiza la recuperación y puede financiar nuevos ataques. Debe intervenir el equipo responsable.'},
    {label:'Conecto un disco de copia para probar si funciona.',ok:false,feedback:'Podrías exponer también la copia. No conectes respaldos al equipo afectado.'}
  ],lesson:'Regla: avisa, limita el alcance y deja la respuesta técnica al procedimiento de incidentes.'},
  {kind:'ALTA DISPONIBILIDAD · RECUPERACIÓN',title:'El servidor principal deja de funcionar',subtitle:'Hay una copia de seguridad, pero nadie sabe cuándo se probó por última vez.',image:'assets/news-cloud-detail.jpg',alt:'Centro de datos con infraestructura de servidores conectados',scene:'UNA COPIA DEBE RESTAURARSE',detail:'La continuidad depende de copias protegidas, objetivos de recuperación claros y pruebas periódicas.',options:[
    {label:'Restauro desde una copia aislada y probada según el plan.',ok:true,feedback:'Correcto. Una copia protegida y validada reduce la incertidumbre durante una caída.'},
    {label:'Confío en que el almacenamiento sincronizado lo recuperará todo.',ok:false,feedback:'La sincronización puede replicar borrados o cifrado malicioso; no sustituye una estrategia de respaldo.'},
    {label:'Sobrescribo el servidor con la copia más reciente sin comprobarla.',ok:false,feedback:'La copia puede estar dañada o comprometida. Comprueba integridad y sigue el plan de recuperación.'}
  ],lesson:'Regla: mantén copias separadas, protege su acceso y ensaya restauraciones.'}
 ];
 let index=0,score=0,answered=0,good=0,wrong=0,locked=false,history=[];
 const countEl=document.querySelector('[data-case-count]'),scoreEl=document.querySelector('[data-score]'),labelEl=document.querySelector('[data-progress-label]'),percentEl=document.querySelector('[data-progress-percent]'),barEl=document.querySelector('[data-progress-bar]');
 function updateHud(){const n=Math.min(index+1,cases.length);if(countEl)countEl.innerHTML=`${String(n).padStart(2,'0')} <span>/ ${String(cases.length).padStart(2,'0')}</span>`;if(scoreEl)scoreEl.innerHTML=`${score} <span>/ 100</span>`;const percent=Math.round((index/cases.length)*100);if(labelEl)labelEl.textContent=index>=cases.length?'RETO COMPLETADO':`PRUEBA ${String(n).padStart(2,'0')} DE ${String(cases.length).padStart(2,'0')}`;if(percentEl)percentEl.textContent=`${percent}%`;if(barEl)barEl.style.width=`${percent}%`}
 function renderCase(){locked=false;updateHud();const c=cases[index];root.innerHTML=`<div class="defense-stage"><div class="defense-visual"><img src="${c.image}" alt="${c.alt}"><span class="defense-visual-label">${c.kind}</span><div class="defense-visual-bottom"><strong>${c.scene}</strong><span>Lee la situación, piensa en el impacto y toma una decisión.</span></div></div><div class="defense-question"><div class="eyebrow">SITUACIÓN ${String(index+1).padStart(2,'0')} / ${cases.length}</div><h2>${c.title}</h2><p>${c.subtitle}</p><div class="defense-choices">${c.options.map((o,i)=>`<button class="defense-choice" type="button" data-choice="${i}"><span class="choice-key">${String.fromCharCode(65+i)}</span><span class="choice-label">${o.label}</span><span class="choice-arrow">↗</span></button>`).join('')}</div><div data-feedback-slot></div></div></div>`;root.querySelectorAll('[data-choice]').forEach(btn=>btn.addEventListener('click',()=>choose(Number(btn.dataset.choice))));}
 function choose(choice){if(locked)return;locked=true;answered++;const c=cases[index],selected=c.options[choice],correctIndex=c.options.findIndex(x=>x.ok);if(selected.ok){score+=20;good++;}else wrong++;history.push({title:c.title,ok:selected.ok,chosen:selected.label,correct:c.options[correctIndex].label});root.querySelectorAll('[data-choice]').forEach((btn,i)=>{btn.disabled=true;if(c.options[i].ok)btn.classList.add('correct');if(i===choice&&!selected.ok)btn.classList.add('wrong');const arrow=btn.querySelector('.choice-arrow');if(arrow)arrow.textContent=c.options[i].ok?'✓':i===choice?'×':''});const slot=root.querySelector('[data-feedback-slot]');slot.innerHTML=`<div class="defense-feedback ${selected.ok?'good':'bad'}"><strong>${selected.ok?'✓ DECISIÓN SEGURA · +20 PUNTOS':'⚠ RIESGO DETECTADO · +0 PUNTOS'}</strong><p>${selected.feedback}</p><p><b>Qué recordar:</b> ${c.lesson}</p></div><button class="defense-next" type="button" data-next>${index===cases.length-1?'Ver mi resultado →':'Siguiente situación →'}</button>`;const next=slot.querySelector('[data-next]');next.addEventListener('click',()=>{index++;if(index>=cases.length)renderResults();else renderCase();});updateHud();}
 function renderResults(){if(barEl)barEl.style.width='100%';if(percentEl)percentEl.textContent='100%';if(labelEl)labelEl.textContent='RETO COMPLETADO';if(countEl)countEl.innerHTML=`05 <span>/ 05</span>`;if(scoreEl)scoreEl.innerHTML=`${score} <span>/ 100</span>`;let title,desc,icon;if(score>=80){title='Defensa muy sólida';desc='Has reconocido la mayoría de las señales y has priorizado la verificación, la contención y la recuperación.';icon='✓'}else if(score>=40){title='Buen comienzo: afina tus reflejos';desc='Has detectado algunos riesgos, pero en una situación real la urgencia puede empujarnos a tomar atajos. Repasa los casos fallados.';icon='◈'}else{title='El siguiente clic puede cambiarlo todo';desc='Los engaños están diseñados para provocar decisiones rápidas. Repasa los casos y quédate con una regla: detente y verifica.';icon='!'}root.innerHTML=`<section class="defense-results"><div class="defense-results-top"><div class="defense-results-icon">${icon}</div><span class="eyebrow">INFORME FINAL · OIER DEFENSE LAB</span><h2>${title}</h2><p>${desc}</p><div class="defense-final-score">${score}<span style="font-size:25px;color:#aac6e0"> / 100</span></div></div><div class="defense-results-stats"><div><strong>${good}</strong><span>DECISIONES SEGURAS</span></div><div><strong>${wrong}</strong><span>RIESGOS ASUMIDOS</span></div><div><strong>5</strong><span>CASOS COMPLETADOS</span></div></div><div class="defense-review">${history.map((h,i)=>`<article class="defense-review-item"><strong>${h.ok?'✓':'⚠'} ${String(i+1).padStart(2,'0')} · ${h.title}</strong><p>${h.ok?'Has elegido una respuesta segura.':'Tu elección: '+h.chosen+' La opción más segura era: '+h.correct}</p></article>`).join('')}</div><div class="defense-results-actions"><button class="defense-next" type="button" data-restart>↻ Volver a jugar</button></div></section>`;root.querySelector('[data-restart]').addEventListener('click',()=>{index=score=answered=good=wrong=0;history=[];renderCase();root.scrollIntoView({behavior:'smooth',block:'start'});});}
 renderCase();
})();


(function syncSidebarWithHeader(){
 const header=document.querySelector('header.topbar');
 const sidebar=document.querySelector('.layout .sidebar');
 if(!header || !sidebar) return;
 const update=()=>{
  const bottom=header.getBoundingClientRect().bottom;
  const offset=Math.max(0,Math.min(76,bottom));
  sidebar.style.setProperty('--sidebar-offset',`${offset}px`);
 };
 update();
 window.addEventListener('scroll',update,{passive:true});
 window.addEventListener('resize',update);
})();


(function initThreatRadarExplainers(){
 const modal=document.querySelector('[data-threat-modal]');
 if(!modal) return;
 const dialog=modal.querySelector('.threat-modal-dialog');
 const title=modal.querySelector('[data-threat-title]');
 const label=modal.querySelector('[data-threat-label]');
 const intro=modal.querySelector('[data-threat-intro]');
 const example=modal.querySelector('[data-threat-example]');
 const protect=modal.querySelector('[data-threat-protect]');
 const closeControls=modal.querySelectorAll('[data-threat-close]');
 const explanations={
  ransomware:{
   label:'01 // RANSOMWARE',
   title:'Un secuestro digital de tus archivos',
   intro:'El ransomware es un ataque que bloquea o cifra archivos y sistemas para pedir dinero a cambio de recuperarlos. En otras palabras, es como si alguien pusiera un candado a tus documentos y después te exigiera un pago por la llave.',
   example:'Abres un archivo adjunto que parecía normal y, de repente, no puedes abrir tus trabajos ni los documentos compartidos de la empresa. Aparece un mensaje que pide dinero para devolver el acceso.',
   protect:'Mantén el sistema actualizado, desconfía de adjuntos inesperados y conserva copias de seguridad separadas que se hayan probado. Pagar no garantiza que vayas a recuperar los archivos.'
  },
  phishing:{
   label:'02 // PHISHING',
   title:'Un engaño para que confíes y piques',
   intro:'El phishing consiste en hacerse pasar por una entidad o persona de confianza —por ejemplo, tu banco, una empresa de mensajería o el centro educativo— para que reveles datos, contraseñas o códigos, o pulses un enlace peligroso.',
   example:'Te llega un correo que dice que tu cuenta se bloqueará en diez minutos y te lleva a una página casi idéntica a la del banco. Si escribes la contraseña allí, se la estás entregando al atacante.',
   protect:'No te dejes llevar por la urgencia. Comprueba la dirección del remitente, no uses el enlace del mensaje y entra por la web o aplicación oficial. Nunca compartas códigos de verificación.'
  },
  'supply-chain':{
   label:'03 // CADENA DE SUMINISTRO',
   title:'Entrar por la puerta de un proveedor',
   intro:'Una cadena de suministro incluye los proveedores, programas y servicios de los que depende una organización. Este tipo de ataque ocurre cuando alguien compromete a uno de ellos para llegar después a sus clientes, que confiaban en ese proveedor.',
   example:'Una empresa instala una actualización legítima de un programa que utiliza a diario, pero el proveedor ha sido comprometido y esa actualización trae código malicioso. El problema puede afectar a muchas organizaciones a la vez.',
   protect:'Las organizaciones deben revisar a sus proveedores, instalar actualizaciones desde canales oficiales, limitar los permisos de cada servicio y vigilar los accesos. Confiar en un proveedor no significa que esté libre de riesgos.'
  }
 };
 let lastTrigger=null,previousOverflow='';
 function openModal(key,trigger){
  const item=explanations[key];
  if(!item) return;
  lastTrigger=trigger;
  label.textContent=item.label;
  title.textContent=item.title;
  intro.textContent=item.intro;
  example.textContent=item.example;
  protect.textContent=item.protect;
  previousOverflow=document.body.style.overflow;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  window.setTimeout(()=>dialog.focus(),30);
 }
 function closeModal(){
  if(!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow=previousOverflow;
  if(lastTrigger) lastTrigger.focus();
 }
 document.querySelectorAll('[data-threat-term]').forEach(button=>{
  button.addEventListener('click',()=>openModal(button.dataset.threatTerm,button));
 });
 closeControls.forEach(control=>control.addEventListener('click',closeModal));
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape') closeModal();
  if(event.key==='Tab' && modal.classList.contains('open')){
   const controls=[...modal.querySelectorAll('button:not([disabled])')];
   if(!controls.length) return;
   const first=controls[0],last=controls[controls.length-1];
   if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
})();


(function initOierMascotCompanion(){
 const root=document.createElement('div');
 root.className='mascot-companion pose-alert';
 root.setAttribute('role','img');
 root.setAttribute('aria-label','Tung Tung Sahur, mascota de OIER');
 root.innerHTML=`
  <span class="mascot-companion-aura" aria-hidden="true"></span>
  <span class="mascot-orbit-dot" aria-hidden="true"></span>
  <div class="mascot-companion-avatar" aria-hidden="true">
   <span class="mascot-art-window">
    <img class="mascot-image mascot-image-a is-visible" src="assets/hero-mascot.jpg" alt="" loading="eager">
    <img class="mascot-image mascot-image-b" src="assets/side-mascot.jpg" alt="" loading="eager">
   </span>
   <span class="mascot-avatar-shade"></span>
   <span class="mascot-companion-status" aria-hidden="true"></span>
   <span class="mascot-guide-label"><b>OIER</b><small>GUARDIÁN DIGITAL</small></span>
   <span class="mascot-guide-spark" aria-hidden="true">✦</span>
  </div>`;
 document.body.append(root);

 const imageA=root.querySelector('.mascot-image-a');
 const imageB=root.querySelector('.mascot-image-b');
 let visibleImage=imageA;
 let activeMarker=-1;
 let movementTimer=null;
 let reactionTimer=null;
 let scrollFrame=0;

 // Cuatro variaciones visuales creadas con los dos recursos que ya incluye el proyecto.
 // Cambian el encuadre, el zoom y la orientación sin añadir imágenes nuevas.
 const poses=[
  {name:'pose-alert',src:'assets/hero-mascot.jpg',position:'52% 39%',scale:1.02,flip:1,origin:'50% 50%'},
  {name:'pose-sentry',src:'assets/side-mascot.jpg',position:'49% 0%',scale:1.38,flip:1,origin:'18% 12%'},
  {name:'pose-close',src:'assets/hero-mascot.jpg',position:'69% 31%',scale:1.34,flip:-1,origin:'50% 50%'},
  {name:'pose-ready',src:'assets/side-mascot.jpg',position:'49% 0%',scale:1.6,flip:1,origin:'18% 12%'}
 ];
 const poseNames=poses.map(p=>p.name);
 const pagePose={
  'index.html':0,'noticias.html':1,'contenidos.html':2,'reflexion.html':3,
  'organizacion.html':1,'fuentes.html':2,'defensa.html':3,
  'articulo-amenazas.html':2,'articulo-copias.html':3,'articulo-nube.html':1,
  'articulo-ia.html':0,'articulo-disponibilidad.html':2
 };
 const fileName=(window.location.pathname.split('/').pop()||'index.html').toLowerCase();
 const pageOffset=pagePose[fileName]??0;
 const markerSelector='main > .hero, main > .page-hero, main > .section-title, main > .news-layout, main > .dashboard-grid, main > .video-library, main > .detail-content > .content-block, main > .detail-content > section, main > .detail-content > article, main > .article-grid, main > .news-wall, main > .news-editorial, main > .defense-game, main > .defense-aftercare, main > .footer';
 const markers=[...document.querySelectorAll(markerSelector)].filter((element,index,list)=>list.indexOf(element)===index);

 function setPose(index){
  const pose=poses[((index%poses.length)+poses.length)%poses.length];
  const nextImage=visibleImage===imageA?imageB:imageA;
  root.classList.remove(...poseNames);
  root.classList.add(pose.name);
  nextImage.src=pose.src;
  nextImage.style.objectPosition=pose.position;
  nextImage.style.setProperty('--pose-scale',String(pose.scale));
  nextImage.style.setProperty('--pose-flip',String(pose.flip));
  nextImage.style.transformOrigin=pose.origin||'50% 50%';
  requestAnimationFrame(()=>{
   nextImage.classList.add('is-visible');
   visibleImage.classList.remove('is-visible');
   visibleImage=nextImage;
  });
 }
 function syncCompanionToScroll(){
  const activationLine=window.innerHeight*.48;
  let sectionIndex=0;
  markers.forEach((marker,i)=>{if(marker.getBoundingClientRect().top<=activationLine)sectionIndex=i;});
  const index=pageOffset+sectionIndex;
  if(index===activeMarker)return;
  activeMarker=index;
  clearTimeout(movementTimer);
  root.classList.add('is-moving');
  movementTimer=window.setTimeout(()=>{
   setPose(index);
   window.setTimeout(()=>root.classList.remove('is-moving'),420);
  },90);
 }
 window.addEventListener('scroll',()=>{
  if(scrollFrame)return;
  scrollFrame=window.requestAnimationFrame(()=>{scrollFrame=0;syncCompanionToScroll();});
 },{passive:true});
 window.addEventListener('resize',syncCompanionToScroll,{passive:true});
 // La página también determina la pose inicial, aunque el visitante no haga scroll.
 setPose(pageOffset);
 syncCompanionToScroll();

 // Reacciones solo visuales y breves en el reto: nunca abre mensajes ni ventanas.
 document.addEventListener('click',event=>{
  const choice=event.target.closest('[data-choice]');
  if(!choice)return;
  window.setTimeout(()=>{
   const good=choice.classList.contains('correct');
   const caution=choice.classList.contains('wrong');
   if(!good&&!caution)return;
   clearTimeout(reactionTimer);
   root.classList.remove('is-good','is-caution');
   root.classList.add(good?'is-good':'is-caution');
   reactionTimer=window.setTimeout(()=>root.classList.remove('is-good','is-caution'),1300);
  },0);
 });
})();
