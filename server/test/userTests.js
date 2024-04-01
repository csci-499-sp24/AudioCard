const axios = require('axios');

const getEmail = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        
        if (response.status === 200 && response.data.user) {
            return response.data.user.email;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('User not found');
        } else {
            console.error('Error fetching user by ID:', error);
        }
        throw error;
    }
}

module.exports = getEmail;
