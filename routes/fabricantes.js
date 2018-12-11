const express = require('express');
const {Fabricante, validar} = require('../models/fabricante');
const message = require('../messages');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

router.get('/', async (req, res) => {
  var registros = parseInt(req.query.registros);
  var pagina = parseInt(req.query.pagina);

  const fabricantes = await Fabricante
    .find()
    .skip((pagina - 1) * registros)
    .limit(registros)
    .sort('nombre');

	res.send(fabricantes);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const fabricante = await Fabricante.findById(req.params.id);
  if (!fabricante) return res.status(404).send(message.FABRICANTE_NO_ENCONTRADO);

  res.send(fabricante);
});

router.post('/', async (req, res) => {
	const { error } = validar(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let fabricante = new Fabricante({ nombre: req.body.nombre });
	fabricante = await fabricante.save();

	res.send(fabricante);
});

router.put('/:id', validateObjectId, async (req, res) => {
  const { error } = validar(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const fabricante = await Fabricante.findByIdAndUpdate(req.params.id,
    { 
      nombre: req.body.nombre
    }, { new: true });

  if (!fabricante) return res.status(404).send(message.FABRICANTE_NO_ENCONTRADO);

  res.send(fabricante);
});

module.exports = router;