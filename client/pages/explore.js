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
              for (let cardset of cardsetsData) {
                cardset.title = cardset.title.charAt(0).toUpperCase() + cardset.title.slice(1);
              }
              setCardsets(cardsetsWithUsernames);
        } catch (error) {
            console.error("Error fetching card sets:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Explore Cardsets</h1>
            <div className="row">
                {cardsets.map((cardset) => (
                    <div key={cardset.id} className="col-sm-6 col-md-4 col-lg-3 mb-4    ">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">{cardset.title}</h5>
                                <p>Subject: {cardset.subject}</p>
                                <p className="card-text"><small className="text-muted">Created at: {new Date(cardset.createdAt).toLocaleDateString()}</small></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Explore;