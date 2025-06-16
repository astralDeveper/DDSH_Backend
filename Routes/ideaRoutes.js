const express = require('express');
const router = express.Router();

const {
  createIdea,
  getAllIdeas,
  getIdeaById,
  deleteIdea
} = require('../controllers/ideaController');

router.post('/idea', createIdea);
router.get('/ideas', getAllIdeas);
router.get('/idea/:id', getIdeaById);
router.delete('/idea/:id', deleteIdea);

module.exports = router;