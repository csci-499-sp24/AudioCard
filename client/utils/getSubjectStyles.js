export const getSubjectStyle = (subject) => {
    let bgColor = '';
    let txtColor = '';

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
        case 'Other': 
            bgColor = '#f0f0f0';
            txtColor = '#9c9c9c';
            break;
        default: 
            bgColor = '#f0f0f0';
            txtColor = '#9c9c9c';
    }

    return { bgColor, txtColor };
};
