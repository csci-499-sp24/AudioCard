import axios from 'axios';
import { Howl } from 'howler';

export const TTS = (input, voiceGender, language, speakingRate) => {
    if (!language) {
        language = 'en-US';
    }
    if (!speakingRate){
        speakingRate = 1.0; 
    }

    return new Promise((resolve, reject) => {
        axios.post(process.env.NEXT_PUBLIC_SERVER_URL + '/api/textToSpeech', { input, voiceGender, language , speakingRate}, { responseType: 'arraybuffer' })
            .then(response => {
                const audioData = Buffer.from(response.data).toString('base64');
                const audioSrc = `data:audio/mp3;base64,${audioData}`;

                const sound = new Howl({
                    src: [audioSrc],
                    format: ['mp3']
                });

                sound.play(); 

                setTimeout(() => {
                    console.log("Duration at TTS:", duration)
                    resolve(sound.duration());
                }, 1000);
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            });
    });
}
