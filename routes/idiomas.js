const express = require('express');
const {Idioma, validar} = require('../models/idioma');
const message = require('../messages');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

router.get('/', async (req, res) => {
  var registros = parseInt(req.query.registros);
  var pagina = parseInt(req.query.pagina);

  const idiomas = await Idioma
    .find()
    .skip((pagina - 1) * registros)
    .limit(registros)
    .sort('nombre');

	res.send(idiomas);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const idioma = await Idioma.findById(req.params.id);
  if (!idioma) return res.status(404).send(message.IDIOMA_NO_ENCONTRADO);

  res.send(idioma);
});

router.post('/', async (req, res) => {
	const { error } = validar(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let idioma = new Idioma({ nombre: req.body.nombre });
	idioma = await idioma.save();

	res.send(idioma);
});

router.put('/:id', validateObjectId, async (req, res) => {
  const { error } = validar(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const idioma = await Idioma.findByIdAndUpdate(req.params.id,
    { 
      nombre: req.body.nombre
    }, { new: true });

  if (!idioma) return res.status(404).send(message.IDIOMA_NO_ENCONTRADO);

  res.send(idioma);
});

module.exports = router;