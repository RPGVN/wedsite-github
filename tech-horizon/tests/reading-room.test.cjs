const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('../dist/assets/core.js'),L=require('../dist/assets/reading-core.js'),Q=require('../dist/assets/quality-core.js'),R=require('../dist/assets/renderer.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/site-data.js'),'utf8'),context);const D=JSON.parse(JSON.stringify(context.window.TECH_HORIZON));
const memory=initial=>{const data=new Map(Object.entries(initial||{}));return {data,getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};};
const [first,second,third]=D.articles,record=(percent,note='',updated='2026-10-19T08:00:00Z')=>({percent,note,updated});
test('Saving from a stale page preserves articles saved by another page and uses current toggle state',()=>{
 const storage=memory({'th-saved':JSON.stringify([first.id])});C.changeSaved(storage,second.id);assert.deepEqual(C.changeSaved(storage,third.id).saved,[first.id,second.id,third.id]);
 assert.deepEqual(C.changeSaved(storage,second.id).saved,[first.id,third.id]);assert.deepEqual(C.changeSaved(storage,first.id,true).saved.sort(),[first.id,third.id].sort());
});
test('Malformed saved lists are preserved instead of silently replaced',()=>{
 for(const raw of ['broken','{}','[7]','["../bad"]','["has space"]']){const storage=memory({'th-saved':raw});assert.throws(()=>C.changeSaved(storage,first.id));assert.equal(storage.getItem('th-saved'),raw);}
 assert.deepEqual(C.savedList(null),[]);assert.deepEqual(C.savedList('["one","one","old-guide"]'),['one','old-guide']);
 const storage=memory();storage.setItem=()=>{throw Error('quota');};assert.throws(()=>C.changeSaved(storage,first.id),/hết dung lượng/);
});
test('A restore confirmation rejects either changed key before it writes anything',()=>{
 const storage=memory({'th-saved':JSON.stringify([first.id]),'th-progress':'{}'}),expected={'th-saved':storage.getItem('th-saved'),'th-progress':'{}'};
 storage.setItem('th-progress',JSON.stringify({[second.id]:record(22,'new note')}));const prior=[...storage.data];assert.throws(()=>C.replaceReader(storage,{saved:[],progress:{}},expected),/tab khác/);assert.deepEqual([...storage.data],prior);
});
test('Reader restore rolls back the first write after a quota failure, including an originally missing key',()=>{
 for(const original of [null,JSON.stringify([first.id])]){const storage=memory({'th-progress':'{}'});if(original!==null)storage.setItem('th-saved',original);const set=storage.setItem;storage.setItem=(key,value)=>{if(key==='th-progress')throw Error('quota');set(key,value);};assert.throws(()=>C.replaceReader(storage,{saved:[second.id],progress:{[second.id]:record(25)}},{'th-saved':original,'th-progress':'{}'}),/hoàn lại/);assert.equal(storage.getItem('th-saved'),original);assert.equal(storage.getItem('th-progress'),'{}');}
});
test('Reader rollback preserves a concurrent change instead of replacing it with a stale snapshot',()=>{
 const storage=memory({'th-saved':'[]','th-progress':'{}'}),set=storage.setItem;storage.setItem=(key,value)=>{if(key==='th-progress'){set('th-saved',JSON.stringify([third.id]));throw Error('quota');}set(key,value);};assert.throws(()=>C.replaceReader(storage,{saved:[second.id],progress:{}},{'th-saved':'[]','th-progress':'{}'}),/chưa hoàn lại/);assert.equal(storage.getItem('th-saved'),JSON.stringify([third.id]));
});
test('Collection counts are based on real guides, combine private notes and apply Vietnamese search',()=>{
 const progress={[first.id]:record(38,'Tôi muốn thử lại góc chụp'),[second.id]:record(100),missing:record(20,'ignore')},copy=structuredClone(progress),result=L.collection(D,[first.id,third.id,'missing'],progress,{tab:'all',query:'thu lai goc chup'});
 assert.equal(result.rows.length,1);assert.equal(result.rows[0].article.id,first.id);assert.deepEqual(result.counts,{saved:2,reading:1,completed:1,notes:1,all:3});assert.equal(result.rows[0].remaining,Math.ceil(first.minutes*.62));assert.deepEqual(progress,copy);
});
test('Reading order uses timestamps and remaining time while completed entries have no remaining minutes',()=>{
 const progress={[first.id]:record(50,'','2026-10-19T16:00:00+07:00'),[second.id]:record(100,'','2026-10-19T08:30:00Z')};
 assert.equal(L.collection(D,[],progress,{tab:'all'}).rows[0].article.id,first.id);const shortest=L.collection(D,[],progress,{tab:'all',sort:'remaining'});assert.equal(shortest.rows[0].article.id,second.id);assert.equal(shortest.rows[0].remaining,0);
 assert.equal(L.collection(D,[first.id],progress,{tab:'saved',category:'missing'}).state.category,'all');assert.equal(L.options(D,{tab:'fake',sort:'fake',query:'a'.repeat(500)}).query.length,100);
});
test('Notes TXT exports the current filtered collection, preserving text without adding it to URLs',()=>{
 const result=L.collection(D,[],{[first.id]:record(20,'Dòng riêng <script>\nCó tiếng Việt'),[second.id]:record(22,'không xuất')},{tab:'notes',query:'dong rieng'}),text=L.notesText(result.rows,D.config);
 assert.ok(text.includes('Dòng riêng <script>\nCó tiếng Việt'));assert.ok(!text.includes('không xuất'));assert.ok(text.includes('bai-viet/'+first.id+'.html'));assert.ok(!text.includes('?query='));
});
test('Public projection keeps every supported field, deeply clones and drops extra metadata at every level',()=>{
 const data=structuredClone(D);data.privateNote='PRIVATE-FOREIGN-934';data.config.session='PRIVATE-FOREIGN-934';data.articles[0].draftNote='PRIVATE-FOREIGN-934';data.articles[0].sections[0].note='PRIVATE-FOREIGN-934';data.articles[0].sources[0].token='PRIVATE-FOREIGN-934';data.journeys[0].notes='PRIVATE-FOREIGN-934';data.glossary[0].private='PRIVATE-FOREIGN-934';data.articles[0].imageAlt='Mô tả ảnh tiếng Việt';
 const result=C.publicData(data);assert.ok(!JSON.stringify(result).includes('PRIVATE-FOREIGN-934'));assert.equal(result.articles[0].imageAlt,'Mô tả ảnh tiếng Việt');assert.equal(data.privateNote,'PRIVATE-FOREIGN-934');result.journeys[0].articles.pop();assert.notEqual(result.journeys[0].articles.length,data.journeys[0].articles.length);
 for(const content of Object.values(R.build(data)))assert.ok(!content.includes('PRIVATE-FOREIGN-934'));
});
test('Publication diff detects changed fields, additions and removed routes without treating property order as an edit',()=>{
 const data=structuredClone(D);data.articles[0]={...data.articles[0],title:'Tiêu đề mới',sections:[...data.articles[0].sections.map(s=>({...s}))]};data.config.tagline='Lời nhắn mới';data.articles=data.articles.filter(a=>a.id!==second.id);data.journeys=data.journeys.map(j=>({...j,articles:j.articles.filter(id=>id!==second.id)})).filter(j=>j.articles.length);const added={...structuredClone(third),id:'bai-moi-v8'};data.articles.push(added);const diff=Q.changes(data,D);
 assert.deepEqual(diff.updated[0].fields,['Tiêu đề']);assert.equal(diff.added[0].id,'bai-moi-v8');assert.equal(diff.removed[0].id,second.id);assert.equal(diff.config[0].key,'tagline');assert.ok(Q.report(data,D).includes('bai-viet/'+second.id+'.html'));
 const reordered=structuredClone(D);reordered.articles[0]=Object.fromEntries(Object.entries(reordered.articles[0]).reverse());assert.equal(Q.changes(reordered,D).total,0);
});
test('Public diff ignores private metadata and never includes omitted values in its report',()=>{
 const data=structuredClone(D);data.privateNote='PRIVATE-REPORT-731';data.articles[0].private='PRIVATE-REPORT-731';const diff=Q.changes(data,D);assert.equal(diff.total,0);assert.equal(diff.omitted,2);assert.ok(!Q.report(data,D).includes('PRIVATE-REPORT-731'));
});
test('The reading room dependencies load only where needed and survive browser export packaging',()=>{
 const files=R.build(D),html=files['thu-vien.html'];assert.ok(html.indexOf('reading-core.js')<html.indexOf('premium.js'));assert.ok(!files['index.html'].includes('reading-core.js'));for(const id of ['library-query','library-category','library-sort','library-export-notes','library-filter-status','library-resume'])assert.ok(html.includes('id="'+id+'"'));
 const packContext={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/assets/package-assets.js'),'utf8'),packContext);assert.ok(packContext.window.TH_PACKAGE.files['assets/reading-core.js']);
 const editor=fs.readFileSync(require.resolve('../dist/bien-tap.html'),'utf8');for(const id of ['panel-review','editor-change-summary','editor-change-details','review-pending','download-change-report'])assert.ok(editor.includes('id="'+id+'"'));
});
function readingRoom(storage){
 const elements=new Map(),listeners=new Map(),tabs=[],document={activeElement:null,body:{dataset:{page:'library',base:''}}};
 class Element{
  constructor(id=''){this.id=id;this.value='';this.dataset={};this.events={};this.hidden=false;this.textContent='';this.classList={add(){},remove(){},toggle(){}};}
  set innerHTML(value){this.html=value;for(const match of value.matchAll(/\bid="([^"]+)"/g))elements.set(match[1],new Element(match[1]));}
  get innerHTML(){return this.html||'';}
  addEventListener(key,fn){(this.events[key]||=[]).push(fn);}
  async fire(key,event={}){for(const fn of this.events[key]||[])await fn({target:this,preventDefault(){},...event});}
  querySelectorAll(){return [];}
  setAttribute(key,value){this[key]=value;}
  focus(){document.activeElement=this;}
  closest(){return null;}
  showModal(){this.open=true;}
  close(){this.open=false;}
 }
 const html=R.build(D)['thu-vien.html'];for(const match of html.matchAll(/\bid="([^"]+)"/g))elements.set(match[1],new Element(match[1]));for(const key of ['saved','reading','completed','notes','all']){const el=new Element();el.dataset.libraryTab=key;tabs.push(el);}
 document.querySelector=selector=>selector.startsWith('#')?elements.get(selector.slice(1))||null:null;document.querySelectorAll=selector=>selector==='[data-library-tab]'?tabs:[];
 const api={...C,storage:{get(key,fallback){try{const raw=storage.getItem(key);return raw===null?fallback:JSON.parse(raw);}catch{return fallback;}}}},window={THCore:api,THReading:L,TECH_HORIZON:D,TH_STATIC_ROUTES:D.articles.map(a=>a.id),addEventListener(key,fn){(listeners.get(key)||listeners.set(key,[]).get(key)).push(fn);},dispatchEvent(event){for(const fn of listeners.get(event.type)||[])fn(event);}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/assets/premium.js'),'utf8'),{window,document,localStorage:storage,location:{search:''},URLSearchParams,URL,CustomEvent:class{constructor(type){this.type=type;}},setTimeout:()=>1,clearTimeout(){}});
 return {elements,tabs,window};
}
test('Reading room controller renders personal data, filters notes and refreshes after a saved-list event',async()=>{
 const storage=memory({'th-saved':JSON.stringify([first.id]),'th-progress':JSON.stringify({[first.id]:record(40,'Ghi lại góc chụp'),[second.id]:record(100)})}),{elements,tabs,window}=readingRoom(storage);
 assert.equal(elements.get('library-saved-count').textContent,1);assert.ok(elements.get('library-resume-title').textContent.includes(first.title));
 await tabs.find(t=>t.dataset.libraryTab==='notes').fire('click');const input=elements.get('library-query');input.value='goc chup';await input.fire('input');assert.ok(elements.get('library-results').innerHTML.includes('Ghi lại góc chụp'));assert.equal(elements.get('library-export-notes').disabled,false);
 input.value='không có ghi chú này';await input.fire('input');assert.equal(elements.get('library-empty').hidden,false);assert.equal(elements.get('library-export-notes').disabled,true);
 storage.setItem('th-saved',JSON.stringify([first.id,third.id]));window.dispatchEvent({type:'th-saved-change'});assert.equal(elements.get('library-saved-count').textContent,2);
});
test('Reading room import dialog refuses a stale confirmation then restores a newly reviewed file',async()=>{
 const storage=memory({'th-saved':'[]','th-progress':'{}'}),{elements}=readingRoom(storage),input=elements.get('import-reader'),backup={type:'tech-horizon-reader',version:1,saved:[first.id],progress:{[first.id]:record(38,'ghi chú khôi phục')}};input.files=[{size:200,text:async()=>JSON.stringify(backup)}];
 await input.fire('change');storage.setItem('th-progress',JSON.stringify({[second.id]:record(72,'vừa nhập từ tab khác')}));await elements.get('confirm-reader-import').fire('click');assert.ok(elements.get('reader-import-status').textContent.includes('tab khác'));assert.equal(storage.getItem('th-saved'),'[]');
 await input.fire('change');await elements.get('confirm-reader-import').fire('click');assert.equal(elements.get('library-saved-count').textContent,1);assert.equal(JSON.parse(storage.getItem('th-progress'))[first.id].note,'ghi chú khôi phục');assert.equal(elements.get('info-dialog').open,false);
});
