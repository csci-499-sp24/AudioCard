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
    }

    return language; 
}