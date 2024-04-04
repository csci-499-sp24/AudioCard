const express = require('express');
const router = express.Router();
const { LanguageServiceClient } = require('@google-cloud/language'); 

const languageClient = new LanguageServiceClient();

router.route('/analyze-text')
.post(async (req, res) => {
    try {
        const text = req.body.input;
        console.log('Text sent to API:', text); 

        const [analysis] = await languageClient.analyzeSentiment({
            document: {
                content: text,
                type: 'PLAIN_TEXT',
            },
            encodingType: 'UTF8', 
        });

        const sentimentScore = analysis.documentSentiment.score;

        res.json({ sentimentScore });
    } catch (error) {
        console.error('Error analyzing text:', error);
        res.status(500).json({ error: 'An error occurred while analyzing text' });
    }
});

module.exports = router;
