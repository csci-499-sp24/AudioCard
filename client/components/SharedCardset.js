import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { ShareCard } from '@/components/Cards/sharedCard';
import { useDarkMode } from '../utils/darkModeContext';
import styles from '../styles/dashboard.module.css' ; 

const SharedCardset = ({ userid }) => {
    const [sharedData, setSharedData] = useState(null);
    const [error, setError] = useState(null);
    const { isDarkMode} = useDarkMode();
    const [cardsets, setCardsets] = useState([]); // State to store fetched cardsets
    const [selectedCardset, setSelectedCardset] = useState(null);
    const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false);


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
                // Send a GET request to fetch shared cardsets
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/shared/${userid}/cardsets/shared`);
                const cardsetIds = response.data.map(cardset => cardset.cardsetId); // Extracting cardset IDs
                setSharedData(cardsetIds);
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
                setCardsets(fetchedCardsets.filter(cardset => cardset !== null)); // Filter out null values
            }
        };

        fetchCardsets();
    }, [sharedData]); // Run the effect whenever sharedData changes

    if (error) {
        // Render an error message if there's an error
        return <h1>Error: {error.message}</h1>;
    }

    if (!sharedData || cardsets.length === 0) {
        // Render a loading indicator while data is being fetched
        return <h1>Loading...</h1>;
    }

    // Render the shared cardsets once they're available
    return (
        <div className="container">
            <div className="row row row-cols-1 row-cols-md-3 g-4">
                {cardsets.map((cardset, index) => (
                    <Link 
                    id={styles.dashboardCardLink}
                    href={`/cardsets/${cardset.id}`} key={cardset.id}>
                        <ShareCard key={cardset.id} cardset={cardset} onCreateCardset={handleCardsetClick} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SharedCardset;
