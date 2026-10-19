const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const C=require('../dist/assets/core.js');
const Renderer=require('../dist/assets/renderer.js');
const Zip=require('../dist/assets/zip.js');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/site-data.js'),'utf8'),sandbox);
const original=JSON.parse(JSON.stringify(sandbox.window.TECH_HORIZON));
test('All journey steps point to existing guides and glossary has twenty distinct terms',()=>{
 assert.equal(original.journeys.length,4);assert.equal(original.glossary.length,20);
 assert.equal(new Set(original.glossary.map(t=>t.id)).size,20);
 const ids=new Set(original.articles.map(a=>a.id));for(const j of original.journeys)for(const id of j.articles)assert.ok(ids.has(id));
 const bad=structuredClone(original);bad.journeys[0].articles[0]='missing';assert.ok(C.validate(bad).length);
});
test('The shared renderer builds an added guide, its static route, sitemap and feed',()=>{
 const data=structuredClone(original),a=structuredClone(data.articles[0]);a.id='bai-moi-cua-chu-kenh';a.title='Cẩm nang mới do chủ kênh thêm';data.articles.push(a);
 const files=Renderer.build(data);
 assert.ok(files['bai-viet/'+a.id+'.html'].includes(a.title));
 assert.ok(files['sitemap.xml'].includes(a.id));assert.ok(files['feed.xml'].includes(a.title));
 const context={window:{}};vm.runInNewContext(files['assets/static-routes.js'],context);assert.ok(context.window.TH_STATIC_ROUTES.includes(a.id));
 assert.ok(files['chuyen-muc/ai.html'].includes(a.title));assert.ok(files['thu-vien.html']);assert.ok(files['thuat-ngu.html']);
});
test('Export preserves special characters as text and keeps script terminators out of JSON scripts',()=>{
 const data=structuredClone(original);const text='Câu hỏi <script>alert("x")</script> & dấu tiếng Việt';data.articles[0].title=text;
 const files=Renderer.build(data),restored={window:{}};
 vm.runInNewContext(files['site-data.js'],restored);
 assert.equal(restored.window.TECH_HORIZON.articles[0].title,text);
 const html=files['bai-viet/'+data.articles[0].id+'.html'];
 assert.ok(html.includes('&lt;script&gt;'));
 const match=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);assert.ok(match);
 assert.equal(JSON.parse(match[1]).headline,text);
});
test('Curated Facebook links require the real Facebook domain and are escaped in output',()=>{
 const data=structuredClone(original);data.socialPosts=[{title:'Một bài Facebook',caption:'Mô tả riêng',url:'https://www.facebook.com/123/posts/456'}];
 assert.deepEqual(C.validate(data),[]);assert.ok(Renderer.build(data)['index.html'].includes('Một bài Facebook'));
 data.socialPosts[0].url='https://facebook.com.evil.example/x';assert.ok(C.validate(data).length);
});
test('Reader backup keeps valid private notes and ignores unavailable article ids',()=>{
 const backup={type:'tech-horizon-reader',version:1,saved:['dns-la-gi','missing','dns-la-gi'],progress:{'dns-la-gi':{percent:38,updated:'2026-10-19T01:00:00.000Z',note:'Thử giải thích DNS bằng ví dụ của mình.'},missing:{percent:20,updated:'2026-10-19',note:''}}};
 const result=C.readerBackup(backup,original.articles.map(a=>a.id));
 assert.deepEqual(result.saved,['dns-la-gi']);assert.equal(Object.keys(result.progress).length,1);assert.equal(result.progress['dns-la-gi'].percent,38);assert.ok(result.progress['dns-la-gi'].note.includes('ví dụ'));
 backup.progress['dns-la-gi'].percent=Infinity;assert.throws(()=>C.readerBackup(backup,['dns-la-gi']));
 backup.progress['dns-la-gi'].percent=10;backup.progress['dns-la-gi'].note='x'.repeat(3001);assert.throws(()=>C.readerBackup(backup,['dns-la-gi']));
});
test('ZIP uses standard CRC32, UTF-8 names, matching central directory and rejects traversal',async()=>{
 const bytes=new TextEncoder().encode('123456789');assert.equal(Zip.crc32(bytes),0xcbf43926);
 const blob=Zip.create([{name:'Tệp đọc.txt',content:'Nội dung tiếng Việt'},{name:'index.html',content:'<!doctype html><h1>Tech Horizon</h1>'}]);
 const buffer=new Uint8Array(await blob.arrayBuffer()),view=new DataView(buffer.buffer);
 assert.equal(view.getUint32(0,true),0x04034b50);assert.ok(view.getUint16(6,true)&0x0800);
 const end=buffer.length-22;assert.equal(view.getUint32(end,true),0x06054b50);assert.equal(view.getUint16(end+10,true),2);
 const central=view.getUint32(end+16,true);assert.equal(view.getUint32(central,true),0x02014b50);
 assert.throws(()=>Zip.create([{name:'../outside',content:'x'}]));
});
