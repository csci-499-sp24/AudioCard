import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShareFunction = ({ userid, cardsetId }) => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [role, setRole] = useState('');
    const [curuserId, setcurUserId] = useState(null); // State to store the user ID
    const [error, setError] = useState(null); // State to handle errors
    
    useEffect(() => {
        if (curuserId !== null) {
            console.log("Sharing with user ID:", curuserId, "and role:", role);
            handleShareLogic(curuserId);
        }
    }, [curuserId]); // Run this effect whenever curuserId changes

    const handleShare = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/userCheck/${emailOrUsername}`);
            setcurUserId(response.data.userId);
            setError(null);
        } catch (error) {
            console.error('Error checking user:', error);
            setError(error.message);
        }
    };

    const handleShareLogic = async (userId) => {
        try {
            const shareresponse = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userid}/cardsets/${cardsetId}/shared/${cardsetId}/share?userid=${userId}&authority=${role}`);
            console.log('Sharing response:', shareresponse.data);
            setEmailOrUsername('');
            setRole('');
        } catch (error) {
            console.error('Error sharing card set:', error);
            setError(error.message);
        }
    };

    return (
        <div>
            <div>
                <h2>Share your cardset</h2>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>Email or Username: </label>
                <input type="text" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>Role: </label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Select Role</option>
                    <option value="read-only">Viewer</option>
                    <option value="edit">Editor</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button className='btn btn-secondary' onClick={() => handleShare()}>Share</button>
        </div>
    );
};

export default ShareFunction;
