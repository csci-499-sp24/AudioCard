import { useEffect, useState } from "react";
import axios from "axios";
import { CardsetView } from "@/components/DetailedCardsetView";
import { ExploreCard } from '@/components/Cards/ExploreCard';
import Navbar from '@/components/Navbar/Navbar';
import { auth } from "@/utils/firebase";

const Explore = () => {
    const [cardsets, setCardsets] = useState([]);
    const [selectedCardset, setSelectedCardset] = useState(null);
    const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [sortingBy, setSortingBy] = useState('');
    const [filteredCardsets, setFilteredCardsets] = useState([]);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

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
    }, []);

    useEffect(() => {
        filterCardsets();
    }, [searchInput]);

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


    const onSearchChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    }

    const filterCardsets = () => {
        const searchLower = searchInput.toLowerCase();
        setFilteredCardsets([...cardsets.filter(cardset =>
            cardset.title.toLowerCase().includes(searchLower) ||
            cardset.subject.toLowerCase().includes(searchLower) ||
            (cardset.user?.username && cardset.user.username.toLowerCase().includes(searchLower))
        )]);
    };


    const onSortChangeClicked = (e, sortBy) => {
        e.preventDefault();
        let sortedCardsets;
        switch (sortBy) {
            case 'flashcardCount':
                sortedCardsets = sortByFlashcards();
                break;
            case 'creationNewest':
                sortedCardsets = sortByCreation();
                sortedCardsets.reverse();
                break;
            case 'creationOldest':
                sortedCardsets = sortByCreation();
                break;
            case 'alphabeticalOrder':
                sortedCardsets = sortByAlphabet();
                break;
            default:
                sortedCardsets = cardsets;
                break;
        }
        setCardsets([...sortedCardsets]);
        filterCardsets();

    }

    const sortByFlashcards = () => {
        setSortingBy('Flashcard Count');
        return cardsets.sort((a, b) => b.flashcardCount - a.flashcardCount);
    }

    const sortByCreation = () => {
        setSortingBy('Creation Date');
        return cardsets.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }

    const sortByAlphabet = () => {
        setSortingBy("Alphabetically");
        return cardsets.sort((a, b) => a.title.localeCompare(b.title));
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

    const handleCardsetClick = (cardset) => {
        setSelectedCardset(cardset);
        setIsDetailedViewOpen(true);
    };

    const handleCloseDetailedView = () => {
        setIsDetailedViewOpen(false);
    };

    return (
        <div className="wrapper">
            <Navbar userId={userData?.id} />
            <div className="container mt-5">
                <h1 className="mb-4">Explore Cardsets</h1>
                <div className='d-flex mb-5'>
                    <form className="form-inline" onSubmit={((e) => e.preventDefault())}>
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onInput={(e) => onSearchChange(e)} />
                    </form>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {sortingBy.length > 0 ? sortingBy : "Sort By..."}
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" onClick={(e) => onSortChangeClicked(e, 'flashcardCount')}>Flashcard count</a></li>
                            <li><a className="dropdown-item" onClick={(e) => onSortChangeClicked(e, 'creationNewest')}>Newest first</a></li>
                            <li><a className="dropdown-item" onClick={(e) => onSortChangeClicked(e, 'creationOldest')}>Oldest first</a></li>
                            <li><a className="dropdown-item" onClick={(e) => onSortChangeClicked(e, 'alphabeticalOrder')}>Alphabetical order</a></li>
                        </ul>
                    </div>
                </div>

                <div className="row">
                    {filteredCardsets.length == 0 && searchInput.length > 0 && <div>No cardsets matching this term</div>}
                    {filteredCardsets.length > 0 || searchInput.length > 0 ? filteredCardsets.map((cardset) => (
                        <ExploreCard key={cardset.id} cardset={cardset} onCreateCardset={handleCardsetClick} />
                    )) :
                        cardsets.map((cardset) => (
                            <ExploreCard key={cardset.id} cardset={cardset} onCreateCardset={handleCardsetClick} />
                        ))}
                </div>

                {isDetailedViewOpen && (
                    <div className="detailed-cardset-view">
                        <div className="detailed-cardset-content">
                            <button className="close-btn" onClick={handleCloseDetailedView}>
                                &times;
                            </button>
                            {selectedCardset && (
                                <CardsetView cardset={selectedCardset}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                    .container {
                    margin-right: ${isDetailedViewOpen ? "50%" : "auto"};
                    transition: margin-right 0.3s ease;
                  }
                .card:hover {
                        transform: scale(1.03); 
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
                        transition: transform 0.3s ease, box-shadow 0.3s ease; 
                    }
                .detailed-cardset-view {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 50%; /* Adjust as needed */
                    height: 100%;
                    background-color: #ADD8E6;
                    z-index: 999;
                    overflow-y: auto;
                    transition: transform 0.3s ease;
                    transform: translateX(${isDetailedViewOpen ? "0" : "100%"});
                  }
                  .detailed-cardset-content {
                    padding: 20px;
                  }
                  .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    font-size: 24px;
                    cursor: pointer;
                    background: none;
                    border: none;
                  }
                `}</style>
        </div>
    );
}

export default Explore;