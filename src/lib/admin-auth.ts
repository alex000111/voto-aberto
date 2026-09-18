import { timingSafeEqual } from 'node:crypto';
export function adminAuthorized(header:string|null,secret:string|undefined){
 if(!secret?.trim()||!header)return false;
 const expected=Buffer.from(`Bearer ${secret}`),received=Buffer.from(header);
 return expected.length===received.length&&timingSafeEqual(expected,received);
}
