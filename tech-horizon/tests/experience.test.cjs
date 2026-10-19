const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const X=require('../dist/assets/experience-core.js'),M=require('../dist/assets/experience-markup.js'),C=require('../dist/assets/core.js'),R=require('../dist/assets/renderer.js');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/site-data.js'),'utf8'),sandbox);const D=JSON.parse(JSON.stringify(sandbox.window.TECH_HORIZON));if(!D.config.siteUrl)D.config.siteUrl='https://example.com';
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
test('Editorial intent changes the first recommendation and an empty time choice offers a real next threshold',()=>{
 assert.equal(X.recommendations(D,{category:'ai',goal:'understand'})[0].id,'bat-dau-voi-ai');
 assert.equal(X.recommendations(D,{category:'ai',goal:'practice'})[0].id,'tu-ghi-chu-den-ke-hoach-voi-ai');
 assert.equal(X.recommendations(D,{category:'ai',goal:'avoid'})[0].id,'kiem-chung-cau-tra-loi-ai');
 assert.deepEqual(X.recommendations(D,{category:'devices',minutes:3}),[]);assert.equal(X.availableTime(D,'devices'),5);
 assert.equal(X.availableTime({...D,articles:[]}),null);assert.equal(X.availableTime({...D,articles:[{...D.articles[0],minutes:9}]}),10);
});
test('Shared discovery links round-trip only known filters without carrying preview or personal state',()=>{
 const options={category:'safety',goal:'avoid',minutes:10},url=new URL(X.discoveryUrl(D,options));
 assert.deepEqual(X.preferences(D,url.searchParams),options);assert.equal(url.hash,'#diem-bat-dau');assert.equal(url.pathname,'/index.html');
 assert.deepEqual([...url.searchParams.keys()],['topic','goal','minutes']);
 assert.deepEqual(X.preferences(D,new URLSearchParams('topic=%3Cscript%3E&goal=hack&minutes=-9&preview=true')),{category:'all',goal:'understand',minutes:5});
 assert.equal(X.discoveryUrl({...D,config:{...D.config,siteUrl:'javascript:alert(1)'}},options),'');
 const nested={...D,config:{...D.config,siteUrl:'https://example.com/channel/'}};assert.equal(new URL(X.discoveryUrl(nested,options)).pathname,'/channel/index.html');
});
test('Practice missions use live guides and real Studio tools, and survive removed starter content',()=>{
 const W=require('../dist/assets/workbench.js'),missions=X.missions(D);assert.equal(missions.length,4);assert.equal(new Set(missions.map(m=>m.id)).size,4);
 for(const m of missions){assert.ok(W.catalog.some(t=>t.id===m.tool));assert.equal(m.readMinutes,m.articles.reduce((n,a)=>n+a.minutes,0));assert.ok(m.articles.every(a=>D.articles.includes(a)));assert.equal(m.checks.length,3);assert.ok(m.outcome&&m.task&&m.limit);}
 const custom={...D,articles:D.articles.map((a,i)=>({...a,id:'guide-'+i}))};for(const m of X.missions(custom)){assert.ok(m.articles.every(a=>/^guide-/.test(a.id)));assert.ok(m.articles.length);}
 assert.ok(X.missions({...D,articles:[]}).every(m=>m.articles.length===0&&m.readMinutes===0));
 assert.equal(X.missionForArticle(D,D.articles.find(a=>a.id==='bat-dau-voi-ai')).id,'ai-ro-rang');
 assert.ok(W.search(D,'tram thuc hanh','page').some(p=>p.id==='thuc-hanh'));
});
test('Practice worksheets preserve Vietnamese reflections and distinguish self-assessment from automatic verification',()=>{
 const text=X.worksheet(D,'ai-ro-rang',{checks:[0,2],note:'Điều tôi muốn thử: <một câu hỏi>\nThêm ngữ cảnh.'});
 assert.equal((text.match(/\[x\]/g)||[]).length,2);assert.equal((text.match(/\[ \]/g)||[]).length,1);assert.ok(text.includes('<một câu hỏi>\nThêm ngữ cảnh.'));assert.ok(text.includes('không tự gọi AI'));assert.ok(text.includes('studio.html?mission=ai-ro-rang#prompt'));assert.ok(text.includes('không phải kết quả kiểm tra tự động'));
 assert.throws(()=>X.worksheet(D,'fake'));assert.throws(()=>X.worksheet(D,'ai-ro-rang',{checks:[4]}));assert.throws(()=>X.worksheet(D,'ai-ro-rang',{note:'x'.repeat(2001)}));assert.throws(()=>X.worksheet(D,'ai-ro-rang',{checks:'0'}));
});
test('The next reading step follows the current journey and never links a removed article',()=>{
 const a=D.articles.find(a=>a.id==='bat-dau-voi-ai');assert.equal(X.nextArticle(D,a).id,'kiem-chung-cau-tra-loi-ai');
 const fewer={...D,articles:D.articles.filter(a=>a.id!=='kiem-chung-cau-tra-loi-ai')};assert.equal(X.nextArticle(fewer,a).id,'tu-ghi-chu-den-ke-hoach-voi-ai');
 assert.equal(X.nextArticle({...D,articles:[a]},a),null);assert.equal(X.nextArticle(D,D.articles.find(a=>a.id==='kiem-tra-tin-cong-nghe')),null);
});
test('Browser and Node rendering match for the complete practice journey, including custom imported text',()=>{
 const context={window:{},URL,URLSearchParams};for(const file of ['core.js','workbench.js','studio-markup.js','creator-core.js','creator-markup.js','experience-core.js','experience-markup.js','renderer.js'])vm.runInNewContext(fs.readFileSync(require.resolve('../dist/assets/'+file),'utf8'),context,{filename:file});
 const d=structuredClone(D);d.articles[0].title='<img src=x onerror=bad()> & Trí tuệ';d.articles[0].takeaway='</p><script>bad()</script>';const node=R.build(d),browser=context.window.THRenderer.build(d);assert.equal(browser['index.html'],node['index.html']);assert.equal(browser['thuc-hanh.html'],node['thuc-hanh.html']);
 const page=node['thuc-hanh.html'];assert.ok(page.includes('&lt;img src=x onerror=bad()&gt;'));assert.ok(!page.includes('<script>bad()'));assert.ok(node['index.html'].indexOf('id="hero-interest"')<node['index.html'].indexOf('id="horizon-visual"'));assert.ok(node['index.html'].includes('discovery-lead'));assert.ok(node['sitemap.xml'].includes('/thuc-hanh.html'));
 for(const m of X.missions(d)){assert.ok(page.includes('id="'+m.id+'"'));assert.ok(page.includes('studio.html?mission='+m.id+'#'+m.tool));}
 for(const a of d.articles)assert.ok(node['bai-viet/'+a.id+'.html'].includes('data-next-step="'+a.id+'"'));
});
