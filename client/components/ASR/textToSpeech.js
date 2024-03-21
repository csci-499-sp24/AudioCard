import axios from 'axios';

export const TTS = async (input) => {
    const response = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + '/api/textToSpeech', { input }, { responseType: 'arraybuffer' });
    
    const audioData = Buffer.from(response.data).toString('base64');
    const audioSrc = `data:audio/mp3;base64,${audioData}`;

    const sound = new Howl({
        src: [audioSrc], 
        format: ['mp3'],
        onload: () => {
            sound.play();
        }
    });
}