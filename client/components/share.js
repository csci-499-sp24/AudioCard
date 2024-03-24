import React, { useState } from 'react';
import axios from 'axios';

const ShareFunction = ({ userid, cardsetId }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    const handleShare = async () => {
        // Implement logic to share the cardset with the entered email and selected role
        console.log("Sharing with email:", email, "and role:", role);
        // You can send this information to your backend to handle sharing functionality
        // Reset the form after sharing
        try {
            // Send a PUT request to update user access level
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userid}/cardsets/${cardsetId}/shared/${cardsetId}/share?userid=${email}&authority=${role}`);
            return response.data;
        } catch (error) {
            console.error('Error updating card set access:', error);
            throw error;
        }
        setEmail('');
        setRole('');
    };

    return (
        <div>
            <button onClick={() => handleShare()}>Share</button>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Role:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Select Role</option>
                    <option value="read-only">Viewer</option>
                    <option value="edit">Editor</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
        </div>
    );
};

export default ShareFunction;
