import React, {useState, useEffect} from 'react';
import { useDarkMode } from '@/utils/darkModeContext';
import { SearchOptions } from './SearchOptions';

export const UserSearchBar = ({ users, onSearchUpdate, changeSearchTopic, searchTopic }) => {
    const {isDarkMode} = useDarkMode();
    const [searchInput, setSearchInput] = useState('');
    const [sortedUsers, setSortedUsers] = useState([...users]);
    const [sortingBy, setSortingBy] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchBy, setSearchBy] = useState('both');


    useEffect(() => {
        onSearchUpdate(filteredUsers, searchInput);
    },[filteredUsers]);

    useEffect(() => {
        filterUsers();
    }, [searchInput, sortingBy, searchBy]);

    const filterUsers = () => {
        const searchLower = searchInput.toLowerCase();
        switch(searchBy){
            case 'username':
                setFilteredUsers([...sortedUsers.filter(user => 
                    user.username?.toLowerCase().includes(searchLower)
                )]);
                break;
            case 'email':
                setFilteredUsers([...sortedUsers.filter(user => 
                    user.email?.toLowerCase().includes(searchLower)
                )]);
                break;
            case 'both':
                setFilteredUsers([...sortedUsers.filter(user => 
                    user.username?.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower)
                )]);
            default:
                break;
        }
    };

    const changeSearchBy = (searchBy) => {
        setSearchBy(searchBy);
    }

    const onSortChange = (e, sortBy) =>{
        e.preventDefault();
        let newList = [...users];
        switch(sortBy){
            case 'alphabeticalOrder':
                newList = sortByAlphabet();
                break;
            default: 
                newList = [...users];
                break;   
        }
        setSortedUsers([...newList]);
    }

    const sortByAlphabet = () => {
        setSortingBy("Alphabetically");
        return [...users].sort((a,b) => a.username.localeCompare(b.username));
    }

    const onInputChange = (e) =>{
        e.preventDefault();
        setSearchInput(e.target.value);
    }
    
  return (
    <div className='container'>
        <div className='row d-flex align-items-center'>
            <div className="col-sm-6 col-md-4 col-lg-10 mb-2">
                <div className='d-flex mb-4'>
                    <form className="d-flex form-inline col-lg-4" onSubmit={((e) => e.preventDefault())}>
                        <input className="form-control mr-sm-2 me-2" type="search" placeholder="Search"  aria-label="Search" onInput={(e) => onInputChange(e)}/>
                    </form>
                </div>
            </div>
            <SearchOptions changeSearchTopic={changeSearchTopic} changeSearchBy={changeSearchBy} searchTopic={searchTopic} searchBy={searchBy} onSortChange={onSortChange} sortingBy={sortingBy}/>
        </div>
    </div>
    )
}