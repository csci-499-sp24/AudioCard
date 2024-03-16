import { useEffect, useState } from "react";
import axios from "axios";

const Explore = () => {
    const [cardsets, setCardsets] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [sortingBy, setSortingBy] = useState('');
    const [filteredCardsets, setFilteredCardsets] = useState([]);

    useEffect(() => {
        fetchCardsets();
    }, []);

    useEffect(() => {
        filterCardsets();
    }, [searchInput]);

    const onSearchChange = (e) =>{
        e.preventDefault();
        setSearchInput(e.target.value);
    }

    const filterCardsets = () => {
        setFilteredCardsets([...cardsets.filter(cardset => 
            cardset.title.toLowerCase().includes(searchInput.toLowerCase()) || cardset.subject.toLowerCase().includes(searchInput.toLowerCase()))]);
    }

    const onSortChangeClicked = (e, sortBy) =>{
        e.preventDefault();
        let sortedCardsets;
        switch(sortBy){
            case 'flashcardCount':
                sortedCardsets = sortByFlashcards();
                break;
            case 'creationNewest':
                sortedCardsets = sortByCreation();
                break;
            case 'creationOldest':
                sortedCardsets = sortByCreation();
                sortedCardsets.reverse();
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
        return cardsets.sort((a,b) => b.flashcardCount - a.flashcardCount);
    }

    const sortByCreation = () => {
        setSortingBy('Creation Date');
        return cardsets.sort((a,b) => a.createdAt.localeCompare(b.createdAt));
    }

    const sortByAlphabet = () => {
        setSortingBy("Alphabetically");
        return cardsets.sort((a,b) => a.title.localeCompare(b.title));
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
            <div className='d-flex mt-4'>
                <form className="form-inline" onSubmit={((e) => e.preventDefault())}>
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onInput={(e) => onSearchChange(e)}/>
                </form>
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {sortingBy.length > 0 ? sortingBy : "Filter By..."}
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