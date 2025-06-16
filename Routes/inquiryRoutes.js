const express = require('express');
const router = express.Router();

const {
  createInq,
  getAllInquiries,
  getInquiryById,
  deleteInquiry
} = require('../controllers/inquiryController');

// Route to create a new Inquiry message
router.post('/inquiry', createInq);
router.get('/inquiries', getAllInquiries);
router.get('/inquiry/:id', getInquiryById);
router.delete('/inquiry/:id', deleteInquiry);

module.exports = router;