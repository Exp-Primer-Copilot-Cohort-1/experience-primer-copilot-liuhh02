// Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const comments = require('./comments.json');

// Create server
http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url, true);
    if (pathname === '/') {
        fs.readFile(path.resolve(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (pathname === '/comments') {
        if (req.method === 'POST') {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                let comment = JSON.parse(data);
                comment.id = Date.now();
                comments.push(comment);
                fs.writeFile(path.resolve(__dirname, 'comments.json'), JSON.stringify(comments), err => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Server Error');
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(comments));
                });
            });
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(comments));
        }
    } else {
        fs.readFile(path.resolve(__dirname, pathname), (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
    }
}).listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
```

###