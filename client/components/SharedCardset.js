import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ShareCard } from '@/components/Cards/sharedCard';
import { useDarkMode } from '../utils/darkModeContext';
import styles from '../styles/dashboard.module.css';

const SharedCardset = ({ userid, sortBy, searchQuery, onSearchChange, subjectFilter, onSubjectFilterChange }) => {
    const [sharedData, setSharedData] = useState(null);
    const [error, setError] = useState(null);
    const { isDarkMode } = useDarkMode();
    const [cardsets, setCardsets] = useState([]); // State to store fetched cardsets
    const [selectedCardset, setSelectedCardset] = useState(null);
    const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false);
    const [loading, setLoading] = useState('');

    const handleCardsetClick = (cardset) => {
        setSelectedCardset(cardset);
        setIsDetailedViewOpen(true);
    };

    const handleCloseDetailedView = () => {
        setIsDetailedViewOpen(false);
    };

    useEffect(() => {
        const fetchSharedCardsets = async () => {
            try {
                setLoading("Loading...");
                // Send a GET request to fetch shared cardsets
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/shared/${userid}/cardsets/shared`);
                const cardsetIds = response.data.map(cardset => cardset.cardsetId); // Extracting cardset IDs
                setSharedData(cardsetIds);
                setLoading("");
            } catch (error) {
                console.error('Error fetching shared cardsets:', error);
                setError(error);
            }
        };

        fetchSharedCardsets();
    }, [userid]); // Run the effect whenever userid changes

    useEffect(() => {
        const fetchCardsets = async () => {
            if (sharedData) {
                const fetchedCardsets = await Promise.all(sharedData.map(async (cardsetId) => {
                    try {
                        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cardsets/${cardsetId}`);
                        return response.data;
                    } catch (error) {
                        console.error(`Error fetching cardset ${cardsetId}:`, error);
                        return null;
                    }
                }));
                let filteredCardsets = fetchedCardsets.filter(cardset => cardset !== null); // Filter out null values

                // Apply sorting based on the sortBy prop
                if (sortBy === 'alphabetical') {
                    filteredCardsets.sort((a, b) => a.title.localeCompare(b.title));
                } else if (sortBy === 'newest') {
                    filteredCardsets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                } else if (sortBy === 'oldest') {
                    filteredCardsets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                }

                setCardsets(filteredCardsets);
            }
        };

        fetchCardsets();
    }, [sharedData, sortBy]); // Run the effect whenever sharedData or sortBy changes

    const filteredSharedCardsets = cardsets.filter((cardset) =>
        cardset.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (subjectFilter === '' || cardset.subject === subjectFilter)
    );

    if (error) {
        // Render an error message if there's an error
        return <h1>Error: {error.message}</h1>;
    }

    if (!sharedData || cardsets.length === 0) {
        // Render a loading indicator while data is being fetched
        return <h3 className='text-center'>No shared card sets</h3>;
    }

    // Render the shared cardsets once they're available
    return (
        <div className="container">
            <div className="mb-3 d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Search card sets"
                    value={searchQuery}
                    onChange={onSearchChange}
                />
                <select className="form-select" value={subjectFilter} onChange={onSubjectFilterChange}>
                    <option value="">All Subjects</option>
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
            </div>
            <div className="row row row-cols-1 row-cols-md-3 g-4">
                {filteredSharedCardsets.map((cardset, index) => (
                    <Link
                        id={styles.dashboardCardLink}
                        href={`/cardsets/${cardset.id}`}
                        key={cardset.id}
                    >
                        <ShareCard key={cardset.id} cardset={cardset} onCreateCardset={handleCardsetClick} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SharedCardset;