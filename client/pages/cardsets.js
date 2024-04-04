import { useState } from 'react'; 

import { checkAnswerSTT } from '../components/ASR/sentenceEncoder';

const Cardsets = () => {
    const [term, setTerm] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault(); 
        checkAnswerSTT(term, 7, 'en-EN'); 
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Term to match"
                    value={term} 
                    onChange={(event) => setTerm(event.target.value)}
                />
                <button type="submit">Test</button>
            </form>
        </div>
    );
};

export default Cardsets;
