const express = require('express');
const {Libro, validar} = require('../models/libro');
const {Tema} = require('../models/tema');
const {Valoracion} = require('../models/valoracion');
const {Editorial} = require('../models/editorial');
const {Idioma} = require('../models/idioma');
const validateObjectId = require('../middleware/validateObjectId');
const message = require('../messages');
const util = require('../util');

const router = express.Router();

router.get('/', async (req, res) => {
 	var registros = parseInt(req.query.registros);
    var pagina = parseInt(req.query.pagina);

	const libros = await Libro
		.find()
		.skip((pagina - 1) * registros)
        .limit(registros)
		.sort('titulo');

	res.send(libros);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const libro = await Libro.findById(req.params.id);
  if (!libro) return res.status(404).send(message.LIBRO_NO_ENCONTRADO);

  res.send(libro);
});

router.post('/', async (req, res) => {	
	const { error } = validar(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	
	let añoActual = util.obtenerAñoActual();

	if (req.body.publicado > añoActual) res.status(404).send(message.AÑO_PUBLICACION_NO_VALIDO);

	const tema = await Tema.findById(req.body.temaId);	
	if (!tema) res.status(404).send(message.TEMA_NO_ENCONTRADO);
	
	const valoracion = await Valoracion.findById(req.body.valoracionId);
	if (!valoracion) res.status(404).send(message.VALORACION_NO_ENCONTRADA);

	const editorial = await Editorial.findById(req.body.editorialId);
	if (!editorial) res.status(404).send(message.EDITORIAL_NO_ENCONTRADA);

	const idioma = await Idioma.findById(req.body.idiomaId);
	if (!idioma) res.status(404).send(message.IDIOMA_NO_ENCONTRADO);
	
	let libro = new Libro({ 
		titulo	  : req.body.titulo,
		publicado : req.body.publicado,
		paginas   : req.body.paginas,
		temaId    : tema,
		valoracion: valoracion,
		idiomaId  : idioma,
		editorial : editorial
	});

	libro = await libro.save();
	res.send(libro);	
});

router.put('/:id', validateObjectId, async (req, res) => {	
	const { error } = validar(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let añoActual = hoy.getFullyear();

	if (req.body.publicado > añoActual) res.status(404).send(message.AÑO_PUBLICACION_NO_VALIDO);	

	const tema = await Tema.findById(req.body.temaId);	
	if (!tema) res.status(404).send(message.TEMA_NO_ENCONTRADO);
	
	const valoracion = await Valoracion.findById(req.body.valoracionId);
	if (!valoracion) res.status(404).send(message.VALORACION_NO_ENCONTRADA);

	const editorial = await Editorial.findById(req.body.editorialId);
	if (!editorial) res.status(404).send(message.EDITORIAL_NO_ENCONTRADA);

	const idioma = await Idioma.findById(req.body.idiomaId);
	if (!idioma) res.status(404).send(message.IDIOMA_NO_ENCONTRADO);

  	let libro = await Libro.findByIdAndUpdate({_id: req.params.id},
    { 
      titulo    : req.body.titulo,
	  publicado : req.body.publicado,
	  paginas   : req.body.paginas,            
      tema      : tema,
      valoracion: valoracion,
	  idioma    : idioma,
	  editorial : editorial      
    }, { new: true });	

	libro = await libro.save();
	res.send(libro);	
});

router.delete('/:id', validateObjectId, async (req, res) => {
	const libro = await Libro.findOneAndDelete({_id: req.params.id});  
  	if (!libro) return res.status(404).send(message.LIBRO_NO_ENCONTRADO);

    res.send(libro);
});

module.exports = router;