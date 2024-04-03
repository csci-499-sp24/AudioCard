import axios from 'axios';
    export const checkAnswerSTT = (answer, timeLimit, language) => {
        return new Promise(async (resolve, reject) => {
            try {
                const recognition = new webkitSpeechRecognition(); 
                recognition.lang = language; 
                recognition.continuous = true; 
                recognition.interimResults = true; 
                let fullTranscript = '';

                recognition.onresult = async (event) => {
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            fullTranscript += event.results[i][0].transcript + ' '; 
                        }
                    }
                    if (fullTranscript.length >= 1) {
                    const response = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + '/api/sentenceEncoder/', { answer: answer, speech: fullTranscript });
                    const similarity = response.data.similarity;
                    console.log (fullTranscript, similarity)
                   if (similarity >= 0.75) {
                        console.log('Match!'); 
                    }
                    else {
                        console.log('Did not match')
                    }
                    }
                }; 

                recognition.start();

                let timeout = setTimeout(() => {
                    recognition.stop();
                    resolve(false);
                }, timeLimit * 1000);
    
                recognition.addEventListener('end', () => {
                    clearTimeout(timeout);
                });

            } catch (error) {
                console.error('Error:', error);
                reject(error);
            }
        });
    };

