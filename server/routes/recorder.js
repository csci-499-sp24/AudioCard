const express = require('express');
const router = express.Router();
const recorder = require('node-record-lpcm16')

router.route('/')
.post(async (req, res) => {
    try {
        const recording = recorder.record({
            sampleRateHertz: 16000,
            threshold: 0,
            silence: '3.0',
            verbose: false,
            recordProgram: 'rec',
            device: 'default',
            endOnSilence: true,
            silenceThreshold: 3
        });

        const audioChunks = [];

        recording.stream().on('data', chunk => {
            audioChunks.push(chunk);
        });

        recording.stream().on('end', async () => {
            const audioData = Buffer.concat(audioChunks);
            const base64Audio = audioData.toString('base64');
            res.status(200).json({ audioData: base64Audio });
        });

        setTimeout(() => {
            recording.stop();
        }, 5000);
    } catch (error) {
        console.error('Error during recording: ', error);
        res.status(500).send('Error occurred during recording.');
    }
});
module.exports = router;