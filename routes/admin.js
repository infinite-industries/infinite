const express = require('express');
const router = express.Router();

// List unverified non-expired events
router.get('/list-unverified', function(req, res){
  //
})

// List verified, non-expired events
router.get('/list-verified', function(req, res){
  //
})

// Get specific event info
router.get('/list-event-info', function(req, res){
  //
})

// Update specific event info
router.post('/update-event-info', function(req, res){
  //
})

// Delete specific event
router.get('/delete-event', function(req, res){
  //
})

// Verify specific event
router.get('/verify-event', function(req, res){
  //
})

module.exports = router;
