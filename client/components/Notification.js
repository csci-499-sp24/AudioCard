import React, { useEffect, useState, useRef } from 'react';
import styles from '../styles/notification.module.css';
import axios from 'axios';
import { useDarkMode } from '@/utils/darkModeContext';

const Notification = ({ userId }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [openShareModal, setOpenShareModal] = useState(false);
    const { isDarkMode } = useDarkMode();

    const notificationRef = useRef(null);
    const toggleNotification = () => {
        fetchNotifications();
        setIsNotificationOpen(!isNotificationOpen);
    }

    useEffect(() => {
        if (userId) {
            fetchNotifications();
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

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/notifications`);
            const incomingNotifications = response.data;
            setNotifications(incomingNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const acceptFriendRequest = async (friendId) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/friends/accept`, {
                friendId: friendId
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        } finally {
            fetchNotifications();
        }
    };

    const declineFriendRequest = async (friendId) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/friends`, {
                data: { friendId: friendId }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error declining friend request:', error);
        }
    };

    const deleteFriendNotification = async (notificationId) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/notifications/friendNotifications/${notificationId}`);
            fetchNotifications();
        } catch (error) {
            console.error('Error declining friend request:', error);
        }
    };

    const deleteCardsetNotification = async (notification) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/notifications/cardsetNotifications/${notification.id}`);
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const acceptCardsetRequest = async (notification) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/cardsets/${notification.cardset.id}/shared/${notification.cardset.id}/share?userid=${notification.sender.id}&authority=${notification.authority}`);
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const cardsetNotification = (notification) =>{
        return(
            <li key={notification.id} className={styles.notificationItem}>
                {
                notification.type === 'revoke' ? 
                <div className={styles.notificationContainer}>
                    <span className={styles.notificationText}>{`Your access to card set '${notification.cardset.title}' has been revoked`}</span>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => deleteCardsetNotification(notification)} className={styles.acceptButton}>
                            <i className="bi bi-check"></i>
                        </button>
                    </div>
                </div>
                : notification.type === 'requestDenied' ? 
                <div className={styles.notificationContainer}>
                    <span className={styles.notificationText}>{`Your request for access to card set '${notification.cardset.title}' has been denied`}</span>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => deleteCardsetNotification(notification)} className={styles.declineButton}>
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                </div>
                : notification.type === 'request' ? 
                <div className={styles.notificationContainer}>
                    <span className={styles.notificationText}>{`User ${notification.sender.username} has requested ${notification.authority} access to card set '${notification.cardset.title}'`}</span>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => acceptCardsetRequest(notification)} className={styles.acceptButton}>
                            <i className="bi bi-check"></i>
                        </button>
                        <button onClick={() => deleteCardsetNotification(notification)} className={styles.declineButton}>
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                </div>
                : notification.type === 'grant' &&
                <div className={styles.notificationContainer}>
                    <span className={styles.notificationText}>{`You have been granted ${notification.authority} access to card set '${notification.cardset.title}'`}</span>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => deleteCardsetNotification(notification)} className={styles.acceptButton}>
                            <i className="bi bi-check"></i>
                        </button>
                    </div>
                </div>

                }
            </li>
        );
    }

    const friendNotification = (notification) =>{
        return(
            <li key={notification.id} className={styles.notificationItem}>
                {
                notification.type === 'pending' ?     
                <div className={styles.notificationContainer}>
                    <span className={styles.notificationText}>{`${notification.sender.username} wants to be your friend`}</span>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => acceptFriendRequest(notification.sender.id)} className={styles.acceptButton}>
                            <i className="bi bi-check"></i>
                        </button>
                        <button onClick={() => declineFriendRequest(notification.sender.id)} className={styles.declineButton}>
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                </div>
                : notification.type === 'confirmed' ?
                <div className={styles.notificationContainer}>
                    <span className={styles.notificationText}>{`${notification.sender.username} has accepted your friend request`}</span>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => deleteFriendNotification(notification.id)} className={styles.acceptButton}>
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                </div>
                : notification.type === 'denied' ?
                <div className={styles.notificationContainer}>
                    <span className={styles.notificationText}>{`${notification.sender.username} has declined your friend request`}</span>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => deleteFriendNotification(notification.id)} className={styles.acceptButton}>
                            <i className="bi bi-x"></i>
                        </button>

                    </div>
                </div>
                : notification.type === 'unfriended' &&
                <div className={styles.notificationContainer}>
                    <span className={styles.notificationText}>{`${notification.sender.username} has unfriended you`}</span>
                    <div className={styles.buttonGroup}>
                        <button onClick={() => deleteFriendNotification(notification.id)} className={styles.acceptButton}>
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                </div>
                }
            </li>
        );
    }

    return (
        <div style={{ padding: '5px' }}>
            <div className={styles.bellWrapper} onClick={toggleNotification}>
                <i className={`bi bi-bell ${styles.bellIcon}`}></i>
                {notifications.length > 0 && (
                    <span className={styles.notificationBadge}>{notifications.length}</span>
                )}
            </div>
            <div ref={notificationRef}>
                {isNotificationOpen && (
                    <div className={`${isDarkMode ? styles.notificationDropdownDark : styles.notificationDropdownLight}`}>
                        {notifications.length > 0 ? (
                            <ul className={styles.notificationList}>
                                {notifications.map((notification) => (
                                    !notification.hasOwnProperty('authority') ? //Only cardset notifications have authority data field
                                    friendNotification(notification) :
                                    cardsetNotification(notification)
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
