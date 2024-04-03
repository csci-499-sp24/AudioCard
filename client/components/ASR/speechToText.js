export const checkAnswerSTT = (answer, timeLimit, language) => {
    return new Promise(async (resolve, reject) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recognition = new webkitSpeechRecognition(); 
            recognition.lang = language; 
            recognition.continuous = true; 
            recognition.interimResults = true; 
            let fullTranscript = '';
            let timeout;
            answer = answer.replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, '');
            
            recognition.onresult = (event) => {
                let interimTranscript = event.results[event.results.length - 1][0].transcript; 
                console.log('Interim Transcription:', interimTranscript);
                fullTranscript += interimTranscript;
                fullTranscript = fullTranscript.replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, '');
                interimTranscript = interimTranscript.replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, '');
                if (fullTranscript.toLowerCase().includes(answer.toLowerCase()) || interimTranscript.toLowerCase().includes(answer.toLowerCase())) {
                    recognition.stop();
                    resolve(true);
                }
            };

            recognition.onerror = (event) => {
                console.error('Recognition Error:', event.error);
                reject(event.error);
            };

            recognition.start();

            timeout = setTimeout(() => {
                recognition.stop();
                resolve(false);
            }, timeLimit * 1000);

            recognition.addEventListener('end', () => {
                clearTimeout(timeout);
            });
        } catch (error) {
            console.error('Error capturing audio:', error);
            reject(error);
        }
    });
};
