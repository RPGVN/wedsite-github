(function(root){
'use strict';
const C=typeof module==='object'&&module.exports?require('./core.js'):root.THCore;
const catalog=[
 {id:'prompt',title:'Xây prompt rõ ràng',description:'Biến chủ đề thành một yêu cầu có ngữ cảnh, định dạng và bước kiểm chứng.',icon:'spark'},
 {id:'transfer',title:'Tính thời gian tải tệp',description:'Đổi Mbps sang MB/s, phân biệt GB và GiB, ước lượng theo tốc độ nhập.',icon:'network'},
 {id:'utm',title:'Tạo liên kết chiến dịch',description:'Gắn tham số UTM đúng cấu trúc cho liên kết bạn muốn chia sẻ.',icon:'arrow'},
 {id:'publish',title:'Rà soát trước khi đăng',description:'Một danh sách thực hành để rà nội dung, nguồn và hình ảnh.',icon:'shield'},
 {id:'media',title:'Chuẩn bị ảnh',description:'Cắt khung, đổi kích thước và giảm dung lượng ảnh ngay trên thiết bị.',icon:'edit'},
 {id:'script',title:'Tính thời lượng kịch bản',description:'Đếm nội dung và ước tính thời gian đọc theo tốc độ bạn chọn.',icon:'clock'}
];
const checks=[
 {id:'question',group:'Nội dung',text:'Tiêu đề nêu đúng điều bài viết giải thích.'},
 {id:'reader',group:'Nội dung',text:'Thuật ngữ khó được giải thích cho người đọc mục tiêu.'},
 {id:'example',group:'Nội dung',text:'Có một ví dụ hoặc bước thực hành cụ thể.'},
 {id:'source',group:'Kiểm chứng',text:'Đã mở nguồn gốc và đối chiếu khẳng định quan trọng.'},
 {id:'date',group:'Kiểm chứng',text:'Ngày, tên riêng và số liệu được kiểm tra lại.'},
 {id:'unknown',group:'Kiểm chứng',text:'Phần chưa biết được nói rõ thay vì suy đoán thành sự thật.'},
 {id:'rights',group:'Hình ảnh',text:'Hình, video và âm thanh là nội dung mình có quyền dùng.'},
 {id:'legibility',group:'Hình ảnh',text:'Chữ và chú thích đọc được trên màn hình điện thoại.'},
 {id:'thumbnail',group:'Hình ảnh',text:'Ảnh minh họa phù hợp với nội dung, không tạo hiểu nhầm.'},
 {id:'privacy',group:'Trước khi chia sẻ',text:'Không để lộ thông tin cá nhân hoặc dữ liệu nội bộ.'},
 {id:'link',group:'Trước khi chia sẻ',text:'Các đường dẫn mở đúng đích và không chứa thông tin nhạy cảm.'},
 {id:'review',group:'Trước khi chia sẻ',text:'Đã đọc lại bản cuối và lưu nguồn để sửa khi cần.'}
];
function transfer(mbps,amount,unit='GB',overhead=0){
 const speed=Number(mbps),size=Number(amount),loss=Number(overhead),units={MB:1e6,GB:1e9,MiB:2**20,GiB:2**30};
 if(!Number.isFinite(speed)||speed<=0||speed>1e6)throw Error('Tốc độ cần lớn hơn 0 và không quá 1.000.000 Mbps.');
 if(!Number.isFinite(size)||size<=0||!Object.hasOwn(units,unit)||size*units[unit]>1e15)throw Error('Dung lượng hoặc đơn vị chưa hợp lệ (tối đa 1 PB).');
 if(!Number.isFinite(loss)||loss<0||loss>50)throw Error('Hệ số giảm cần từ 0 đến 50%.');
 const effectiveMbps=speed*(1-loss/100),bytes=size*units[unit];
 return {bytes,mbps:speed,effectiveMbps,megabytesPerSecond:effectiveMbps/8,seconds:bytes*8/(effectiveMbps*1e6)};
}
function duration(seconds){let total=Math.ceil(seconds);if(!Number.isFinite(total)||total<0)return '—';const days=Math.floor(total/86400);total%=86400;const hours=Math.floor(total/3600);total%=3600;const minutes=Math.floor(total/60),secs=total%60;return [days?days+' ngày':'',hours?hours+' giờ':'',minutes?minutes+' phút':'',secs?secs+' giây':''].filter(Boolean).join(' ')||'0 giây';}
function utm(input){
 const value=C.url(input.url);if(!value)throw Error('Nhập địa chỉ HTTPS hợp lệ, không kèm tài khoản hoặc mật khẩu.');
 const u=new URL(value);
 for(const field of ['source','medium','campaign'])if(typeof input[field]!=='string'||!input[field].trim()||input[field].length>150)throw Error('Điền nguồn, kênh và tên chiến dịch (mỗi mục tối đa 150 ký tự).');
 for(const field of ['source','medium','campaign','content','term']){
  const text=String(input[field]||'').trim();if(text.length>150)throw Error('Tham số UTM quá dài.');
  u.searchParams.delete('utm_'+field);if(text)u.searchParams.set('utm_'+field,text);
 }
 return u.href;
}
function prompt(input){
 const types={post:'một bài đăng Facebook về công nghệ',script:'kịch bản video ngắn về công nghệ',explain:'một lời giải thích công nghệ dễ hiểu',verify:'một kế hoạch kiểm chứng thông tin công nghệ'};
 const topic=String(input.topic||'').trim(),audience=String(input.audience||'người mới bắt đầu').trim(),context=String(input.context||'').trim();
 if(!topic||topic.length>500)throw Error('Nhập chủ đề từ 1 đến 500 ký tự.');
 if(audience.length>150||context.length>3000||!types[input.type])throw Error('Đối tượng, ngữ cảnh hoặc loại nội dung chưa hợp lệ.');
 const lengths={short:'ngắn gọn, khoảng 150–200 từ',medium:'khoảng 300–400 từ',detailed:'chi tiết, có các bước và ví dụ'};
 const tones={clear:'rõ ràng, bình tĩnh, dễ hiểu',friendly:'gần gũi, tự nhiên, tôn trọng người đọc',professional:'chuyên nghiệp, cụ thể, tránh thuật ngữ không cần thiết'};
 if(!lengths[input.length]||!tones[input.tone])throw Error('Chọn độ dài và giọng điệu phù hợp.');
 return 'Tôi muốn soạn '+types[input.type]+'.\n\nCHỦ ĐỀ\n'+topic+'\n\nĐỐI TƯỢNG\n'+audience+'\n\nYÊU CẦU\n- Giọng điệu '+tones[input.tone]+'.\n- Độ dài '+lengths[input.length]+'.\n- Mở đầu bằng một câu hỏi hoặc tình huống cụ thể.\n- Giải thích thuật ngữ khó và dùng ít nhất một ví dụ.\n- Kết thúc bằng một điều người đọc có thể áp dụng.\n\n'+(context?'NGỮ CẢNH / NGUỒN TÔI CUNG CẤP\n'+context+'\n\n':'')+'KIỂM CHỨNG\nKhông tự bịa số liệu, nguồn hoặc trích dẫn. Tách dữ kiện đã có khỏi suy luận và nêu rõ phần cần xác minh. Nếu thiếu thông tin quan trọng, hỏi lại trước khi kết luận.\n\nĐẦU RA\nĐề xuất tiêu đề, nội dung và danh sách những điều tôi cần kiểm tra lại trước khi đăng.';
}
function search(data,query,kind='all'){
 const q=C.normalize(query).replace(/[^a-z0-9]+/g,' ').trim(),terms=q.split(/\s+/).filter(Boolean);
 const records=[
  ...data.articles.map(a=>({id:a.id,kind:'article',title:a.title,description:a.excerpt,category:a.category,_text:[a.takeaway,...a.sections.map(s=>s.heading+' '+s.text)].join(' ')})),
  ...(data.glossary||[]).map(t=>({id:t.id,kind:'term',title:t.term,description:t.definition})),
  ...(data.journeys||[]).map(j=>({id:j.id,kind:'journey',title:j.title,description:j.description})),
  ...catalog.map(t=>({...t,kind:'tool'})),
  ...[{id:'thu-vien',title:'Thư viện cá nhân',description:'Bài đã lưu, tiến độ đọc, tìm và tải ghi chú trên trình duyệt.'},{id:'dieu-hanh',title:'Trạm điều hành & kế hoạch nội dung',description:'Lập lịch bài viết, bảng tiến độ, xuất lịch ICS và CSV.'},{id:'du-lieu',title:'Dữ liệu & hiển thị',description:'Sao lưu, khôi phục dữ liệu và tùy chọn đọc.'},{id:'gioi-thieu',title:'Giới thiệu & hợp tác',description:'Hồ sơ kênh Tech Horizon và soạn đề xuất liên hệ.'},{id:'thuc-hanh',kind:'page',title:'Trạm thực hành',description:'Bốn nhiệm vụ: prompt AI, rà soát nguồn, chuẩn bị ảnh và thời gian tải tệp.'},
 {id:'huong-dan',title:'Hướng dẫn sử dụng',description:'Thiết lập thương hiệu, biên tập và xuất bản website.'}].map(p=>({...p,kind:'page'}))
 ];
 const clean=s=>C.normalize(s).replace(/[^a-z0-9]+/g,' ');
 const ranked=records.filter(r=>kind==='all'||r.kind===kind).map((r,i)=>{const title=clean(r.title),body=clean(r.description),words=(title+' '+body+' '+clean(r._text||'')).split(' ');const match=!q||terms.every(term=>words.some(word=>word.startsWith(term)));return {...r,_match:match,_rank:q?(title===q?1000:title.startsWith(q)?500:title.includes(q)?250:terms.every(term=>body.includes(term))?100:50):0,_index:i};});
 return ranked.filter(r=>r._match).sort((a,b)=>b._rank-a._rank||a._index-b._index).map(({_match,_rank,_index,_text,...r})=>({...r,description:excerpt(q&&_rank===50&&_text?_text:r.description,query)}));
}
function folded(text){let value='',offset=0;const starts=[],ends=[];for(const char of String(text)){const plain=char.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase();for(let i=0;i<plain.length;i++){value+=plain[i];starts.push(offset);ends.push(offset+char.length);}if(!plain&&ends.length)ends[ends.length-1]=offset+char.length;offset+=char.length;}return {value,starts,ends};}
function highlight(text,query){const original=String(text),map=folded(original),terms=C.normalize(query).match(/[a-z0-9]+/g)||[],ranges=[];for(const term of new Set(terms)){let at=0;while((at=map.value.indexOf(term,at))!==-1){ranges.push([map.starts[at],map.ends[at+term.length-1]]);at+=term.length;}}ranges.sort((a,b)=>a[0]-b[0]);const merged=[];for(const range of ranges){const last=merged.at(-1);if(last&&range[0]<=last[1])last[1]=Math.max(last[1],range[1]);else merged.push([...range]);}let at=0,result='';for(const [start,end]of merged){result+=C.escape(original.slice(at,start))+'<mark>'+C.escape(original.slice(start,end))+'</mark>';at=end;}return result+C.escape(original.slice(at));}
function excerpt(text,query,max=160){const original=String(text),map=folded(original),terms=C.normalize(query).match(/[a-z0-9]+/g)||[],hits=terms.map(term=>map.value.indexOf(term)).filter(i=>i>=0),match=hits.length?map.starts[Math.min(...hits)]:0,start=Math.max(0,original.lastIndexOf(' ',Math.max(0,match-45))+1),pieces=Array.from(original.slice(start)),cut=pieces.slice(0,max).join('');return (start?'… ':'')+cut+(pieces.length>max?'…':'');}
const image=(value,maxBytes)=>C.image(value,maxBytes);
const api={catalog,checks,transfer,duration,utm,prompt,search,image,highlight,excerpt};if(typeof module==='object'&&module.exports)module.exports=api;else root.THWorkbench=api;
})(typeof window!=='undefined'?window:globalThis);
