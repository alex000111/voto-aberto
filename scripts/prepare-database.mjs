import {readFileSync,readdirSync,writeFileSync,mkdirSync} from 'node:fs';
mkdirSync('supabase',{recursive:true});
const paths=['src/lib/db/schema.sql',...readdirSync('migrations').sort().map(name=>'migrations/'+name)];
const sql=paths.map(path=>`-- ${path}\n${readFileSync(path,'utf8')}`).join('\n\n');
writeFileSync('supabase/setup.sql',sql);
console.log('Gerado supabase/setup.sql. Execute no SQL Editor do seu projeto Supabase.');
