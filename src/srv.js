//Lets require/import the HTTP module
const http = require('http');
const HttpDispatcher = require('httpdispatcher');
const tellstick = require('tellstick')();
const flicUtil = require('./flic-util');
const dispatcher = new HttpDispatcher();
let devList = {};

const PORT=8080;

function handleRequest(request, response){
  try {
    console.log(request.url);
    dispatcher.dispatch(request,response);
  } catch (e) {
      console.log(e);
  }
}

dispatcher.setStatic('/resources');
dispatcher.setStaticDirname('resources');

dispatcher.onGet('/alloff', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  devList.forEach(function(device) {tellstick.turnOff(device.id)});
});

dispatcher.onGet('/allon', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  devList.forEach(function(device) {tellstick.turnOn(device.id)});
});
dispatcher.onPost('/on', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
  console.log(req.body)
  tellstick.turnOn(req.body);
});
dispatcher.onPost('/off', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end();
  console.log(req.body)
  tellstick.turnOff(req.body);
});

dispatcher.onGet('/', function(req, res) {
	var filename = "." + require('path').join('/html/', 'index.html');
	require('fs').readFile(filename, function(err, file) {
		console.log(err);
		if(err) {
			return;
		}
		res.writeHeader(200, {
			"Content-Type": require('mime').lookup(filename)
		});
		res.write(file, 'binary');
		res.end();
	});
});

dispatcher.onGet('/devices', function(req,res) {
  tellstick.list(function(err, list){
    if ( err ) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(err));
    } else {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(list));
    }
  });
});

tellstick.list(function(err,devices) {
  if ( err ) {
      console.log('Error: ' + err);
  }
  devList = devices;
});

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log("Server listening on: http://localhost:%s", PORT);
});
