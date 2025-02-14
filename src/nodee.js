import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;
  const id = parsedUrl.searchParams.get('id');

  if (method === 'GET' && parsedUrl.pathname === '/todos') {
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, fileData) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      const db = JSON.parse(fileData);

      if (id) {
        const todo = db.todos.find(todo => todo.id == id); 
        if (todo) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(todo));
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Todo not found');
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(db.todos));
      }
    });
  } else if (method === 'PUT' && parsedUrl.pathname === '/todos') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, fileData) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
        let db = JSON.parse(fileData);
        const updatedTodo = JSON.parse(body);
        const index = db.todos.findIndex(todo => todo.id == id); 
        if (index !== -1) {
          db.todos[index] = updatedTodo;
          fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(db), err => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
              return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedTodo));
          });
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        }
      });
    });
  } else if (method === 'DELETE' && parsedUrl.pathname === '/todos') {
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, fileData) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      let db = JSON.parse(fileData);
      const index = db.todos.findIndex(todo => todo.id == id); 
      if (index !== -1) {
        db.todos.splice(index, 1);
        fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(db), err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Deleted');
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });
  } else if (method === 'POST' && parsedUrl.pathname === '/todos') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, fileData) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
        let db = JSON.parse(fileData);
        if (!Array.isArray(db.todos)) {
          db.todos = [];
        }
        const newTodo = JSON.parse(body);
        db.todos.push(newTodo);
        fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(db), err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newTodo));
        });
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}).listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
