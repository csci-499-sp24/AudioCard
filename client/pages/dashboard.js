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
import BackToTopButton from '@/components/BackToTopButton';
import { AuthContext } from  "../utils/authcontext";
import React, { useContext } from 'react';

const Dashboard = () => {
    const { isDarkMode } = useDarkMode();
    const [userData, setUserData] = useState(null);
    const [cardsets, setCardsets] = useState([]);
    const [selectedCardset, setSelectedCardset] = useState(null);
    const [activeTab, setActiveTab] = useState('YourFlashcardSets');
    const [sortBy, setSortBy] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const user = useContext(AuthContext).user;
    const router = useRouter();

 

    useEffect(() => {
        fetchCardsets();
    }, [userData, sortBy]);

    const fetchCardsets = async () => {
        if (!userData || !userData.id) {
            fetchUserData();
            return;
        }
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userData.id}/cardsets`, { params: { userId: userData.id } });
            let cardsetsData = response.data.cardsets;

            if (sortBy === 'alphabetical') {
                cardsetsData.sort((a, b) => a.title.localeCompare(b.title));
            } else if (sortBy === 'newest') {
                cardsetsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sortBy === 'oldest') {
                cardsetsData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            }

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
            const firebaseId = user?.uid;
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

    const toggleCreateCardsetForm = () => {
        setShowCreateCardsetForm(!showCreateCardsetForm);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSubjectFilterChange = (event) => {
        setSubjectFilter(event.target.value);
    };

    const filteredCardsets = cardsets.filter((cardset) =>
        cardset.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (subjectFilter === '' || cardset.subject === subjectFilter)
    );

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
                            <ul className="nav">
                                <li className="nav-item">
                                    <a className={isDarkMode ? "nav-link text-white" : "nav-link text-dark"}
                                        id={`${activeTab === 'YourFlashcardSets' ? styles.inlineNavItemActive : styles.inlineNavItemNotActive}`}
                                        aria-current="page" href="#" onClick={() => setActiveTab('YourFlashcardSets')}>Your Card Sets</a>
                                </li>
                                <li className="nav-item">
                                    <a className={isDarkMode ? "nav-link text-white" : "nav-link text-dark"}
                                        id={`${activeTab === 'SharedWithYou' ? styles.inlineNavItemActive : styles.inlineNavItemNotActive}`}
                                        aria-current="page" href="#" onClick={() => setActiveTab('SharedWithYou')}>Shared Card Sets</a>
                                </li>
                                <li>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {activeTab === 'YourFlashcardSets' && (
                                <div className='d-flex justify-content-end'>
                                    <button className="btn btn-secondary" onClick={toggleCreateCardsetForm}><i className="bi bi-plus" style={{color: 'lightgreen'}}></i> New Set</button>
                                </div>
                            )}

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="m-0" style={{ color: isDarkMode ? 'white' : 'black' }}>{activeTab === 'YourFlashcardSets' ? 'Your Card Sets' : 'Shared With You'}</h4>
                        </div>
                        {activeTab === 'YourFlashcardSets' && (
                            <>
                                {showCreateCardsetForm &&
                                    <CreateCardset userId={userData.id} onCreateCardset={handleCreateCardset} onClickToggle={toggleCreateCardsetForm} isDarkMode={isDarkMode} />}
                                <div className="row d-flex">
                                    <div className='col-6'>
                                    <input
                                        type="text"
                                        className="form-control me-2" // Set the width to col-6 (half the width)
                                        placeholder="Search card sets"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                    </div>
                                    <div className='col-md-3'>
                                    <select className="form-select" style={{backgroundColor: isDarkMode ? 'black' : 'white', color: isDarkMode? 'white': 'black'}} value={subjectFilter} onChange={handleSubjectFilterChange}>
                                        <option value="">All Subjects</option>
                                        <option value="History">History</option>
                                        <option value="Math">Math</option>
                                        <option value="Science">Science</option>
                                        <option value="English">English</option>
                                        <option value="Programming">Programming</option>
                                        <option value="Fine Arts">Fine Arts</option>
                                        <option value="Foreign Languages">Foreign Languages</option>
                                        <option value="Nature">Nature</option>
                                        <option value="Humanities">Humanities</option>
                                        <option value="Health">Health</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    </div>
                                    <div className='col-md-3 d-flex justify-content-end'>
                                <select className="form-select me-2" value={sortBy} onChange={handleSortChange} style={{ width: '150px', backgroundColor: 'transparent', color: isDarkMode? 'white': 'black'}}>
                                    <option value="">Sort by</option>
                                    <option value="alphabetical">Alphabetical</option>
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                                    </div>
                                </div>

                                {selectedCardset && <CardsetView cardset={selectedCardset} />}
                                <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
                                    {filteredCardsets.map((cardset, index) => (
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
                            </>
                        )}
                        {activeTab === 'SharedWithYou' && (
                            <SharedCardset
                                userid={userData?.id}
                                searchQuery={searchQuery}
                                onSearchChange={handleSearchChange}
                                subjectFilter={subjectFilter}
                                onSubjectFilterChange={handleSubjectFilterChange}
                            />
                        )}
                    </div>
                    <BackToTopButton />
                </div>
            </div>
    );
};

export default Dashboard;