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
            case 'bn-IN':
                switch(phrase) {
                    case 'Try again.':
                        translation = "আবার চেষ্টা কর";
                        break;
                    case 'The correct answer is':
                        translation = "সঠিক উত্তর হল";
                        break;
                    case 'Correct.':
                        translation = "সঠিক";
                        break;
                    default:
                        translation = phrase;
                }
                break;
            case 'cmn-CN':
                switch(phrase) {
                    case 'Try again.':
                        translation = "再试一次";
                        break;
                    case 'The correct answer is':
                        translation = "正确答案是";
                        break;
                    case 'Correct.':
                        translation = "正确的";
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
