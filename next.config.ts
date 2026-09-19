import type {NextConfig} from 'next';
const config:NextConfig={
 poweredByHeader:false,
 images:{
   remotePatterns:[
     {protocol:'https',hostname:'divulgacandcontas.tse.jus.br',pathname:'/**'},
     {protocol:'https',hostname:'upload.wikimedia.org',pathname:'/**'}
   ],
   unoptimized:true,
 },
 async headers(){return [{source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'X-Frame-Options',value:'DENY'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'}]}];}
};
export default config;
