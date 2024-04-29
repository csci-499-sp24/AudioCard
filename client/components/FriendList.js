import {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '@/styles/profile.module.css';
import { useDarkMode } from '@/utils/darkModeContext';

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
                    friend.avatar = avatarResponse.data.url;
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

    if(friends.length != 0){
        return (
            <div className="mt-4 p-4">
                <h4 className="text-center mb-3">Friends</h4>
                <ul className="list-group" id={styles.friendListScrollable}>
                    {friends.map((friend) => (
                        <li 
                            key={friend.id} 
                            className="list-group-item d-flex justify-content-start lh-sm"
                            id={isDarkMode ? styles.darkFriendListItem : styles.friendListItem }
                            onClick={() => navigateToUserProfile(friend.id)}
                        >
                            <div className={styles.friendAvatar} >
                                <img src={friend.avatar} onError={setDefaultAvatar} alt={`${friend.username}'s avatar`}/>
                            </div>

                            <div>
                                <div>{friend.username}</div>
                                { friend.publicCardsets.length ? 
                                    <span id={isDarkMode ? styles.friendListItemSetsDark : styles.friendListItemSets }>
                                        {friend.publicCardsets.length} public card set{friend.publicCardsets.length > 1 ? "s" : ""}
                                    </span> 
                                    :
                                    <span id={isDarkMode ? styles.friendListItemSetsDark : styles.friendListItemSets }>
                                        No public card sets
                                    </span>
                                }
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    else {
        return null;
    }
}

export default FriendList;
