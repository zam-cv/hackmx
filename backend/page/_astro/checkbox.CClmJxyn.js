import{j as n}from"./jsx-runtime.B6N9iRLn.js";import{r as s}from"./index.DNi1g-pO.js";import{c as B,u as M,e as O,P as j,b as E,i as A,C as H}from"./check.D66-KWCr.js";import{u as K}from"./index.MkY1K082.js";import{P as L}from"./index.DiuBTR2a.js";import{c as P}from"./utils.tCEEUih2.js";import"./index.DDEQXXIH.js";var v="Checkbox",[q,Z]=B(v),[z,T]=q(v),R=s.forwardRef((e,c)=>{const{__scopeCheckbox:t,name:d,checked:p,defaultChecked:r,required:m,disabled:u,value:l="on",onCheckedChange:h,...y}=e,[a,k]=s.useState(null),_=M(c,o=>k(o)),x=s.useRef(!1),g=a?!!a.closest("form"):!0,[f=!1,C]=O({prop:p,defaultProp:r,onChange:h}),D=s.useRef(f);return s.useEffect(()=>{const o=a?.form;if(o){const b=()=>C(D.current);return o.addEventListener("reset",b),()=>o.removeEventListener("reset",b)}},[a,C]),n.jsxs(z,{scope:t,state:f,disabled:u,children:[n.jsx(j.button,{type:"button",role:"checkbox","aria-checked":i(f)?"mixed":f,"aria-required":m,"data-state":S(f),"data-disabled":u?"":void 0,disabled:u,value:l,...y,ref:_,onKeyDown:E(e.onKeyDown,o=>{o.key==="Enter"&&o.preventDefault()}),onClick:E(e.onClick,o=>{C(b=>i(b)?!0:!b),g&&(x.current=o.isPropagationStopped(),x.current||o.stopPropagation())})}),g&&n.jsx(X,{control:a,bubbles:!x.current,name:d,value:l,checked:f,required:m,disabled:u,style:{transform:"translateX(-100%)"}})]})});R.displayName=v;var w="CheckboxIndicator",N=s.forwardRef((e,c)=>{const{__scopeCheckbox:t,forceMount:d,...p}=e,r=T(w,t);return n.jsx(L,{present:d||i(r.state)||r.state===!0,children:n.jsx(j.span,{"data-state":S(r.state),"data-disabled":r.disabled?"":void 0,...p,ref:c,style:{pointerEvents:"none",...e.style}})})});N.displayName=w;var X=e=>{const{control:c,checked:t,bubbles:d=!0,...p}=e,r=s.useRef(null),m=K(t),u=A(c);return s.useEffect(()=>{const l=r.current,h=window.HTMLInputElement.prototype,a=Object.getOwnPropertyDescriptor(h,"checked").set;if(m!==t&&a){const k=new Event("click",{bubbles:d});l.indeterminate=i(t),a.call(l,i(t)?!1:t),l.dispatchEvent(k)}},[m,t,d]),n.jsx("input",{type:"checkbox","aria-hidden":!0,defaultChecked:i(t)?!1:t,...p,tabIndex:-1,ref:r,style:{...e.style,...u,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function i(e){return e==="indeterminate"}function S(e){return i(e)?"indeterminate":e?"checked":"unchecked"}var I=R,F=N;const $=s.forwardRef(({className:e,...c},t)=>n.jsx(I,{ref:t,className:P("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",e),...c,children:n.jsx(F,{className:P("flex items-center justify-center text-current"),children:n.jsx(H,{className:"h-4 w-4"})})}));$.displayName=I.displayName;export{$ as Checkbox};