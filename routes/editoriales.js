const express = require('express');
const {Editorial, validar} = require('../models/editorial');
const message = require('../messages');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

router.get('/', async (req, res) => {
  const registros = parseInt(req.query.registros);
  const pagina = parseInt(req.query.pagina);

  const editoriales = await Editorial
    .find()
    .skip((pagina - 1) * registros)
    .limit(registros)
    .sort('nombre');
	
	res.send(editoriales);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const editorial = await Editorial.findById(req.params.id);
  if (!editorial) return res.status(404).send(message.EDITORIAL_NO_ENCONTRADA);

  res.send(editorial);
});

router.post('/', async (req, res) => {
	const { error } = validar(req.body);
	if (error) return res.status(400).send(error.details[0].message);

  const nombre = req.body.nombre;
  
  let existe = await Editorial.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
  if (existe) return res.status(400).send(message.EDITORIAL_YA_EXISTE);

	let editorial = new Editorial({nombre});
	editorial = await editorial.save();
	
  res.send(editorial);
});

router.put('/:id', validateObjectId, async (req, res) => {
  const { error } = validar(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const nombre = req.body.nombre;

  let existe = await Editorial.findOne({"nombre": new RegExp("^" + nombre + "$", "i") }); 
  if (existe) return res.status(400).send(message.EDITORIAL_YA_EXISTE);

  const editorial = await Editorial.findByIdAndUpdate(req.params.id,
    { 
      nombre
    }, { new: true });
    
  if (!editorial) return res.status(404).send(message.EDITORIAL_NO_ENCONTRADA);
    
  res.send(editorial);
});

module.exports = router;