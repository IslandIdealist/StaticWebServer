// built-in Node.js modules
var fs = require('fs');
var http = require('http');
var path = require('path');

var port = 8000;
var public_dir = path.join(__dirname, 'public');

function NewRequest(req, res) {

    var filename = req.url.substring(1);
    if (filename === '') {
        filename = 'index.html';
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString(); // convert binary buffer to string
        });
        req.on('end', () => {
          console.log(body);
          var fullpath = path.join(public_dir, filename);
          fs.readFile(fullpath, (err, data) => {
             if (err) {
                  res.writeHead(404, {'Content-Type': 'text/plain'});
                  res.write('Oh no! Could not find file');
                  res.end();
             }
             else {
                 res.writeHead(200, {'Content-Type': 'text/html'});
                 res.write(data);
                 res.end();
             }
          });
        });
      }
}

var server = http.createServer(NewRequest);

console.log('Now listening on port ' + port);
server.listen(port, '0.0.0.0');
