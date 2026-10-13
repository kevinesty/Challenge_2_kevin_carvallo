const YEARS=[2023,2024,2025];
const SERIES={ira:{label:"Episodios de IRA",values:[1003178,883959,824978],color:"#2463eb"},deaths:{label:"Defunciones por neumonía",values:[113,82,51],color:"#0c9488"}};
let activeSeries="ira";
const canvas=document.getElementById("trendChart"),ctx=canvas.getContext("2d");
const format=n=>new Intl.NumberFormat("es-PE").format(n);
function drawChart(){
  const rect=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
  canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const w=rect.width,h=rect.height,s=SERIES[activeSeries],pad={l:65,r:22,t:22,b:43};
  const cw=w-pad.l-pad.r,ch=h-pad.t-pad.b,max=Math.max(...s.values)*1.15;
  ctx.clearRect(0,0,w,h);ctx.font="12px system-ui";ctx.lineWidth=1;
  for(let i=0;i<=4;i++){
    const y=pad.t+ch*i/4,val=max*(1-i/4);
    ctx.strokeStyle="#e2e8f0";ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();
    ctx.fillStyle="#607087";ctx.textAlign="right";ctx.textBaseline="middle";
    ctx.fillText(activeSeries==="ira"?format(Math.round(val/1000)*1000):Math.round(val),pad.l-10,y);
  }
  const pts=s.values.map((v,i)=>({x:pad.l+cw*i/(YEARS.length-1),y:pad.t+ch*(1-v/max),v}));
  ctx.strokeStyle=s.color;ctx.lineWidth=3;ctx.lineJoin="round";ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
  pts.forEach((p,i)=>{ctx.fillStyle="#fff";ctx.strokeStyle=s.color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle="#15243a";ctx.font="bold 12px system-ui";ctx.textAlign="center";ctx.textBaseline="bottom";ctx.fillText(format(p.v),p.x,p.y-11);ctx.fillStyle="#607087";ctx.font="12px system-ui";ctx.textBaseline="top";ctx.fillText(YEARS[i],p.x,h-pad.b+15);});
  document.getElementById("chartTitle").textContent=s.label;
  document.getElementById("chartLegend").textContent=s.label;
}
document.querySelectorAll("[data-series]").forEach(btn=>btn.addEventListener("click",()=>{
  activeSeries=btn.dataset.series;
  document.querySelectorAll("[data-series]").forEach(b=>b.classList.toggle("active",b===btn));
  drawChart();
}));
window.addEventListener("resize",drawChart);
drawChart();
