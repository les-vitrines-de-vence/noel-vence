// À déployer en tant que Worker Cloudflare. Pas de connexion à ChatGPT.
// OFFRES_JSON est une variable de type Secret, configurée uniquement sur le serveur.
const headers={
 'Content-Type':'application/json; charset=utf-8',
 'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0',
 'CDN-Cache-Control':'no-store','Pragma':'no-cache','Expires':'0',
 'Access-Control-Allow-Origin':'*',
 'Access-Control-Allow-Methods':'GET, OPTIONS',
 'Access-Control-Allow-Headers':'Content-Type',
 'X-Content-Type-Options':'nosniff',
};
export function parisDate(now){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const get=t=>parts.find(p=>p.type===t).value;
 return `${get('year')}-${get('month')}-${get('day')}`;
}
export function untilParisMidnight(now){
 const target=new Date(parisDate(now)+'T00:00:00Z');target.setUTCDate(target.getUTCDate()+1);
 const zone=new Intl.DateTimeFormat('en',{timeZone:'Europe/Paris',timeZoneName:'longOffset'}).formatToParts(target).find(p=>p.type==='timeZoneName').value;
 const m=zone.match(/GMT([+-])(\d{2}):(\d{2})/);
 const offset=m?(m[1]==='+'?1:-1)*(Number(m[2])*60+Number(m[3]))*60000:0;
 return target.getTime()-offset-now.getTime();
}
export function parseSchedule(raw){
 if(typeof raw!=='string'||!raw)throw Error('Calendrier non configuré');
 const offers=JSON.parse(raw);if(!Array.isArray(offers))throw Error('Format invalide');
 const ids=new Set();const codes=new Map();
 for(const o of offers){
  if(!o||typeof o!=='object'||['id','date','name','offer','conditions','code'].some(k=>typeof o[k]!=='string'||!o[k].trim()))throw Error('Champs requis manquants');
  if(!/^2026-10-(17|18|19|20|21)$/.test(o.date)||o.test!==true)throw Error('Offre hors période ou non fictive');
  if(ids.has(o.id))throw Error('Identifiant en double');ids.add(o.id);
  const owner=codes.get(o.code);if(owner&&owner!==o.name)throw Error('Code partagé entre commerces');codes.set(o.code,o.name);
 }
 return offers;
}
export function getCalendar(now,offers){
 const date=parisDate(now);
 const trial=date>='2026-10-17'&&date<='2026-10-21';
 return {date,serverTime:now.toISOString(),timezone:'Europe/Paris',refreshAfterMs:untilParisMidnight(now),phase:trial?'trial':date<'2026-10-17'?'before-trial':'between-trials',trialPeriod:trial?'du 17 au 21 octobre 2026':null,
 offers:trial?offers.filter(o=>o.date===date).map(o=>({id:o.id,date:o.date,name:o.name,offer:o.offer,conditions:o.conditions,code:o.code,test:true})):[]};
}
export async function handle(request,env,now=new Date()){
 const url=new URL(request.url);
 if(url.pathname!=='/api/offres')return Response.json({error:'Adresse inconnue'},{status:404,headers});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(request.method!=='GET')return Response.json({error:'Méthode non autorisée'},{status:405,headers:{...headers,Allow:'GET, OPTIONS'}});
 try{
  const schedule=parseSchedule(env.OFFRES_JSON);
  // Ignorer les dates, clics, cookies et en-têtes fournis par le téléphone.
  return Response.json(getCalendar(now,schedule),{headers});
 }catch{
  return Response.json({error:'Le calendrier est temporairement indisponible.'},{status:503,headers});
 }
}
export default {fetch(request,env){return handle(request,env)}};
