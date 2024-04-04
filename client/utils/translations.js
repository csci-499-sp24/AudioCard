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
            case 'ru-RU':
                switch(phrase) {
                    case 'Try again.':
                        translation = "Попробуйте еще раз";
                        break;
                    case 'The correct answer is':
                        translation = "Правильный ответ";
                        break;
                    case 'Correct.':
                        translation = "правильно";
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


export const numberSpellings = {
    'en-US': [
        ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
    ],
    'en-GB': [
        ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
    ],
    'fr-FR': [
        ['un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix']
    ],
    'es-ES': [
        ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez']
    ],
    'ru-RU': [
        ['один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять']
    ],
    'cmn-CN': [
        ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
    ],
    'bn-IN': [
        ['এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ']
    ]
};
