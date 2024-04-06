import { numberSpellings } from "@/utils/translations";

export const checkAnswerSTT = (answer, timeLimit, language, handleRestartTest, shuffleCards, voiceCommands, setRingSize) => {
    return new Promise(async (resolve, reject) => {
        try {
            let voiceCommandTriggered = false; 
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recognition = new webkitSpeechRecognition(); 
            recognition.lang = language; 
            recognition.continuous = true; 
            recognition.interimResults = true; 
            let fullTranscript = '';
            let timeout;
            answer = answer.replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, '');

            const spelledOutNumbers = numberSpellings[language][0]; 
            for (let i = 0; i < 9; i++) {
                const numRegExp = new RegExp(`(?<![0-9])${i + 1}(?![0-9])`, 'g'); // Match only if not surrounded by other numbers
                answer = answer.replace(numRegExp, spelledOutNumbers[i]);
            }
            
            recognition.onresult = (event) => {
                for (let j = event.resultIndex; j < event.results.length; j++) {
                    if (event.results[j].isFinal) {
                        fullTranscript += event.results[j][0].transcript + ' ';
                        for (let i = 0; i < 9; i++) {
                            const numRegExp = new RegExp(`(?<![0-9])${i + 1}(?![0-9])`, 'g');
                            fullTranscript = fullTranscript.replace(numRegExp, spelledOutNumbers[i]);
                        }
                    }
                }
                let interimTranscript = event.results[event.results.length - 1][0].transcript;
                console.log('Interim Transcription:', interimTranscript);
                if (interimTranscript.toLowerCase().includes(voiceCommands.shuffle) && !voiceCommandTriggered){
                    voiceCommandTriggered = true; 
                    recognition.stop();
                    shuffleCards();
                    return;
                }
                if (interimTranscript.toLowerCase().includes(voiceCommands.restart)  && !voiceCommandTriggered){
                    voiceCommandTriggered = true; 
                    recognition.stop();
                    handleRestartTest();
                    return;
                }
                if (interimTranscript.toLowerCase().includes(voiceCommands.exit)  && !voiceCommandTriggered){
                    voiceCommandTriggered = true; 
                    recognition.stop(); 
                    window.location.reload();
                    return; 
                }
                fullTranscript = fullTranscript.replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, '');
                interimTranscript = interimTranscript.replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, '');
                if (fullTranscript.toLowerCase().includes(answer.toLowerCase()) || interimTranscript.toLowerCase().includes(answer.toLowerCase())) {
                    setRingSize('scaleDown'); 
                    recognition.stop();
                    resolve(true);
                }
            };

            recognition.onerror = (event) => {
                console.error('Recognition Error:', event.error);
                reject(event.error);
            };

            recognition.start();
            setRingSize('scaleUp');  

            timeout = setTimeout(() => {
                recognition.stop();
                setRingSize('scaleDown'); 
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
