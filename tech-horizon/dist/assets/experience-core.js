(function(root){
'use strict';
const C=typeof module==='object'&&module.exports?require('./core.js'):root.THCore;
function recommendations(data,options={}){
 const category=options.category||'all',goal=options.goal||'understand',minutes=Number(options.minutes??5);
 if(category!=='all'&&!data.categories.some(c=>c.id===category))throw Error('Chọn một chủ đề đang có trên website.');
 if(!['understand','practice'].includes(goal)||![3,5,10,120].includes(minutes))throw Error('Chọn mục tiêu và thời gian phù hợp.');
 const practical=a=>/cach|buoc|thuc hanh|kiem tra|quy trinh/.test(C.normalize(a.title+' '+a.sections.map(s=>s.heading).join(' ')))?1:0;
 return data.articles.filter(a=>(category==='all'||a.category===category)&&a.minutes<=minutes).map((a,i)=>({a,i})).sort((x,y)=>(goal==='practice'?practical(y.a)-practical(x.a):0)||x.a.minutes-y.a.minutes||y.a.date.localeCompare(x.a.date)||x.i-y.i).slice(0,3).map(({a})=>a);
}
function labs(data){const questions=[
 {id:'https',article:'https-khong-du-de-tin-tuong',topic:'AN TOÀN SỐ',question:'Một website có HTTPS. Bạn đã có thể tin mọi điều trên đó?',answers:['Có, biểu tượng khóa là đủ.','Chưa. Vẫn cần kiểm tra nguồn và nội dung.'],correct:1,explanation:'HTTPS bảo vệ kết nối giữa bạn và website. Nó không chứng minh rằng mọi lời hứa, thông tin hay người bán trên trang đều đáng tin.'},
 {id:'memory',article:'ram-va-bo-nho-luu-tru',topic:'THIẾT BỊ',question:'RAM và dung lượng lưu trữ có phải cùng một thứ?',answers:['Khác nhau: RAM giữ dữ liệu đang làm việc, ổ lưu trữ giữ tệp.','Giống nhau, chỉ là hai cách gọi.'],correct:0,explanation:'RAM là không gian làm việc tạm thời. SSD hoặc HDD giữ các tệp và phần mềm lâu dài. Hai thông số giải quyết những nhu cầu khác nhau.'},
 {id:'ai',article:'kiem-chung-cau-tra-loi-ai',topic:'TRÍ TUỆ NHÂN TẠO',question:'AI trả lời trôi chảy và rất tự tin. Bước tiếp theo nên là gì?',answers:['Dùng ngay vì câu trả lời có vẻ thuyết phục.','Đối chiếu khẳng định quan trọng với nguồn gốc.'],correct:1,explanation:'Cách diễn đạt tự tin không đảm bảo thông tin đúng. Hãy mở nguồn gốc, đối chiếu dữ kiện và kiểm tra phần chưa rõ trước khi sử dụng.'}
 ];return questions.filter(q=>data.articles.some(a=>a.id===q.article));}
function answer(questions,id,index){const q=questions.find(q=>q.id===id);if(!q||!Number.isInteger(index)||index<0||index>=q.answers.length)throw Error('Câu trả lời chưa hợp lệ.');return {correct:index===q.correct,explanation:q.explanation,article:q.article};}
function pick(articles,index){if(!articles.length)return null;if(!Number.isInteger(index)||index<0)throw Error('Vị trí bài chưa hợp lệ.');return articles[index%articles.length];}
const api={recommendations,labs,answer,pick};if(typeof module==='object'&&module.exports)module.exports=api;else root.THExperience=api;
})(typeof window!=='undefined'?window:globalThis);
