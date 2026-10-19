(function(){
 'use strict';
 const C=window.THCore;if(!C||!window.TECH_HORIZON)return;
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const clone=x=>JSON.parse(JSON.stringify(x));
 const original=clone(window.TECH_HORIZON),stored=C.storage.get('th-draft',null);
 let draftRaw=null,editorBlocked=false,blockedReason='';
 try{draftRaw=localStorage.getItem('th-draft');if(draftRaw!==null&&C.validate(JSON.parse(draftRaw)).length){editorBlocked=true;blockedReason='Bản nháp đang lưu chưa hợp lệ. Giữ bản dữ liệu thô trong Dữ liệu & hiển thị trước khi khôi phục.';}}catch{editorBlocked=true;blockedReason='Chưa đọc được bản nháp trong bộ nhớ. Giữ thay đổi đang nhập và kiểm tra quyền lưu dữ liệu.';}
 let D=stored&&C.validate(stored).length===0?stored:clone(original);
 if((D.version||1)<2){const existing=new Set(D.articles.map(a=>a.id));D.articles.push(...original.articles.filter(a=>!existing.has(a.id)));const known=new Set(D.articles.map(a=>a.id));D.glossary=D.glossary||clone(original.glossary||[]);D.journeys=(D.journeys||clone(original.journeys||[])).map(j=>({...j,articles:j.articles.filter(id=>known.has(id))})).filter(j=>j.articles.length);D.version=2;}
 D.socialPosts=D.socialPosts||[];
 D.version=7;
 let configImages={logoImage:D.config.logoImage||'',heroImage:D.config.heroImage||''},articleImageData='',historyFailed=false;
 let postsDraft=clone(D.socialPosts),postsDirty=false;
 let currentId='',active='config',configDirty=false,articleDirty=false;
 try{const theme=C.storage.get('th-theme','dark');if(theme==='light')document.documentElement.dataset.theme='light';}catch{}
 function error(messages){const box=$('#editor-error');box.textContent=Array.isArray(messages)?messages.join('\n'):messages;box.hidden=!box.textContent;if(!box.hidden)box.scrollIntoView({behavior:'smooth',block:'center'});}
 function persist(candidate=D){if(editorBlocked){error(blockedReason);return false;}candidate.version=7;const errors=C.validate(candidate);if(errors.length){error(errors);return false;}const previous=clone(D),changed=JSON.stringify(D)!==JSON.stringify(candidate);try{draftRaw=C.guardedSet(localStorage,'th-draft',candidate,draftRaw);}catch(err){blockEditor(err.message);error(err.message);return false;}D=candidate;if(changed){let snapshots=[{id:String(Date.now()),when:new Date().toISOString(),data:previous},...historyItems()].slice(0,3);while(snapshots.length&&JSON.stringify(snapshots).length>700000)snapshots.pop();historyFailed=!C.storage.set('th-editor-history',snapshots);}error('');updateDashboard();renderHistory();return true;}
 function status(message){$('#global-status').textContent=message;}
 function updateDashboard(){
  $('#editor-stat-articles').textContent=D.articles.length;$('#editor-stat-categories').textContent=D.categories.length;$('#editor-stat-terms').textContent=D.glossary?.length||0;$('#editor-stat-posts').textContent=D.socialPosts?.length||0;
  renderAudit();
  $('#editor-health-list').innerHTML='<li>'+D.articles.length+' cẩm nang hợp lệ, sẵn sàng dựng trang.</li><li>'+(D.glossary?.length||0)+' thuật ngữ và '+(D.journeys?.length||0)+' lộ trình đọc.</li><li'+(D.config.facebookUrl?'':' class="needs-update"')+'>'+(D.config.facebookUrl?'Đã có liên kết Facebook chính thức.':'Chưa có URL Facebook chính thức — bổ sung khi sẵn sàng.')+'</li><li'+(D.config.email?'':' class="needs-update"')+'>'+(D.config.email?'Email công khai đã được cấu hình.':'Email công khai đang ẩn (tùy chọn).')+'</li><li>Xuất ZIP không cần kết nối dịch vụ biên dịch.</li>';
 }
 function blockEditor(message){editorBlocked=true;blockedReason=message;$('#editor-session-warning').hidden=false;$('#editor-session-description').textContent=message;status('Chưa ghi đè bản nháp đã lưu. Bạn có thể tải thay đổi đang nhập để giữ lại.');}
 function renderAudit(){const Q=window.THQuality;if(!Q)return;const result=Q.audit(D),items=result.warnings;$('#editor-audit-count').textContent=result.errors.length?result.errors.length+' lỗi cấu trúc':items.length+' mục cần xem lại';$('#editor-audit-results').innerHTML=result.errors.length?'<p>'+C.escape(result.errors.join(' · '))+'</p>':'<p class="audit-summary">'+result.articles+' cẩm nang · '+result.sources+' liên kết nguồn trong bản nháp đã lưu.</p>'+ (items.length?items.map(item=>'<article class="audit-row"><div><strong>'+C.escape(item.label)+'</strong><p>'+C.escape(item.detail)+'</p>'+(item.id?'<small>'+C.escape(D.articles.find(a=>a.id===item.id)?.title||item.id)+'</small>':'')+'</div>'+(item.id?'<button class="text-button" type="button" data-audit-article="'+item.id+'">Chỉnh sửa bài ↗</button>':'<button class="text-button" type="button" data-audit-config>Thông tin kênh ↗</button>')+'</article>').join(''):'<p>Chưa có mục cần bổ sung theo các quy tắc đang kiểm tra. Hãy mở nguồn và đọc lại nội dung trước khi xuất bản.</p>');}
 $('#editor-audit-results').addEventListener('click',e=>{const button=e.target.closest('[data-audit-article]');if(button){if(articleDirty&&!confirm('Bài đang nhập chưa lưu. Chuyển sang bài được chọn?'))return;const a=D.articles.find(a=>a.id===button.dataset.auditArticle);if(a){switchTab('articles');fillArticle(a);$('#article-title').focus();}}else if(e.target.closest('[data-audit-config]')){switchTab('config');$('#config-name').focus();}});
 $('#export-editor-recovery').addEventListener('click',()=>{const recovery={type:'tech-horizon-editor-recovery',version:1,exported:new Date().toISOString(),savedDraft:D,forms:{config:Object.fromEntries(new FormData($('#config-form'))),article:Object.fromEntries(new FormData($('#article-form')))},socialPosts:postsDraft,images:{...configImages,articleImageData}};download('Tech_Horizon_Thay_Doi_Dang_Nhap.json',JSON.stringify(recovery,null,2),'application/json;charset=utf-8');status('Đã tạo tệp phục hồi biểu mẫu đang nhập. Giữ tệp riêng; không đưa lên website công khai.');});
 window.addEventListener('storage',e=>{if(e.key==='th-draft'||e.key===null)blockEditor('Bản nháp đã thay đổi ở tab khác. Tải thay đổi đang nhập, rồi tải lại trang để đọc bản mới.');});
 function switchTab(name){active=name;$$('[data-tab]').forEach(tab=>{const selected=tab.dataset.tab===name;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});$$('[role=tabpanel]').forEach(panel=>panel.hidden=panel.id!=='panel-'+name);}
 $$('[data-tab]').forEach(tab=>{
   tab.addEventListener('click',()=>switchTab(tab.dataset.tab));
   tab.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const tabs=$$('[data-tab]');const index=tabs.indexOf(tab);const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length;switchTab(tabs[next].dataset.tab);tabs[next].focus();}});
 });
 function fillConfig(){const form=$('#config-form');for(const key of ['name','tagline','description','facebookUrl','email','siteUrl','accent','contentNote'])form.elements[key].value=D.config[key]||'';configImages={logoImage:D.config.logoImage||'',heroImage:D.config.heroImage||''};renderBrandImages();configDirty=false;}
 $('#config-form').addEventListener('input',()=>{configDirty=true;$('#config-status').textContent='Có thay đổi chưa lưu.';});
 $('#config-form').addEventListener('submit',e=>{
   e.preventDefault();const candidate=clone(D),form=e.currentTarget;
   for(const key of ['name','tagline','description','facebookUrl','email','siteUrl','accent','contentNote'])candidate.config[key]=form.elements[key].value.trim();
   candidate.config.logoImage=configImages.logoImage;candidate.config.heroImage=configImages.heroImage;
   if(persist(candidate)){configDirty=false;$('#config-status').textContent='Đã lưu bản nháp trên thiết bị.';status('Bản nháp đã sẵn sàng để xem trước hoặc xuất tệp.');}
 });
 function renderList(){
   const query=$('#editor-search')?.value||'',category=$('#editor-category-filter')?.value||'all';
   $('#editor-article-list').innerHTML=C.filter(D.articles,{query,category}).map(a=>'<div class="editor-article-row"><div><strong>'+C.escape(a.title)+'</strong><small>'+C.escape(D.categories.find(c=>c.id===a.category)?.name||a.category)+' · '+C.escape(a.id)+'</small></div><div class="editor-article-row-actions"><button data-edit="'+C.escape(a.id)+'" type="button">Chỉnh sửa</button><button data-duplicate="'+C.escape(a.id)+'" type="button">Nhân bản</button></div></div>').join('')||'<p>Chưa có bài phù hợp.</p>';
   const previous=$('#article-category').value;
   $('#article-category').innerHTML=D.categories.map(c=>'<option value="'+C.escape(c.id)+'">'+C.escape(c.name)+'</option>').join('');
   if(previous)$('#article-category').value=previous;
 }
 function fillArticle(a){
   currentId=a.id;const form=$('#article-form');
   for(const key of ['id','title','category','date','minutes','image','excerpt','takeaway','imageAlt'])form.elements[key].value=a[key]??'';
   form.elements.featured.value=String(!!a.featured);
   form.elements.sections.value=a.sections.map(s=>s.heading+'\n'+s.text).join('\n\n---\n\n');
   form.elements.sources.value=a.sources.map(s=>s.label+' | '+s.url).join('\n');
   $('#delete-article').hidden=!D.articles.some(x=>x.id===a.id);
   $('#article-edit-title').textContent=D.articles.some(x=>x.id===a.id)?'Chỉnh sửa: '+a.title:'Viết cẩm nang mới';
   $('#article-status').textContent='';articleDirty=false;
   articleImageData=a.customImage||'';$('#editor-image-preview').src=C.image(articleImageData,250000)||'assets/'+a.image+'.svg';
 }
 $('#editor-article-list').addEventListener('click',e=>{
   const duplicate=e.target.closest('[data-duplicate]');
   if(duplicate){if(articleDirty&&!confirm('Bài đang sửa còn thay đổi chưa lưu. Chuyển sang bản sao?'))return;const source=D.articles.find(a=>a.id===duplicate.dataset.duplicate);if(!source)return;const copy=clone(source);let suffix=1,id=source.id+'-ban-sao';while(D.articles.some(a=>a.id===id))id=source.id+'-ban-sao-'+(++suffix);copy.id=id;copy.title=(source.title+' (bản sao)').slice(0,200);copy.featured=false;fillArticle(copy);articleDirty=true;$('#article-title').focus();return;}
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
   const a={};for(const key of ['id','title','category','date','image','excerpt','takeaway','imageAlt'])a[key]=form.elements[key].value.trim();
   a.minutes=Number(form.elements.minutes.value);a.featured=form.elements.featured.value==='true';a.sections=sections;a.sources=sources;
   if(articleImageData)a.customImage=articleImageData;
   if(candidate.articles.some(x=>x.id===a.id&&x.id!==currentId)){error('Mã đường dẫn đã có ở một bài khác. Hãy chọn mã khác.');return;}
   if(a.featured)candidate.articles.forEach(x=>x.featured=false);
   const index=candidate.articles.findIndex(x=>x.id===currentId);if(index>=0)candidate.articles[index]=a;else candidate.articles.unshift(a);
   if(a.id!==currentId)candidate.journeys=(candidate.journeys||[]).map(j=>({...j,articles:j.articles.map(id=>id===currentId?a.id:id)}));
   if(persist(candidate)){currentId=a.id;articleDirty=false;renderList();fillArticle(a);$('#article-status').textContent='Đã lưu bản nháp bài viết.';status(D.articles.length+' cẩm nang trong bản nháp.');}
 });
 $('#delete-article').addEventListener('click',()=>{
   if(!currentId)return;if(D.articles.length<=1){error('Giữ lại ít nhất một cẩm nang trong website.');return;}
   if(!confirm('Xóa bài này khỏi bản nháp trên thiết bị? Website đang xuất bản chưa bị thay đổi.'))return;
   const candidate=clone(D);candidate.articles=candidate.articles.filter(a=>a.id!==currentId);
   candidate.journeys=(candidate.journeys||[]).map(j=>({...j,articles:j.articles.filter(id=>id!==currentId)})).filter(j=>j.articles.length);
   if(persist(candidate)){renderList();fillArticle(D.articles[0]);status('Đã xóa bài khỏi bản nháp. Chưa thay đổi website đang xuất bản.');}
 });
 function savePending(){
   if(editorBlocked){error(blockedReason);return false;}
   if(configDirty){if(!$('#config-form').reportValidity()){switchTab('config');return false;}$('#config-form').requestSubmit();if(configDirty)return false;}
   if(articleDirty){if(!$('#article-form').reportValidity()){switchTab('articles');return false;}$('#article-form').requestSubmit();if(articleDirty)return false;}
   if(postsDirty){if(!$('#social-form').reportValidity()){switchTab('social');return false;}$('#social-form').requestSubmit();if(postsDirty)return false;}
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
     if(persist(candidate)){postsDraft=clone(D.socialPosts||[]);postsDirty=false;renderPosts();fillConfig();renderList();fillArticle(D.articles[0]);status('Đã khôi phục bản nháp. Chưa cập nhật website đang xuất bản.');}
   }catch(err){error('Không thể nhập bản sao lưu: '+err.message);}finally{e.target.value='';}
 });
 $('#reset-draft').addEventListener('click',()=>{
   if(!confirm('Bỏ bản nháp trên thiết bị và trở về nội dung của tệp site-data.js đang mở? Hãy sao lưu trước nếu cần.'))return;
   if(persist(clone(original))){C.storage.remove('th-preview');postsDraft=clone(D.socialPosts||[]);postsDirty=false;renderPosts();fillConfig();renderList();fillArticle(D.articles[0]);status('Đã trở về dữ liệu đang xuất bản.');}
 });
 $('#editor-search').addEventListener('input',renderList);
 $('#editor-category-filter').innerHTML='<option value="all">Mọi chuyên mục</option>'+D.categories.map(c=>'<option value="'+C.escape(c.id)+'">'+C.escape(c.name)+'</option>').join('');
 $('#editor-category-filter').addEventListener('change',renderList);
 $('#article-image').addEventListener('change',e=>$('#editor-image-preview').src=C.image(articleImageData,250000)||'assets/'+e.target.value+'.svg');
 $('#preview-article').addEventListener('click',()=>{if(!savePending())return;C.storage.set('th-preview',true);window.open('doc-bai.html?id='+encodeURIComponent(currentId)+'&preview=1','_blank','noopener');status('Đã mở bài theo dữ liệu nháp.');});
 function renderPosts(){
   $('#social-editor-list').innerHTML=postsDraft.map((post,i)=>'<div class="post-editor-row" data-post-row="'+i+'"><div class="field"><label for="post-title-'+i+'">Tiêu đề bài / Reels</label><input id="post-title-'+i+'" data-post-field="title" required maxlength="200" value="'+C.escape(post.title)+'"></div><div class="field"><label for="post-url-'+i+'">Đường dẫn Facebook</label><input id="post-url-'+i+'" type="url" data-post-field="url" required value="'+C.escape(post.url)+'" placeholder="https://www.facebook.com/…"></div><div class="field"><label for="post-caption-'+i+'">Giới thiệu ngắn</label><textarea id="post-caption-'+i+'" data-post-field="caption" maxlength="1000" rows="3">'+C.escape(post.caption)+'</textarea></div><button class="text-button" data-remove-post="'+i+'" type="button">Xóa liên kết này</button></div>').join('')||'<p style="font-size:12px;margin-bottom:20px">Chưa thêm liên kết Facebook. Khu bài Facebook được ẩn khỏi trang chủ.</p>';
 }
 $('#social-editor-list').addEventListener('input',e=>{const field=e.target.dataset.postField,row=e.target.closest('[data-post-row]');if(field&&row){postsDraft[Number(row.dataset.postRow)][field]=e.target.value;postsDirty=true;$('#social-status').textContent='Có thay đổi chưa lưu.';}});
 $('#social-editor-list').addEventListener('click',e=>{const button=e.target.closest('[data-remove-post]');if(!button)return;postsDraft.splice(Number(button.dataset.removePost),1);postsDirty=true;renderPosts();});
 $('#add-social-post').addEventListener('click',()=>{if(postsDraft.length>=30){error('Tối đa 30 liên kết Facebook.');return;}postsDraft.push({title:'',url:'',caption:''});postsDirty=true;renderPosts();$('#post-title-'+(postsDraft.length-1)).focus();});
 $('#social-form').addEventListener('submit',e=>{e.preventDefault();const candidate=clone(D);candidate.socialPosts=postsDraft.map(p=>({title:p.title.trim(),url:p.url.trim(),caption:p.caption.trim()}));if(persist(candidate)){postsDirty=false;$('#social-status').textContent='Đã lưu danh sách liên kết trong bản nháp.';}});
 $('#export-full-site').addEventListener('click',async()=>{
   if(!savePending())return;const button=$('#export-full-site'),message=$('#export-progress');button.disabled=true;message.textContent='Đang tạo các trang từ nội dung của bạn…';
   try{
     if(!window.TH_PACKAGE||!window.THRenderer||!window.THZip)throw Error('Thiếu tài nguyên xuất ZIP. Hãy mở đầy đủ thư mục website.');
     await new Promise(resolve=>setTimeout(resolve,30));
     const assets=Object.entries(window.TH_PACKAGE.files).map(([name,encoded])=>({name:'Tech_Horizon_Website/'+name,content:Uint8Array.from(atob(encoded),c=>c.charCodeAt(0))}));
     const built=window.THRenderer.build(clone(D));
     const files=[...assets,...Object.entries(built).map(([name,content])=>({name:'Tech_Horizon_Website/'+name,content})),{name:'Tech_Horizon_Website/assets/package-assets.js',content:'window.TH_PACKAGE = '+JSON.stringify(window.TH_PACKAGE)+';\n'},{name:'Tech_Horizon_Website/HUONG_DAN.txt',content:'TECH HORIZON — BẢN XUẤT TỪ BÀN BIÊN TẬP\n\nGiải nén toàn bộ thư mục, mở index.html để chạy.\nMuốn xuất bản, tải nội dung thư mục website lên dịch vụ lưu trữ web tĩnh.\nMở bien-tap.html để sửa tiếp. Không đặt mật khẩu hoặc dữ liệu bí mật trong tệp công khai.\n'}];
     message.textContent='Đang đóng gói '+files.length+' tệp…';await new Promise(resolve=>setTimeout(resolve,30));
     download('Tech_Horizon_Website_Cua_Ban.zip',window.THZip.create(files),'application/zip');message.textContent='Đã tạo ZIP hoàn chỉnh. Giải nén rồi mở index.html để chạy.';status('Muốn cập nhật bản online, tải nội dung ZIP lên nơi lưu trữ website.');
   }catch(err){error('Chưa xuất được ZIP: '+err.message);message.textContent='Xuất ZIP chưa hoàn tất.';}finally{button.disabled=false;}
 });
 window.addEventListener('beforeunload',e=>{if(configDirty||articleDirty||postsDirty){e.preventDefault();e.returnValue='';}});
 function historyItems(){const data=C.storage.get('th-editor-history',[]);return Array.isArray(data)?data.filter(item=>item&&typeof item.id==='string'&&Number.isFinite(Date.parse(item.when))&&item.data&&C.validate(item.data).length===0).slice(0,3):[];}
 function renderHistory(){const target=$('#editor-history-list');if(!target)return;const items=historyItems();target.innerHTML=(historyFailed?'<p class="editor-history-empty">Bản nháp đã lưu, nhưng trình duyệt chưa giữ thêm được lịch sử. Bạn nên xuất JSON để có bản sao độc lập.</p>':'')+(items.length?items.map(item=>'<div class="editor-history-row"><div><strong>'+C.escape(new Date(item.when).toLocaleString('vi-VN'))+'</strong><small>'+C.escape(item.data.config.name)+' · '+item.data.articles.length+' cẩm nang · '+(item.data.socialPosts?.length||0)+' liên kết Facebook</small></div><button class="button button-outline" data-restore-history="'+C.escape(item.id)+'">Khôi phục bản này</button></div>').join(''):'<p class="editor-history-empty">Chưa có trạng thái trước đó. Khi bạn lưu một thay đổi, bản trước sẽ được giữ tại đây nếu trình duyệt còn dung lượng.</p>');}
 $('#editor-history-list').addEventListener('click',e=>{const button=e.target.closest('[data-restore-history]');if(!button)return;const item=historyItems().find(row=>row.id===button.dataset.restoreHistory);if(!item)return;if(!confirm('Khôi phục trạng thái đã chọn vào bản nháp? Thay đổi chưa lưu trên các biểu mẫu sẽ được bỏ. Website đang chạy chưa bị thay đổi.'))return;if(persist(clone(item.data))){postsDraft=clone(D.socialPosts||[]);postsDirty=false;renderPosts();fillConfig();renderList();fillArticle(D.articles[0]);status('Đã khôi phục bản nháp. Có thể xem trước hoặc xuất ZIP.');}});
 function renderBrandImages(){const logo=C.image(configImages.logoImage,150000),hero=C.image(configImages.heroImage,400000);$('#config-logo-preview').innerHTML=logo?'<img src="'+C.escape(logo)+'" width="70" height="70" alt="Logo đang chọn">':'<span>TH</span>';$('#config-hero-preview').innerHTML='<img src="'+C.escape(hero||'assets/horizon-portal.webp')+'" width="1536" height="1024" alt="Ảnh bìa đang chọn">';}
 async function readImage(file,limit){if(!file)return '';if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>limit)throw Error('Chọn ảnh PNG, JPEG hoặc WebP không quá '+Math.round(limit/1000)+' KB.');const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Không đọc được ảnh.'));reader.readAsDataURL(file);});if(!C.image(data,limit))throw Error('Tệp chưa có định dạng ảnh được hỗ trợ.');return data;}
 for(const [input,key,limit] of [['upload-logo','logoImage',150000],['upload-hero','heroImage',400000]])$('#'+input).addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{configImages[key]=await readImage(file,limit);configDirty=true;renderBrandImages();$('#config-status').textContent='Đã chọn ảnh. Nhấn Lưu bản nháp để giữ lại.';error('');}catch(err){error(err.message);}finally{e.target.value='';}});
 for(const [button,key] of [['clear-logo','logoImage'],['clear-hero','heroImage']])$('#'+button).addEventListener('click',()=>{configImages[key]='';configDirty=true;renderBrandImages();$('#config-status').textContent='Đã chọn ảnh mặc định. Nhấn Lưu bản nháp.';});
 $('#upload-article-image').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{articleImageData=await readImage(file,250000);articleDirty=true;$('#editor-image-preview').src=articleImageData;$('#article-status').textContent='Đã chọn ảnh riêng. Nhấn Lưu bản nháp.';error('');}catch(err){error(err.message);}finally{e.target.value='';}});
 $('#clear-article-image').addEventListener('click',()=>{articleImageData='';articleDirty=true;$('#editor-image-preview').src='assets/'+$('#article-image').value+'.svg';$('#article-status').textContent='Đã chọn minh họa có sẵn. Nhấn Lưu bản nháp.';});
 $$('[data-accent]').forEach(button=>button.addEventListener('click',()=>{$('#config-accent').value=button.dataset.accent;configDirty=true;$('#config-status').textContent='Đã chọn màu nhấn. Nhấn Lưu bản nháp.';}));
 fillConfig();renderList();fillArticle(D.articles[0]);renderPosts();updateDashboard();renderHistory();if(editorBlocked)blockEditor(blockedReason);else status(stored?'Đã mở bản nháp lưu trên trình duyệt.':'Đã mở nội dung website để biên tập.');
})();
