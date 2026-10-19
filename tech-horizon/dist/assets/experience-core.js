(function(root){
'use strict';
const C=typeof module==='object'&&module.exports?require('./core.js'):root.THCore;
const times=[3,5,10,120],goals=['understand','practice','avoid'];
const priorities={
 understand:['bat-dau-voi-ai','ram-va-bo-nho-luu-tru','website-tinh-la-gi','https-khong-du-de-tin-tuong','dns-la-gi'],
 practice:['tu-ghi-chu-den-ke-hoach-voi-ai','don-dung-luong-windows','kiem-tra-ket-noi-tung-buoc','quy-trinh-lam-noi-dung-cong-nghe','mat-khau-va-xac-thuc'],
 avoid:['nhan-dien-tin-nhan-gia-mao','kiem-chung-cau-tra-loi-ai','sao-luu-du-lieu-321','du-lieu-trinh-duyet-la-gi','ram-va-bo-nho-luu-tru']
};
function preferences(data,params){
 const category=params.get('topic'),goal=params.get('goal'),minutes=Number(params.get('minutes')||5);
 return {category:data.categories.some(c=>c.id===category)?category:'all',goal:goals.includes(goal)?goal:'understand',minutes:times.includes(minutes)?minutes:5};
}
function recommendations(data,options={}){
 const category=options.category||'all',goal=options.goal||'understand',minutes=Number(options.minutes??5);
 if(category!=='all'&&!data.categories.some(c=>c.id===category))throw Error('Chọn một chủ đề đang có trên website.');
 if(!goals.includes(goal)||!times.includes(minutes))throw Error('Chọn mục tiêu và thời gian phù hợp.');
 const words={understand:/la gi|bat dau|phan biet|khac nhau|hieu|co che/,practice:/cach|buoc|thuc hanh|kiem tra|quy trinh|thoi quen|don dung luong/,avoid:/gia mao|kiem chung|an toan|sao luu|nham|kiem tra|can than|bao ve/};
 const rank=a=>{const p=priorities[goal].indexOf(a.id);return p>=0?100-p:words[goal].test(C.normalize(a.title+' '+a.sections.map(s=>s.heading).join(' ')))?20:0;};
 return data.articles.filter(a=>(category==='all'||a.category===category)&&a.minutes<=minutes).map((a,i)=>({a,i})).sort((x,y)=>rank(y.a)-rank(x.a)||x.a.minutes-y.a.minutes||y.a.date.localeCompare(x.a.date)||x.i-y.i).slice(0,3).map(({a})=>a);
}
function availableTime(data,category='all'){
 const list=data.articles.filter(a=>category==='all'||a.category===category);if(!list.length)return null;
 const shortest=Math.min(...list.map(a=>a.minutes));return times.find(t=>t>=shortest)||null;
}
function discoveryUrl(data,options){
 const origin=C.url(data.config.siteUrl);if(!origin)return '';
 const valid=preferences(data,new URLSearchParams({topic:options.category,goal:options.goal,minutes:options.minutes}));
 const u=new URL(origin.replace(/\/$/,'')+'/index.html');u.search=new URLSearchParams({topic:valid.category,goal:valid.goal,minutes:String(valid.minutes)}).toString();u.hash='diem-bat-dau';return u.href;
}
const missionSpecs=[
 {id:'ai-ro-rang',category:'ai',symbol:'✳',kicker:'NGHĨ RÕ, HỎI RÕ',title:'Biến một ý tưởng thành prompt rõ ràng.',short:'Hỏi AI rõ hơn',description:'Từ một yêu cầu chung chung đến một bản giao việc có mục tiêu, ngữ cảnh và cách kiểm tra.',articles:['bat-dau-voi-ai','kiem-chung-cau-tra-loi-ai'],tool:'prompt',toolTitle:'Xây prompt rõ ràng',task:'Chọn một chủ đề công khai bạn muốn giải thích. Điền việc cần làm, người đọc và ngữ cảnh vào công cụ. Tạo mẫu, rồi đọc lại trước khi mang sang công cụ AI bạn dùng.',outcome:'Một prompt có cấu trúc và một bước kiểm chứng kết quả.',checks:['Tôi đã nêu rõ việc muốn AI làm và người đọc mục tiêu.','Tôi đã chỉ định định dạng đầu ra và cung cấp ngữ cảnh phù hợp.','Tôi đã ghi cách đối chiếu thông tin trước khi dùng kết quả.'],note:'Viết một câu yêu cầu tốt hơn câu “hãy viết về công nghệ”.',limit:'Công cụ ghép mẫu prompt; không tự gọi AI hoặc kiểm chứng câu trả lời.'},
 {id:'chia-se-co-nguon',category:'safety',symbol:'◇',kicker:'DỪNG LẠI, ĐỐI CHIẾU',title:'Rà một nội dung trước khi chia sẻ.',short:'Chia sẻ có nguồn',description:'Tập nhận ra phần cần kiểm tra, mở nguồn gốc và nói rõ điều mình chưa biết.',articles:['https-khong-du-de-tin-tuong','nhan-dien-tin-nhan-gia-mao'],tool:'publish',toolTitle:'Rà soát trước khi đăng',task:'Chọn một bản nháp công khai của bạn. Mở danh sách rà soát, kiểm tra nguồn và các khẳng định chính. Chỉ đánh dấu những điều bạn đã tự đối chiếu.',outcome:'Một danh sách điều đã kiểm tra và điều cần bổ sung.',checks:['Tôi đã mở nguồn gốc để đối chiếu thông tin chính.','Tôi đã kiểm tra đường dẫn và dữ liệu cá nhân trong bản nháp.','Tôi đã ghi lại phần chưa rõ hoặc cần kiểm tra thêm.'],note:'Điều nào trong bản nháp cần nguồn hoặc cần sửa cách diễn đạt?',limit:'Danh sách do bạn tự rà soát; website không quét liên kết hoặc chứng nhận nội dung an toàn.'},
 {id:'anh-gon-de-doc',category:'tips',symbol:'▧',kicker:'CHUẨN BỊ MỘT LẦN, DÙNG DỄ HƠN',title:'Chuẩn bị một ảnh gọn và dễ đọc.',short:'Ảnh gọn, dễ đọc',description:'Thử cắt khung, đổi kích thước và so sánh dung lượng trước khi chọn bản đăng.',articles:['quy-trinh-lam-noi-dung-cong-nghe'],tool:'media',toolTitle:'Chuẩn bị ảnh',task:'Chọn một ảnh bạn có quyền dùng. Thử khung 1:1 và chiều rộng 1080 px, xem lại phần bị cắt. Xuất hai mức chất lượng rồi so sánh dung lượng và độ dễ đọc.',outcome:'Một tệp ảnh vừa khung và đã được bạn kiểm tra lại.',checks:['Tôi có quyền sử dụng ảnh và đã xem phần bị cắt.','Tôi đã so sánh kích thước, dung lượng và chất lượng ảnh xuất.','Tôi đã mở ảnh kết quả để kiểm tra độ dễ đọc.'],note:'Bạn chọn bản ảnh nào, và vì sao?',limit:'Ảnh xử lý ngay trên thiết bị. Phóng ảnh nhỏ không tạo thêm chi tiết thật; chất lượng còn tùy định dạng và trình duyệt.'},
 {id:'hieu-thoi-gian-tai',category:'devices',symbol:'⇄',kicker:'TỪ THÔNG SỐ ĐẾN THAO TÁC',title:'Hiểu một tệp mất bao lâu để tải.',short:'Hiểu thời gian tải',description:'Thay từng con số để thấy tốc độ và đơn vị dung lượng làm kết quả đổi ra sao.',articles:['kiem-tra-ket-noi-tung-buoc','ram-va-bo-nho-luu-tru'],tool:'transfer',toolTitle:'Tính thời gian tải tệp',task:'Nhập tệp 1 GB, đường truyền 100 Mbps và giữ nguyên hệ số giảm. Ghi kết quả rồi đổi tốc độ thành 50 Mbps. Sau đó đổi GB sang GiB để so sánh đơn vị.',outcome:'Một so sánh có đủ tốc độ, đơn vị và giả định.',checks:['Tôi đã ghi rõ Mbps, đơn vị dung lượng và hệ số giảm.','Tôi đã so sánh hai tốc độ khi các yếu tố khác giữ nguyên.','Tôi phân biệt được phép ước lượng với việc đo mạng thật.'],note:'Kết quả thay đổi thế nào khi bạn đổi một yếu tố?',limit:'Đây là phép tính theo số nhập, không đo tốc độ mạng hoặc đảm bảo thời gian tải thực tế.'}
];
function missions(data){return missionSpecs.map(spec=>{const list=spec.articles.map(id=>data.articles.find(a=>a.id===id)).filter(Boolean);if(!list.length)list.push(...data.articles.filter(a=>a.category===spec.category).slice(0,2));return {...spec,articles:list,checks:[...spec.checks],readMinutes:list.reduce((n,a)=>n+a.minutes,0)};});}
function missionForArticle(data,article){return missions(data).find(m=>m.articles.some(a=>a.id===article.id))||missions(data).find(m=>m.category===article.category)||null;}
function nextArticle(data,article){
 const journey=(data.journeys||[]).find(j=>j.articles.includes(article.id));if(journey){const index=journey.articles.indexOf(article.id),following=journey.articles.slice(index+1).map(id=>data.articles.find(a=>a.id===id)).find(Boolean);if(following)return following;return data.articles.find(a=>a.category===article.category&&!journey.articles.includes(a.id))||null;}
 return data.articles.find(a=>a.category===article.category&&a.id!==article.id)||null;
}
function worksheet(data,id,{checks=[],note=''}={}){
 const m=missions(data).find(m=>m.id===id);if(!m||!Array.isArray(checks)||checks.some(i=>!Number.isInteger(i)||i<0||i>=m.checks.length)||typeof note!=='string'||note.length>2000)throw Error('Phiếu thực hành chưa hợp lệ.');
 const origin=(C.url(data.config.siteUrl)||'').replace(/\/$/,''),prefix=origin?origin+'/':'';
 return 'TECH HORIZON — PHIẾU THỰC HÀNH\n\n'+m.title+'\n\nMỤC TIÊU\n'+m.outcome+'\n\nĐỌC ĐỂ HIỂU\n'+(m.articles.map(a=>'- '+a.title+' ('+a.minutes+' phút)\n  '+prefix+'bai-viet/'+a.id+'.html').join('\n')||'Chưa có cẩm nang phù hợp trong nội dung hiện tại.')+'\n\nVIỆC ĐỂ THỬ\n'+m.task+'\nCông cụ: '+prefix+'studio.html?mission='+m.id+'#'+m.tool+'\n\nTỰ ĐỐI CHIẾU\n'+m.checks.map((text,i)=>(checks.includes(i)?'[x] ':'[ ] ')+text).join('\n')+'\n\nĐIỀU TÔI MANG THEO\n'+note.trim()+'\n\n'+m.limit+'\nDấu chọn do bạn tự đánh giá, không phải kết quả kiểm tra tự động.\n';
}
function practiceState(value){
 if(!value||value.version!==1||!value.entries||typeof value.entries!=='object'||Array.isArray(value.entries)||Object.keys(value.entries).length>missionSpecs.length)throw Error('Phiếu thực hành chưa đúng định dạng.');
 const entries={};for(const[id,item]of Object.entries(value.entries)){
  const spec=missionSpecs.find(m=>m.id===id);if(!spec||!item||typeof item.note!=='string'||item.note.length>2000||!Array.isArray(item.checks)||item.checks.length>spec.checks.length||item.checks.some(i=>!Number.isInteger(i)||i<0||i>=spec.checks.length)||typeof item.updated!=='string'||!Number.isFinite(Date.parse(item.updated)))throw Error('Ghi chép hoặc dấu chọn thực hành chưa hợp lệ.');
  entries[id]={checks:[...new Set(item.checks)],note:item.note,updated:item.updated};
 }return {version:1,entries};
}
function matchingTerms(article,data){const text=C.normalize(article.title+' '+article.takeaway+' '+article.sections.map(s=>s.text).join(' '));return (data.glossary||[]).filter(t=>{const word=C.normalize(t.term).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return word&&new RegExp('(^|[^a-z0-9])'+word+'(?=[^a-z0-9]|$)').test(text);}).slice(0,5);}
function labs(data){const questions=[
 {id:'https',article:'https-khong-du-de-tin-tuong',topic:'AN TOÀN SỐ',question:'Một website có HTTPS. Bạn đã có thể tin mọi điều trên đó?',answers:['Có, biểu tượng khóa là đủ.','Chưa. Vẫn cần kiểm tra nguồn và nội dung.'],correct:1,explanation:'HTTPS bảo vệ kết nối giữa bạn và website. Nó không chứng minh rằng mọi lời hứa, thông tin hay người bán trên trang đều đáng tin.'},
 {id:'memory',article:'ram-va-bo-nho-luu-tru',topic:'THIẾT BỊ',question:'RAM và dung lượng lưu trữ có phải cùng một thứ?',answers:['Khác nhau: RAM giữ dữ liệu đang làm việc, ổ lưu trữ giữ tệp.','Giống nhau, chỉ là hai cách gọi.'],correct:0,explanation:'RAM là không gian làm việc tạm thời. SSD hoặc HDD giữ các tệp và phần mềm lâu dài. Hai thông số giải quyết những nhu cầu khác nhau.'},
 {id:'ai',article:'kiem-chung-cau-tra-loi-ai',topic:'TRÍ TUỆ NHÂN TẠO',question:'AI trả lời trôi chảy và rất tự tin. Bước tiếp theo nên là gì?',answers:['Dùng ngay vì câu trả lời có vẻ thuyết phục.','Đối chiếu khẳng định quan trọng với nguồn gốc.'],correct:1,explanation:'Cách diễn đạt tự tin không đảm bảo thông tin đúng. Hãy mở nguồn gốc, đối chiếu dữ kiện và kiểm tra phần chưa rõ trước khi sử dụng.'}
 ];return questions.filter(q=>data.articles.some(a=>a.id===q.article));}
function answer(questions,id,index){const q=questions.find(q=>q.id===id);if(!q||!Number.isInteger(index)||index<0||index>=q.answers.length)throw Error('Câu trả lời chưa hợp lệ.');return {correct:index===q.correct,explanation:q.explanation,article:q.article};}
function pick(articles,index){if(!articles.length)return null;if(!Number.isInteger(index)||index<0)throw Error('Vị trí bài chưa hợp lệ.');return articles[index%articles.length];}
const api={preferences,recommendations,availableTime,discoveryUrl,missions,missionForArticle,nextArticle,worksheet,practiceState,matchingTerms,labs,answer,pick};if(typeof module==='object'&&module.exports)module.exports=api;else root.THExperience=api;
})(typeof window!=='undefined'?window:globalThis);
