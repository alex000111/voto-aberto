const url='https://dadosabertos.tse.jus.br/api/3/action/package_show?id=candidatos-2026';
const res=await fetch(url); if(!res.ok) throw new Error(`HTTP ${res.status}`); const j=await res.json();
console.log(`Dataset: ${j.result.title}`); for(const r of j.result.resources) console.log(`${r.format}\t${r.name}\t${r.url}`);
