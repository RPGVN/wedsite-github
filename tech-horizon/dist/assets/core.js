(function (root) {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim();
  function url(value, facebookOnly = false) {
    try {
      const u = new URL(String(value));
      if (u.protocol !== 'https:' || u.username || u.password) return '';
      if (facebookOnly && !['facebook.com','www.facebook.com','m.facebook.com','fb.com','www.fb.com','fb.me','www.fb.me'].includes(u.hostname)) return '';
      return u.href;
    } catch { return ''; }
  }
  const storage = {
    get(key, fallback) { try { const v=localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(key,value) { try { localStorage.setItem(key,JSON.stringify(value)); return true; } catch { return false; } },
    remove(key) { try { localStorage.removeItem(key); return true; } catch { return false; } }
  };
  function filter(articles, options = {}) {
    const q=normalize(options.query).replace(/[^a-z0-9]+/g,' ').trim();
    const categoryWords={ai:'AI trí tuệ nhân tạo xu hướng',tips:'thủ thuật hữu ích',devices:'thiết bị kết nối',safety:'an toàn số bảo mật'};
    const list = articles.filter(a => (!options.category || options.category==='all' || a.category===options.category)
      && (!options.savedOnly || (options.saved || []).includes(a.id))
      && (!q || (' '+normalize((a.id||'').replace(/-/g,' ')+' '+a.title+' '+a.excerpt+' '+(categoryWords[a.category]||a.category)+' '+(a.takeaway||'')+' '+(a.sections||[]).map(s=>s.heading+' '+s.text).join(' ')).replace(/[^a-z0-9]+/g,' ')).includes(' '+q)));
    const contains=value=>(' '+normalize(value).replace(/[^a-z0-9]+/g,' ')).includes(' '+q);
    const relevance=a=>!q?0:contains(a.title)?300:contains((a.id||'').replace(/-/g,' '))?200:contains(a.excerpt)?100:0;
    const rank=(a,b)=>relevance(b)-relevance(a);
    if(options.sort==='oldest') list.sort((a,b)=>a.date.localeCompare(b.date)||rank(a,b));
    else if(options.sort==='shortest') list.sort((a,b)=>a.minutes-b.minutes||rank(a,b));
    else if(options.sort==='newest')list.sort((a,b)=>b.date.localeCompare(a.date)||rank(a,b));
    else list.sort((a,b)=>rank(a,b)||b.date.localeCompare(a.date));
    return list;
  }
  function validate(data) {
    const errors=[];
    if(!data || typeof data!=='object' || !data.config || !Array.isArray(data.articles) || !Array.isArray(data.categories)) return ['Tệp phải chứa config, categories và articles.'];
    const c=data.config;
    if(typeof c.name!=='string' || !c.name.trim() || c.name.length>80) errors.push('Tên kênh cần có 1–80 ký tự.');
    if(typeof c.tagline!=='string' || c.tagline.length>160 || typeof c.description!=='string' || c.description.length>1000) errors.push('Thông điệp hoặc mô tả không hợp lệ.');
    if(c.facebookUrl && !url(c.facebookUrl,true)) errors.push('Link Facebook phải là HTTPS trên miền Facebook.');
    if(c.siteUrl && !url(c.siteUrl)) errors.push('Địa chỉ website cần bắt đầu bằng https://.');
    if(c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) errors.push('Email chưa đúng định dạng.');
    if(!/^#[0-9a-f]{6}$/i.test(c.accent || '')) errors.push('Màu nhấn cần có dạng #69d5ff.');
    if(data.articles.length<1 || data.categories.length<1) errors.push('Cần có ít nhất một cẩm nang và một chuyên mục.');
    if(data.articles.length>200 || data.categories.length>20) errors.push('Tối đa 200 bài và 20 chuyên mục trong tệp dữ liệu.');
    const ids=new Set();
    const cats=new Set();
    data.categories.forEach(cat=>{
      if(!cat || !/^[a-z0-9-]+$/.test(cat.id || '') || cats.has(cat.id) || typeof cat.name!=='string' || !cat.name.trim()) errors.push('Chuyên mục không hợp lệ hoặc bị trùng.');
      if(cat)cats.add(cat.id);
    });
    const images=['ai','ai-check','chip','shield','storage','network','lock','browser'];
    data.articles.forEach((a,i)=>{
      const label='Bài '+(i+1)+': ';
      if(!a || typeof a!=='object') { errors.push(label+'không hợp lệ.'); return; }
      if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.id || '') || ids.has(a.id)) errors.push(label+'mã bài không hợp lệ hoặc trùng.');
      ids.add(a.id);
      if(typeof a.title!=='string' || !a.title.trim() || a.title.length>200) errors.push(label+'tiêu đề cần có 1–200 ký tự.');
      if(typeof a.excerpt!=='string' || a.excerpt.length>600 || typeof a.takeaway!=='string') errors.push(label+'mô tả hoặc tóm tắt không hợp lệ.');
      if(!cats.has(a.category)) errors.push(label+'chuyên mục không tồn tại.');
      if(!/^\d{4}-\d{2}-\d{2}$/.test(a.date || '') || !Number.isFinite(Date.parse(a.date+'T00:00:00Z')) || new Date(a.date+'T00:00:00Z').toISOString().slice(0,10)!==a.date) errors.push(label+'ngày không hợp lệ.');
      if(!Number.isInteger(a.minutes) || a.minutes<1 || a.minutes>120) errors.push(label+'thời gian đọc phải từ 1 đến 120 phút.');
      if(!images.includes(a.image)) errors.push(label+'ảnh không có trong bộ ảnh.');
      if(!Array.isArray(a.sections) || !a.sections.length || a.sections.length>30) errors.push(label+'cần 1–30 phần nội dung.');
      else a.sections.forEach(s=>{if(!s || typeof s.heading!=='string' || typeof s.text!=='string' || s.heading.length>200 || s.text.length>12000)errors.push(label+'phần nội dung không hợp lệ.');});
      if(!Array.isArray(a.sources))errors.push(label+'nguồn tham khảo cần là danh sách.');
      else a.sources.forEach(s=>{if(!s || typeof s.label!=='string' || !url(s.url)) errors.push(label+'nguồn phải dùng đường dẫn HTTPS.');});
    });
    return [...new Set(errors)];
  }
  const core={escape,normalize,url,storage,filter,validate};
  if(typeof module==='object' && module.exports)module.exports=core;
  else root.THCore=core;
})(typeof window!=='undefined'?window:globalThis);
