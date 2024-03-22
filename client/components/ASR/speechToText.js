export const STT = (answer) => {
    return new Promise(async (resolve, reject) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recognition = new webkitSpeechRecognition(); 
            recognition.lang = 'en-US'; 
            recognition.continuous = true; 
            recognition.interimResults = true; 
            let fullTranscript = '';
            answer.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');

            recognition.onresult = (event) => {
                const interimTranscript = event.results[event.results.length - 1][0].transcript; 
                console.log('Interim Transcription:', interimTranscript);
                fullTranscript += interimTranscript; 
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

            const timeout = setTimeout(() => {
                recognition.stop(); 
                resolve(false);
            }, 5000);

            recognition.addEventListener('end', () => clearTimeout(timeout));
        } catch (error) {
            console.error('Error capturing audio:', error);
            reject(error);
        }
    });
};
