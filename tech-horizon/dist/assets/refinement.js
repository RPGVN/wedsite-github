(function(){
'use strict';
const C=window.THCore,M=window.THExperienceMarkup;if(!C||!M||!window.TECH_HORIZON)return;
const $=s=>document.querySelector(s),draft=C.storage.get('th-draft',null),D=C.storage.get('th-preview',false)&&draft&&!C.validate(draft).length?draft:window.TECH_HORIZON;
if(document.body.dataset.page==='catalog'){
 const routes=new Set(window.TH_STATIC_ROUTES||[]),url=a=>routes.has(a.id)?'bai-viet/'+a.id+'.html':'doc-bai.html?id='+encodeURIComponent(a.id),params=new URLSearchParams(location.search),query=$('#catalog-query'),category=$('#catalog-category'),sort=$('#catalog-sort');
 query.value=(params.get('q')||'').slice(0,100);category.value=D.categories.some(c=>c.id===params.get('category'))?params.get('category'):'all';sort.value=['newest','oldest','shortest'].includes(params.get('sort'))?params.get('sort'):'newest';
 function render(updateUrl=true){const list=C.filter(D.articles,{query:query.value,category:category.value,sort:sort.value});$('#catalog-grid').innerHTML=list.map(a=>M.catalogCard(a,D,C,url(a))).join('');const raw=C.storage.get('th-saved',[]),saved=Array.isArray(raw)?raw:[];document.querySelectorAll('#catalog-grid [data-save]').forEach(b=>{const on=saved.includes(b.dataset.save);b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',(on?'Bỏ lưu bài: ':'Lưu bài: ')+(D.articles.find(a=>a.id===b.dataset.save)?.title||''));});$('#catalog-status').textContent=list.length+' / '+D.articles.length+' cẩm nang'+(query.value?' cho “'+query.value+'”':'');$('#catalog-empty').hidden=list.length>0;if(updateUrl)try{const u=new URL(location.href);for(const[k,v,empty]of [['q',query.value,''],['category',category.value,'all'],['sort',sort.value,'newest']]){if(v===empty)u.searchParams.delete(k);else u.searchParams.set(k,v);}history.replaceState(null,'',u);}catch{}}
 function reset(){query.value='';category.value='all';sort.value='newest';render();query.focus();}
 $('#catalog-form').addEventListener('submit',e=>{e.preventDefault();render();});query.addEventListener('input',()=>render());category.addEventListener('change',()=>render());sort.addEventListener('change',()=>render());$('#catalog-reset').addEventListener('click',reset);$('#catalog-show-all').addEventListener('click',reset);window.addEventListener('storage',e=>{if(e.key==='th-saved')render(false);});render(false);
}
})();
