import{j as e}from"./jsx-runtime.B6N9iRLn.js";import{r}from"./index.DNi1g-pO.js";import{S as P,a as y,b as C,c as z,d as R,e as k,f as B}from"./select.xu0dWH6o.js";import{I as u}from"./Input.B7MCSZ51.js";import{B as E}from"./Button.BI9RPgp0.js";import{T}from"./textarea.BRIx4TOL.js";import{a}from"./api.C7Wea-9E.js";import{g as v}from"./index.DS6nHFjH.js";import"./index.DDEQXXIH.js";import"./check.D66-KWCr.js";import"./Combination.DwtV1lt9.js";import"./index.MkY1K082.js";import"./utils.tCEEUih2.js";import"./constants.BLY7Oycq.js";function q(){const n=r.useRef(null),[m,x]=r.useState(!1),[f,i]=r.useState(null),[l,h]=r.useState(""),[c,j]=r.useState(""),[d,g]=r.useState(0),[p,S]=r.useState(""),[b,I]=r.useState([]);r.useEffect(()=>{const t=v("id");if(t){const s=parseInt(t);a.events.getSponsorsWithIdAndNames(s).then(I),a.projects.getProject(s).then(o=>{o&&(h(o.name),j(o.url),g(o.sponsor_id),S(o.description),i(o.zip),x(!0))})}},[]);function N(){const t=v("id");if(t)if(m){const s=n.current?.files?.[0];a.projects.updateProject(parseInt(t),s,{id:0,name:l,url:c,sponsor_id:d,zip:s?s.name:"",description:p}).then(()=>{s&&i(s.name)})}else{const s=n.current?.files?.[0];if(!s)return;a.projects.uploadProject(parseInt(t),s,{id:0,name:l,url:c,sponsor_id:d,zip:s.name,description:p}).then(()=>{i(s.name),x(!0)})}}return e.jsxs("div",{className:"flex flex-col gap-5 bg-p-secondary-background p-10 rounded-lg",children:[e.jsx("h1",{className:"text-3xl font-semibold text-center",children:"Subir Proyecto"}),e.jsx(u,{id:"name",type:"text",placeholder:"Nombre del proyecto",value:l,onChange:t=>h(t.target.value)}),e.jsx(u,{id:"url",type:"text",placeholder:"URL del Repositorio",value:c,onChange:t=>j(t.target.value)}),e.jsxs(P,{onValueChange:t=>g(parseInt(t)),value:d.toString(),children:[e.jsx(y,{className:"outline-none focus-visible:ring-0 select-none h-12",children:e.jsx(C,{placeholder:"Selecciona un Patrocinador"})}),e.jsx(z,{children:e.jsxs(R,{children:[e.jsx(k,{children:"Patrocinador"}),b.map((t,s)=>e.jsx(B,{value:`${t[0]}`,children:t[1]},s))]})})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(u,{ref:n,id:"file",type:"file",placeholder:"Codigo Fuente",className:"p-[9px] h-12 w-full rounded-md outline-none text-gray-200 bg-p-accent-background border text-base cursor-pointer border-p-border"}),e.jsxs("div",{className:"grid grid-cols-2",children:[e.jsx("div",{children:f&&e.jsxs("p",{className:"text-xs text-emerald-400",children:["* Se envio ",f]})}),e.jsx("div",{className:"flex justify-end",children:e.jsx("p",{className:"text-xs text-p-secondary-text text-right",children:"maximo 10MB"})})]})]}),e.jsx(T,{id:"project",placeholder:"Descripción",className:"text-base",value:p,onChange:t=>S(t.target.value)}),e.jsx(E,{id:"send",onClick:N,children:m?"Actualizar Proyecto":"Subir Proyecto"})]})}export{q as default};