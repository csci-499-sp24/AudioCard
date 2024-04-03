import { checkAnswerSTT } from '../components/ASR/sentenceEncoder';

const cardsets = () => {
return (
    <button onClick={() => checkAnswerSTT('I dont like this', 7, 'en-EN')}>Test</button>
);
}

export default cardsets; 