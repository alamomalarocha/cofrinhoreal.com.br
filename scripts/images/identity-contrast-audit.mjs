import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CONFIG = path.join(ROOT, "data/image-automation/identity-contrast-audit.json");
const PRIOR = path.join(ROOT, "data/image-automation/runtime/avatar-batch-003-004-006-011-checkpoint.json");
const ROSA = path.join(ROOT, "data/image-automation/runtime/avatar-rosa-correction-8-checkpoint.json");
const OUT = path.join(ROOT, "data/image-automation/runtime/identity-contrast-audit");
const REPORT = path.join(ROOT, "data/image-automation/tmp/image-pilot-review/reports/identity-contrast-audit-002-004-006-011-review.html");
const slugs = { "002":"pig-bebe", "003":"pig-primeirinhos", "004":"pig-crianca", "006":"pig-adolescente", "007":"pig-jovem", "008":"pig-jovem-adulto", "009":"pig-adulto", "010":"pig-coroa", "011":"pig-senior" };
const phase2Requests = { azul:"req_f507f3b30b824f8992abb697875cc535", rosa:"req_84732e53f623418fb94b6f7654841ffe", arco_iris:"req_424d0662977b4d4082e2fe55bbd19ef8" };
const codes = { azul:"AZL", rosa:"RSA", arco_iris:"ARC" };
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const write = (p,v) => { fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,`${JSON.stringify(v,null,2)}\n`); };

export function buildIdentityContrastAudit({writeFiles=false}={}) {
  const config=read(CONFIG), prior=read(PRIOR), rosa=read(ROSA), inventory=[];
  const priorBefore=sha(PRIOR), rosaBefore=sha(ROSA);
  for(const phase of config.phases) for(const identity of config.identities){
    const uid=`AVA-${phase}-${codes[identity]}`; let rel,request,origin,state="validated",human=false;
    if(phase==="002"){rel=`assets/characters/002-pig-bebe-${identity.replace("_","-")}.png`;request=phase2Requests[identity];origin="official_phase_002_asset";state="approved";human=true;}
    else if(identity==="rosa"){const v=rosa.completed[uid];rel=v.validated;request=v.request_id;origin="rosa_correction_validated";state="previously_approved";human=true;}
    else {const v=prior.completed[uid];rel=v.validated;request=v.request_id;origin="avatar_batch_24_validated";}
    const abs=path.join(ROOT,rel); if(!fs.existsSync(abs)) throw new Error(`Imagem ausente: ${rel}`);
    inventory.push({uid,phase,identity,path:rel,gallery_src:path.relative(path.dirname(REPORT),abs).replaceAll("\\","/"),sha256:sha(abs),request_id:request,origin,previous_state:state,previous_human_approval:human,included_in_audit:true,notes:identity==="rosa"?"comparison_only_unchanged":"free_visual_audit"});
  }
  const result={api_calls:0,png_created:0,generation_authorized:false,human_review_required:true,azul:config.preliminary.azul,arco_iris:config.preliminary.arco_iris,rosa:{status:"previously_approved_unchanged"},phase_005:{status:"blocked"},catalog:false,publish:false,deploy:false,promote:false,prior_checkpoints_unchanged:true};
  if(writeFiles){write(path.join(OUT,"inventory.json"),{schema_version:"1.0.0",items:inventory});write(path.join(OUT,"result.json"),result);fs.mkdirSync(path.dirname(REPORT),{recursive:true});fs.writeFileSync(REPORT,renderGallery(inventory,result).replace("const src='../../../../'+x.path","const src=x.gallery_src"),"utf8");}
  if(sha(PRIOR)!==priorBefore||sha(ROSA)!==rosaBefore) throw new Error("Checkpoint histórico alterado.");
  return {inventory,result,api_calls:0,png_created:0,report:path.relative(ROOT,REPORT).replaceAll("\\","/")};
}

function renderGallery(items,result){const data=JSON.stringify({items,result}).replaceAll("<","\\u003c");return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Auditoria de contraste das identidades</title><style>body{font:14px system-ui;background:#eef1f5;margin:20px}.phase{background:#fff;margin:20px auto;padding:16px;border-radius:14px;max-width:1450px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.card{border:1px solid #ccd3dd;border-radius:10px;padding:10px}.stage{height:330px;display:flex;justify-content:center}.stage img{max-width:100%;max-height:100%;object-fit:contain}.bgs{display:grid;grid-template-columns:repeat(4,1fr)}.bgs span{height:80px;background:#fff;display:flex;justify-content:center}.bgs span:nth-child(2){background:#888}.bgs span:nth-child(3){background:#000}.bgs span:nth-child(4){background:#16b8c4}.bgs img{max-height:100%;max-width:100%;object-fit:contain}.zooms{display:grid;grid-template-columns:repeat(5,1fr);gap:3px}.crop{height:65px;background-size:280%;background-repeat:no-repeat}.face{background-position:50% 8%}.eyes{background-position:50% 18%}.snout{background-position:50% 28%}.hands{background-position:10% 65%}.feet{background-position:50% 95%}button{margin:2px;padding:7px}.meta{font:11px monospace;overflow-wrap:anywhere}@media(max-width:850px){.grid{grid-template-columns:1fr}}</style></head><body><h1>Auditoria gratuita Azul × Rosa × Arco-Íris</h1><p><b>Revisão humana obrigatória.</b> Nenhuma seleção nesta página publica ou altera arquivos.</p><main id="app"></main><script>const D=${data};const phases=[...new Set(D.items.map(x=>x.phase))];for(const p of phases){const cards=D.items.filter(x=>x.phase===p).map(x=>{const src='../../../../'+x.path;const cls=x.identity==='azul'?(D.result.azul.needs_regeneration.includes(x.uid)?'insufficient_masculine_reading':D.result.azul.review_required.includes(x.uid)?'visual_review_required':'masculine_clear'):x.identity==='rosa'?'feminine_clear':D.result.arco_iris.needs_regeneration.includes(x.uid)?'masculine_marker_on_neutral':'neutral_clear';const checks=x.identity==='azul'?'leitura masculina · roupa · cabelo · marcador adulto · barba/bigode · idade':x.identity==='arco_iris'?'barba · bigode · marcador masculino · marcador feminino · roupa/cabelo/rosto neutros':'Rosa aprovado e inalterado';return '<article class="card"><h3>'+x.uid+'</h3><b>'+cls+'</b><div class="stage"><img src="'+src+'"></div><div class="bgs">'+['','','',''].map(()=>'<span><img src="'+src+'"></span>').join('')+'</div><div class="zooms">'+['face','eyes','snout','hands','feet'].map(c=>'<i class="crop '+c+'" style="background-image:url(\\''+src+'\\')"></i>').join('')+'</div><p>'+checks+'</p><button>APROVAR SEM ALTERAÇÃO</button><button>CORRIGIR AZUL</button><button>CORRIGIR ARCO-ÍRIS</button><button>REVISAR NOVAMENTE</button><p class="meta">'+x.path+'<br>'+x.sha256+'<br>'+x.request_id+'</p></article>'}).join('');document.querySelector('#app').insertAdjacentHTML('beforeend','<section class="phase"><h2>Fase '+p+'</h2><div class="grid">'+cards+'</div></section>')}</script></body></html>`;}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{console.log(JSON.stringify(buildIdentityContrastAudit({writeFiles:true}),null,2));}catch(e){console.error(e.message);process.exitCode=1;}}
