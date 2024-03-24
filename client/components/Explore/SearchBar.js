import React, {useState, useEffect} from 'react';

export const SearchBar = ({ cardsets, onSearchUpdate }) => {
    const [searchInput, setSearchInput] = useState('');
    const [sortingBy, setSortingBy] = useState('');
    const [filteredCardsets, setFilteredCardsets] = useState([]);
    const [subject, setSubject] = useState('');
    const [searchBy, setSearchBy] = useState('title');

    useEffect(() => {
        onSearchUpdate(filteredCardsets);
    },[filteredCardsets]);

    useEffect(() => {
        filterCardsetsBySubject();
    }, [searchInput, subject, searchBy]);

    const onInputChange = (e) =>{
        e.preventDefault();
        setSearchInput(e.target.value);
    }

    const filterCardsetsBySubject = () => {
        const searchLower = searchInput.toLowerCase();
        var subjectFilter = cardsets;
        if (subject != ''){
            subjectFilter = cardsets.filter(cardset => 
                cardset.subject.toLowerCase().includes(subject.toLowerCase()));
        }
        switch(searchBy){
            case 'title':
                setFilteredCardsets([...subjectFilter.filter(cardset => 
                    cardset.title.toLowerCase().includes(searchLower)
                )]);
                break;
            case 'creator':
                setFilteredCardsets([...subjectFilter.filter(cardset => 
                    cardset.user?.username.toLowerCase().includes(searchLower)
                )]);
                break;
            case 'date':
                setFilteredCardsets([...subjectFilter.filter(cardset => 
                    new Date(cardset.createdAt).toLocaleDateString().includes(searchLower)
                )]);
                break;
            default:
                break;
        }
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
        filterCardsetsBySubject();
    }

    const onSearchTypeChange = (e, sortBy) =>{
        e.preventDefault();
        let sortedCardsets;
        switch(sortBy){
            case 'title':
                break;
            case 'creationOldest':
                break;
            case 'alphabeticalOrder':
                break;
            default: 
                break;   
        }
        setCardsets([...sortedCardsets]);
        filterCardsetsBySubject();
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

    const limitSearch = (subjectFilter) => {
        const searchLower = searchInput.toLowerCase();
        switch(searchBy){
            case 'title':
                setFilteredCardsets([... cardsets.filter(cardset => 
                    cardset.title.toLowerCase().includes(searchLower)
                )]);
                break;
            case 'creator':
                setFilteredCardsets([...cardsets.filter(cardset => 
                    cardset.user?.username.toLowerCase().includes(searchLower)
                )]);
                break;
            case 'date':
                break;
            default:
                break;
        }
    }

  return (
    <div className="col-sm-6 col-md-4 col-lg-10 mb-4">
        <div className='d-flex mb-4'>
            <form className="d-flex form-inline" onSubmit={((e) => e.preventDefault())}>
                <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onInput={(e) => onInputChange(e)}/>
                <select class="form-select" id="subject" onChange={(e) => setSubject(e.target.value)}>
                    <option selected hidden>Subject</option>
                    <option value="">Any Subject</option>
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
        <div className='d-flex mb-5'>
            Search By:
            {searchBy ===  'title' ? <button type="button" class="btn btn-primary" onClick={() => setSearchBy('title')}>Title</button>
            : <button type="button" class="btn btn-secondary" onClick={() => setSearchBy('title')}>Title</button>}
            {searchBy ===  'creator' ? <button type="button" class="btn btn-primary" onClick={() => setSearchBy('title')}>Creator</button>
            : <button type="button" class="btn btn-secondary" onClick={() => setSearchBy('creator')}>Creator</button>}
            {searchBy ===  'date' ? <button type="button" class="btn btn-primary" onClick={() => setSearchBy('title')}>Date</button>
            : <button type="button" class="btn btn-secondary" onClick={() => setSearchBy('date')}>Date</button>}




        </div>

    </div>
    )
}