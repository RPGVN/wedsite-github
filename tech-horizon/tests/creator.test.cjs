const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const K=require('../dist/assets/creator-core.js'),R=require('../dist/assets/renderer.js'),W=require('../dist/assets/workbench.js');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/site-data.js'),'utf8'),sandbox);const D=JSON.parse(JSON.stringify(sandbox.window.TECH_HORIZON));
const task=(overrides={})=>({id:'task-001',title:'Vì sao RAM khác SSD?',stage:'idea',format:'reel',due:'2026-10-19T09:00',notes:'Mở đầu\nVí dụ cụ thể',sources:'https://example.com/source',url:'',created:'2026-10-19T00:00:00Z',updated:'2026-10-19T00:00:00Z',...overrides});
const plan=(items=[task()])=>({version:1,tasks:items});
test('Planner validates real dates, bounded drafts, unique ids and known stages without changing user notes',()=>{
 const input=plan();assert.deepEqual(K.planner(input),input);assert.equal(K.localDate('2026-10-19T09:00'),Date.parse('2026-10-19T02:00:00Z'));
 for(const due of ['2026-02-30T09:00','2026-13-01T09:00','2026-10-19T25:00','2026-10-19','2026-10-19T09:00Z'])assert.throws(()=>K.planner(plan([task({due})])));
 for(const item of [task({stage:'auto-posted'}),task({format:'unknown'}),task({notes:'x'.repeat(5001)}),task({url:'javascript:alert(1)'}),task({id:'../path'}),task({created:2026})])assert.throws(()=>K.planner(plan([item])));
 assert.throws(()=>K.planner(plan([task(),task()])));assert.equal(K.planner(plan([task({due:''})])).tasks[0].due,'');assert.deepEqual(input,plan());
});
test('Calendar converts Vietnam time to UTC and folds long Unicode lines without event injection',()=>{
 const malicious='Tiêu đề tiếng Việt 🌄 '.repeat(10)+'\nBEGIN:VEVENT\nSUMMARY:injected';
 const ics=K.calendar(plan([task({title:malicious.slice(0,180),notes:'Dòng một; dấu, và \\ nguồn\nBEGIN:VEVENT'}),task({id:'unscheduled',due:''})]),'2026-10-19T01:00:00Z');
 assert.ok(ics.includes('DTSTART:20261019T020000Z\r\n'));assert.ok(ics.includes('DTEND:20261019T023000Z\r\n'));assert.equal(ics.split('\r\nBEGIN:VEVENT\r\n').length-1,1);assert.ok(ics.includes('DTSTAMP:20261019T010000Z'));
 for(const line of ics.split('\r\n'))assert.ok(Buffer.byteLength(line,'utf8')<=75);const unfolded=ics.replace(/\r\n[ \t]/g,'');assert.ok(unfolded.includes('\\;'));assert.ok(unfolded.includes('\\,'));assert.ok(unfolded.includes('\\nBEGIN:VEVENT'));assert.ok(!ics.includes('\ufffd'));assert.ok(!ics.includes('ATTENDEE'));assert.ok(!ics.includes('VALARM'));
});
test('Month grid starts Monday, includes leap day and handles year boundaries',()=>{
 const feb=K.monthCells(2024,1);assert.equal(feb.length,42);assert.equal(feb[0].date,'2024-01-29');assert.equal(feb.filter(c=>c.current).length,29);assert.ok(feb.some(c=>c.date==='2024-02-29'));assert.equal(K.monthCells(2026,0)[0].date,'2025-12-29');assert.throws(()=>K.monthCells(2026,12));
});
test('CSV preserves Vietnamese and quotes and neutralizes formula prefixes',()=>{
 const text=K.csv(plan([task({title:'=HYPERLINK("bad")',notes:'  +1',sources:'\t=1'})]));assert.ok(text.startsWith('\ufeff'));assert.ok(text.includes('"\'=HYPERLINK(""bad"")"'));assert.ok(text.includes('"\'  +1"'));assert.ok(text.includes('"\'\t=1"'));assert.ok(text.includes('Ngày giờ (UTC+7)'));
});
test('Script metrics use whitespace units, count Unicode codepoints and honor chosen speaking speed',()=>{
 assert.deepEqual(K.metrics('  Xin chào\nTech Horizon 🌄 ',150),{units:5,characters:26,lines:2,seconds:2,readingSeconds:2});assert.equal(K.metrics('',150).seconds,0);assert.equal(K.metrics('a '.repeat(150),150).seconds,60);assert.throws(()=>K.metrics('a',0));assert.throws(()=>K.metrics('a'.repeat(30001),150));
});
test('Crop geometry centers the selected frame and caps output dimensions',()=>{
 assert.deepEqual(K.cropGeometry(1600,900,1,1080),{sx:350,sy:0,sw:900,sh:900,width:1080,height:1080});const p=K.cropGeometry(1600,900,9/16,1080);assert.equal(p.height,1920);assert.equal(p.sh,900);assert.equal(p.sw,506.25);const landscape=K.cropGeometry(900,1600,16/9,1920);assert.equal(landscape.width,1920);assert.equal(landscape.height,1080);assert.ok(landscape.sy>0);assert.throws(()=>K.cropGeometry(1600,900,1,5000));assert.throws(()=>K.cropGeometry(1600,900,0,1080));
});
function backup(data){return {type:'tech-horizon-device',version:1,exported:'2026-10-19T00:00:00Z',data};}
test('Device backup round-trips editor, reader, planner, Studio and settings with a strict key allowlist',()=>{
 const values={'th-draft':D,'th-editor-history':[{id:'previous-1',when:'2026-10-19T00:00:00Z',data:D}],'th-planner':plan(),'th-saved':[D.articles[0].id],'th-progress':{[D.articles[0].id]:{percent:50,note:'Ghi chú riêng',updated:'2026-10-19T00:00:00Z'}},'th-reader-size':14,'th-publish-checks':['source'],'th-studio-script':'Xin chào','th-theme':'dark','th-preferences':{scale:1.12,motion:'reduce',contrast:true},'th-studio-prompt':{topic:'',audience:'người mới',type:'post',length:'short',tone:'clear',context:''}};
 const result=K.backup(backup(values),D.articles.map(a=>a.id));assert.deepEqual(result.data,values);assert.throws(()=>K.backup(backup({...values,unrelated:'x'})));assert.throws(()=>K.backup(backup({'th-preferences':{scale:10,motion:'reduce',contrast:true}})));assert.throws(()=>K.backup(backup({'th-reader-size':99})));assert.throws(()=>K.backup(backup({'th-planner':plan([task({stage:'fake'})])})));assert.throws(()=>K.backup(backup({'th-progress':{'../bad':{}}})));
});
test('Selective restore changes only the selected group and preserves other app data',()=>{
 const values=new Map([['th-theme','"light"'],['th-planner',JSON.stringify(plan())],['unrelated-app','keep']]),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 const count=K.restore(storage,backup({'th-theme':'dark','th-planner':null}),['preferences']);assert.equal(count,1);assert.equal(values.get('th-theme'),'"dark"');assert.ok(values.has('th-planner'));assert.equal(values.get('unrelated-app'),'keep');
 assert.throws(()=>K.restore(storage,backup({'bad':'x'}),['preferences']));assert.equal(values.get('th-theme'),'"dark"');
});
test('Restore rolls back previously written keys when storage rejects a later write',()=>{
 const values=new Map([['th-theme','"light"'],['th-preferences','old']]);let reject=true;const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>{if(k==='th-preferences'&&reject){reject=false;throw Error('quota');}values.set(k,v);},removeItem:k=>values.delete(k)};
 assert.throws(()=>K.restore(storage,backup({'th-theme':'dark','th-preferences':{scale:1,motion:'system',contrast:false}}),['preferences']),/hoàn lại/);assert.equal(values.get('th-theme'),'"light"');assert.equal(values.get('th-preferences'),'old');
});
test('Configuration health and channel kit reflect actual content without fabricated follower statistics',()=>{
 const h=K.health(D);assert.equal(h.find(i=>i.label==='Facebook chính thức').ok,false);assert.equal(h.find(i=>i.label==='Email công khai').ok,false);const text=K.mediaKit(D);assert.ok(text.includes('16 cẩm nang'));assert.ok(text.includes('Facebook: Chưa cấu hình'));const changed=structuredClone(D);changed.config.facebookUrl='https://www.facebook.com/real-page';changed.config.email='contact@example.com';assert.ok(K.mediaKit(changed).includes('contact@example.com'));assert.equal(K.health(changed).find(i=>i.label==='Facebook chính thức').ok,true);
});
test('Shared export includes owner workspace, data center, channel kit, guide and six Studio tools',()=>{
 const files=R.build(D);for(const file of ['dieu-hanh.html','du-lieu.html','gioi-thieu.html','huong-dan.html'])assert.ok(files[file].includes('assets/creator.js'));for(const file of ['dieu-hanh.html','du-lieu.html'])assert.ok(files[file].includes('noindex,nofollow'));assert.ok(!files['sitemap.xml'].includes('dieu-hanh.html'));assert.ok(!files['sitemap.xml'].includes('du-lieu.html'));assert.ok(files['sitemap.xml'].includes('gioi-thieu.html'));assert.ok(files['robots.txt'].includes('Disallow: /du-lieu.html'));assert.equal(W.catalog.length,6);assert.equal(W.search(D,'hướng dẫn sử dụng','page')[0]?.id,'huong-dan');assert.ok(W.search(D,'chuẩn bị ảnh','tool').some(t=>t.id==='media'));assert.ok(files['studio.html'].includes('id="media-canvas"'));assert.ok(files['studio.html'].includes('id="script-text"'));assert.ok(files['index.html'].includes('dieu-hanh.html'));
});
