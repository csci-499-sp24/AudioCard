import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../utils/firebase';
import axios from 'axios';
import Link from 'next/link';
import styles from '../styles/dashboard.module.css';
import { CreateCardset } from '@/components/CreateCardset';
import { CardsetView } from '@/components/CardsetView';
import { DashboardCard } from '@/components/Cards/DashboardCard';
import SharedCardset from '@/components/SharedCardset';
import Navbar from '@/components/Navbar/Navbar';
import { useDarkMode } from '../utils/darkModeContext';

const Dashboard = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [cardsets, setCardsets] = useState([]);
    const [selectedCardset, setSelectedCardset] = useState(null);
    const [activeTab, setActiveTab] = useState('YourFlashcardSets'); // State to track active tab

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        if (!userData) {
            fetchUserData();
        }
        return () => unsubscribe();
    }, [user, userData]);

    useEffect(() => {
        fetchCardsets();
    }, [userData]);

    const fetchCardsets = async () => {
        if (!userData || !userData.id) {
            fetchUserData();
            return;
        }
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userData.id}/cardsets`, { params: { userId: userData.id } });
            const cardsetsData = response.data.cardsets;
            setCardsets(cardsetsData);
        } catch (error) {
            console.error('Error fetching card sets:', error);
        }
    }

    const fetchUserData = async () => {
        if (!user || !user.uid) {
            return;
        }
        try {
            const firebaseId = user?.uid
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/api/users/getuser', { params: { firebaseId: firebaseId } });
            const userData = response.data.user;
            setUserData(userData);
        } catch (error) {
            console.error('Error fetching card sets:', error);
        }
    }

    const handleCreateCardset = () => {
        fetchCardsets();
    }

    const selectCardset = (cardset) => {
        setSelectedCardset(cardset);
    }

    const navigateTo = (path) => {
        setMenuOpen(false);
        router.push(path);
    };

    const [showCreateCardsetForm, setShowCreateCardsetForm] = useState(false);

    // Function to toggle the visibility of the CreateCardset form
    const toggleCreateCardsetForm = () => {
        setShowCreateCardsetForm(!showCreateCardsetForm);
    };

    return (
        <div className={isDarkMode ? 'wrapperDark' : 'wrapperLight'}>
            <Navbar userId={userData?.id} />
            <div className="container">
                <div className="row px-2">
                    <div className="col-12 mt-5" id={styles.greeting}>
                        <h1 className="" id={`${isDarkMode ? styles.welcomeDark : styles.welcome}`}>Welcome, <span className={`font-weight-bold ${isDarkMode ? 'text-light' : 'text-dark'}`}>{userData?.username}</span></h1>
                    </div>
                    <div className="col-12 my-3">
                        <div className="d-flex justify-start" id={styles.navigation}>
                            <ul class="nav">
                                <li class="nav-item">
                                    <a class="nav-link text-dark" id={`${activeTab === 'YourFlashcardSets' ? styles.inlineNavItemActive : styles.inlineNavItemNotActive}`} 
                                    aria-current="page" href="#" onClick={() => setActiveTab('YourFlashcardSets')}>Your Card Sets</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link text-dark"id={`${activeTab === 'SharedWithYou' ? styles.inlineNavItemActive : styles.inlineNavItemNotActive}`} 
                                    aria-current="page" href="#" onClick={() => setActiveTab('SharedWithYou')}>Shared Card Sets</a>
                                </li>
                            </ul>
                        </div>

                    </div>

                    {activeTab === 'YourFlashcardSets' && (
                        <div className="col-12 my-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="m-0" style={{color: isDarkMode ? 'white' : 'black'}}>Your Card Sets</h4>
                                <button className="btn btn-secondary" onClick={toggleCreateCardsetForm}>Shared Card Sets</button>
                            </div>
                            {showCreateCardsetForm && 
                             <CreateCardset userId={userData.id} onCreateCardset={handleCreateCardset} onClickToggle={toggleCreateCardsetForm} isDarkMode={isDarkMode} /> } 
                            {selectedCardset && <CardsetView cardset={selectedCardset} />}
                            <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
                                {cardsets.map((cardset, index) => (
                                    <Link
                                        id={styles.dashboardCardLink}
                                        href={{
                                            pathname: `/cardsets/${cardset.id}`,
                                            query: {
                                                cardsetTitle: cardset.title,
                                                cardsetSubject: cardset.subject,
                                                cardsetIsPublic: cardset.isPublic
                                            }
                                        }}
                                        key={index}
                                    >
                                        <DashboardCard key={index} cardset={cardset} onClick={() => selectCardset(cardset)} isDarkMode={isDarkMode} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'SharedWithYou' && (
                        <div className="col-12 my-3">
                            <h4>Shared With You</h4>
                            <SharedCardset userid={userData?.id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
