import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'dist');
const Renderer=require('../dist/assets/renderer.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(out,'site-data.js'),'utf8'),context);
const files=Renderer.build(JSON.parse(JSON.stringify(context.window.TECH_HORIZON)));
for(const directory of ['bai-viet','chuyen-muc']){
 const folder=path.join(out,directory);if(!fs.existsSync(folder))continue;
 for(const name of fs.readdirSync(folder)){if(name.endsWith('.html')&&!Object.hasOwn(files,directory+'/'+name))fs.unlinkSync(path.join(folder,name));}
}
for(const [relative,contents] of Object.entries(files)){const dest=path.join(out,relative);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,contents);}
// Bundle only reusable files. Generated pages/data are built afresh by the same renderer in the editor.
const reusable=['bien-tap.html',...fs.readdirSync(path.join(out,'assets')).filter(name=>!['package-assets.js','static-routes.js'].includes(name)).map(name=>'assets/'+name)];
const bundle={version:6,files:Object.fromEntries(reusable.map(name=>[name,fs.readFileSync(path.join(out,name)).toString('base64')]))};
fs.writeFileSync(path.join(out,'assets/package-assets.js'),'window.TH_PACKAGE = '+JSON.stringify(bundle)+';\n');
console.log('Built '+Object.keys(files).filter(f=>f.endsWith('.html')).length+' pages; '+reusable.length+' offline export assets. No dependencies.');
