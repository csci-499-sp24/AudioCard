import { useEffect, useState } from "react";
import axios from "axios";


const Explore = () => {
    const [cardsets, setCardsets] = useState([]);
    const [searchInput, setSearchInput] = useState();
    const [filteredCardsets, setFilteredCardsets] = useState([]);

    useEffect(() => {
        fetchCardsets();
    }, []);

    const onSearchChange = (e) =>{
        e.preventDefault();
        setFilteredCardsets(cardsets.filter(cardset => cardset.title.toLowerCase().includes(e.target.value) || cardset.subject.toLowerCase().includes(e.target.value)))
        //setSearchInput(e.target.value);
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
            console.error("Error fetching card sets:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Explore Cardsets</h1>
            <div className='row'>
                <form class="form-inline" onSubmit={((e) => e.preventDefault())}>
                    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={(e) => onSearchChange(e)}/>
                </form>
            </div>

            <div className="row">
                {filteredCardsets.length > 0 ? filteredCardsets.map((cardset) => (
                    <div key={cardset.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{cardset.title}</h5>
                                <p className="card-subject">Subject: {cardset.subject}</p>
                                <p className="card-count">{cardset.flashcardCount} flashcard</p>
                                <p className="card-createdTime"><small className="text-muted">Created at: {new Date(cardset.createdAt).toLocaleDateString()}</small></p>
                            </div>
                        </div>
                    </div>
                )):
                cardsets.map((cardset) => (
                    <div key={cardset.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{cardset.title}</h5>
                                <p className="card-subject">Subject: {cardset.subject}</p>
                                <p className="card-count">{cardset.flashcardCount} flashcard</p>
                                <p className="card-createdTime"><small className="text-muted">Created at: {new Date(cardset.createdAt).toLocaleDateString()}</small></p>
                            </div>
                        </div>
                    </div>
                )) }
            </div>
            <style jsx>{`
                .card:hover {
                    transform: scale(1.03); 
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
                    transition: transform 0.3s ease, box-shadow 0.3s ease; 
                }
            `}</style>
        </div>
    );
}

export default Explore;