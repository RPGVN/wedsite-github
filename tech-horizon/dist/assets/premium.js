(function(){
'use strict';
const C=window.THCore;if(!C||!window.TECH_HORIZON)return;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],E=C.escape;
const draft=C.storage.get('th-draft',null),preview=C.storage.get('th-preview',false)&&draft&&C.validate(draft).length===0;
const D=preview?draft:window.TECH_HORIZON,A=D.articles,base=document.body.dataset.base||'',page=document.body.dataset.page||'',params=new URLSearchParams(location.search);
const routes=new Set(window.TH_STATIC_ROUTES||[]),ids=new Set(A.map(a=>a.id));
const articleUrl=a=>routes.has(a.id)?base+'bai-viet/'+a.id+'.html':base+'doc-bai.html?id='+encodeURIComponent(a.id);
const category=a=>D.categories.find(c=>c.id===a.category)?.short||'Cẩm nang';
const image=a=>base+'assets/'+a.image+'.svg';
const rawSaved=C.storage.get('th-saved',[]);
let saved=Array.isArray(rawSaved)?rawSaved.filter(id=>ids.has(id)):[],progress={};
try{progress=C.readerBackup({type:'tech-horizon-reader',version:1,saved:[],progress:C.storage.get('th-progress',{})},[...ids]).progress;}catch{}
let timer;function toast(message){const box=$('#toast');if(!box)return;box.textContent=message;box.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>box.classList.remove('visible'),4000);}
function info(title,html){const dialog=$('#info-dialog');if(!dialog)return;$('#info-title').textContent=title;$('#info-content').innerHTML=html;if(!dialog.open)dialog.showModal();}
function commitProgress(next){if(!C.storage.set('th-progress',next))return false;progress=next;updateJourneyProgress();return true;}
function download(name,content,type='application/json;charset=utf-8'){const blob=content instanceof Blob?content:new Blob([content],{type}),link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),10000);}
function date(value){return new Date(value).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});}
function resumeUrl(a){const path=articleUrl(a);return path+(path.includes('?')?'&':'?')+'resume=1';}
function updateJourneyProgress(){
 for(const j of D.journeys||[]){const done=j.articles.filter(id=>(progress[id]?.percent||0)>=95).length,total=j.articles.length;
  $$('[data-journey-progress="'+j.id+'"]').forEach(el=>{const span=$('span',el);if(span)span.style.width=(total?done/total*100:0)+'%';});
  $$('[data-journey-text="'+j.id+'"]').forEach(el=>el.textContent=done===total?'Đã hoàn thành lộ trình trên thiết bị này':done+' / '+total+' cẩm nang đã đọc xong');
  $$('[data-journey-start="'+j.id+'"]').forEach(link=>{const next=A.find(a=>a.id===(j.articles.find(id=>(progress[id]?.percent||0)<95)||j.articles[0]));if(next){link.href=articleUrl(next);const text=link.firstChild;if(text?.nodeType===3)text.nodeValue=done===total?'Đọc lại lộ trình ':done?'Tiếp tục lộ trình ':'Bắt đầu lộ trình ';}});
 }
 $$('[data-journey-article]').forEach(link=>link.classList.toggle('completed',(progress[link.dataset.journeyArticle]?.percent||0)>=95));
}
updateJourneyProgress();
if(page==='home'){
 const current=Object.entries(progress).filter(([id,p])=>ids.has(id)&&p.percent>0&&p.percent<95).sort((a,b)=>b[1].updated.localeCompare(a[1].updated))[0];
 const box=$('#continue-reading');if(box&&current){const a=A.find(a=>a.id===current[0]),p=current[1];box.hidden=false;box.innerHTML='<div><span class="eyebrow">TIẾP TỤC GÓC ĐỌC CỦA BẠN</span><strong>'+E(a.title)+'</strong></div><small>'+p.percent+'% đã đọc</small><div class="mini-progress"><span style="width:'+p.percent+'%"></span></div><a class="button button-outline" href="'+E(resumeUrl(a))+'">Đọc tiếp ↗</a>';}
}
if(page==='category'){
 const input=$('#category-query'),cards=$$('[data-article-id]',$('#category-page-grid'));
 input?.addEventListener('input',()=>{const matching=new Set(C.filter(A,{category:document.body.dataset.category,query:input.value}).map(a=>a.id));cards.forEach(c=>c.hidden=!matching.has(c.dataset.articleId));$('#category-count').textContent=matching.size+' kết quả';$('#category-empty').hidden=matching.size>0;});
}
if(page==='glossary'){
 const query=$('#term-query'),select=$('#term-category'),terms=D.glossary||[];
 if(params.get('q'))query.value=params.get('q').slice(0,100);
 function render(){const text=C.normalize(query.value),cat=select.value;let count=0;for(const t of terms){const element=$('[data-term="'+t.id+'"]');if(!element)continue;const match=(cat==='all'||t.category===cat)&&C.normalize(t.term+' '+t.definition).includes(text);element.hidden=!match;if(match)count++;}$('#term-count').textContent=count+' thuật ngữ';$('#term-empty').hidden=count>0;}
 query.addEventListener('input',render);select.addEventListener('change',render);render();
}
let libraryTab='saved';
function renderLibrary(){
 if(page!=='library')return;
 const known=Object.entries(progress).filter(([id])=>ids.has(id));
 const reading=known.filter(([,p])=>p.percent>0&&p.percent<95),done=known.filter(([,p])=>p.percent>=95),notes=known.filter(([,p])=>p.note?.trim());
 $('#library-saved-count').textContent=saved.length;$('#library-progress-count').textContent=reading.length;$('#library-completed-count').textContent=done.length;$('#library-notes-count').textContent=notes.length;
 const selected=libraryTab==='saved'?saved:libraryTab==='reading'?reading.map(([id])=>id):libraryTab==='completed'?done.map(([id])=>id):notes.map(([id])=>id);
 const list=selected.map(id=>A.find(a=>a.id===id)).filter(Boolean).sort((a,b)=>(progress[b.id]?.updated||'').localeCompare(progress[a.id]?.updated||''));
 $('#library-empty').hidden=list.length>0;
 $('#library-results').innerHTML=list.map(a=>{const p=progress[a.id]||{percent:0,note:''};return '<article class="library-row"><img src="'+image(a)+'" alt="" width="145" height="95"><div class="library-row-content"><span class="tag tag-'+E(a.category)+'">'+E(category(a))+'</span><h2><a href="'+E(articleUrl(a))+'">'+E(a.title)+'</a></h2><div class="mini-progress"><span style="width:'+p.percent+'%"></span></div><p class="reading-meta">'+(p.percent>=95?'Đã đọc xong':p.percent>0?p.percent+'% đã đọc':a.minutes+' phút đọc')+(p.updated?' · '+date(p.updated):'')+'</p>'+(libraryTab==='notes'&&p.note?'<p class="library-note">'+E(p.note)+'</p>':'')+'</div><div class="library-row-actions"><a class="button button-outline" href="'+E(p.percent>0&&p.percent<95?resumeUrl(a):articleUrl(a))+'">'+(p.percent>0&&p.percent<95?'Đọc tiếp':'Mở cẩm nang')+' ↗</a><button class="text-button" data-library-remove="'+a.id+'">'+(libraryTab==='saved'?'Bỏ lưu':libraryTab==='notes'?'Xóa ghi chú':'Xóa tiến độ')+'</button></div></article>';}).join('');
 $$('[data-library-tab]').forEach(button=>{const active=button.dataset.libraryTab===libraryTab;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
}
if(page==='library'){
 renderLibrary();
 $$('[data-library-tab]').forEach(button=>button.addEventListener('click',()=>{libraryTab=button.dataset.libraryTab;renderLibrary();}));
 $('#library-results').addEventListener('click',e=>{const button=e.target.closest('[data-library-remove]');if(!button)return;const id=button.dataset.libraryRemove;
  if(libraryTab==='saved'){const next=saved.filter(x=>x!==id);if(!C.storage.set('th-saved',next)){toast('Chưa cập nhật được dữ liệu trình duyệt.');return;}saved=next;renderLibrary();toast('Đã bỏ lưu cẩm nang.');}
  else {info(libraryTab==='notes'?'Xóa ghi chú':'Xóa tiến độ','<p>'+(libraryTab==='notes'?'Xóa ghi chú cá nhân của bài này khỏi trình duyệt?':'Đặt lại tiến độ đọc của bài này trên trình duyệt? Ghi chú của bạn được giữ lại.')+'</p><button class="button button-outline" id="confirm-library-remove">Xác nhận xóa</button>');$('#confirm-library-remove').addEventListener('click',()=>{const next={...progress};if(libraryTab==='notes')next[id]={...next[id],note:''};else if(next[id]?.note)next[id]={...next[id],percent:0};else delete next[id];if(commitProgress(next)){renderLibrary();$('#info-dialog').close();toast('Đã cập nhật thư viện.');}else toast('Chưa cập nhật được dữ liệu trình duyệt.');});}
 });
 $('#export-reader').addEventListener('click',()=>{const data={type:'tech-horizon-reader',version:1,exported:new Date().toISOString(),saved,progress};download('Tech_Horizon_Thu_Vien_'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(data,null,2));$('#library-status').textContent='Đã tạo bản sao lưu. Tệp có thể chứa ghi chú riêng của bạn.';});
 $('#import-reader').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{
   if(file.size>2*1024*1024)throw Error('Tệp cần nhỏ hơn 2 MB.');const imported=C.readerBackup(JSON.parse(await file.text()),[...ids]);
   info('Khôi phục thư viện','<h3>Mang theo góc đọc của bạn.</h3><p>Bản sao lưu chứa '+imported.saved.length+' bài đã lưu và '+Object.keys(imported.progress).length+' mục tiến độ hoặc ghi chú còn phù hợp với website này. Thay thế dữ liệu thư viện hiện tại trên trình duyệt? Hãy xuất bản sao lưu hiện tại nếu bạn muốn giữ lại.</p><button class="button button-blue" id="confirm-reader-import">Thay thế và khôi phục</button>');
   $('#confirm-reader-import').addEventListener('click',()=>{const before=saved;if(!C.storage.set('th-saved',imported.saved)){toast('Trình duyệt đang chặn lưu dữ liệu.');return;}if(!commitProgress(imported.progress)){C.storage.set('th-saved',before);toast('Chưa khôi phục được. Dữ liệu cũ được giữ lại.');return;}saved=imported.saved;renderLibrary();$('#info-dialog').close();toast('Đã khôi phục thư viện trên thiết bị này.');});
  }catch(error){toast('Không thể khôi phục: '+error.message);}finally{e.target.value='';}});
 $('#clear-reading-history').addEventListener('click',()=>{info('Xóa tiến độ và ghi chú','<p>Xóa mọi tiến độ đọc và ghi chú Tech Horizon trên trình duyệt này? Bài đã lưu được giữ lại. Thao tác không thay đổi tệp sao lưu bạn đã tải.</p><button class="button button-outline" id="confirm-reading-clear">Xóa tiến độ và ghi chú</button>');$('#confirm-reading-clear').addEventListener('click',()=>{if(C.storage.remove('th-progress')){progress={};renderLibrary();$('#info-dialog').close();toast('Đã xóa tiến độ và ghi chú.');}else toast('Chưa xóa được dữ liệu.');});});
}
const articleId=page==='article'?document.body.dataset.article:page==='dynamic-article'?params.get('id'):null;
const current=A.find(a=>a.id===articleId);
if(current){
 if(!$('#reader-note')){
  const cover=$('.article-cover');if(cover)cover.insertAdjacentHTML('beforebegin','<div class="reader-tools"><div><button class="reader-control" data-font="smaller">A−</button><button class="reader-control" data-font="larger">A+</button></div><div><button class="reader-control" id="focus-reading" aria-pressed="false">Chế độ tập trung</button><button class="reader-control" id="speak-article" aria-pressed="false">Nghe bài</button><button class="reader-control" id="print-article">In / PDF</button></div></div>');
  const related=$('.related-section');if(related)related.insertAdjacentHTML('beforebegin','<section class="reader-notebook"><div><span class="eyebrow">GÓC ĐỌC CỦA RIÊNG BẠN</span><h2>Ghi lại một điều.</h2><p>Ghi chú nằm trên trình duyệt này. Sao lưu từ Thư viện cá nhân.</p></div><div><label for="reader-note">Ghi chú của bạn</label><textarea id="reader-note" maxlength="3000" rows="5"></textarea><div class="notebook-actions"><button class="button button-outline" id="save-reader-note">Lưu ghi chú</button><button class="text-button" id="mark-read">Đánh dấu đã đọc ✓</button></div><p id="note-status" role="status"></p></div></section>');
 }
 let font=C.storage.get('th-reader-size',17);if(!Number.isFinite(font)||font<14||font>23)font=17;
 document.documentElement.style.setProperty('--reader-size',font+'px');
 $$('[data-font]').forEach(button=>button.addEventListener('click',()=>{font=Math.max(14,Math.min(23,font+(button.dataset.font==='larger'?1:-1)));document.documentElement.style.setProperty('--reader-size',font+'px');C.storage.set('th-reader-size',font);toast('Cỡ chữ '+font+' px');}));
 $('#focus-reading')?.addEventListener('click',e=>{const active=document.body.classList.toggle('focus-reading');e.currentTarget.setAttribute('aria-pressed',String(active));e.currentTarget.textContent=active?'Thoát tập trung':'Chế độ tập trung';});
 $('#print-article')?.addEventListener('click',()=>window.print());
 const note=$('#reader-note'),noteStatus=$('#note-status');if(note)note.value=progress[current.id]?.note||'';
 if((progress[current.id]?.percent||0)>=95&&$('#mark-read'))$('#mark-read').textContent='Đã đọc xong ✓';
 let noteTimer;function saveNote(){if(!note)return;const record=progress[current.id]||{percent:0,updated:new Date().toISOString(),note:''};if(commitProgress({...progress,[current.id]:{...record,note:note.value,updated:new Date().toISOString()}})){if(noteStatus)noteStatus.textContent='Đã lưu ghi chú trên trình duyệt này.';}else if(noteStatus)noteStatus.textContent='Trình duyệt đang chặn lưu. Hãy sao chép ghi chú trước khi rời trang.';}
 note?.addEventListener('input',()=>{clearTimeout(noteTimer);if(noteStatus)noteStatus.textContent='Đang lưu…';noteTimer=setTimeout(saveNote,900);});
 $('#save-reader-note')?.addEventListener('click',()=>{clearTimeout(noteTimer);saveNote();});
 $('#mark-read')?.addEventListener('click',()=>{const prior=progress[current.id]||{};if(commitProgress({...progress,[current.id]:{percent:100,updated:new Date().toISOString(),note:note?.value||prior.note||''}})){$('#mark-read').textContent='Đã đọc xong ✓';toast('Đã đánh dấu đọc xong cẩm nang.');}else toast('Chưa lưu được tiến độ đọc.');});
 let lastSave=0;function track(force=false){const body=$('#article-body');if(!body)return;const top=scrollY+body.getBoundingClientRect().top-115,height=Math.max(1,body.offsetHeight-innerHeight*.55);const value=Math.max(0,Math.min(100,Math.round((scrollY-top)/height*100)));if(!force&&Date.now()-lastSave<1600)return;const previous=progress[current.id]||{percent:0,note:''};if(value<=previous.percent)return;lastSave=Date.now();commitProgress({...progress,[current.id]:{percent:value>=95?100:value,updated:new Date().toISOString(),note:note?.value||previous.note||''}});}
 window.addEventListener('scroll',()=>track(),{passive:true});
 window.addEventListener('pagehide',()=>{clearTimeout(noteTimer);if(note&&note.value!==(progress[current.id]?.note||''))saveNote();track(true);});
 if(params.get('resume')==='1'&&(progress[current.id]?.percent||0)>0){window.addEventListener('load',()=>{const body=$('#article-body');if(!body)return;const top=scrollY+body.getBoundingClientRect().top-115,height=Math.max(1,body.offsetHeight-innerHeight*.55);window.scrollTo({top:Math.max(0,top+height*Math.min(94,progress[current.id].percent)/100),behavior:'instant'});},{once:true});}
 const speak=$('#speak-article');let speaking=false,queue=[],activeUtterance;
 function stopSpeech(){if('speechSynthesis' in window)speechSynthesis.cancel();speaking=false;queue=[];if(speak){speak.textContent='Nghe bài';speak.setAttribute('aria-pressed','false');}}
 if(speak){if(!('speechSynthesis' in window)){speak.disabled=true;speak.title='Trình duyệt chưa hỗ trợ giọng đọc.';}else speak.addEventListener('click',()=>{
   if(speaking){stopSpeech();return;}const voice=speechSynthesis.getVoices().find(v=>/^vi(?:-|_)/i.test(v.lang)||v.lang==='vi');
   if(!voice){info('Giọng đọc tiếng Việt','<p>Trình duyệt chưa cung cấp giọng đọc tiếng Việt. Tính năng cần giọng đọc có sẵn trên thiết bị; website không tự tạo hoặc tải giọng từ một dịch vụ khác.</p>');return;}
   const text=[current.title,current.takeaway,...current.sections.flatMap(s=>[s.heading,s.text])];queue=text.flatMap(p=>p.match(/[^.!?]{1,350}(?:[.!?]|$)|.{1,350}/g)||[]);speaking=true;speak.textContent='Dừng nghe';speak.setAttribute('aria-pressed','true');
   function next(){if(!speaking||!queue.length){stopSpeech();return;}activeUtterance=new SpeechSynthesisUtterance(queue.shift());activeUtterance.voice=voice;activeUtterance.lang='vi-VN';activeUtterance.rate=.95;activeUtterance.onend=next;activeUtterance.onerror=()=>{stopSpeech();toast('Giọng đọc bị gián đoạn trên thiết bị.');};speechSynthesis.speak(activeUtterance);}next();
  });}
 window.addEventListener('pagehide',stopSpeech);
}
window.addEventListener('storage',e=>{if(['th-saved','th-progress'].includes(e.key)){const s=C.storage.get('th-saved',[]);saved=Array.isArray(s)?s.filter(id=>ids.has(id)):[];try{progress=C.readerBackup({type:'tech-horizon-reader',version:1,saved:[],progress:C.storage.get('th-progress',{})},[...ids]).progress;}catch{progress={};}updateJourneyProgress();renderLibrary();}});
})();
