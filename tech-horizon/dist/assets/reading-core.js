(function(root){
'use strict';
const C=typeof module==='object'&&module.exports?require('./core.js'):root.THCore;
const tabs=['saved','reading','completed','notes','all'],sorts=['recent','title','shortest','remaining'];
function options(data,value={}){
 const read=key=>typeof value.get==='function'?value.get(key):value[key];
 return {tab:tabs.includes(read('tab'))?read('tab'):'saved',category:data.categories.some(c=>c.id===read('category'))?read('category'):'all',sort:sorts.includes(read('sort'))?read('sort'):'recent',query:String(read('query')||'').slice(0,100)};
}
function collection(data,saved=[],progress={},value={}){
 const state=options(data,value),stored=new Set(saved),words=C.normalize(state.query).split(/\s+/).filter(Boolean),rows=[];
 const counts={saved:0,reading:0,completed:0,notes:0,all:0};
 for(const article of data.articles){
  const p=progress[article.id]||{},percent=Number.isFinite(p.percent)?Math.max(0,Math.min(100,p.percent)):0,note=typeof p.note==='string'?p.note:'',flags={saved:stored.has(article.id),reading:percent>0&&percent<95,completed:percent>=95,notes:!!note.trim()};
  flags.all=flags.saved||percent>0||flags.notes;for(const key of tabs)if(flags[key])counts[key]++;
  if(!flags[state.tab]||(state.category!=='all'&&article.category!==state.category))continue;
  const text=C.normalize([article.title,article.excerpt,article.takeaway,note,...(article.sections||[]).map(s=>s.heading)].join(' '));if(!words.every(word=>text.includes(word)))continue;
  rows.push({article,percent,note,updated:p.updated||'',saved:flags.saved,remaining:percent>=95?0:Math.max(1,Math.ceil(article.minutes*(1-percent/100)))});
 }
 const recent=(a,b)=>(Date.parse(b.updated)||0)-(Date.parse(a.updated)||0)||b.article.date.localeCompare(a.article.date)||a.article.title.localeCompare(b.article.title,'vi');
 rows.sort(state.sort==='title'?(a,b)=>a.article.title.localeCompare(b.article.title,'vi'):state.sort==='shortest'?(a,b)=>a.article.minutes-b.article.minutes||recent(a,b):state.sort==='remaining'?(a,b)=>a.remaining-b.remaining||recent(a,b):recent);
 return {state,counts,rows,total:counts[state.tab],remaining:rows.reduce((n,row)=>n+row.remaining,0),notes:rows.filter(row=>row.note.trim()).length};
}
function notesText(rows,config={}){
 const site=(C.url(config.siteUrl)||'').replace(/\/$/,''),notes=rows.filter(row=>row.note.trim());
 return (config.name||'Tech Horizon')+' — GHI CHÚ CỦA TÔI\n'+notes.length+' ghi chú trong danh sách đang xem. Lưu tệp ở nơi riêng tư.\n\n'+notes.map(row=>row.article.title+'\n'+(site?site+'/':'')+'bai-viet/'+row.article.id+'.html\n\n'+row.note.trim()).join('\n\n────────────────────────\n\n')+'\n';
}
const api={options,collection,notesText};if(typeof module==='object'&&module.exports)module.exports=api;else root.THReading=api;
})(typeof window!=='undefined'?window:globalThis);
