const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('../dist/assets/core.js'),W=require('../dist/assets/workbench.js'),M=require('../dist/assets/experience-markup.js'),R=require('../dist/assets/renderer.js');const context={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/site-data.js'),'utf8'),context);const D=JSON.parse(JSON.stringify(context.window.TECH_HORIZON));
function surface(page){
 const nodes=new Map(),document={activeElement:null,body:{dataset:{page,base:''}}};let scopes;const viewButtons=[];
 class Element{
  constructor(id=''){this.id=id;this.value='';this.events={};this.dataset={};this.links=[];this.buttons=[];const classes=new Set();this.classList={toggle(key,on){if(on)classes.add(key);else classes.delete(key);},contains:key=>classes.has(key)};}
  addEventListener(key,fn){(this.events[key]||=[]).push(fn);}fire(key,event={}){let prevented=false;for(const fn of this.events[key]||[])fn({target:this,preventDefault(){prevented=true;},...event});return prevented;}
  setAttribute(key,value){this[key]=value;}removeAttribute(key){delete this[key];}focus(){document.activeElement=this;}click(){this.clicked=true;}
  closest(selector){if(selector==='[data-search-scope]'&&this.dataset.searchScope!==undefined||selector==='[data-search-reset]'&&this.dataset.searchReset!==undefined)return this;return null;}
  before(element){scopes=element;}querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  querySelectorAll(selector){return selector==='.universal-result'?this.links:selector==='[data-search-scope]'?this.buttons:[];}
  set innerHTML(html){this.html=html;this.links=[];this.buttons=[];for(const match of html.matchAll(/<a class="universal-result" href="([^"]+)"/g)){const item=new Element();item.href=match[1];this.links.push(item);}for(const match of html.matchAll(/data-search-scope="([^"]+)"/g)){const item=new Element();item.dataset.searchScope=match[1];this.buttons.push(item);}for(const match of html.matchAll(/\bid="([^"]+)"/g))nodes.set(match[1],new Element(match[1]));}get innerHTML(){return this.html||'';}
 }
 for(const match of R.build(D)[page==='catalog'?'tat-ca.html':'index.html'].matchAll(/\bid="([^"]+)"/g))nodes.set(match[1],new Element(match[1]));
 for(const view of ['grid','list']){const button=new Element();button.dataset.catalogView=view;viewButtons.push(button);}
 document.querySelector=selector=>selector.startsWith('#')?nodes.get(selector.slice(1))||null:null;document.querySelectorAll=selector=>selector==='[data-catalog-view]'?viewButtons:[];document.createElement=()=>new Element();
 const window={THCore:{...C,storage:{get:(_,fallback)=>fallback}},THWorkbench:W,THExperienceMarkup:M,TECH_HORIZON:D,TH_STATIC_ROUTES:D.articles.map(a=>a.id),addEventListener(){}},history={replaceState(_,__,url){this.url=String(url);}},location={search:page==='catalog'?'?view=list&q=AI':'',href:'https://example.com/tat-ca.html?view=list&q=AI',pathname:'/tat-ca.html'};
 return {nodes,document,window,history,location,viewButtons,scopes:()=>scopes,execute(file){vm.runInNewContext(fs.readFileSync(require.resolve('../dist/assets/'+file),'utf8'),{window,document,history,location,URL,URLSearchParams,setTimeout:()=>1,clearTimeout(){}});}};
}
test('Universal search controller groups results, preserves Vietnamese highlights and supports result keyboard navigation',()=>{
 const s=surface('home');s.execute('studio.js');s.nodes.get('global-search').value='RAM';s.window.THSearchRender();const results=s.nodes.get('global-results');assert.ok(results.innerHTML.includes('<mark>RAM</mark>'));assert.ok(results.innerHTML.includes('search-result-group'));assert.ok(results.links.length);
 const input=s.nodes.get('global-search');input.fire('keydown',{key:'ArrowDown'});assert.equal(s.document.activeElement,results.links[0]);results.fire('keydown',{key:'End'});assert.equal(s.document.activeElement,results.links.at(-1));results.fire('keydown',{key:'Home'});assert.equal(s.document.activeElement,results.links[0]);results.fire('keydown',{key:'ArrowUp'});assert.equal(s.document.activeElement,input);
 const scope=s.scopes().buttons.find(button=>button.dataset.searchScope==='term');s.scopes().fire('click',{target:scope});assert.ok(results.links.every(link=>link.href.includes('thuat-ngu.html#')));assert.ok(!results.innerHTML.includes('bai-viet/'));
});
test('Catalogue controller restores list view and keeps it while applying or resetting public filters',()=>{
 const s=surface('catalog');s.execute('refinement.js');const grid=s.nodes.get('catalog-grid');assert.ok(grid.classList.contains('catalog-list'));assert.equal(s.nodes.get('catalog-query').value,'AI');
 s.nodes.get('catalog-query').value='RAM';s.nodes.get('catalog-query').fire('input');assert.ok(s.history.url.includes('view=list'));assert.ok(s.history.url.includes('q=RAM'));
 s.viewButtons.find(button=>button.dataset.catalogView==='grid').fire('click');assert.ok(!grid.classList.contains('catalog-list'));assert.ok(!s.history.url.includes('view='));s.nodes.get('catalog-reset').fire('click');assert.ok(!s.history.url.includes('q='));assert.equal(s.document.activeElement,s.nodes.get('catalog-query'));
});
