const express = require('express');
const router = express.Router();

const {
  createContactMessage,
  getAllContactMessages,
  getContactById,
  deleteContactMessage
} = require('../controllers/contactController');

// Route to create a new contact message
router.post('/contact', createContactMessage);
router.get('/contacts', getAllContactMessages);
router.get('/contact/:id', getContactById);
router.delete('/contact/:id', deleteContactMessage);

module.exports = router;