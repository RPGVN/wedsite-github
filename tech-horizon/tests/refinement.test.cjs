const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('../dist/assets/core.js'),X=require('../dist/assets/experience-core.js'),K=require('../dist/assets/creator-core.js'),Q=require('../dist/assets/quality-core.js'),R=require('../dist/assets/renderer.js'),M=require('../dist/assets/experience-markup.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/site-data.js'),'utf8'),context);const D=JSON.parse(JSON.stringify(context.window.TECH_HORIZON));
const record={checks:[0,2],note:'Một điều tôi đã thử 🌄\nNguồn tôi muốn đọc tiếp.',updated:'2026-10-19T08:00:00Z'};
const memory=()=>{const entries=new Map();return {entries,getItem:key=>entries.get(key)??null,setItem:(key,value)=>entries.set(key,String(value)),removeItem:key=>entries.delete(key)};};
test('Guarded writes reject a stale tab before changing stored data and surface blocked storage',()=>{
 const storage=memory(),first={version:1,entries:{'ai-ro-rang':record}},raw=C.guardedSet(storage,'th-practice',first,null);
 assert.equal(raw,storage.getItem('th-practice'));storage.setItem('th-practice','external change');assert.throws(()=>C.guardedSet(storage,'th-practice',{other:true},raw),/tab khác/);assert.equal(storage.getItem('th-practice'),'external change');
 assert.throws(()=>C.guardedSet({getItem(){throw Error('denied');}},'th-draft',D,null),/đọc bộ nhớ/);
 assert.throws(()=>C.guardedSet({getItem:()=>null,setItem(){throw Error('quota');}},'th-draft',D,null),/hết dung lượng/);
});
test('Saved practice validates every mission, keeps private notes and deduplicates valid checks',()=>{
 const entries=Object.fromEntries(X.missions(D).map(m=>[m.id,{...record,checks:[0,0,2]}])),valid=X.practiceState({version:1,entries});assert.equal(Object.keys(valid.entries).length,4);assert.deepEqual(valid.entries['ai-ro-rang'].checks,[0,2]);assert.equal(valid.entries['ai-ro-rang'].note,record.note);assert.deepEqual(entries['ai-ro-rang'].checks,[0,0,2]);
 for(const bad of [{version:9,entries:{}},{version:1,entries:{fake:record}},{version:1,entries:{'ai-ro-rang':{...record,note:'x'.repeat(2001)}}},{version:1,entries:{'ai-ro-rang':{...record,checks:[-1]}}},{version:1,entries:{'ai-ro-rang':{...record,checks:[3]}}},{version:1,entries:{'ai-ro-rang':{...record,updated:'not-a-date'}}}])assert.throws(()=>X.practiceState(bad));
});
test('Device backup includes practice as a sixth group and selective restore preserves other work',()=>{
 const practice={version:1,entries:{'ai-ro-rang':record}},backup={type:'tech-horizon-device',version:1,exported:record.updated,data:{'th-practice':practice,'th-theme':'light'}};
 const valid=K.backup(backup,D.articles.map(a=>a.id));assert.deepEqual(valid.data['th-practice'],practice);assert.equal(Object.keys(K.groups).length,6);
 const storage=memory();storage.setItem('th-theme','"dark"');storage.setItem('unrelated-app','keep');K.restore(storage,valid,['practice']);assert.equal(storage.getItem('th-theme'),'"dark"');assert.equal(storage.getItem('unrelated-app'),'keep');assert.deepEqual(JSON.parse(storage.getItem('th-practice')),practice);
 const older={...backup,data:{'th-theme':'light'}};K.restore(storage,older,['preferences']);assert.deepEqual(JSON.parse(storage.getItem('th-practice')),practice);
 assert.throws(()=>K.backup({...backup,data:{'th-practice':{version:1,entries:{fake:record}}}}));
});
test('A failed practice restore rolls back without losing the previous saved worksheet',()=>{
 const storage=memory(),prior={version:1,entries:{'ai-ro-rang':record}};storage.setItem('th-practice',JSON.stringify(prior));storage.setItem('th-theme','"dark"');const set=storage.setItem;storage.setItem=(key,value)=>{if(key==='th-theme'&&value==='"light"')throw Error('quota');set(key,value);};
 const value={type:'tech-horizon-device',version:1,exported:record.updated,data:{'th-practice':{version:1,entries:{}},'th-theme':'light'}};
 assert.throws(()=>K.restore(storage,value,['practice','preferences']),/hoàn lại/);assert.deepEqual(JSON.parse(storage.getItem('th-practice')),prior);assert.equal(storage.getItem('th-theme'),'"dark"');
});
test('Editorial audit reports actual omissions without claiming factual verification',()=>{
 const data=structuredClone(D),a=data.articles[0];a.sources=[];a.takeaway='';a.title='D'.repeat(101);a.customImage='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6b0AAAAAASUVORK5CYII=';a.sections.push({...a.sections[0]});
 const report=Q.audit(data);assert.equal(report.errors.length,0);assert.equal(report.articles,16);for(const label of ['Nguồn đọc thêm','Điều người đọc mang theo','Mô tả ảnh riêng','Mục lục','Tiêu đề dài'])assert.ok(report.warnings.some(w=>w.id===a.id&&w.label===label));
 assert.ok(Q.audit(D).warnings.some(w=>w.label==='Kết nối Facebook'));assert.ok(Q.audit(null).errors.length);
});
test('Custom article alt text survives both renderers and rejects malformed values',()=>{
 const data=structuredClone(D),a=data.articles[0];a.imageAlt='Chip & trang ghi chép <minh họa>';assert.deepEqual(C.validate(data),[]);assert.ok(R.build(data)['bai-viet/'+a.id+'.html'].includes('alt="Chip &amp; trang ghi chép &lt;minh họa&gt;"'));a.imageAlt=3;assert.ok(C.validate(data).length);a.imageAlt='a'.repeat(301);assert.ok(C.validate(data).length);
});
test('Contextual terms use word boundaries and treat special characters in imported terms literally',()=>{
 const a={title:'RAM, HTTPS, C++ và bộ nhớ',takeaway:'',sections:[{text:'Chỉ RAM; không dùng chuỗi RAMification hoặc AIM.'}]},terms={glossary:[{id:'ram',term:'RAM'},{id:'ai',term:'AI'},{id:'https',term:'HTTPS'},{id:'cpp',term:'C++'},{id:'bracket',term:'['}]};
 assert.deepEqual(X.matchingTerms(a,terms).map(t=>t.id),['ram','https','cpp']);assert.equal(X.matchingTerms({title:'RAMification',takeaway:'',sections:[]},{glossary:[{id:'ram',term:'RAM'}]}).length,0);
});
test('Visitors avoid owner modules while Studio and management retain their required dependencies',()=>{
 const files=R.build(D);for(const file of ['index.html','tat-ca.html','thuc-hanh.html','bai-viet/bat-dau-voi-ai.html','thu-vien.html']){const html=files[file];for(const owner of ['creator-core.js','creator-markup.js','creator.js','media-tools.js'])assert.ok(!html.includes('assets/'+owner),file+' includes '+owner);assert.ok(html.includes('preferences.js'));assert.ok(html.includes('refinement.css'));}
 for(const asset of ['creator-core.js','media-tools.js'])assert.ok(files['studio.html'].includes(asset));assert.ok(!files['studio.html'].includes('creator-markup.js'));
 for(const file of ['dieu-hanh.html','du-lieu.html','gioi-thieu.html'])for(const asset of ['creator-core.js','creator-markup.js','creator.js'])assert.ok(files[file].includes(asset));
 const settings=files['du-lieu.html'];assert.ok(settings.indexOf('experience-core.js')<settings.indexOf('creator.js'));assert.ok(settings.includes('data-backup-group="practice"'));
});
test('All new assets and editor dependencies remain in the offline export source',()=>{
 for(const file of ['quality-core.js','preferences.js','refinement.js','refinement.css','practice-desk.webp'])assert.ok(fs.existsSync(require.resolve('../dist/assets/'+file)));
 const editor=fs.readFileSync(require.resolve('../dist/bien-tap.html'),'utf8');for(const id of ['editor-session-warning','export-editor-recovery','editor-audit-results','article-image-alt'])assert.ok(editor.includes('id="'+id+'"'));assert.ok(editor.indexOf('quality-core.js')<editor.indexOf('editor.js'));
 const files=R.build(D);assert.ok(files['tat-ca.html'].includes('data-page="catalog"'));for(const id of ['catalog-query','catalog-category','catalog-sort','catalog-status','catalog-reset'])assert.ok(files['tat-ca.html'].includes('id="'+id+'"'));
});
test('Private worksheets never enter generated public pages or public site data',()=>{
 const local={window:{},localStorage:{getItem:()=>JSON.stringify({version:1,entries:{'ai-ro-rang':{...record,note:'PRIVATE-PRACTICE-8361'}}})},URL,URLSearchParams};for(const file of ['core.js','workbench.js','studio-markup.js','creator-core.js','creator-markup.js','experience-core.js','experience-markup.js','editorial-markup.js','renderer.js'])vm.runInNewContext(fs.readFileSync(require.resolve('../dist/assets/'+file),'utf8'),local);
 for(const content of Object.values(local.window.THRenderer.build(D)))assert.ok(!content.includes('PRIVATE-PRACTICE-8361'));
});
