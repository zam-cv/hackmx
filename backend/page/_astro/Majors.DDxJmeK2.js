import{j as e}from"./jsx-runtime.B6N9iRLn.js";import{r as t}from"./index.DNi1g-pO.js";import{S as p,a as d,b as j,c as f,d as h,e as x,f as c}from"./select.xu0dWH6o.js";import{a as S}from"./api.Dmlo9t1Q.js";import"./index.DDEQXXIH.js";import"./check.D66-KWCr.js";import"./Combination.DwtV1lt9.js";import"./index.MkY1K082.js";import"./utils.tCEEUih2.js";import"./constants.Ctw-mqzs.js";function G({defaultValue:r="__none",onChangeValue:l}){const[n,i]=t.useState([]),m=t.useRef(null),[a,o]=t.useState(r);return t.useEffect(()=>{S.tec.majors().then(i)},[]),t.useEffect(()=>{o(r)},[r]),e.jsxs("div",{className:"h-full",children:[e.jsx("button",{ref:m,className:"hidden",id:"major",value:a}),e.jsxs(p,{value:a,onValueChange:s=>{o(s),l?.(s)},children:[e.jsx(d,{className:"h-12 outline-none focus-visible:ring-0 select-none",children:e.jsx(j,{placeholder:"Selecciona una Carrera"})}),e.jsx(f,{children:e.jsxs(h,{children:[e.jsx(x,{children:"Carrera"}),e.jsx(c,{value:"__none",children:"No especificado"}),n.map((s,u)=>e.jsx(c,{value:s,children:s},u))]})})]})]})}export{G as default};