const t=document.getElementById("menu"),n=document.getElementById("nav"),e=document.getElementById("back");if(!t&&!n)throw new Error("menu or nav not found");t?.addEventListener("click",()=>{n?.classList.toggle("max-[1300px]:hidden"),e?.classList.toggle("max-[1300px]:hidden")});e?.addEventListener("click",()=>{n?.classList.toggle("max-[1300px]:hidden"),e?.classList.toggle("max-[1300px]:hidden")});