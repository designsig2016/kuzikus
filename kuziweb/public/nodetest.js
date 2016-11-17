var http=require('http');
var port=3000;
var server = http.createServer(function(req,res){
	res.writeHead(200,{'Content-Type' :'text/html'})
	res.write(
	'<html>'+
		'<title>'+
		'</title>'+
		'<body>'+
			'Sapienti sat'+
		'</body>' +
	'</html>') ;
	res.end() ;
}) ;
server.listen(port) ;
console.log('Server runing on '+port) ;
