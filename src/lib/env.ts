export type EnvCheck={name:string;required:boolean;configured:boolean;exposed:boolean};
export function environmentChecks():EnvCheck[]{
 const vars=[
  ['SUPABASE_URL',true,false],['SUPABASE_SERVICE_ROLE_KEY',true,false],['SYNC_SECRET',true,false],['CRON_SECRET',true,false],['NEXT_PUBLIC_SITE_URL',true,true]
 ] as const;
 return vars.map(([name,required,exposed])=>({name:name==='SUPABASE_SERVICE_ROLE_KEY'?'SUPABASE_SECRET_KEY ou SUPABASE_SERVICE_ROLE_KEY':name,required,exposed,configured:Boolean(name==='SUPABASE_SERVICE_ROLE_KEY'?(process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim():process.env[name]?.trim())}));
}
export function environmentReady(){return environmentChecks().filter(x=>x.required).every(x=>x.configured)}
