import{j as t}from"./jsx-runtime.B6N9iRLn.js";import{r as n}from"./index.DNi1g-pO.js";import{a as c}from"./api.vvbwN_wq.js";import{g as i}from"./index.DS6nHFjH.js";import{S as l}from"./constants.DsI_Q9q-.js";function p({name:s}){return t.jsx("a",{href:`${l}/${s}`,target:"_blank",children:t.jsx("h2",{className:"font-bold text-sm",children:s.split("/").pop()?.split("-").pop()})})}function j(){const[s,o]=n.useState(null),[r,a]=n.useState([]);return n.useEffect(()=>{const e=parseInt(i("id")??"");o(e),e&&c.events.getDocuments(e).then(a)},[s]),r.length===0?null:t.jsxs("div",{children:[t.jsx("h1",{className:"text-3xl font-bold text-center",children:"Documentos"}),t.jsx("div",{className:"flex flex-wrap gap-7 p-10 justify-center",children:r.map((e,m)=>t.jsx(p,{name:e.name},m))})]})}export{j as default};
