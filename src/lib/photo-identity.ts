export function photoIdentity(fileName:string){
  const match=/^F([A-Z]{2})(\d{8,20})_div\.jpg$/i.exec(fileName);
  return match?{uf:match[1].toUpperCase(),candidateId:match[2]}:null;
}
export function normalizePhotoName(value:string){
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toUpperCase();
}
