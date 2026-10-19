(function(root){
'use strict';
const C=typeof module==='object'&&module.exports?require('./core.js'):root.THCore;
function audit(data){
 const errors=C.validate(data);if(errors.length)return {errors,warnings:[],articles:0,sources:0};
 const warnings=[],add=(id,label,detail)=>warnings.push({id,label,detail});
 if(!C.url(data.config.siteUrl))add('','Địa chỉ website','Điền địa chỉ HTTPS trước khi xuất bản để liên kết chia sẻ và sitemap trỏ đúng nơi.');
 if(!C.url(data.config.facebookUrl,true))add('','Kết nối Facebook','Chưa có URL trang chính thức để người đọc mở kênh.');
 for(const a of data.articles){
  if(!a.sources.length)add(a.id,'Nguồn đọc thêm','Bài chưa có nguồn. Mở nguồn gốc và đối chiếu các khẳng định trước khi chia sẻ.');
  if(!a.takeaway.trim())add(a.id,'Điều người đọc mang theo','Bổ sung một ý chính để người mới biết mình học được gì.');
  if(a.customImage&&!a.imageAlt?.trim())add(a.id,'Mô tả ảnh riêng','Thêm mô tả ngắn cho ảnh để người dùng trình đọc màn hình hiểu nội dung.');
  const headings=a.sections.map(s=>C.normalize(s.heading));if(new Set(headings).size<headings.length)add(a.id,'Mục lục','Có tiêu đề phần lặp lại. Đặt tên rõ để người đọc phân biệt.');
  if(a.sections.some(s=>s.text.length>1400))add(a.id,'Đoạn nội dung dài','Có phần trên 1.400 ký tự. Cân nhắc tách thành các ý ngắn để đọc trên điện thoại.');
  if(a.title.length>100)add(a.id,'Tiêu đề dài','Tiêu đề trên 100 ký tự. Xem lại cách xuống dòng trên màn hình nhỏ.');
 }
 return {errors:[],warnings,articles:data.articles.length,sources:data.articles.reduce((n,a)=>n+a.sources.length,0)};
}
function stable(value){return JSON.stringify(value,(_,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.keys(item).sort().map(key=>[key,item[key]])):item);}
const configLabels={name:'Tên kênh',tagline:'Thông điệp',description:'Giới thiệu',facebookUrl:'Facebook',email:'Email công khai',siteUrl:'Địa chỉ website',accent:'Màu nhấn',contentNote:'Ghi chú biên tập',logoImage:'Logo',heroImage:'Ảnh bìa'};
const articleLabels={title:'Tiêu đề',category:'Chuyên mục',date:'Ngày',minutes:'Thời lượng',image:'Minh họa',featured:'Nổi bật',excerpt:'Mô tả',takeaway:'Ý chính',customImage:'Ảnh riêng',imageAlt:'Mô tả ảnh',sections:'Nội dung / mục lục',sources:'Nguồn'};
function changes(current,baseline){
 const next=C.publicData(current),before=C.publicData(baseline),old=new Map(before.articles.map(a=>[a.id,a])),known=new Set(next.articles.map(a=>a.id));
 const added=[],updated=[],removed=before.articles.filter(a=>!known.has(a.id)).map(a=>({id:a.id,title:a.title}));
 for(const a of next.articles){const prior=old.get(a.id);if(!prior)added.push({id:a.id,title:a.title});else {const fields=Object.keys(articleLabels).filter(key=>stable(a[key])!==stable(prior[key]));if(fields.length)updated.push({id:a.id,title:a.title,fields:fields.map(key=>articleLabels[key])});}}
 const config=Object.keys(configLabels).filter(key=>stable(next.config[key])!==stable(before.config[key])).map(key=>({key,label:configLabels[key]}));
 const collections=[['categories','Chuyên mục'],['journeys','Lộ trình'],['glossary','Thuật ngữ'],['socialPosts','Bài Facebook']].map(([key,label])=>({key,label,count:(next[key]||[]).length,changed:stable(next[key]||[])!==stable(before[key]||[])}));
 const articleOrder=next.articles.map(a=>a.id).join('|')!==before.articles.map(a=>a.id).join('|');
 const countExtra=(raw,clean)=>{if(!raw||typeof raw!=='object')return 0;if(Array.isArray(raw))return raw.reduce((n,item,i)=>n+countExtra(item,clean?.[i]),0);return Object.keys(raw).reduce((n,key)=>n+(Object.hasOwn(clean||{},key)?countExtra(raw[key],clean[key]):1),0);};
 return {added,updated,removed,config,collections,articleOrder,omitted:countExtra(current,next),total:added.length+updated.length+removed.length+config.length+collections.filter(c=>c.changed).length+(articleOrder?1:0)};
}
function report(current,baseline){
 const diff=changes(current,baseline),review=audit(C.publicData(current)),lines=[current.config.name+' — BẢNG XEM THAY ĐỔI','So với nội dung của tệp site-data.js đang mở; không xác minh phiên bản trên hosting.','',diff.added.length+' bài thêm · '+diff.updated.length+' bài sửa · '+diff.removed.length+' URL bài bỏ · '+diff.config.length+' thông tin kênh đổi.'];
 for(const [title,items] of [['BÀI THÊM',diff.added],['BÀI SỬA',diff.updated],['URL BÀI KHÔNG CÒN TRONG BẢN MỚI',diff.removed]])if(items.length)lines.push('',title,...items.map(a=>'- '+a.title+'\n  bai-viet/'+a.id+'.html'+(a.fields?'\n  '+a.fields.join(', '):'')));
 if(diff.config.length)lines.push('','THÔNG TIN KÊNH ĐỔI',...diff.config.map(item=>'- '+item.label));
 lines.push('','CÁC BỘ NỘI DUNG',...diff.collections.map(item=>'- '+item.label+': '+item.count+' mục'+(item.changed?' · đã đổi':'')),'','RÀ SOÁT CẤU TRÚC',...review.warnings.map(item=>'- '+item.label+(item.id?' ['+item.id+']':'')+': '+item.detail),'','Chủ kênh tự mở nguồn và đối chiếu thông tin. Đổi/xóa mã bài có thể làm đường dẫn cũ không còn dùng được. Tải ZIP không tự cập nhật hosting.','Gói website chỉ xuất các trường nội dung được hỗ trợ. Ghi chú đọc, phiếu thực hành, lịch và dữ liệu khôi phục thiết bị không được đưa vào gói công khai.');
 return lines.join('\n')+'\n';
}
function queue(data,baseline,options={}){
 const review=audit(data),diff=changes(data,baseline),added=new Set(diff.added.map(a=>a.id)),updated=new Set(diff.updated.map(a=>a.id)),warnings=new Map();
 for(const item of review.warnings)if(item.id){if(!warnings.has(item.id))warnings.set(item.id,[]);warnings.get(item.id).push(item);}
 const rows=C.filter(data.articles,{query:options.query||'',category:options.category||'all',sort:options.sort||'newest'}).map(article=>({article,warnings:warnings.get(article.id)||[],change:added.has(article.id)?'added':updated.has(article.id)?'updated':'same'}));
 return rows.filter(r=>!options.state||options.state==='all'||options.state==='review'&&r.warnings.length||options.state==='featured'&&r.article.featured||options.state==='changed'&&r.change!=='same');
}
const api={audit,changes,report,queue};if(typeof module==='object'&&module.exports)module.exports=api;else root.THQuality=api;
})(typeof window!=='undefined'?window:globalThis);
