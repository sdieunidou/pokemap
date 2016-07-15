var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io')(8081);

var position = {

};

io.on('connection', function (socket) {
    socket.on('save_position', function (data) {
        position = data;
    });
});

var server = http.createServer(function(req, res) {
    var page = url.parse(req.url).pathname;

    switch (page) {
        case '/':
            res.writeHead(200, {"Content-Type": "text/html"});
            fs.readFile('index.html', 'utf8', function (err,data) {
                if (err) {
                    res.write(err);
                } else {
                    res.write(data);
                }
                res.end();
            });
            break;

        case '/position':
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify(position));
            res.end();
            break;

        default:
            fs.readFile(page.substr(1), 'utf8', function (err,data) {
                if (err) {
                    res.writeHead(404, {"Content-Type": "text/html"});
                    res.write('Page not found');
                } else {
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.write(data);
                }
                res.end();
            });
            break;
    }
});
server.listen(8080);
