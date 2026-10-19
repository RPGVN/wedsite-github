import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const directory=path.resolve(import.meta.dirname,'../dist');
const port=Number(process.env.PORT||8080);
if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT phải là một cổng từ 1 đến 65535.');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.json':'application/json; charset=utf-8'};
const server=http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end('Bad request');return;}
  if(pathname.includes('\0')||pathname.includes('\\')||pathname.split('/').some(part=>part.startsWith('.'))){res.writeHead(403);res.end('Forbidden');return;}
  const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/,''),file=path.resolve(directory,relative);
  if(!file.startsWith(directory+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  fs.stat(file,(error,stat)=>{
    const found=!error&&stat.isFile();const target=found?file:path.join(directory,'404.html');
    res.writeHead(found?200:404,{'Content-Type':types[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':'no-cache'});
    if(req.method==='HEAD'){res.end();return;}
    const stream=fs.createReadStream(target);stream.on('error',()=>res.end('Không đọc được tệp.'));stream.pipe(res);
  });
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Cổng ${port} đang được dùng. Chọn PORT khác hoặc đóng ứng dụng dùng cổng đó.`:error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Tech Horizon đang chạy tại http://localhost:${port}\nNhấn Ctrl + C để dừng. Máy chủ này chỉ phục vụ trên máy tính của bạn.`));
