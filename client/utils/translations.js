export const getTranslation = (phrase, language) => {
    let translation = '';

    switch (language) {
        case 'fr-FR':
            switch (phrase) {
                case 'Try again.':
                    translation = "Essayez à nouveau.";
                    break;
                case 'The correct answer is':
                    translation = "La réponse correcte est";
                    break;
                default:
                    translation = phrase;
            }
            break; 
        case 'es-ES':
            switch(phrase) {
                case 'Try again.':
                    translation = "Inténtalo otra vez";
                    break;
                case 'The correct answer is':
                    translation = "La respuesta correcta es";
                    break;
                case 'Correct.':
                    translation = "Correcto";
                    break;
                default:
                    translation = phrase;
            }
            break;

        default:
            translation = phrase; 
    }

    return translation;
}
