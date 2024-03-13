import { useEffect, useState } from "react";
import axios from "axios";


const Explore = () => {
    const [cardsets, setCardsets] = useState([]);

    useEffect(() => {
        fetchCardsets();
    }, []);

    const fetchCardsets = async () => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_SERVER_URL + "/api/cardsets"
              );
              const cardsetsData = response.data.publicSets;
              setCardsets(cardsetsData);
        } catch (error) {
            console.error("Error fetching card sets:", error);
        }
    };

    return (
        <div>
            <h1>Explore Cardsets</h1>
            <ul>
                {cardsets.map((cardset) => (
                    <li key={cardset.id}>{cardset.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default Explore;