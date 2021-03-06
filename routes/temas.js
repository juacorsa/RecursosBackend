const express = require('express');
const {Tema, validar} = require('../models/tema');
const message = require('../messages');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

router.get('/', async (req, res) => {
  var registros = parseInt(req.query.registros);
  var pagina = parseInt(req.query.pagina);

  const temas = await Tema
    .find()
    .skip((pagina - 1) * registros)
    .limit(registros)
    .sort('nombre');
    	
	res.send(temas);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const tema = await Tema.findById(req.params.id);
  if (!tema) return res.status(404).send(message.TEMA_NO_ENCONTRADO);

  res.send(tema);
});

router.post('/', async (req, res) => {
	const { error } = validar(req.body);
	if (error) return res.status(400).send(error.details[0].message);

  const nombre = req.body.nombre;

  let existe = await Tema.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
  if (existe) return res.status(400).send(message.TEMA_YA_EXISTE);  

	let tema = new Tema({ nombre: req.body.nombre });
	tema = await tema.save();

	res.send(tema);
});

router.put('/:id', validateObjectId, async (req, res) => {
  const { error } = validar(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const nombre = req.body.nombre;

  let existe = await Tema.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
  if (existe) return res.status(400).send(message.TEMA_YA_EXISTE);  
  
  const tema = await Tema.findByIdAndUpdate(req.params.id,
    { 
      nombre
    }, { new: true });

  if (!tema) return res.status(404).send(message.TEMA_NO_ENCONTRADO);

  res.send(tema);
});

module.exports = router;