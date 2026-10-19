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
const api={audit};if(typeof module==='object'&&module.exports)module.exports=api;else root.THQuality=api;
})(typeof window!=='undefined'?window:globalThis);
