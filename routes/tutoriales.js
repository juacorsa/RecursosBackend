const express = require('express');
const {Tutorial, validar} = require('../models/tutorial');
const {Tema} = require('../models/tema');
const {Valoracion} = require('../models/valoracion');
const {Idioma} = require('../models/idioma');
const {Fabricante} = require('../models/fabricante');
const validateObjectId = require('../middleware/validateObjectId');
const message = require('../messages');
const util = require('../util');

const router = express.Router();

router.get('/', async (req, res) => {
 	var registros = parseInt(req.query.registros);
    var pagina = parseInt(req.query.pagina);

	const tutoriales = await Tutorial
		.find()
		.skip((pagina - 1) * registros)
        .limit(registros)
		.sort('titulo');

	res.send(tutoriales);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const tutorial = await Tutorial.findById(req.params.id);
  if (!tutorial) return res.status(404).send(message.TUTORIAL_NO_ENCONTRADO);

  res.send(tutorial);
});

router.post('/', async (req, res) => {	
	const { error } = validar(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let añoActual = util.obtenerAñoActual();
	if (req.body.publicado > añoActual) res.status(400).send(message.AÑO_PUBLICACION_NO_VALIDO);	

	const tema = await Tema.findById(req.body.temaId);	
	if (!tema) res.status(404).send(message.TEMA_NO_ENCONTRADO);
	
	const valoracion = await Valoracion.findById(req.body.valoracionId);
	if (!valoracion) res.status(404).send(message.VALORACION_NO_ENCONTRADA);

	const fabricante = await Fabricante.findById(req.body.fabricanteId);
	if (!fabricante) res.status(404).send(message.FABRICANTE_NO_ENCONTRADO);

	const idioma = await Idioma.findById(req.body.idiomaId);
	if (!idioma) res.status(404).send(message.IDIOMA_NO_ENCOTRADO);

	let tutorial = new Tutorial({ 
		titulo    : req.body.titulo,
		publicado : req.body.publicado,		
		duracion  : req.body.horas * 60 + req.body.minutos,
		temaId    : tema,
		valoracion: valoracion,
		idiomaId  : idioma,
		fabricante: fabricante
	});

	tutorial = await tutorial.save();
	res.send(tutorial);	
});

router.put('/:id', validateObjectId, async (req, res) => {	
	const { error } = validar(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let añoActual = util.obtenerAñoActual();
	if (req.body.publicado > añoActual) res.status(400).send(message.AÑO_PUBLICACION_NO_VALIDO);		

	const tema = await Tema.findById(req.body.temaId);	
	if (!tema) res.status(404).send(message.TEMA_NO_ENCONTRADO);
	
	const valoracion = await Valoracion.findById(req.body.valoracionId);
	if (!valoracion) res.status(404).send(message.VALORACION_NO_ENCONTRADA);

	const fabricante = await Fabricante.findById(req.body.fabricanteId);
	if (!fabricante) res.status(404).send(message.FABRICANTE_NO_ENCONTRADO);

	const idioma = await Idioma.findById(req.body.idiomaId);
	if (!idioma) res.status(404).send(message.IDIOMA_NO_ENCOTRADO);

  	let tutorial = await Tutorial.findByIdAndUpdate({_id: req.params.id},
    { 
      titulo    : req.body.titulo,
	  publicado : req.body.publicado,	  
	  duracion  : req.body.horas * 60 + req.body.minutos,
      tema      : tema,
      valoracion: valoracion,
	  idioma    : idioma,
	  fabricante: fabricante
    }, { new: true });	

	tutorial = await tutorial.save();
	res.send(tutorial);	
});

router.delete('/:id', validateObjectId, async (req, res) => {
	const tutorial = await Tutorial.findOneAndDelete({_id: req.params.id});  
  	if (!tutorial) return res.status(404).send(message.TUTORIAL_NO_ENCONTRADO);

    res.send(tutorial);
});

module.exports = router;