const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('../dist/assets/core.js'),M=require('../dist/assets/editorial-markup.js'),Q=require('../dist/assets/quality-core.js'),R=require('../dist/assets/renderer.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/site-data.js'),'utf8'),ctx);const D=JSON.parse(JSON.stringify(ctx.window.TECH_HORIZON));
test('Directory counts and navigation are grounded in imported content and stay escaped',()=>{
 const data=structuredClone(D);data.articles[0].title='Bài $& <mới>';data.categories[0].name='Chủ đề <nhập>';data.glossary.push({id:'term-moi',term:'Mới',definition:'Định nghĩa',category:'ai',url:'https://example.com'});
 const files=R.build(data),html=files['ban-do.html'];assert.ok(html.includes('21 định nghĩa'));assert.ok(files['sitemap.xml'].includes('/ban-do.html'));assert.ok(files['index.html'].includes('home-paths'));
 for(const group of M.pageGroups(data))for(const [path]of group.items)assert.ok(html.includes('href="'+path+'"'));
 const article=files['bai-viet/'+data.articles[0].id+'.html'];assert.ok(article.includes('Bài $&amp; &lt;mới&gt;'));assert.ok(!article.includes('Bài <main'));assert.ok(article.includes('href="../chuyen-muc/ai.html"'));assert.equal((article.match(/class="site-crumbs"/g)||[]).length,1);assert.ok(!article.includes('class="breadcrumb"'));
});
test('Auxiliary routes retain useful next destinations, privacy scope and supported help anchors',()=>{
 const files=R.build(D);for(const file of ['thuc-hanh.html','studio.html','chuyen-de.html','thuat-ngu.html','thu-vien.html','du-lieu.html','huong-dan.html','gioi-thieu.html','dieu-hanh.html','chinh-sach.html']){assert.ok(files[file].includes('class="section-rail"'),file);assert.ok(files[file].includes('class="container page-next"'),file);}
 assert.ok(files['404.html'].includes('id="search-dialog"'));assert.ok(files['404.html'].includes('href="ban-do.html"'));assert.ok(files['huong-dan.html'].includes('id="go-roi"'));for(const id of ['hien-thi','ban-sao','cau-hinh','xoa-nhom'])assert.ok(files['du-lieu.html'].includes('id="'+id+'"'));assert.ok(files['chinh-sach.html'].includes('policy-facts'));
 assert.equal((files['studio.html'].match(/class="tool-context"/g)||[]).length,6);assert.ok(files['studio.html'].includes('id="studio-chooser"'));
});
test('Glossary search combines Vietnamese definitions and category and sorting leaves source order intact',()=>{
 const before=JSON.stringify(D),rows=M.glossaryEntries(D,C,{query:'bo nho',category:'devices',sort:'az'});assert.ok(rows.length);assert.ok(rows.every(t=>t.category==='devices'));assert.equal(M.glossaryEntries(D,C,{query:'ram',category:'ai'}).length,0);
 const sorted=M.glossaryEntries(D,C,{sort:'az'});assert.ok(sorted.findIndex(t=>t.term==='API')<sorted.findIndex(t=>t.term==='RAM'));assert.equal(JSON.stringify(D),before);
 const html=M.terms(D,C,a=>'doc-bai.html?id='+a.id);assert.ok(html.includes('Đọc trong một tình huống'));assert.ok(html.includes('href="#ram"'));assert.ok(html.includes('href="doc-bai.html?id='));
});
test('Journey filters distinguish a partly read first article from a new or complete path',()=>{
 const journey=D.journeys[0],progress={[journey.articles[0]]:{percent:20}},before=JSON.stringify(D);
 assert.ok(M.journeyEntries(D,C,{state:'active'},progress).some(r=>r.journey.id===journey.id));assert.ok(!M.journeyEntries(D,C,{state:'new'},progress).some(r=>r.journey.id===journey.id));
 for(const id of journey.articles)progress[id]={percent:95};assert.ok(M.journeyEntries(D,C,{state:'done'},progress).some(r=>r.journey.id===journey.id));assert.ok(!M.journeyEntries(D,C,{state:'active'},progress).some(r=>r.journey.id===journey.id));
 assert.equal(M.journeyEntries(D,C,{minutes:'0'}).length,D.journeys.length);assert.equal(M.journeyEntries(D,C,{minutes:1}).length,0);assert.ok(M.journeyEntries(D,C,{category:journey.category}).every(r=>r.journey.category===journey.category));assert.equal(JSON.stringify(D),before);
});
test('Editorial work queue combines omissions, changed content, featured and sorting without mutating a draft',()=>{
 const data=structuredClone(D),a=data.articles[0];a.title='Nội dung đã chỉnh';a.sources=[];const added=structuredClone(data.articles[1]);added.id='bai-moi-cho-hang-doi';added.featured=true;data.articles.push(added);const before=JSON.stringify(data);
 const warnings=Q.queue(data,D,{state:'review'});assert.ok(warnings.some(row=>row.article.id===a.id&&row.warnings.some(w=>w.label==='Nguồn đọc thêm')));
 const changed=Q.queue(data,D,{state:'changed'});assert.deepEqual(changed.map(row=>row.change).sort(),['added','updated']);assert.ok(Q.queue(data,D,{state:'featured'}).every(row=>row.article.featured));assert.equal(Q.queue(data,D,{state:'changed',query:'cho-hang-doi'})[0].article.id,added.id);assert.equal(JSON.stringify(data),before);
});
function surface(page,{search='',hash='',raw=null,draft=null}={}){
 const nodes=new Map(),events={},writes=[],document={body:{dataset:{page}},activeElement:null};
 class Element{
  constructor(id){this.id=id;this.value='';this.hidden=false;this.disabled=false;this.events={};this.children=[];const names=new Set();this.classList={add:k=>names.add(k),remove:k=>names.delete(k),contains:k=>names.has(k)};}
  addEventListener(name,fn){(this.events[name]||=[]).push(fn);}fire(name,event={}){for(const fn of this.events[name]||[])fn({target:this,preventDefault(){},...event});}focus(){document.activeElement=this;}appendChild(child){this.children=this.children.filter(x=>x!==child);this.children.push(child);}scrollIntoView(){this.scrolled=true;}set innerHTML(html){this.html=html;}get innerHTML(){return this.html||'';}
 }
 const file=page==='glossary'?'thuat-ngu.html':'chuyen-de.html',data=draft||D;
 for(const match of R.build(data)[file].matchAll(/\bid="([^"]+)"/g))nodes.set(match[1],new Element(match[1]));
 document.querySelector=selector=>selector.startsWith('#')?nodes.get(selector.slice(1))||null:selector.startsWith('[data-term=')?nodes.get(selector.match(/"([^"]+)"/)[1])||null:null;document.getElementById=id=>nodes.get(id)||null;
 const location={href:'https://example.com/'+file+search+hash,search,hash},history={replaceState(_,__,url){this.url=String(url);const u=new URL(url);location.href=u.href;location.search=u.search;location.hash=u.hash;}},storage={getItem:()=>raw,setItem:(...args)=>writes.push(args)};
 const window={THCore:{...C,storage:{get:(key,fallback)=>key==='th-draft'?draft:key==='th-preview'?!!draft:fallback}},THEditorial:M,TECH_HORIZON:D,addEventListener:(name,fn)=>(events[name]||=[]).push(fn)};
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/assets/sections.js'),'utf8'),{window,document,localStorage:storage,location,history,URL,URLSearchParams});
 return {nodes,location,history,writes,setRaw:value=>raw=value,fire(name,event){if(name==='hashchange'){const url=new URL(location.href);url.hash=location.hash;location.href=url.href;}for(const fn of events[name]||[])fn(event);},document};
}
test('Glossary controller restores public filters, sorts, resets and reveals a directly linked hidden term',()=>{
 const s=surface('glossary',{search:'?category=ai&q=prompt&sort=az'}),e=s.nodes;assert.equal(e.get('term-category').value,'ai');assert.equal(e.get('ram').hidden,true);assert.equal(e.get('prompt').hidden,false);
 s.location.hash='#ram';s.fire('hashchange');assert.equal(e.get('ram').hidden,false);assert.ok(e.get('ram').classList.contains('term-selected'));assert.ok(!s.history.url.includes('category='));assert.ok(s.history.url.endsWith('#ram'));
 e.get('term-query').value='khong-co-thuat-ngu-123';e.get('term-query').fire('input');assert.equal(e.get('term-empty').hidden,false);assert.ok(!s.history.url.includes('#ram'));e.get('term-reset-empty').fire('click');assert.equal(e.get('term-empty').hidden,true);assert.equal(s.document.activeElement,e.get('term-query'));assert.equal(s.writes.length,0);
});
test('Journey controller uses local reading state without sharing it and disables it on malformed storage',()=>{
 const journey=D.journeys[0],progress={[journey.articles[0]]:{percent:30,note:'PRIVATE-NOTE-888',updated:'2026-10-19T00:00:00.000Z'}},s=surface('journeys',{raw:JSON.stringify(progress)}),e=s.nodes;
 e.get('journey-state').value='active';e.get('journey-state').fire('change');assert.equal(e.get(journey.id).hidden,false);assert.ok(!s.history.url.includes('state'));assert.ok(!s.history.url.includes('PRIVATE-NOTE'));
 e.get('journey-minutes').value='15';e.get('journey-minutes').fire('change');assert.ok(s.history.url.includes('minutes=15'));s.setRaw('{broken');s.fire('storage',{key:'th-progress'});assert.equal(e.get('journey-state').disabled,true);assert.equal(e.get('journey-state').value,'all');assert.ok(e.get('journey-count').textContent.includes('Chưa đọc được tiến độ'));assert.equal(s.writes.length,0);
});
test('Preview filters and deep links include newly imported collections and categories',()=>{
 const data=structuredClone(D);data.categories.push({id:'nhap-moi',name:'Nhập mới',short:'Mới',description:'Chủ đề mới',icon:'spark'});data.journeys.push({id:'mach-moi',title:'Mạch mới',description:'Đọc từ bản nháp',category:'nhap-moi',articles:[data.articles[0].id]});data.glossary.push({id:'khai-niem-moi',term:'Khái niệm mới',definition:'Chỉ có trong bản nháp',category:'nhap-moi',url:'https://example.com'});
 const s=surface('journeys',{draft:data,search:'?category=nhap-moi'});assert.equal(s.nodes.get('mach-moi').hidden,false);assert.ok(s.nodes.get('journey-category').innerHTML.includes('nhap-moi'));const g=surface('glossary',{draft:data,hash:'#khai-niem-moi'});assert.equal(g.nodes.get('khai-niem-moi').hidden,false);
});
test('Section scripts load only on lookup pages while every dependency remains available offline',()=>{
 const files=R.build(D);for(const file of ['chuyen-de.html','thuat-ngu.html'])assert.ok(files[file].includes('src="assets/sections.js"'));for(const file of ['index.html','thu-vien.html','studio.html'])assert.ok(!files[file].includes('src="assets/sections.js"'));
 const pack={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/assets/package-assets.js'),'utf8'),pack);for(const file of ['sections.css','sections.js'])assert.ok(pack.window.TH_PACKAGE.files['assets/'+file]);
});
