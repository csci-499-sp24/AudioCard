export const getLanguageCode = (language) => {
    let languageCode = ''; 
    switch (language) {
        case 'English (US)':
            languageCode = 'en-US';
            break;
        case 'English (UK)':
            languageCode = 'en-GB';
            break;
        case 'French':
            languageCode = 'fr-FR';
            break;
        case 'Spanish':
            languageCode = 'es-ES'; 
            break; 
        case 'Bengali':
            languageCode = 'bn-IN';
            break;
        case 'Chinese (Mandarin)':
            languageCode = 'cmn-CN';
            break;
        case 'Russian':
            languageCode = 'ru-RU';
            break; 
        case 'Hindi':
            languageCode = 'hi-IN';
            break; 
        case 'Arabic (Standard)':
            languageCode = 'ar-XA'; 
            break; 
        case 'Portuguese': 
            languageCode = 'pt-BR'; 
            break; 
    }

    return (languageCode); 
};

export const getLanguage = (languageCode) => {
    let language = '';
    switch (languageCode) {
        case 'en-US':
            language = 'English (US)';
            break; 
        case 'en-GB':
            language = 'English (UK)';
            break;
        case 'fr-FR':
            language = 'French'; 
            break; 
        case 'es-ES':
            language = 'Spanish';
            break;
        case 'bn-IN':
            language = 'Bengali';
            break; 
        case 'cmn-CN':
            language = 'Chinese (Mandarin)';
            break; 
        case 'ru-RU':
            language = 'Russian'; 
            break;
        case 'hi-IN': 
            language = 'Hindi'; 
            break;
        case 'ar-XA': 
            language = 'Arabic (Standard)'; 
            break; 
        case 'pt-BR':
            language = 'Portuguese'; 
            break; 
    }

    return language; 
}