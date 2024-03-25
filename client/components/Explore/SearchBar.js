import React, {useState, useEffect} from 'react';
import { useDarkMode } from '@/utils/darkModeContext';
export const SearchBar = ({ cardsets, onSearchUpdate }) => {
    const {isDarkMode} = useDarkMode();
    const [searchInput, setSearchInput] = useState('');
    const [sortingBy, setSortingBy] = useState('');
    const [sortedCardsets, setSortedCardsets] = useState([...cardsets]);
    const [filteredCardsets, setFilteredCardsets] = useState([]);
    const [subject, setSubject] = useState('');
    const [searchBy, setSearchBy] = useState('title');

    useEffect(() => {
        onSearchUpdate(filteredCardsets, searchInput);
    },[filteredCardsets]);

    useEffect(() => {
        filterCardsets();
    }, [searchInput, subject, searchBy, sortingBy, sortedCardsets]);

    const onInputChange = (e) =>{
        e.preventDefault();
        setSearchInput(e.target.value);
    }

    const filterCardsets = () => {
        const searchLower = searchInput.toLowerCase();
        var subjectFilter = [...cardsets];
        if (subject != ''){
            subjectFilter = subjectFilter.filter(cardset => 
                cardset.subject.toLowerCase().includes(subject.toLowerCase()));
        }
        if(subjectFilter) {
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
                default:
                    break;
            }
        }
    };

    const onSortChange = (e, sortBy) =>{
        e.preventDefault();
        let newList = [...cardsets];
        switch(sortBy){
            case 'flashcardCount':
                newList = sortByFlashcards();
                break;
            case 'creationNewest':
                newList = sortByNewest();
                break;
            case 'creationOldest':
                newList = sortByOldest();
                break;
            case 'alphabeticalOrder':
                newList = sortByAlphabet();
                break;
            default: 
            newList = cardsets;
                break;   
        }
        setSortedCardsets([...newList]);
    }

    const sortByFlashcards = () => {
        setSortingBy('Flashcard Count');
        return cardsets.sort((a,b) => b.flashcardCount - a.flashcardCount);
    }

    const sortByOldest = () => {
        setSortingBy('Oldest First');
        return cardsets.sort((a,b) => a.createdAt.localeCompare(b.createdAt));
    }

    const sortByNewest = () => {
        setSortingBy('Newest First');
        return cardsets.sort((a,b) => a.createdAt.localeCompare(b.createdAt)).reverse();
    }

    const sortByAlphabet = () => {
        setSortingBy("Alphabetically");
        return cardsets.sort((a,b) => a.title.localeCompare(b.title));
    }

  return (
    <div className='container'>
    <div className='row d-flex align-items-center'>
    <div className="col-sm-6 col-md-4 col-lg-10 mb-2">
        <div className='d-flex mb-4'>
            <form className="d-flex form-inline col-lg-4" onSubmit={((e) => e.preventDefault())}>
                <input className="form-control mr-sm-2 me-2" type="search" placeholder="Search"  aria-label="Search" onInput={(e) => onInputChange(e)}/>
            </form>
            <div className="dropdown me-2 flex-grow-1">
                <button className="btn  flex-grow-1 dropdown-toggle col-4" style={{ backgroundColor: isDarkMode ? '#222222' : 'white', color: isDarkMode? 'white': 'black' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {subject ? subject: "Any Subject"}
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" onClick={(e) => setSubject('')}>Any Subject</a></li>
                    <li><a className="dropdown-item" onClick={(e) => setSubject('History')}>History</a></li>
                    <li><a className="dropdown-item" onClick={(e) => setSubject('Math')}>Math</a></li>
                    <li><a className="dropdown-item" onClick={(e) => setSubject('Science')}>Science</a></li>
                    <li><a className="dropdown-item" onClick={(e) => setSubject('English')}>English</a></li>
                    <li><a className="dropdown-item" onClick={(e) => setSubject('Programming')}>Programming</a></li>
                    <li><a className="dropdown-item" onClick={(e) => setSubject('Fine Arts')}>Fine Arts</a></li>
                    <li><a className="dropdown-item" onClick={(e) => setSubject('Foreign Languages')}>Foreign Languages</a></li>
                    <li><a className="dropdown-item" onClick={(e) => setSubject('Nature')}>Nature</a></li>
                    <li><a className="dropdown-item" onClick={(e) => setSubject('Humanities')}>Humanities</a></li>
                    <li><a className="dropdown-item" onClick={(e) => setSubject('Health')}>Health</a></li>
                    <li><a className="dropdown-item" onClick={(e) => setSubject('Other')}>Other</a></li>
                </ul>
            </div>
        </div>
        <div className='d-flex mb-4'>
            <div className='d-flex form-inline col-lg-4'>
                {searchBy ===  'title' ? <button type="button" className="btn btn-primary me-2" onClick={() => setSearchBy('title')}>Title</button>
                : <button type="button" className="btn btn-secondary me-2" onClick={() => setSearchBy('title')}>Title</button>}
                {searchBy ===  'creator' ? <button type="button" className="btn btn-primary me-2" onClick={() => setSearchBy('title')}>Creator</button>
                : <button type="button" className="btn btn-secondary me-2" onClick={() => setSearchBy('creator')}>Creator</button>}
            </div>
        </div>

    </div>
    <div className="col d-flex justify-content-end align-self-begin">
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
    <style jsx>{`
    .custom-btn {
        padding: 0.5rem 1rem;
      }
    `}</style>
    </div>
    )
}