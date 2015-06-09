var express = require('express');
var mysql = require('mysql');
var geo = require('geolib');
var connection = mysql.createConnection({
	host : '127.0.0.1',
	user : 'root',
	password : 'quebragalho',
	database : 'quebra_galho'
});

	
client = mysql.createConnection(connection);
connection.connect(function(err) {
// connected! (unless `err` is set)
	if(err) {
		console.log("Unable to connect to database" + err);
	}
});


exports.removeAccount = function(req, res) {
	var crypto = require('crypto'),
    md5sum = crypto.createHash('md5');
	var dados={
		pass: req.body.pass,
		email: req.body.email,
		idprof: req.body.servico
	}
	
	 md5sum.update(dados.pass);
	 dados.pass= md5sum.digest('hex');
	var str = 'DELETE from pessoas where email = \''+
		dados.email+ '\' AND password = \'' +dados.pass+'\' AND idprof = ' +dados.idprof; 
	var query = connection.query(str, function(err, result,fields) {
		if(err) {
			res.send({status:"ERR", message:err.message + 'SQL = ' + query.sql});
			throw err;
		}	 
		else if(result.affectedRows == '0'){
			res.send({status:"NOT EXIST"});
			console.log('nao existe')
		}
		else{ res.send({status:"OK"});
		console.log('removido')
		}
	});	
}
exports.updateRate = function(req, res) {

	var str = 'UPDATE pessoas SET rate = '+req.body.rate+ ', n_vote =' + 
		req.body.n_vote+ ' where idpessoa = '+req.body.userId; 
		console.log(str);
	
	var query = connection.query(str, function(err, result,fields) {
		if(err) {
			res.send({status:"ERR", message:err.message + 'SQL = ' + query.sql});
			throw err;
		}	 
		else {
			res.send({status:"OK"});
		}
	});	
}

exports.addMessage = function(req, res) {
	var mess = {
		email: req.body.email,
		message: req.body.message
	}
	var query = connection.query('INSERT INTO mensagens SET ?', mess, function(err, result,fields) {
		if(err) {
			res.send({status:"ERR", message:err.message + 'SQL = ' + query.sql});
			throw err;
		}	 
		else {
			res.send({status:"OK", lastId: result.insertId});
		}
	});
}
 exports.addPessoa = function(req, res) {
	 var crypto = require('crypto'),
    md5sum = crypto.createHash('md5');
	 var pessoa = {
		idprof: req.body.idprof,
		nome: req.body.nome,
		telefone: req.body.telefone,
		email: req.body.email,
		mod_pagamento: req.body.mod_pagamento,
		valor: req.body.valor,
		password: req.body.password,
		localidade: req.body.localidade,
		disponibilidade: req.body.disponibilidade,
		info: req.body.info,
		fotoId: req.body.fotoId,
		negociavel: req.body.negociavel,
		sexo: req.body.sexo,
		concelho: req.body.concelho,
		rate: '0',
		n_vote: '0',
		ano_nasc: req.body.ano_nasc,
		ano_reg: req.body.ano_re
		// description: req.body.description,
		// image: req.body.image,
		// type: req.body.type
	};
	 md5sum.update(pessoa.password);
	 pessoa.password= md5sum.digest('hex');
	



  //the whole response has been recieved, so we just print it out here
	var query2 = connection.query('SELECT * FROM pessoas WHERE telefone =' + pessoa.telefone +' AND idprof=' + pessoa.idprof, function(err,rows) {
			if(err) {
				console.log("ERR ");
				throw err;
			}
			else {
				if(rows[0]==null){
					var query = connection.query('INSERT INTO pessoas SET ?', pessoa, function(err, result,fields) {
						if(err) {
							res.send({status:"ERR", message:err.message + 'SQL = ' + query.sql});
							throw err;
						}	 
						else {
							res.send({status:"OK", lastId: result.insertId});
						}
					});
				}
				else{
					res.send({status:"ERR", message:"este utilizador já se encontra registado para este serviço"});
				}
			}
		});
 };

 

// listar todas as pessoas registadas
exports.listarPessoas = function(req, res) {
	console.log("bucsar dados");
	var query = connection.query('SELECT * FROM pessoas', function(err, rows) {
		if(err) {
			res.send({status:"ERR", message:err.message + 'SQL = ' + query.sql});
			throw err;
		}
		else {
			res.send({status:"OK", poi: rows});
		}
	});
};

// listar todas as profissões 
exports.listarProfissao = function(req, res) {
	console.log("bucsar dados");
	var query = connection.query('SELECT * FROM profissao', function(err, rows) {
		if(err) {
			res.send({status:"ERR", message:err.message + 'SQL = ' + query.sql});
			throw err;
		}
		else {
			res.send({status:"OK", poi: rows});
		}
	});
};

// listar uma pessoa por concelho e idprof
exports.getPessoa = function(req, res) {
	var idlocal = req.params.idlocal;
	var idprof = req.params.idprof
	var query = connection.query('SELECT * FROM pessoas WHERE concelho =' + idlocal +' AND idprof=' + idprof, function(err,rows) {
		if(err) {
			res.send({status:"ERR", message:err.message + 'SQL = ' + query.sql});
			throw err;
		}
		else {
			res.send({status:"OK", poi: rows});
		}
	});
};

// listar uma pessoa por idpessoa e idprof
exports.getLocalidade = function(req, res) {
	var idlocal = req.params.idlocal;
	var query = connection.query('SELECT * FROM localidades', function(err,rows) {
		if(err) {
			res.send({status:"ERR", message:err.message + 'SQL = ' + query.sql});
			throw err;
		}
		else {
			res.send({status:"OK", poi: rows});
		}
	});
};

// listar pessoas por profissão
exports.getPessoaProf = function(req, res) {
	var idprof = req.params.pessoaProfId
	var query = connection.query('SELECT * FROM pessoas WHERE idprof =' + idprof, function(err,rows) {
		if(err) {
			res.send({status:"ERR", message:err.message + 'SQL = ' + query.sql});
			throw err;
		}
		else {
			res.send({status:"OK", poi: rows});
		}
	});
};


exports.uploadFile = function(req, res) {
    console.log(req.files);
    console.log(req.files.image.originalname);
    console.log(req.files.image.path);
	console.log(req.body.title);
    fs.readFile(req.files.image.path, function (err, data){
		var fname= req.body.title;
        var dirname = "/Escola/DAAM/myapp/QuebraGalho";
        var newPath = dirname + "/images/" +   req.body.title + "." + "jpg" ;
        fs.writeFile(newPath, data, function (err) {
            if(err){
                res.json({'response':"Error"});
            }else {
                res.json({'response':"Saved"});

                fs.unlink(req.files.image.path, function (err) {
                   if(err) {
                       console.log("Error removing file...");
                   }
                });
            }
        });
    });
};
exports.getFile = function (req, res) {
    console.log("Estou aqui");
	var file = req.params.IdFoto;
	console.log(file);
    var dirname = "/Escola/DAAM/myapp/QuebraGalho";
	
	try{
    var img = fs.readFileSync(dirname + "/images/" + file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
	}
	catch (ex) {
	var img = fs.readFileSync(dirname + "/images/personal2.jpg");
		res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
	}
};


