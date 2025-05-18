const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  processVoiceCommand,
  startRecording,
  stopRecording
} = require('../controllers/voiceController');

// Apply authentication to all routes
router.use(protect);

// Voice command routes
router.post('/process', processVoiceCommand);
router.post('/start-recording', startRecording);
router.post('/stop-recording', stopRecording);

module.exports = router; 