const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const C=require('../dist/assets/core.js'),W=require('../dist/assets/workbench.js'),Renderer=require('../dist/assets/renderer.js');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/site-data.js'),'utf8'),sandbox);
const original=JSON.parse(JSON.stringify(sandbox.window.TECH_HORIZON));
test('Transfer calculator distinguishes decimal and binary units and applies the chosen factor',()=>{
 const plain=W.transfer(100,1,'GB',0);assert.equal(plain.seconds,80);assert.equal(plain.megabytesPerSecond,12.5);
 const binary=W.transfer(100,1,'GiB',0);assert.equal(binary.bytes,1073741824);assert.equal(binary.seconds,85.89934592);
 const reduced=W.transfer(100,1,'GB',20);assert.equal(reduced.effectiveMbps,80);assert.equal(reduced.seconds,100);
 assert.equal(W.duration(80),'1 phút 20 giây');assert.equal(W.duration(86461),'1 ngày 1 phút 1 giây');
 for(const input of [[0,1,'GB',0],[100,-1,'GB',0],[100,1,'unknown',0],[100,1,'GB',51],[Infinity,1,'GB',0]])assert.throws(()=>W.transfer(...input));
});
test('UTM builder preserves the destination, existing parameters and fragment while replacing UTM fields',()=>{
 const link=W.utm({url:'https://example.com/path?q=a&utm_source=old#part',source:'facebook',medium:'social',campaign:'góc công nghệ',content:'bài 1',term:''}),u=new URL(link);
 assert.equal(u.hostname,'example.com');assert.equal(u.hash,'#part');assert.equal(u.searchParams.get('q'),'a');assert.equal(u.searchParams.get('utm_source'),'facebook');assert.equal(u.searchParams.get('utm_campaign'),'góc công nghệ');assert.equal(u.searchParams.get('utm_content'),'bài 1');
 for(const url of ['javascript:alert(1)','http://example.com','https://user:password@example.com'])assert.throws(()=>W.utm({url,source:'fb',medium:'social',campaign:'a'}));
});
test('Prompt composer uses supplied context and asks for verification without making a network call',()=>{
 const p=W.prompt({type:'post',topic:'RAM khác SSD như thế nào?',audience:'người mới',length:'short',tone:'clear',context:'Chỉ giải thích khái niệm, không tư vấn mua sản phẩm.'});
 assert.ok(p.includes('RAM khác SSD'));assert.ok(p.includes('người mới'));assert.ok(p.includes('Không tự bịa số liệu'));assert.ok(p.includes('không tư vấn mua sản phẩm'));
 assert.throws(()=>W.prompt({type:'unknown',topic:'AI',audience:'người mới',length:'short',tone:'clear'}));
});
test('Universal search finds terms, reading journeys and utilities with Vietnamese normalization',()=>{
 assert.equal(W.search(original,'ước lượng tải tệp','tool')[0]?.id,'transfer');
 assert.equal(W.search(original,'dns','term')[0]?.id,'dns');
 assert.equal(W.search(original,'song so an tam','journey')[0]?.id,'song-so-an-tam');
 assert.ok(W.search(original,'ram','article').every(r=>r.kind==='article'));
 assert.equal(W.search(original,'không có xyzabc').length,0);
});
test('Custom images allow embedded raster images and reject SVG, remote URLs and oversized data',()=>{
 const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6b0AAAAAASUVORK5CYII=';
 assert.equal(C.image(png),png);assert.equal(W.image(png),png);
 assert.equal(C.image('data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9ImFsZXJ0KDEpIj4='),'');assert.equal(C.image('https://example.com/x.png'),'');assert.equal(C.image('data:image/png;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='),'');assert.equal(C.image(png,5),'');
 const d=structuredClone(original);d.config.logoImage=png;d.config.heroImage=png;d.articles[0].customImage=png;assert.deepEqual(C.validate(d),[]);
 const files=Renderer.build(d);assert.ok(files['index.html'].includes('custom-brand'));assert.ok(files['bai-viet/'+d.articles[0].id+'.html'].includes(png));
 d.articles[0].customImage='data:image/svg+xml;base64,PHN2Zz4=';assert.ok(C.validate(d).length);
});
test('Studio is exported as a real page with four tools and every extra script is available',()=>{
 const files=Renderer.build(original);assert.ok(files['studio.html'].includes('id="prompt-form"'));assert.ok(files['studio.html'].includes('id="transfer-form"'));assert.ok(files['studio.html'].includes('id="utm-form"'));assert.ok(files['studio.html'].includes('id="publish-count"'));assert.ok(files['sitemap.xml'].includes('/studio.html'));
 for(const name of ['studio.js','studio.css','workbench.js','studio-markup.js'])assert.ok(fs.existsSync(require.resolve('../dist/assets/'+name)));
});
