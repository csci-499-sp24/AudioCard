import axios from 'axios';

export const STT = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const audioChunks = [];

        recorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });

        recorder.addEventListener('stop', async () => {
            const audioData = new Blob(audioChunks, { type: 'audio/webm' }).arrayBuffer(); // Convert to ArrayBuffer
            const formData = new FormData();
            formData.append('audioData', audioData); // Send raw audio data to server

            try {
                // Send the audio data to the server for transcription
                const response = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + '/api/speechIncoming', {audio: audioData});
                console.log('Transcription:', response.data.transcription);
            } catch (error) {
                console.error('Error transcribing audio:', error);
            }
        });

        recorder.start();
        setTimeout(() => {
            recorder.stop();
        }, 5000); // Stop recording after 5 seconds
    } catch (error) {
        console.error('Error capturing audio:', error);
    }
};