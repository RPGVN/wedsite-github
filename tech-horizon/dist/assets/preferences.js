(function(){
'use strict';
const C=window.THCore;if(!C)return;
function apply(value){const p=value&&['system','reduce'].includes(value.motion)&&[1,1.12,1.25].includes(value.scale)&&typeof value.contrast==='boolean'?value:{motion:'system',scale:1,contrast:false},html=document.documentElement;html.dataset.motion=p.motion;html.dataset.contrast=String(p.contrast);html.style.setProperty('--ui-scale',p.scale);window.dispatchEvent(new Event('th-preferences-change'));return p;}
window.THApplyPreferences=apply;apply(C.storage.get('th-preferences',null));window.addEventListener('storage',e=>{if(e.key==='th-preferences'||e.key===null)apply(C.storage.get('th-preferences',null));});
})();
