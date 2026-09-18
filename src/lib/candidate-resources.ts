import {getCandidateDatasetMetadata,TSEResource} from './tse';

export type CandidateOfficialResources={photos:TSEResource[];proposals:TSEResource[];certificates:TSEResource[];social:TSEResource[];assets:TSEResource[]};
const txt=(r:TSEResource)=>`${r.name} ${r.description||''}`.toLowerCase();
const scopeMatch=(r:TSEResource,uf:string)=>{const n=txt(r);const x=uf.toLowerCase();return n.includes(`${x} -`)||n.includes(` ${x} `)||n.startsWith(x)|| (x==='br'&&/presidente|br -/.test(n));};
export async function candidateOfficialResources(uf:string):Promise<CandidateOfficialResources>{
 const d=await getCandidateDatasetMetadata();
 const scoped=(re:RegExp)=>d.resources.filter(r=>re.test(txt(r))&&scopeMatch(r,uf));
 return {
  photos:scoped(/foto/), proposals:scoped(/proposta.*governo/), certificates:scoped(/certid/),
  social:d.resources.filter(r=>/rede.*social/.test(txt(r))&&String(r.format).toUpperCase()==='CSV'),
  assets:d.resources.filter(r=>/bens.*candidat/.test(txt(r))&&String(r.format).toUpperCase()==='CSV')
 };
}
