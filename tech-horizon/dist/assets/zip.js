(function(root){
'use strict';
const encoder=new TextEncoder();
const table=Uint32Array.from({length:256},(_,n)=>{let c=n;for(let i=0;i<8;i++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes)crc=table[(crc^byte)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
function u16(buffer,offset,value){new DataView(buffer.buffer).setUint16(offset,value,true);}
function u32(buffer,offset,value){new DataView(buffer.buffer).setUint32(offset,value,true);}
function create(files){
 if(files.length>5000)throw Error('Quá nhiều tệp trong gói.');
 const chunks=[],central=[];let offset=0,total=0;
 for(const file of files){
  if(typeof file.name!=='string'||file.name.startsWith('/')||file.name.split('/').some(p=>p==='..')||file.name.includes('\\')||file.name.includes('\0'))throw Error('Đường dẫn ZIP không hợp lệ.');
  const name=encoder.encode(file.name),bytes=typeof file.content==='string'?encoder.encode(file.content):file.content;
  if(!(bytes instanceof Uint8Array))throw Error('Nội dung tệp không hợp lệ.');
  total+=bytes.length;if(total>128*1024*1024)throw Error('Gói vượt giới hạn 128 MB.');
  const crc=crc32(bytes),local=new Uint8Array(30+name.length);
  u32(local,0,0x04034b50);u16(local,4,20);u16(local,6,0x0800);u16(local,12,0x21);u32(local,14,crc);u32(local,18,bytes.length);u32(local,22,bytes.length);u16(local,26,name.length);local.set(name,30);
  const entry=new Uint8Array(46+name.length);u32(entry,0,0x02014b50);u16(entry,4,20);u16(entry,6,20);u16(entry,8,0x0800);u16(entry,14,0x21);u32(entry,16,crc);u32(entry,20,bytes.length);u32(entry,24,bytes.length);u16(entry,28,name.length);u32(entry,42,offset);entry.set(name,46);
  chunks.push(local,bytes);central.push(entry);offset+=local.length+bytes.length;
 }
 const centralSize=central.reduce((n,b)=>n+b.length,0),end=new Uint8Array(22);u32(end,0,0x06054b50);u16(end,8,files.length);u16(end,10,files.length);u32(end,12,centralSize);u32(end,16,offset);
 return new Blob([...chunks,...central,end],{type:'application/zip'});
}
const api={create,crc32};if(typeof module==='object'&&module.exports)module.exports=api;else root.THZip=api;
})(typeof window!=='undefined'?window:globalThis);
