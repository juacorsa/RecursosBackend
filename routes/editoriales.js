const express = require('express');
const {Editorial, validar} = require('../models/editorial');
const message = require('../messages');
const router = express.Router();

router.get('/', async (req, res) => {
  var registros = parseInt(req.query.registros);
  var pagina = parseInt(req.query.pagina);

  const editoriales = await Editorial
    .find()
    .skip((pagina - 1) * registros)
    .limit(registros)
    .sort('nombre');
	
	res.send(editoriales);
});

router.get('/:id', async (req, res) => {
  const editorial = await Editorial.findById(req.params.id);
  if (!editorial) return res.status(404).send(message.EDITORIAL_NO_ENCONTRADA);

  res.send(editorial);
});

router.post('/', async (req, res) => {
	const { error } = validar(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let editorial = new Editorial({ nombre: req.body.nombre });
	editorial = await editorial.save();

	res.send(editorial);
});

router.put('/:id', async (req, res) => {
  const { error } = validar(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const editorial = await Editorial.findOneAndUpdate(req.params.id,
    { 
      nombre: req.body.nombre
    }, { new: true });
    
  if (!editorial) return res.status(404).send(message.EDITORIAL_NO_ENCONTRADA);
    
  res.send(editorial);
});

module.exports = router;