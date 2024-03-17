import React, { useState, useEffect } from 'react';
import style from '../styles/flashcard.module.css';
import { EditFlashcard } from './EditFlashcard';
import { RotatingCard } from '../components/Cards/RotatingCard';
import axios from 'axios';

export const Flashcard = ({ cardData, userId, cardsetId }) => {
  const [isFlipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [flashcards, setFlashcards] = useState([]); // State to hold flashcards data

  useEffect(() => {
    setFlipped(false);
    setIndex(0);
    // Set the initial flashcards data
    setFlashcards(cardData);
  }, [cardData]);

  if (flashcards.length === 0) {
    return <div>No Flashcards Yet!</div>;
  }

  const handleChange = (change) => {
    if (index === flashcards.length - 1 && change === 1) {
      setIndex(0);
    } else if (index === 0 && change === -1) {
      setIndex(flashcards.length - 1);
    } else setIndex(index + change);
  };

  const handleEdit = (card) => {
    setIsEditing(true);
    setEditingCard(card);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingCard(null);
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    setEditingCard(null);
    fetchFlashCards();
  };

  const fetchFlashCards = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userId}/cardsets/${cardsetId}/flashcards`);
      const flashcards = response.data.flashcards;
      setFlashcards(flashcards);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  }

  return (
    <div className="container">
      <div class="row mb-5">
        <div className='d-flex justify-content-between mb-3'>
          {isEditing ? null : (
            <div class="align-self-center mx-auto" id={style.Previous}>
              <button className="btn btn-secondary" onClick={() => handleChange(-1)}>Prev</button>
            </div>
          )}

          {isEditing && editingCard ? (
            <EditFlashcard flashcard={editingCard} onEditFlashcard={handleEditComplete} onCancel={handleEditCancel} />
          ) : (
            <RotatingCard flashcards={flashcards} index={index}/>
          )}

          {isEditing ? null : (
            <div class="align-self-center mx-auto" id={style.Next}>
              <button className="btn btn-secondary" onClick={() => handleChange(1)}>Next</button>
            </div>
          )}
        </div>
  
        <div class="d-flex flex-row justify-content-around" id={style.ButtonsSmallScreen}>
          <div class="p-2"><button className="btn btn-secondary" onClick={() => handleChange(-1)}>Previous</button></div>
          <div class="p-2"><button className="btn btn-secondary" onClick={() => handleChange(1)}>Next</button></div>
        </div>

        <div class="d-flex flex-row justify-content-around">
          {!isEditing && (
            <button className="btn btn-outline-dark" onClick={() => handleEdit(flashcards[index])}>Edit</button>
          )}
        </div>

      </div>
    </div>
  );
};
