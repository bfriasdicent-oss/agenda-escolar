const CACHE='planify-v5';
const FILES=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});
self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='CHECK_TASKS'){
    const tasks=e.data.tasks||[];
    const now=new Date();now.setHours(0,0,0,0);
    tasks.filter(t=>!t.done&&t.date).forEach(t=>{
      const due=new Date(t.date+'T00:00:00');
      const diff=Math.floor((due-now)/864e5);
      if(diff===3||diff===1||diff===0){
        const sNames={mat:'Matemáticas',esp:'Español',cien:'Ciencias',hist:'Historia',ing:'Inglés',arte:'Arte',edu:'Ed. Física',otro:'Otra'};
        const materia=sNames[t.subj]||'Materia';
        const profe=t.teacher?` — ${t.teacher}`:'';
        const tipo=t.type||'Tarea';
        const cuando=diff===0?'🔥 HOY vence':diff===1?'⏰ Mañana vence':`📅 En ${diff} días`;
        self.registration.showNotification(`${cuando}`,{
          body:`${tipo} de ${materia}${profe}: "${t.title}"`,
          icon:'./favicon.svg',
          badge:'./favicon.svg',
          tag:t.id+'_'+diff,
          renotify:false,
          vibrate:[200,100,200]
        });
      }
    });
  }
});
