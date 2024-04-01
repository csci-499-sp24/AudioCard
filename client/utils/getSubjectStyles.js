export const getSubjectStyle = (subject, isDarkMode) => {
    let bgColor = '';
    let txtColor = '';

    if (isDarkMode) {
        // styles for dark mode
        switch (subject) {
            case 'History': 
                bgColor = '#ede176';
                txtColor = '#642020';
                break;
            case 'Math': 
                bgColor = '#c25b5b';
                txtColor = '#742d2d';
                break;
            case 'Science': 
                bgColor = '#377ec9';
                txtColor = '#053a74';
                break;
            case 'English': 
                bgColor = '#c999c6';
                txtColor = '#734470';
                break;
            case 'Programming': 
                bgColor = '#4ad7be';
                txtColor = '#2f6e5e';
                break;
            case 'Fine Arts': 
                bgColor = '#a39ade';
                txtColor = '#413882';
                break;
            case 'Foreign Languages': 
                bgColor = '#c8a160';
                txtColor = '#64430f';
                break;
            case 'Nature': 
                bgColor = '#dff7fb';
                txtColor = '#71b8c5';
                break;
            case 'Humanities': 
                bgColor = '#c86b42';
                txtColor = '#62280e';
                break;
            case 'Health': 
                bgColor = '#b4d194';
                txtColor = '#546f35';
                break;
            case 'Entertainment': 
                bgColor = '#c3da1d';
                txtColor = '#606c06';
                break;
            case 'Other': 
                bgColor = '#787878';
                txtColor = '#2d2a2a';
                break;
            default: 
                bgColor = '#787878';
                txtColor = '#2d2a2a';
        }

    }
    else {
        // styles for white mode
        switch (subject) {
            case 'History': 
                bgColor = '#faf5cb';
                txtColor = '#998f3e';
                break;
            case 'Math': 
                bgColor = '#fbd6d6';
                txtColor = '#b95757';
                break;
            case 'Science': 
                bgColor = '#d6e8fb';
                txtColor = '#4478b0';
                break;
            case 'English': 
                bgColor = '#f6e6f5';
                txtColor = '#b67fb3';
                break;
            case 'Programming': 
                bgColor = '#d8f7f0';
                txtColor = '#5fac98';
                break;
            case 'Fine Arts': 
                bgColor = '#eae8f7';
                txtColor = '#7065b8';
                break;
            case 'Foreign Languages': 
                bgColor = '#fff0d7';
                txtColor = '#c8a162';
                break;
            case 'Nature': 
                bgColor = '#dff7fb';
                txtColor = '#71b8c5';
                break;
            case 'Humanities': 
                bgColor = '#fddbcc';
                txtColor = '#d76c3c';
                break;
            case 'Health': 
                bgColor = '#e8f7d7';
                txtColor = '#85a95b';
                break;
            case 'Entertainment': 
                bgColor = '#f6ffb0';
                txtColor = '#9bae0b';
                break;
            case 'Other': 
                bgColor = '#f0f0f0';
                txtColor = '#9c9c9c';
                break;
            default: 
                bgColor = '#f0f0f0';
                txtColor = '#9c9c9c';
        }

    }

    return { bgColor, txtColor };
};
