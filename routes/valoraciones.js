const express = require('express');
const {Valoracion, validar} = require('../models/valoracion');
const message = require('../messages');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

router.get('/', async (req, res) => {
	const valoraciones = await Valoracion.find().sort('nombre');
	res.send(valoraciones);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const valoracion = await Valoracion.findById(req.params.id);
  if (!valoracion) return res.status(404).send(message.VALORACION_NO_ENCONTRADA);

  res.send(valoracion);
});

router.post('/', async (req, res) => {
	const { error } = validar(req.body);
	if (error) return res.status(400).send(error.details[0].message);

  const nombre = req.body.nombre;

  let existe = await Valoracion.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
  if (existe) return res.status(400).send(message.VALORACION_YA_EXISTE);  

	let valoracion = new Valoracion({nombre});
	valoracion = await valoracion.save();

	res.send(valoracion);
});

router.put('/:id', validateObjectId, async (req, res) => {
  const { error } = validar(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const nombre = req.body.nombre;

  let existe = await Valoracion.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
  if (existe) return res.status(400).send(message.VALORACION_YA_EXISTE);  

  const valoracion = await Valoracion.findByIdAndUpdate(req.params.id,
    { 
      nombre
    }, { new: true });

  if (!valoracion) return res.status(404).send(message.VALORACION_NO_ENCONTRADA);

  res.send(valoracion);
});

module.exports = router;