// built-in Node.js modules
var qs = require('querystring');
var fs = require('fs');
var http = require('http');
var path = require('path');

var port = 8000;
var public_dir = path.join(__dirname, 'public');
var members_list = '';
var members_list_path = path.join(public_dir, "data");
members_list_path = path.join(members_list_path, "members.json");

var content_type_list = { "css": "text/css", "html": "text/html", "js": "text/javascript", "json": "application/json", "jpeg": "image/jpeg", "jpg": "image/jpeg", "png": "image/png" }

fs.readFile(members_list_path, "utf8", (err, data) => {
    if (err) {
        throw err;
    }
    else {
        members_list = JSON.parse(data);
    }
});

function NewRequest(req, res) {

    var filename = req.url.substring(1);
    if (filename === '') {
        filename = 'index.html';
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString(); // convert binary buffer to string
          body = qs.parse(body);

          var new_member = {
              "fname": body.fname,
              "lname": body.lname,
              "gender": body.gender.substring(0,1),
              "birthday": body.birthday
          };

          members_list[body.email] = new_member;

          fs.writeFile(members_list_path, JSON.stringify(members_list), (err) => {
            if (err) {
                  res.writeHead(404, {'Content-Type': 'text/plain'});
                  res.write('Oh no! Could not find file');
                  res.end();
             }

            });

        });

        req.on('end', () => {
          var fullpath = path.join(public_dir, "join.html");
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

            fs.readFile(members_list_path, "utf8", (err, data) => {
                if (err) {
                    throw err;
                }
                else {
                    members_list = JSON.parse(data);
                }
            });

        });

      }

      if (req.method === 'GET') {
          var fullpath = path.join(public_dir, filename);
          fs.readFile(fullpath, (err, data) => {
             if (err) {
                  res.writeHead(404, {'Content-Type': 'text/plain'});
                  res.write('Oh no! Could not find file');
                  res.end();
             }
             else {
                 res.writeHead(200, {'Content-Type': content_type_list[fullpath.substring(fullpath.lastIndexOf(".") + 1)]});
                 res.write(data);
                 res.end();
             }
          });

      }
}

var server = http.createServer(NewRequest);

console.log('Now listening on port ' + port);
server.listen(port, '0.0.0.0');
