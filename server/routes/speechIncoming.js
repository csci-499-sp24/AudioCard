const express = require('express');
const router = express.Router();
const { SpeechClient } = require('@google-cloud/speech');
const fs = require('fs');


const client = new SpeechClient();

const config = {
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  languageCode: 'en-US',
};

router.route('/')
.post(async (req, res) => {
  try {
    const audioData = req.body.audio;
    const request = {
        audio: {
            content: audioData
        },
        config: config,
    };
    const [response] = await client.recognize(request);

    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

    res.status(200).json({ transcription });
} catch (error) {
    console.error('Error during transcription:', error);
    res.status(500).send('Error occurred during transcription.');
}
});

  module.exports = router;