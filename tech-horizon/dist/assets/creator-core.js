(function(root){
'use strict';
const C=typeof module==='object'&&module.exports?require('./core.js'):root.THCore;
const stages=[['idea','Ý tưởng'],['draft','Đang soạn'],['review','Cần rà soát'],['ready','Sẵn sàng'],['published','Đã đăng']];
const formats=[['post','Bài Facebook'],['reel','Reels'],['video','Video'],['guide','Cẩm nang website']];
const groups={content:['th-draft','th-editor-history'],reader:['th-saved','th-progress','th-reader-size'],studio:['th-studio-prompt','th-publish-checks','th-studio-script'],planner:['th-planner'],practice:['th-practice'],preferences:['th-theme','th-preferences']};
const groupNames={content:'Bản nháp & lịch sử biên tập',reader:'Thư viện & ghi chú',studio:'Nội dung nháp Studio',planner:'Kế hoạch nội dung',practice:'Phiếu & ghi chép thực hành',preferences:'Giao diện & hỗ trợ đọc'};
const keys=Object.values(groups).flat();
const clone=x=>JSON.parse(JSON.stringify(x));
function localDate(value){
 if(typeof value!=='string'||!/^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))return null;
 const t=Date.parse(value+':00+07:00');if(!Number.isFinite(t)||new Date(t+7*3600000).toISOString().slice(0,16)!==value)return null;return t;
}
function planner(value){
 if(!value||value.version!==1||!Array.isArray(value.tasks)||value.tasks.length>300)throw Error('Kế hoạch cần đúng định dạng, tối đa 300 mục.');
 const ids=new Set(),tasks=value.tasks.map(t=>{
  if(!t||typeof t.id!=='string'||!/^[a-zA-Z0-9-]{1,80}$/.test(t.id)||ids.has(t.id))throw Error('Mã kế hoạch bị trùng hoặc chưa hợp lệ.');ids.add(t.id);
  for(const [key,limit,required] of [['title',180,true],['notes',5000,false],['sources',3000,false],['url',2000,false]])if(typeof t[key]!=='string'||t[key].length>limit||(required&&!t[key].trim()))throw Error('Tiêu đề hoặc nội dung kế hoạch chưa hợp lệ.');
  if(!stages.some(([id])=>id===t.stage)||!formats.some(([id])=>id===t.format)||typeof t.due!=='string'||(t.due&&!localDate(t.due))||typeof t.updated!=='string'||typeof t.created!=='string'||!Number.isFinite(Date.parse(t.updated))||!Number.isFinite(Date.parse(t.created)))throw Error('Trạng thái, ngày hoặc định dạng kế hoạch chưa hợp lệ.');
  if(t.url&&!C.url(t.url))throw Error('Liên kết bài đã đăng phải là HTTPS.');
  return {id:t.id,title:t.title.trim(),stage:t.stage,format:t.format,due:t.due,notes:t.notes,sources:t.sources,url:t.url,created:t.created,updated:t.updated};
 });return {version:1,tasks};
}
function monthCells(year,month){
 if(!Number.isInteger(year)||year<2000||year>2099||!Number.isInteger(month)||month<0||month>11)throw Error('Tháng không hợp lệ.');
 const start=new Date(Date.UTC(year,month,1)),offset=(start.getUTCDay()+6)%7;
 return Array.from({length:42},(_,i)=>{const d=new Date(Date.UTC(year,month,1-offset+i));return {date:d.toISOString().slice(0,10),day:d.getUTCDate(),current:d.getUTCMonth()===month};});
}
function fold(line){const enc=new TextEncoder();let out='',part='',bytes=0;for(const char of line){const n=enc.encode(char).length;if(bytes+n>75){out+=part+'\r\n';part=' ';bytes=1;}part+=char;bytes+=n;}return out+part;}
const icsText=s=>String(s).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/\r/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'');
const utc=t=>new Date(t).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
function calendar(value,now=new Date().toISOString()){
 const data=planner(value);if(!Number.isFinite(Date.parse(now)))throw Error('Ngày xuất lịch chưa hợp lệ.');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Tech Horizon//Content Planner//VI','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Tech Horizon — Kế hoạch nội dung'];
 for(const t of data.tasks.filter(t=>t.due)){const time=localDate(t.due);lines.push('BEGIN:VEVENT','UID:'+t.id+'@tech-horizon.local','DTSTAMP:'+utc(Date.parse(now)),'DTSTART:'+utc(time),'DTEND:'+utc(time+1800000),'SUMMARY:'+icsText(t.title),'DESCRIPTION:'+icsText('Định dạng: '+formats.find(([id])=>id===t.format)[1]+'\nTrạng thái: '+stages.find(([id])=>id===t.stage)[1]+'\n'+t.notes+'\nNguồn: '+t.sources+'\n'+t.url),'STATUS:CONFIRMED','TRANSP:TRANSPARENT','END:VEVENT');}
 lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';
}
function csv(value){const cell=x=>{let value=String(x);if(/^[\t\r\n]/.test(value)||/^[\s]*[=+@-]/.test(value))value="'"+value;return '"'+value.replace(/"/g,'""')+'"';};return '\ufeff'+[['Tiêu đề','Định dạng','Trạng thái','Ngày giờ (UTC+7)','Ghi chú','Nguồn','Liên kết'],...planner(value).tasks.map(t=>[t.title,formats.find(([id])=>id===t.format)[1],stages.find(([id])=>id===t.stage)[1],t.due,t.notes,t.sources,t.url])].map(row=>row.map(cell).join(',')).join('\r\n');}
function metrics(value,wpm=150){const text=String(value);if(text.length>30000)throw Error('Nhập tối đa 30.000 ký tự.');const speed=Number(wpm);if(!Number.isFinite(speed)||speed<60||speed>300)throw Error('Tốc độ cần từ 60 đến 300 đơn vị mỗi phút.');const units=text.trim()?text.trim().split(/\s+/u).length:0;return {units,characters:[...text].length,lines:text?text.split(/\r?\n/).length:0,seconds:Math.ceil(units/speed*60),readingSeconds:Math.ceil(units/220*60)};}
function cropGeometry(width,height,ratio,outputWidth){
 if(![width,height,outputWidth].every(x=>Number.isFinite(x)&&x>0)||!Number.isInteger(outputWidth)||outputWidth<64||outputWidth>2048||!Number.isFinite(ratio)||ratio<0.5||ratio>2)throw Error('Kích thước ảnh chưa hợp lệ.');
 let sw=width,sh=height;if(width/height>ratio)sw=height*ratio;else sh=width/ratio;return {sx:(width-sw)/2,sy:(height-sh)/2,sw,sh,width:outputWidth,height:Math.round(outputWidth/ratio)};
}
function preferences(value){if(!value||!['system','reduce'].includes(value.motion)||![1,1.12,1.25].includes(value.scale)||typeof value.contrast!=='boolean')throw Error('Tùy chọn hiển thị chưa hợp lệ.');return {motion:value.motion,scale:value.scale,contrast:value.contrast};}
function validateEntry(key,v,ids){
 if(v===null)return null;
 if(key==='th-draft'){if(C.validate(v).length)throw Error('Bản nháp nội dung không hợp lệ.');return clone(v);}
 if(key==='th-editor-history'){if(!Array.isArray(v)||v.length>3||JSON.stringify(v).length>700000||v.some(i=>!i||typeof i.id!=='string'||!/^[a-zA-Z0-9-]{1,80}$/.test(i.id)||!Number.isFinite(Date.parse(i.when))||C.validate(i.data).length))throw Error('Lịch sử biên tập chưa hợp lệ.');return clone(v);}
 if(key==='th-planner')return planner(v);
 if(key==='th-practice')return (typeof module==='object'&&module.exports?require('./experience-core.js'):root.THExperience).practiceState(v);
 if(key==='th-preferences')return preferences(v);
 if(key==='th-theme'){if(!['dark','light'].includes(v))throw Error('Giao diện chưa hợp lệ.');return v;}
 if(key==='th-reader-size'){if(!Number.isInteger(v)||v<14||v>23)throw Error('Cỡ chữ đọc chưa hợp lệ.');return v;}
 if(key==='th-saved'){if(!Array.isArray(v)||v.length>1000||v.some(id=>typeof id!=='string'||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)))throw Error('Bài đã lưu chưa hợp lệ.');return [...new Set(v)];}
 if(key==='th-progress'){const allowed=[...new Set([...ids,...Object.keys(v||{})])];if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).length>1000||Object.keys(v).some(id=>!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)))throw Error('Tiến độ đọc chưa hợp lệ.');return C.readerBackup({type:'tech-horizon-reader',version:1,saved:[],progress:v},allowed).progress;}
 if(key==='th-studio-prompt'){if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Prompt nháp chưa hợp lệ.');const limits={topic:500,type:20,audience:150,length:20,tone:30,context:3000},result={};for(const[k,max]of Object.entries(limits)){if(typeof v[k]!=='string'||v[k].length>max)throw Error('Prompt nháp quá dài hoặc thiếu trường.');result[k]=v[k];}return result;}
 if(key==='th-publish-checks'){const allowed=['question','reader','example','source','date','unknown','rights','legibility','thumbnail','privacy','link','review'];if(!Array.isArray(v)||v.length>12||v.some(id=>!allowed.includes(id)))throw Error('Danh sách rà soát chưa hợp lệ.');return [...new Set(v)];}
 if(key==='th-studio-script'){if(typeof v!=='string'||v.length>30000)throw Error('Kịch bản nháp quá dài.');return v;}
 throw Error('Tệp chứa khóa dữ liệu không được hỗ trợ.');
}
function backup(value,ids=[]){
 if(!value||value.type!=='tech-horizon-device'||value.version!==1||!Number.isFinite(Date.parse(value.exported))||!value.data||typeof value.data!=='object'||Array.isArray(value.data)||JSON.stringify(value).length>6000000)throw Error('Tệp không phải bản sao lưu thiết bị Tech Horizon hợp lệ (tối đa 6 MB văn bản).');
 const data={};for(const[k,v]of Object.entries(value.data)){if(!keys.includes(k))throw Error('Tệp chứa khóa ngoài dữ liệu Tech Horizon.');data[k]=validateEntry(k,v,ids);}return {type:value.type,version:1,exported:value.exported,data};
}
function restore(storage,value,selected=Object.keys(groups),ids=[]){
 const valid=backup(value,ids),allowed=new Set(selected.flatMap(g=>groups[g]||[])),entries=Object.entries(valid.data).filter(([k])=>allowed.has(k)),previous=new Map();
 if(!entries.length)throw Error('Chọn ít nhất một nhóm có dữ liệu trong tệp.');
 for(const[k]of entries)previous.set(k,storage.getItem(k));
 try{for(const[k,v]of entries){if(v===null)storage.removeItem(k);else storage.setItem(k,JSON.stringify(v));}}
 catch(error){let rolledBack=true;for(const[k,v]of previous){try{if(v===null)storage.removeItem(k);else storage.setItem(k,v);}catch{rolledBack=false;}}throw Error(rolledBack?'Không đủ bộ nhớ hoặc trình duyệt chặn lưu. Đã hoàn lại dữ liệu trước thao tác.':'Không lưu/hoàn lại đầy đủ được dữ liệu. Giữ tệp sao lưu và kiểm tra dung lượng trình duyệt.');}
 return entries.length;
}
function health(data){return [{label:'Nội dung website',ok:C.validate(data).length===0,detail:data.articles.length+' cẩm nang · '+data.categories.length+' chuyên mục'},{label:'Facebook chính thức',ok:!!C.url(data.config.facebookUrl,true),detail:data.config.facebookUrl?'Đã cấu hình đường dẫn':'Cần bổ sung URL trang chính xác'},{label:'Email công khai',ok:!!data.config.email,detail:data.config.email?'Đã điền email liên hệ':'Chưa bật liên hệ qua email'},{label:'Địa chỉ website',ok:!!C.url(data.config.siteUrl),detail:data.config.siteUrl||'Cần điền trước khi xuất bản'},{label:'Bài từ Facebook',ok:!!data.socialPosts?.length,detail:(data.socialPosts?.length||0)+' liên kết do bạn tuyển chọn'}];}
function mediaKit(data){return data.config.name+'\n'+data.config.tagline+'\n\n'+data.config.description+'\n\nNỘI DUNG TRÊN WEBSITE\n'+data.articles.length+' cẩm nang · '+data.categories.length+' chuyên mục · '+(data.journeys?.length||0)+' lộ trình · '+(data.glossary?.length||0)+' thuật ngữ\n\nCHỦ ĐỀ\n'+data.categories.map(c=>'- '+c.name+': '+c.description).join('\n')+'\n\nKẾT NỐI\nWebsite: '+(data.config.siteUrl||'Chưa cấu hình')+'\nFacebook: '+(data.config.facebookUrl||'Chưa cấu hình')+'\nEmail: '+(data.config.email||'Chưa cấu hình')+'\n\nSố lượng trên chỉ phản ánh nội dung website, không phải số người theo dõi hoặc lượt tiếp cận Facebook.\n';}
const api={stages,formats,groups,groupNames,keys,planner,localDate,monthCells,calendar,csv,metrics,cropGeometry,preferences,backup,restore,health,mediaKit};if(typeof module==='object'&&module.exports)module.exports=api;else root.THCreator=api;
})(typeof window!=='undefined'?window:globalThis);
