// Application publiable directement sur GitHub Pages, sans dépendances supplémentaires.
// Le Worker Cloudflare et son calendrier d'origine ne sont pas modifiés.
(() => {
  'use strict';
  const root = document.getElementById('root');
  const escape = x => String(x??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dateLabel = s => new Intl.DateTimeFormat('fr-FR',{dateStyle:'full',timeZone:'Europe/Paris'}).format(new Date(s+'T12:00:00Z'));
  const state={screen:'accueil',data:null,error:false,loading:true,copied:''};
  let flight=false,expiry=null;
  const messages={
    'before-trial':['Le rendez-vous approche','La version d’essai ouvre le 17 octobre 2026.'],
    'between-trials':['Merci pour vos essais','L’essai du 17 au 21 octobre 2026 est terminé. Conservez ce QR code pour la suite du calendrier de Noël.'],
    'between':['Rendez-vous le 1er décembre','Les offres de Noël seront disponibles du 1er au 24 décembre 2026.'],
    'finished':['À très bientôt','Le calendrier 2026 est terminé.']
  };
  const el=(markup)=>{root.innerHTML=markup};
  const home=()=>`<main class="poster-screen poster-accueil"><div class="poster-relative"><img src="./visuels/accueil-noel.jpg" alt="Les Vitrines de Vence : Noël vous réserve des surprises. Les offres des commerçants chaque jour."><button type="button" class="poster-hotspot" data-action="offres" aria-label="Voir les offres du jour"><span class="visually-hidden">Voir les offres du jour</span></button></div></main>`;
  const how=()=>`<main class="poster-screen poster-explications"><img src="./visuels/mode-emploi-qr.jpg" alt="Scannez le même QR chaque jour. Découvrez les offres du jour. Présentez le code en boutique. Chaque offre est valable uniquement à la date indiquée."><nav class="poster-bottom-nav" aria-label="Navigation"><button data-action="offres">← Retour aux offres</button><button data-action="accueil">Accueil</button></nav></main>`;
  const christmas=()=>`<main class="poster-screen poster-christmas"><img src="./visuels/noel-25-decembre.jpg" alt="Joyeux Noël à vous ! Les commerçants de Vence vous souhaitent une merveilleuse journée. Merci de faire vivre nos commerces."></main>`;
  const attribution=()=>`<footer class="attribution"><p>Cette application a été conçue et réalisée par</p><strong>Papeterie Multi-Services</strong><address>11, avenue Marcellin Maurel – Vence</address></footer>`;
  function card(o,i){
    // Renseignements commerciaux propres à l'annonce, sans altérer le calendrier.
    const magasin=window.VITRINES_COMMERCES?.[o.code]||{};
    const nom=magasin.nom||o.name;
    const adresse=magasin.adresse||o.address||window.VITRINES_ADRESSES?.[o.name];
    const telephone=magasin.telephone;
    const lienTel=telephone?String(telephone).replace(/[^0-9+]/g,'').replace(/^0/, '+33'):'';
    return `<article class="commerce-card motif-${i%3}"><span class="deco-image" aria-hidden="true"></span><div class="commerce-body"><h2>${escape(nom)}</h2>${adresse?`<address class="store-address">${escape(adresse)}${telephone?`<br><a href="tel:${escape(lienTel)}" style="color:inherit;text-decoration:none">${escape(telephone)}</a>`:''}</address>`:''}<span class="ornamental-line" aria-hidden="true">✦</span><p class="discount">${escape(o.offer)}</p><p class="conditions">${escape(o.conditions)}</p><p class="validite">Valable uniquement le ${escape(dateLabel(o.date))}</p><div class="offer-code"><code>${escape(o.code)}</code><button type="button" data-copy="${escape(o.id)}" aria-label="Copier le code de ${escape(nom)}">${state.copied===o.id?'Copié !':'▣ Copier'}</button></div>${state.copied==='error-'+o.id?'<p class="copy-failure" role="status">Copie indisponible. Sélectionnez le code.</p>':''}</div></article>`;
  }
  function offers(){
    const d=state.data;
    let content;
    if(state.loading)content='<div class="waiting">Vérification de la date et des offres…</div>';
    else if(state.error)content='<div class="waiting"><h2>Connexion interrompue</h2><p>Impossible de vérifier les offres auprès du serveur. Les annonces restent masquées.</p><button data-action="retry">Réessayer</button></div>';
    else if(!d)content='<div class="waiting">Actualisation des offres…</div>';
    else if(messages[d.phase]){const m=messages[d.phase];content=`<div class="waiting"><h2>${escape(m[0])}</h2><p>${escape(m[1])}</p></div>`}
    else content=`${d.phase==='trial'?'<p class="trial-banner">VERSION D’ESSAI · AUCUNE REMISE RÉELLE</p>':''}<div class="commerce-offres">${d.offers.map(card).join('')}</div>${!d.offers.length?'<div class="waiting">Aucune offre publiée aujourd’hui.</div>':''}`;
    return `<div class="offres-page"><header class="offres-navigation"><button data-action="accueil">‹ Accueil</button><span>Les Vitrines de Vence</span></header><main class="offres-content"><div class="offres-title"><h1>Vos offres du jour</h1><p class="offres-date">${d?escape(dateLabel(d.date)):'Vérification de la date…'}</p></div><section class="offres-zone" aria-label="Offres du jour" aria-live="polite" aria-busy="${state.loading}">${content}</section>${attribution()}<div class="offers-actions"><button data-action="explications">Comment profiter des offres ? <span aria-hidden="true">›</span></button></div></main></div>`;
  }
  function render(){
    if(state.data?.date==='2026-12-25'&&!state.error){el(christmas());return;}
    el(state.screen==='accueil'?home():state.screen==='explications'?how():offers());
  }
  function navigate(screen){state.screen=screen;render();window.scrollTo(0,0)}
  root.addEventListener('click', async event=>{
    const button=event.target.closest('button');if(!button||!root.contains(button))return;
    const action=button.dataset.action;
    if(action==='accueil'||action==='offres'||action==='explications')return navigate(action);
    if(action==='retry')return window.location.reload();
    if(button.hasAttribute('data-copy')){
      const offer=state.data?.offers.find(o=>o.id===button.dataset.copy);if(!offer)return;
      try{await navigator.clipboard.writeText(offer.code);state.copied=offer.id;}
      catch{state.copied='error-'+offer.id;}
      const liveButton=root.querySelectorAll('[data-copy]');for(const b of liveButton)if(b.dataset.copy===offer.id)b.textContent=state.copied===offer.id?'Copié !':'▣ Copier';
      if(state.copied.startsWith('error-'))render();
      else setTimeout(()=>{if(state.copied===offer.id){state.copied='';if(state.screen==='offres')render()}},2000);
    }
  });
  async function refresh(){
    if(flight)return;flight=true;
    try{
      const u=window.CALENDRIER_CONFIG?.apiUrl;
      if(!u||!/^https:\/\//.test(u))throw Error('Service non configuré');
      const response=await fetch(u,{cache:'no-store',signal:AbortSignal.timeout(12000)});
      if(!response.ok)throw Error('Service inaccessible');
      const next=await response.json();
      if(!/^\d{4}-\d{2}-\d{2}$/.test(next.date)||!Array.isArray(next.offers)||next.offers.some(o=>o.date!==next.date)||!Number.isFinite(next.refreshAfterMs)||next.refreshAfterMs<=0)throw Error('Calendrier invalide');
      state.data=next;state.error=false;
      if(expiry)clearTimeout(expiry);
      expiry=setTimeout(()=>{state.data=null;render();void refresh()},next.refreshAfterMs+25);
    }catch(e){state.error=true;state.data=null;if(expiry)clearTimeout(expiry)}
    finally{state.loading=false;flight=false;render();}
  }
  render();void refresh();setInterval(refresh,15000);
  function resume(){if(document.visibilityState==='visible'){state.data=null;render();void refresh()}}
  document.addEventListener('visibilitychange',resume);window.addEventListener('focus',resume);window.addEventListener('pageshow',resume);
})();
