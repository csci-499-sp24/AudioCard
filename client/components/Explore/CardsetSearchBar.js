import React, {useState, useEffect} from 'react';
import { useDarkMode } from '@/utils/darkModeContext';
import { SearchOptions } from './SearchOptions';
import { SearchLimiters } from './SearchLimiters';

export const CardsetSearchBar = ({ cardsets, onSearchUpdate, changeSearchTopic, searchTopic }) => {
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
        var subjectFilter = [...sortedCardsets];
        if(sortedCardsets.length < 1){
        var subjectFilter = [...cardsets];
        }
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

    const changeSearchBy = (searchBy) => {
        setSearchBy(searchBy);
    }

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
            newList = [...cardsets];
                break;   
        }
        setSortedCardsets([...newList]);
    }

    const sortByFlashcards = () => {
        setSortingBy('Flashcard Count');
        return [...cardsets].sort((a,b) => b.flashcardCount - a.flashcardCount);
    }

    const sortByOldest = () => {
        setSortingBy('Oldest First');
        return [...cardsets].sort((a,b) => a.createdAt.localeCompare(b.createdAt));
    }

    const sortByNewest = () => {
        setSortingBy('Newest First');
        return [...cardsets].sort((a,b) => a.createdAt.localeCompare(b.createdAt)).reverse();
    }

    const sortByAlphabet = () => {
        setSortingBy("Alphabetically");
        return [...cardsets].sort((a,b) => a.title.localeCompare(b.title));
    }

  return (
    <div className='container'>
        <div className='row d-flex align-items-center'>
            <div className="col-sm-6 col-md-4 col-lg-10 mb-2">
                <div className='d-flex'>
                    <form className="d-flex form-inline col-lg-4" onSubmit={((e) => e.preventDefault())}>
                        <input className="form-control mr-sm-2 me-2" type="search" placeholder="Ex. French Revolution"  aria-label="Search" onInput={(e) => onInputChange(e)}/>
                    </form>
                    <div className="dropdown me-2 ">
                        <button className="btn flex-grow-1 dropdown-toggle" style={{ backgroundColor: isDarkMode ? '#222222' : 'white', color: isDarkMode? 'white': 'black' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
                    <SearchLimiters searchBy={searchBy} searchTopic={'card sets'} changeSearchBy={changeSearchBy}/>
                </div>
            </div>
            <SearchOptions changeSearchTopic={changeSearchTopic} searchTopic={searchTopic} onSortChange={onSortChange} sortingBy={sortingBy}/>
        </div>
    <style jsx>{`
    .custom-btn {
        padding: 0.5rem 1rem;
      }
    `}</style>
    </div>
    )
}