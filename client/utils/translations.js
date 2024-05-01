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
                case 'shuffle':
                    translation = "mélange";
                    break;
                case 'exit':
                    translation = "quitte";
                    break;
                case 'restart':
                    translation = "redémarre";
                    break;
                case 'Say "shuffle", "restart", or "exit"':
                    translation = "Dites mélange , redémarre ou quitte";
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
                case 'shuffle':
                    translation = "baraja";
                    break;
                case 'exit':
                    translation = "salida";
                    break;
                case 'restart':
                    translation = "reinicia";
                    break;
                case 'Say "shuffle", "restart", or "exit"':
                    translation = "Di baraja, reinicia o salida";
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
                    case 'shuffle':
                        translation = "অদলবদল";
                        break;
                    case 'exit':
                        translation = "প্রস্থান";
                        break;
                    case 'restart':
                        translation = "আবার শুরু";
                        break;
                    case 'Say "shuffle", "restart", or "exit"':
                        translation = "বলুন অদলবদল, আবার শুরু বা প্রস্থান";
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
                    case 'shuffle': 
                        translation = "打乱";
                        break;
                    case 'exit':
                        translation = "退出";
                        break;
                    case 'restart':
                        translation = "重新开始";
                        break;
                    case 'Say "shuffle", "restart", or "exit"':
                        translation = "说 打乱 重新开始 或 退出";
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
                        translation = "Правильно";
                        break;
                    case 'shuffle':
                        translation = "перемешать";
                        break;
                    case 'exit':
                        translation = "выход";
                        break;
                    case 'restart':
                        translation = "перезапуск";
                        break;
                    case 'Say "shuffle", "restart", or "exit"':
                        translation = "сказать перемешать, перезапуск или выход";
                        break;
                    default:
                        translation = phrase;
                }
                break;
                case 'hi-IN':
                    switch(phrase) {
                        case 'Try again.':
                            translation = "पुनः प्रयास करें";
                            break;
                        case 'The correct answer is':
                            translation = "सही उत्तर है";
                            break;
                        case 'Correct.':
                            translation = "सही";
                            break;
                        case 'shuffle':
                            translation = "मिश्रण";
                            break;
                        case 'exit':
                            translation = "बाहर निकलना";
                            break;
                        case 'restart':
                            translation = "पुनः आरंभ करें";
                            break;
                        case 'Say "shuffle", "restart", or "exit"':
                            translation = '"शफ़ल करें", "पुनः प्रारंभ करें" या "बाहर निकलें" कहें';
                            break;
                        default:
                            translation = phrase;
                    }
                    break;
                    case 'pt-BR':
                        switch(phrase) {
                            case 'Try again.':
                                translation = "Tente novamente.";
                                break;
                            case 'The correct answer is':
                                translation = "A resposta correta é";
                                break;
                            case 'Correct.':
                                translation = "Correto.";
                                break;
                            case 'shuffle':
                                translation = "Embaralhar";
                                break;
                            case 'exit':
                                translation = "Sair";
                                break;
                            case 'restart':
                                translation = "Reiniciar";
                                break;
                            case 'Say "shuffle", "restart", or "exit"':
                                translation = 'Diga "embaralhar", "reiniciar" ou "sair"';
                                break;
                            default:
                                translation = phrase;
                        }
                        break;
                    case 'ar-XA':
                        switch(phrase) {
                            case 'Try again.':
                                translation = "حاول مرة أخرى.";
                                break;
                            case 'The correct answer is':
                                translation = "الإجابة الصحيحة هي";
                                break;
                            case 'Correct.':
                                translation = "صحيح.";
                                break;
                            case 'shuffle':
                                translation = "خلط";
                                break;
                            case 'exit':
                                translation = "خروج";
                                break;
                            case 'restart':
                                translation = "إعادة تشغيل";
                                break;
                            case 'Say "shuffle", "restart", or "exit"':
                                translation = 'قل "خلط"، "إعادة التشغيل" أو "الخروج"';
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
    ],
    'hi-IN': [
        ['एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ', 'दस']
    ],
    'pt-BR': [
        ['um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez']
    ],
    'ar-XA': [
        ['واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة']
    ]
};
