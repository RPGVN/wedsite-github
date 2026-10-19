(function(){
 'use strict';
 const C=window.THCore;if(!C||!window.TECH_HORIZON)return;
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const clone=x=>JSON.parse(JSON.stringify(x));
 const original=clone(window.TECH_HORIZON),stored=C.storage.get('th-draft',null);
 let D=stored&&C.validate(stored).length===0?stored:clone(original);
 let currentId='',active='config',configDirty=false,articleDirty=false;
 try{const theme=C.storage.get('th-theme','dark');if(theme==='light')document.documentElement.dataset.theme='light';}catch{}
 function error(messages){const box=$('#editor-error');box.textContent=Array.isArray(messages)?messages.join('\n'):messages;box.hidden=!box.textContent;if(!box.hidden)box.scrollIntoView({behavior:'smooth',block:'center'});}
 function persist(candidate=D){const errors=C.validate(candidate);if(errors.length){error(errors);return false;}if(!C.storage.set('th-draft',candidate)){error('Trình duyệt đang chặn bộ nhớ hoặc đã hết dung lượng. Chưa lưu được bản nháp.');return false;}D=candidate;error('');return true;}
 function status(message){$('#global-status').textContent=message;}
 function switchTab(name){active=name;$$('[data-tab]').forEach(tab=>{const selected=tab.dataset.tab===name;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});$$('[role=tabpanel]').forEach(panel=>panel.hidden=panel.id!=='panel-'+name);}
 $$('[data-tab]').forEach(tab=>{
   tab.addEventListener('click',()=>switchTab(tab.dataset.tab));
   tab.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const tabs=$$('[data-tab]');const index=tabs.indexOf(tab);const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length;switchTab(tabs[next].dataset.tab);tabs[next].focus();}});
 });
 function fillConfig(){const form=$('#config-form');for(const key of ['name','tagline','description','facebookUrl','email','siteUrl','accent','contentNote'])form.elements[key].value=D.config[key]||'';configDirty=false;}
 $('#config-form').addEventListener('input',()=>{configDirty=true;$('#config-status').textContent='Có thay đổi chưa lưu.';});
 $('#config-form').addEventListener('submit',e=>{
   e.preventDefault();const candidate=clone(D),form=e.currentTarget;
   for(const key of ['name','tagline','description','facebookUrl','email','siteUrl','accent','contentNote'])candidate.config[key]=form.elements[key].value.trim();
   if(persist(candidate)){configDirty=false;$('#config-status').textContent='Đã lưu bản nháp trên thiết bị.';status('Bản nháp đã sẵn sàng để xem trước hoặc xuất tệp.');}
 });
 function renderList(){
   $('#editor-article-list').innerHTML=D.articles.map(a=>'<div class="editor-article-row"><div><strong>'+C.escape(a.title)+'</strong><small>'+C.escape(D.categories.find(c=>c.id===a.category)?.name||a.category)+' · '+C.escape(a.id)+'</small></div><button data-edit="'+C.escape(a.id)+'" type="button">Chỉnh sửa</button></div>').join('');
   $('#article-category').innerHTML=D.categories.map(c=>'<option value="'+C.escape(c.id)+'">'+C.escape(c.name)+'</option>').join('');
 }
 function fillArticle(a){
   currentId=a.id;const form=$('#article-form');
   for(const key of ['id','title','category','date','minutes','image','excerpt','takeaway'])form.elements[key].value=a[key]??'';
   form.elements.featured.value=String(!!a.featured);
   form.elements.sections.value=a.sections.map(s=>s.heading+'\n'+s.text).join('\n\n---\n\n');
   form.elements.sources.value=a.sources.map(s=>s.label+' | '+s.url).join('\n');
   $('#delete-article').hidden=!D.articles.some(x=>x.id===a.id);
   $('#article-edit-title').textContent=D.articles.some(x=>x.id===a.id)?'Chỉnh sửa: '+a.title:'Viết cẩm nang mới';
   $('#article-status').textContent='';articleDirty=false;
 }
 $('#editor-article-list').addEventListener('click',e=>{
   const button=e.target.closest('[data-edit]');if(!button)return;
   if(articleDirty&&!confirm('Phần chỉnh sửa bài hiện tại chưa được lưu. Chuyển sang bài khác?'))return;
   const a=D.articles.find(x=>x.id===button.dataset.edit);if(a){fillArticle(a);$('#article-edit-title').scrollIntoView({behavior:'smooth',block:'start'});}
 });
 $('#new-article').addEventListener('click',()=>{
   if(articleDirty&&!confirm('Bài hiện tại còn thay đổi chưa lưu. Bắt đầu bài mới?'))return;
   let id='cam-nang-moi',n=1;while(D.articles.some(a=>a.id===id))id='cam-nang-moi-'+(++n);
   const now=new Date();const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
   fillArticle({id,title:'',category:D.categories[0].id,date:day,minutes:4,image:'ai',featured:false,excerpt:'',takeaway:'',sections:[{heading:'Điều đầu tiên bạn nên biết',text:''}],sources:[]});
   articleDirty=true;$('#article-title').focus();
 });
 $('#article-form').addEventListener('input',()=>{articleDirty=true;$('#article-status').textContent='Có thay đổi chưa lưu.';});
 $('#article-form').addEventListener('submit',e=>{
   e.preventDefault();const form=e.currentTarget,candidate=clone(D);
   const sections=form.elements.sections.value.trim().split(/\r?\n\s*---\s*\r?\n/).filter(Boolean).map(block=>{const [heading,...text]=block.trim().split(/\r?\n/);return {heading:heading.trim(),text:text.join('\n').trim()};});
   if(sections.some(s=>!s.heading||!s.text)){error('Mỗi phần nội dung cần có tiêu đề và ít nhất một dòng nội dung.');return;}
   const sourceLines=form.elements.sources.value.trim().split(/\r?\n/).filter(s=>s.trim());
   const sources=[];for(const line of sourceLines){const divider=line.indexOf('|');if(divider===-1){error('Mỗi nguồn cần có dạng Tên nguồn | https://đường-dẫn.');return;}sources.push({label:line.slice(0,divider).trim(),url:line.slice(divider+1).trim()});}
   const a={};for(const key of ['id','title','category','date','image','excerpt','takeaway'])a[key]=form.elements[key].value.trim();
   a.minutes=Number(form.elements.minutes.value);a.featured=form.elements.featured.value==='true';a.sections=sections;a.sources=sources;
   if(candidate.articles.some(x=>x.id===a.id&&x.id!==currentId)){error('Mã đường dẫn đã có ở một bài khác. Hãy chọn mã khác.');return;}
   if(a.featured)candidate.articles.forEach(x=>x.featured=false);
   const index=candidate.articles.findIndex(x=>x.id===currentId);if(index>=0)candidate.articles[index]=a;else candidate.articles.unshift(a);
   if(persist(candidate)){currentId=a.id;articleDirty=false;renderList();fillArticle(a);$('#article-status').textContent='Đã lưu bản nháp bài viết.';status(D.articles.length+' cẩm nang trong bản nháp.');}
 });
 $('#delete-article').addEventListener('click',()=>{
   if(!currentId)return;if(D.articles.length<=1){error('Giữ lại ít nhất một cẩm nang trong website.');return;}
   if(!confirm('Xóa bài này khỏi bản nháp trên thiết bị? Website đang xuất bản chưa bị thay đổi.'))return;
   const candidate=clone(D);candidate.articles=candidate.articles.filter(a=>a.id!==currentId);
   if(persist(candidate)){renderList();fillArticle(D.articles[0]);status('Đã xóa bài khỏi bản nháp. Chưa thay đổi website đang xuất bản.');}
 });
 function savePending(){
   if(configDirty){if(!$('#config-form').reportValidity()){switchTab('config');return false;}$('#config-form').requestSubmit();if(configDirty)return false;}
   if(articleDirty){if(!$('#article-form').reportValidity()){switchTab('articles');return false;}$('#article-form').requestSubmit();if(articleDirty)return false;}
   return persist(D);
 }
 function download(name,contents,type){const blob=new Blob([contents],{type}),link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),10000);}
 $('#export-js').addEventListener('click',()=>{
   if(!savePending())return;
   download('site-data.js','/* Nội dung công khai của Tech Horizon. Không đặt thông tin bí mật trong tệp. */\nwindow.TECH_HORIZON = '+JSON.stringify(D,null,2).replace(/</g,'\\u003c')+';\n','application/javascript;charset=utf-8');
   status('Đã tạo tệp site-data.js. Thay tệp cùng tên rồi tải website lên để cập nhật cho người đọc.');
 });
 $('#export-backup').addEventListener('click',()=>{if(!savePending())return;download('Tech_Horizon_backup.json',JSON.stringify(D,null,2),'application/json;charset=utf-8');status('Đã tạo bản sao lưu JSON. Hãy giữ tệp ở nơi an toàn.');});
 $('#preview-site').addEventListener('click',()=>{if(!savePending())return;C.storage.set('th-preview',true);window.open('index.html?preview=1','_blank','noopener');status('Bản xem trước dùng dữ liệu nháp của trình duyệt này.');});
 $('#import-backup').addEventListener('change',async e=>{
   const file=e.target.files[0];if(!file)return;
   try{
     if(file.size>2*1024*1024)throw Error('Tệp vượt quá 2 MB.');
     const candidate=JSON.parse(await file.text());const errors=C.validate(candidate);if(errors.length)throw Error(errors.join('\n'));
     if(!candidate.articles.length||!candidate.categories.length)throw Error('Tệp cần có ít nhất một cẩm nang và một chuyên mục.');
     if(!confirm('Thay bản nháp hiện tại bằng bản sao lưu đã chọn?'))return;
     if(persist(candidate)){fillConfig();renderList();fillArticle(D.articles[0]);status('Đã khôi phục bản nháp. Chưa cập nhật website đang xuất bản.');}
   }catch(err){error('Không thể nhập bản sao lưu: '+err.message);}finally{e.target.value='';}
 });
 $('#reset-draft').addEventListener('click',()=>{
   if(!confirm('Bỏ bản nháp trên thiết bị và trở về nội dung của tệp site-data.js đang mở? Hãy sao lưu trước nếu cần.'))return;
   if(persist(clone(original))){C.storage.remove('th-preview');fillConfig();renderList();fillArticle(D.articles[0]);status('Đã trở về dữ liệu đang xuất bản.');}
 });
 window.addEventListener('beforeunload',e=>{if(configDirty||articleDirty){e.preventDefault();e.returnValue='';}});
 fillConfig();renderList();fillArticle(D.articles[0]);status(stored?'Đã mở bản nháp lưu trên trình duyệt.':'Đã mở dữ liệu website.');
})();
