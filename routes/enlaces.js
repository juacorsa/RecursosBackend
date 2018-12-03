const express = require('express');
const {Enlace, validar} = require('../models/enlace');
const {Tema} = require('../models/tema');
const {Valoracion} = require('../models/valoracion');
const message = require('../messages');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

// /api/enlaces?pagina=1&registros=5
router.get('/', async (req, res) => {
 	var registros = parseInt(req.query.registros);
    var pagina = parseInt(req.query.pagina);

	const enlaces = await Enlace
		.find()
		.skip((pagina - 1) * registros)
        .limit(registros)
		.sort('titulo');

	res.send(enlaces);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const enlace = await Enlace.findById(req.params.id);
  if (!enlace) return res.status(404).send(message.ENLACE_NO_ENCONTRADO);

  res.send(enlace);
});

router.post('/', async (req, res) => {	
	const { error } = validar(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const tema = await Tema.findById(req.body.temaId);	
	if (!tema) res.status(400).send(message.TEMA_NO_ENCONTRADO);
	
	const valoracion = await Valoracion.findById(req.body.valoracionId);
	if (!valoracion) res.status(400).send(message.VALORACION_NO_ENCONTRADA);
	
	let enlace = new Enlace({ 
		titulo: req.body.titulo,
		url   : req.body.url,
		tema  : tema,
		valoracion: valoracion
	});

	enlace = await enlace.save();
	res.send(enlace);	
});

router.delete('/:id', validateObjectId, async (req, res) => {
	const enlace = await Enlace.findOneAndDelete({_id: req.params.id});  
  	if (!enlace) return res.status(404).send(message.ENLACE_NO_ENCONTRADO);

    res.send(enlace);
});

router.put('/:id', async (req, res) => {
 	const { error } = validar(req.body); 
 	if (error) return res.status(404).send(error.details[0].message);

  	const tema = await Tema.findById(req.body.temaId);	
  	if (!tema) res.status(404).send(message.TEMA_NO_ENCONTRADO);
	
  	const valoracion = await Valoracion.findById(req.body.valoracionId);
  	if (!valoracion) res.status(404).send(message.VALORACION_NO_ENCONTRADA);
	
  	const enlace = await Enlace.findByIdAndUpdate(req.params.id,
    { 
      titulo: req.body.titulo,
      url: req.body.url,
      tema: tema,
      valoracion: valoracion
      
    }, { new: true });

	if (!enlace) return res.status(404).send(message.ENLACE_NO_ENCONTRADO);
  	res.send(enlace);    
});

module.exports = router;