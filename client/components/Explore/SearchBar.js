import React, {useState, useEffect} from 'react';

export const SearchBar = ({ cardsets, onSearchUpdate }) => {
    const [searchInput, setSearchInput] = useState('');
    const [sortingBy, setSortingBy] = useState('');
    const [filteredCardsets, setFilteredCardsets] = useState([]);

    useEffect(() => {
        onSearchUpdate(filteredCardsets);
    },[filteredCardsets])

    useEffect(() => {
        filterCardsets();
    }, [searchInput]);

    const onInputChange = (e) =>{
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

    const onSortChange = (e, sortBy) =>{
        e.preventDefault();
        let sortedCardsets;
        switch(sortBy){
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

  return (
    <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
        <div className='d-flex mb-5'>
            <form className="form-inline" onSubmit={((e) => e.preventDefault())}>
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onInput={(e) => onInputChange(e)}/>
            </form>
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {sortingBy.length > 0 ? sortingBy : "Sort By..."}
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" onClick={(e) => onSortChange(e, 'flashcardCount')}>Flashcard count</a></li>
                    <li><a className="dropdown-item" onClick={(e) => onSortChange(e, 'creationNewest')}>Newest first</a></li>
                    <li><a className="dropdown-item" onClick={(e) => onSortChange(e, 'creationOldest')}>Oldest first</a></li>
                    <li><a className="dropdown-item" onClick={(e) => onSortChange(e, 'alphabeticalOrder')}>Alphabetical order</a></li>
                </ul>
            </div>
        </div>
    </div>
    )
}