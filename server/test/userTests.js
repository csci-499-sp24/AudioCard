const axios = require('axios');

const getEmail = async (userId) => {
    try {
        const response = await axios.get(`https://audiocard-server.onrender.com/api/users/${userId}`);
        
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


const checkIfUsernameExists = async (username) => {
    try {
        const response = await axios.get(`https://audiocard-server.onrender.com/api/users/usernameCheck?username=${username}`);
        return response.data.exists;
    } catch (error) {
        console.error('Error checking username exists', error);
        throw error;
    }
}


module.exports = { getEmail, checkIfUsernameExists} ;
