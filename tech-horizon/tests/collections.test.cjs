const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('../dist/assets/core.js'),K=require('../dist/assets/collections-editor.js'),R=require('../dist/assets/renderer.js');const context={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/site-data.js'),'utf8'),context);const D=JSON.parse(JSON.stringify(context.window.TECH_HORIZON));
test('Journey edits preserve chosen order, use existing guides and do not mutate the source',()=>{
 const before=structuredClone(D),record={id:'mach-doc-moi',title:'Mạch đọc mới',description:'Từ câu hỏi tới thực hành',category:'ai',articles:[D.articles[1].id,D.articles[0].id]},next=K.putJourney(D,record);assert.deepEqual(next.journeys.at(-1).articles,record.articles);assert.deepEqual(D,before);assert.deepEqual(C.validate(next),[]);const html=R.build(next)['chuyen-de.html'];assert.ok(html.includes('id="mach-doc-moi"'));assert.ok(html.includes('Mạch đọc mới'));
 for(const articles of [[],['missing'],[D.articles[0].id,D.articles[0].id]])assert.throws(()=>K.putJourney(D,{...record,articles}));
});
test('Journey renaming, reordering and deletion preserve articles and reject duplicate anchors',()=>{
 const current=D.journeys[0],next=K.putJourney(D,{...current,id:'lo-trinh-doi-ten',articles:K.move(current.articles,0,1)},current.id);assert.ok(!next.journeys.some(j=>j.id===current.id));assert.equal(next.journeys[0].articles[1],current.articles[0]);assert.equal(K.remove(next,'journeys','lo-trinh-doi-ten').articles.length,D.articles.length);assert.throws(()=>K.putJourney(D,{...current,id:D.journeys[1].id},current.id));assert.deepEqual(K.move(['a','b'],0,-1),['a','b']);
});
test('Term editing validates HTTPS sources and preserves text safely in public output',()=>{
 const term={id:'khai-niem-moi',term:'Khái niệm <mới>',definition:'Giải thích & ví dụ dễ hiểu.',category:'ai',url:'https://example.com/source'},next=K.putTerm(D,term);assert.deepEqual(D.glossary.length,20);assert.ok(R.build(next)['thuat-ngu.html'].includes('Khái niệm &lt;mới&gt;'));
 for(const change of [{url:'javascript:alert(1)'},{url:'https://u:p@example.com'},{category:'missing'},{id:D.glossary[0].id},{definition:''}])assert.throws(()=>K.putTerm(D,{...term,...change}));
 const renamed=K.putTerm(next,{...term,id:'doi-ma'},term.id);assert.ok(!renamed.glossary.some(t=>t.id===term.id));assert.equal(K.remove(renamed,'glossary','doi-ma').glossary.length,20);
});
test('Duplicate glossary and journey IDs from imports fail before generating duplicate HTML anchors',()=>{
 for(const key of ['glossary','journeys']){const data=structuredClone(D);data[key].push(structuredClone(data[key][0]));assert.ok(C.validate(data).length);assert.throws(()=>R.build(data));const numeric=structuredClone(D);numeric[key][0].id=123;assert.ok(C.validate(numeric).length);}
});
function workspace(){
 const elements=new Map(),html=fs.readFileSync(require.resolve('../dist/bien-tap.html'),'utf8');let data=structuredClone(D),mounted,blocked=false,errors=[];
 class Element{constructor(id){this.id=id;this.value='';this.dataset={};this.events={};this.textContent='';this.hidden=false;}addEventListener(key,fn){(this.events[key]||=[]).push(fn);}fire(key,event={}){for(const fn of this.events[key]||[])fn({target:this,preventDefault(){},...event});}focus(){}closest(){return this;}set innerHTML(html){this.html=html;}get innerHTML(){return this.html||'';}}
 for(const match of html.matchAll(/\bid="([^"]+)"/g))elements.set(match[1],new Element(match[1]));
 for(const [id,fields]of [['journey-form',{id:'journey-id',title:'journey-title',description:'journey-description',category:'journey-category'}],['term-form',{id:'edit-term-id',term:'edit-term-name',definition:'edit-term-definition',category:'edit-term-category',url:'edit-term-url'}]]){const form=elements.get(id),controls=Object.fromEntries(Object.entries(fields).map(([key,id])=>[key,elements.get(id)]));form.controls=controls;form.elements={namedItem:key=>controls[key]};form.reset=()=>Object.values(controls).forEach(field=>field.value='');form.reportValidity=()=>Object.values(controls).every(field=>field.value.trim());form.requestSubmit=()=>form.fire('submit');}
 const window={THCore:C,confirm:()=>true},document={getElementById:id=>elements.get(id)},FormData=class{constructor(form){this.values=Object.entries(form.controls).map(([key,field])=>[key,field.value]);}[Symbol.iterator](){return this.values[Symbol.iterator]();}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/assets/collections-editor.js'),'utf8'),{window,document,FormData});mounted=window.THCollections.mount({getData:()=>data,persist(next){if(blocked)return false;data=next;mounted.render();return true;},onError:text=>errors.push(text),onStatus(){}});
 return {elements,mounted,data:()=>data,errors,block:()=>blocked=true};
}
test('Collection controller adds and reorders a journey and saves it through the shared draft writer',()=>{
 const {elements:e,mounted,data}=workspace();for(const [id,value]of [['journey-id','moi-tu-bieu-mau'],['journey-title','Mạch từ biểu mẫu'],['journey-description','Một mạch mới'],['journey-category','ai']])e.get(id).value=value;e.get('journey-form').fire('input');
 for(const article of D.articles.slice(0,2)){e.get('journey-article-picker').value=article.id;e.get('journey-add-article').fire('click');}const target={dataset:{stepDown:'0'},closest(){return this;}};e.get('journey-ordered-articles').fire('click',{target});assert.equal(mounted.dirty(),true);assert.equal(mounted.savePending(),true);assert.equal(data().journeys.at(-1).articles[0],D.articles[1].id);assert.equal(mounted.dirty(),false);
});
test('Collection controller preserves unsaved term text for recovery when the draft writer blocks',()=>{
 const {elements:e,mounted,data,block}=workspace();for(const [id,value]of [['edit-term-id','term-phuc-hoi'],['edit-term-name','Khái niệm đang nhập'],['edit-term-definition','Nội dung cần giữ lại'],['edit-term-category','tips'],['edit-term-url','https://example.com']])e.get(id).value=value;e.get('term-form').fire('input');block();assert.equal(mounted.savePending(),false);assert.equal(mounted.capture().term.definition,'Nội dung cần giữ lại');assert.equal(mounted.dirty(),true);assert.equal(data().glossary.length,20);
});
test('Collection controller rejects an unsafe term source without saving it',()=>{
 const {elements:e,mounted,data,errors}=workspace();for(const [id,value]of [['edit-term-id','bad-source'],['edit-term-name','Khái niệm'],['edit-term-definition','Mô tả'],['edit-term-category','ai'],['edit-term-url','http://example.com']])e.get(id).value=value;e.get('term-form').fire('input');assert.equal(mounted.savePending(),false);assert.ok(errors[0].includes('HTTPS'));assert.equal(data().glossary.length,20);
});
test('Owner collections editor is included in the offline package and omitted from visitor script loading',()=>{
 const pack={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/assets/package-assets.js'),'utf8'),pack);assert.ok(pack.window.TH_PACKAGE.files['assets/collections-editor.js']);const files=R.build(D);assert.ok(!files['index.html'].includes('src="assets/collections-editor.js"'));
});
