const express = require('express');
const router = express.Router();
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

const client = new TextToSpeechClient();

router.route('/')
.post(async (req, res) => {
    try {
        const input = {
            text: req.body.input,
        };
        const request = {
            input: input,
            voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
            audioConfig: { audioEncoding: 'MP3' },
        }
        const [response] = await client.synthesizeSpeech(request);

        const audioContent = response.audioContent;
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(audioContent);
    } catch (error) {
        console.error('Error during text to speech: ', error);
        res.status(500).send('Error during text to speech.')
    }
})

module.exports = router;