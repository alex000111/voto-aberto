"use client";

import {useState} from 'react';
interface Props {name:string;photoUrl:string|null;year?:number;size?:number;priority?:boolean;}
export default function CandidatePhoto({name,photoUrl,year,size=72,priority=false}:Props){
 const [failedUrl,setFailedUrl]=useState<string|null>(null);
 const visible=photoUrl&&failedUrl!==photoUrl;
 return <div style={{position:'relative',width:size,height:size,flexShrink:0}}>
  {!visible&&<div role="img" aria-label={`Foto indisponível para ${name}`} title="Foto não disponível no arquivo oficial consultado" style={{width:size,height:size,borderRadius:'50%',background:'var(--surface-subtle)',border:'2px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--muted)',fontSize:Math.round(size*.32),fontWeight:800}}>{name.trim().charAt(0).toUpperCase()||'?'}</div>}
  {visible&&<img src={photoUrl} alt={`Foto de ${name} publicada pelo TSE${year?` em ${year}`:''}`} width={size} height={size} loading={priority?'eager':'lazy'} decoding="async" onError={()=>setFailedUrl(photoUrl)} style={{width:size,height:size,borderRadius:'50%',objectFit:'cover',objectPosition:'center top',border:'2px solid var(--line)',background:'var(--surface-subtle)'}}/>}
 </div>;
}
