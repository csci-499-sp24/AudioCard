import { useEffect, useState } from "react";
import axios from "axios";
import { CardsetView } from "@/components/DetailedCardsetView";
import { ExploreCard } from '@/components/Cards/ExploreCard';
import Navbar from '@/components/Navbar/Navbar';
import { auth } from "@/utils/firebase";
import {useDarkMode} from '../utils/darkModeContext';
import { CardsetSearchBar } from "@/components/Explore/CardsetSearchBar";
import { UserSearchBar } from "@/components/Explore/UserSearchBar";
import { UserCard } from "@/components/Cards/UserCard";
import BackToTopButton from "@/components/BackToTopButton";
import { AuthContext } from  "../utils/authcontext";
import React, { useContext } from 'react';
import styles from '@/styles/explore.module.css';

const Explore = () => {
    const { isDarkMode} = useDarkMode();
    const [cardsets, setCardsets] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedCardset, setSelectedCardset] = useState(null);
    const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchTopic, setSearchTopic] = useState('card sets');
    const [filteredCardsets, setFilteredCardsets] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const user = useContext(AuthContext).user;
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!userData) {
            fetchUserData();
        }
    }, [user, userData]);

    useEffect(() => {
        fetchCardsets();
        fetchUsers();
    }, []);

    const onSearchUpdate = (sortedList, input) => {
        if(searchTopic === 'card sets'){
            setFilteredCardsets(sortedList);
        }
        else if(searchTopic === 'users'){
            setFilteredUsers(sortedList);
        }
        setSearchInput(input);
    }

    const changeSearchTopic = (topic) => {
        setSearchTopic(topic);
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

    const fetchCardsets = async () => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_SERVER_URL + "/api/cardsets"
            );
            const cardsetsData = response.data.publicSets;
            for (let cardset of cardsetsData) {
                cardset.title = cardset.title.charAt(0).toUpperCase() + cardset.title.slice(1);
            }
            setCardsets(cardsetsData);
        } catch (error) {
            console.error("Error fetching public card sets:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_SERVER_URL + "/api/users"
            );
            const usersData = response.data;
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching all users: ", error);
        }
    };

    const handleCardsetClick = (cardset) => {
        setSelectedCardset(cardset);
        setIsDetailedViewOpen(true);
    };


    const handleCloseDetailedView = () => {
        setIsDetailedViewOpen(false);
    };

    return (
        <div className={isDarkMode ? 'wrapperDark' : 'wrapperLight'}>
            <Navbar userId={userData?.id}/>

            <div className="container mt-5">
                <h1 className="mb-4">Explore {searchTopic === 'card sets' ? "Card Sets" : "Users" }</h1>
                {searchTopic === 'card sets' ? 
                <CardsetSearchBar cardsets={cardsets} onSearchUpdate={onSearchUpdate} changeSearchTopic={changeSearchTopic} searchTopic={searchTopic}/>
                :
                <UserSearchBar users={users} onSearchUpdate={onSearchUpdate} changeSearchTopic={changeSearchTopic} searchTopic={searchTopic}/>

                }
                <div className="row">
                    {searchTopic === 'card sets' && 
                        (filteredCardsets.length > 0 || searchInput.length > 0 ? 
                            filteredCardsets.map((cardset) => (                
                                <ExploreCard key={cardset.id} cardset={cardset} onCreateCardset={handleCardsetClick} isDarkMode={isDarkMode}/>
                            ))
                            :
                            cardsets.map((cardset) => (
                                <ExploreCard key={cardset.id} cardset={cardset} onCreateCardset={handleCardsetClick} isDarkMode={isDarkMode}/>
                            ))
                        )
                    }
                    {searchTopic === 'users' && 
                        (filteredUsers.length > 0 || searchInput.length > 0 ? 
                            filteredUsers.map((userIndex) => (                
                                <UserCard key={userIndex.id} user={userIndex} isDarkMode={isDarkMode}/>
                                ))
                            :
                            users.map((userIndex) => (
                                <UserCard key={userIndex.id} user={userIndex} isDarkMode={isDarkMode}/>
                                ))
                        )
                    }
                </div>
                
                {isDetailedViewOpen && (
                    <div id={`${isDarkMode ? styles.modalDark : styles.modalLight}`}>
                        <div id={styles.detailedCardsetContent} className="detailedCardsetContent ">
                            <button id={styles.bntClose} style={{color: isDarkMode ? 'white' : 'black' }} onClick={handleCloseDetailedView}>
                                &times;
                            </button>
                            {selectedCardset && (
                                <CardsetView cardset={selectedCardset} isDarkMode={isDarkMode}
                                />
                            )}
                        </div>
                    </div>
                )}

                <BackToTopButton /> 

                {isDetailedViewOpen && <div id={`${isDarkMode ? styles.backdropDark : styles.backdropLight}`} ></div>}
            </div>
        </div>
    );
}

export default Explore;