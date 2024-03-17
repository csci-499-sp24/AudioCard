import React, {useState, useEffect} from 'react';
import styles from '../../styles/dashboardCard.module.css';

export const DashboardCard = ({ cardset, onClick }) => {
    console.log('cardset ', cardset);
    return (
        <div key={cardset.id} class="col" onClick={onClick}>
            <div class="card h-100">
                <div class="card-body">
                    <h2 class="card-title">{cardset.title}</h2>
                    <div className="mt-3">
                        <span className={styles.cardSubject}>{cardset.subject}</span>
                        </div>
                    <div className="my-4">
                        <span className="card-count">{cardset.flashcardCount} terms</span>
                        </div>
                </div>
                <div class="card-footer d-flex justify-content-end p-3" id={styles.cardFooter}>
                    <a href="#" class="btn btn-outline-dark">Edit</a>
                </div>
            </div>
        </div>
    )
}
