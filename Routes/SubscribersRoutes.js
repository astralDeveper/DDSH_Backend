const express = require("express");
const { createSubscriber, getSubscriber, getSubscriberById, downloadContactMessages, deleteSubscriber } = require('../controllers/subscriberController.js');

const router = express.Router();

router.post('/subscriber', createSubscriber);
router.get('/subscribers', getSubscriber);
router.get('/subscriber/:id', getSubscriberById);
router.get('/download-subscribers', downloadContactMessages);
router.delete("/subscriber/:id", deleteSubscriber);  

module.exports = router;