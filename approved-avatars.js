(() => {
  const root=document.querySelector("[data-approved-avatar-gallery]");if(!root)return;
  const escape=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[char]);
  fetch("data/personagens/avatares/avatares-aprovados.json",{cache:"no-store"}).then(response=>{if(!response.ok)throw new Error("Catálogo de avatares indisponível");return response.json();}).then(catalog=>{
    const groups=catalog.available_phases.map(phase=>{const items=catalog.avatars.filter(item=>item.phase===phase);return `<section class="approved-phase-group" aria-labelledby="phase-${phase}"><h3 id="phase-${phase}">${escape(items[0].phase_name)}</h3><div class="approved-avatar-grid">${items.map(item=>`<figure class="approved-avatar-card"><img src="${escape(item.public_path)}" width="${item.width}" height="${item.height}" loading="lazy" alt="${escape(item.phase_name)}, identidade ${item.public_label} ${item.presentation}"><figcaption><strong>${escape(item.public_label)}</strong><span>${escape(item.presentation)}</span></figcaption></figure>`).join("")}</div></section>`;}).join("");
    root.innerHTML=groups+`<aside class="blocked-phase-note"><strong>Fase 005 — Pig Pré-Adolescente</strong><p>Fase em preparação. Nenhum avatar público está disponível.</p></aside>`;
  }).catch(()=>{root.innerHTML="<p>Não foi possível carregar os avatares aprovados neste protótipo.</p>";});
})();
