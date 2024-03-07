import React, {useState, useEffect} from 'react';

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
    <div className="flex justify-center items-center h-min">
      <button className="bg-blue-500" onClick={() => handleChange(-1)}>Previous</button>
      <div className="bg-purple-600 flex justify-center items-center h-28 w-52" onClick={() => setFlipped(!isFlipped)}>
          {isFlipped? 
          <div>{cardData[index] ? cardData[index].definition : "Loading"}</div> : 
          <div>Question:{cardData[index] ? cardData[index].term : "Loading" }</div> 
        }
      </div>
      <button className="bg-blue-500" onClick={() => handleChange(1)}>Next</button>
    </div>

  )
}
