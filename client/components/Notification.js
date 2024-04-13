import React, { useEffect, useState, useRef } from 'react';
import styles from '../styles/notification.module.css';
import axios from 'axios';
import { useDarkMode } from '@/utils/darkModeContext';

const Notification = ({ userId }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [friendRequests, setFriendRequests] = useState([])
    const { isDarkMode } = useDarkMode();

    const notificationRef = useRef(null);
    const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

    useEffect(() => {
        if (userId) {
            fetchFriendRequests();
        }
    }, [userId]);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    /*const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/friends/requests`);
            const incomingRequests = response.data.filter(request => request.requestDirection === 'incoming');
            setFriendRequests(incomingRequests);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };*/

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/notifications`);
            const incomingRequests = response.data.notifications;//.filter(request => request.requestDirection === 'incoming');
            setFriendRequests(incomingRequests);
        } catch (error) {
            console.error('Error fetching notifications:', error);
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

    const deleteCardsetNotification = async (notificationId) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/notifications`, {
                data: { notificationId: notificationId }
            });
            fetchFriendRequests();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const cardsetNotification = (request) =>{
        return(
            <li key={request.id} className={styles.notificationItem}>
                <span className={styles.notificationText}>{`You have been granted ${request.sharedCardsetItem.authority} access to cardset '${request.sharedCardsetItem.cardset.title}'`}</span>
                <div className={styles.buttonGroup}>
                <button onClick={() => deleteCardsetNotification(request.id)} className={styles.acceptButton}>
                        <i className="bi bi-check"></i>
                    </button>
                </div>
            </li>
        );
    }

    const friendNotification = (request) =>{
        return(
            <li key={request.id} className={styles.notificationItem}>
                <span className={styles.notificationText}>{`${request.friendItem.requestor.username} wants to be your friend`}</span>
                <div className={styles.buttonGroup}>
                    <button onClick={() => acceptFriendRequest(request.friendItem.requestor.id)} className={styles.acceptButton}>
                        <i className="bi bi-check"></i>
                    </button>
                    <button onClick={() => declineFriendRequest(request.friendItem.requestor.id)} className={styles.declineButton}>
                        <i className="bi bi-x"></i>
                    </button>
                </div>
            </li>
        );
    }

    return (
        <div style={{ padding: '5px' }}>
            <div className={styles.bellWrapper} onClick={toggleNotification}>
                <i className={`bi bi-bell ${styles.bellIcon}`}></i>
                {friendRequests.length > 0 && (
                    <span className={styles.notificationBadge}>{friendRequests.length}</span>
                )}
            </div>
            <div ref={notificationRef}>
                {isNotificationOpen && (
                    <div className={`${isDarkMode ? styles.notificationDropdownDark : styles.notificationDropdownLight}`}>
                        {friendRequests.length > 0 ? (
                            <ul className={styles.notificationList}>
                                {friendRequests.map((request) => (
                                    request.type === 'friend' ? 
                                    friendNotification(request)
                                    :
                                    cardsetNotification(request)
                                ))}
                            </ul>
                        ) : (
                            <div className={styles.noNotifications} style={{ color: isDarkMode ? 'white' : '#666' }}>No new notifications</div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Notification;
