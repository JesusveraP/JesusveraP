import{b as y,r as l}from"./vendor-x9zrslyQ.js";const x=()=>{const{systemSettings:n}=y().props,[g,d]=l.useState(n?.color_scheme||"green-600");l.useEffect(()=>{const r=t=>{t.detail&&t.detail.color_scheme&&d(t.detail.color_scheme)};return window.addEventListener("systemColorsChanged",r),()=>{window.removeEventListener("systemColorsChanged",r)}},[]),l.useEffect(()=>{n?.color_scheme&&n.color_scheme!==g&&d(n.color_scheme)},[n?.color_scheme]);const o=g,i={"green-500":"34 197 94","green-600":"22 163 74","green-700":"21 128 61","green-800":"22 101 52","emerald-500":"16 185 129","emerald-600":"5 150 105","red-50":"254 242 242","red-100":"254 226 226","red-200":"254 202 202","red-300":"252 165 165","red-400":"248 113 113","red-500":"239 68 68","red-600":"220 38 38","red-700":"185 28 28","red-800":"153 27 27","red-900":"127 29 29","blue-50":"239 246 255","blue-100":"219 234 254","blue-200":"191 219 254","blue-300":"147 197 253","blue-400":"96 165 250","blue-500":"59 130 246","blue-600":"37 99 235","blue-700":"29 78 216","blue-800":"30 64 175","blue-900":"30 58 138","green-50":"240 253 244","green-100":"220 252 231","green-200":"187 247 208","green-300":"134 239 172","green-400":"74 222 128","green-900":"20 83 45","purple-50":"250 245 255","purple-100":"243 232 255","purple-200":"233 213 255","purple-300":"196 181 253","purple-400":"167 139 250","purple-500":"139 92 246","purple-600":"124 58 237","purple-700":"109 40 217","purple-800":"91 33 182","purple-900":"76 29 149","yellow-50":"254 252 232","yellow-100":"254 249 195","yellow-200":"254 240 138","yellow-300":"253 224 71","yellow-400":"250 204 21","yellow-500":"234 179 8","yellow-600":"202 138 4","yellow-700":"161 98 7","yellow-800":"133 77 14","yellow-900":"113 63 18","indigo-50":"238 242 255","indigo-100":"224 231 255","indigo-200":"199 210 254","indigo-300":"165 180 252","indigo-400":"129 140 248","indigo-500":"99 102 241","indigo-600":"79 70 229","indigo-700":"67 56 202","indigo-800":"55 48 163","indigo-900":"49 46 129","pink-50":"253 242 248","pink-100":"252 231 243","pink-200":"251 207 232","pink-300":"249 168 212","pink-400":"244 114 182","pink-500":"236 72 153","pink-600":"219 39 119","pink-700":"190 24 93","pink-800":"157 23 77","pink-900":"131 24 67","orange-50":"255 247 237","orange-100":"255 237 213","orange-200":"254 215 170","orange-300":"253 186 116","orange-400":"251 146 60","orange-500":"249 115 22","orange-600":"234 88 12","orange-700":"194 65 12","orange-800":"154 52 18","orange-900":"124 45 18","teal-500":"20 184 166","teal-600":"13 148 136","cyan-400":"34 211 238","cyan-500":"6 182 212","cyan-600":"8 145 178","sky-500":"14 165 233","sky-600":"2 132 199","slate-600":"71 85 105","slate-700":"51 65 85","gray-600":"75 85 99","gray-700":"55 65 81","zinc-600":"82 82 91","stone-600":"87 83 78","amber-500":"245 158 11"},p=()=>i[o]||i["green-600"],b=(r=>{const[t,e]=r.split("-"),a=parseInt(e),s=Math.max(a-100,50),c=Math.min(a+100,900);return{primary:`bg-${r}`,primaryHover:`hover:bg-${t}-${c}`,primaryText:`text-${r}`,primaryBorder:`border-${r}`,primaryRing:`ring-${r}`,lighter:`bg-${t}-${s}`,darker:`bg-${t}-${c}`}})(o);return l.useEffect(()=>{const[r,t]=o.split("-"),e=p(),a=document.getElementById("dynamic-theme-colors");a&&a.remove();const s=document.createElement("style");s.id="dynamic-theme-colors";const c=parseInt(t),u=Math.min(c+100,900),m=i[`${r}-${u}`]||e;s.innerHTML=`
            /* Variables CSS para colores dinámicos */
            :root {
                --color-primary: rgb(${e});
                --color-primary-hover: rgb(${m});
            }
            
            /* Aplicar colores SENA específicos */
            .bg-${o}, 
            .bg-primary, 
            .btn-primary,
            button[class*="bg-${r}"],
            [data-color-primary] {
                background-color: rgb(${e}) !important;
            }
            
            /* Estados hover para botones SENA */
            .bg-${o}:hover,
            .bg-primary:hover,
            .btn-primary:hover,
            button[class*="bg-${r}"]:hover,
            [data-color-primary]:hover {
                background-color: rgb(${m}) !important;
                opacity: 0.9;
            }
            
            /* Texto con colores SENA */
            .text-${o},
            .text-primary,
            a[class*="text-${r}"],
            [data-text-primary] {
                color: rgb(${e}) !important;
            }
            
            /* Bordes con colores SENA */
            .border-${o},
            .border-primary,
            [class*="border-${r}"],
            [data-border-primary] {
                border-color: rgb(${e}) !important;
            }
            
            /* Rings y focus states para colores SENA */
            .ring-${o},
            .focus\\:ring-${o}:focus,
            .focus\\:ring-primary:focus {
                --tw-ring-color: rgb(${e}) !important;
                box-shadow: 0 0 0 3px rgba(${e}, 0.3) !important;
            }
            
            /* Focus states para inputs */
            .focus\\:border-${o}:focus,
            .focus\\:border-primary:focus {
                border-color: rgb(${e}) !important;
            }
            
            /* Aplicar a todos los elementos con clases verdes existentes */
            .bg-green-500, .bg-green-600, .bg-green-700, .bg-green-800,
            .bg-emerald-500, .bg-emerald-600 {
                background-color: rgb(${e}) !important;
            }
            
            .text-green-500, .text-green-600, .text-green-700, .text-green-800,
            .text-emerald-500, .text-emerald-600 {
                color: rgb(${e}) !important;
            }
            
            .border-green-500, .border-green-600, .border-green-700, .border-green-800,
            .border-emerald-500, .border-emerald-600 {
                border-color: rgb(${e}) !important;
            }
            
            /* Sidebar y navegación */
            .sidebar-bg,
            nav[class*="bg-green"],
            header[class*="bg-green"] {
                background-color: rgb(${e}) !important;
            }
            
            /* Enlaces específicos */
            a.text-green-600,
            .link-primary {
                color: rgb(${e}) !important;
            }
            
            /* Badges y elementos de estado */
            .badge-success,
            .status-active {
                background-color: rgb(${e}) !important;
                color: white !important;
            }
            
            /* Elementos específicos del panel de administración */
            .admin-header,
            .dashboard-card[data-primary],
            .stats-card[data-color="green"] {
                border-color: rgb(${e}) !important;
            }
            
            /* Personalización avanzada para componentes React */
            [class*="bg-green"][class*="500"],
            [class*="bg-green"][class*="600"],
            [class*="bg-green"][class*="700"],
            [class*="bg-green"][class*="800"],
            [class*="bg-emerald"] {
                background-color: rgb(${e}) !important;
            }
            
            [class*="text-green"][class*="500"],
            [class*="text-green"][class*="600"],
            [class*="text-green"][class*="700"],
            [class*="text-green"][class*="800"],
            [class*="text-emerald"] {
                color: rgb(${e}) !important;
            }
        `,document.head.appendChild(s),setTimeout(()=>{document.body.classList.add("color-scheme-updated"),setTimeout(()=>{document.body.classList.remove("color-scheme-updated")},10)},50)},[o]),{colors:b,colorScheme:o,getCurrentColorRGB:p}};export{x as u};
