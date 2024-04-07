const express = require('express'); 
const router = express.Router(); 
const sentenceEncoder = require("@tensorflow-models/universal-sentence-encoder")
const tf = require('@tensorflow/tfjs-node');


let loadedModel;

const loadModel = async () => {
    if (!loadedModel) {
        loadedModel = await sentenceEncoder.load();
    }
    return loadedModel; 
} 

function cosineSimilarity(vec1, vec2) {
    const dotProd = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
    return dotProd / (mag1 * mag2);
}


router.route('/')
.post(async (req, res) => {
    try {
        await tf.setBackend('tensorflow');
        
        const model = await loadModel();
        
        const { answer, speech } = req.body;

        const embeddings = await model.embed([answer, speech]);
        const answerEmbedding = embeddings.slice([0], [1]).arraySync()[0];
        const speechEmbedding = embeddings.slice([1], [1]).arraySync()[0];

        const similarity = cosineSimilarity(answerEmbedding, speechEmbedding);

        res.json({ similarity }); 
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
