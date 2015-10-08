var express = require('express');

var routes = function(Book) { //Classe Book é injected
	var bookRouter = express.Router();

	bookRouter.route('/')
		.post(function(req, res) {
			var book = new Book(req.body);
			book.save();
			res.status(201).send(book);
		})
		.get(function(req, res) {
			var query = {};
			if(req.query.genre) { query.genre = req.query.genre; }
			
			Book.find(query, function(err, books) {
				if(err) res.status(500).send(err);
				else res.json(books);
			});
		});

	//intercepta busca direto pelo id
	bookRouter.use('/:bookId', function(req, res, next) {
		Book.findById(req.params.bookId, function(err, book) {
			if(err) res.status(500).send(err);
			else if(book) { //encontrou o book no BD
				req.book = book;
				next(); //continua a execução depois do middleware
			}
			else //fez a busca com sucesso, mas não retornou nada
				res.status(404).send('no book found');
		});
	});
	
	bookRouter.route('/:bookId')
		.get(function(req, res) { res.json(req.book); })
		.put(function(req, res) {
			req.book.title = req.body.title;
			req.book.author = req.body.author;
			req.book.genre = req.body.genre;
			req.book.read = req.body.read;
			req.book.save(function(err) {
				if(err) res.status(500).send(err);
				else res.json(req.book);
			});
			res.json(req.book);
		})
		.patch(function(req, res) {
			//retiro o id da requisição do patch para não poder ser atualizado,
			//pois com o loop abaixo tudo que estiver no body vai sobre-escrever no objeto de atualização
			if(req.body._id) delete req.body._id;
			//loop nas chaves que existem no body
			for(var p in req.body) req.book[p] = req.body[p];
			
			req.book.save(function(err) {
				if(err) res.status(500).send(err);
				else res.json(req.book);
			});
		})
		.delete(function(req, res) { 
			req.book.remove(function(err) {
				if(err) res.status(500).send(err);
				else res.status(204).send('Removed');
			}); 
		});
		
	return bookRouter;
};

module.exports = routes;