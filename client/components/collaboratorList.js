import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '@/utils/firebase';

export const CollaboratorList = ({ currentUserId, cardsetId, isOwner, isadmin }) => {
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
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/shared/${cardsetId}/${id}/authority`, { 
            data: {
                currentUserId: currentUserId
            }
            });
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
            <button className='btn btn-secondary mt-3 mb-2' onClick={toggleList}>
                <i className="bi bi-people-fill me-2"></i>Collaborators 
                <i style={{marginLeft: '2px'}}className={`${showList ? 'bi bi-caret-down-fill' : 'bi bi-caret-left-fill'}`}></i>
            </button>

            {showList && (
                <div>
                    <h2>Users with access:</h2>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : (

                        userEmailsWithAuth.length > 0 ? (
                            <ul>
                                {userEmailsWithAuth.map(({ email, authority, id }, index) => (
                                    <li className="mb-2"key={index}>
                                        <strong>{email}</strong> - {authority === 'edit' ? 'editor' : authority === 'read-only' ? 'viewer' : authority}
                                {isadmin && (
                                    <> 
                                        {authority != 'admin' || isOwner ?
                                            <button className="btn btn-danger" style={{marginLeft: '10px'}}onClick={() => deleteAccess(id)}>remove</button>
                                            : null} </> )} 
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