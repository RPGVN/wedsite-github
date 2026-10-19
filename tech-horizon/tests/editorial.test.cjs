const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('../dist/assets/core.js'),W=require('../dist/assets/workbench.js'),K=require('../dist/assets/creator-core.js'),M=require('../dist/assets/editorial-markup.js'),R=require('../dist/assets/renderer.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/site-data.js'),'utf8'),context);const D=JSON.parse(JSON.stringify(context.window.TECH_HORIZON));
const memory=()=>{const data=new Map();return {data,getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};};
test('Universal search finds words inside the guide and returns a bounded contextual excerpt',()=>{
 const data=structuredClone(D),a=data.articles[0];a.title='Một tiêu đề riêng';a.excerpt='Giới thiệu ngắn';a.takeaway='Điều nên nhớ';a.sections=[{heading:'Phần đầu',text:'Nội dung trước. '.repeat(30)+'Từ khóa zentoro nằm trong nội dung chính.'}];
 const result=W.search(data,'zentoro','article');assert.equal(result[0].id,a.id);assert.ok(result[0].description.includes('zentoro'));assert.ok(result[0].description.length<170);assert.ok(!Object.hasOwn(result[0],'_text'));
 assert.equal(W.search(D,'RAM','term')[0].id,'ram');assert.equal(W.search(D,'xyzkhongtontai').length,0);
});
test('Search highlights Vietnamese without losing original accents and escapes HTML in every segment',()=>{
 assert.equal(W.highlight('Đường truyền & dữ liệu','duong du lieu'),'<mark>Đường</mark> truyền &amp; <mark>dữ</mark> <mark>liệu</mark>');
 const html=W.highlight('<img src=x onerror=alert(1)> RAM & SSD','ram');assert.ok(!html.includes('<img'));assert.ok(html.includes('&lt;img'));assert.ok(html.includes('<mark>RAM</mark>'));assert.ok(html.includes('&amp;'));
 assert.equal(W.highlight('cafe\u0301','cafe'),'<mark>cafe\u0301</mark>');assert.equal(W.highlight('🤖 RAM','ram'),'🤖 <mark>RAM</mark>');assert.equal(W.highlight('RAM','ra ram'),'<mark>RAM</mark>');
});
test('Topic map uses current names and counts and custom categories get a working fallback image',()=>{
 const data=structuredClone(D),cat={id:'new-topic',name:'Góc <mới>',description:'Ý & cách làm',short:'Mới',icon:'spark'};data.categories.push(cat);
 const html=M.topics(data,C);assert.ok(html.includes('Góc &lt;mới&gt;'));assert.ok(html.includes('chuyen-muc/new-topic.html'));assert.ok(html.includes('0 CẨM NANG'));assert.equal(M.topicImage('new-topic'),'assets/network.svg');
 const intro=M.categoryIntro(cat,data,C);assert.ok(intro.includes('<h1>'));assert.ok(!intro.includes('topic-first-read'));assert.ok(intro.includes('0 cẩm nang'));
});
test('Source panel exposes real hosts, escapes labels and has a usable empty state',()=>{
 const article=structuredClone(D.articles[0]);article.sources=[{label:'Nguồn <đối chiếu>',url:'https://example.com/path?q=1&lang=vi'}];const html=M.sources(article,D,C);
 assert.ok(html.includes('id="nguon-tham-khao"'));assert.ok(html.includes('example.com'));assert.ok(html.includes('Nguồn &lt;đối chiếu&gt;'));assert.ok(html.includes('rel="noopener noreferrer"'));assert.ok(html.includes('?q=1&amp;lang=vi'));
 article.sources=[];assert.ok(M.sources(article,D,C).includes('chưa có nguồn'));assert.ok(M.sources(article,D,C).includes('0 liên kết'));
});
test('Reading TXT uses public article content and sources without pulling extra or browser data',()=>{
 const article=structuredClone(D.articles[0]);article.private='PRIVATE-READING-921';const text=M.readingText(article,D,C);assert.ok(text.includes(article.title));assert.ok(text.includes(article.sections[0].text));assert.ok(text.includes(article.sources[0].url));assert.ok(!text.includes('PRIVATE-READING-921'));
});
test('Shared pages retain reader source anchors, topic routes and new export dependencies',()=>{
 const files=R.build(D);assert.ok(files['index.html'].includes('topic-atlas-grid'));for(const c of D.categories)assert.ok(files['chuyen-muc/'+c.id+'.html'].includes('topic-page-hero'));
 for(const a of D.articles){const html=files['bai-viet/'+a.id+'.html'];assert.ok(html.includes('href="#nguon-tham-khao"'));assert.ok(html.includes('id="nguon-tham-khao"'));assert.ok(html.includes('data-download-reading="'+a.id+'"'));}
 const editor=fs.readFileSync(require.resolve('../dist/bien-tap.html'),'utf8');assert.ok(editor.indexOf('editorial-markup.js')<editor.indexOf('renderer.js'));
 assert.ok(files['tat-ca.html'].includes('data-catalog-view="list"'));const pack={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/assets/package-assets.js'),'utf8'),pack);for(const file of ['editorial-markup.js','topic-ai.webp','topic-tips.webp','topic-devices.webp','topic-safety.webp'])assert.ok(pack.window.TH_PACKAGE.files['assets/'+file]);
});
test('Device restore refuses changes made since preview without modifying any selected group',()=>{
 const storage=memory();storage.setItem('th-theme','"dark"');const expected=K.capture(storage);storage.setItem('th-theme','"light"');const before=[...storage.data],value={type:'tech-horizon-device',version:1,exported:new Date().toISOString(),data:{'th-theme':'dark'}};
 assert.throws(()=>K.restore(storage,value,['preferences'],[],expected),/thay đổi sau/);assert.deepEqual([...storage.data],before);
});
test('Device restore checks only imported entries in chosen groups and supports old selective backups',()=>{
 const storage=memory();storage.setItem('th-theme','"dark"');const expected=K.capture(storage);storage.setItem('th-planner','{"new":"keep"}');const value={type:'tech-horizon-device',version:1,exported:new Date().toISOString(),data:{'th-theme':'light'}};
 assert.equal(K.restore(storage,value,['preferences'],[],expected),1);assert.equal(storage.getItem('th-planner'),'{"new":"keep"}');assert.equal(storage.getItem('th-theme'),'"light"');
});
test('Device rollback does not overwrite a newer write from another tab',()=>{
 const storage=memory();storage.setItem('th-theme','"dark"');const set=storage.setItem;storage.setItem=(key,value)=>{if(key==='th-preferences'){set('th-theme','"newer"');throw Error('quota');}set(key,value);};
 const value={type:'tech-horizon-device',version:1,exported:new Date().toISOString(),data:{'th-theme':'light','th-preferences':{scale:1,motion:'system',contrast:false}}};assert.throws(()=>K.restore(storage,value,['preferences']),/chưa lưu\/hoàn lại/i);assert.equal(storage.getItem('th-theme'),'"newer"');assert.equal(storage.getItem('th-preferences'),null);
});
