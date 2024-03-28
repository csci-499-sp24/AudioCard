import React, { useState } from 'react';
import styles from '../styles/notification.module.css';

const Notification = ({ userId }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    
    const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);

    // Sample notifications data
    const notifications = [
        // { id: 1, message: "New friend request from Alice" },
        // { id: 2, message: "Bob commented on your post" },

    ];

    return (
        <div>
            <i className={`bi bi-bell ${styles.bellIcon}`} onClick={toggleNotification}></i>
            {isNotificationOpen && (
                <div className={styles.notificationDropdown}>
                    {notifications.length > 0 ? (
                        <ul className={styles.notificationList}>
                            {notifications.map((notification) => (
                                <li key={notification.id} className={styles.notificationItem}>
                                    {notification.message}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className={styles.noNotifications}>There are no new notifications User ID: {userId}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;
