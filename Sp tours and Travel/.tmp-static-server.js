const http = require('http');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.gif':'image/gif','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'};
http.createServer((req,res)=>{
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if(reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(root, reqPath);
  if(!filePath.startsWith(root)){res.writeHead(403); return res.end('Forbidden');}
  fs.stat(filePath,(err,st)=>{
    if(err || !st.isFile()){res.writeHead(404); return res.end('Not Found');}
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {'Content-Type': mime[ext] || 'application/octet-stream'});
    fs.createReadStream(filePath).pipe(res);
  });
}).listen(5500,'127.0.0.1');
