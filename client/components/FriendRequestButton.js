// FriendRequestButton.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '@/styles/profile.module.css';

const FriendRequestButton = ({ currentUserId, profileUserId }) => {
    const [requestStatus, setRequestStatus] = useState('not_friends'); 
    
    useEffect(() => {
        checkFriendship();
        renderButtonContent(); 
    }, [currentUserId, profileUserId, requestStatus]);

    const checkFriendship = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${currentUserId}/friends/${profileUserId}`);
            if (response.data.status !== 'pending'){
                setRequestStatus(response.data.status);
                return; 
            }
            if (response.data.status==='pending'){
                let pending_direction; 
                const pending_request = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${currentUserId}/friends/requests`);
                for (let i = 0; i < pending_request.data.length; i++){
                    if (pending_request.data[i].id === profileUserId){
                        pending_direction = pending_request.data[i].requestDirection; 
                        break;
                    }
                }
                if (pending_direction === 'incoming'){
                    setRequestStatus('pending_incoming'); 
                    return;
                }
                else if (pending_direction === 'outgoing'){
                    setRequestStatus('pending_outgoing');
                }
            }
        } catch (error) {
            console.error('Error checking friendship status:', error);
        }
    };

    const sendFriendRequest = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${currentUserId}/friends`, {
                friendId: profileUserId
            });
            setRequestStatus('pending');
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const acceptFriendRequest = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${currentUserId}/friends`, {
                friendId: profileUserId
            });
            setRequestStatus('accepted');
        } catch (error) {
            console.error('Error accepting friend', error)
        }
    }
    
    const cancelFriendRequest = async () => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${currentUserId}/friends`, {
                data: { friendId: profileUserId }
            });
            setRequestStatus('not_friends');
        } catch (error) {
            console.error('Error cancelling friend request:', error);
        }
    };

    const handleFriendRequest = async () => {
        if (requestStatus === 'not_friends') {
            sendFriendRequest();
        } else if (requestStatus === 'accepted') {
            deleteFriend();
        }
        else if (requestStatus === 'pending_outgoing'){
            cancelFriendRequest();
        }
        else if (requestStatus === 'pending_incoming'){
            acceptFriendRequest(); 
        }
    };

    const deleteFriend = async () => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${currentUserId}/friends`, {
                data: { friendId: profileUserId }
            });
            setRequestStatus('not_friends');
        } catch (error) {
            console.error('Error deleting friend:', error);
        }
    };

    const renderButtonContent = () => {
        switch (requestStatus) {
            case 'not_friends':
                return 'Add Friend';
            case 'pending_outgoing':
                return 'Cancel Friend Request';
            case 'pending_incoming':
                return 'Accept Friend Request'; 
            case 'accepted':
                return 'Delete Friend';
            default:
                return 'Add Friend';
        }
    };

    const getButtonStyle = () => {
        let buttonClass = styles.addButton;
        if (requestStatus === 'accepted') {
            buttonClass = `${styles.deleteButton}`; 
        }
        return buttonClass;
    };

    return (
        <button className={getButtonStyle()} onClick={handleFriendRequest}>
            {renderButtonContent()}
        </button>
    );
};

export default FriendRequestButton;
