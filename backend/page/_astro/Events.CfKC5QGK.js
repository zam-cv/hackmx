import{j as e}from"./jsx-runtime.B6N9iRLn.js";import{r as t}from"./index.DNi1g-pO.js";import{a as c}from"./api.DSv2L0Mn.js";import{f as m}from"./format.BcQETFuH.js";function u({children:s}){return e.jsxs("div",{className:"group/link cursor-pointer px-5 py-3 bg-p-accent rounded-lg relative",children:[e.jsx("div",{children:s}),e.jsx("div",{className:"group-hover/link:ml-1 group-hover/link:-mt-1 absolute w-full h-full z-10 bg-p-secondary-background top-0 left-0 rounded-lg",children:e.jsx("div",{className:"flex items-center justify-center h-full font-bold",children:s})})]})}function f({event:s}){const[a,r]=t.useState(!1),[i,l]=t.useState(!1);return t.useEffect(()=>{const o=new Date(s.start_date),d=new Date(s.end_date),n=new Date;l(o<=n&&n<=d),r(n>d)},[s]),e.jsx("a",{className:"min-h-56 max-h-96 max-w-[30rem]",href:`${a?"/dashboard":i?`/event/?id=${s.id}`:`/invitation/?id=${s.id}`}`,children:e.jsx(u,{children:e.jsxs("div",{className:"w-full h-full p-5 grid grid-rows-[auto_1fr_auto] gap-2",children:[e.jsx("h1",{className:"text-2xl",children:s.title}),e.jsx("div",{children:e.jsx("p",{className:"text-p-secondary-text font-normal line-clamp-4",children:s.description})}),e.jsxs("div",{className:"grid grid-cols-[1fr_auto]",children:[e.jsx("p",{children:s.location}),e.jsx("p",{className:"text-p-secondary-text font-normal",children:m(new Date(s.start_date),"dd - MM - yyyy")})]})]})})})}function j(){const[s,a]=t.useState([]);return t.useEffect(()=>{c.events.list().then(a).then(()=>document.getElementById("loading")?.classList.add("hidden"))},[]),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:s.map((r,i)=>e.jsx(f,{event:r},i))})}export{j as default};
