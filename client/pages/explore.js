import { useEffect, useState } from "react";
import axios from "axios";
import { CardsetView } from "@/components/DetailedCardsetView";
import { ExploreCard } from '@/components/Cards/ExploreCard';
import Navbar from '@/components/Navbar/Navbar';
import { SearchBar } from "@/components/Explore/SearchBar";

const Explore = () => {
    const [cardsets, setCardsets] = useState([]);
    const [selectedCardset, setSelectedCardset] = useState(null);
    const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [sortingBy, setSortingBy] = useState('');
    const [filteredCardsets, setFilteredCardsets] = useState([]);

    useEffect(() => {
        fetchCardsets();
    }, []);

    const onSearchUpdate = (sortedSets) => {
        setFilteredCardsets(sortedSets);
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
            <Navbar/>
            <div className="container mt-5">
                <h1 className="mb-4">Explore Cardsets</h1>
                <SearchBar cardsets={cardsets} onSearchUpdate={onSearchUpdate}/>

            <div className="row">
                { filteredCardsets.length == 0 && searchInput.length > 0 && <div>No cardsets matching this term</div> }
                {filteredCardsets.length > 0 || searchInput.length > 0 ? filteredCardsets.map((cardset) => (                
                        <ExploreCard key={cardset.id} cardset={cardset} onCreateCardset={handleCardsetClick} />
                    )):
                    cardsets.map((cardset) => (
                        <ExploreCard key={cardset.id} cardset={cardset} onCreateCardset={handleCardsetClick} />
                    )) }
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