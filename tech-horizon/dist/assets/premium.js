(function(){
'use strict';
const C=window.THCore;if(!C||!window.TECH_HORIZON)return;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],E=C.escape;
const draft=C.storage.get('th-draft',null),preview=C.storage.get('th-preview',false)&&draft&&C.validate(draft).length===0;
const D=preview?draft:window.TECH_HORIZON,A=D.articles,base=document.body.dataset.base||'',page=document.body.dataset.page||'',params=new URLSearchParams(location.search);
const routes=new Set(window.TH_STATIC_ROUTES||[]),ids=new Set(A.map(a=>a.id));
const articleUrl=a=>routes.has(a.id)?base+'bai-viet/'+a.id+'.html':base+'doc-bai.html?id='+encodeURIComponent(a.id);
const category=a=>D.categories.find(c=>c.id===a.category)?.short||'Cẩm nang';
const image=a=>C.image(a.customImage,250000)||base+'assets/'+a.image+'.svg';
if(preview&&window.THEditorial){
 const M=window.THEditorial;
 if(page==='glossary'){const grid=$('#terms-grid');if(grid)grid.innerHTML=M.terms(D,C);const select=$('#term-category');if(select)select.innerHTML='<option value="all">Mọi chủ đề</option>'+D.categories.map(c=>'<option value="'+E(c.id)+'">'+E(c.name)+'</option>').join('');if($('.page-count'))$('.page-count').textContent=(D.glossary||[]).length+' thuật ngữ';}
 if(page==='journeys'||page==='home'){const grid=page==='journeys'?$('.all-journeys'):$('#lo-trinh .journey-grid'),list=page==='journeys'?D.journeys||[]:(D.journeys||[]).slice(0,2);if(grid)grid.innerHTML=list.map((j,i)=>M.journeyCard(j,i,D,C,base,articleUrl)).join('');if(page==='journeys'&&$('.page-count'))$('.page-count').textContent=list.length+' lộ trình · '+D.articles.length+' cẩm nang';if(page==='home'&&$('#lo-trinh'))$('#lo-trinh').hidden=!list.length;}
}
let saved=[],savedBlocked=false,progress={},readerRaw=null,readerBlocked=false;
try{saved=C.savedList(localStorage.getItem('th-saved')).filter(id=>ids.has(id));}catch{savedBlocked=true;}
try{readerRaw=localStorage.getItem('th-progress');progress=C.readerBackup({type:'tech-horizon-reader',version:1,saved:[],progress:readerRaw?JSON.parse(readerRaw):{}},[...ids]).progress;}catch{readerBlocked=true;}
let timer;function toast(message){const box=$('#toast');if(!box)return;box.textContent=message;box.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>box.classList.remove('visible'),4000);}
function info(title,html){const dialog=$('#info-dialog');if(!dialog)return;$('#info-title').textContent=title;$('#info-content').innerHTML=html;if(!dialog.open)dialog.showModal();}
function libraryWarning(text){const box=$('#library-warning');if(box){box.hidden=false;$('#library-warning-text').textContent=text;}}
function readerWarning(text){readerBlocked=true;const status=$('#note-status');if(status)status.textContent=text+' Tải ghi chú TXT trước khi tải lại trang.';libraryWarning(text);}
function commitProgress(next,expected=readerRaw){if(readerBlocked){readerWarning('Chưa lưu được vì dữ liệu đã thay đổi hoặc bộ nhớ chưa đọc được.');return false;}try{readerRaw=C.guardedSet(localStorage,'th-progress',next,expected);progress=next;updateJourneyProgress();return true;}catch(err){readerWarning(err.message);return false;}}
function readingOffset(){return ($('.site-header')?.getBoundingClientRect().height||84)+20;}
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
const L=window.THReading;
let libraryState=L?L.options(D,{tab:params.get('tab'),category:params.get('category'),sort:params.get('sort')}):{tab:'saved',category:'all',sort:'recent',query:''},libraryView;
function renderLibrary(){
 if(page!=='library'||!L)return;
 const focused=document.activeElement,focusId=focused?.closest('#library-results')?(focused.dataset.save||focused.dataset.libraryNote||focused.dataset.libraryRemove):null;
 libraryView=L.collection(D,saved,progress,libraryState);
 for(const [id,key] of [['saved','saved'],['progress','reading'],['completed','completed'],['notes','notes']])$('#library-'+id+'-count').textContent=libraryView.counts[key];
 $('#library-all-count').textContent=libraryView.counts.all;
 const rows=libraryView.rows;
 $('#library-filter-status').textContent=rows.length+' / '+libraryView.total+' cẩm nang'+(libraryState.query?' khớp từ khóa':'')+' · khoảng '+libraryView.remaining+' phút đọc còn lại';
 $('#library-export-notes').disabled=!libraryView.notes;
 $('#library-results').innerHTML=rows.map(({article:a,percent,note,updated,saved:isSaved,remaining})=>'<article class="library-row"><img src="'+image(a)+'" alt="" width="145" height="95" loading="lazy"><div class="library-row-content"><div class="library-row-labels"><span class="tag tag-'+E(a.category)+'">'+E(category(a))+'</span>'+(isSaved?'<span class="library-saved-label">Đã lưu ✓</span>':'')+'</div><h2><a href="'+E(articleUrl(a))+'">'+E(a.title)+'</a></h2><div class="mini-progress" role="progressbar" aria-label="Tiến độ '+E(a.title)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+percent+'"><span style="width:'+percent+'%"></span></div><p class="reading-meta">'+(percent>=95?'Đã đọc xong':percent>0?percent+'% đã đọc · còn khoảng '+remaining+' phút':a.minutes+' phút đọc')+(updated?' · '+date(updated):'')+'</p>'+(note.trim()?'<details class="library-note-details"'+(libraryState.tab==='notes'?' open':'')+'><summary>Ghi chú của tôi</summary><p class="library-note">'+E(note)+'</p><button type="button" class="text-button" data-library-note="'+a.id+'">Tải ghi chú này TXT ↗</button></details>':'')+'</div><div class="library-row-actions"><a class="button button-outline" href="'+E(percent>0&&percent<95?resumeUrl(a):articleUrl(a))+'">'+(percent>0&&percent<95?'Đọc tiếp':percent>=95?'Đọc lại':'Mở cẩm nang')+' ↗</a><button class="text-button" data-save="'+a.id+'" aria-pressed="'+isSaved+'" aria-label="'+(isSaved?'Bỏ lưu bài: ':'Lưu bài: ')+E(a.title)+'">'+(isSaved?'Bỏ lưu':'Lưu bài')+'</button>'+(['notes','reading','completed'].includes(libraryState.tab)?'<button class="text-button library-remove" data-library-remove="'+a.id+'">'+(libraryState.tab==='notes'?'Xóa ghi chú':'Đặt lại tiến độ')+'</button>':'')+'</div></article>').join('');
 $('#library-empty').hidden=rows.length>0;
 const filtered=!!libraryState.query||libraryState.category!=='all';
 $('#library-empty-title').textContent=filtered?'Chưa tìm thấy trong góc đọc này.':'Góc đọc này đang chờ bạn.';
 $('#library-empty-description').textContent=filtered?'Thử từ khóa ngắn hơn, chọn mọi chuyên mục hoặc bỏ bộ lọc.':'Lưu một cẩm nang, đọc bài hoặc ghi lại điều bạn muốn nhớ. Mọi thứ sẽ xuất hiện ở đây.';
 $('#library-reset-empty').hidden=!filtered;
 $$('[data-library-tab]').forEach(button=>{const active=button.dataset.libraryTab===libraryState.tab;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 const latest=L.collection(D,saved,progress,{tab:'reading',sort:'recent'}).rows[0],resume=$('#library-resume');resume.hidden=!latest;
 if(latest){$('#library-resume-title').textContent=latest.article.title;$('#library-resume-detail').textContent=latest.percent+'% đã đọc · còn khoảng '+latest.remaining+' phút';$('#library-resume-link').href=resumeUrl(latest.article);}
 if(focusId){const next=$$('[data-save],[data-library-note],[data-library-remove]',$('#library-results')).find(button=>[button.dataset.save,button.dataset.libraryNote,button.dataset.libraryRemove].includes(focusId));(next||$('#library-filter-status')).focus();}
}
if(page==='library'&&L){
 const query=$('#library-query'),categorySelect=$('#library-category'),sort=$('#library-sort');categorySelect.value=libraryState.category;sort.value=libraryState.sort;
 function controls(){libraryState={...libraryState,query:query.value,category:categorySelect.value,sort:sort.value};renderLibrary();}
 function reset(){query.value='';categorySelect.value='all';sort.value='recent';controls();query.focus();}
 query.addEventListener('input',controls);categorySelect.addEventListener('change',controls);sort.addEventListener('change',controls);$('#library-filter-form').addEventListener('submit',e=>{e.preventDefault();controls();});$('#library-reset').addEventListener('click',reset);$('#library-reset-empty').addEventListener('click',reset);
 $$('[data-library-tab]').forEach(button=>button.addEventListener('click',()=>{libraryState.tab=button.dataset.libraryTab;renderLibrary();}));
 $('#library-results').addEventListener('click',e=>{
  const note=e.target.closest('[data-library-note]');if(note){const row=libraryView.rows.find(row=>row.article.id===note.dataset.libraryNote);if(row)download('Tech_Horizon_Ghi_Chu_'+row.article.id+'.txt',L.notesText([row],D.config),'text/plain;charset=utf-8');return;}
  const button=e.target.closest('[data-library-remove]');if(!button)return;const id=button.dataset.libraryRemove,kind=libraryState.tab,expected=readerRaw;
  info(kind==='notes'?'Xóa ghi chú':'Đặt lại tiến độ','<p>'+(kind==='notes'?'Xóa ghi chú cá nhân của bài này trên trình duyệt?':'Đặt lại tiến độ đọc bài này? Ghi chú và trạng thái lưu bài được giữ lại.')+'</p><button class="button button-outline" id="confirm-library-remove">Xác nhận</button>');
  $('#confirm-library-remove').addEventListener('click',()=>{const next={...progress},prior=next[id];if(!prior){$('#info-dialog').close();return;}if(kind==='notes')next[id]={...prior,note:'',updated:new Date().toISOString()};else if(prior.note)next[id]={...prior,percent:0,updated:new Date().toISOString()};else delete next[id];if(commitProgress(next,expected)){renderLibrary();$('#info-dialog').close();toast('Đã cập nhật góc đọc.');}else toast('Dữ liệu đã thay đổi hoặc chưa lưu được. Đóng hộp thoại và kiểm tra lại.');});
 });
 $('#library-export-notes').addEventListener('click',()=>{if(!libraryView.notes)return;download('Tech_Horizon_Ghi_Chu_Dang_Xem.txt',L.notesText(libraryView.rows,D.config),'text/plain;charset=utf-8');$('#library-status').textContent='Đã tải '+libraryView.notes+' ghi chú đang lọc. Tệp có nội dung riêng của bạn.';});
 $('#export-reader').addEventListener('click',()=>{try{const latest=C.readerBackup({type:'tech-horizon-reader',version:1,saved:C.savedList(localStorage.getItem('th-saved')),progress:JSON.parse(localStorage.getItem('th-progress')||'{}')},[...ids]);download('Tech_Horizon_Thu_Vien_'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify({type:'tech-horizon-reader',version:1,exported:new Date().toISOString(),...latest},null,2));$('#library-status').textContent='Đã tạo bản sao lưu toàn bộ thư viện, gồm ghi chú riêng. Bộ lọc không giới hạn bản sao lưu.';}catch(error){libraryWarning('Chưa sao lưu được: '+error.message);}});
 $('#import-reader').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{
  if(file.size>2*1024*1024)throw Error('Tệp cần nhỏ hơn 2 MB.');const imported=C.readerBackup(JSON.parse(await file.text()),[...ids]),expected={'th-saved':localStorage.getItem('th-saved'),'th-progress':localStorage.getItem('th-progress')};
  info('Khôi phục thư viện','<h3>Mang theo góc đọc của bạn.</h3><p>Bản sao lưu có '+imported.saved.length+' bài đã lưu và '+Object.keys(imported.progress).length+' mục tiến độ hoặc ghi chú phù hợp với website này. Thay thế toàn bộ thư viện hiện tại trên trình duyệt? Xuất bản sao hiện tại nếu muốn giữ lại.</p><button class="button button-blue" id="confirm-reader-import">Thay thế và khôi phục</button><p id="reader-import-status" role="status"></p>');
  $('#confirm-reader-import').addEventListener('click',()=>{try{const raw=C.replaceReader(localStorage,imported,expected);saved=imported.saved;progress=imported.progress;readerRaw=raw['th-progress'];readerBlocked=false;savedBlocked=false;$('#library-warning').hidden=true;renderLibrary();updateJourneyProgress();window.dispatchEvent(new CustomEvent('th-saved-change'));$('#info-dialog').close();toast('Đã khôi phục toàn bộ thư viện.');}catch(error){$('#reader-import-status').textContent=error.message;}});
 }catch(error){toast('Không thể khôi phục: '+error.message);}finally{e.target.value='';}});
 $('#clear-reading-history').addEventListener('click',()=>{let expected;try{expected=localStorage.getItem('th-progress');}catch{libraryWarning('Chưa đọc được dữ liệu. Giữ bản sao trước khi xóa.');return;}info('Xóa tiến độ và ghi chú','<p>Xóa mọi tiến độ đọc và ghi chú Tech Horizon trên trình duyệt này? Bài đã lưu được giữ lại. Tệp sao lưu đã tải không thay đổi.</p><button class="button button-outline" id="confirm-reading-clear">Xóa tiến độ và ghi chú</button><p id="reader-clear-status" role="status"></p>');$('#confirm-reading-clear').addEventListener('click',()=>{try{readerRaw=C.guardedSet(localStorage,'th-progress',{},expected);readerBlocked=false;progress={};renderLibrary();$('#info-dialog').close();toast('Đã xóa tiến độ và ghi chú.');}catch(error){$('#reader-clear-status').textContent=error.message;}});});
 renderLibrary();if(readerBlocked||savedBlocked)libraryWarning('Một phần thư viện chưa đọc được. Các thao tác ghi sẽ kiểm tra dữ liệu trước khi lưu. Tải dữ liệu thô trong Dữ liệu & hiển thị để giữ bản phục hồi.');
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
 if(note&&!$('#download-reader-note')){const button=document.createElement('button');button.className='text-button';button.id='download-reader-note';button.type='button';button.textContent='Tải ghi chú TXT ↗';$('.notebook-actions')?.appendChild(button);button.addEventListener('click',()=>download('Tech_Horizon_Ghi_Chu_'+current.id+'.txt',current.title+'\n\n'+note.value,'text/plain;charset=utf-8'));}if(readerBlocked)readerWarning('Chưa đọc được ghi chú hoặc tiến độ đã lưu.');
 if((progress[current.id]?.percent||0)>=95&&$('#mark-read'))$('#mark-read').textContent='Đã đọc xong ✓';
 let noteTimer;function saveNote(){if(!note)return;const record=progress[current.id]||{percent:0,updated:new Date().toISOString(),note:''};if(commitProgress({...progress,[current.id]:{...record,note:note.value,updated:new Date().toISOString()}})){if(noteStatus)noteStatus.textContent='Đã lưu ghi chú trên trình duyệt này.';}else if(noteStatus)noteStatus.textContent='Chưa lưu được ghi chú. Tải TXT để giữ nội dung trước khi tải lại trang.';}
 note?.addEventListener('input',()=>{clearTimeout(noteTimer);if(noteStatus)noteStatus.textContent='Đang lưu…';noteTimer=setTimeout(saveNote,900);});
 $('#save-reader-note')?.addEventListener('click',()=>{clearTimeout(noteTimer);saveNote();});
 $('#mark-read')?.addEventListener('click',()=>{const prior=progress[current.id]||{};if(commitProgress({...progress,[current.id]:{percent:100,updated:new Date().toISOString(),note:note?.value||prior.note||''}})){$('#mark-read').textContent='Đã đọc xong ✓';toast('Đã đánh dấu đọc xong cẩm nang.');}else toast('Chưa lưu được tiến độ đọc.');});
 let lastSave=0;function track(force=false){const body=$('#article-body');if(!body)return;const top=scrollY+body.getBoundingClientRect().top-readingOffset(),height=Math.max(1,body.offsetHeight-innerHeight*.55);const value=Math.max(0,Math.min(100,Math.round((scrollY-top)/height*100)));if(!force&&Date.now()-lastSave<1600)return;const previous=progress[current.id]||{percent:0,note:''};if(value<=previous.percent)return;lastSave=Date.now();commitProgress({...progress,[current.id]:{percent:value>=95?100:value,updated:new Date().toISOString(),note:note?.value||previous.note||''}});}
 window.addEventListener('scroll',()=>track(),{passive:true});
 window.addEventListener('pagehide',()=>{clearTimeout(noteTimer);if(note&&note.value!==(progress[current.id]?.note||''))saveNote();track(true);});
 window.addEventListener('beforeunload',e=>{if(note&&note.value!==(progress[current.id]?.note||'')){clearTimeout(noteTimer);saveNote();if(note.value!==(progress[current.id]?.note||'')){e.preventDefault();e.returnValue='';}}});
 if(params.get('resume')==='1'&&(progress[current.id]?.percent||0)>0){window.addEventListener('load',()=>{const body=$('#article-body');if(!body)return;const top=scrollY+body.getBoundingClientRect().top-readingOffset(),height=Math.max(1,body.offsetHeight-innerHeight*.55);window.scrollTo({top:Math.max(0,top+height*Math.min(94,progress[current.id].percent)/100),behavior:'instant'});},{once:true});}
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
window.addEventListener('storage',e=>{if(['th-saved','th-progress'].includes(e.key)||e.key===null){try{saved=C.savedList(localStorage.getItem('th-saved')).filter(id=>ids.has(id));savedBlocked=false;}catch{savedBlocked=true;libraryWarning('Chưa đọc được danh sách bài đã lưu mới. Giữ bản dữ liệu thô trước khi khôi phục.');}if(e.key==='th-progress'||e.key===null){try{const raw=localStorage.getItem('th-progress'),next=C.readerBackup({type:'tech-horizon-reader',version:1,saved:[],progress:raw?JSON.parse(raw):{}},[...ids]).progress,note=$('#reader-note'),id=current?.id,previous=id?progress[id]?.note||'':'',incoming=id?next[id]?.note||'':'';if(id&&note&&note.value!==previous&&incoming!==previous){readerWarning('Ghi chú đã thay đổi ở tab khác. Phần đang nhập được giữ trên trang này.');}else if(!readerBlocked){readerRaw=raw;progress=next;if(note&&id&&note.value===previous)note.value=incoming;}}catch{readerWarning('Chưa đọc được tiến độ hoặc ghi chú mới trong bộ nhớ.');}}updateJourneyProgress();renderLibrary();}});
window.addEventListener('th-saved-change',()=>{try{saved=C.savedList(localStorage.getItem('th-saved')).filter(id=>ids.has(id));renderLibrary();}catch(error){libraryWarning(error.message);}});
})();
