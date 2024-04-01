import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const CollaboratorList = ({ cardsetId }) => {
    const [userEmails, setUserEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showList, setShowList] = useState(false);

    useEffect(() => {
        if (showList) {
            fetchAccessUserEmails();
        }
    }, [showList]); // Run the effect whenever showList changes

    const fetchAccessUserEmails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/shared/${cardsetId}/emails`);
            const userIds = response.data.userIds || [];
            const emailFetchPromises = userIds.map(async userId => {
                const userDataResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}`);
                return userDataResponse.data.user.email;
            });
            const userEmails = await Promise.all(emailFetchPromises);
            setUserEmails(userEmails);
            setLoading(false);
        } catch (error) {
            setError('Error fetching access user emails');
            setLoading(false);
        }
    };

    const toggleList = () => {
        setShowList(!showList);
    };

    return (
        <div>
            <button onClick={toggleList}>Show Collaborator List</button>
            {showList && (
                <div>
                    <h2>Emails of users with access:</h2>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : (
                        <ul>
                            {userEmails.map((email, index) => (
                                <li key={index}>{email}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
