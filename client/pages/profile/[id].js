import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar/Navbar';
import { auth } from '@/utils/firebase';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/profile.module.css';
import { CardProfile } from '@/components/Cards/CardProfile';
import FriendRequestButton from '@/components/FriendRequestButton';
import FriendList from '@/components/FriendList';
import { useDarkMode } from '../../utils/darkModeContext';

const Profile = () => {
    const router = useRouter();
    const { id } = router.query;
    const { isDarkMode } = useDarkMode();
    const [currentUser, setCurrentUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [publicCardsets, setPublicCardsets] = useState([]);
    const [friendCardsets, setFriendCardsets] = useState([]); 
    const [isFriends, setIsFriends] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                await fetchCurrentUserData(user.uid);
            } else {
                setCurrentUser(null);
            }
        });
    }, []);


    useEffect(() => {
        if (currentUser){
        if (currentUser.id == Number(profileUser.id)){
            setIsFriends(true);
            fetchFriendCardsets(currentUser.id);
        }}
    }, [id, currentUser, profileUser]
)

    useEffect(() => {
        if (id) {
            fetchUserProfile(id);
            fetchPublicCardsets(id);
            checkFriendship(id); 
        }
    }, [id]);

    const fetchCurrentUserData = async (firebaseId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/getuser`, {
                params: { firebaseId }
            });
            if (response.data && response.data.user) {
                setCurrentUser(response.data.user);
            }
        } catch (error) {
            console.error('Error fetching current user data:', error);
        }
    };

    const fetchUserProfile = async (profileUserId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${profileUserId}`);
            const profileData = response.data.user;
            setProfileUser(profileData);
        } catch (error) {
            console.error('Error fetching profile user data:', error);
        }
    };

    const checkFriendship = async (id) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${currentUser.id}/friends/${id}`);
            if (response.data.status=='accepted'){
                setIsFriends(true);
                fetchFriendCardsets(id);
            } 
        } catch (error) {
            console.error('Error checking friendship status:', error);
            setIsFriends(false);
        }
    };

    const fetchPublicCardsets = async (userId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/cardsets`);
            const cardsets = response.data.cardsets.filter(cardset => cardset.isPublic);
            setPublicCardsets(cardsets);
        } catch (error) {
            console.error('Error fetching public cardsets:', error);
        }
    };

    const fetchFriendCardsets = async (id) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}/friends-only`);
            const cardsets = response.data.cardsets
            setFriendCardsets(cardsets);

        } catch (error){
            console.error('Error fetching friends only cardsets:', error);
        }
    }

    const shouldShowFriendRequestButton = currentUser && profileUser && currentUser.id !== Number(profileUser.id);

    return (
        <div className={isDarkMode ? 'wrapperDark' : 'wrapperLight'}>
            <Navbar userId={currentUser?.id} />
            <div className="mt-4">
                <div className={styles.profileContainer}>
                    <div className={styles.profileSidebar}>
                    <h1 className={styles.cardSetTitle}>{`${profileUser?.username}`} </h1>
                        <div className={styles.userAvatar}>
                            <img src="/userAvatar.jpg" alt="User Avatar" className={styles.avatarImage} />
                        </div>
                        {shouldShowFriendRequestButton && (
                            <FriendRequestButton
                                currentUserId={currentUser.id}
                                profileUserId={profileUser.id}
                            />
                        )}
                        <div className={styles.friendList}>
                            <FriendList userId={profileUser?.id} />
                        </div>
                    </div>
                    <div className='cardsetsContainers'>
                    <div className='row'>
                    <div className="container">
                        <h1 className={styles.cardSetTitle}>Public Card Sets <span className="bi bi-globe"></span></h1>
                        <div className="row">
                            {publicCardsets.map(cardset => (
                                <CardProfile key={cardset.id} cardset={cardset} />
                            ))}
                        </div>
                    </div>
                    </div>
                    <div className='row'>
                    {isFriends && friendCardsets && friendCardsets.length > 0 ? (<div className="container">
                        <div className='row'>
                        <h1 className={styles.cardSetTitle}>Friends Only Card Sets <span className="bi bi-lock"></span></h1>
                        </div>
                        <div className="row">
                            {friendCardsets.map(cardset => (
                                cardset.id && <CardProfile key={cardset.id} cardset={cardset} />
                            ))}
                        </div>
                        </div>) : (null)}
                        </div>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
