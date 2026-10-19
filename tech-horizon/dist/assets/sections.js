(function(){
'use strict';
const C=window.THCore,M=window.THEditorial;if(!C||!M||!window.TECH_HORIZON)return;
const $=s=>document.querySelector(s),draft=C.storage.get('th-draft',null),D=C.storage.get('th-preview',false)&&draft&&!C.validate(draft).length?draft:window.TECH_HORIZON;
const page=document.body.dataset.page,params=new URLSearchParams(location.search),knownCategory=value=>D.categories.some(c=>c.id===value)?value:'all';
function publicUrl(values,clearHash=false){try{const url=new URL(location.href);for(const [key,value,empty]of values){if(value===empty)url.searchParams.delete(key);else url.searchParams.set(key,value);}if(clearHash)url.hash='';history.replaceState(null,'',url);}catch{}}
if(page==='glossary'){
 const query=$('#term-query'),category=$('#term-category'),sort=$('#term-sort'),grid=$('#terms-grid');if(!query||!category||!sort||!grid)return;
 query.value=(params.get('q')||'').slice(0,100);category.value=knownCategory(params.get('category'));sort.value=params.get('sort')==='az'?'az':'original';
 const cards=new Map((D.glossary||[]).map(t=>[t.id,document.querySelector('[data-term="'+t.id+'"]')]));
 function render(update=true){const list=M.glossaryEntries(D,C,{query:query.value,category:category.value,sort:sort.value}),visible=new Set(list.map(t=>t.id));for(const [id,card]of cards)if(card)card.hidden=!visible.has(id);for(const term of list){const card=cards.get(term.id);if(card)grid.appendChild(card);}$('#term-count').textContent=list.length+' / '+(D.glossary||[]).length+' thuật ngữ';$('#term-empty').hidden=list.length>0;if(update)publicUrl([['q',query.value,''],['category',category.value,'all'],['sort',sort.value,'original']],true);}
 function reset(){query.value='';category.value='all';sort.value='original';render();query.focus();}
 function revealHash(){let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const card=cards.get(id);if(!card)return;for(const item of cards.values())item?.classList.remove('term-selected');if(card.hidden){query.value='';category.value='all';render(false);publicUrl([['q','',''],['category','all','all']]);card.scrollIntoView({block:'start'});}card.classList.add('term-selected');}
 query.addEventListener('input',()=>render());category.addEventListener('change',()=>render());sort.addEventListener('change',()=>render());$('#term-reset').addEventListener('click',reset);$('#term-reset-empty').addEventListener('click',reset);window.addEventListener('hashchange',revealHash);render(false);revealHash();
}
if(page==='journeys'){
 const query=$('#journey-query'),category=$('#journey-category'),minutes=$('#journey-minutes'),state=$('#journey-state');if(!query||!category||!minutes||!state)return;
 category.innerHTML='<option value="all">Mọi chủ đề</option>'+D.categories.map(c=>'<option value="'+C.escape(c.id)+'">'+C.escape(c.name)+'</option>').join('');
 let progress={},blocked=false;
 function readProgress(){try{const raw=localStorage.getItem('th-progress');progress=C.readerBackup({type:'tech-horizon-reader',version:1,saved:[],progress:raw?JSON.parse(raw):{}},D.articles.map(a=>a.id)).progress;blocked=false;}catch{progress={};blocked=true;}state.disabled=blocked;if(blocked)state.value='all';}
 query.value=(params.get('q')||'').slice(0,100);category.value=knownCategory(params.get('category'));minutes.value=['15','30','60'].includes(params.get('minutes'))?params.get('minutes'):'0';
 // A local reading-state filter is never written into a public share URL.
 function render(update=true){const rows=M.journeyEntries(D,C,{query:query.value,category:category.value,minutes:minutes.value,state:state.value},progress),visible=new Set(rows.map(r=>r.journey.id));for(const journey of D.journeys||[]){const card=document.getElementById(journey.id);if(card)card.hidden=!visible.has(journey.id);}$('#journey-count').textContent=rows.length+' / '+(D.journeys||[]).length+' lộ trình · Phút đọc chưa gồm thời gian thực hành.'+(blocked?' Chưa đọc được tiến độ; giữ dữ liệu thô trong Dữ liệu & hiển thị trước khi khôi phục.':'');$('#journey-empty').hidden=rows.length>0;if(update)publicUrl([['q',query.value,''],['category',category.value,'all'],['minutes',minutes.value,'0']],true);}
 function reset(){query.value='';category.value='all';minutes.value='0';state.value='all';render();query.focus();}
 function revealHash(){let id='';try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const journey=(D.journeys||[]).find(j=>j.id===id),card=journey?document.getElementById(id):null;if(card?.hidden){query.value='';category.value='all';minutes.value='0';state.value='all';render(false);publicUrl([['q','',''],['category','all','all'],['minutes','0','0']]);card.scrollIntoView({block:'start'});}}
 readProgress();query.addEventListener('input',()=>render());for(const field of [category,minutes,state])field.addEventListener('change',()=>render());$('#journey-form').addEventListener('submit',e=>{e.preventDefault();render();});$('#journey-reset').addEventListener('click',reset);$('#journey-reset-empty').addEventListener('click',reset);window.addEventListener('storage',e=>{if(e.key==='th-progress'||e.key===null){readProgress();render(false);}});window.addEventListener('hashchange',revealHash);render(false);revealHash();
}
})();
