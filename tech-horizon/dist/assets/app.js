(function(){
 'use strict';
 const C=window.THCore;if(!C||!window.TECH_HORIZON)return;
 const E=C.escape,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const base=document.body.dataset.base||'';
 const page=document.body.dataset.page||'';
 const params=new URLSearchParams(location.search);
 if(params.get('preview')==='1')C.storage.set('th-preview',true);
 let D=window.TECH_HORIZON;
 const draft=C.storage.get('th-draft',null);
 const preview=C.storage.get('th-preview',false)&&draft&&C.validate(draft).length===0;
 if(preview){D=draft;const banner=$('#preview-banner');if(banner)banner.hidden=false;}
 const config=D.config,articles=D.articles,categories=D.categories;
 let saved=[];try{saved=C.savedList(localStorage.getItem('th-saved'));}catch{}
 const icon=(type)=>'<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+({bookmark:'M6 3h12v18l-6-4-6 4z',arrow:'M7 17 17 7M7 7h10v10',share:'m9 11 6-4m-6 6 6 4M8 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0m14-8a3 3 0 1 1-6 0 3 3 0 0 1 6 0m0 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0',spark:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z',external:'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7'}[type]||'M7 17 17 7M7 7h10v10')+'"/></svg>';
 const cat=a=>categories.find(x=>x.id===a.category)||{name:'Cẩm nang',short:'Cẩm nang'};
 const date=a=>new Date(a.date+'T00:00:00Z').toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'});
 const routes=new Set(window.TH_STATIC_ROUTES||[]);
 function articleUrl(a){return routes.has(a.id)?base+'bai-viet/'+a.id+'.html':base+'doc-bai.html?id='+encodeURIComponent(a.id);}
 const imageUrl=a=>C.image(a.customImage,250000)||base+'assets/'+(/^(ai|ai-check|chip|shield|storage|network|lock|browser)$/.test(a.image)?a.image:'ai')+'.svg';
 const tag=a=>'<span class="tag tag-'+E(a.category)+'">'+E(cat(a).short||cat(a).name)+'</span>';
 const meta=a=>'<span>'+date(a)+'</span><span class="meta-dot">·</span><span>'+a.minutes+' phút đọc</span>';
 let toastTimer;
 function toast(message){const box=$('#toast');if(!box)return;box.textContent=message;box.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.classList.remove('visible'),3500);}
 function info(title,content){const dialog=$('#info-dialog');if(!dialog)return;$('#info-title').textContent=title;$('#info-content').innerHTML=content;if(!dialog.open)dialog.showModal();}
 const facebook=C.url(config.facebookUrl,true);
 function openFacebook(){
   if(facebook){window.open(facebook,'_blank','noopener,noreferrer');return;}
   info('Kết nối với Tech Horizon','<h3>Hẹn bạn trên Facebook.</h3><p>Liên kết Facebook chính thức của kênh chưa được cập nhật. Website sẽ mở đúng trang khi chủ kênh bổ sung đường dẫn.</p><p>Bạn quản lý kênh? Thêm link trong <a href="'+base+'bien-tap.html">Bàn biên tập</a>, rồi xuất bản cập nhật.</p>');
 }
 $$('[data-facebook-status]').forEach(el=>{el.textContent=facebook?'Mở trang Facebook trong một tab mới.':'Liên kết Facebook chính thức đang chờ cập nhật.';});
 $$('[data-year]').forEach(el=>{el.textContent=new Date().getFullYear();});
 $$('.brand>span').forEach(el=>{if(el.firstChild?.nodeType===3)el.firstChild.nodeValue=config.name;});
 $$('.editorial-note').forEach(el=>el.textContent=config.contentNote||'');
 if(/^#[0-9a-f]{6}$/i.test(config.accent)&&document.documentElement.dataset.theme!=='light')document.documentElement.style.setProperty('--accent',config.accent);
 if(page==='home'){
   document.title=config.name+' — Công nghệ gần hơn, mỗi ngày';
   const description=$('meta[name="description"]');if(description)description.content=config.description;
   const h1=$('.hero h1');if(h1&&config.tagline!=='Nơi công nghệ không còn khó khăn.')h1.textContent=config.tagline;
   if($('.hero-copy>p'))$('.hero-copy>p').textContent=config.description;
   const featured=articles.find(a=>a.featured)||articles[0];
   if(featured&&$('.hero-feature')){$('.hero-feature').href=articleUrl(featured);$('.feature-copy strong').textContent=featured.title;if($('.feature-read'))$('.feature-read').textContent=featured.minutes+' phút đọc';}
 }
 const email=$('#email-link');if(email&&config.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)){email.href='mailto:'+config.email;email.hidden=false;}
 function updateSaved(){
   const count=$('#saved-count');if(count)count.textContent=saved.filter(id=>articles.some(a=>a.id===id)).length;
   $$('[data-save]').forEach(button=>{
     const state=saved.includes(button.dataset.save);button.setAttribute('aria-pressed',String(state));
     const a=articles.find(a=>a.id===button.dataset.save);button.setAttribute('aria-label',(state?'Bỏ lưu bài: ':'Lưu bài: ')+(a?a.title:''));
   });
 }
 function card(a){return '<article class="article-card" data-article-id="'+E(a.id)+'"><a class="card-visual" href="'+E(articleUrl(a))+'" tabindex="-1" aria-hidden="true"><img src="'+imageUrl(a)+'" alt="" loading="lazy" width="640" height="400"><span class="visual-arrow">'+icon('arrow')+'</span></a><div class="card-body"><div class="card-top">'+tag(a)+'<button class="icon-button bookmark" data-save="'+E(a.id)+'" aria-label="Lưu bài: '+E(a.title)+'" aria-pressed="false">'+icon('bookmark')+'</button></div><h3><a href="'+E(articleUrl(a))+'">'+E(a.title)+'</a></h3><p>'+E(a.excerpt)+'</p><div class="meta">'+meta(a)+'</div></div></article>';}
 const state={category:'all',query:'',sort:'newest',savedOnly:false,limit:6};
 function renderArticles(){
   const grid=$('#article-grid');if(!grid)return;
   const results=C.filter(articles,{...state,saved});
   grid.innerHTML=results.slice(0,state.limit).map(card).join('');
   $('#filter-status').textContent=results.length+' cẩm nang'+(state.savedOnly?' đã lưu':' dành cho bạn')+(state.query?' cho “'+state.query+'”':'');
   $('#empty-state').hidden=results.length>0;
   $('#load-more').hidden=results.length<=state.limit;
   $$('.filter-tab').forEach(el=>{const active=el.dataset.category===state.category;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
   $('#saved-toggle').setAttribute('aria-pressed',String(state.savedOnly));updateSaved();
 }
 function resetFilters(){state.category='all';state.query='';state.sort='newest';state.savedOnly=false;state.limit=6;if($('#article-search'))$('#article-search').value='';if($('#article-sort'))$('#article-sort').value='newest';renderArticles();}
 function showSaved(){state.savedOnly=true;state.category='all';state.query='';state.limit=6;if($('#article-search'))$('#article-search').value='';renderArticles();}
 if(page==='home'){
   if(C.storage.get('th-show-saved',false)){showSaved();C.storage.remove('th-show-saved');}else renderArticles();
   $('#article-search')?.addEventListener('input',e=>{state.query=e.target.value;state.limit=6;renderArticles();});
   $('#article-sort')?.addEventListener('change',e=>{state.sort=e.target.value;state.limit=6;renderArticles();});
   $('#load-more')?.addEventListener('click',()=>{const previous=state.limit;state.limit+=6;renderArticles();const first=$$('.article-card',$('#article-grid'))[previous];first?.querySelector('h3 a')?.focus({preventScroll:true});});
   $('#clear-filters')?.addEventListener('click',resetFilters);
   $('#saved-toggle')?.addEventListener('click',()=>{if(state.savedOnly){state.savedOnly=false;state.limit=6;renderArticles();}else showSaved();});
 }
 function renderArticle(a,dynamic=false){
   const header='<span class="tag tag-'+E(a.category)+'">'+E(cat(a).name)+'</span><h1>'+E(a.title)+'</h1><p class="article-intro">'+E(a.excerpt)+'</p><div class="article-byline"><span class="mini-avatar">TH</span><div><strong>'+E(config.name)+'</strong><div class="meta">'+meta(a)+'</div></div><div class="article-actions"><button class="icon-button bookmark" data-save="'+E(a.id)+'" aria-label="Lưu bài" aria-pressed="false">'+icon('bookmark')+'</button><button class="icon-button" data-share="'+E(a.id)+'" aria-label="Chia sẻ bài">'+icon('share')+'</button></div></div>';
   const body='<div class="takeaway">'+icon('spark')+'<div><strong>Mang theo một điều</strong><p>'+E(a.takeaway)+'</p></div></div>'+a.sections.map((s,i)=>'<section id="phan-'+(i+1)+'"><span class="section-index">'+String(i+1).padStart(2,'0')+'</span><h2>'+E(s.heading)+'</h2><p>'+E(s.text).replace(/\n/g,'<br>')+'</p></section>').join('')+'<div class="article-sources"><h3>Nguồn để bạn đọc thêm</h3>'+(a.sources.length?'<ul>'+a.sources.map(s=>'<li><a href="'+E(C.url(s.url))+'" target="_blank" rel="noopener noreferrer">'+E(s.label)+icon('external')+'</a></li>').join('')+'</ul>':'<p>Chưa có nguồn tham khảo được bổ sung cho bài này.</p>')+'</div><p class="editorial-note">'+E(config.contentNote||'')+'</p><div class="reading-end"><span>Hiểu thêm một điều.<br><strong>Mở thêm một góc nhìn.</strong></span><button class="button button-outline" data-share="'+E(a.id)+'">'+icon('share')+'Chia sẻ cẩm nang</button></div>';
   const toc=a.sections.map((s,i)=>'<a href="#phan-'+(i+1)+'"><span>'+String(i+1).padStart(2,'0')+'</span>'+E(s.heading)+'</a>').join('');
   if(dynamic){
     $('#dynamic-article').innerHTML='<nav class="breadcrumb" aria-label="Vị trí trang"><a href="index.html">Trang chủ</a><span>/</span><a href="index.html#bai-viet">Cẩm nang</a></nav><header class="article-header" id="article-header">'+header+'</header><div class="article-cover"><img src="'+imageUrl(a)+'" alt="'+E(a.imageAlt||'Minh họa '+cat(a).name)+'" width="640" height="400"></div><div class="article-content-layout"><aside class="article-sidebar"><div class="toc"><span class="eyebrow">TRONG CẨM NANG NÀY</span><nav id="article-toc" aria-label="Mục lục bài">'+toc+'</nav></div></aside><article class="prose" id="article-body">'+body+'</article></div><section class="section related-section"><div class="section-heading"><h2>Có thể bạn cũng thích.</h2></div><div class="article-grid">'+articles.filter(x=>x.id!==a.id).slice(0,3).map(card).join('')+'</div></section>';
   }else{
     $('#article-header').innerHTML=header;$('#article-body').innerHTML=body;$('#article-toc').innerHTML=toc;
     const cover=$('.article-cover img');if(cover){cover.src=imageUrl(a);cover.alt=a.imageAlt||'Minh họa '+cat(a).name;}
   }
   document.title=a.title+' — '+config.name;
   const desc=$('meta[name=description]');if(desc)desc.content=a.excerpt;
   updateSaved();
   if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$('#article-toc a').forEach(link=>link.classList.toggle('active',link.hash==='#'+entry.target.id));}}),{rootMargin:'-15% 0px -65% 0px'});$$('#article-body>section').forEach(section=>observer.observe(section));}
 }
 if(page==='article'||page==='dynamic-article'){
   const id=page==='article'?document.body.dataset.article:params.get('id');const a=articles.find(a=>a.id===id);
   if(a)renderArticle(a,page==='dynamic-article');
   else {const target=$('#dynamic-article')||$('#main');target.innerHTML='<div class="error-page"><div class="eyebrow">TECH HORIZON</div><h1>Chưa tìm thấy cẩm nang.</h1><p>Bài này có thể đã được đổi tên hoặc chưa được xuất bản.</p><a class="button button-blue" href="'+base+'index.html#bai-viet">Khám phá cẩm nang khác</a></div>';document.title='Chưa tìm thấy cẩm nang — '+config.name;}
 }
 updateSaved();
 const menu=$('#mobile-menu'),menuButton=$('.menu-button');
 function closeMenu(){if(menu){menu.hidden=true;menuButton?.setAttribute('aria-expanded','false');}}
 menuButton?.addEventListener('click',()=>{const opened=menu.hidden;menu.hidden=!opened;menuButton.setAttribute('aria-expanded',String(opened));});
 menu?.addEventListener('click',e=>{if(e.target.closest('a,button'))closeMenu();});
 window.addEventListener('resize',()=>{if(innerWidth>700)closeMenu();});
 $$('.theme-toggle').forEach(button=>button.addEventListener('click',()=>{
   const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;
   document.documentElement.style.removeProperty('--accent');if(theme==='dark'&&/^#[0-9a-f]{6}$/i.test(config.accent))document.documentElement.style.setProperty('--accent',config.accent);C.storage.set('th-theme',theme);toast(theme==='dark'?'Đã chuyển sang giao diện tối':'Đã chuyển sang giao diện sáng');
 }));
 const searchDialog=$('#search-dialog'),searchInput=$('#global-search');
 function renderSearch(){const results=C.filter(articles,{query:searchInput?.value||''}).slice(0,12);const target=$('#global-results');if(!target)return;target.innerHTML=results.length?results.map(a=>'<a class="search-result" href="'+E(articleUrl(a))+'"><img src="'+imageUrl(a)+'" alt="" width="70" height="48"><span><strong>'+E(a.title)+'</strong><small>'+E(cat(a).name)+' · '+a.minutes+' phút đọc</small></span></a>').join(''):'<p class="search-empty">Chưa có kết quả. Thử một từ khóa khác nhé.</p>';}
 function openSearch(){if(!searchDialog)return;renderSearch();if(!searchDialog.open)searchDialog.showModal();searchInput.focus();}
 searchInput?.addEventListener('input',renderSearch);
 $$('[data-open-search]').forEach(button=>button.addEventListener('click',openSearch));
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}if(e.key==='Escape')closeMenu();});
 $$('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}}));
 async function copy(text){if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return;}const field=document.createElement('textarea');field.value=text;field.style.position='fixed';field.style.opacity='0';const parent=$('dialog[open]')||document.body;parent.appendChild(field);field.select();const ok=document.execCommand('copy');field.remove();if(!ok)throw Error('clipboard');}
 async function share(id){const a=articles.find(a=>a.id===id);if(!a)return;const site=C.url(config.siteUrl);const url=site?site.replace(/\/$/,'')+'/'+(routes.has(a.id)?'bai-viet/'+a.id+'.html':'doc-bai.html?id='+encodeURIComponent(a.id)):new URL(articleUrl(a),location.href).href;
   try{if(navigator.share&&location.protocol!=='file:'){await navigator.share({title:a.title,text:a.excerpt,url});}else{await copy(url);toast('Đã sao chép liên kết cẩm nang.');}}
   catch(error){if(error.name==='AbortError')return;info('Chia sẻ cẩm nang','<p>Sao chép đường dẫn dưới đây để chia sẻ:</p><textarea readonly aria-label="Đường dẫn bài viết">'+E(url)+'</textarea>');}
 }
 document.addEventListener('click',e=>{
   const facebookButton=e.target.closest('[data-facebook]');if(facebookButton){e.preventDefault();openFacebook();return;}
   const saveButton=e.target.closest('[data-save]');if(saveButton){const id=saveButton.dataset.save;try{saved=C.changeSaved(localStorage,id).saved;updateSaved();if(page==='home'&&state.savedOnly)renderArticles();window.dispatchEvent(new CustomEvent('th-saved-change'));toast(saved.includes(id)?'Đã lưu cẩm nang trên trình duyệt này.':'Đã bỏ lưu cẩm nang.');}catch(error){toast(error.message);}return;}
   const shareButton=e.target.closest('[data-share]');if(shareButton){share(shareButton.dataset.share);return;}
   const filter=e.target.closest('[data-category]');if(filter&&page==='home'){state.category=filter.dataset.category;state.limit=6;renderArticles();return;}
   const category=e.target.closest('[data-select-category]');if(category&&page==='home'){state.category=category.dataset.selectCategory;state.savedOnly=false;state.query='';state.limit=6;if($('#article-search'))$('#article-search').value='';renderArticles();return;}
   const footerSaved=e.target.closest('[data-footer-saved]');if(footerSaved){if(page==='home'){showSaved();}else C.storage.set('th-show-saved',true);}
 });
 function syncSaved(){try{saved=C.savedList(localStorage.getItem('th-saved'));updateSaved();if(page==='home'&&state.savedOnly)renderArticles();}catch{toast('Chưa đọc được danh sách bài đã lưu. Mở Dữ liệu & hiển thị để giữ bản phục hồi.');}}
 window.addEventListener('storage',e=>{if(e.key==='th-saved'||e.key===null)syncSaved();});window.addEventListener('th-saved-change',syncSaved);
 $('#exit-preview')?.addEventListener('click',()=>{C.storage.remove('th-preview');params.delete('preview');location.search=params.toString();});
 $('#topic-form')?.addEventListener('submit',e=>{
   e.preventDefault();const topic=$('#topic-name').value.trim();if(topic.length<3){$('#topic-name').focus();return;}
   const message='Chào '+config.name+'! Mình muốn kênh chia sẻ thêm về: '+topic+'\nCảm ơn kênh!';
   info('Gợi ý chủ đề cho kênh','<h3>Một điều bạn đang tò mò.</h3><p>Nội dung đã được soạn bên dưới. Hãy sao chép và gửi cho kênh qua Facebook'+(config.email?' hoặc email':'')+'. Chưa có tin nhắn nào được gửi.</p><textarea id="topic-message" readonly aria-label="Nội dung gợi ý">'+E(message)+'</textarea><button class="button button-blue" id="copy-topic">Sao chép nội dung</button>'+(facebook?'<button class="button button-outline" data-facebook>Mở Facebook của kênh '+icon('arrow')+'</button>':''));
   $('#copy-topic')?.addEventListener('click',async()=>{try{await copy(message);toast('Đã sao chép. Bạn có thể dán và gửi cho kênh.');$('#copy-topic').textContent='Đã sao chép';}catch{$('#topic-message').select();$('#copy-topic').textContent='Hãy nhấn Ctrl + C để sao chép';}});
 });
 $('#clear-local-data')?.addEventListener('click',()=>{
   info('Xóa dữ liệu trên thiết bị','<h3>Xóa dữ liệu Tech Horizon?</h3><p>Thao tác này xóa bài đã lưu, lựa chọn giao diện và bản nháp biên tập trên trình duyệt này. Hãy xuất bản nháp trước nếu bạn muốn giữ lại.</p><button class="button button-outline" id="confirm-clear">Xóa dữ liệu trên trình duyệt này</button>');
   $('#confirm-clear')?.addEventListener('click',()=>{['th-saved','th-theme','th-draft','th-preview','th-show-saved','th-progress','th-reader-size','th-studio-prompt','th-publish-checks','th-editor-history'].forEach(C.storage.remove);location.reload();});
 });
 const backTop=$('.back-top');
 function onScroll(){backTop?.classList.toggle('visible',scrollY>650);const bar=$('#reading-progress');if(bar){const total=document.documentElement.scrollHeight-innerHeight;bar.style.width=(total>0?Math.min(100,scrollY/total*100):0)+'%';}}
 window.addEventListener('scroll',onScroll,{passive:true});onScroll();backTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
})();
