import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const CollaboratorList = ({ cardsetId, isOwner }) => {
    const [userEmailsWithAuth, setUserEmailsWithAuth] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showList, setShowList] = useState(false);

    useEffect(() => {
        if (showList) {
            fetchAccessUserEmailsWithAuth();
        }
    }, [showList]); // Run the effect whenever showList changes

    const fetchAccessUserEmailsWithAuth = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/shared/${cardsetId}/emails`);
            const userIds = response.data.userIds || [];
            const emailFetchPromises = userIds.map(async userId => {
                const userDataResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}`);
                const userauth = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/shared/${cardsetId}/${userId}/authority`);
                return { email: userDataResponse.data.user.email, authority: userauth.data.authority, id: userId };
            });
            const userEmailsWithAuth = await Promise.all(emailFetchPromises);
            setUserEmailsWithAuth(userEmailsWithAuth);
            setLoading(false);
        } catch (error) {
            setError('Error fetching access user emails');
            setLoading(false);
        }
    };

    const deleteAccess = async (id) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/shared/${cardsetId}/${id}/authority`);
            setUserEmailsWithAuth(prevUsers => prevUsers.filter(user => user.id !== id));
            return response
        } catch (error) {
            console.error('Error deleting access:', error);
            setError('Error deleting access');
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

                        userEmailsWithAuth.length > 0 ? (
                            <ul>
                                {userEmailsWithAuth.map(({ email, authority, id }, index) => (
                                    <li key={index}>
                                        {email} - {authority}

                                        {authority != 'admin' || isOwner ?
                                            <button onClick={() => deleteAccess(id)}>Delete</button>
                                            : null}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Not shared with anyone</p>
                        )

                    )}
                </div>
            )}
        </div>
    );
};