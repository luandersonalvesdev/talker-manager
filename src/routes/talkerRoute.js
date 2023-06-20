const express = require('express');
const { fsReader, fsWrite } = require('../utils/fsUtils');
const {
  tokenValidator, mandatoryValidator, nameValidator,
  ageValidator, watchedAtValidator, rateValidator,
} = require('../middlewares/talkerValidation');

const route = express.Router();

const PATH_TALKER = './src/talker.json';

route.get('/', async (req, res) => {
  const talkers = await fsReader(PATH_TALKER);
  res.status(200).json(talkers);
});

route.post('/',
  tokenValidator, mandatoryValidator, nameValidator, ageValidator,
  watchedAtValidator, rateValidator,
  async (req, res) => {
    const talkers = await fsReader(PATH_TALKER);
    const { id: lastId } = talkers[talkers.length - 1];
    const newTalker = { ...req.body, id: lastId + 1 };
    await fsWrite(newTalker, PATH_TALKER);
    return res.status(201).json(newTalker);
});

route.get('/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await fsReader(PATH_TALKER);
  const talker = talkers.find((talk) => talk.id === Number(id));
  if (talker) return res.status(200).json(talker);
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

module.exports = route;