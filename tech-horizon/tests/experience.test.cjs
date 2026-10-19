const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const X=require('../dist/assets/experience-core.js'),M=require('../dist/assets/experience-markup.js'),C=require('../dist/assets/core.js'),R=require('../dist/assets/renderer.js');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/site-data.js'),'utf8'),sandbox);const D=JSON.parse(JSON.stringify(sandbox.window.TECH_HORIZON));
test('Discovery respects category and time, ranks practice guides, and leaves the public dataset unchanged',()=>{
 const before=JSON.stringify(D);for(const category of ['all',...D.categories.map(c=>c.id)])for(const minutes of [3,5,10,120])for(const goal of ['understand','practice']){const list=X.recommendations(D,{category,minutes,goal});assert.ok(list.length<=3);assert.ok(list.every(a=>a.minutes<=minutes&&(category==='all'||a.category===category)));assert.ok(list.every(a=>D.articles.some(b=>a===b)));}
 assert.equal(JSON.stringify(D),before);assert.deepEqual(X.recommendations({...D,articles:D.articles.map(a=>({...a,minutes:10}))},{minutes:3}),[]);assert.throws(()=>X.recommendations(D,{category:'fake'}));assert.throws(()=>X.recommendations(D,{minutes:0}));assert.throws(()=>X.recommendations(D,{goal:'magic'}));
});
test('Quick explanations validate answers and link only to guides present in the current dataset',()=>{
 const list=X.labs(D);assert.equal(list.length,3);for(const q of list){assert.ok(D.articles.some(a=>a.id===q.article));assert.equal(X.answer(list,q.id,q.correct).correct,true);assert.equal(X.answer(list,q.id,1-q.correct).correct,false);assert.ok(X.answer(list,q.id,0).explanation.length>70);}
 assert.throws(()=>X.answer(list,'missing',0));assert.throws(()=>X.answer(list,list[0].id,99));assert.throws(()=>X.answer(list,list[0].id,-1));assert.equal(X.labs({...D,articles:[]}).length,0);
});
test('Unexpected guide choice is bounded and handles an empty selection',()=>{
 assert.equal(X.pick([],0),null);assert.equal(X.pick(D.articles,D.articles.length),D.articles[0]);assert.equal(X.pick(D.articles,1),D.articles[1]);assert.throws(()=>X.pick(D.articles,-1));
});
test('Editorial markup escapes imported channel and article text and preserves a custom cover',()=>{
 const d=structuredClone(D);d.config.description='<img src=x onerror=alert(1)>';d.config.tagline='</p><script>bad()</script>';d.articles[0].title='<script>bad()</script>';const hero=M.hero(d,C),card=M.recommendation(d.articles[0],d,C);assert.ok(hero.includes('&lt;img'));assert.ok(!hero.includes('<script>bad()'));assert.ok(!card.includes('<script>bad()'));assert.ok(card.includes('&lt;script&gt;'));
 const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6b0AAAAAASUVORK5CYII=';d.config.heroImage=png;assert.ok(M.hero(d,C).includes(png));
});
test('Version five exports discovery, quick explanations, motion controls and all new local assets',()=>{
 const files=R.build(D),home=files['index.html'];for(const id of ['diem-bat-dau','giai-ma-nhanh','micro-question','discovery-results','experience-motion'])assert.ok(home.includes('id="'+id+'"'));assert.ok(home.includes('horizon-portal.webp'));assert.ok(!home.includes('class="hero container"'));assert.ok(home.includes('Bắt đầu khám phá'));for(const asset of ['experience-core.js','experience-markup.js','experience.js','experience.css','horizon-portal.webp','ai-lab-preview.png'])assert.ok(fs.existsSync(require.resolve('../dist/assets/'+asset)));assert.ok(files['studio.html'].includes('experience.css'));assert.ok(files['dieu-hanh.html'].includes('experience.css'));assert.ok(!home.includes('lượt thích giả'));
});
