const base=(process.env.VOTO_ABERTO_URL||'http://localhost:3000').replace(/\/$/,'');
const paths=['/api/health','/api/readiness','/api/datasets','/api/candidaturas?uf=PE'];
let failures=0;
for(const path of paths){try{const r=await fetch(base+path,{headers:{accept:'application/json'}});const body=await r.text();console.log(`${r.ok?'OK':'FAIL'} ${r.status} ${path} ${body.slice(0,180)}`);if(!r.ok)failures++;}catch(e){console.error(`ERROR ${path}`,e.message);failures++;}}
process.exitCode=failures?1:0;
