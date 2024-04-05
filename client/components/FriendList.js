import {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/profile.module.css';
import { useDarkMode } from '@/utils/darkModeContext';
import defaultAvatar from '@/public/userAvatar.jpg';

const FriendList = ({userId}) => {
    const [friends, setFriends] = useState([]);
    const router = useRouter();
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        if (userId) {
            fetchFriends();
        }
    }, [userId]);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/friends`);
            const friendsWithAvatars = await Promise.all(response.data.map(async (friend) => {
                try {
                    const avatarResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/userAvatar/avatar/${friend.username}`);
                    friend.avatarUrl = avatarResponse.data.url;
                } catch (error) {
                    console.error('Error fetching avatar:', error);
                }
                return friend;
            }));

            setFriends(friendsWithAvatars);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };
    const navigateToUserProfile = (friendId) => {
        router.push(`/profile/${friendId}`);
    };

    const setDefaultAvatar = (event) => {
        event.target.src = '/userAvatar.jpg';
    };
    
    return (
        <div className={styles.friendList}>
        <h2>Friends</h2>
        <ul className={styles.friendListUl}>
            {friends.map((friend) => (
                <li key={friend.id} className={isDarkMode ? styles.darkFriendListItem : styles.friendListItem } onClick={() => navigateToUserProfile(friend.id)}>
                    <div className={styles.friendAvatar}>
                        <img src={friend.avatarUrl} onError={setDefaultAvatar} alt={`${friend.username}'s avatar`} />
                    </div>
                    <span className={styles.friendName} style={{}}>{friend.username}</span>
                </li>
            ))}
        </ul>
    </div>
    );
}

export default FriendList;