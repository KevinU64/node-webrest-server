import http from 'http';
import fs from 'fs';
import path from 'path';
const server = http.createServer((req, res) => {

    console.log(req.url);
    // console.log(__dirname)

    // res.writeHead(200, {'Content-Type': 'text/html'});
    // res.write(`<h1>URL: ${req.url}</h1>`);
    // res.end();

    // const data = { name: 'Kevin', age: 23, city: 'Bolivia' };
    // res.writeHead(200, { 'Content-Type': 'application/json'});
    // res.end( JSON.stringify(data) );

    if( req.url === '/' ) {
        const filePath = path.join(__dirname, 'public', 'index.html') //windows
        const htmlFile = fs.readFileSync(filePath,'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end( htmlFile );
        return;
    } 

    if( req.url === '/css/styles.css' ) {
        const filePath = path.join(__dirname, 'public', 'css', 'styles.css') //windows
        const css = fs.readFileSync(filePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end( css );
        return
    }

    if( req.url === '/js/app.js' ) {
        const filePath = path.join(__dirname, 'public', 'js', 'app.js') //windows
        const js = fs.readFileSync(filePath,'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end( js );
        return;
    }
    
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
})