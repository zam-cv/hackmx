import{j as s}from"./jsx-runtime.B6N9iRLn.js";import{r as t}from"./index.DNi1g-pO.js";import{S as p}from"./constants.Ctw-mqzs.js";import{a as f}from"./api.Dmlo9t1Q.js";import{g as d}from"./index.DS6nHFjH.js";function E(){const[e,a]=t.useState(null),[o,n]=t.useState([]);return t.useEffect(()=>{const r=d("id");r&&a(parseInt(r))},[]),t.useEffect(()=>{(e||e===0)&&f.events.getSponsors(e).then(n)},[e]),o.length>0&&s.jsxs("div",{children:[s.jsx("h1",{className:"text-3xl font-semibold text-center",children:"Patrocinadores"}),s.jsx("div",{className:"flex flex-wrap gap-10 pt-10 justify-center",children:o.map(([r,i,c],m)=>s.jsx("img",{src:`${p}/${c}`,alt:i,className:"w-40 h-36 object-scale-down rounded-md"},m))})]})}export{E as default};