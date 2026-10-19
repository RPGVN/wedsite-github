const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const C=require('../dist/assets/core.js');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../dist/site-data.js'),'utf8'),sandbox);
const D=JSON.parse(JSON.stringify(sandbox.window.TECH_HORIZON));
test('Supplied content is valid, contains eight complete articles and no invented Facebook URL',()=>{
 assert.deepEqual(C.validate(D),[]);assert.equal(D.articles.length,8);assert.equal(D.config.facebookUrl,'');
 for(const a of D.articles){assert.ok(a.sections.length>=4);assert.ok(a.sections.every(s=>s.text.length>100));assert.ok(a.sources.length>0);}
});
test('Vietnamese search works with or without diacritics and returns the intended guide',()=>{
 assert.equal(C.filter(D.articles,{query:'bo nho luu tru'})[0].id,'ram-va-bo-nho-luu-tru');
 assert.equal(C.filter(D.articles,{query:'NHẬN DIỆN TIN NHẮN'})[0].id,'nhan-dien-tin-nhan-gia-mao');
 assert.equal(C.filter(D.articles,{query:'   DNS   '})[0].id,'dns-la-gi');
 assert.equal(C.filter(D.articles,{query:'nội dung chưa từng có xyz'}).length,0);
});
test('Combined category, saved and search filters preserve the expected result',()=>{
 const saved=['bat-dau-voi-ai','dns-la-gi'];
 assert.deepEqual(C.filter(D.articles,{savedOnly:true,saved,category:'devices'}).map(a=>a.id),['dns-la-gi']);
 assert.equal(C.filter(D.articles,{savedOnly:true,saved:[]}).length,0);
 assert.equal(C.filter(D.articles,{category:'safety'}).length,2);
});
test('Sort orders reflect reader choice without changing original content order',()=>{
 const input=[{id:'new',date:'2026-10-19',minutes:8},{id:'old',date:'2025-01-01',minutes:3}];
 assert.equal(C.filter(input,{sort:'oldest'})[0].id,'old');
 assert.equal(C.filter(input,{sort:'newest'})[0].id,'new');
 assert.equal(C.filter(input,{sort:'shortest'})[0].id,'old');
 assert.equal(input[0].id,'new');
});
test('Facebook links reject lookalike domains, executable schemes and embedded credentials',()=>{
 for(const link of ['javascript:alert(1)','https://facebook.com.evil.example/x','https://facebook.com@evil.example/x','https://user:password@facebook.com/x','http://facebook.com/x','https://evil.example/?next=facebook.com'])assert.equal(C.url(link,true),'');
 assert.equal(C.url('https://www.facebook.com/profile.php?id=123',true),'https://www.facebook.com/profile.php?id=123');
 assert.equal(C.url('https://m.facebook.com/MyPage',true),'https://m.facebook.com/MyPage');
});
test('Untrusted titles and paragraphs remain plain text when rendered into markup',()=>{
 const input='<img src=x onerror="alert(1)"> & \'hello\'';
 const escaped=C.escape(input);assert.ok(!escaped.includes('<'));assert.ok(!escaped.includes('"'));assert.ok(escaped.includes('&lt;img'));assert.ok(escaped.includes('&#39;'));
});
test('Broken imports reject duplicate paths, path traversal, impossible dates and unsafe sources',()=>{
 const clone=()=>structuredClone(D);
 let d=clone();d.articles.push({...d.articles[0]});assert.ok(C.validate(d).some(x=>x.includes('trùng')));
 d=clone();d.articles[0].id='../outside';assert.ok(C.validate(d).length);
 d=clone();d.articles[0].date='2026-02-30';assert.ok(C.validate(d).some(x=>x.includes('ngày')));
 d=clone();d.articles[0].sources[0].url='javascript:alert(1)';assert.ok(C.validate(d).some(x=>x.includes('HTTPS')));
 d=clone();d.articles[0].category='missing';assert.ok(C.validate(d).some(x=>x.includes('chuyên mục')));
 d=clone();d.articles=[];assert.ok(C.validate(d).length);
 assert.ok(C.validate(null).length);assert.ok(C.validate({}).length);
});
test('Blocked or corrupt browser storage fails gracefully and never reports a successful save',()=>{
 global.localStorage={getItem:()=>'{broken',setItem:()=>{throw Error('blocked');},removeItem:()=>{throw Error('blocked');}};
 assert.deepEqual(C.storage.get('x',[]),[]);assert.equal(C.storage.set('x',{}),false);assert.equal(C.storage.remove('x'),false);
 delete global.localStorage;assert.equal(C.storage.get('x','fallback'),'fallback');
});
