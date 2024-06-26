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
import Link from 'next/link';
import { AuthContext } from  "../../utils/authcontext";
import React, { useContext } from 'react';

const Profile = () => {
    const router = useRouter();
    const { id } = router.query;
    const { isDarkMode } = useDarkMode();
    const [currentUser, setCurrentUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [publicCardsets, setPublicCardsets] = useState([]);
    const [friendCardsets, setFriendCardsets] = useState([]);
    const [isUser, setIsUser] = useState(false);
    const [isFriends, setIsFriends] = useState(false);
    const [userAvatar, setUserAvatar] = useState('');
    const user = useContext(AuthContext).user;
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async () => {
            if (user) {
                await fetchCurrentUserData(user.uid);
            } else {
                setCurrentUser(null);
            }
        });
        return () => unsubscribe && unsubscribe();
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (id) {
                await fetchUserProfile(id);
                await fetchPublicCardsets(id);
            }
        };

        fetchInitialData();
    }, [id]);

    useEffect(() => {
        const fetchFriendData = async () => {
            if (currentUser && profileUser && currentUser.id && profileUser.id && !isUser){
                checkFriendship()
            }
        }
        fetchFriendData(); 
    },[currentUser, profileUser, isUser])

    //if user is viewing own profile, fetch cardsets
    useEffect(() => {
        if (currentUser && profileUser && currentUser.id && profileUser.id){ 
            if (currentUser.id == Number(profileUser.id)){
                setIsUser(true); 
                fetchFriendCardsets(currentUser.id);
            } else {
                setIsUser(false);
            }
        }
    }, [currentUser, profileUser]);

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
            await fetchUserAvatar(profileData.username);
        } catch (error) {
            console.error('Error fetching profile user data:', error);
        }
    };

    const checkFriendship = async () => {
        if (!isUser){
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${currentUser.id}/friends/${profileUser.id}`);
                if (response.data.status=='accepted'){
                    setIsFriends(true);
                    fetchFriendCardsets(id);
                } 
            } catch (error) {
                console.error('Error checking friendship status:', error);
                setIsFriends(false);
            }
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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}/cardsets`);
            const cardsets = response.data.cardsets.filter(cardset => cardset.isFriendsOnly);
            console.log(response.data);
            setFriendCardsets(cardsets);

        } catch (error){
            console.error('Error fetching friends only cardsets:', error);
            setFriendCardsets([]);
        }
    }

    const fetchUserAvatar = async (username) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/userAvatar/avatar/${username}`);
            setUserAvatar(response.data.url);
        } catch (error) {
            console.error('Error fetching avatar URL:', error);
        }
    };

    const setDefaultAvatar = (event) => {
        event.target.src = '/userAvatar.jpg';
    };

    const shouldShowFriendRequestButton = currentUser && profileUser && currentUser.id !== Number(profileUser.id);

    return (
        <div className={isDarkMode ? 'wrapperDark' : 'wrapperLight'}>
            <Navbar userId={currentUser?.id} />

            <div class="container min-vh-100 d-flex flex-column">
                <div class="row flex-grow-1 px-2 mb-5 mt-5">
                    <div class="col-md-5 col-lg-4 order-md-first mb-5">
                        <div id={`${isDarkMode ? styles.UserInfoColDark : styles.UserInfoCol}`}>
                            <div className="text-center m-4" id={`${isDarkMode ? styles.UserInfoContainerDark : styles.UserInfoContainer}`}>
                                <img src={userAvatar} onError={setDefaultAvatar} alt="User Avatar" className={styles.avatarImage} style={{Color: isDarkMode ? 'white' : 'black' }} />
                                <h4 className={styles.cardSetTitle}>{`${profileUser?.username}`}</h4>
                                <p id={`${isDarkMode ? styles.userEmailDark : styles.userEmail}`} >{`${profileUser?.email}`}</p>
                                {shouldShowFriendRequestButton && (
                                    <FriendRequestButton
                                        currentUserId={currentUser.id}
                                        profileUserId={profileUser.id}
                                    />
                                )}
                            </div>

                            <FriendList userId={profileUser?.id} />
                        </div>
                    </div>

                    <div class="col-md-7 col-lg-8 mb-5">
                        <div className="row flex-column mb-5 h-100" id={`${isDarkMode ? styles.CardsetsInfoColDark : styles.CardsetsInfoCol}`}>
                            {/* Public Card sets */}
                            <div className="text-center">
                                <h4 className="mt-4 mb-3" id={styles.cardSetTitle}>Public Card Sets <span className="bi bi-globe"></span></h4>
                                {
                                    publicCardsets && (
                                        <div className="row" id={styles.cardsetsContainerScrollable}>
                                            { publicCardsets.map(cardset => (
                                                <div className='col-lg-6 mb-4' key={cardset.id}>
                                                    <Link href={`/cardsets/${cardset.id}`} key={cardset.id} style={{ textDecoration: 'none', width: '100%' }}>
                                                        <CardProfile key={cardset.id} cardset={cardset} />
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                            </div>
                            
                            {/* Friends Only Card sets */}
                            {(isFriends || isUser) && ( 
                                <div className="text-center mb-2" id={styles.cardsetsContainerScrollable}>
                                    <h4 className="mt-4 mb-3" id={styles.cardSetTitle}>Friends Only Card Sets <span className="bi bi-lock"></span></h4>
                                    {
                                        friendCardsets && friendCardsets.length !== 0 ? 
                                            <div className="row">
                                                {friendCardsets
                                                    .filter(cardset => cardset.title != null)
                                                    .map(cardset => (
                                                        <div className='col-lg-6 mb-4' key={cardset.id}>
                                                            <Link href={`/cardsets/${cardset.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                                                                <CardProfile key={cardset.id} cardset={cardset} />
                                                            </Link>
                                                        </div>
                                                    ))}
                                            </div>
                                        : 
                                        <div className="row">
                                            <p>No card sets</p>
                                        </div>
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
