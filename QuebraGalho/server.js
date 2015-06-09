var bodyParser = require('body-parser')
	express = require('express'),
	com = require('./com.js'),
	im = require('imagemagick'),
	fs = require('fs'),
	com = require('./com.js');

var multer = require('multer');

// Routes

	
	var app = express();

app.use(bodyParser.urlencoded({
	extended: false 
}));

app.use(bodyParser.json());
app.use(multer({dest: './tmp/'}))
app.use(express.static(__dirname + '/public'));



app.get('/ping', function (req, res) {
  res.send('Hello World!');
  console.log("Hello")
});


app.post('/com', com.addPessoa);
app.post('/rate', com.updateRate);
app.post('/remove', com.removeAccount);
app.post('/message', com.addMessage);

// listar todas as pessoas registadas
app.get('/com', com.listarPessoas);


// listar todas as profissões 
app.get('/profissao', com.listarProfissao);


// listar uma pessoa por idprof e idlocal
app.get('/com/:idprof/:idlocal', com.getPessoa);


// listar pessoas por profissão
//app.get('/com/:pessoaProfId', com.getPessoaProf);

app.post('/upload', com.uploadFile);
app.get('/image/:IdFoto', com.getFile);





//app.get('/com/range/:latt/:logt/:distance', com.getPOIByDistance);
//app.get('/com/range/:latt/:logt/:distance/:type', com.getPOIByType);


var server = app.listen(3000, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('Listening at http://%s:%s', host, port)
});
