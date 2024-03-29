import React, { useEffect, useState } from 'react';
import styles from '../styles/notification.module.css';
import axios from 'axios';

const Notification = ({ userId }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [friendRequests, setFriendRequests] = useState([])

    useEffect(() => {
        fetchFriendRequests();
    }, [userId]);

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/friends/requests`);
            setFriendRequests(response.data);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const acceptFriendRequest = async (friendId) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/friends`, {
                friendId: friendId
            });
            fetchFriendRequests();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const declineFriendRequest = async (friendId) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/friends`, {
                data: { friendId: friendId }
            });
            fetchFriendRequests();
        } catch (error) {
            console.error('Error declining friend request:', error);
        }
    };

    const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

    return (
        <div>
            <i className={`bi bi-bell ${styles.bellIcon}`} onClick={toggleNotification}></i>
            {isNotificationOpen && (
                <div className={styles.notificationDropdown}>
                    {friendRequests.length > 0 ? (
                        <ul className={styles.notificationList}>
                            {friendRequests.map((request) => (
                                <li key={request.id} className={styles.notificationItem}>
                                    <span className={styles.notificationText}>{`${request.username} wants to be your friend`}</span>
                                    <div className={styles.buttonGroup}>
                                        <button onClick={() => acceptFriendRequest(request.id)} className={styles.acceptButton}>
                                            <i className="bi bi-check"></i>
                                        </button>
                                        <button onClick={() => declineFriendRequest(request.id)} className={styles.declineButton}>
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className={styles.noNotifications}>No new notifications. User ID: {userId}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;
