import React, {useState, useEffect} from 'react';
import style from '../styles/flashcard.module.css';

export const Flashcard = ({cardData}) => {
    const [isFlipped, setFlipped] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setFlipped(false);
        setIndex(0);
    },[cardData]);

    if(cardData.length == 0){
        return <div>No Flashcards Yet!</div>;
    }
    
    const handleChange = (change) => {
      if  (index == cardData.length-1 && change == 1){
        setIndex(0);
      } else if (index == 0 && change == -1){
        setIndex(cardData.length-1);
      }
        else setIndex(index+change);
    }
    
  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col d-flex justify-content-end">
          <button className="btn btn-secondary" onClick={() => handleChange(-1)}>Previous</button>
        </div>
        <div className="col">
          <div className={style.flashcardContainer} onClick={() => setFlipped(!isFlipped)}>
          <div>
              {isFlipped? 
              <div>{cardData[index] ? cardData[index].definition : "Loading"}</div> : 
              <div>Question: {cardData[index] ? cardData[index].term : "Loading" }</div> 
            }
          </div>
          </div>
      </div>
      <div className="col d-flex justify-content-start">
        <button className="btn btn-secondary" onClick={() => handleChange(1)}>Next</button>
      </div>
    </div>
    </div>
  )
}
